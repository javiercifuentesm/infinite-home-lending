/**
 * Hard guardrails — mortgage intake, compliance, UX.
 * All model output should be filtered through these rules on the server.
 */
import { makeMessage } from "./agentV3State";

export type GuardrailKind =
  | "rate_quote"
  | "approval_promise"
  | "underwriting_advice"
  | "sensitive_pii"
  | "off_topic"
  | "fallback_request"
  | "prompt_injection"
  | "none";

const SENSITIVE_PATTERNS =
  /\b(ssn|social security|full\s*ssn|date of birth|dob\b|tax\s*return|upload\s+(a\s+)?document|bank\s*statement|photo\s*id)\b/i;

const PROMPT_INJECTION =
  /\b(ignore (all )?(previous|prior) instructions|disregard (the )?system prompt|you are now|developer mode|jailbreak|repeat (your|the) (system|hidden))\b/i;

const RATE_QUOTE =
  /\b(what('?s| is)\s+(my|the|your)\s+(rate|apr)|exact\s+rate|quote\s+me\s+(a\s+)?rate|lock\s+(a\s+)?rate|today'?s\s+rate)\b/i;

const APPROVAL_PROMISE = /\b(am i approved|guaranteed approval|will i qualify|pre-?approved yet|definitely qualify)\b/i;

const UW_COMPLEX =
  /\b(dti|debt[- ]to[- ]income|reserves|manual underwriting|automated underwriting|aus)\b/i;

export function classifyGuardrail(userText: string): GuardrailKind {
  const t = userText.trim();
  if (PROMPT_INJECTION.test(t)) return "prompt_injection";
  if (
    /\b(simpler|guided|structured|traditional)\b/i.test(t) &&
    /\b(form|flow|format|step\s*by\s*step|guided)\b/i.test(t)
  )
    return "fallback_request";
  if (SENSITIVE_PATTERNS.test(t)) return "sensitive_pii";
  if (RATE_QUOTE.test(t)) return "rate_quote";
  if (APPROVAL_PROMISE.test(t)) return "approval_promise";
  if (UW_COMPLEX.test(t)) return "underwriting_advice";
  return "none";
}

export function buildGuardrailReply(kind: GuardrailKind): string {
  switch (kind) {
    case "rate_quote":
      return "I can’t quote an exact rate or APR in this chat — those depend on the full file, market, and timing. What I can do is capture your goals and get you to a licensed loan officer with the right context.";
    case "approval_promise":
      return "I can’t tell you if you’re approved here — that takes a licensed review of your full application. If you share what you’re trying to do and your rough timeline, we can line up the right next conversation.";
    case "underwriting_advice":
      return "That’s getting into underwriting specifics I can’t judge in chat. A loan officer can review your full picture and explain what applies to you.";
    case "sensitive_pii":
      return "I’m not able to collect sensitive items like SSN or full DOB here. We’ll keep this to high-level context and route you securely to a licensed advisor for anything sensitive.";
    case "fallback_request":
      return "If you’d rather keep this simple, I can switch to a more structured guided format — same end goal, just less back-and-forth.";
    case "prompt_injection":
      return "I’m here to help with your mortgage goals and next steps. Tell me in a sentence what you’re trying to do (buy, refinance, or explore).";
    case "off_topic":
      return "I’m focused on your mortgage goals and next steps here. If there’s something home-financing related you want to cover, tell me in a sentence or two.";
    default:
      return "";
  }
}

/** Prepend guardrail reply and optionally continue discovery — returns extra assistant messages */
export function applyGuardrailToOutput(
  kind: GuardrailKind,
  complianceFlags: string[],
): { messages: ReturnType<typeof makeMessage>[]; flags: string[] } {
  if (kind === "none") return { messages: [], flags: complianceFlags };
  const text = buildGuardrailReply(kind);
  if (!text) return { messages: [], flags: complianceFlags };
  const flags = [...complianceFlags, `guardrail:${kind}`];
  return {
    messages: [makeMessage("assistant", text, { source: "guardrail" })],
    flags,
  };
}

export function guardrailBlocksToolUse(kind: GuardrailKind): boolean {
  return kind === "sensitive_pii" || kind === "prompt_injection";
}

/** Post-model: block unsafe assistant claims before they reach the UI. */
export function classifyAssistantGuardrail(assistantText: string): GuardrailKind {
  const t = assistantText.trim();
  if (RATE_QUOTE.test(t) && /\b(your rate is|I can (lock|quote)|APR is)\b/i.test(t)) return "rate_quote";
  if (/\b(you are (pre-)?approved|guaranteed (to )?qualify)\b/i.test(t)) return "approval_promise";
  if (UW_COMPLEX.test(t) && /\b(you should|you need to|your DTI is)\b/i.test(t)) return "underwriting_advice";
  return "none";
}

export function sanitizeAssistantForUi(
  text: string,
  kind: GuardrailKind,
  complianceFlags: string[],
): { text: string; flags: string[] } {
  if (kind === "none") return { text, flags: complianceFlags };
  const safe = buildGuardrailReply(kind);
  const flags = [...complianceFlags, `assistant_guardrail:${kind}`];
  return { text: safe || text, flags };
}

export type GuardrailResult = {
  kind: GuardrailKind;
};
