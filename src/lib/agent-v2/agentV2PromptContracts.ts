/**
 * Future OpenAI Agents SDK — role contracts (interfaces only for V2).
 *
 * RouterAgent: classifies user intent → next stage / widget.
 * IntakeAgent: extracts structured answers from free text (tool calls to save_partial_intake).
 * ClarificationGuard: refuses out-of-scope; returns compliant briefs.
 * SummaryAgent: produces userFacingSummary + internalLeadSummary (deterministic template in V1 mock).
 * SchedulingController: maps to fetch_schedule_slots / book_schedule_slot actions.
 * HandoffBuilder: final lead packet + compliance notes.
 */

export interface FutureRouterContract {
  /** Input: last user message + ConversationState snapshot */
  route(input: { message: string; stateSummary: string }): Promise<{ stage: string; confidence: number }>;
}

export interface FutureIntakeContract {
  extractGoal(text: string): Promise<string | null>;
}
