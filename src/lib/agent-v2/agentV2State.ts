import type {
  AgentV2Answers,
  ConversationState,
  RequiredSignalsCaptured,
  TranscriptItem,
  WidgetKind,
} from "./agentV2Types";
import { updateRequiredSignals } from "./agentV2FlowEngine";

function newId(): string {
  return `v2_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export function createSessionId(): string {
  const uuid =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `sess_${uuid}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function createEmptyRequiredSignals(): RequiredSignalsCaptured {
  return {
    goal: false,
    timeline: false,
    range: false,
    contactMethod: false,
    contactInfo: false,
  };
}

export function initialConversationState(): ConversationState {
  return {
    isOpen: false,
    sessionId: "",
    pageContext: "site",
    stage: "welcome",
    transcript: [],
    answers: {},
    readiness: "unknown",
    openQuestions: [],
    requiredSignalsCaptured: createEmptyRequiredSignals(),
    activeWidget: null,
    activeAction: null,
    isTyping: false,
    hasFreeformQuestion: false,
    complianceFlags: [],
    ambiguousStreak: 0,
    offTopicStreak: 0,
    dialogueTurnCount: 0,
    phraseUsageIds: [],
    inferredPersona: "neutral",
    pendingComposite: null,
    clientTimeZone: undefined,
  };
}

export function mergeAnswers(base: AgentV2Answers, patch: Partial<AgentV2Answers>): AgentV2Answers {
  return { ...base, ...patch };
}

export function applyStatePatch(
  state: ConversationState,
  patch: Partial<ConversationState> | undefined,
): ConversationState {
  if (!patch) return state;
  const nextAnswers = patch.answers ? mergeAnswers(state.answers, patch.answers) : state.answers;
  const next = {
    ...state,
    ...patch,
    answers: nextAnswers,
  };
  next.requiredSignalsCaptured = updateRequiredSignals(next.answers, next.requiredSignalsCaptured);
  return next;
}

export function appendTranscript(state: ConversationState, items: TranscriptItem[]): ConversationState {
  return { ...state, transcript: [...state.transcript, ...items] };
}

export function makeAssistantMessage(text: string): TranscriptItem {
  return {
    id: newId(),
    role: "assistant",
    kind: "message",
    text,
    timestamp: nowIso(),
  };
}

export function makeUserMessage(text: string): TranscriptItem {
  return {
    id: newId(),
    role: "user",
    kind: "message",
    text,
    timestamp: nowIso(),
  };
}

export function makeWidgetItem(widgetType: WidgetKind, data?: unknown): Extract<TranscriptItem, { kind: "widget" }> {
  return {
    id: newId(),
    role: "assistant",
    kind: "widget",
    widgetType,
    data,
    timestamp: nowIso(),
  };
}

export { newId };
