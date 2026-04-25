/**
 * Single-agent orchestrator — deterministic flow + optional OpenAI Responses brain for discovery copy.
 */
import type { AgentV2Answers } from "../agent-v2/agentV2Types";
import { mergeAnswers } from "../agent-v2/agentV2State";
import { updateRequiredSignals, nextMissingSignalKey } from "../agent-v2/agentV2FlowEngine";
import { interpretUserMessage } from "../agent-v2/agentV2Interpretation";
import { locationMissingKey, parseSubjectArea, PROPERTY_IN_MIND_OPTIONS } from "../agent-v2/agentV2Location";
import { resolveSchedulingTimezone } from "../agent-v2/agentV2Timezone";
import { generateSlotsForPreference } from "../agent-v2/agentV2Slots";
import { applyRecapEditInvalidation } from "../agent-v2/agentV2RecapEdit";
import {
  CONTACT_PREF_OPTIONS,
  CREDIT_OPTIONS,
  FINANCIAL_COMFORT_OPTIONS,
  GOAL_OPTIONS,
  PRICE_OPTIONS,
  TIMELINE_OPTIONS,
} from "../agent/mortgageAgentFlow";
import { buildRedirectQuestion } from "../agent-v2/agentV2ConversationStrategy";
import { inferConversationPersona } from "../agent-v2/agentV2UserInference";
import {
  applyGuardrailToOutput,
  classifyAssistantGuardrail,
  classifyGuardrail,
  guardrailBlocksToolUse,
  sanitizeAssistantForUi,
} from "./agentV3Guardrails";
import {
  buildPdfSummaryDocument,
  createPdfObjectUrl,
  renderPdfSummaryToBlob,
} from "./agentV3PdfSummary";
import { buildLoConsultationSummary } from "./agentV3SummaryBuilder";
import { appendTranscript, initialAgentV3Session, makeMessage, makeWidgetItem, nowIso } from "./agentV3State";
import {
  executeTool,
  TOOL_DEFINITIONS,
  toolAllowedForStage,
  validateToolCall,
} from "./agentV3ToolRouter";
import type { AgentV3BrainPort } from "./agentV3BrainAdapter";
import { transcriptWindowFromState } from "./agentV3BrainAdapter";
import { buildMemoryHintsForModel } from "./agentV3Memory";
import {
  clampSignalsExtracted,
  isIntentConfidentEnough,
  validateIntent,
} from "./agentV3IntentContract";
import { AGENT_V3_SYSTEM_PROMPT } from "./agentV3SystemPrompt";
import type {
  AgentV3LeadAnswers,
  AgentV3NextBestAction,
  AgentV3OrchestratorInput,
  AgentV3OrchestratorOutput,
  AgentV3SessionState,
  LoHandoffPayload,
  QuickReplyTarget,
  ToolCall,
  ToolResult,
  WidgetRequest,
} from "./agentV3Types";
import type { AgentV3AgentMode } from "./agentV3Types";

export type RunAgentV3Options = {
  brain?: AgentV3BrainPort;
  /** When true and brain is set, use the model for discovery replies */
  useLlm?: boolean;
  /** Pass through when OPENAI_AGENT_V3_USE_CONVERSATION_STATE is enabled */
  chainConversation?: boolean;
  /** Dev-only: populate `debug` on the orchestrator output */
  includeDebugMetadata?: boolean;
};

function attachOrchestratorDebug(
  out: AgentV3OrchestratorOutput,
  include: boolean | undefined,
  state: AgentV3SessionState,
  executed: { call: ToolCall; result: ToolResult }[],
  mode: AgentV3AgentMode,
  extras?: { modelUsed?: string; responseId?: string; usedConversationState?: boolean },
): AgentV3OrchestratorOutput {
  if (!include) return out;
  return {
    ...out,
    debug: {
      mode,
      modelUsed: extras?.modelUsed,
      responseId: extras?.responseId,
      usedConversationState: extras?.usedConversationState,
      toolCallsExecuted: executed.map((e) => e.call.name),
      guardrailFlags: [...state.complianceFlags],
    },
  };
}

function asV2(a: AgentV3LeadAnswers): AgentV2Answers {
  return a as AgentV2Answers;
}

function widgetForKey(key: string, answers: AgentV3LeadAnswers): WidgetRequest | null {
  const ts = Date.now();
  if (key === "goal")
    return { id: `w_g_${ts}`, kind: "quick_replies", data: { options: [...GOAL_OPTIONS], targetField: "goal" } };
  if (key === "timeline")
    return { id: `w_t_${ts}`, kind: "quick_replies", data: { options: [...TIMELINE_OPTIONS], targetField: "timeline" } };
  if (key === "priceRange")
    return { id: `w_p_${ts}`, kind: "quick_replies", data: { options: [...PRICE_OPTIONS], targetField: "priceRange" } };
  if (key === "propertyValueRange")
    return {
      id: `w_pv_${ts}`,
      kind: "quick_replies",
      data: { options: [...PRICE_OPTIONS], targetField: "propertyValueRange" },
    };
  if (key === "creditRange")
    return { id: `w_c_${ts}`, kind: "quick_replies", data: { options: [...CREDIT_OPTIONS], targetField: "creditRange" } };
  if (key === "financialComfort")
    return {
      id: `w_f_${ts}`,
      kind: "quick_replies",
      data: { options: [...FINANCIAL_COMFORT_OPTIONS], targetField: "financialComfort" },
    };
  if (key === "contactPreference")
    return {
      id: `w_cp_${ts}`,
      kind: "quick_replies",
      data: { options: [...CONTACT_PREF_OPTIONS], targetField: "contactPreference" },
    };
  if (key === "propertyInMind")
    return {
      id: `w_pim_${ts}`,
      kind: "quick_replies",
      data: { options: [...PROPERTY_IN_MIND_OPTIONS], targetField: "propertyInMind" },
    };
  return null;
}

/** Widget chips when the LLM explicitly wants shortcuts; otherwise null = natural-language-only turn. */
function pickWidgetFromLlmIntent(
  intent: AgentV3NextBestAction,
  nkAfter: string | null,
  answers: AgentV3LeadAnswers,
): WidgetRequest | null {
  if (intent.nextAction === "answer_question" || intent.nextAction === "reassure") {
    return intent.suggestQuickReplies && nkAfter ? widgetForKey(nkAfter, answers) : null;
  }
  if (intent.nextAction === "proceed_to_scheduling") {
    return null;
  }
  if (intent.suggestQuickReplies && nkAfter) {
    return widgetForKey(nkAfter, answers);
  }
  return null;
}

function recapWidget(state: AgentV3SessionState): WidgetRequest {
  const a = state.answers;
  const loc =
    a.subjectPropertyAddress?.trim() ||
    [a.subjectCity, a.subjectState, a.subjectZip].filter(Boolean).join(", ") ||
    "—";
  return {
    id: `w_recap_${Date.now()}`,
    kind: "recap",
    data: {
      lines: [
        { label: "Goal", value: a.goal ?? "—" },
        { label: "Timeline", value: a.timeline ?? "—" },
        { label: "Range", value: a.priceRange ?? a.propertyValueRange ?? "—" },
        { label: "Credit", value: a.creditRange ?? "—" },
        { label: "Comfort", value: a.financialComfort ?? "—" },
        { label: "Location", value: loc },
      ],
    },
  };
}

/** Initial session open — call once when CTA opens. */
export function runAgentV3Welcome(
  sessionId: string,
  pageContext: string,
  opts?: { includeDebugMetadata?: boolean },
): AgentV3OrchestratorOutput {
  let state = initialAgentV3Session(sessionId, pageContext);
  const m1 = makeMessage(
    "assistant",
    "Hi — thanks for being here. I’d love to understand what you’re hoping to do next, and we can take it at whatever pace feels right. Are you mainly thinking about buying, refinancing, or still exploring?",
    { source: "brain" },
  );
  const w: WidgetRequest = {
    id: `w_goal_${Date.now()}`,
    kind: "quick_replies",
    data: { options: [...GOAL_OPTIONS], targetField: "goal" satisfies QuickReplyTarget },
  };
  state = appendTranscript(state, [m1, makeWidgetItem("quick_replies", (w as WidgetRequest).data)]);
  state = { ...state, stage: "discovery", dialogueTurn: 1, activeWidget: w };
  const out: AgentV3OrchestratorOutput = {
    assistantMessages: [m1, makeWidgetItem("quick_replies", w.data) as import("./agentV3Types").TranscriptItem],
    statePatch: state,
    widgetRequest: w,
  };
  return attachOrchestratorDebug(out, opts?.includeDebugMetadata, state, [], "agent_v3_deterministic", {});
}

function toolCtx(state: AgentV3SessionState, clientTz?: string) {
  return {
    answers: state.answers,
    sessionId: state.sessionId,
    pageContext: state.pageContext,
    clientTimeZone: clientTz,
  };
}

function runTool(call: ToolCall, state: AgentV3SessionState, clientTz?: string): ToolResult {
  return executeTool(call, toolCtx(state, clientTz));
}

async function runLlmDiscovery(
  state: AgentV3SessionState,
  turn: { type: "text"; text: string } | { type: "quick_reply"; option: string; target: QuickReplyTarget },
  nkFallbackHint: string,
  pageContext: string,
  clientTimeZone: string | undefined,
  brain: AgentV3BrainPort,
  chainConversation: boolean,
  executed: { call: ToolCall; result: ToolResult }[],
): Promise<{
  state: AgentV3SessionState;
  assistantText: string;
  intent: AgentV3NextBestAction | null;
  intentValid: boolean;
  pdfBlobUrl: string | null;
  lastResponseId: string | null;
  modelUsed?: string;
}> {
  let s = state;
  let pdfBlobUrl: string | null = null;
  const userTurnText = turn.type === "text" ? turn.text : turn.option;
  const userTurnLabel = turn.type === "text" ? "text" : `quick_reply:${turn.target}`;

  const memoryBlock = buildMemoryHintsForModel(s, undefined, nkFallbackHint);
  const transcriptWindow = transcriptWindowFromState(s);

  let brainRes = await brain.completeTurn({
    systemPrompt: AGENT_V3_SYSTEM_PROMPT,
    memoryBlock,
    transcriptWindow,
    userTurnText,
    userTurnLabel,
    availableTools: TOOL_DEFINITIONS,
    chainConversation,
    previousResponseId: s.openaiLastResponseId ?? undefined,
  });

  if (brainRes.finishState === "error" || brainRes.error) {
    s = {
      ...s,
      complianceFlags: [...s.complianceFlags, "llm:error"],
    };
    return {
      state: s,
      assistantText:
        "I can still help you move this forward in a simpler guided format. Tell me if you’re buying, refinancing, or still exploring.",
      intent: null,
      intentValid: false,
      pdfBlobUrl: null,
      lastResponseId: null,
      modelUsed: brainRes.modelUsed,
    };
  }

  let lastId = brainRes.rawResponseId ?? null;
  let round = 0;
  const maxRounds = 2;

  while (brainRes.requestedToolCalls.length > 0 && round < maxRounds) {
    round += 1;
    const outputs: Array<{ call_id: string; outputJson: unknown }> = [];

    for (const call of brainRes.requestedToolCalls) {
      const v = validateToolCall(call);
      if (v.ok === false) {
        s = {
          ...s,
          complianceFlags: [...s.complianceFlags, `tool:rejected:${call.name}`],
        };
        outputs.push({
          call_id: call.id,
          outputJson: { ok: false, error: v.error, code: v.code },
        });
        continue;
      }
      if (!toolAllowedForStage(call.name, s.stage, s)) {
        s = { ...s, complianceFlags: [...s.complianceFlags, `tool:stage_block:${call.name}`] };
        outputs.push({
          call_id: call.id,
          outputJson: { ok: false, error: "stage_mismatch", code: "stage" },
        });
        continue;
      }
      const r = runTool(call, s, clientTimeZone);
      executed.push({ call, result: r });
      outputs.push({
        call_id: call.id,
        outputJson:
          r.ok === true ? r.data : { ok: false, error: r.error, code: r.code ?? "execution" },
      });

      if (call.name === "action.generate_pdf_summary" && r.ok) {
        const pdfDoc = buildPdfSummaryDocument(
          s.sessionId,
          pageContext,
          s.answers,
          s.userConcerns,
          s.userQuestions,
          s.complianceFlags,
          undefined,
        );
        const blob = renderPdfSummaryToBlob(pdfDoc);
        pdfBlobUrl = createPdfObjectUrl(blob);
      }
    }

    if (!brainRes.rawResponseId) break;

    brainRes = await brain.continueAfterToolOutputs(
      AGENT_V3_SYSTEM_PROMPT,
      brainRes.rawResponseId,
      outputs,
    );
    lastId = brainRes.rawResponseId ?? lastId;

    if (brainRes.finishState === "error" || brainRes.error) break;
  }

  const rawDisplay =
    brainRes.assistantDisplayText?.trim() ||
    brainRes.assistantMessages.map((m) => m.text).join("\n").trim();
  const intent = brainRes.intent ?? null;

  let assistantText = rawDisplay;
  if (intent && validateIntent(intent) && isIntentConfidentEnough(intent)) {
    if (!assistantText.trim() && intent.answer?.trim()) assistantText = intent.answer.trim();
    if (!assistantText.trim() && intent.question?.trim()) assistantText = intent.question.trim();
  }

  let intentValid = !!(
    intent &&
    validateIntent(intent) &&
    isIntentConfidentEnough(intent) &&
    assistantText.trim()
  );

  if (brainRes.finishState === "error" || brainRes.error) {
    intentValid = false;
  }

  if (intentValid && intent?.signalsExtracted) {
    const clamped = clampSignalsExtracted(intent.signalsExtracted);
    if (Object.keys(clamped).length) {
      s.answers = mergeAnswers(s.answers, clamped as Partial<AgentV3LeadAnswers>);
      s.requiredSignalsCaptured = updateRequiredSignals(asV2(s.answers), s.requiredSignalsCaptured);
    }
  }

  if (!intentValid) {
    return {
      state: s,
      assistantText: "",
      intent: intent ?? null,
      intentValid: false,
      pdfBlobUrl,
      lastResponseId: lastId,
      modelUsed: brainRes.modelUsed,
    };
  }

  const ag = classifyAssistantGuardrail(assistantText);
  const sanitized = sanitizeAssistantForUi(assistantText, ag, s.complianceFlags);
  assistantText = sanitized.text;
  s = { ...s, complianceFlags: sanitized.flags };

  if (chainConversation && lastId) {
    s = { ...s, openaiLastResponseId: lastId };
  }

  return {
    state: s,
    assistantText,
    intent: intent!,
    intentValid: true,
    pdfBlobUrl,
    lastResponseId: lastId,
    modelUsed: brainRes.modelUsed,
  };
}

export async function runAgentV3Turn(
  input: AgentV3OrchestratorInput,
  options?: RunAgentV3Options,
): Promise<AgentV3OrchestratorOutput> {
  const { state: prev, pageContext, clientTimeZone } = input;
  let state = { ...prev };
  const executed: { call: ToolCall; result: ToolResult }[] = [];
  let pdfBlobUrl: string | null = null;
  let loHandoffPayload: LoHandoffPayload | null = null;

  const turn = input.turn;
  const useLlm = !!(options?.useLlm && options?.brain);
  const incl = options?.includeDebugMetadata;

  if (turn.type === "edit_recap_field") {
    const inv = applyRecapEditInvalidation(asV2(state.answers), turn.field);
    state.answers = inv.answers as AgentV3LeadAnswers;
    state.requiredSignalsCaptured = updateRequiredSignals(asV2(state.answers), state.requiredSignalsCaptured);
    state.stage = "discovery";
    state.recapStatus = "edited";
  } else if (turn.type === "quick_reply") {
    const target = turn.target as string;
    const field =
      target === "priceRange" && state.answers.goal === "Refinance"
        ? "propertyValueRange"
        : target === "propertyValueRange"
          ? "propertyValueRange"
          : target;
    state.answers = mergeAnswers(state.answers, { [field]: turn.option } as Partial<AgentV3LeadAnswers>);
    state.requiredSignalsCaptured = updateRequiredSignals(asV2(state.answers), state.requiredSignalsCaptured);
    state.transcript = [...state.transcript, makeMessage("user", turn.option)];
    state.dialogueTurn += 1;
  } else if (turn.type === "text") {
    const text = turn.text.trim();
    state.transcript = [...state.transcript, makeMessage("user", text)];
    state.dialogueTurn += 1;

    const gr = classifyGuardrail(text);
    const grOut = applyGuardrailToOutput(gr, state.complianceFlags);
    state.complianceFlags = grOut.flags;
    const guardMessages = grOut.messages;

    const interp = interpretUserMessage(text, asV2(state.answers));
    if (!guardrailBlocksToolUse(gr)) {
      state.answers = mergeAnswers(state.answers, interp.committed as Partial<AgentV3LeadAnswers>);
    }

    const locKey = locationMissingKey(asV2(state.answers));
    if (locKey === "subjectArea") Object.assign(state.answers, parseSubjectArea(text));
    else if (locKey === "subjectPropertyAddress" && text.length > 3)
      state.answers = mergeAnswers(state.answers, { subjectPropertyAddress: text });

    state.requiredSignalsCaptured = updateRequiredSignals(asV2(state.answers), state.requiredSignalsCaptured);

    if (interp.signalsUpdated === 0) state.lowConfidenceStreak += 1;
    else state.lowConfidenceStreak = 0;

    state.lastInterpreted = {
      ...interp.committed,
      confidence: interp.interpretationStrength === "strong" ? "high" : interp.signalsUpdated > 0 ? "medium" : "low",
      rawUserText: text,
    };

    if (/\?|how|what|worried|concern/i.test(text)) {
      state.userQuestions = [...state.userQuestions, text].slice(-20);
    }

    if (guardMessages.length) {
      state.transcript = [...state.transcript, ...guardMessages];
    }

    if (state.lowConfidenceStreak >= 2) {
      state.lastUnresolvedAmbiguity = "multiple unclear replies";
    }
  } else if (turn.type === "recap_continue") {
    state.stage = "contact_capture";
    const tSave: ToolCall = {
      id: `tl_${Date.now()}`,
      name: "action.save_partial_lead",
      arguments: { sessionId: state.sessionId, answers: state.answers },
    };
    const r = runTool(tSave, state, clientTimeZone);
    executed.push({ call: tSave, result: r });
    const w: WidgetRequest = { id: `w_contact_${Date.now()}`, kind: "contact_card", data: {} };
    state.activeWidget = w;
    state.recapStatus = "acknowledged";
    state.transcript = [
      ...state.transcript,
      makeMessage("assistant", "Share your details below — we’ll follow up the way you prefer.", { source: "tool" }),
      makeWidgetItem("contact_card", w.data),
    ];
    return attachOrchestratorDebug(
      {
        assistantMessages: state.transcript.slice(-2) as import("./agentV3Types").TranscriptItem[],
        statePatch: state,
        toolCallsExecuted: executed,
        widgetRequest: w,
      },
      incl,
      state,
      executed,
      "agent_v3_deterministic",
    );
  } else if (turn.type === "contact_submit") {
    state.answers = mergeAnswers(state.answers, turn.payload);
    state.requiredSignalsCaptured = updateRequiredSignals(asV2(state.answers), state.requiredSignalsCaptured);
    const v: ToolCall = {
      id: `tv_${Date.now()}`,
      name: "action.validate_contact",
      arguments: { email: state.answers.email, phone: state.answers.phone },
    };
    const vr = runTool(v, state, clientTimeZone);
    executed.push({ call: v, result: vr });

    const tz = resolveSchedulingTimezone(asV2(state.answers), clientTimeZone ?? "America/New_York");
    state.answers = mergeAnswers(state.answers, { schedulingTimezoneUsed: tz });
    const slotPack = generateSlotsForPreference(state.answers.preferredContactTime, tz);
    state.stage = "scheduling";
    const w: WidgetRequest = {
      id: `w_sched_${Date.now()}`,
      kind: "schedule_card",
      data: {
        slots: slotPack.slots,
        scheduleNote: slotPack.scheduleNote,
        timezone: slotPack.timezone,
        timezoneLabel: slotPack.timezoneLabel,
        preferredContactTime: state.answers.preferredContactTime,
      },
    };
    state.activeWidget = w;
    state.transcript = [
      ...state.transcript,
      makeMessage(
        "assistant",
        `Pick a time that works — times are in your local zone (${slotPack.timezoneLabel}).`,
        { source: "tool" },
      ),
      makeWidgetItem("schedule_card", w.data),
    ];
    return attachOrchestratorDebug(
      {
        assistantMessages: state.transcript.slice(-2) as import("./agentV3Types").TranscriptItem[],
        statePatch: state,
        toolCallsExecuted: executed,
        widgetRequest: w,
      },
      incl,
      state,
      executed,
      "agent_v3_deterministic",
    );
  } else if (turn.type === "schedule_select") {
    state.answers = mergeAnswers(state.answers, { appointmentSlot: turn.slot });
    const book: ToolCall = {
      id: `tb_${Date.now()}`,
      name: "action.book_schedule_slot",
      arguments: { slotLabel: turn.slot, sessionId: state.sessionId },
    };
    const br = runTool(book, state, clientTimeZone);
    executed.push({ call: book, result: br });

    const pdfDoc = buildPdfSummaryDocument(
      state.sessionId,
      pageContext,
      state.answers,
      state.userConcerns,
      state.userQuestions,
      state.complianceFlags,
      undefined,
    );
    const blob = renderPdfSummaryToBlob(pdfDoc);
    pdfBlobUrl = createPdfObjectUrl(blob);

    const handoff: ToolCall = {
      id: `th_${Date.now()}`,
      name: "action.send_lo_handoff",
      arguments: {
        sessionId: state.sessionId,
        payload: {
          summary: buildLoConsultationSummary(state.answers, pageContext),
          answers: state.answers,
        },
      },
    };
    const hr = runTool(handoff, state, clientTimeZone);
    executed.push({ call: handoff, result: hr });

    loHandoffPayload = {
      sessionId: state.sessionId,
      pageContext,
      summaryText: buildLoConsultationSummary(state.answers, pageContext),
      answers: { ...state.answers },
      complianceFlags: state.complianceFlags,
      createdAt: nowIso(),
    };

    state.stage = "confirmation";
    const conf: WidgetRequest = {
      id: `w_conf_${Date.now()}`,
      kind: "confirmation",
      data: {
        slot: turn.slot,
        name: state.answers.firstName,
        email: state.answers.email,
        phone: state.answers.phone,
        contactPreference: state.answers.contactPreference,
        preferredContactTime: state.answers.preferredContactTime,
        schedulingTimezoneUsed: state.answers.schedulingTimezoneUsed,
        subjectPropertyAddress: state.answers.subjectPropertyAddress,
        subjectCity: state.answers.subjectCity,
        subjectState: state.answers.subjectState,
        subjectZip: state.answers.subjectZip,
      },
    };
    state.activeWidget = conf;
    state.transcript = [
      ...state.transcript,
      makeMessage("assistant", "You’re set — we’ll see you then. You’ll get a confirmation with the details.", {
        source: "brain",
      }),
      makeWidgetItem("confirmation", conf.data),
    ];
    return attachOrchestratorDebug(
      {
        assistantMessages: state.transcript.slice(-2) as import("./agentV3Types").TranscriptItem[],
        statePatch: state,
        toolCallsExecuted: executed,
        widgetRequest: conf,
        pdfBlobUrl,
        loHandoffPayload,
      },
      incl,
      state,
      executed,
      "agent_v3_deterministic",
    );
  }

  const persona = inferConversationPersona(asV2(state.answers));
  /** Structured-flow hint only; LLM path uses this as fallback, not as mandatory next field. */
  const nkFallback = nextMissingSignalKey(state.requiredSignalsCaptured, asV2(state.answers));

  if (!nkFallback) {
    state.stage = "summary_ready";
    state.recapStatus = "shown";
    const rw = recapWidget(state);
    state.activeWidget = rw;
    const msg = makeMessage(
      "assistant",
      "Here’s what I have so far. When you’re ready, continue and we’ll grab how to reach you.",
      { source: "brain" },
    );
    state.transcript = [...state.transcript, msg, makeWidgetItem("recap", rw.data)];
    return attachOrchestratorDebug(
      {
        assistantMessages: [msg, makeWidgetItem("recap", rw.data) as import("./agentV3Types").TranscriptItem],
        statePatch: state,
        widgetRequest: rw,
      },
      incl,
      state,
      executed,
      "agent_v3_deterministic",
    );
  }

  if (state.lowConfidenceStreak >= 2 && nkFallback) {
    const fb: WidgetRequest = {
      id: `w_fb_${Date.now()}`,
      kind: "fallback",
      data: {
        title: "Try guided steps",
        cta: "Continue with guided steps",
      },
    };
    state.stage = "fallback_guided";
    state.activeWidget = fb;
    const msg = makeMessage(
      "assistant",
      "If you’d rather keep this simple, I can switch to a more structured guided format — same end goal, just less back-and-forth.",
      { source: "guardrail" },
    );
    state.transcript = [...state.transcript, msg, makeWidgetItem("fallback", fb.data)];
    return attachOrchestratorDebug(
      {
        assistantMessages: [msg, makeWidgetItem("fallback", fb.data) as import("./agentV3Types").TranscriptItem],
        statePatch: state,
        widgetRequest: fb,
      },
      incl,
      state,
      executed,
      "agent_v3_deterministic",
    );
  }

  if (
    useLlm &&
    options?.brain &&
    (turn.type === "text" || turn.type === "quick_reply") &&
    nkFallback
  ) {
    try {
      const llm = await runLlmDiscovery(
        state,
        turn,
        nkFallback,
        pageContext,
        clientTimeZone,
        options.brain,
        !!options.chainConversation,
        executed,
      );
      if (llm.intentValid) {
        state = llm.state;
        if (llm.pdfBlobUrl) pdfBlobUrl = llm.pdfBlobUrl;

        const nkAfter = nextMissingSignalKey(state.requiredSignalsCaptured, asV2(state.answers));

        if (!nkAfter) {
          state.stage = "summary_ready";
          state.recapStatus = "shown";
          const outMsg = makeMessage("assistant", llm.assistantText, { source: "brain" });
          const rw = recapWidget(state);
          state.activeWidget = rw;
          state.transcript = [...state.transcript, outMsg, makeWidgetItem("recap", rw.data)];
          return attachOrchestratorDebug(
            {
              assistantMessages: [
                outMsg,
                makeWidgetItem("recap", rw.data) as import("./agentV3Types").TranscriptItem,
              ],
              statePatch: state,
              widgetRequest: rw,
              toolCallsExecuted: executed.length ? executed : undefined,
              pdfBlobUrl: pdfBlobUrl ?? undefined,
              loHandoffPayload: loHandoffPayload ?? undefined,
            },
            incl,
            state,
            executed,
            "agent_v3_live_llm",
            {
              modelUsed: llm.modelUsed,
              responseId: llm.lastResponseId ?? undefined,
              usedConversationState: !!options.chainConversation,
            },
          );
        }

        const outMsg = makeMessage("assistant", llm.assistantText, { source: "brain" });
        const w = pickWidgetFromLlmIntent(llm.intent!, nkAfter, state.answers);
        state.transcript = [...state.transcript, outMsg];
        if (w) {
          state.transcript = [...state.transcript, makeWidgetItem(w.kind, w.data)];
          state.activeWidget = w;
        } else {
          state.activeWidget = null;
        }
        const slice = w ? state.transcript.slice(-2) : [outMsg];
        return attachOrchestratorDebug(
          {
            assistantMessages: slice as import("./agentV3Types").TranscriptItem[],
            statePatch: state,
            widgetRequest: w ?? undefined,
            toolCallsExecuted: executed.length ? executed : undefined,
            pdfBlobUrl: pdfBlobUrl ?? undefined,
            loHandoffPayload: loHandoffPayload ?? undefined,
          },
          incl,
          state,
          executed,
          "agent_v3_live_llm",
          {
            modelUsed: llm.modelUsed,
            responseId: llm.lastResponseId ?? undefined,
            usedConversationState: !!options.chainConversation,
          },
        );
      }
      state = llm.state;
      if (llm.pdfBlobUrl) pdfBlobUrl = llm.pdfBlobUrl;
    } catch {
      state = { ...state, complianceFlags: [...state.complianceFlags, "llm:exception"] };
    }
  }

  const nk = nextMissingSignalKey(state.requiredSignalsCaptured, asV2(state.answers));
  const q = nk ? buildRedirectQuestion(nk, asV2(state.answers), persona) : "";
  const outMsg = makeMessage(
    "assistant",
    turn.type === "quick_reply" ? `${turn.option} — noted. ${q}` : q || "Tell me a bit more about what you’re trying to do — buying, refinancing, or still figuring it out?",
    { source: "brain" },
  );
  const w = nk ? widgetForKey(nk, state.answers) : null;
  state.transcript = [...state.transcript, outMsg];
  if (w) {
    state.transcript = [...state.transcript, makeWidgetItem(w.kind, w.data)];
    state.activeWidget = w;
  }

  const slice = w ? state.transcript.slice(-2) : [outMsg];
  return attachOrchestratorDebug(
    {
      assistantMessages: slice as import("./agentV3Types").TranscriptItem[],
      statePatch: state,
      widgetRequest: w,
      toolCallsExecuted: executed.length ? executed : undefined,
      pdfBlobUrl: pdfBlobUrl ?? undefined,
      loHandoffPayload: loHandoffPayload ?? undefined,
    },
    incl,
    state,
    executed,
    "agent_v3_deterministic",
  );
}
