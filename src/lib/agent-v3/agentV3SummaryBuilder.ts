/**
 * Concise LO-facing summary — not raw transcript.
 */
import type { AgentV3LeadAnswers } from "./agentV3Types";

export function buildLoConsultationSummary(answers: AgentV3LeadAnswers, pageContext: string): string {
  const g = answers.goal ?? "—";
  const t = answers.timeline ?? "—";
  const r = answers.priceRange ?? answers.propertyValueRange ?? "—";
  const loc =
    answers.subjectPropertyAddress?.trim() ||
    [answers.subjectCity, answers.subjectState, answers.subjectZip].filter(Boolean).join(", ") ||
    "—";
  const credit = answers.creditRange ?? "—";
  const comfort = answers.financialComfort ?? "—";
  const contact = answers.contactPreference ?? "—";
  const when = answers.preferredContactTime ?? "—";
  const slot = answers.appointmentSlot ?? "—";
  const tz = answers.schedulingTimezoneUsed ?? "—";

  return [
    `CTA / page: ${pageContext}`,
    `Goal: ${g}`,
    `Timeline: ${t}`,
    `Range (ballpark): ${r}`,
    `Location / property: ${loc}`,
    `Credit (self-reported): ${credit}`,
    `Comfort / readiness: ${comfort}`,
    `Contact preference: ${contact}`,
    `Preferred contact band: ${when}`,
    `Scheduled: ${slot} (${tz})`,
  ].join("\n");
}

export function buildAgentWrittenSummary(
  answers: AgentV3LeadAnswers,
  concerns: string[],
  questions: string[],
): string {
  const parts: string[] = [];
  if (answers.goal) parts.push(`Primary direction: ${answers.goal}.`);
  if (answers.timeline) parts.push(`Timing: ${answers.timeline}.`);
  if (concerns.length) parts.push(`Themes noted: ${concerns.slice(0, 5).join("; ")}.`);
  if (questions.length) parts.push(`Questions they raised: ${questions.slice(0, 5).join("; ")}.`);
  parts.push("Next step: confirm details in consultation and align structure to goals.");
  return parts.join(" ");
}
