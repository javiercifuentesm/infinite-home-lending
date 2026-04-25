/**
 * Mock orchestrator — delegates conversational turns to `generateNextBestMove`.
 * Replace with OpenAI Agents SDK; preserve AgentV2OrchestratorInput/Output contract.
 */
import { GOAL_OPTIONS } from "../agent/mortgageAgentFlow";
import { buildWelcomeAssistantLines } from "./agentV2ConversationStrategy";
import {
  buildContactCaptureMove,
  buildSchedulingMove,
  generateNextBestMove,
} from "./agentV2ResponseEngine";
import {
  makeAssistantMessage,
  makeUserMessage,
  makeWidgetItem,
  mergeAnswers,
} from "./agentV2State";
import { updateRequiredSignals } from "./agentV2FlowEngine";
import { applyRecapEditInvalidation } from "./agentV2RecapEdit";
import type {
  AgentV2Answers,
  AgentV2OrchestratorInput,
  AgentV2OrchestratorOutput,
  ConversationState,
  TranscriptItem,
  WidgetRequest,
} from "./agentV2Types";

function withWidgetSnapshot(items: TranscriptItem[], w: WidgetRequest | null | undefined) {
  if (!w) return items;
  return [...items, makeWidgetItem(w.kind, w.data)];
}

function applyAnswer(
  state: ConversationState,
  key: keyof AgentV2Answers,
  value: string,
): ConversationState {
  const answers = mergeAnswers(state.answers, { [key]: value } as Partial<AgentV2Answers>);
  const requiredSignalsCaptured = updateRequiredSignals(answers, state.requiredSignalsCaptured);
  return { ...state, answers, requiredSignalsCaptured };
}

export function buildWelcomeOutput(sessionId: string): AgentV2OrchestratorOutput {
  const widget: WidgetRequest = {
    id: "w_goal",
    kind: "quick_replies",
    data: { options: [...GOAL_OPTIONS], targetField: "goal" },
  };
  const { lines, nextUsedIds } = buildWelcomeAssistantLines(sessionId, []);
  const assistantMessages = lines.map((line) => makeAssistantMessage(line));
  return {
    assistantMessages: withWidgetSnapshot(assistantMessages, widget),
    statePatch: {
      stage: "welcome",
      activeWidget: widget,
      lastEngineMove: "greet_user",
      phraseUsageIds: nextUsedIds,
      dialogueTurnCount: 3,
    },
  };
}

export function runMockOrchestrator(input: AgentV2OrchestratorInput): AgentV2OrchestratorOutput {
  const { state, userMessage, selectedOption, quickReplyTarget, orchestratorAction } = input;

  if (orchestratorAction?.type === "edit_recap_field") {
    const inv = applyRecapEditInvalidation(state.answers, orchestratorAction.field);
    const requiredSignalsCaptured = updateRequiredSignals(inv.answers, state.requiredSignalsCaptured);
    const patched: ConversationState = {
      ...state,
      answers: inv.answers,
      requiredSignalsCaptured,
      stage: "discovery",
      needsSummaryRefresh: true,
      lastEditedField: orchestratorAction.field,
      fieldsInvalidatedByEdit: inv.clearedKeys,
    };
    const out = generateNextBestMove({ state: patched, resumeDiscovery: true });
    return {
      assistantMessages: withWidgetSnapshot(out.assistantMessages ?? [], out.widgetRequest),
      statePatch: {
        ...out.statePatch,
        answers: inv.answers,
        requiredSignalsCaptured,
        stage: "discovery",
        needsSummaryRefresh: true,
        lastEditedField: orchestratorAction.field,
        fieldsInvalidatedByEdit: inv.clearedKeys,
      },
      widgetRequest: out.widgetRequest,
    };
  }

  if (orchestratorAction?.type === "recap_continue") {
    const out = buildContactCaptureMove(state);
    return {
      assistantMessages: withWidgetSnapshot(out.assistantMessages ?? [], out.widgetRequest),
      statePatch: out.statePatch,
      widgetRequest: out.widgetRequest,
    };
  }

  if (orchestratorAction?.type === "contact_answers_patch") {
    const answers = mergeAnswers(state.answers, orchestratorAction.payload);
    const requiredSignalsCaptured = updateRequiredSignals(answers, state.requiredSignalsCaptured);
    return {
      assistantMessages: [],
      statePatch: {
        answers,
        requiredSignalsCaptured,
      },
    };
  }

  if (orchestratorAction?.type === "contact_submit") {
    const p = orchestratorAction.payload;
    const answers = mergeAnswers(state.answers, p as AgentV2Answers);
    const requiredSignalsCaptured = updateRequiredSignals(answers, state.requiredSignalsCaptured);
    const stateWithContact: ConversationState = { ...state, answers, requiredSignalsCaptured };
    const out = buildSchedulingMove(stateWithContact);
    return {
      assistantMessages: withWidgetSnapshot(out.assistantMessages ?? [], out.widgetRequest),
      statePatch: {
        ...out.statePatch,
        answers,
        requiredSignalsCaptured,
      },
      widgetRequest: out.widgetRequest,
    };
  }

  if (orchestratorAction?.type === "schedule_select") {
    const slot = orchestratorAction.slot;
    const next = applyAnswer(state, "appointmentSlot", slot);
    const fullWidget: WidgetRequest = {
      id: "w_conf",
      kind: "confirmation",
      data: {
        slot,
        name: next.answers.firstName,
        email: next.answers.email,
        phone: next.answers.phone,
        contactPreference: next.answers.contactPreference,
        preferredContactTime: next.answers.preferredContactTime,
        schedulingTimezoneUsed: next.answers.schedulingTimezoneUsed,
        subjectPropertyAddress: next.answers.subjectPropertyAddress,
        subjectCity: next.answers.subjectCity,
        subjectState: next.answers.subjectState,
        subjectZip: next.answers.subjectZip,
      },
    };
    return {
      assistantMessages: withWidgetSnapshot(
        [
          makeAssistantMessage("You’re set — we’ll see you then."),
          makeAssistantMessage(
            "We’ll come in knowing what you told me here so we’re not starting from zero.",
          ),
          makeAssistantMessage("You’ll get a confirmation with the details."),
        ],
        fullWidget,
      ),
      statePatch: {
        answers: next.answers,
        requiredSignalsCaptured: next.requiredSignalsCaptured,
        stage: "confirmation",
        lastEngineMove: "confirm_booking",
        activeWidget: fullWidget,
      },
    };
  }

  if (selectedOption && quickReplyTarget) {
    const field =
      quickReplyTarget === "priceRange" && state.answers.goal === "Refinance"
        ? "propertyValueRange"
        : quickReplyTarget === "propertyValueRange"
          ? "propertyValueRange"
          : quickReplyTarget;
    const next = applyAnswer(state, field as keyof AgentV2Answers, selectedOption);
    const userLine = makeUserMessage(selectedOption);
    const out = generateNextBestMove({
      state: next,
      lastSelectedOption: selectedOption,
      lastQuickReplyTarget: quickReplyTarget,
    });
    return {
      assistantMessages: withWidgetSnapshot([userLine, ...(out.assistantMessages ?? [])], out.widgetRequest),
      statePatch: {
        ...out.statePatch,
        answers: next.answers,
        requiredSignalsCaptured: next.requiredSignalsCaptured,
      },
      widgetRequest: out.widgetRequest,
      shouldFallback: out.shouldFallback,
      fallbackReason: out.fallbackReason,
    };
  }

  if (userMessage?.trim()) {
    const trimmed = userMessage.trim();
    const out = generateNextBestMove({ state, lastUserInput: trimmed });
    return {
      assistantMessages: withWidgetSnapshot(
        [makeUserMessage(trimmed), ...(out.assistantMessages ?? [])],
        out.widgetRequest,
      ),
      statePatch: out.statePatch,
      widgetRequest: out.widgetRequest,
      shouldFallback: out.shouldFallback,
      fallbackReason: out.fallbackReason,
    };
  }

  return { assistantMessages: [] };
}
