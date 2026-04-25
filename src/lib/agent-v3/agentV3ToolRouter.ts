/**
 * Deterministic tool implementations. The LLM proposes calls; this router validates + executes.
 */
import type { FunctionTool } from "openai/resources/responses/responses";
import { resolveSchedulingTimezone } from "../agent-v2/agentV2Timezone";
import { parseSubjectArea } from "../agent-v2/agentV2Location";
import { generateSlotsForPreference } from "../agent-v2/agentV2Slots";
import type { AgentV3LeadAnswers, AgentV3Stage, AgentV3SessionState, ToolCall, ToolDefinition, ToolName, ToolResult } from "./agentV3Types";
import { nowIso } from "./agentV3State";

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: "retrieve.normalize_location",
    description: "Normalize free-text property or area into city/state/ZIP fields when possible.",
    parameters: {
      type: "object",
      properties: {
        raw: { type: "string", description: "User-entered address or area line" },
      },
      required: ["raw"],
    },
  },
  {
    name: "retrieve.infer_timezone",
    description: "Infer IANA timezone from ZIP or city/state for scheduling labels.",
    parameters: {
      type: "object",
      properties: {
        zip: { type: "string" },
        state: { type: "string" },
      },
    },
  },
  {
    name: "retrieve.faq_snippet",
    description: "Return a short internal FAQ/policy line (deterministic).",
    parameters: {
      type: "object",
      properties: {
        topic: { type: "string", enum: ["rates", "approval", "timing", "general"] },
      },
      required: ["topic"],
    },
  },
  {
    name: "action.save_partial_lead",
    description: "Persist or update lead record (session answers) — mock persistence.",
    parameters: {
      type: "object",
      properties: {
        sessionId: { type: "string" },
        answers: { type: "object" },
      },
      required: ["sessionId", "answers"],
    },
  },
  {
    name: "action.validate_contact",
    description: "Validate email/phone shape (deterministic).",
    parameters: {
      type: "object",
      properties: {
        email: { type: "string" },
        phone: { type: "string" },
      },
    },
  },
  {
    name: "action.fetch_schedule_slots",
    description: "Fetch available consultation slots for the user timezone.",
    parameters: {
      type: "object",
      properties: {
        preferredContactTime: { type: "string" },
        timezone: { type: "string" },
      },
    },
  },
  {
    name: "action.book_schedule_slot",
    description: "Book a consultation slot (idempotent mock).",
    parameters: {
      type: "object",
      properties: {
        slotLabel: { type: "string" },
        sessionId: { type: "string" },
      },
      required: ["slotLabel", "sessionId"],
    },
  },
  {
    name: "action.send_confirmation_email",
    description: "Queue confirmation email (mock).",
    parameters: {
      type: "object",
      properties: {
        email: { type: "string" },
        sessionId: { type: "string" },
      },
      required: ["email", "sessionId"],
    },
  },
  {
    name: "action.generate_pdf_summary",
    description: "Build LO PDF summary and render bytes for download.",
    parameters: {
      type: "object",
      properties: {
        sessionId: { type: "string" },
      },
      required: ["sessionId"],
    },
  },
  {
    name: "action.send_lo_handoff",
    description: "Send structured LO handoff payload to CRM/webhook (mock).",
    parameters: {
      type: "object",
      properties: {
        sessionId: { type: "string" },
        payload: { type: "object" },
      },
      required: ["sessionId", "payload"],
    },
  },
  {
    name: "orchestrate.resume_after_tool",
    description: "Mark conversation ready to continue after tool completion.",
    parameters: {
      type: "object",
      properties: { toolName: { type: "string" }, summary: { type: "string" } },
    },
  },
  {
    name: "orchestrate.trigger_fallback",
    description: "User prefers simpler guided flow.",
    parameters: { type: "object", properties: {} },
  },
  {
    name: "orchestrate.refresh_summary",
    description: "Signal that user-facing recap should refresh.",
    parameters: { type: "object", properties: {} },
  },
];

export type ToolContext = {
  answers: AgentV3LeadAnswers;
  sessionId: string;
  pageContext: string;
  clientTimeZone?: string;
};

const DEF_BY_NAME = new Map(TOOL_DEFINITIONS.map((d) => [d.name, d]));

export function buildOpenAITools(defs: ToolDefinition[] = TOOL_DEFINITIONS): FunctionTool[] {
  return defs.map((d) => ({
    type: "function",
    name: d.name,
    description: d.description,
    parameters: d.parameters as unknown as Record<string, unknown>,
    strict: false,
  }));
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validatePhone(phone: string): boolean {
  return phone.replace(/\D/g, "").length >= 10;
}

/** Minimal schema check — required keys present. */
export function validateToolCall(call: ToolCall): { ok: true } | { ok: false; error: string; code: string } {
  if (!isValidToolName(call.name)) {
    return { ok: false, error: `Unknown tool: ${call.name}`, code: "unknown_tool" };
  }
  const def = DEF_BY_NAME.get(call.name);
  if (!def?.parameters.required?.length) return { ok: true };
  for (const key of def.parameters.required) {
    if (call.arguments[key] === undefined || call.arguments[key] === null) {
      return { ok: false, error: `Missing argument: ${key}`, code: "invalid_args" };
    }
  }
  return { ok: true };
}

/** Server-side guard: block tools that do not match conversation stage. */
export function toolAllowedForStage(name: ToolName, stage: AgentV3Stage, state: AgentV3SessionState): boolean {
  if (name === "action.book_schedule_slot") {
    return stage === "scheduling" || stage === "contact_capture";
  }
  if (name === "action.fetch_schedule_slots") {
    return ["contact_capture", "scheduling", "summary_ready", "discovery"].includes(stage);
  }
  if (name === "action.validate_contact") {
    return stage === "contact_capture" || stage === "scheduling";
  }
  if (name === "action.generate_pdf_summary" || name === "action.send_lo_handoff") {
    return ["scheduling", "confirmation", "summary_ready", "contact_capture"].includes(stage);
  }
  if (name === "action.save_partial_lead") {
    return true;
  }
  if (name.startsWith("retrieve.")) return true;
  if (name.startsWith("orchestrate.")) return true;
  if (name === "action.send_confirmation_email") {
    return stage === "confirmation" || stage === "scheduling";
  }
  return true;
}

export function executeTool(call: ToolCall, ctx: ToolContext): ToolResult {
  const args = call.arguments;
  try {
    switch (call.name) {
      case "retrieve.normalize_location": {
        const raw = String(args["raw"] ?? "");
        const parsed = parseSubjectArea(raw);
        return { ok: true, data: { normalized: parsed, raw } };
      }
      case "retrieve.infer_timezone": {
        const zip = String(args["zip"] ?? ctx.answers.subjectZip ?? "");
        const state = String(args["state"] ?? ctx.answers.subjectState ?? "");
        const tz = resolveSchedulingTimezone(
          { ...ctx.answers, subjectZip: zip || ctx.answers.subjectZip, subjectState: state || ctx.answers.subjectState },
          ctx.clientTimeZone ?? "America/New_York",
        );
        return { ok: true, data: { timezone: tz } };
      }
      case "retrieve.faq_snippet": {
        const topic = String(args["topic"] ?? "general");
        const snippets: Record<string, string> = {
          rates:
            "Rates move with markets, loan type, and your file. Your loan officer will give numbers you can rely on.",
          approval: "Approval depends on income, assets, credit, and property — reviewed in full application, not chat.",
          timing: "Timing is about your goals and prep — we align structure to your horizon.",
          general: "We keep this chat directional; specifics belong in consultation with a licensed advisor.",
        };
        return { ok: true, data: { text: snippets[topic] ?? snippets["general"] } };
      }
      case "action.save_partial_lead": {
        return { ok: true, data: { savedAt: nowIso(), sessionId: String(args["sessionId"] ?? ctx.sessionId) } };
      }
      case "action.validate_contact": {
        const email = String(args["email"] ?? ctx.answers.email ?? "");
        const phone = String(args["phone"] ?? ctx.answers.phone ?? "");
        const emailOk = !email || validateEmail(email);
        const phoneOk = !phone || validatePhone(phone);
        return { ok: true, data: { emailOk, phoneOk, valid: emailOk && phoneOk } };
      }
      case "action.fetch_schedule_slots": {
        const pref = (args["preferredContactTime"] as string) ?? ctx.answers.preferredContactTime;
        const tz = String(args["timezone"] ?? ctx.answers.schedulingTimezoneUsed ?? "America/New_York");
        const pack = generateSlotsForPreference(pref, tz);
        return {
          ok: true,
          data: { slots: pack.slots, timezone: pack.timezone, timezoneLabel: pack.timezoneLabel },
        };
      }
      case "action.book_schedule_slot": {
        const slotLabel = String(args["slotLabel"] ?? "");
        return { ok: true, data: { booked: true, slotLabel, at: nowIso() } };
      }
      case "action.send_confirmation_email": {
        return { ok: true, data: { queued: true, to: String(args["email"] ?? "") } };
      }
      case "action.generate_pdf_summary":
        return { ok: true, data: { ready: true, sessionId: String(args["sessionId"] ?? ctx.sessionId) } };
      case "action.send_lo_handoff":
        return { ok: true, data: { delivered: true, mock: true } };
      case "orchestrate.resume_after_tool":
        return { ok: true, data: { resume: true } };
      case "orchestrate.trigger_fallback":
        return { ok: true, data: { fallback: true } };
      case "orchestrate.refresh_summary":
        return { ok: true, data: { summary: true } };
      default:
        return { ok: false, error: `Unknown tool: ${call.name}`, code: "unknown_tool" };
    }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "tool_error", code: "execution" };
  }
}

export function isValidToolName(name: string): name is ToolName {
  return TOOL_DEFINITIONS.some((d) => d.name === name);
}
