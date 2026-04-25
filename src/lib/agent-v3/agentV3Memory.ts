/**
 * Session memory is canonical (AgentV3SessionState.answers + concern fields).
 * Durable memory is optional — interface only for future CRM / identity merge.
 */
import type { AgentV3LeadAnswers, AgentV3SessionState } from "./agentV3Types";

export type DurableMemoryHints = {
  /** Optional: prior inquiry timestamp (ISO) */
  priorInquiryAt?: string;
  /** Optional: metro or ZIP focus from last session */
  priorLocationFocus?: string;
  /** Optional: assigned LO id from routing rules */
  priorLoanOfficerId?: string;
  /** Optional: returning visitor flag */
  isReturningVisitor?: boolean;
};

export type MemoryMergeSource = {
  session: AgentV3LeadAnswers;
  durable?: DurableMemoryHints;
};

/** Merge durable hints into prompts only — never overwrite fresh session answers */
export function durableHintsForPrompt(hints?: DurableMemoryHints): string {
  if (!hints) return "";
  const parts: string[] = [];
  if (hints.priorLocationFocus) parts.push(`Prior area of interest (historical): ${hints.priorLocationFocus}.`);
  if (hints.priorInquiryAt) parts.push(`Prior touchpoint (historical): ${hints.priorInquiryAt}.`);
  if (hints.isReturningVisitor) parts.push("Visitor may be returning — acknowledge continuity without assuming details.");
  return parts.join(" ");
}

/** Compact structured hints for the model — no raw implementation dumps.
 * @param nkFallbackHint optional: next missing field key if this were a rigid form — use only as a fallback hint; you decide the conversational next step.
 */
export function buildMemoryHintsForModel(
  state: AgentV3SessionState,
  durable?: DurableMemoryHints,
  nkFallbackHint?: string | null,
): string {
  const a = state.answers;
  const loc =
    a.subjectPropertyAddress?.trim() ||
    [a.subjectCity, a.subjectState, a.subjectZip].filter(Boolean).join(", ") ||
    "";
  const known: string[] = [];
  if (a.goal) known.push(`goal=${a.goal}`);
  if (a.timeline) known.push(`timeline=${a.timeline}`);
  if (a.priceRange || a.propertyValueRange) known.push(`range=${a.priceRange ?? a.propertyValueRange}`);
  if (a.creditRange) known.push(`credit=${a.creditRange}`);
  if (a.financialComfort) known.push(`comfort=${a.financialComfort}`);
  if (loc) known.push(`location=${loc}`);

  const parts: string[] = [
    `Stage: ${state.stage}.`,
    `Dialogue turn: ${state.dialogueTurn}.`,
    `Recap status: ${state.recapStatus}.`,
    `Uncertainty: ${state.uncertaintyLevel}.`,
  ];

  if (known.length) parts.push(`Known signals: ${known.join("; ")}.`);
  if (state.lastUnresolvedAmbiguity) parts.push(`Unresolved ambiguity: ${state.lastUnresolvedAmbiguity}.`);
  if (state.userConcerns.length) {
    parts.push(`Concerns (topics): ${state.userConcerns.slice(-8).join(" | ")}.`);
  }
  if (state.userQuestions.length) {
    parts.push(`Recent questions: ${state.userQuestions.slice(-6).join(" | ")}.`);
  }
  if (state.complianceFlags.length) {
    parts.push(`Compliance notes: ${state.complianceFlags.slice(-10).join(", ")}.`);
  }

  const dh = durableHintsForPrompt(durable);
  if (dh) parts.push(dh);

  parts.push(`Page context: ${state.pageContext}.`);

  if (nkFallbackHint) {
    parts.push(
      `Structured-flow hint (fallback only — do not treat as mandatory order): a rigid form would ask for "${nkFallbackHint}" next. You choose the best next move; handle interruptions and messy answers naturally.`,
    );
  }

  return parts.join("\n");
}
