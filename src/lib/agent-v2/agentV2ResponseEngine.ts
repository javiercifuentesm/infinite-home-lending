/**
 * Next-best-move conversational layer — interpretation-first, composite turns, variation.
 */
import {
  CONTACT_PREF_OPTIONS,
  CREDIT_OPTIONS,
  FINANCIAL_COMFORT_OPTIONS,
  GOAL_OPTIONS,
  PRICE_OPTIONS,
  TIMELINE_OPTIONS,
} from "../agent/mortgageAgentFlow";
import { classifyUserInput, type ClassificationResult } from "./agentV2InputClassifier";
import { interpretUserMessage, type InterpretationResult } from "./agentV2Interpretation";
import {
  buildClarificationForFocus,
  buildClarificationForMissingKey,
  buildDiscoveryReplyText,
  softenAmbiguousLead,
} from "./agentV2Voice";
import {
  buildBriefSafeAnswerForText,
  buildCompositeCreditComfortQuestion,
  buildCompositeTimelineRangeQuestion,
  buildCompressedGoalTimelineLead,
  buildContactBridge,
  buildInterruptionReply,
  buildRecapSynthesisBlock,
  buildRedirectQuestion,
  buildScheduleBridge,
  flowJoinInterpToQuestion,
  interpretQuickReply,
  maybeExpertiseSpark,
  reassuranceForHesitation,
} from "./agentV2ConversationStrategy";
import { FALLBACK_WIDGET_COPY } from "./agentV2Fallback";
import {
  getAllMissingSignalKeys,
  nextCompositePair,
  nextMissingSignalKey,
  shouldCompressGoalAndTimelineLeadIn,
  updateRequiredSignals,
} from "./agentV2FlowEngine";
import { locationMissingKey, parseSubjectArea, PROPERTY_IN_MIND_OPTIONS } from "./agentV2Location";
import { containsSensitiveRequest } from "./agentV2Guards";
import { makeAssistantMessage, mergeAnswers } from "./agentV2State";
import { generateSlotsForPreference } from "./agentV2Slots";
import { resolveSchedulingTimezone } from "./agentV2Timezone";
import { buildUserFacingSummary } from "./agentV2Summary";
import { inferConversationPersona } from "./agentV2UserInference";
import type {
  ActionRequest,
  AgentV2Answers,
  ConversationState,
  QuickReplyTarget,
  RecapLineRow,
  TranscriptItem,
  WidgetRequest,
} from "./agentV2Types";

export type NextBestMoveInput = {
  state: ConversationState;
  lastUserInput?: string;
  lastSelectedOption?: string;
  lastQuickReplyTarget?: QuickReplyTarget;
  /** Resume discovery after recap edit (no new user message) */
  resumeDiscovery?: boolean;
};

export type NextBestMoveOutput = {
  assistantMessages: TranscriptItem[];
  statePatch?: Partial<ConversationState>;
  widgetRequest?: WidgetRequest | null;
  actionRequest?: ActionRequest | null;
  shouldFallback?: boolean;
  fallbackReason?: string;
};

export type EngineMoveType =
  | "greet_user"
  | "acknowledge_and_ask"
  | "answer_briefly_and_redirect"
  | "clarify_missing_signal"
  | "compress_two_signals_into_one_prompt"
  | "generate_summary"
  | "trigger_contact_widget"
  | "trigger_schedule_widget"
  | "confirm_booking"
  | "trigger_fallback";

function buildWidgetForKey(
  key: string,
  _answers: AgentV2Answers,
): { widget: WidgetRequest | null; move: EngineMoveType } {
  const move: EngineMoveType = "clarify_missing_signal";
  if (key === "goal") {
    return {
      move,
      widget: {
        id: `w_goal_${Date.now()}`,
        kind: "quick_replies",
        data: { options: [...GOAL_OPTIONS], targetField: "goal" satisfies QuickReplyTarget },
      },
    };
  }
  if (key === "timeline") {
    return {
      move,
      widget: {
        id: `w_time_${Date.now()}`,
        kind: "quick_replies",
        data: { options: [...TIMELINE_OPTIONS], targetField: "timeline" },
      },
    };
  }
  if (key === "priceRange") {
    return {
      move,
      widget: {
        id: `w_price_${Date.now()}`,
        kind: "quick_replies",
        data: { options: [...PRICE_OPTIONS], targetField: "priceRange" },
      },
    };
  }
  if (key === "propertyValueRange") {
    return {
      move,
      widget: {
        id: `w_pvr_${Date.now()}`,
        kind: "quick_replies",
        data: { options: [...PRICE_OPTIONS], targetField: "propertyValueRange" },
      },
    };
  }
  if (key === "creditRange") {
    return {
      move,
      widget: {
        id: `w_cred_${Date.now()}`,
        kind: "quick_replies",
        data: { options: [...CREDIT_OPTIONS], targetField: "creditRange" },
      },
    };
  }
  if (key === "financialComfort") {
    return {
      move,
      widget: {
        id: `w_fin_${Date.now()}`,
        kind: "quick_replies",
        data: { options: [...FINANCIAL_COMFORT_OPTIONS], targetField: "financialComfort" },
      },
    };
  }
  if (key === "contactPreference") {
    return {
      move,
      widget: {
        id: `w_cp_${Date.now()}`,
        kind: "quick_replies",
        data: { options: [...CONTACT_PREF_OPTIONS], targetField: "contactPreference" },
      },
    };
  }
  if (key === "propertyInMind") {
    return {
      move,
      widget: {
        id: `w_pim_${Date.now()}`,
        kind: "quick_replies",
        data: { options: [...PROPERTY_IN_MIND_OPTIONS], targetField: "propertyInMind" satisfies QuickReplyTarget },
      },
    };
  }
  if (key === "subjectPropertyAddress" || key === "subjectArea") {
    return { move, widget: null };
  }
  return {
    move,
    widget: { id: "w_fallback_qr", kind: "quick_replies", data: { options: [], targetField: "goal" } },
  };
}

function patchAnswersFromWorking(working: ConversationState): Partial<ConversationState> {
  return {
    answers: working.answers,
    requiredSignalsCaptured: working.requiredSignalsCaptured,
  };
}

function bumpDialogue(state: ConversationState): number {
  return (state.dialogueTurnCount ?? 0) + 1;
}

/** No reliable extraction and no off-path ack — clarify instead of jumping to the next scripted step */
function shouldGateProgression(
  interpreted: InterpretationResult,
  classified: ClassificationResult,
  userText: string,
): boolean {
  const substantive =
    userText.trim().length > 12 || userText.trim().split(/\s+/).filter(Boolean).length >= 4;
  return (
    interpreted.signalsUpdated === 0 &&
    interpreted.interpretationStrength === "none" &&
    !interpreted.offPathAck &&
    classified.category !== "safe_mortgage_question" &&
    classified.category !== "off_topic" &&
    classified.category !== "fallback_request" &&
    !(classified.category === "ambiguous" && userText.trim().length < 18) &&
    substantive
  );
}

function recapBlock(state: ConversationState): NextBestMoveOutput {
  const summary = buildUserFacingSummary(state.answers, state.sessionId);
  const { lines, nextUsedIds } = buildRecapSynthesisBlock(
    state.sessionId,
    state.dialogueTurnCount ?? 0,
    state.phraseUsageIds,
  );
  const loc =
    state.answers.subjectPropertyAddress?.trim() ||
    [state.answers.subjectCity, state.answers.subjectState, state.answers.subjectZip].filter(Boolean).join(", ") ||
    "—";
  const recapLines: RecapLineRow[] = [
    { label: "Goal", value: state.answers.goal ?? "—", field: "goal" },
    { label: "Timeline", value: state.answers.timeline ?? "—", field: "timeline" },
    {
      label: "Range",
      value: state.answers.priceRange ?? state.answers.propertyValueRange ?? "—",
      field: "range",
    },
    { label: "Credit", value: state.answers.creditRange ?? "—", field: "credit" },
    { label: "Comfort", value: state.answers.financialComfort ?? "—", field: "comfort" },
  ];
  if (state.answers.goal !== "Explore options") {
    recapLines.push({ label: "Location", value: loc, field: "location" });
  } else {
    recapLines.push({ label: "Location", value: loc });
  }
  const widget: WidgetRequest = {
    id: "w_recap",
    kind: "recap",
    data: {
      lines: recapLines,
    },
  };
  return {
    assistantMessages: [
      makeAssistantMessage(lines[0]!),
      makeAssistantMessage(lines[1]!),
      makeAssistantMessage(summary),
    ],
    statePatch: {
      ...patchAnswersFromWorking(state),
      stage: "summary",
      lastEngineMove: "generate_summary",
      dialogueTurnCount: (state.dialogueTurnCount ?? 0) + 3,
      phraseUsageIds: nextUsedIds,
      inferredPersona: inferConversationPersona(state.answers),
      needsSummaryRefresh: false,
      lastEditedField: undefined,
      fieldsInvalidatedByEdit: undefined,
    },
    widgetRequest: widget,
  };
}

function applyExtractions(state: ConversationState, extra: Partial<AgentV2Answers>): ConversationState {
  const answers = mergeAnswers(state.answers, extra);
  const requiredSignalsCaptured = updateRequiredSignals(answers, state.requiredSignalsCaptured);
  return { ...state, answers, requiredSignalsCaptured };
}

function handleSafeQuestion(state: ConversationState, userText: string, nextKey: string | null): NextBestMoveOutput {
  const persona = inferConversationPersona(state.answers);
  const redirect = nextKey
    ? buildRedirectQuestion(nextKey, state.answers, persona)
    : buildRedirectQuestion("goal", state.answers, persona);
  const body = buildInterruptionReply(userText, redirect, state.sessionId, state.dialogueTurnCount ?? 0);
  if (!nextKey) {
    const s2 = applyExtractions(state, interpretUserMessage(userText, state.answers).committed);
    return recapBlock(s2);
  }
  const { widget } = buildWidgetForKey(nextKey, state.answers);
  const t = bumpDialogue(state);
  return {
    assistantMessages: [makeAssistantMessage(body)],
    statePatch: {
      answers: state.answers,
      requiredSignalsCaptured: state.requiredSignalsCaptured,
      stage: "discovery",
      hasFreeformQuestion: true,
      ambiguousStreak: 0,
      lastEngineMove: "answer_briefly_and_redirect",
      dialogueTurnCount: t,
      inferredPersona: persona,
    },
    widgetRequest: widget,
  };
}

function generateAfterQuickReply(
  state: ConversationState,
  selected: string,
  target: QuickReplyTarget,
): NextBestMoveOutput {
  const persona = inferConversationPersona(state.answers);
  const nextKey = nextMissingSignalKey(state.requiredSignalsCaptured, state.answers);
  if (!nextKey) {
    return recapBlock(state);
  }

  const composite = nextCompositePair(state.requiredSignalsCaptured, state.answers);
  const turn = bumpDialogue(state);
  const targetStr = target as string;

  if (composite === "timeline_range" && nextKey === "timeline") {
    const interp = interpretQuickReply(targetStr, selected, state.answers, persona);
    const q = buildCompositeTimelineRangeQuestion(state.answers, persona);
    const msgs: TranscriptItem[] = [makeAssistantMessage(`${interp}\n\n${q}`)];
    return {
      assistantMessages: msgs,
      statePatch: {
        stage: "discovery",
        ambiguousStreak: 0,
        lastEngineMove: "compress_two_signals_into_one_prompt",
        dialogueTurnCount: (state.dialogueTurnCount ?? 0) + msgs.length,
        inferredPersona: persona,
        pendingComposite: "timeline_range",
      },
      widgetRequest: null,
    };
  }

  if (composite === "credit_comfort" && nextKey === "creditRange") {
    const interp = interpretQuickReply(targetStr, selected, state.answers, persona);
    const q = buildCompositeCreditComfortQuestion(state.answers, persona);
    const msgs: TranscriptItem[] = [makeAssistantMessage(`${interp}\n\n${q}`)];
    return {
      assistantMessages: msgs,
      statePatch: {
        stage: "discovery",
        ambiguousStreak: 0,
        lastEngineMove: "compress_two_signals_into_one_prompt",
        dialogueTurnCount: (state.dialogueTurnCount ?? 0) + msgs.length,
        inferredPersona: persona,
        pendingComposite: "credit_comfort",
      },
      widgetRequest: null,
    };
  }

  const interp = interpretQuickReply(targetStr, selected, state.answers, persona);
  const redirect = buildRedirectQuestion(nextKey, state.answers, persona);
  const spark = maybeExpertiseSpark(turn, persona, state.sessionId, state.phraseUsageIds);
  const msgs: TranscriptItem[] = [makeAssistantMessage(flowJoinInterpToQuestion(interp, redirect))];
  if (spark.text) {
    msgs.push(makeAssistantMessage(spark.text));
  }
  const { widget, move } = buildWidgetForKey(nextKey, state.answers);
  return {
    assistantMessages: msgs,
    statePatch: {
      stage: "discovery",
      ambiguousStreak: 0,
      lastEngineMove: move === "clarify_missing_signal" ? "acknowledge_and_ask" : move,
      dialogueTurnCount: (state.dialogueTurnCount ?? 0) + msgs.length,
      inferredPersona: persona,
      phraseUsageIds: spark.nextUsedIds,
    },
    widgetRequest: widget,
  };
}

const EDIT_RESUME_BRIDGE = "Sure — let’s update that.";

function generateResumeDiscovery(state: ConversationState): NextBestMoveOutput {
  const persona = inferConversationPersona(state.answers);
  const nextKey = nextMissingSignalKey(state.requiredSignalsCaptured, state.answers);
  if (!nextKey) {
    return recapBlock(state);
  }

  const composite = nextCompositePair(state.requiredSignalsCaptured, state.answers);

  if (composite === "timeline_range" && nextKey === "timeline") {
    const q = buildCompositeTimelineRangeQuestion(state.answers, persona);
    const msgs: TranscriptItem[] = [makeAssistantMessage(`${EDIT_RESUME_BRIDGE}\n\n${q}`)];
    return {
      assistantMessages: msgs,
      statePatch: {
        stage: "discovery",
        ambiguousStreak: 0,
        lastEngineMove: "compress_two_signals_into_one_prompt",
        dialogueTurnCount: (state.dialogueTurnCount ?? 0) + msgs.length,
        inferredPersona: persona,
        pendingComposite: "timeline_range",
      },
      widgetRequest: null,
    };
  }

  if (composite === "credit_comfort" && nextKey === "creditRange") {
    const q = buildCompositeCreditComfortQuestion(state.answers, persona);
    const msgs: TranscriptItem[] = [makeAssistantMessage(`${EDIT_RESUME_BRIDGE}\n\n${q}`)];
    return {
      assistantMessages: msgs,
      statePatch: {
        stage: "discovery",
        ambiguousStreak: 0,
        lastEngineMove: "compress_two_signals_into_one_prompt",
        dialogueTurnCount: (state.dialogueTurnCount ?? 0) + msgs.length,
        inferredPersona: persona,
        pendingComposite: "credit_comfort",
      },
      widgetRequest: null,
    };
  }

  const redirect = buildRedirectQuestion(nextKey, state.answers, persona);
  const msgs: TranscriptItem[] = [makeAssistantMessage(flowJoinInterpToQuestion(EDIT_RESUME_BRIDGE, redirect))];
  const { widget, move } = buildWidgetForKey(nextKey, state.answers);
  return {
    assistantMessages: msgs,
    statePatch: {
      stage: "discovery",
      ambiguousStreak: 0,
      lastEngineMove: move === "clarify_missing_signal" ? "acknowledge_and_ask" : move,
      dialogueTurnCount: (state.dialogueTurnCount ?? 0) + msgs.length,
      inferredPersona: persona,
    },
    widgetRequest: widget,
  };
}

function generateAfterFreeform(state: ConversationState, userText: string): NextBestMoveOutput {
  const interpreted = interpretUserMessage(userText, state.answers);
  const classified: ClassificationResult = classifyUserInput(userText, state.answers, interpreted);

  if (classified.category === "fallback_request") {
    return {
      assistantMessages: [makeAssistantMessage(FALLBACK_WIDGET_COPY.body)],
      statePatch: {
        stage: "fallback_v1",
        ambiguousStreak: 0,
        lastEngineMove: "trigger_fallback",
        activeWidget: {
          id: "w_fb",
          kind: "fallback",
          data: { title: FALLBACK_WIDGET_COPY.title, cta: FALLBACK_WIDGET_COPY.cta },
        },
        dialogueTurnCount: bumpDialogue(state),
      },
      widgetRequest: {
        id: "w_fb",
        kind: "fallback",
        data: { title: FALLBACK_WIDGET_COPY.title, cta: FALLBACK_WIDGET_COPY.cta },
      },
      shouldFallback: true,
      fallbackReason: "user_preference",
    };
  }

  if (classified.category === "off_topic" || containsSensitiveRequest(userText.toLowerCase())) {
    const streak = (state.offTopicStreak ?? 0) + 1;
    const safe =
      "I can’t collect sensitive details here. A licensed advisor can review those securely in consultation.";
    const nextKey = nextMissingSignalKey(state.requiredSignalsCaptured, state.answers);
    if (streak >= 2) {
      return {
        assistantMessages: [makeAssistantMessage(FALLBACK_WIDGET_COPY.body)],
        statePatch: {
          stage: "fallback_v1",
          offTopicStreak: streak,
          lastEngineMove: "trigger_fallback",
          activeWidget: {
            id: "w_fb",
            kind: "fallback",
            data: { title: FALLBACK_WIDGET_COPY.title, cta: FALLBACK_WIDGET_COPY.cta },
          },
          dialogueTurnCount: bumpDialogue(state),
        },
        widgetRequest: {
          id: "w_fb",
          kind: "fallback",
          data: { title: FALLBACK_WIDGET_COPY.title, cta: FALLBACK_WIDGET_COPY.cta },
        },
        shouldFallback: true,
        fallbackReason: "off_topic_loop",
      };
    }
    const persona = inferConversationPersona(state.answers);
    const redirect = nextKey
      ? buildRedirectQuestion(nextKey, state.answers, persona)
      : buildRedirectQuestion("goal", state.answers, persona);
    const { widget } = nextKey
      ? buildWidgetForKey(nextKey, state.answers)
      : buildWidgetForKey("goal", state.answers);
    return {
      assistantMessages: [makeAssistantMessage(`${safe} ${redirect}`)],
      statePatch: {
        stage: "discovery",
        offTopicStreak: streak,
        ambiguousStreak: 0,
        lastEngineMove: "answer_briefly_and_redirect",
        dialogueTurnCount: bumpDialogue(state),
        inferredPersona: persona,
        pendingComposite: null,
      },
      widgetRequest: widget,
    };
  }

  let working = applyExtractions(state, interpreted.committed);
  if (state.pendingComposite) {
    working = { ...working, pendingComposite: null };
  }
  const locKey = locationMissingKey(working.answers);
  if (locKey === "subjectArea") {
    working = applyExtractions(working, parseSubjectArea(userText));
  } else if (locKey === "subjectPropertyAddress") {
    const line = userText.trim();
    if (line.length > 3) working = applyExtractions(working, { subjectPropertyAddress: line });
  }

  const persona = inferConversationPersona(working.answers);
  let nextKey = nextMissingSignalKey(working.requiredSignalsCaptured, working.answers);
  if (!nextKey) {
    return recapBlock(working);
  }

  if (interpreted.pendingClarification) {
    const wk = interpreted.pendingClarification.focus;
    const { widget } = buildWidgetForKey(wk, working.answers);
    const prefix = interpreted.offPathAck ? `${interpreted.offPathAck}\n\n` : "";
    const t = bumpDialogue(state);
    const clarifyLine = buildClarificationForFocus(wk, state.sessionId, t);
    return {
      assistantMessages: [makeAssistantMessage(`${prefix}${clarifyLine}`)],
      statePatch: {
        ...patchAnswersFromWorking(working),
        stage: "clarification",
        ambiguousStreak: 0,
        lastEngineMove: "clarify_missing_signal",
        dialogueTurnCount: t,
        inferredPersona: persona,
        pendingComposite: null,
      },
      widgetRequest: widget,
    };
  }

  if (classified.category === "safe_mortgage_question") {
    return handleSafeQuestion(working, userText, nextKey);
  }

  const isAmbiguous = classified.category === "ambiguous";
  let nextAmbiguousStreak = state.ambiguousStreak ?? 0;
  if (isAmbiguous) {
    nextAmbiguousStreak += 1;
    if (nextAmbiguousStreak >= 2) {
      return {
        assistantMessages: [
          makeAssistantMessage("Let’s switch to a simpler step-by-step — might be easier."),
          makeAssistantMessage(FALLBACK_WIDGET_COPY.body),
        ],
        statePatch: {
          stage: "fallback_v1",
          ambiguousStreak: nextAmbiguousStreak,
          lastEngineMove: "trigger_fallback",
          activeWidget: {
            id: "w_fb",
            kind: "fallback",
            data: { title: FALLBACK_WIDGET_COPY.title, cta: FALLBACK_WIDGET_COPY.cta },
          },
          dialogueTurnCount: bumpDialogue(state) + 1,
        },
        widgetRequest: {
          id: "w_fb",
          kind: "fallback",
          data: { title: FALLBACK_WIDGET_COPY.title, cta: FALLBACK_WIDGET_COPY.cta },
        },
        shouldFallback: true,
        fallbackReason: "repeated_ambiguity",
      };
    }
  }

  if (shouldGateProgression(interpreted, classified, userText) && nextKey) {
    const { widget } = buildWidgetForKey(nextKey, working.answers);
    const t = bumpDialogue(state);
    const line = buildClarificationForMissingKey(nextKey, working.answers, state.sessionId, t);
    const prefix = interpreted.offPathAck ? `${interpreted.offPathAck}\n\n` : "";
    return {
      assistantMessages: [makeAssistantMessage(`${prefix}${line}`)],
      statePatch: {
        ...patchAnswersFromWorking(working),
        stage: "clarification",
        ambiguousStreak: 0,
        lastEngineMove: "clarify_missing_signal",
        dialogueTurnCount: t,
        inferredPersona: persona,
        pendingComposite: null,
      },
      widgetRequest: widget,
    };
  }

  if (isAmbiguous) {
    const { widget } = buildWidgetForKey(nextKey, working.answers);
    const ambTurn = bumpDialogue(state);
    const rawLead = reassuranceForHesitation(userText);
    const lead = softenAmbiguousLead(userText, state.sessionId, ambTurn, rawLead);
    const q = buildRedirectQuestion(nextKey, working.answers, persona);
    const clarify = lead ? `${lead} ${q}` : q;
    return {
      assistantMessages: [makeAssistantMessage(clarify)],
      statePatch: {
        ...patchAnswersFromWorking(working),
        ambiguousStreak: nextAmbiguousStreak,
        stage: "clarification",
        lastEngineMove: "clarify_missing_signal",
        dialogueTurnCount: ambTurn,
        inferredPersona: persona,
        pendingComposite: null,
      },
      widgetRequest: widget,
    };
  }

  const msgs: TranscriptItem[] = [];
  const missing = getAllMissingSignalKeys(working.requiredSignalsCaptured, working.answers);
  const nk = nextMissingSignalKey(working.requiredSignalsCaptured, working.answers);
  if (!nk) {
    return recapBlock(working);
  }

  const compress =
    shouldCompressGoalAndTimelineLeadIn(working.requiredSignalsCaptured) &&
    nk === "goal" &&
    missing[1] === "timeline";

  if (compress) {
    let compressBody = buildCompressedGoalTimelineLead(working.answers);
    if (interpreted.offPathAck) compressBody = `${interpreted.offPathAck}\n\n${compressBody}`;
    msgs.push(makeAssistantMessage(compressBody));
    const { widget } = buildWidgetForKey("goal", working.answers);
    return {
      assistantMessages: msgs,
      statePatch: {
        ...patchAnswersFromWorking(working),
        stage: "discovery",
        ambiguousStreak: 0,
        offTopicStreak: 0,
        lastEngineMove: "compress_two_signals_into_one_prompt",
        dialogueTurnCount: (state.dialogueTurnCount ?? 0) + msgs.length,
        inferredPersona: persona,
        pendingComposite: null,
      },
      widgetRequest: widget,
    };
  }

  if (
    classified.category !== "goal_answer" &&
    classified.category !== "timeline_answer" &&
    classified.category !== "price_answer" &&
    classified.category !== "credit_answer" &&
    classified.category !== "financial_comfort_answer" &&
    classified.category !== "contact_preference_answer"
  ) {
    msgs.push(makeAssistantMessage(buildBriefSafeAnswerForText(userText)));
  }

  const redirect = buildRedirectQuestion(nk, working.answers, persona);
  const lead = reassuranceForHesitation(userText);
  const turn = bumpDialogue(state);
  const tail = buildDiscoveryReplyText({
    sessionId: state.sessionId,
    turn,
    interpreted,
    userText,
    redirect,
    lead: lead || undefined,
    offPathAck: interpreted.offPathAck,
    echoLine: interpreted.echoLine,
  });
  msgs.push(makeAssistantMessage(tail));
  const { widget } = buildWidgetForKey(nk, working.answers);
  return {
    assistantMessages: msgs,
    statePatch: {
      ...patchAnswersFromWorking(working),
      stage: "discovery",
      ambiguousStreak: 0,
      offTopicStreak: 0,
      lastEngineMove: "acknowledge_and_ask",
      dialogueTurnCount: (state.dialogueTurnCount ?? 0) + msgs.length,
      inferredPersona: persona,
      pendingComposite: null,
    },
    widgetRequest: widget,
  };
}

export function generateNextBestMove(input: NextBestMoveInput): NextBestMoveOutput {
  const { state, lastUserInput, lastSelectedOption, lastQuickReplyTarget, resumeDiscovery } = input;

  if (resumeDiscovery) {
    return generateResumeDiscovery(state);
  }
  if (lastSelectedOption && lastQuickReplyTarget) {
    return generateAfterQuickReply(state, lastSelectedOption, lastQuickReplyTarget);
  }
  if (lastUserInput?.trim()) {
    return generateAfterFreeform(state, lastUserInput.trim());
  }
  return { assistantMessages: [] };
}

export function buildContactCaptureMove(state?: ConversationState): NextBestMoveOutput {
  const sessionId = state?.sessionId ?? "sess";
  const turn = state?.dialogueTurnCount ?? 0;
  const used = state?.phraseUsageIds;
  const bridge = buildContactBridge(sessionId, turn, used);
  return {
    assistantMessages: [
      makeAssistantMessage(bridge.text),
      makeAssistantMessage("Share your details below — we’ll follow up the way you prefer."),
    ],
    statePatch: {
      stage: "contact_capture",
      lastEngineMove: "trigger_contact_widget",
      phraseUsageIds: bridge.nextUsedIds,
      dialogueTurnCount: turn + 1,
    },
    widgetRequest: { id: "w_contact", kind: "contact_card", data: {} },
  };
}

export function buildSchedulingMove(state?: ConversationState): NextBestMoveOutput {
  const sessionId = state?.sessionId ?? "sess";
  const turn = state?.dialogueTurnCount ?? 0;
  const used = state?.phraseUsageIds;
  const bridge = buildScheduleBridge(sessionId, turn, used);
  const tz = resolveSchedulingTimezone(state?.answers ?? {}, state?.clientTimeZone ?? "America/New_York");
  const slotPack = generateSlotsForPreference(state?.answers.preferredContactTime, tz);
  const secondLine = slotPack.scheduleNote
    ? `${slotPack.scheduleNote}\n\nPick a time that works — times are in your local zone (${slotPack.timezoneLabel}).`
    : `Pick a time that works — all listed in your local time (${slotPack.timezoneLabel}).`;
  const answersPatch = mergeAnswers(state?.answers ?? {}, { schedulingTimezoneUsed: tz });
  return {
    assistantMessages: [makeAssistantMessage(bridge.text), makeAssistantMessage(secondLine)],
    statePatch: {
      stage: "scheduling",
      lastEngineMove: "trigger_schedule_widget",
      phraseUsageIds: bridge.nextUsedIds,
      dialogueTurnCount: turn + 1,
      answers: answersPatch,
    },
    widgetRequest: {
      id: "w_sched",
      kind: "schedule_card",
      data: {
        slots: slotPack.slots,
        scheduleNote: slotPack.scheduleNote,
        timezone: slotPack.timezone,
        timezoneLabel: slotPack.timezoneLabel,
        preferredContactTime: state?.answers.preferredContactTime,
      },
    },
  };
}
