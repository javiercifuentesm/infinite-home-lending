import { createEmptyRequiredSignals } from "../agent-v2/agentV2State";
import type { AgentV3SessionState, TranscriptItem, WidgetKind, WidgetRequest } from "./agentV3Types";

function newId(): string {
  return `v3_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function makeMessage(
  role: "user" | "assistant",
  text: string,
  meta?: { source?: "guardrail" | "tool" | "brain"; toolName?: string },
): TranscriptItem {
  return {
    id: newId(),
    role,
    kind: "message",
    text,
    timestamp: nowIso(),
    ...(meta ? { meta } : {}),
  } as TranscriptItem;
}

export function makeWidgetItem(widgetType: WidgetKind, data?: unknown): TranscriptItem {
  return {
    id: newId(),
    role: "assistant",
    kind: "widget",
    widgetType,
    data,
    timestamp: nowIso(),
  };
}

export function initialAgentV3Session(sessionId: string, pageContext: string): AgentV3SessionState {
  return {
    sessionId,
    pageContext,
    stage: "greeting",
    transcript: [],
    answers: {},
    requiredSignalsCaptured: createEmptyRequiredSignals(),
    uncertaintyLevel: "unknown",
    userConcerns: [],
    userQuestions: [],
    recapStatus: "none",
    lowConfidenceStreak: 0,
    complianceFlags: [],
    dialogueTurn: 0,
    activeWidget: null,
    lastUnresolvedAmbiguity: null,
    pendingToolResume: null,
  };
}

export function appendTranscript(state: AgentV3SessionState, items: TranscriptItem[]): AgentV3SessionState {
  return { ...state, transcript: [...state.transcript, ...items] };
}

export function mergeSessionPatch(
  base: AgentV3SessionState,
  patch: Partial<AgentV3SessionState>,
): AgentV3SessionState {
  return {
    ...base,
    ...patch,
    answers: { ...base.answers, ...patch.answers },
    requiredSignalsCaptured: patch.requiredSignalsCaptured ?? base.requiredSignalsCaptured,
    userConcerns: patch.userConcerns ?? base.userConcerns,
    userQuestions: patch.userQuestions ?? base.userQuestions,
    complianceFlags: patch.complianceFlags ?? base.complianceFlags,
    transcript: patch.transcript ?? base.transcript,
  };
}

export function setActiveWidget(state: AgentV3SessionState, w: WidgetRequest | null): AgentV3SessionState {
  return { ...state, activeWidget: w };
}
