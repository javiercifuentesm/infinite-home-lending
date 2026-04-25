export type FrOption = { label: string };
export type FrQuestion = { id: string; prompt: string; options: FrOption[] };

/**
 * Order matters: maps to `answersToReality` (payment first = money anchor).
 */
export const FINANCIAL_REALITY_QUESTIONS: FrQuestion[] = [
  {
    id: "payment",
    prompt: "What monthly payment feels comfortable to you?",
    options: [
      { label: "<$2,000" },
      { label: "$2,000–$3,000" },
      { label: "$3,000–$4,500" },
      { label: "$4,500+" },
    ],
  },
  {
    id: "income",
    prompt: "What’s your approximate household income?",
    options: [{ label: "<$75K" }, { label: "$75K–$125K" }, { label: "$125K–$200K" }, { label: "$200K+" }],
  },
  {
    id: "credit",
    prompt: "How would you describe your credit?",
    options: [
      { label: "Excellent (720+)" },
      { label: "Good (680–720)" },
      { label: "Fair (620–680)" },
      { label: "Not sure" },
    ],
  },
  {
    id: "savings",
    prompt: "What’s your current savings for buying?",
    options: [
      { label: "$0–$10K" },
      { label: "$10K–$30K" },
      { label: "$30K–$75K" },
      { label: "$75K+" },
    ],
  },
  {
    id: "timing",
    prompt: "When are you thinking about buying?",
    options: [{ label: "Now" }, { label: "3–6 months" }, { label: "6–12 months" }, { label: "Just exploring" }],
  },
];
