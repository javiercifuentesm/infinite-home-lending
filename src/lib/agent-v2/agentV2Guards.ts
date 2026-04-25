/**
 * Compliance guardrails — no rates, no approval promises, no UW certainty.
 * Future: extend with policy engine / OpenAI tool filters.
 */

export const COMPLIANCE_REFUSAL_PHRASES = [
  "ssn",
  "social security",
  "date of birth",
  "dob",
  "tax return",
  "upload document",
  "bank statement",
] as const;

export function containsSensitiveRequest(text: string): boolean {
  const t = text.toLowerCase();
  return COMPLIANCE_REFUSAL_PHRASES.some((p) => t.includes(p));
}

export function isRateOrApprovalQuestion(text: string): boolean {
  const t = text.toLowerCase();
  return (
    /\b(rate|apr|interest)\b/.test(t) && /\b(quote|lock|guarantee)\b/.test(t) ||
    /\b(pre[- ]?approved|guaranteed approval|definitely qualify)\b/.test(t)
  );
}

export type GuardResult =
  | { allow: true; mode: "brief_answer" | "defer_to_advisor" | "redirect_discovery" }
  | { allow: false; reason: string };

export function guardAssistantReply(topic: "rates" | "approval" | "sensitive" | "general"): GuardResult {
  if (topic === "rates" || topic === "approval") {
    return {
      allow: true,
      mode: "defer_to_advisor",
    };
  }
  if (topic === "sensitive") {
    return { allow: false, reason: "sensitive_data" };
  }
  return { allow: true, mode: "brief_answer" };
}
