/** Agent V2 — orchestration contracts, state, transcript, widgets */

export type ConversationStage =
  | "welcome"
  | "discovery"
  | "clarification"
  | "summary"
  | "contact_capture"
  | "scheduling"
  | "confirmation"
  | "fallback_v1";

export type Readiness = "hot" | "warm" | "cold" | "unknown";

export type WidgetKind =
  | "quick_replies"
  | "recap"
  | "contact_card"
  | "schedule_card"
  | "confirmation"
  | "fallback";

export interface WidgetRequest {
  id: string;
  kind: WidgetKind;
  /** Widget-specific payload (options, recap lines, etc.) */
  data?: unknown;
}

export type ActionType =
  | "save_partial_intake"
  | "generate_summary"
  | "validate_contact_capture"
  | "fetch_schedule_slots"
  | "book_schedule_slot"
  | "submit_lead_packet"
  | "trigger_v1_fallback";

export interface ActionRequest {
  id: string;
  type: ActionType;
  payload?: unknown;
}

export type TranscriptItem =
  | {
      id: string;
      role: "assistant";
      kind: "message";
      text: string;
      timestamp: string;
    }
  | {
      id: string;
      role: "user";
      kind: "message";
      text: string;
      timestamp: string;
    }
  | {
      id: string;
      role: "assistant";
      kind: "widget";
      widgetType: WidgetKind;
      data?: unknown;
      timestamp: string;
    };

export interface AgentV2Answers {
  goal?: string;
  timeline?: string;
  priceRange?: string;
  propertyValueRange?: string;
  creditRange?: string;
  financialComfort?: string;
  /** Buy flow: "Yes" | "Not yet" */
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
  /** IANA TZ used when generating slot list */
  schedulingTimezoneUsed?: string;
  appointmentSlot?: string;
}

export interface RequiredSignalsCaptured {
  goal: boolean;
  timeline: boolean;
  range: boolean;
  contactMethod: boolean;
  contactInfo: boolean;
}

/** Recap row edit targets — maps to applyRecapEditInvalidation */
export type RecapEditableField = "goal" | "timeline" | "range" | "credit" | "comfort" | "location";

export type RecapLineRow = { label: string; value: string; field?: RecapEditableField };

export interface ConversationState {
  isOpen: boolean;
  sessionId: string;
  pageContext: string;
  stage: ConversationStage;
  transcript: TranscriptItem[];
  answers: AgentV2Answers;
  readiness: Readiness;
  openQuestions: string[];
  requiredSignalsCaptured: RequiredSignalsCaptured;
  activeWidget: WidgetRequest | null;
  activeAction: ActionRequest | null;
  isTyping: boolean;
  hasFreeformQuestion: boolean;
  complianceFlags: string[];
  fallbackReason?: string;
  /** Conversational engine: consecutive unclear user turns */
  ambiguousStreak?: number;
  /** Compliance / recovery: repeated off-scope requests */
  offTopicStreak?: number;
  /** Last response-engine move (debug / analytics) */
  lastEngineMove?: string;
  /** Monotonic assistant turns in this session (variation + pacing) */
  dialogueTurnCount?: number;
  /** Phrase ids already used — avoid repeating openers in one session */
  phraseUsageIds?: string[];
  /** Lightweight inferred style for tone (no UI) */
  inferredPersona?: "exploratory" | "uncertain" | "decisive" | "neutral";
  /** Last composite open-text prompt we asked (extract both from next reply) */
  pendingComposite?: "timeline_range" | "credit_comfort" | null;
  /** Browser/client timezone for scheduling labels */
  clientTimeZone?: string;
  /** Last recap field the user chose to revise */
  lastEditedField?: RecapEditableField;
  /** Answer keys cleared on last edit (analytics / recovery) */
  fieldsInvalidatedByEdit?: string[];
  /** User revised answers after summary — refresh summary when they reach it again */
  needsSummaryRefresh?: boolean;
}

/** Orchestrator boundary — future OpenAI Agents SDK replaces mock implementation */
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

export type OrchestratorAction =
  | { type: "recap_continue" }
  | { type: "contact_submit"; payload: Partial<AgentV2Answers> }
  /** Merge into answers without a conversational turn — keeps contact form fields in canonical state */
  | { type: "contact_answers_patch"; payload: Partial<AgentV2Answers> }
  | { type: "schedule_select"; slot: string }
  | { type: "open_v1_fallback" }
  | { type: "edit_recap_field"; field: RecapEditableField };

export interface AgentV2OrchestratorInput {
  userMessage?: string;
  selectedOption?: string;
  /** Set when submitting a quick reply so the mock knows which field to fill */
  quickReplyTarget?: QuickReplyTarget;
  actionResult?: unknown;
  orchestratorAction?: OrchestratorAction;
  state: ConversationState;
}

export interface AgentV2OrchestratorOutput {
  assistantMessages: TranscriptItem[];
  statePatch?: Partial<ConversationState>;
  widgetRequest?: WidgetRequest | null;
  actionRequest?: ActionRequest | null;
  shouldFallback?: boolean;
  fallbackReason?: string;
}

export interface AgentV2LeadPacket {
  leadType: "mortgage_consultation";
  source: "website_agent_v2";
  pageContext: string;
  sessionId: string;
  createdAt: string;
  readiness: Readiness;
  answers: AgentV2Answers;
  userFacingSummary: string;
  internalLeadSummary: string;
  complianceNotes: string[];
}

export type UserInputClassification =
  | "mortgage_question_safe"
  | "goal_answer"
  | "timeline_answer"
  | "credit_answer"
  | "contact_preference_answer"
  | "range_answer"
  | "off_topic"
  | "fallback_request"
  | "unknown";
