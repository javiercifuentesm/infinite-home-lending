/**
 * POST /api/request-a-call — phone-first call request form.
 * Resend advisor notification + HubSpot sync by normalized phone (no Brevo welcome email).
 */
import { Router } from "express";
import {
  getHubSpotContactRecordUrl,
  syncRequestACallHubSpotContact,
} from "./hubspotClient";
import { escapeHtml } from "./mortgageConciergeSendLeadRoute";
import { normalizePhone } from "./phoneUtils";

const RESEND_API = "https://api.resend.com/emails";
const LEAD_EMAIL =
  process.env.LEAD_ADVISOR_EMAIL ?? "javier.cifuentes@infinitehomelending.com";

const LOAN_PURPOSE_OPTIONS: Record<string, string> = {
  purchase: "Purchase",
  refinance: "Refinance",
  heloc: "HELOC",
  reverse: "Reverse Mortgage",
};

const BEST_DAY_OPTIONS = new Set([
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
]);

const BEST_TIME_OPTIONS = new Set([
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
]);

const LEAD_SOURCE_OPTIONS = new Set([
  "Facebook",
  "Instagram",
  "Google Search",
  "Referral – Friend or Family",
  "Realtor Referral",
  "Other Lending Professional",
  "Other",
]);

const UTM_PARAM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

const SMS_CONSENT_SOURCE = "/request-a-call";
const SMS_CONSENT_DISCLOSURE_VERSION = "IHL-SMS-v1-2026-08";

type SmsConsentRecord = {
  smsConsent: "Yes" | "No";
  smsConsentSource: string;
  smsConsentDisclosureVersion: string;
  smsConsentTimestamp: string;
};

function parseSmsConsent(body: Record<string, unknown>): boolean {
  return body.smsConsent === true;
}

function buildSmsConsentRecord(
  smsConsent: boolean,
  submissionTimestamp: string,
): SmsConsentRecord {
  return {
    smsConsent: smsConsent ? "Yes" : "No",
    smsConsentSource: SMS_CONSENT_SOURCE,
    smsConsentDisclosureVersion: SMS_CONSENT_DISCLOSURE_VERSION,
    smsConsentTimestamp: submissionTimestamp,
  };
}

type UtmParams = Partial<Record<(typeof UTM_PARAM_KEYS)[number], string>>;

function parseUtmParams(body: Record<string, unknown>): UtmParams {
  const utm: UtmParams = {};
  for (const key of UTM_PARAM_KEYS) {
    const value = String(body[key] ?? "").trim();
    if (value) utm[key] = value;
  }
  return utm;
}

function formatBestTimeToReach(bestDay: string, bestTime: string): string {
  return `${bestDay}, ${bestTime}`;
}

function validatePhone(phone: string): boolean {
  return normalizePhone(phone).length >= 10;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim();
  if (!trimmed) return { firstName: "Unknown", lastName: "" };
  const space = trimmed.indexOf(" ");
  if (space === -1) return { firstName: trimmed, lastName: "" };
  return {
    firstName: trimmed.slice(0, space).trim(),
    lastName: trimmed.slice(space + 1).trim(),
  };
}

async function sendRequestACallEmail(fields: {
  fullName: string;
  phone: string;
  email: string;
  loanPurposeLabel: string;
  propertyState: string;
  leadSource: string;
  bestTimeToReach: string;
  focusNotes: string;
  utmParams: UtmParams;
  contactId: string | null;
  matchType: "new" | "matched" | "skipped";
  smsConsentRecord: SmsConsentRecord;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing — email system cannot run");
  }

  const e = escapeHtml;
  const matchLabel =
    fields.matchType === "matched"
      ? "Matched existing HubSpot contact by phone"
      : fields.matchType === "new"
        ? "New HubSpot contact created"
        : "HubSpot sync skipped or unavailable";

  const hubSpotLink = fields.contactId
    ? `<p style="margin:0 0 20px;"><a href="${e(getHubSpotContactRecordUrl(fields.contactId))}" style="color:#0B2A4A;font-weight:600;">Open contact in HubSpot →</a></p>`
    : "";

  const utmRows = UTM_PARAM_KEYS.filter((key) => fields.utmParams[key]).map(
    (key) =>
      `<tr><td style="padding:10px 0;color:#64748b;border-bottom:1px solid #f1f5f9;">${e(key)}</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">${e(fields.utmParams[key] ?? "")}</td></tr>`,
  );

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;color:#2E2E2E;">
      <h2 style="color:#0B2A4A;margin:0 0 16px;font-family:Georgia,serif;">New Request a Call — ${e(fields.fullName)}</h2>
      <p style="margin:0 0 12px;font-size:13px;color:#64748b;">Submitted via infinitehomelending.com/request-a-call — respond within 2 hours during business hours.</p>
      <p style="margin:0 0 20px;font-size:13px;font-weight:600;color:#0B2A4A;">${e(matchLabel)}</p>
      ${hubSpotLink}
      <table cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;line-height:1.6;border-top:1px solid #e2e8f0;">
        <tr><td style="padding:10px 0;color:#64748b;width:160px;border-bottom:1px solid #f1f5f9;">Full name</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">${e(fields.fullName)}</td></tr>
        <tr><td style="padding:10px 0;color:#64748b;border-bottom:1px solid #f1f5f9;">Phone</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">${e(fields.phone)}</td></tr>
        <tr><td style="padding:10px 0;color:#64748b;border-bottom:1px solid #f1f5f9;">SMS Consent</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">${e(fields.smsConsentRecord.smsConsent)}</td></tr>
        <tr><td style="padding:10px 0;color:#64748b;border-bottom:1px solid #f1f5f9;">SMS Consent Source</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">${e(fields.smsConsentRecord.smsConsentSource)}</td></tr>
        <tr><td style="padding:10px 0;color:#64748b;border-bottom:1px solid #f1f5f9;">SMS Consent Disclosure Version</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">${e(fields.smsConsentRecord.smsConsentDisclosureVersion)}</td></tr>
        <tr><td style="padding:10px 0;color:#64748b;border-bottom:1px solid #f1f5f9;">SMS Consent Timestamp</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">${e(fields.smsConsentRecord.smsConsentTimestamp)}</td></tr>
        <tr><td style="padding:10px 0;color:#64748b;border-bottom:1px solid #f1f5f9;">Email</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">${e(fields.email)}</td></tr>
        <tr><td style="padding:10px 0;color:#64748b;border-bottom:1px solid #f1f5f9;">Loan purpose</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">${e(fields.loanPurposeLabel)}</td></tr>
        <tr><td style="padding:10px 0;color:#64748b;border-bottom:1px solid #f1f5f9;">Property state</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">${e(fields.propertyState)}</td></tr>
        <tr><td style="padding:10px 0;color:#64748b;border-bottom:1px solid #f1f5f9;">How did you hear about us?</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">${e(fields.leadSource)}</td></tr>
        <tr><td style="padding:10px 0;color:#64748b;border-bottom:1px solid #f1f5f9;">Best day &amp; time</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">${e(fields.bestTimeToReach)}</td></tr>
        ${utmRows.join("")}
      </table>
      <p style="margin:20px 0 8px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">Call focus (optional)</p>
      <p style="margin:0;font-size:14px;line-height:1.7;white-space:pre-wrap;">${e(fields.focusNotes || "—")}</p>
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
      subject: `New Request a Call — ${fields.fullName}`,
      html,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("[request-a-call] Resend error:", errText);
    throw new Error("Resend API error");
  }
}

export function createRequestACallRouter(): Router {
  const router = Router();

  router.post("/request-a-call", async (req, res) => {
    try {
      const body = req.body as {
        fullName?: string;
        phone?: string;
        smsConsent?: boolean;
        email?: string;
        loanPurpose?: string;
        propertyState?: string;
        leadSource?: string;
        bestDay?: string;
        bestTime?: string;
        focusNotes?: string;
        utm_source?: string;
        utm_medium?: string;
        utm_campaign?: string;
        utm_content?: string;
        utm_term?: string;
      };

      const fullName = String(body.fullName ?? "").trim();
      const phone = String(body.phone ?? "").trim();
      const email = String(body.email ?? "").trim();
      const loanPurpose = String(body.loanPurpose ?? "").trim();
      const propertyState = String(body.propertyState ?? "").trim().toUpperCase();
      const leadSource = String(body.leadSource ?? "").trim();
      const bestDay = String(body.bestDay ?? "").trim();
      const bestTime = String(body.bestTime ?? "").trim();
      const focusNotes = String(body.focusNotes ?? "").trim();
      const utmParams = parseUtmParams(body);

      if (!fullName) {
        return res.status(400).json({ error: "Full name is required." });
      }
      if (!phone || !validatePhone(phone)) {
        return res.status(400).json({ error: "A valid phone number is required." });
      }
      if (!email || !validateEmail(email)) {
        return res.status(400).json({ error: "Please enter a valid email address." });
      }
      if (!loanPurpose || !LOAN_PURPOSE_OPTIONS[loanPurpose]) {
        return res.status(400).json({ error: "Please select a loan purpose." });
      }
      if (!new Set(["MD", "DC", "VA"]).has(propertyState)) {
        return res.status(400).json({ error: "Please select a licensed property state." });
      }
      if (!leadSource || !LEAD_SOURCE_OPTIONS.has(leadSource)) {
        return res.status(400).json({ error: "Please select how you heard about us." });
      }
      if (!bestDay || !BEST_DAY_OPTIONS.has(bestDay)) {
        return res.status(400).json({ error: "Please select the best day to reach you." });
      }
      if (!bestTime || !BEST_TIME_OPTIONS.has(bestTime)) {
        return res.status(400).json({ error: "Please select the best time to reach you." });
      }

      const loanPurposeLabel = LOAN_PURPOSE_OPTIONS[loanPurpose];
      const bestTimeToReach = formatBestTimeToReach(bestDay, bestTime);
      const { firstName, lastName } = splitFullName(fullName);
      const phoneNormalized = normalizePhone(phone);
      const submissionTimestamp = new Date().toISOString();
      const smsConsent = parseSmsConsent(body);
      const smsConsentRecord = buildSmsConsentRecord(smsConsent, submissionTimestamp);

      let hubSpotResult: Awaited<ReturnType<typeof syncRequestACallHubSpotContact>> = {
        contactId: null,
        matchType: "skipped",
      };

      try {
        hubSpotResult = await syncRequestACallHubSpotContact({
          fullName,
          firstName,
          lastName,
          phone,
          phoneNormalized,
          email,
          loanPurposeLabel,
          leadSource,
          bestTimeToReach,
          focusNotes,
          utmParams,
          smsConsent,
          smsConsentTimestamp: submissionTimestamp,
        });
      } catch (err) {
        console.error("[hubspot] request-a-call sync failed:", err);
      }

      await sendRequestACallEmail({
        fullName,
        phone,
        email,
        loanPurposeLabel,
        propertyState,
        leadSource,
        bestTimeToReach,
        focusNotes,
        utmParams,
        contactId: hubSpotResult.contactId,
        matchType: hubSpotResult.matchType,
        smsConsentRecord,
      });

      return res.status(200).json({
        ok: true,
        emailSent: true,
      });
    } catch (error) {
      console.error("[request-a-call] error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  return router;
}
