import { Router, type Request, type Response } from "express";
import {
  getAssignmentToken,
  markTokenUsed,
  getMortgageAdvisors,
  escapeHtml,
  type AssignmentToken,
} from "./mortgageConciergeSendLeadRoute";

const RESEND_API = "https://api.resend.com/emails";

function buildMAEmail(entry: AssignmentToken): string {
  const e = escapeHtml;
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background-color:#f1f5f9;
  font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0"
    style="padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
          style="max-width:600px;width:100%;">

          <tr>
            <td style="background-color:#0B2A4A;
              border-radius:12px 12px 0 0;padding:32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:11px;font-weight:bold;
                      letter-spacing:3px;color:#C6A15B;
                      text-transform:uppercase;">INFINITE</p>
                    <p style="margin:0;font-size:20px;font-weight:bold;
                      color:#ffffff;letter-spacing:1px;line-height:1.2;">
                      Home Lending</p>
                    <p style="margin:6px 0 0 0;color:#94a3b8;font-size:13px;">
                      New Lead Assignment</p>
                  </td>
                  <td align="right" valign="middle">
                    <div style="background-color:#C6A15B;border-radius:50px;
                      padding:8px 20px;display:inline-block;">
                      <p style="margin:0;color:#0B2A4A;font-size:14px;
                        font-weight:bold;">
                        ${e(entry.transactionEmoji)}
                        ${e(entry.transactionType)}
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background-color:#FFF8EC;border-left:4px solid #C6A15B;
              padding:28px 40px;">
              <p style="margin:0 0 8px 0;font-size:26px;">🎉</p>
              <p style="margin:0 0 8px 0;color:#0B2A4A;font-size:22px;
                font-weight:bold;line-height:1.3;">
                ${e(entry.maName.split(" ")[0])},
                you just got a new lead!
              </p>
              <p style="margin:0;color:#475569;font-size:15px;
                line-height:1.6;">
                A client has been assigned to you by Javier.
                They're ready to talk — reach out within 2 hours
                while the lead is hot! 🔥
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color:#ffffff;padding:24px 40px 0 40px;">
              <div style="display:inline-block;background-color:#EFE6D6;
                border-radius:50px;padding:8px 20px;">
                <p style="margin:0;color:#0B2A4A;font-size:14px;
                  font-weight:bold;">
                  ${e(entry.transactionEmoji)}
                  ${e(entry.transactionType)} ·
                  ${e(entry.leadEmoji)} ${e(entry.leadGrade)}
                </p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="background-color:#ffffff;padding:24px 40px;">
              <p style="margin:0 0 16px 0;color:#0B2A4A;font-size:18px;
                font-weight:bold;">👤 Client Details</p>
              <table width="100%" cellpadding="0" cellspacing="0"
                style="border:1px solid #e2e8f0;border-radius:8px;
                overflow:hidden;">
                <tr style="background-color:#f8fafc;">
                  <td style="padding:12px 20px;color:#64748b;font-size:13px;
                    width:160px;border-bottom:1px solid #e2e8f0;">
                    Full Name</td>
                  <td style="padding:12px 20px;color:#0B2A4A;font-size:14px;
                    font-weight:bold;border-bottom:1px solid #e2e8f0;">
                    ${e(entry.leadName)}</td>
                </tr>
                <tr>
                  <td style="padding:12px 20px;color:#64748b;font-size:13px;
                    border-bottom:1px solid #e2e8f0;">Phone</td>
                  <td style="padding:12px 20px;border-bottom:1px solid #e2e8f0;">
                    <a href="tel:${encodeURIComponent(entry.leadPhone)}"
                      style="color:#C6A15B;font-size:14px;
                      text-decoration:none;font-weight:bold;">
                      ${e(entry.leadPhone)}</a></td>
                </tr>
                <tr style="background-color:#f8fafc;">
                  <td style="padding:12px 20px;color:#64748b;font-size:13px;
                    border-bottom:1px solid #e2e8f0;">Email</td>
                  <td style="padding:12px 20px;border-bottom:1px solid #e2e8f0;">
                    <a href="mailto:${encodeURIComponent(entry.leadEmail)}"
                      style="color:#C6A15B;font-size:14px;
                      text-decoration:none;">
                      ${e(entry.leadEmail)}</a></td>
                </tr>
                <tr>
                  <td style="padding:12px 20px;color:#64748b;font-size:13px;
                    border-bottom:1px solid #e2e8f0;">Best Day</td>
                  <td style="padding:12px 20px;color:#1e293b;font-size:14px;
                    border-bottom:1px solid #e2e8f0;">
                    ${e(entry.bestDay)}</td>
                </tr>
                <tr style="background-color:#f8fafc;">
                  <td style="padding:12px 20px;color:#64748b;
                    font-size:13px;border-bottom:1px solid #e2e8f0;">
                    Best Time</td>
                  <td style="padding:12px 20px;color:#1e293b;font-size:14px;
                    border-bottom:1px solid #e2e8f0;">
                    ${e(entry.bestTime)}</td>
                </tr>
                <tr>
                  <td style="padding:12px 20px;color:#64748b;font-size:13px;">
                    Preferred Contact</td>
                  <td style="padding:12px 20px;">
                    <span style="background-color:#EFE6D6;color:#0B2A4A;
                      font-size:13px;font-weight:bold;padding:4px 12px;
                      border-radius:20px;">
                      ${e(entry.preferredContact)}</span></td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background-color:#ffffff;padding:0 40px 32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:0 8px 0 0;">
                    <a href="tel:${encodeURIComponent(entry.leadPhone)}"
                      style="display:block;background-color:#0B2A4A;
                      color:#C6A15B;text-decoration:none;font-size:14px;
                      font-weight:bold;padding:14px 0;border-radius:8px;
                      text-align:center;">
                      📞 Call ${e(entry.leadName.split(" ")[0])} Now
                    </a>
                  </td>
                  <td align="center" style="padding:0 0 0 8px;">
                    <a href="mailto:${encodeURIComponent(entry.leadEmail)}"
                      style="display:block;background-color:#C6A15B;
                      color:#0B2A4A;text-decoration:none;font-size:14px;
                      font-weight:bold;padding:14px 0;border-radius:8px;
                      text-align:center;">
                      ✉️ Email ${e(entry.leadName.split(" ")[0])}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 32px 40px;
              background-color:#ffffff;border-radius:0 0 12px 12px;">
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background-color:#f8fafc;border:1px solid #e2e8f0;
                border-radius:10px;overflow:hidden;">
                <tr>
                  <td style="background-color:#0B2A4A;padding:10px 20px;">
                    <p style="margin:0;color:#C6A15B;font-size:12px;
                      font-weight:bold;letter-spacing:0.5px;">
                      ⚖️ COMPLIANCE REMINDER</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 8px 0;color:#1e293b;font-size:12px;
                      line-height:1.5;">
                      ✓ Always identify yourself and Infinite Home Lending
                      at the start of every call or text</p>
                    <p style="margin:0 0 8px 0;color:#1e293b;font-size:12px;
                      line-height:1.5;">
                      ✓ Honor any Do Not Call or opt-out requests
                      immediately and document them</p>
                    <p style="margin:0 0 8px 0;color:#1e293b;font-size:12px;
                      line-height:1.5;">
                      ✓ First contact should feel like a consultation,
                      not a sales call — listen more than you talk</p>
                    <p style="margin:0;color:#1e293b;font-size:12px;
                      line-height:1.5;">
                      ✓ Log this contact in the IHL CRM immediately
                      after reaching out</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;color:#94a3b8;font-size:12px;">
                      You've got this,
                      ${e(entry.maName.split(" ")[0])}! 💪<br/>
                      — Infinite Home Lending</p>
                    <p style="margin:4px 0 0 0;color:#94a3b8;font-size:12px;">
                      © 2026 Infinite Home Lending ·
                      Maryland · DC · Virginia</p>
                  </td>
                  <td align="right">
                    <p style="margin:0;color:#C6A15B;font-size:12px;
                      font-weight:bold;">infinitehomelending.com</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildReviewPage(entry: AssignmentToken): string {
  const e = escapeHtml;
  const advisors = getMortgageAdvisors();
  const otherAdvisors = advisors
    .filter((ma) => ma.email !== entry.maEmail)
    .map(
      (ma) => `
        <a href="/api/assign-lead/review?token=${entry.token}&override=${encodeURIComponent(ma.email)}"
          style="display:inline-block;margin:4px;padding:8px 16px;
          background:#f1f5f9;border:1px solid #e2e8f0;border-radius:6px;
          color:#0B2A4A;text-decoration:none;font-size:13px;">
          🔄 Assign to ${e(ma.name)} instead
        </a>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Review Lead Assignment — IHL</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; background: #f1f5f9;
      padding: 24px; }
    .card { background: #fff; border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      max-width: 580px; margin: 0 auto; overflow: hidden; }
    .header { background: #0B2A4A; padding: 24px 32px; }
    .header h1 { color: #C6A15B; font-size: 13px;
      letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px; }
    .header h2 { color: #fff; font-size: 20px; }
    .badge { display: inline-block; background: #C6A15B;
      color: #0B2A4A; font-size: 13px; font-weight: bold;
      padding: 6px 16px; border-radius: 50px; margin-top: 10px; }
    .section { padding: 24px 32px; border-bottom: 1px solid #e2e8f0; }
    .label { color: #64748b; font-size: 12px;
      text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
    .value { color: #0B2A4A; font-size: 15px; font-weight: bold; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .ma-box { background: #FFF8EC; border: 2px solid #C6A15B;
      border-radius: 10px; padding: 16px 20px; margin: 16px 32px; }
    .ma-box h3 { color: #0B2A4A; font-size: 16px; margin-bottom: 4px; }
    .ma-box p { color: #475569; font-size: 13px; }
    .confirm-btn { display: block; background: #C6A15B; color: #0B2A4A;
      text-decoration: none; font-size: 16px; font-weight: bold;
      padding: 18px 32px; text-align: center; border-radius: 8px;
      margin: 0 32px 16px; border: none; width: calc(100% - 64px);
      cursor: pointer; }
    .confirm-btn:hover { background: #b8924e; }
    .cancel-link { display: block; text-align: center; color: #94a3b8;
      font-size: 13px; text-decoration: none; padding-bottom: 24px; }
    .other-advisors { padding: 16px 32px 24px; }
    .other-advisors p { color: #64748b; font-size: 13px;
      margin-bottom: 10px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>Infinite Home Lending</h1>
      <h2>📋 Review Lead Assignment</h2>
      <div class="badge">
        ${e(entry.transactionEmoji)} ${e(entry.transactionType)} ·
        ${e(entry.leadEmoji)} ${e(entry.leadGrade)}
      </div>
    </div>

    <div class="ma-box">
      <h3>Assigning to: ${e(entry.maName)}</h3>
      <p>${e(entry.maEmail)}</p>
    </div>

    <div class="section">
      <div class="grid">
        <div>
          <p class="label">Client Name</p>
          <p class="value">${e(entry.leadName)}</p>
        </div>
        <div>
          <p class="label">Grade</p>
          <p class="value">${e(entry.leadEmoji)} ${e(entry.leadGrade)}</p>
        </div>
        <div>
          <p class="label">Phone</p>
          <p class="value">
            <a href="tel:${encodeURIComponent(entry.leadPhone)}"
              style="color:#C6A15B;">
              ${e(entry.leadPhone)}</a></p>
        </div>
        <div>
          <p class="label">Email</p>
          <p class="value" style="word-break:break-all;">
            ${e(entry.leadEmail)}</p>
        </div>
        <div>
          <p class="label">Best Day</p>
          <p class="value">${e(entry.bestDay)}</p>
        </div>
        <div>
          <p class="label">Best Time</p>
          <p class="value">${e(entry.bestTime)}</p>
        </div>
        <div>
          <p class="label">Preferred Contact</p>
          <p class="value">${e(entry.preferredContact)}</p>
        </div>
        <div>
          <p class="label">Transaction Type</p>
          <p class="value">
            ${e(entry.transactionEmoji)} ${e(entry.transactionType)}</p>
        </div>
      </div>
    </div>

    <form method="POST" action="/api/assign-lead/confirm">
      <input type="hidden" name="token" value="${entry.token}"/>
      <button type="submit" class="confirm-btn">
        ✅ Yes — Send to ${e(entry.maName)} →
      </button>
    </form>

    ${
      otherAdvisors
        ? `<div class="other-advisors">
            <p>✏️ Assign to someone else instead:</p>
            ${otherAdvisors}
           </div>`
        : ""
    }

    <a href="javascript:window.close()" class="cancel-link">
      ❌ Cancel — don't assign yet
    </a>
  </div>
</body>
</html>`;
}

function buildExpiredPage(reason: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/>
  <title>Link Expired — IHL</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f1f5f9;
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh; margin: 0; }
    .card { background: #fff; border-radius: 12px; padding: 48px;
      text-align: center; max-width: 400px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    h2 { color: #0B2A4A; margin-bottom: 12px; }
    p { color: #64748b; font-size: 14px; }
  </style>
</head>
<body>
  <div class="card">
    <p style="font-size:48px;">⏱</p>
    <h2>Link Expired or Already Used</h2>
    <p>${escapeHtml(reason)}</p>
  </div>
</body>
</html>`;
}

function buildSuccessPage(maName: string, leadName: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/>
  <title>Lead Assigned — IHL</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f1f5f9;
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh; margin: 0; }
    .card { background: #fff; border-radius: 12px; padding: 48px;
      text-align: center; max-width: 400px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    h2 { color: #0B2A4A; margin-bottom: 12px; }
    p { color: #64748b; font-size: 14px; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <p style="font-size:48px;">🎉</p>
    <h2>Lead Assigned!</h2>
    <p>
      <strong>${escapeHtml(leadName)}</strong> has been
      assigned to <strong>${escapeHtml(maName)}</strong>.<br/><br/>
      They will receive the full lead details shortly. 💪
    </p>
  </div>
</body>
</html>`;
}

export function createAssignLeadRouter(): Router {
  const router = Router();

  router.get("/assign-lead/review", async (req: Request, res: Response) => {
    const token = String(req.query.token ?? "");
    const overrideEmail = req.query.override ? String(req.query.override) : null;

    const entry = getAssignmentToken(token);

    if (!entry) {
      return res.status(410).send(
        buildExpiredPage(
          "This assignment link has expired or was already used. Please use a new lead email.",
        ),
      );
    }

    if (entry.used) {
      return res.status(410).send(
        buildExpiredPage("This lead has already been assigned. Check your email for confirmation."),
      );
    }

    if (overrideEmail) {
      const advisors = getMortgageAdvisors();
      const newMA = advisors.find((ma) => ma.email === overrideEmail);
      if (newMA) {
        entry.maName = newMA.name;
        entry.maEmail = newMA.email;
      }
    }

    return res.status(200).send(buildReviewPage(entry));
  });

  router.post("/assign-lead/confirm", async (req: Request, res: Response) => {
    const token = String(req.body.token ?? "");
    const entry = getAssignmentToken(token);

    if (!entry) {
      return res.status(410).send(
        buildExpiredPage("This assignment link has expired or was already used."),
      );
    }

    if (entry.used) {
      return res.status(410).send(buildExpiredPage("This lead has already been assigned."));
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return res.status(500).send(buildExpiredPage("Email system error — contact support."));
    }

    markTokenUsed(token);

    const maEmailHtml = buildMAEmail(entry);
    const subject = `🎉 New Lead Assigned to You — ${entry.leadName} | ${entry.transactionType}`;

    try {
      const response = await fetch(RESEND_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: "IHL Mortgage Concierge <sarah@update.infinitehomelending.com>",
          to: entry.maEmail,
          subject,
          html: maEmailHtml,
        }),
      });

      if (!response.ok) {
        const e2 = getAssignmentToken(token);
        if (e2) e2.used = false;
        return res.status(500).send(buildExpiredPage("Failed to send email. Please try again."));
      }

      return res.status(200).send(buildSuccessPage(entry.maName, entry.leadName));
    } catch {
      const e2 = getAssignmentToken(token);
      if (e2) e2.used = false;
      return res.status(500).send(buildExpiredPage("Network error. Please try again."));
    }
  });

  return router;
}
