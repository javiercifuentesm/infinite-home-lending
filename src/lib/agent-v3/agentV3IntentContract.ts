/**
 * "Next best action" contract — parsed from LLM output; orchestrator validates and executes tools only.
 */
import type { AgentV3LeadAnswers } from "./agentV3Types";
import type { AgentV3NextBestAction, AgentV3NextAction } from "./agentV3Types";

const NEXT_ACTIONS = new Set<AgentV3NextAction>([
  "ask_question",
  "clarify",
  "reassure",
  "summarize",
  "proceed_to_scheduling",
  "answer_question",
]);

/** Below this, orchestrator falls back to deterministic copy + nk-based widget hint. */
export const AGENT_V3_INTENT_CONFIDENCE_FALLBACK = 0.35;

export function validateIntent(raw: unknown): raw is AgentV3NextBestAction {
  if (!raw || typeof raw !== "object") return false;
  const o = raw as Record<string, unknown>;
  if (typeof o.reasoning !== "string" || !o.reasoning.trim()) return false;
  if (typeof o.nextAction !== "string" || !NEXT_ACTIONS.has(o.nextAction as AgentV3NextAction)) return false;
  if (typeof o.confidence !== "number" || Number.isNaN(o.confidence) || o.confidence < 0 || o.confidence > 1)
    return false;
  if (o.question !== undefined && typeof o.question !== "string") return false;
  if (o.answer !== undefined && typeof o.answer !== "string") return false;
  if (o.suggestQuickReplies !== undefined && typeof o.suggestQuickReplies !== "boolean") return false;
  if (o.signalsExtracted !== undefined) {
    if (typeof o.signalsExtracted !== "object" || o.signalsExtracted === null) return false;
  }
  return true;
}

/** Strip machine intent JSON from assistant-visible text and parse structured intent. */
export function parseTurnIntentFromAssistantText(raw: string): {
  displayText: string;
  intent: AgentV3NextBestAction | null;
} {
  const trimmed = raw.trim();
  const marker = "---TURN_INTENT_JSON---";
  const idx = trimmed.lastIndexOf(marker);
  if (idx !== -1) {
    const jsonPart = trimmed.slice(idx + marker.length).trim();
    const displayText = trimmed.slice(0, idx).trim();
    try {
      const parsed = JSON.parse(jsonPart) as unknown;
      if (validateIntent(parsed)) {
        return { displayText: displayText || "Thanks — I’m with you.", intent: parsed };
      }
    } catch {
      /* fall through */
    }
    return { displayText: displayText || trimmed, intent: null };
  }

  const fence = trimmed.match(/```json\s*([\s\S]*?)```/);
  if (fence) {
    try {
      const parsed = JSON.parse(fence[1].trim()) as unknown;
      if (validateIntent(parsed)) {
        return {
          displayText: trimmed.replace(/```json[\s\S]*?```/, "").trim(),
          intent: parsed,
        };
      }
    } catch {
      /* fall through */
    }
  }

  return { displayText: trimmed, intent: null };
}

const ALLOWED_SIGNAL_KEYS = new Set([
  "goal",
  "timeline",
  "priceRange",
  "propertyValueRange",
  "creditRange",
  "financialComfort",
  "propertyInMind",
  "subjectPropertyAddress",
  "subjectCity",
  "subjectState",
  "subjectZip",
  "contactPreference",
  "firstName",
  "email",
  "phone",
  "preferredContactTime",
  "schedulingTimezoneUsed",
  "appointmentSlot",
]);

/** Sanitize model-proposed signals before merging into session state. */
export function clampSignalsExtracted(raw: unknown): Partial<AgentV3LeadAnswers> {
  if (!raw || typeof raw !== "object") return {};
  const out: Partial<AgentV3LeadAnswers> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!ALLOWED_SIGNAL_KEYS.has(k)) continue;
    if (typeof v === "string" && v.trim()) {
      (out as Record<string, string>)[k] = v.trim();
    }
  }
  return out;
}

export function isIntentConfidentEnough(intent: AgentV3NextBestAction): boolean {
  return intent.confidence >= AGENT_V3_INTENT_CONFIDENCE_FALLBACK;
}
