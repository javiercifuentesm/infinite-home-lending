import type { MortgageAgentAnswers } from "../agent/mortgageAgentTypes";
import { AGENT_STEP_ORDER } from "../agent/mortgageAgentTypes";
import type { AgentV2Answers } from "./agentV2Types";

export const FALLBACK_WIDGET_COPY = {
  title: "Try the step-by-step flow",
  body: "No worries — we can switch to a straight step-by-step if that’s easier. Same end goal, just less back-and-forth.",
  cta: "Continue with guided steps",
} as const;

/** Map V2 answers into V1 shape (same option strings as guided flow). */
export function v2ToV1Seed(a: AgentV2Answers): Partial<MortgageAgentAnswers> {
  return {
    goal: (a.goal as MortgageAgentAnswers["goal"]) ?? null,
    timeline: (a.timeline as MortgageAgentAnswers["timeline"]) ?? null,
    priceRange: ((a.priceRange ?? a.propertyValueRange) as MortgageAgentAnswers["priceRange"]) ?? null,
    creditRange: (a.creditRange as MortgageAgentAnswers["creditRange"]) ?? null,
    financialComfort: (a.financialComfort as MortgageAgentAnswers["financialComfort"]) ?? null,
    contactPreference: (a.contactPreference as MortgageAgentAnswers["contactPreference"]) ?? null,
    firstName: a.firstName ?? "",
    email: a.email ?? "",
    phone: a.phone ?? "",
    preferredContactTime: (a.preferredContactTime as MortgageAgentAnswers["preferredContactTime"]) ?? null,
    appointmentSlot: a.appointmentSlot ?? null,
  };
}

/** Resume V1 at first incomplete step after seeding. */
export function inferV1StepIndexFromSeed(seed: Partial<MortgageAgentAnswers>): number {
  if (!seed.goal) return AGENT_STEP_ORDER.indexOf("goal");
  if (!seed.timeline) return AGENT_STEP_ORDER.indexOf("timeline");
  if (!seed.priceRange) return AGENT_STEP_ORDER.indexOf("priceRange");
  if (!seed.creditRange) return AGENT_STEP_ORDER.indexOf("creditRange");
  if (!seed.financialComfort) return AGENT_STEP_ORDER.indexOf("financialComfort");
  if (!seed.contactPreference) return AGENT_STEP_ORDER.indexOf("contactPreference");
  if (!seed.firstName?.trim() || !seed.email?.trim()) return AGENT_STEP_ORDER.indexOf("contact");
  if (!seed.appointmentSlot) return AGENT_STEP_ORDER.indexOf("schedule");
  return AGENT_STEP_ORDER.indexOf("confirmation");
}
