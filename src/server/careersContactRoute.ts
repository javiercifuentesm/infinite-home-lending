/**
 * POST /api/careers-contact — careers page form submissions via Resend.
 */
import { Router } from "express";
import { escapeHtml } from "./mortgageConciergeSendLeadRoute";

const RESEND_API = "https://api.resend.com/emails";
const LEAD_EMAIL =
  process.env.LEAD_ADVISOR_EMAIL ?? "javier.cifuentes@infinitehomelending.com";

async function sendCareersContactEmail(fields: {
  name: string;
  email: string;
  phone: string;
  nmls: string;
  experience: string;
  employer: string;
  message: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[careers-contact] RESEND_API_KEY not configured");
    return;
  }

  const e = escapeHtml;
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;color:#1e293b;">
      <h2 style="color:#0B2A4A;margin:0 0 16px;">New Careers Inquiry — ${e(fields.name)}</h2>
      <table cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;line-height:1.6;">
        <tr><td style="padding:8px 0;color:#64748b;width:140px;">Name</td><td style="padding:8px 0;">${e(fields.name)}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Email</td><td style="padding:8px 0;">${e(fields.email)}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Phone</td><td style="padding:8px 0;">${e(fields.phone || "—")}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">NMLS Number</td><td style="padding:8px 0;">${e(fields.nmls)}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Experience</td><td style="padding:8px 0;">${e(fields.experience)}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Employer</td><td style="padding:8px 0;">${e(fields.employer || "—")}</td></tr>
      </table>
      <p style="margin:20px 0 8px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">What are you looking to build?</p>
      <p style="margin:0;font-size:14px;line-height:1.7;white-space:pre-wrap;">${e(fields.message || "—")}</p>
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
      subject: `New Careers Inquiry — ${fields.name}`,
      html,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("[careers-contact] Resend error:", errText);
    throw new Error("Resend API error");
  }
}

export function createCareersContactRouter() {
  const router = Router();

  router.post("/careers-contact", async (req, res) => {
    const { name, email, phone, nmls, experience, employer, message } = req.body as {
      name?: string;
      email?: string;
      phone?: string;
      nmls?: string;
      experience?: string;
      employer?: string;
      message?: string;
    };

    const fields = {
      name: String(name ?? "").trim(),
      email: String(email ?? "").trim(),
      phone: String(phone ?? "").trim(),
      nmls: String(nmls ?? "").trim(),
      experience: String(experience ?? "").trim(),
      employer: String(employer ?? "").trim(),
      message: String(message ?? "").trim(),
    };

    if (!fields.name || !fields.email || !fields.nmls) {
      res.status(400).json({ error: "Name, email, and NMLS are required." });
      return;
    }

    try {
      await sendCareersContactEmail(fields);
      res.json({ success: true });
    } catch (err) {
      console.error("[careers-contact] email failed:", err);
      res.status(500).json({ error: "Unable to send message. Please try again." });
    }
  });

  return router;
}
