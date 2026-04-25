/**
 * Lightweight, state-aware input classification — routing only; extraction via interpretUserMessage.
 */
import type { AgentV2Answers } from "./agentV2Types";
import { containsSensitiveRequest, isRateOrApprovalQuestion } from "./agentV2Guards";
import { interpretUserMessage, type InterpretationResult } from "./agentV2Interpretation";

export type InputCategory =
  | "goal_answer"
  | "timeline_answer"
  | "price_answer"
  | "credit_answer"
  | "financial_comfort_answer"
  | "contact_preference_answer"
  | "safe_mortgage_question"
  | "off_topic"
  | "fallback_request"
  | "ambiguous";

export type ClassificationResult = {
  category: InputCategory;
  /** High/medium-confidence extractions only (from interpretation layer) */
  extractions: Partial<AgentV2Answers>;
};

const FALLBACK_PATTERNS = /simpler|guided format|not chat|skip|use the form|straightforward form|just the form|traditional form/i;

/**
 * Committed structured answers from free-text (interpretation layer — respects confidence).
 */
export function extractSignalsFromText(text: string, answers: AgentV2Answers): Partial<AgentV2Answers> {
  return interpretUserMessage(text, answers).committed;
}

function categoryFromExtractions(extractions: Partial<AgentV2Answers>): InputCategory | null {
  const keys = Object.keys(extractions);
  if (keys.length >= 2) return "goal_answer";
  if (extractions.goal) return "goal_answer";
  if (extractions.timeline) return "timeline_answer";
  if (extractions.priceRange || extractions.propertyValueRange) return "price_answer";
  if (extractions.creditRange) return "credit_answer";
  if (extractions.financialComfort) return "financial_comfort_answer";
  if (extractions.contactPreference) return "contact_preference_answer";
  return null;
}

export function classifyUserInput(
  text: string,
  answers: AgentV2Answers,
  interpreted?: InterpretationResult,
): ClassificationResult {
  const t = text.toLowerCase().trim();
  const interp = interpreted ?? interpretUserMessage(text, answers);
  const extractions = interp.committed;

  if (FALLBACK_PATTERNS.test(text)) {
    return { category: "fallback_request", extractions: {} };
  }
  if (containsSensitiveRequest(t)) {
    return { category: "off_topic", extractions: {} };
  }
  if (isRateOrApprovalQuestion(t)) {
    return { category: "safe_mortgage_question", extractions: {} };
  }

  const fromExt = categoryFromExtractions(extractions);
  if (fromExt) {
    return { category: fromExt, extractions };
  }

  if (/\b(buy|purchase|refinance|refi|explore options)\b/i.test(t)) {
    return { category: "goal_answer", extractions };
  }
  if (
    /\b(month|soon|exploring|asap|timeline|when|later this year|next year|ways out|not right away)\b/i.test(t) ||
    /\b(around|about|probably|maybe)\s+\d{1,2}\s*months?\b/i.test(t) ||
    /\b(around|about)\s+(six|one|two|three|four|five)\s+months?\b/i.test(t) ||
    /\b(around|about|in)\s+(?:a\s+)?year\b/i.test(t) ||
    /\b10\s*(?:to|-|–)\s*12\s+months\b/i.test(t) ||
    /\bcloser\s+to\s+(?:a\s+)?year\b/i.test(t)
  ) {
    return { category: "timeline_answer", extractions: {} };
  }
  if (/\$\d|[0-9]{3}k|price|budget|range|value\b/i.test(t)) {
    return { category: "price_answer", extractions: {} };
  }
  if (/\b(credit|score|fico)\b/i.test(t)) {
    return { category: "credit_answer", extractions: {} };
  }
  if (/\b(call|text|email)\b/i.test(t)) {
    return { category: "contact_preference_answer", extractions: {} };
  }
  if (/\b(comfort|ready|nervous|prepared)\b/i.test(t)) {
    return { category: "financial_comfort_answer", extractions: {} };
  }

  if (t.length < 220 && /how|what|can i|should i|is it possible|worried|not sure|if i|what if/i.test(t)) {
    return { category: "safe_mortgage_question", extractions: {} };
  }

  if (t.length < 18 && /^(ok|yes|no|maybe|uh|hmm|idk|dunno)$/i.test(t)) {
    return { category: "ambiguous", extractions: {} };
  }
  if (/\bnot sure yet|i don't know|unsure|tbd\b/i.test(t)) {
    return { category: "ambiguous", extractions: {} };
  }

  if (t.length < 40) return { category: "ambiguous", extractions: {} };

  return { category: "ambiguous", extractions: {} };
}
