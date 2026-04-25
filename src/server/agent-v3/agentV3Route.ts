/**
 * Express routes for Agent V3 — server-only (OpenAI key stays here).
 */
import { Router, type Request, type Response } from "express";
import {
  createAgentV3OpenAIClient,
  getAgentV3HealthSnapshot,
  tryGetAgentV3OpenAIConfig,
} from "../../lib/agent-v3/agentV3OpenAIClient";
import { OpenAIAgentV3BrainAdapter } from "../../lib/agent-v3/agentV3BrainAdapterOpenAI";
import { shouldAttachAgentV3DebugResponses } from "../../lib/agent-v3/agentV3Instrumentation";
import type { AgentV3ApiDebug, AgentV3DebugFallbackReason } from "../../lib/agent-v3/agentV3Types";
import { runAgentV3Turn, runAgentV3Welcome } from "../../lib/agent-v3/agentV3Orchestrator";
import type {
  AgentV3OrchestratorInput,
  AgentV3OrchestratorOutput,
  AgentV3SessionState,
  AgentV3UserTurn,
} from "../../lib/agent-v3/agentV3Types";

type ModeOverride = "live" | "deterministic" | null;

function getModeOverride(req: Request): ModeOverride {
  if (process.env.AGENT_V3_FORCE_DETERMINISTIC === "1" || process.env.AGENT_V3_FORCE_DETERMINISTIC === "true") {
    return "deterministic";
  }
  const h = String(req.headers["x-agent-v3-mode"] ?? "").toLowerCase();
  if (h === "live") return "live";
  if (h === "deterministic") return "deterministic";
  const b = (req.body as { agentModeOverride?: string } | undefined)?.agentModeOverride;
  if (b === "live" || b === "deterministic") return b;
  return null;
}

function getClientV3Header(req: Request): string {
  return String(req.headers["x-agent-v3-client"] ?? "").trim();
}

function computeTurnFallbackReason(opts: {
  cfg: ReturnType<typeof tryGetAgentV3OpenAIConfig> | null;
  forcedDeterministic: boolean;
  wantLive: boolean;
  clientApiDisabled: boolean;
}): AgentV3DebugFallbackReason {
  if (opts.forcedDeterministic) return "forced_deterministic";
  if (opts.clientApiDisabled) return "api_mode_disabled";
  if (!opts.cfg) return "missing_openai_key";
  if (!opts.wantLive) return "unknown";
  return "unknown";
}

function finalizeDebug(
  out: AgentV3OrchestratorOutput,
  opts: {
    attach: boolean;
    forcedDeterministic: boolean;
    usedLiveBrain: boolean;
    chainConversation: boolean;
    fallbackReason?: AgentV3DebugFallbackReason;
  },
): AgentV3OrchestratorOutput & { debug?: AgentV3ApiDebug } {
  if (!opts.attach || !out.debug) {
    return out;
  }
  const d = out.debug;
  let mode: AgentV3ApiDebug["mode"] = d.mode;
  if (opts.forcedDeterministic) {
    mode = "agent_v3_deterministic";
  } else if (!opts.usedLiveBrain && mode === "agent_v3_live_llm") {
    mode = "agent_v3_deterministic";
  }
  const isDeterministic = mode === "agent_v3_deterministic";
  const full: AgentV3ApiDebug = {
    mode,
    modelUsed: d.modelUsed,
    responseId: d.responseId,
    toolCallsExecuted: d.toolCallsExecuted,
    guardrailFlags: d.guardrailFlags,
    usedConversationState: d.usedConversationState ?? (opts.usedLiveBrain ? opts.chainConversation : false),
    ...(isDeterministic && opts.fallbackReason ? { fallbackReason: opts.fallbackReason } : {}),
  };
  return { ...out, debug: full };
}

function resolvedModeLabel(debug: AgentV3ApiDebug | undefined): "live_llm" | "deterministic" {
  return debug?.mode === "agent_v3_live_llm" ? "live_llm" : "deterministic";
}

function logTurnResolution(
  route: string,
  resolved: "live_llm" | "deterministic",
  extras: {
    apiKeyPresent: boolean;
    forcedDeterministic: boolean;
    model: string | null;
    modeOverride: ModeOverride;
    clientV3: string;
    openaiConfigured: boolean;
  },
): void {
  console.info(
    `[agent-v3] resolvedMode=${resolved} apiKeyPresent=${extras.apiKeyPresent} forcedDeterministic=${extras.forcedDeterministic} model=${extras.model ?? "(none)"} modeOverride=${extras.modeOverride ?? "null"} clientV3=${extras.clientV3 || "none"} openaiConfigured=${extras.openaiConfigured} route=${route}`,
  );
}

export function createAgentV3Router(): Router {
  const router = Router();

  router.post("/welcome", (req: Request, res: Response) => {
    try {
      const attach = shouldAttachAgentV3DebugResponses();
      const clientV3 = getClientV3Header(req);
      console.info(`[agent-v3] welcome | route_hit=/api/agent-v3/welcome debug=${attach} clientV3=${clientV3 || "none"}`);
      const sessionId = String(req.body?.sessionId ?? `v3_${Date.now()}`);
      const pageContext = String(req.body?.pageContext ?? "site");
      const out = runAgentV3Welcome(sessionId, pageContext, { includeDebugMetadata: attach });
      const withDbg = finalizeDebug(out, {
        attach,
        forcedDeterministic: true,
        usedLiveBrain: false,
        chainConversation: false,
      });
      if (attach && withDbg.debug) {
        logTurnResolution("welcome", resolvedModeLabel(withDbg.debug), {
          apiKeyPresent: !!process.env.OPENAI_API_KEY?.trim(),
          forcedDeterministic: true,
          model: tryGetAgentV3OpenAIConfig()?.model ?? null,
          modeOverride: getModeOverride(req),
          clientV3,
          openaiConfigured: !!tryGetAgentV3OpenAIConfig(),
        });
      }
      const welcomePayload: Record<string, unknown> = {
        assistantMessages: withDbg.assistantMessages,
        statePatch: withDbg.statePatch,
        widgetRequest: withDbg.widgetRequest,
        fullState: withDbg.statePatch,
      };
      if (attach && withDbg.debug) welcomePayload.debug = withDbg.debug;
      res.json(welcomePayload);
    } catch (e) {
      res.status(500).json({ error: e instanceof Error ? e.message : "welcome_failed" });
    }
  });

  router.post("/turn", async (req: Request, res: Response) => {
    const attach = shouldAttachAgentV3DebugResponses();
    try {
      const body = req.body as Partial<AgentV3OrchestratorInput> & {
        turn: AgentV3UserTurn;
        agentModeOverride?: ModeOverride;
      };
      if (!body.state || !body.turn) {
        res.status(400).json({ error: "state and turn required" });
        return;
      }
      const input: AgentV3OrchestratorInput = {
        sessionId: body.sessionId ?? (body.state as AgentV3SessionState).sessionId,
        pageContext: body.pageContext ?? (body.state as AgentV3SessionState).pageContext,
        state: body.state as AgentV3SessionState,
        turn: body.turn,
        clientTimeZone: body.clientTimeZone,
      };

      const cfg = tryGetAgentV3OpenAIConfig();
      const modeOverride = getModeOverride(req);
      const clientV3 = getClientV3Header(req);
      const clientApiDisabled = clientV3 === "0";
      const forcedDeterministic = modeOverride === "deterministic";
      const wantLive = modeOverride === "live" || (modeOverride !== "deterministic" && !!cfg);
      const useBrain = !!(cfg && wantLive && !forcedDeterministic && !clientApiDisabled);

      const apiKeyPresent = !!process.env.OPENAI_API_KEY?.trim();
      const forcedEnv =
        process.env.AGENT_V3_FORCE_DETERMINISTIC === "1" || process.env.AGENT_V3_FORCE_DETERMINISTIC === "true";

      console.info(
        `[agent-v3] turn | route_hit=/api/agent-v3/turn session=${input.sessionId} useBrain=${useBrain} modeOverride=${modeOverride ?? "null"} clientV3=${clientV3 || "none"} openaiConfigured=${!!cfg} forcedEnv=${forcedEnv}`,
      );

      const fallbackReasonBase = computeTurnFallbackReason({
        cfg,
        forcedDeterministic,
        wantLive,
        clientApiDisabled,
      });

      if (useBrain && cfg) {
        try {
          const client = createAgentV3OpenAIClient(cfg);
          const brain = new OpenAIAgentV3BrainAdapter(client, cfg);
          const out = await runAgentV3Turn(input, {
            brain,
            useLlm: true,
            chainConversation: cfg.useConversationState,
            includeDebugMetadata: attach,
          });
          const withDbg = finalizeDebug(out, {
            attach,
            forcedDeterministic: false,
            usedLiveBrain: true,
            chainConversation: cfg.useConversationState,
          });
          if (attach && withDbg.debug) {
            logTurnResolution("turn", resolvedModeLabel(withDbg.debug), {
              apiKeyPresent,
              forcedDeterministic: false,
              model: withDbg.debug.modelUsed ?? cfg.model,
              modeOverride,
              clientV3,
              openaiConfigured: true,
            });
          }
          const turnPayload: Record<string, unknown> = { ...withDbg };
          if (!attach) delete turnPayload.debug;
          res.json(turnPayload);
          return;
        } catch (e) {
          console.error("[agent-v3] brain_path_failed", e instanceof Error ? e.message : e);
          const out = await runAgentV3Turn(input, { includeDebugMetadata: attach });
          const withDbg = finalizeDebug(out, {
            attach,
            forcedDeterministic: true,
            usedLiveBrain: false,
            chainConversation: false,
            fallbackReason: "brain_init_failed",
          });
          if (attach && withDbg.debug) {
            logTurnResolution("turn", resolvedModeLabel(withDbg.debug), {
              apiKeyPresent,
              forcedDeterministic: true,
              model: cfg?.model ?? null,
              modeOverride,
              clientV3,
              openaiConfigured: !!cfg,
            });
          }
          const turnPayload: Record<string, unknown> = { ...withDbg };
          if (!attach) delete turnPayload.debug;
          res.json(turnPayload);
          return;
        }
      }

      const out = await runAgentV3Turn(input, { includeDebugMetadata: attach });
      const withDbg = finalizeDebug(out, {
        attach,
        forcedDeterministic: true,
        usedLiveBrain: false,
        chainConversation: false,
        fallbackReason: fallbackReasonBase,
      });
      if (attach && withDbg.debug) {
        logTurnResolution("turn", resolvedModeLabel(withDbg.debug), {
          apiKeyPresent,
          forcedDeterministic: forcedDeterministic || forcedEnv,
          model: withDbg.debug.modelUsed ?? cfg?.model ?? null,
          modeOverride,
          clientV3,
          openaiConfigured: !!cfg,
        });
      }
      const turnPayload2: Record<string, unknown> = { ...withDbg };
      if (!attach) delete turnPayload2.debug;
      res.json(turnPayload2);
    } catch (e) {
      console.error("[agent-v3] turn_error", e instanceof Error ? e.message : e);
      res.status(500).json({ error: e instanceof Error ? e.message : "turn_failed" });
    }
  });

  router.get("/health", (_req: Request, res: Response) => {
    const snap = getAgentV3HealthSnapshot();
    const rawPort = process.env.AGENT_V3_SERVER_PORT;
    const serverPort =
      rawPort === undefined || rawPort === ""
        ? null
        : Number.isNaN(Number(rawPort))
          ? rawPort
          : Number(rawPort);
    res.json({
      ok: true,
      openaiConfigured: snap.openaiConfigured,
      apiKeyPresent: snap.apiKeyPresent,
      model: snap.model,
      conversationStateEnabled: snap.conversationStateEnabled,
      forcedDeterministic: snap.forcedDeterministic,
      serverPort,
    });
  });

  return router;
}
