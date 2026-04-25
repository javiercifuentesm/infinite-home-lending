/**
 * Server-only OpenAI client for Agent V3 (Responses API).
 * Do not import from browser code paths.
 */
import OpenAI from "openai";

const DEFAULT_MODEL = "gpt-4o";
const DEFAULT_TIMEOUT_MS = 60_000;

export type AgentV3OpenAIConfig = {
  apiKey: string;
  model: string;
  useConversationState: boolean;
  debug: boolean;
  timeoutMs: number;
};

function envBool(name: string, fallback: boolean): boolean {
  const v = process.env[name];
  if (v === undefined || v === "") return fallback;
  return v === "1" || v.toLowerCase() === "true";
}

export function getAgentV3OpenAIConfig(): AgentV3OpenAIConfig {
  const apiKey = process.env.OPENAI_API_KEY ?? "";
  if (!apiKey.trim()) {
    throw new Error(
      "OPENAI_API_KEY is required for Agent V3 OpenAI mode. Set it in the server environment (never in the browser).",
    );
  }
  return {
    apiKey: apiKey.trim(),
    model: process.env.OPENAI_AGENT_V3_MODEL?.trim() || DEFAULT_MODEL,
    useConversationState: envBool("OPENAI_AGENT_V3_USE_CONVERSATION_STATE", false),
    debug: envBool("OPENAI_AGENT_V3_DEBUG", false),
    timeoutMs: Number(process.env.OPENAI_AGENT_V3_TIMEOUT_MS ?? DEFAULT_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS,
  };
}

/** Returns null if OPENAI_API_KEY is missing — callers may fall back to deterministic orchestration. */
export function tryGetAgentV3OpenAIConfig(): AgentV3OpenAIConfig | null {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;
  return {
    apiKey,
    model: process.env.OPENAI_AGENT_V3_MODEL?.trim() || DEFAULT_MODEL,
    useConversationState: envBool("OPENAI_AGENT_V3_USE_CONVERSATION_STATE", false),
    debug: envBool("OPENAI_AGENT_V3_DEBUG", false),
    timeoutMs: Number(process.env.OPENAI_AGENT_V3_TIMEOUT_MS ?? DEFAULT_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS,
  };
}

/** Health snapshot — never exposes the API key. */
export function getAgentV3HealthSnapshot(): {
  openaiConfigured: boolean;
  apiKeyPresent: boolean;
  model: string | null;
  conversationStateEnabled: boolean;
  forcedDeterministic: boolean;
} {
  const apiKeyPresent = !!process.env.OPENAI_API_KEY?.trim();
  const cfg = tryGetAgentV3OpenAIConfig();
  const forcedDeterministic =
    process.env.AGENT_V3_FORCE_DETERMINISTIC === "1" || process.env.AGENT_V3_FORCE_DETERMINISTIC === "true";
  return {
    openaiConfigured: !!cfg,
    apiKeyPresent,
    model: cfg?.model ?? null,
    conversationStateEnabled: cfg?.useConversationState ?? false,
    forcedDeterministic,
  };
}

export function createAgentV3OpenAIClient(config: AgentV3OpenAIConfig): OpenAI {
  return new OpenAI({
    apiKey: config.apiKey,
    timeout: config.timeoutMs,
    maxRetries: 1,
  });
}

export function agentV3DebugLog(config: AgentV3OpenAIConfig, label: string, payload: Record<string, unknown>): void {
  if (!config.debug) return;
  const safe = { ...payload };
  if (typeof safe["userPreview"] === "string") {
    safe["userPreview"] = `${String(safe["userPreview"]).slice(0, 200)}…`;
  }
  console.info(`[agent-v3] ${label}`, safe);
}
