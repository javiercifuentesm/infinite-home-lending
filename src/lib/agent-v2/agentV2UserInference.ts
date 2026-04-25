import type { AgentV2Answers } from "./agentV2Types";

export type ConversationPersona = "exploratory" | "uncertain" | "decisive" | "neutral";

/** Lightweight tone routing — no UI, no extra fields captured */
export function inferConversationPersona(answers: AgentV2Answers): ConversationPersona {
  if (
    answers.financialComfort === "I have some questions" ||
    answers.financialComfort === "Not sure yet"
  ) {
    return "uncertain";
  }
  if (answers.goal === "Explore options" || answers.timeline === "Just exploring") return "exploratory";
  if (answers.timeline === "As soon as possible" && answers.goal && answers.goal !== "Explore options") {
    return "decisive";
  }
  if (
    answers.timeline === "1–3 months" ||
    answers.timeline === "3–6 months" ||
    answers.timeline === "6–12 months"
  )
    return "decisive";
  return "neutral";
}
