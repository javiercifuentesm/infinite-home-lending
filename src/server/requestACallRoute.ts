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

const BEST_DAY_OPTIONS = new Set(["Weekdays", "Weekends", "Either Works"]);
const BEST_TIME_OPTIONS = new Set(["Morning", "Afternoon", "Evening"]);

function formatBestTimeToReach(bestDay: string, bestTime: string): string {
  return `${bestDay}, ${bestTime}`;
}

function validatePhone(phone: string): boolean {
  return normalizePhone(phone).length >= 10;
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
  loanPurposeLabel: string;
  bestTimeToReach: string;
  focusNotes: string;
  contactId: string | null;
  matchType: "new" | "matched" | "skipped";
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

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;color:#2E2E2E;">
      <h2 style="color:#0B2A4A;margin:0 0 16px;font-family:Georgia,serif;">New Request a Call — ${e(fields.fullName)}</h2>
      <p style="margin:0 0 12px;font-size:13px;color:#64748b;">Submitted via infinitehomelending.com/request-a-call — respond within 2 hours during business hours.</p>
      <p style="margin:0 0 20px;font-size:13px;font-weight:600;color:#0B2A4A;">${e(matchLabel)}</p>
      ${hubSpotLink}
      <table cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;line-height:1.6;border-top:1px solid #e2e8f0;">
        <tr><td style="padding:10px 0;color:#64748b;width:160px;border-bottom:1px solid #f1f5f9;">Full name</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">${e(fields.fullName)}</td></tr>
        <tr><td style="padding:10px 0;color:#64748b;border-bottom:1px solid #f1f5f9;">Phone</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">${e(fields.phone)}</td></tr>
        <tr><td style="padding:10px 0;color:#64748b;border-bottom:1px solid #f1f5f9;">Loan purpose</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">${e(fields.loanPurposeLabel)}</td></tr>
        <tr><td style="padding:10px 0;color:#64748b;border-bottom:1px solid #f1f5f9;">Best day &amp; time</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">${e(fields.bestTimeToReach)}</td></tr>
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
        loanPurpose?: string;
        bestDay?: string;
        bestTime?: string;
        focusNotes?: string;
      };

      const fullName = String(body.fullName ?? "").trim();
      const phone = String(body.phone ?? "").trim();
      const loanPurpose = String(body.loanPurpose ?? "").trim();
      const bestDay = String(body.bestDay ?? "").trim();
      const bestTime = String(body.bestTime ?? "").trim();
      const focusNotes = String(body.focusNotes ?? "").trim();

      if (!fullName) {
        return res.status(400).json({ error: "Full name is required." });
      }
      if (!phone || !validatePhone(phone)) {
        return res.status(400).json({ error: "A valid phone number is required." });
      }
      if (!loanPurpose || !LOAN_PURPOSE_OPTIONS[loanPurpose]) {
        return res.status(400).json({ error: "Please select a loan purpose." });
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
          loanPurposeLabel,
          bestTimeToReach,
          focusNotes,
        });
      } catch (err) {
        console.error("[hubspot] request-a-call sync failed:", err);
      }

      await sendRequestACallEmail({
        fullName,
        phone,
        loanPurposeLabel,
        bestTimeToReach,
        focusNotes,
        contactId: hubSpotResult.contactId,
        matchType: hubSpotResult.matchType,
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
