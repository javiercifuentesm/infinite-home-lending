import type { MortgageAgentAnswers, MortgageTimeline } from "./mortgageAgentTypes";

function timelinePhrase(t: MortgageTimeline | null): string {
  if (!t) return "your timeframe";
  switch (t) {
    case "As soon as possible":
      return "as soon as possible";
    case "1–3 months":
      return "the next 1–3 months";
    case "3–6 months":
      return "the next 3–6 months";
    case "6–12 months":
      return "roughly the next 6–12 months";
    case "Just exploring":
      return "a timeline you’re still defining";
    default:
      return t;
  }
}

/**
 * Dynamic summary for the “clarity moment” — template-based, no LLM.
 */
export function buildAdvisorSummary(answers: MortgageAgentAnswers): string {
  const price = answers.priceRange ?? "the range you indicated";
  const comfort = answers.financialComfort ?? "where you are today";

  const goalPhrase =
    answers.goal === "Buy a home"
      ? "buy a home"
      : answers.goal === "Refinance"
        ? "refinance"
        : answers.goal === "Explore options"
          ? "explore your options"
          : "move forward";

  const tl = timelinePhrase(answers.timeline);

  return `You're looking to ${goalPhrase} in the ${price} range and planning to move forward within ${tl}. Based on what you shared about feeling ${comfort.toLowerCase()}, the best next step is a focused conversation to help structure your options clearly.`;
}

export function buildShortRecapLines(answers: MortgageAgentAnswers): { label: string; value: string }[] {
  return [
    { label: "Goal", value: answers.goal ?? "—" },
    { label: "Timeline", value: answers.timeline ?? "—" },
    { label: "Price range", value: answers.priceRange ?? "—" },
    { label: "Credit", value: answers.creditRange ?? "—" },
    { label: "Contact preference", value: answers.contactPreference ?? "—" },
  ];
}
