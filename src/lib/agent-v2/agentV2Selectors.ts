import type { ConversationState, TranscriptItem } from "./agentV2Types";
import { allDiscoverySignalsCaptured } from "./agentV2FlowEngine";

export function selectTranscript(state: ConversationState): TranscriptItem[] {
  return state.transcript;
}

export function selectRecapReady(state: ConversationState): boolean {
  const s = state.requiredSignalsCaptured;
  return allDiscoverySignalsCaptured(s) && !!state.answers.creditRange && !!state.answers.financialComfort;
}

export function selectContactReady(state: ConversationState): boolean {
  return state.stage === "contact_capture" || state.stage === "scheduling";
}

export function selectLastUserMessage(state: ConversationState): string | undefined {
  for (let i = state.transcript.length - 1; i >= 0; i--) {
    const t = state.transcript[i];
    if (t.role === "user" && t.kind === "message") return t.text;
  }
  return undefined;
}
