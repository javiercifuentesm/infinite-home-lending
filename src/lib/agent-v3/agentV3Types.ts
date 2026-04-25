/**
 * Agent V3 — single-agent system contracts (brain + memory + tools + guardrails).
 * Widget kinds align with Agent V2 shell where possible for reuse.
 */
import type { RecapEditableField, RequiredSignalsCaptured } from "../agent-v2/agentV2Types";

export type AgentV3AgentMode = "agent_v3_live_llm" | "agent_v3_deterministic";

/** Why the server used deterministic orchestration instead of the live brain (dev/debug only). */
export type AgentV3DebugFallbackReason =
  | "missing_openai_key"
  | "forced_deterministic"
  | "brain_init_failed"
  | "api_mode_disabled"
  | "unknown";

/** Full shape returned on /api/agent-v3/* when debug is enabled */
export type AgentV3ApiDebug = {
  mode: AgentV3AgentMode;
  modelUsed?: string;
  responseId?: string;
  toolCallsExecuted?: string[];
  guardrailFlags?: string[];
  usedConversationState?: boolean;
  /** Present when mode is deterministic and a live path was skipped or failed */
  fallbackReason?: AgentV3DebugFallbackReason;
};

/** Partial debug fields produced by the orchestrator (mode may be finalized in the route). */
export type AgentV3OrchestratorDebug = {
  mode: AgentV3AgentMode;
  modelUsed?: string;
  responseId?: string;
  toolCallsExecuted?: string[];
  guardrailFlags?: string[];
  usedConversationState?: boolean;
};

export type { RequiredSignalsCaptured };
export type { RecapEditableField };

export type AgentV3Stage =
  | "greeting"
  | "discovery"
  | "clarification"
  | "summary_ready"
  | "contact_capture"
  | "scheduling"
  | "confirmation"
  | "completed"
  | "fallback_guided";

export type UncertaintyLevel = "low" | "medium" | "high" | "unknown";

export type RecapStatus = "none" | "shown" | "acknowledged" | "edited";

/** Last structured interpretation pass (deterministic layer; LLM may augment) */
export type LastInterpretedSignals = {
  goal?: string;
  timeline?: string;
  priceRange?: string;
  propertyValueRange?: string;
  creditRange?: string;
  financialComfort?: string;
  confidence: "high" | "medium" | "low";
  rawUserText?: string;
};

export type LeadRecordPayload = {
  sessionId: string;
  pageContext: string;
  answers: AgentV3LeadAnswers;
  createdAt: string;
  updatedAt: string;
};

export type AgentV3LeadAnswers = {
  goal?: string;
  timeline?: string;
  priceRange?: string;
  propertyValueRange?: string;
  creditRange?: string;
  financialComfort?: string;
  propertyInMind?: string;
  subjectPropertyAddress?: string;
  subjectCity?: string;
  subjectState?: string;
  subjectZip?: string;
  contactPreference?: string;
  firstName?: string;
  email?: string;
  phone?: string;
  preferredContactTime?: string;
  schedulingTimezoneUsed?: string;
  appointmentSlot?: string;
};

/** Every LLM turn in live mode should declare what it is doing (parsed from JSON footer). */
export type AgentV3NextAction =
  | "ask_question"
  | "clarify"
  | "reassure"
  | "summarize"
  | "proceed_to_scheduling"
  | "answer_question";

export type AgentV3NextBestAction = {
  reasoning: string;
  nextAction: AgentV3NextAction;
  /** Natural follow-up question (when asking/clarifying) */
  question?: string;
  /** Direct answer when answering a user question or reassurance */
  answer?: string;
  /** 0–1 confidence in this turn’s interpretation and chosen next action */
  confidence: number;
  /** Normalized fields inferred from messy user text (orchestrator merges after validation) */
  signalsExtracted?: Partial<AgentV3LeadAnswers>;
  /** When true and a field is still needed, optional quick-reply chips may be shown (never mandatory) */
  suggestQuickReplies?: boolean;
};

export type WidgetKind =
  | "quick_replies"
  | "recap"
  | "contact_card"
  | "schedule_card"
  | "confirmation"
  | "fallback";

export type QuickReplyTarget =
  | "goal"
  | "timeline"
  | "priceRange"
  | "propertyValueRange"
  | "creditRange"
  | "financialComfort"
  | "propertyInMind"
  | "contactPreference"
  | "preferredContactTime";

export type WidgetRequest = {
  id: string;
  kind: WidgetKind;
  data?: unknown;
};

export type TranscriptItem =
  | {
      id: string;
      role: "user" | "assistant";
      kind: "message";
      text: string;
      timestamp: string;
      meta?: { source?: "guardrail" | "tool" | "brain"; toolName?: string };
    }
  | {
      id: string;
      role: "assistant";
      kind: "widget";
      widgetType: WidgetKind;
      data?: unknown;
      timestamp: string;
    };

export type ToolName =
  | "retrieve.normalize_location"
  | "retrieve.infer_timezone"
  | "retrieve.faq_snippet"
  | "action.save_partial_lead"
  | "action.validate_contact"
  | "action.fetch_schedule_slots"
  | "action.book_schedule_slot"
  | "action.send_confirmation_email"
  | "action.generate_pdf_summary"
  | "action.send_lo_handoff"
  | "orchestrate.resume_after_tool"
  | "orchestrate.trigger_fallback"
  | "orchestrate.refresh_summary";

export type ToolCall = {
  id: string;
  name: ToolName;
  /** Deterministic JSON-serializable args — model proposes; router validates */
  arguments: Record<string, unknown>;
};

export type ToolResult =
  | { ok: true; data: unknown }
  | { ok: false; error: string; code?: string };

/** Single user interaction — text, quick reply, or structured action (mirrors shell events). */
export type AgentV3UserTurn =
  | { type: "text"; text: string }
  | { type: "quick_reply"; option: string; target: QuickReplyTarget }
  | { type: "recap_continue" }
  | { type: "contact_submit"; payload: Partial<AgentV3LeadAnswers> }
  | { type: "schedule_select"; slot: string }
  | { type: "edit_recap_field"; field: RecapEditableField };

export type AgentV3OrchestratorInput = {
  sessionId: string;
  /** CTA source / page id */
  pageContext: string;
  /** Full session state (memory + transcript pointers + stage) */
  state: AgentV3SessionState;
  turn: AgentV3UserTurn;
  /** Browser TZ for scheduling tools */
  clientTimeZone?: string;
};

export type AgentV3OrchestratorOutput = {
  assistantMessages: TranscriptItem[];
  statePatch: Partial<AgentV3SessionState>;
  toolCallsExecuted?: { call: ToolCall; result: ToolResult }[];
  widgetRequest?: WidgetRequest | null;
  /** PDF blob URL for download in UI (browser) — production may use signed URL */
  pdfBlobUrl?: string | null;
  /** Handoff payload for CRM/backend */
  loHandoffPayload?: LoHandoffPayload | null;
  /** Dev-only: when `includeDebugMetadata` is true on the orchestrator */
  debug?: AgentV3OrchestratorDebug;
};

export type LoHandoffPayload = {
  sessionId: string;
  pageContext: string;
  summaryText: string;
  pdfDocumentId?: string;
  answers: AgentV3LeadAnswers;
  complianceFlags: string[];
  createdAt: string;
};

/** Canonical session memory (brain reads/writes via state patch) */
export type AgentV3SessionState = {
  sessionId: string;
  pageContext: string;
  stage: AgentV3Stage;
  transcript: TranscriptItem[];
  answers: AgentV3LeadAnswers;
  /** Aligns with V2 flow engine for shared discovery order */
  requiredSignalsCaptured: RequiredSignalsCaptured;
  uncertaintyLevel: UncertaintyLevel;
  /** Topics the user raised — for LO prep */
  userConcerns: string[];
  userQuestions: string[];
  recapStatus: RecapStatus;
  lastInterpreted?: LastInterpretedSignals;
  lastUnresolvedAmbiguity?: string | null;
  /** Incremented when interpretation is weak repeatedly */
  lowConfidenceStreak: number;
  complianceFlags: string[];
  dialogueTurn: number;
  activeWidget: WidgetRequest | null;
  /** Last tool that completed (orchestrate.resume_after_tool uses) */
  pendingToolResume?: { toolName: ToolName; resultSummary: string } | null;
  /** Optional OpenAI Responses API chain id when OPENAI_AGENT_V3_USE_CONVERSATION_STATE is enabled */
  openaiLastResponseId?: string | null;
  /** Evaluation / analytics */
  evalTags?: string[];
};

export type ToolDefinition = {
  name: ToolName;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, { type: string; description?: string; enum?: string[] }>;
    required?: string[];
  };
};
