import type {
  ContactPreference,
  CreditRange,
  FinancialComfort,
  MortgageGoal,
  MortgageTimeline,
  PriceRangeBucket,
} from "./mortgageAgentTypes";

export const GOAL_OPTIONS: readonly MortgageGoal[] = ["Buy a home", "Refinance", "Explore options"];

export const TIMELINE_OPTIONS: readonly MortgageTimeline[] = [
  "As soon as possible",
  "1–3 months",
  "3–6 months",
  "6–12 months",
  "Just exploring",
];

export const PRICE_OPTIONS: readonly PriceRangeBucket[] = [
  "Under $300K",
  "$300K–$500K",
  "$500K–$800K",
  "$800K+",
];

export const CREDIT_OPTIONS: readonly CreditRange[] = [
  "Excellent (740+)",
  "Good (700–739)",
  "Fair (620–699)",
  "Not sure",
];

export const FINANCIAL_COMFORT_OPTIONS: readonly FinancialComfort[] = [
  "Strong and ready",
  "Mostly comfortable",
  "I have some questions",
  "Not sure yet",
];

export const CONTACT_PREF_OPTIONS: readonly ContactPreference[] = ["Call", "Text", "Email"];

export const PREFERRED_TIME_OPTIONS = ["Morning", "Afternoon", "Evening", "Flexible"] as const;

/** Progress: intro = 0; goal…confirmation map to 1–10 */
export const PROGRESS_TOTAL = 10;
