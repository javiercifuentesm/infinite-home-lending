import type { LeadPacket, LeadTemperature, MortgageAgentAnswers } from "./mortgageAgentTypes";
import { buildAdvisorSummary } from "./mortgageAgentSummary";

export function scoreLeadTemperature(answers: MortgageAgentAnswers): LeadTemperature {
  const asap = answers.timeline === "As soon as possible";
  const soon = answers.timeline === "1–3 months";
  const exploring = answers.timeline === "Just exploring";
  const strong =
    answers.financialComfort === "Strong and ready" || answers.financialComfort === "Mostly comfortable";
  const knownCredit = answers.creditRange !== "Not sure";

  if (exploring || answers.financialComfort === "Not sure yet") {
    return "cold";
  }

  if (asap && strong && knownCredit) {
    return "hot";
  }

  if (soon || strong) {
    return "warm";
  }

  return "warm";
}

export function buildNarrativeSummary(answers: MortgageAgentAnswers, temperature: LeadTemperature): string {
  const base = buildAdvisorSummary(answers);
  const pref = answers.contactPreference ? ` Prefers ${answers.contactPreference.toLowerCase()}.` : "";
  const tempNote =
    temperature === "hot"
      ? " Appears highly motivated and prepared for next steps."
      : temperature === "cold"
        ? " Early exploration — prioritize education and fit."
        : " Moderate readiness — structured consultation recommended.";
  return base.replace(/\.$/, "") + pref + tempNote;
}

export function buildLeadPacket(
  answers: MortgageAgentAnswers,
  pageContext: string,
): LeadPacket {
  const temperature = scoreLeadTemperature(answers);
  const summary = buildNarrativeSummary(answers, temperature);

  const flatAnswers: Record<string, string | null> = {
    goal: answers.goal,
    timeline: answers.timeline,
    priceRange: answers.priceRange,
    creditRange: answers.creditRange,
    financialComfort: answers.financialComfort,
    contactPreference: answers.contactPreference,
    firstName: answers.firstName || null,
    email: answers.email || null,
    phone: answers.phone || null,
    preferredContactTime: answers.preferredContactTime,
    appointmentSlot: answers.appointmentSlot,
  };

  return {
    leadType: "mortgage_consultation",
    createdAt: new Date().toISOString(),
    source: "website_agent",
    pageContext,
    answers: flatAnswers,
    summary,
    leadTemperature: temperature,
  };
}
