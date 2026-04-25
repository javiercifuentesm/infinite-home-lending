import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { useMortgageAgent } from "../components/agent/mortgageAgentContext";
import { AgentV2Modal } from "../components/agent-v2/AgentV2Modal";
import { AgentV2Context, type AgentV2ContextValue } from "./AgentV2Context";
import { appendTranscript, applyStatePatch, createSessionId, initialConversationState, mergeAnswers } from "../lib/agent-v2/agentV2State";
import { updateRequiredSignals } from "../lib/agent-v2/agentV2FlowEngine";
import { buildWelcomeOutput, runMockOrchestrator } from "../lib/agent-v2/agentV2MockOrchestrator";
import { submitLeadPacketV2 } from "../lib/agent-v2/agentV2Actions";
import { inferV1StepIndexFromSeed, v2ToV1Seed } from "../lib/agent-v2/agentV2Fallback";
import { fetchAgentV3Turn, fetchAgentV3Welcome } from "../lib/agent-v3/agentV3ApiClient";
import { mergeSessionPatch } from "../lib/agent-v3/agentV3State";
import { agentV3StateToConversationState, conversationStateToAgentV3 } from "../lib/agent-v3/agentV3V2Bridge";
import type { AgentV3ApiDebug } from "../lib/agent-v3/agentV3Types";
import type { AgentV3SessionState, AgentV3UserTurn } from "../lib/agent-v3/agentV3Types";
import type {
  AgentV2OrchestratorOutput,
  ConversationState,
  OrchestratorAction,
  QuickReplyTarget,
} from "../lib/agent-v2/agentV2Types";

const USE_AGENT_V3 =
  import.meta.env.VITE_AGENT_V3_API === "1" || import.meta.env.VITE_AGENT_V3_API === "true";

/** Merges orchestrator output into session state. */
function applyOrchestratorResult(prev: ConversationState, out: AgentV2OrchestratorOutput): ConversationState {
  let next = appendTranscript(prev, out.assistantMessages);
  if (out.statePatch) {
    next = applyStatePatch(next, out.statePatch);
  }
  if (out.widgetRequest !== undefined) {
    next = { ...next, activeWidget: out.widgetRequest };
  }
  return next;
}

function buildV3Turn(input: {
  userMessage?: string;
  selectedOption?: string;
  quickReplyTarget?: QuickReplyTarget;
  orchestratorAction?: OrchestratorAction;
}): AgentV3UserTurn | null {
  const a = input.orchestratorAction;
  if (a?.type === "edit_recap_field") return { type: "edit_recap_field", field: a.field };
  if (a?.type === "recap_continue") return { type: "recap_continue" };
  if (a?.type === "contact_submit") return { type: "contact_submit", payload: a.payload };
  if (a?.type === "schedule_select") return { type: "schedule_select", slot: a.slot };
  if (input.selectedOption && input.quickReplyTarget) {
    return { type: "quick_reply", option: input.selectedOption, target: input.quickReplyTarget };
  }
  if (input.userMessage?.trim()) return { type: "text", text: input.userMessage.trim() };
  return null;
}

export function AgentV2Provider({ children }: { children: ReactNode }) {
  const v1 = useMortgageAgent();
  const [state, setState] = useState<ConversationState>(initialConversationState);
  const [agentV3Debug, setAgentV3Debug] = useState<AgentV3ApiDebug | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const openAgentV2 = useCallback((opts?: { pageContext?: string }) => {
    const clientTimeZone =
      typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "America/New_York";

    if (USE_AGENT_V3) {
      void (async () => {
        const sessionId = createSessionId();
        try {
          const j = await fetchAgentV3Welcome(sessionId, opts?.pageContext ?? "site");
          setAgentV3Debug(j.debug ?? null);
          const v3 = (j.fullState ?? j.statePatch) as AgentV3SessionState;
          setState(agentV3StateToConversationState(v3, { isOpen: true, clientTimeZone }));
        } catch {
          console.warn("[agent-v3] welcome fetch failed; falling back to local welcome");
          setAgentV3Debug({ mode: "agent_v3_deterministic", fallbackReason: "unknown" });
          setState(() => {
            const base: ConversationState = {
              ...initialConversationState(),
              isOpen: true,
              sessionId,
              pageContext: opts?.pageContext ?? "site",
              clientTimeZone,
            };
            return applyOrchestratorResult(base, buildWelcomeOutput(sessionId));
          });
        }
      })();
      return;
    }

    setState(() => {
      const sessionId = createSessionId();
      const base: ConversationState = {
        ...initialConversationState(),
        isOpen: true,
        sessionId,
        pageContext: opts?.pageContext ?? "site",
        clientTimeZone,
      };
      return applyOrchestratorResult(base, buildWelcomeOutput(sessionId));
    });
  }, []);

  const closeAgentV2 = useCallback(() => {
    setAgentV3Debug(null);
    setState(initialConversationState());
  }, []);

  const dispatch = useCallback(
    (input: {
      userMessage?: string;
      selectedOption?: string;
      quickReplyTarget?: QuickReplyTarget;
      orchestratorAction?: OrchestratorAction;
    }) => {
      if (USE_AGENT_V3) {
        void (async () => {
          const prev = stateRef.current;
          if (!prev.isOpen) return;

          if (input.orchestratorAction?.type === "open_v1_fallback") {
            const seed = v2ToV1Seed(prev.answers);
            queueMicrotask(() => {
              v1.openAgent({
                pageContext: prev.pageContext,
                seedAnswers: seed,
                startStepIndex: inferV1StepIndexFromSeed(seed),
              });
            });
            setState(initialConversationState());
            return;
          }

          if (input.orchestratorAction?.type === "contact_answers_patch") {
            const patch = input.orchestratorAction.payload;
            setState((p) => {
              const v3 = conversationStateToAgentV3(p);
              const answers = mergeAnswers(v3.answers, patch);
              const requiredSignalsCaptured = updateRequiredSignals(answers, v3.requiredSignalsCaptured);
              const merged = mergeSessionPatch(v3, { answers, requiredSignalsCaptured });
              return agentV3StateToConversationState(merged, { isOpen: p.isOpen, clientTimeZone: p.clientTimeZone });
            });
            return;
          }

          const turn = buildV3Turn(input);
          if (!turn) return;

          const v3 = conversationStateToAgentV3(prev);
          try {
            const out = await fetchAgentV3Turn({
              sessionId: prev.sessionId,
              pageContext: prev.pageContext,
              state: v3,
              turn,
              clientTimeZone: prev.clientTimeZone,
            });
            setAgentV3Debug(out.debug ?? null);
            const nextV3 = mergeSessionPatch(v3, out.statePatch ?? {});
            setState(
              agentV3StateToConversationState(nextV3, {
                isOpen: true,
                clientTimeZone: prev.clientTimeZone ?? "America/New_York",
              }),
            );
            if (input.orchestratorAction?.type === "schedule_select") {
              const merged = mergeSessionPatch(v3, out.statePatch ?? {});
              void submitLeadPacketV2(merged.sessionId, merged.pageContext, merged.answers);
            }
          } catch {
            console.warn("[agent-v3] turn fetch failed; UI debug set to deterministic/unknown");
            setAgentV3Debug({ mode: "agent_v3_deterministic", fallbackReason: "unknown" });
            setState((p) => ({
              ...p,
              complianceFlags: [...p.complianceFlags, "api:agent_v3_error"],
            }));
          }
        })();
        return;
      }

      setState((prev) => {
        if (!prev.isOpen) return prev;
        if (input.orchestratorAction?.type === "open_v1_fallback") {
          const seed = v2ToV1Seed(prev.answers);
          queueMicrotask(() => {
            v1.openAgent({
              pageContext: prev.pageContext,
              seedAnswers: seed,
              startStepIndex: inferV1StepIndexFromSeed(seed),
            });
          });
          return initialConversationState();
        }
        const out = runMockOrchestrator({
          state: prev,
          userMessage: input.userMessage,
          selectedOption: input.selectedOption,
          quickReplyTarget: input.quickReplyTarget,
          orchestratorAction: input.orchestratorAction,
        });
        const next = applyOrchestratorResult(prev, out);
        if (input.orchestratorAction?.type === "schedule_select") {
          void submitLeadPacketV2(next.sessionId, next.pageContext, next.answers);
        }
        return next;
      });
    },
    [v1],
  );

  const sendQuickReply = useCallback(
    (option: string, target: QuickReplyTarget) => {
      dispatch({ selectedOption: option, quickReplyTarget: target });
    },
    [dispatch],
  );

  const sendUserMessage = useCallback(
    (text: string) => {
      dispatch({ userMessage: text });
    },
    [dispatch],
  );

  const dispatchOrchestratorAction = useCallback(
    (action: OrchestratorAction) => {
      dispatch({ orchestratorAction: action });
    },
    [dispatch],
  );

  const openV1Fallback = useCallback(() => {
    dispatch({ orchestratorAction: { type: "open_v1_fallback" } });
  }, [dispatch]);

  const value = useMemo(
    (): AgentV2ContextValue => ({
      state,
      agentV3Debug,
      openAgentV2,
      closeAgentV2,
      sendQuickReply,
      sendUserMessage,
      dispatchOrchestratorAction,
      openV1Fallback,
    }),
    [
      state,
      agentV3Debug,
      openAgentV2,
      closeAgentV2,
      sendQuickReply,
      sendUserMessage,
      dispatchOrchestratorAction,
      openV1Fallback,
    ],
  );

  return (
    <AgentV2Context.Provider value={value}>
      {children}
      <AgentV2Modal />
    </AgentV2Context.Provider>
  );
}
