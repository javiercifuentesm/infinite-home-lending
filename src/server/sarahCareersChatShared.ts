import { escapeHtml } from "./mortgageConciergeSendLeadRoute";

export const RESEND_API = "https://api.resend.com/emails";
export const LEAD_EMAIL =
  process.env.LEAD_ADVISOR_EMAIL ?? "javier.cifuentes@infinitehomelending.com";

export const LEAD_MARKER_RE = /\[\[CAREERS_LEAD:(\{[\s\S]*?\})\]\]/;

export type CareersLead = {
  name: string;
  background: string;
  nmls: string;
  experience: string;
  email?: string;
  phone?: string;
  market?: string;
  exploring?: string;
};

export type ApiMessage = {
  role: "user" | "assistant";
  content: string;
};

export function stripLeadMarker(text: string): string {
  return text.replace(LEAD_MARKER_RE, "").trimEnd();
}

export function parseLeadMarker(
  text: string,
  options?: { requireCoreFields?: boolean },
): CareersLead | null {
  const requireCore = options?.requireCoreFields !== false;
  const match = text.match(LEAD_MARKER_RE);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[1]) as Partial<CareersLead>;
    if (
      requireCore &&
      (!parsed.name || !parsed.background || !parsed.nmls || !parsed.experience)
    ) {
      return null;
    }
    if (!parsed.name) return null;
    return {
      name: String(parsed.name).trim(),
      background: String(parsed.background ?? "").trim(),
      nmls: String(parsed.nmls ?? "").trim(),
      experience: String(parsed.experience ?? "").trim(),
      email: parsed.email ? String(parsed.email).trim() : undefined,
      phone: parsed.phone ? String(parsed.phone).trim() : undefined,
      market: parsed.market ? String(parsed.market).trim() : undefined,
      exploring: parsed.exploring ? String(parsed.exploring).trim() : undefined,
    };
  } catch {
    return null;
  }
}

export function buildTranscript(messages: ApiMessage[]): string {
  return messages
    .map((m) => {
      const text = typeof m.content === "string" ? m.content : "";
      const speaker = m.role === "assistant" ? "Sarah" : "Visitor";
      return `${speaker}: ${text}`;
    })
    .join("\n\n");
}

type LeadEmailOptions = {
  subjectPrefix: string;
  logTag: string;
};

export async function sendCareersChatLeadEmail(
  lead: CareersLead,
  transcript: string,
  options: LeadEmailOptions,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(`[${options.logTag}] RESEND_API_KEY not configured`);
    return;
  }

  const e = escapeHtml;
  const optionalRows = [
    lead.email
      ? `<tr><td style="padding:8px 0;color:#64748b;">Email</td><td style="padding:8px 0;">${e(lead.email)}</td></tr>`
      : "",
    lead.phone
      ? `<tr><td style="padding:8px 0;color:#64748b;">Phone</td><td style="padding:8px 0;">${e(lead.phone)}</td></tr>`
      : "",
    lead.market
      ? `<tr><td style="padding:8px 0;color:#64748b;">Market</td><td style="padding:8px 0;">${e(lead.market)}</td></tr>`
      : "",
    lead.exploring
      ? `<tr><td style="padding:8px 0;color:#64748b;">Exploring</td><td style="padding:8px 0;">${e(lead.exploring)}</td></tr>`
      : "",
  ].join("");

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;color:#1e293b;">
      <h2 style="color:#0B2A4A;margin:0 0 16px;">${e(options.subjectPrefix)} — ${e(lead.name)}</h2>
      <table cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;line-height:1.6;">
        <tr><td style="padding:8px 0;color:#64748b;width:140px;">Name</td><td style="padding:8px 0;">${e(lead.name)}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Background</td><td style="padding:8px 0;">${e(lead.background)}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">NMLS</td><td style="padding:8px 0;">${e(lead.nmls || "—")}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Experience</td><td style="padding:8px 0;">${e(lead.experience)}</td></tr>
        ${optionalRows}
      </table>
      <p style="margin:20px 0 8px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">Conversation</p>
      <pre style="margin:0;font-size:12px;line-height:1.6;white-space:pre-wrap;font-family:Inter,Arial,sans-serif;">${e(transcript)}</pre>
    </div>
  `;

  const response = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "IHL Mortgage Concierge <sarah@update.infinitehomelending.com>",
      to: LEAD_EMAIL,
      subject: `${options.subjectPrefix} — ${lead.name}`,
      html,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error(`[${options.logTag}] Resend error:`, errText);
  }
}
