/**
 * Deterministic actions — replace internals with API calls later.
 */
import { isValidEmail, isValidPhone } from "../agent/mortgageAgentUtils";
import type { AgentV2Answers } from "./agentV2Types";
import { getMockAppointmentSlots } from "../agent/mortgageAgentMockSlots";
import { buildAgentV2LeadPacket } from "./agentV2LeadPacket";

export function savePartialIntake(_sessionId: string, answers: AgentV2Answers): void {
  if (import.meta.env?.DEV) {
    console.debug("[AgentV2] save_partial_intake", answers);
  }
}

export interface ContactValidationResult {
  ok: boolean;
  errors: Record<string, string>;
}

export function validateContactCard(answers: AgentV2Answers): ContactValidationResult {
  const errors: Record<string, string> = {};
  if (!answers.firstName?.trim()) errors.firstName = "Please add your first name.";
  if (!isValidEmail(answers.email ?? "")) {
    errors.email = "Please enter a valid email so we can send your next steps.";
  }
  const needsPhone = answers.contactPreference === "Call" || answers.contactPreference === "Text";
  if (needsPhone && !isValidPhone(answers.phone ?? "")) {
    errors.phone = "Please add a phone number so we can reach you.";
  }
  if (!answers.preferredContactTime) {
    errors.preferredContactTime = "Choose a preferred contact window.";
  }
  return { ok: Object.keys(errors).length === 0, errors };
}

export function fetchMockScheduleSlots(): ReturnType<typeof getMockAppointmentSlots> {
  return getMockAppointmentSlots();
}

export function bookMockScheduleSlot(sessionId: string, slotLabel: string): { ok: boolean; booked: string } {
  if (import.meta.env?.DEV) {
    console.debug("[AgentV2] book_mock_schedule_slot", sessionId, slotLabel);
  }
  return { ok: true, booked: slotLabel };
}

export async function submitLeadPacketV2(
  sessionId: string,
  pageContext: string,
  answers: AgentV2Answers,
): Promise<void> {
  const packet = buildAgentV2LeadPacket(sessionId, pageContext, answers);
  console.log("[AgentV2] lead packet", packet);
  await new Promise((r) => setTimeout(r, 450));
}
