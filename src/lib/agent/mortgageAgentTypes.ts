/** Mortgage conversion agent — shared types */

export type MortgageGoal = "Buy a home" | "Refinance" | "Explore options";

export type MortgageTimeline =
  | "As soon as possible"
  | "1–3 months"
  | "3–6 months"
  | "6–12 months"
  | "Just exploring";

export type PriceRangeBucket = "Under $300K" | "$300K–$500K" | "$500K–$800K" | "$800K+";

export type CreditRange =
  | "Excellent (740+)"
  | "Good (700–739)"
  | "Fair (620–699)"
  | "Not sure";

export type FinancialComfort =
  | "Strong and ready"
  | "Mostly comfortable"
  | "I have some questions"
  | "Not sure yet";

export type ContactPreference = "Call" | "Text" | "Email";

export type PreferredContactTime = "Morning" | "Afternoon" | "Evening" | "Flexible";

export interface MortgageAgentAnswers {
  goal: MortgageGoal | null;
  timeline: MortgageTimeline | null;
  priceRange: PriceRangeBucket | null;
  creditRange: CreditRange | null;
  financialComfort: FinancialComfort | null;
  contactPreference: ContactPreference | null;
  firstName: string;
  email: string;
  phone: string;
  preferredContactTime: PreferredContactTime | null;
  appointmentSlot: string | null;
}

export type LeadTemperature = "hot" | "warm" | "cold";

export interface LeadPacket {
  leadType: "mortgage_consultation";
  createdAt: string;
  source: "website_agent";
  pageContext: string;
  answers: Record<string, string | null>;
  summary: string;
  leadTemperature: LeadTemperature;
}

export type AgentStepId =
  | "intro"
  | "goal"
  | "timeline"
  | "priceRange"
  | "creditRange"
  | "financialComfort"
  | "contactPreference"
  | "contact"
  | "summary"
  | "schedule"
  | "confirmation";

export const AGENT_STEP_ORDER: readonly AgentStepId[] = [
  "intro",
  "goal",
  "timeline",
  "priceRange",
  "creditRange",
  "financialComfort",
  "contactPreference",
  "contact",
  "summary",
  "schedule",
  "confirmation",
] as const;
