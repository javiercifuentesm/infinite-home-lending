import type { AgentV2Answers, Readiness, RequiredSignalsCaptured } from "./agentV2Types";
import { locationMissingKey } from "./agentV2Location";

export function updateRequiredSignals(
  answers: AgentV2Answers,
  prev: RequiredSignalsCaptured,
): RequiredSignalsCaptured {
  const hasRange = !!(answers.priceRange || answers.propertyValueRange);
  return {
    goal: !!(answers.goal && answers.goal.length > 0),
    timeline: !!(answers.timeline && answers.timeline.length > 0),
    range: hasRange,
    contactMethod: !!(answers.contactPreference && answers.contactPreference.length > 0),
    contactInfo: !!(
      answers.firstName?.trim() &&
      answers.email?.trim() &&
      (answers.contactPreference === "Email" || (answers.phone && answers.phone.replace(/\D/g, "").length >= 10))
    ),
  };
}

export function allDiscoverySignalsCaptured(s: RequiredSignalsCaptured): boolean {
  return s.goal && s.timeline && s.range && s.contactMethod;
}

export function inferReadiness(answers: AgentV2Answers, hasAppointment: boolean): Readiness {
  const asap = answers.timeline === "As soon as possible";
  const exploring = answers.timeline === "Just exploring";
  const strong =
    answers.financialComfort === "Strong and ready" || answers.financialComfort === "Mostly comfortable";

  if (exploring) return "cold";
  if (asap && strong && hasAppointment) return "hot";
  if (hasAppointment) return "warm";
  if (
    answers.timeline === "1–3 months" ||
    answers.timeline === "3–6 months" ||
    answers.timeline === "6–12 months"
  )
    return "warm";
  return "unknown";
}

/** Next discovery field to collect */
export function nextMissingSignalKey(s: RequiredSignalsCaptured, answers: AgentV2Answers): string | null {
  if (!s.goal) return "goal";
  if (!s.timeline) return "timeline";
  if (!s.range) return answers.goal === "Refinance" ? "propertyValueRange" : "priceRange";
  if (!answers.creditRange) return "creditRange";
  if (!answers.financialComfort) return "financialComfort";
  const loc = locationMissingKey(answers);
  if (loc) return loc;
  if (!s.contactMethod) return "contactPreference";
  return null;
}

/** Ordered list of all missing discovery keys (for compression / prioritization) */
export function getAllMissingSignalKeys(s: RequiredSignalsCaptured, answers: AgentV2Answers): string[] {
  const keys: string[] = [];
  if (!s.goal) keys.push("goal");
  if (!s.timeline) keys.push("timeline");
  if (!s.range) keys.push(answers.goal === "Refinance" ? "propertyValueRange" : "priceRange");
  if (!answers.creditRange) keys.push("creditRange");
  if (!answers.financialComfort) keys.push("financialComfort");
  const loc = locationMissingKey(answers);
  if (loc) keys.push(loc);
  if (!s.contactMethod) keys.push("contactPreference");
  return keys;
}

/** True when goal + timeline are both missing — use combined lead-in copy, still collect goal first */
export function shouldCompressGoalAndTimelineLeadIn(s: RequiredSignalsCaptured): boolean {
  return !s.goal && !s.timeline;
}

/** When next two missing keys are timeline+range or credit+comfort — one open-text turn can capture both */
export function nextCompositePair(
  s: RequiredSignalsCaptured,
  answers: AgentV2Answers,
): "timeline_range" | "credit_comfort" | null {
  const k = getAllMissingSignalKeys(s, answers);
  if (k[0] === "timeline" && (k[1] === "priceRange" || k[1] === "propertyValueRange")) {
    return "timeline_range";
  }
  if (k[0] === "creditRange" && k[1] === "financialComfort") {
    return "credit_comfort";
  }
  return null;
}
