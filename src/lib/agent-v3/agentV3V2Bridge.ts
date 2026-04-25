/**
 * Maps Agent V3 session state to Agent V2 conversation state for the existing shell (no UI redesign).
 */
import type { ConversationState, ConversationStage, TranscriptItem as V2TranscriptItem } from "../agent-v2/agentV2Types";
import type { AgentV3SessionState, TranscriptItem as V3TranscriptItem } from "./agentV3Types";

function v3StageToV2(s: AgentV3SessionState["stage"]): ConversationStage {
  switch (s) {
    case "greeting":
      return "welcome";
    case "summary_ready":
      return "summary";
    case "fallback_guided":
      return "fallback_v1";
    case "discovery":
    case "clarification":
      return "discovery";
    case "contact_capture":
      return "contact_capture";
    case "scheduling":
      return "scheduling";
    case "confirmation":
    case "completed":
      return "confirmation";
    default:
      return "discovery";
  }
}

function v2StageToV3(s: ConversationStage): AgentV3SessionState["stage"] {
  switch (s) {
    case "welcome":
      return "greeting";
    case "summary":
      return "summary_ready";
    case "fallback_v1":
      return "fallback_guided";
    case "discovery":
    case "clarification":
      return "discovery";
    case "contact_capture":
      return "contact_capture";
    case "scheduling":
      return "scheduling";
    case "confirmation":
      return "confirmation";
    default:
      return "discovery";
  }
}

function stripMetaForV2(items: V3TranscriptItem[]): V2TranscriptItem[] {
  return items.map((item) => {
    if (item.kind === "message") {
      return {
        id: item.id,
        role: item.role,
        kind: "message",
        text: item.text,
        timestamp: item.timestamp,
      };
    }
    return {
      id: item.id,
      role: "assistant",
      kind: "widget",
      widgetType: item.widgetType,
      data: item.data,
      timestamp: item.timestamp,
    };
  });
}

export function agentV3StateToConversationState(
  v3: AgentV3SessionState,
  base: Pick<ConversationState, "isOpen" | "clientTimeZone">,
): ConversationState {
  return {
    isOpen: base.isOpen,
    sessionId: v3.sessionId,
    pageContext: v3.pageContext,
    stage: v3StageToV2(v3.stage),
    transcript: stripMetaForV2(v3.transcript),
    answers: { ...v3.answers },
    readiness: "unknown",
    openQuestions: [...v3.userQuestions],
    requiredSignalsCaptured: { ...v3.requiredSignalsCaptured },
    activeWidget: v3.activeWidget,
    activeAction: null,
    isTyping: false,
    hasFreeformQuestion: false,
    complianceFlags: [...v3.complianceFlags],
    clientTimeZone: base.clientTimeZone,
    dialogueTurnCount: v3.dialogueTurn,
  };
}

export function conversationStateToAgentV3(cs: ConversationState): AgentV3SessionState {
  return {
    sessionId: cs.sessionId,
    pageContext: cs.pageContext,
    stage: v2StageToV3(cs.stage),
    transcript: cs.transcript as unknown as V3TranscriptItem[],
    answers: { ...cs.answers },
    requiredSignalsCaptured: { ...cs.requiredSignalsCaptured },
    uncertaintyLevel: "unknown",
    userConcerns: [],
    userQuestions: [...cs.openQuestions],
    recapStatus: cs.stage === "summary" ? "shown" : "none",
    lastInterpreted: undefined,
    lastUnresolvedAmbiguity: null,
    lowConfidenceStreak: cs.ambiguousStreak ?? 0,
    complianceFlags: [...cs.complianceFlags],
    dialogueTurn: cs.dialogueTurnCount ?? 0,
    activeWidget: cs.activeWidget,
    pendingToolResume: null,
    openaiLastResponseId: null,
  };
}
