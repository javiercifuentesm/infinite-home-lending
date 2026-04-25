/**
 * POST /api/send-lead — build flagship lead email and send via Resend (server-side; avoids browser CORS).
 */
import { appendLead } from "./leadsStore";
import { Router, type Request, type Response } from "express";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatTranscript(transcript: string): string {
  const e = escapeHtml;
  const lines = transcript.split("\n").filter((line) => line.trim());

  return lines
    .map((line) => {
      const isSarah = /^(luna|sarah)\b/i.test(line.trim());
      const bgColor = isSarah ? "#EFE6D6" : "#f0f4ff";
      const nameColor = isSarah ? "#0B2A4A" : "#1e40af";
      const borderRadius = isSarah ? "4px 16px 16px 16px" : "16px 4px 16px 16px";
      const timeMatch = line.match(/\((\d{1,2}:\d{2}\s*(?:AM|PM))\)/i);
      const time = timeMatch ? timeMatch[1] : "";
      const message = line
        .replace(/^(Luna|Sarah|Visitor)\s*\([^)]+\):\s*/i, "")
        .trim();
      const speaker = isSarah ? "Luna · IHL Concierge" : "Visitor";

      return `
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
        <tr>
          <td ${!isSarah ? 'style="width:60px;"' : ""}></td>
          <td style="padding:${!isSarah ? "0 0 0 40px" : "0 40px 0 0"};text-align:${!isSarah ? "right" : "left"};">
            <div style="background-color:${bgColor};border-radius:${borderRadius};padding:12px 16px;display:inline-block;max-width:100%;text-align:left;">
              <p style="margin:0 0 4px 0;color:${nameColor};font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;">${e(speaker)}${time ? ` · ${e(time)}` : ""}</p>
              <p style="margin:0;color:#1e293b;font-size:13px;line-height:1.6;">${e(message)}</p>
            </div>
          </td>
          ${isSarah ? '<td style="width:60px;"></td>' : ""}
        </tr>
      </table>
    `;
    })
    .join("");
}

function sanitizeHexColor(c: unknown, fallback: string): string {
  const t = String(c ?? "");
  return /^#[0-9A-Fa-f]{6}$/.test(t) ? t : fallback;
}

/** Visitor-only lines (lowercased, joined) — excludes Luna so detection is not biased by her prompts. */
function getVisitorLinesText(transcript: string): string {
  return transcript
    .split("\n")
    .filter((l) => l.toLowerCase().trim().startsWith("visitor"))
    .map((l) => l.toLowerCase())
    .join(" ");
}

function getVisitorOnlyTranscript(transcript: string): string {
  return transcript
    .split("\n")
    .filter((l) => l.toLowerCase().trim().startsWith("visitor"))
    .join("\n");
}

function generateSpeedAlert(
  grade: string,
  gradeColor: string,
  gradeBg: string,
  date: string,
  time: string,
  preferredContact: string,
): string {
  const e = escapeHtml;
  const gc = sanitizeHexColor(gradeColor, "#6B7280");
  const gb = sanitizeHexColor(gradeBg, "#F9FAFB");
  const g = String(grade);
  const deadline = /HOT/i.test(g) ? "2 hours" : /WARM/i.test(g) ? "24 hours" : "48 hours";
  const urgency = /HOT/i.test(g)
    ? "Every minute matters — this lead is actively ready to move."
    : /WARM/i.test(g)
      ? "Strike while the iron is warm — they are engaged and interested."
      : "Add to nurture sequence — consistent follow-up builds trust.";
  return `
    <tr>
      <td style="padding: 0 40px 24px 40px;background-color:#ffffff;">
        <table width="100%" cellpadding="0" cellspacing="0"
          style="background-color:${gb};border:2px solid ${gc};border-radius:10px;overflow:hidden;">
          <tr>
            <td style="background-color:${gc};padding:12px 20px;">
              <p style="margin:0;color:#ffffff;font-size:14px;font-weight:bold;letter-spacing:0.5px;">
                ⚡ SPEED TO LEAD — CRITICAL
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:50%;padding-right:12px;border-right:1px solid ${gc}44;vertical-align:top;">
                    <p style="margin:0 0 4px 0;color:#64748b;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;">Lead Received</p>
                    <p style="margin:0;color:#0B2A4A;font-size:13px;font-weight:bold;">${e(date)}</p>
                    <p style="margin:2px 0 0 0;color:#0B2A4A;font-size:13px;">at ${e(time)}</p>
                  </td>
                  <td style="width:50%;padding-left:12px;vertical-align:top;">
                    <p style="margin:0 0 4px 0;color:#64748b;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;">Contact Within</p>
                    <p style="margin:0;color:${gc};font-size:20px;font-weight:bold;">${e(deadline)}</p>
                    <p style="margin:2px 0 0 0;color:#64748b;font-size:11px;">via ${e(preferredContact)}</p>
                  </td>
                </tr>
              </table>
              <p style="margin:12px 0 0 0;color:#1e293b;font-size:13px;font-style:italic;border-top:1px solid ${gc}33;padding-top:12px;">
                ${e(urgency)}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

function generateLoanProfile(transcript: string): string {
  const visitorOnly = getVisitorOnlyTranscript(transcript);
  const text = getVisitorLinesText(transcript);

  const budgetMatch = visitorOnly.match(/\$?([\d,]+)\s*(?:thousand|k)?/gi);
  let purchasePrice = "To be confirmed";
  let loanAmount = "To be confirmed";
  let downFHA = "To be confirmed";
  let downConv = "To be confirmed";

  if (budgetMatch) {
    const numbers = budgetMatch
      .map((m) => {
        const lower = m.toLowerCase();
        const n = parseInt(m.replace(/[$,k]/gi, ""), 10);
        if (Number.isNaN(n)) return 0;
        return n * (lower.includes("k") || lower.includes("thousand") ? 1000 : 1);
      })
      .filter((n) => n >= 100000 && n <= 5_000_000);
    if (numbers.length > 0) {
      const price = numbers[0];
      purchasePrice = `~$${price.toLocaleString()}`;
      downFHA = `~$${Math.round(price * 0.035).toLocaleString()} (3.5% FHA)`;
      downConv = `~$${Math.round(price * 0.05).toLocaleString()} (5% Conventional)`;
      loanAmount = `~$${Math.round(price * 0.965).toLocaleString()} – $${Math.round(price * 0.95).toLocaleString()}`;
    }
  }

  const programs: string[] = [];
  const isFirstTime =
    text.includes("first time") || text.includes("first home") || text.includes("first purchase");
  const isVA = text.includes("veteran") || text.includes("military") || text.includes("va loan");
  const isUSDA = text.includes("rural") || text.includes("usda");

  if (isVA) programs.push("VA Loan (0% down)");
  if (isUSDA) programs.push("USDA Loan (0% down)");
  if (isFirstTime) {
    programs.push("FHA Loan (3.5% down)");
    programs.push("Maryland Mortgage Program");
    programs.push("Conventional 3% down");
  } else {
    programs.push("Conventional");
    programs.push("FHA");
  }
  if (!programs.length) {
    programs.push("Conventional", "FHA");
  }

  return `
    <tr>
      <td style="padding: 0 40px 24px 40px;background-color:#ffffff;">
        <p style="margin:0 0 14px 0;color:#0B2A4A;font-size:17px;font-weight:bold;">📊 Estimated Loan Profile</p>
        <p style="margin:0 0 14px 0;color:#64748b;font-size:12px;">Based on information shared with Luna. Verify all figures on the first call.</p>
        <table width="100%" cellpadding="0" cellspacing="0"
          style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">
          <tr style="background-color:#f8fafc;">
            <td style="padding:10px 20px;color:#64748b;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;width:180px;border-bottom:1px solid #e2e8f0;">Purchase Price</td>
            <td style="padding:10px 20px;color:#0B2A4A;font-size:13px;font-weight:bold;border-bottom:1px solid #e2e8f0;">${escapeHtml(purchasePrice)}</td>
          </tr>
          <tr>
            <td style="padding:10px 20px;color:#64748b;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #e2e8f0;">Est. Down Payment</td>
            <td style="padding:10px 20px;color:#1e293b;font-size:13px;border-bottom:1px solid #e2e8f0;">${escapeHtml(downFHA)}<br/><span style="color:#94a3b8;">or</span> ${escapeHtml(downConv)}</td>
          </tr>
          <tr style="background-color:#f8fafc;">
            <td style="padding:10px 20px;color:#64748b;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #e2e8f0;">Est. Loan Amount</td>
            <td style="padding:10px 20px;color:#1e293b;font-size:13px;border-bottom:1px solid #e2e8f0;">${escapeHtml(loanAmount)}</td>
          </tr>
          <tr>
            <td style="padding:10px 20px;color:#64748b;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #e2e8f0;">Est. Monthly PITI</td>
            <td style="padding:10px 20px;color:#1e293b;font-size:13px;border-bottom:1px solid #e2e8f0;">Calculate at current rates on first call</td>
          </tr>
          <tr style="background-color:#f8fafc;">
            <td style="padding:10px 20px;color:#64748b;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;">Likely Programs</td>
            <td style="padding:10px 20px;color:#1e293b;font-size:13px;">
              ${programs.map((p) => `<span style="display:inline-block;background-color:#EFE6D6;color:#0B2A4A;font-size:11px;font-weight:bold;padding:3px 10px;border-radius:20px;margin:2px 4px 2px 0;">${escapeHtml(p)}</span>`).join("")}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

function generateFollowUpSequence(preferredContact: string, bestDay: string, bestTime: string): string {
  const e = escapeHtml;
  const dayNote =
    bestDay && bestDay !== "Not specified"
      ? `<p style="margin:8px 0 0 0;color:#1d4ed8;font-size:12px;"><strong>Note:</strong> They requested contact on <strong>${e(bestDay)}</strong> during <strong>${e(bestTime || "their preferred time")}</strong> — prioritize that window.</p>`
      : "";
  return `
    <tr>
      <td style="padding: 0 40px 24px 40px;background-color:#ffffff;">
        <p style="margin:0 0 14px 0;color:#0B2A4A;font-size:17px;font-weight:bold;">📅 If You Can't Reach Them — Follow-Up Sequence</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:0 0 12px 0;">
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background-color:#f0fdf4;border:1px solid #86efac;border-radius:10px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:40px;vertical-align:top;">
                          <div style="width:28px;height:28px;background-color:#22c55e;border-radius:50%;text-align:center;line-height:28px;">
                            <span style="color:#ffffff;font-size:13px;font-weight:bold;">1</span>
                          </div>
                        </td>
                        <td style="vertical-align:top;padding-left:12px;">
                          <p style="margin:0 0 2px 0;color:#15803d;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;">Immediately — ${e(preferredContact)}</p>
                          <p style="margin:0;color:#1e293b;font-size:13px;line-height:1.5;">Call and leave a warm, brief voicemail: <em>"Hi [Name], this is [your name] from Infinite Home Lending. I saw you connected with our AI concierge Luna today and I wanted to personally reach out. Give me a call back at [number] — no pressure, just here to help!"</em></p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 12px 0;">
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background-color:#fefce8;border:1px solid #fde047;border-radius:10px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:40px;vertical-align:top;">
                          <div style="width:28px;height:28px;background-color:#eab308;border-radius:50%;text-align:center;line-height:28px;">
                            <span style="color:#ffffff;font-size:13px;font-weight:bold;">2</span>
                          </div>
                        </td>
                        <td style="vertical-align:top;padding-left:12px;">
                          <p style="margin:0 0 2px 0;color:#a16207;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;">1 Hour Later — Text Message</p>
                          <p style="margin:0;color:#1e293b;font-size:13px;line-height:1.5;">Send a short, warm text: <em>"Hi [Name]! This is [name] from Infinite Home Lending — just following up on your chat with Luna. Happy to answer any questions at your own pace. Feel free to text or call me anytime! 😊"</em></p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 12px 0;">
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background-color:#eff6ff;border:1px solid #93c5fd;border-radius:10px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:40px;vertical-align:top;">
                          <div style="width:28px;height:28px;background-color:#3b82f6;border-radius:50%;text-align:center;line-height:28px;">
                            <span style="color:#ffffff;font-size:13px;font-weight:bold;">3</span>
                          </div>
                        </td>
                        <td style="vertical-align:top;padding-left:12px;">
                          <p style="margin:0 0 2px 0;color:#1d4ed8;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;">Next Day — Email</p>
                          <p style="margin:0;color:#1e293b;font-size:13px;line-height:1.5;">Send a personal email introducing yourself, referencing their conversation with Luna, and including one helpful resource (e.g. first-time buyer guide, MD program overview, or payment calculator link).</p>
                          ${dayNote}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

function generateComplianceNote(): string {
  return `
    <tr>
      <td style="padding: 0 40px 32px 40px;background-color:#ffffff;border-radius:0 0 12px 12px;">
        <table width="100%" cellpadding="0" cellspacing="0"
          style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">
          <tr>
            <td style="background-color:#0B2A4A;padding:10px 20px;">
              <p style="margin:0;color:#C6A15B;font-size:12px;font-weight:bold;letter-spacing:0.5px;">⚖️ COMPLIANCE REMINDER</p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:4px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:20px;color:#22c55e;font-size:14px;vertical-align:top;">✓</td>
                        <td style="color:#1e293b;font-size:12px;line-height:1.5;">This lead provided express consent via the IHL Mortgage Concierge widget on infinitehomelending.com</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:20px;color:#22c55e;font-size:14px;vertical-align:top;">✓</td>
                        <td style="color:#1e293b;font-size:12px;line-height:1.5;">Always identify yourself and Infinite Home Lending at the start of every call or text</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:20px;color:#22c55e;font-size:14px;vertical-align:top;">✓</td>
                        <td style="color:#1e293b;font-size:12px;line-height:1.5;">Honor any Do Not Call or opt-out requests immediately and document them</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:20px;color:#22c55e;font-size:14px;vertical-align:top;">✓</td>
                        <td style="color:#1e293b;font-size:12px;line-height:1.5;">First contact should feel like a consultation, not a sales call — listen more than you talk</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:20px;color:#22c55e;font-size:14px;vertical-align:top;">✓</td>
                        <td style="color:#1e293b;font-size:12px;line-height:1.5;">Log this contact in the IHL CRM immediately after reaching out</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

function generateTimeline(transcript: string): string {
  const e = escapeHtml;
  const lines = transcript.split("\n").filter((l) => l.trim());
  const milestones: { time: string; event: string; color: string }[] = [];

  lines.forEach((line) => {
    const timeMatch = line.match(/\((\d+:\d+\s*[AP]M)\)/i);
    const time = timeMatch ? timeMatch[1] : "";
    const text = line.toLowerCase();

    if ((line.toLowerCase().startsWith("luna") || line.toLowerCase().startsWith("sarah")) && text.includes("hi") && (text.includes("luna") || text.includes("sarah"))) {
      milestones.push({ time, event: "Visitor initiated contact with Luna", color: "#0B2A4A" });
    }
    if (text.includes("purchase") || text.includes("buy")) {
      milestones.push({ time, event: "Confirmed purchase intent", color: "#0B2A4A" });
    }
    if (text.includes("month") || text.includes("year") || text.includes("timeline")) {
      milestones.push({ time, event: "Timeline discussed", color: "#C6A15B" });
    }
    if (text.includes("budget") || text.includes("price range") || text.includes("000")) {
      milestones.push({ time, event: "Budget range discussed", color: "#C6A15B" });
    }
    if (text.includes("first time") || text.includes("first home") || text.includes("first purchase")) {
      milestones.push({ time, event: "Identified as first-time buyer", color: "#7c3aed" });
    }
    if ((text.includes("connect") && text.includes("advisor")) || (text.includes("yes") && text.includes("connect"))) {
      milestones.push({ time, event: "Agreed to connect with IHL advisor", color: "#22c55e" });
    }
    if (text.includes("form") && text.includes("fill")) {
      milestones.push({ time, event: "Lead capture form displayed", color: "#22c55e" });
    }
  });

  const lastLine = lines[lines.length - 1];
  const lastTime = lastLine?.match(/\((\d+:\d+\s*[AP]M)\)/i)?.[1] || "";
  milestones.push({ time: lastTime, event: "Contact form submitted ✓", color: "#22c55e" });

  const seen = new Set<string>();
  const unique = milestones.filter((m) => {
    if (seen.has(m.event)) return false;
    seen.add(m.event);
    return true;
  });

  return unique
    .map(
      (m, i) => `
    <tr>
      <td style="width:80px;padding:6px 0;vertical-align:top;">
        <p style="margin:0;color:#64748b;font-size:11px;">${e(m.time)}</p>
      </td>
      <td style="width:20px;padding:6px 0;vertical-align:top;text-align:center;">
        <div style="width:10px;height:10px;border-radius:50%;background-color:${m.color};margin:3px auto 0;"></div>
        ${i < unique.length - 1 ? `<div style="width:2px;height:100%;min-height:20px;background-color:#e2e8f0;margin:2px auto 0;"></div>` : ""}
      </td>
      <td style="padding:6px 0 6px 12px;vertical-align:top;">
        <p style="margin:0;color:#1e293b;font-size:13px;line-height:1.5;">${e(m.event)}</p>
      </td>
    </tr>
  `,
    )
    .join("");
}

function generatePlaybook(
  transcript: string,
  name: string,
  preferredContact: string,
  bestDay: string,
  bestTime: string,
  grade: string,
  gradeColor: string,
  gradeBg: string,
  gradeEmoji: string,
  gradePriority: string,
  date: string,
  time: string,
): string {
  const e = escapeHtml;
  const visitorLines = getVisitorLinesText(transcript);
  const visitorOnlyTranscript = getVisitorOnlyTranscript(transcript);
  const firstName = name.split(" ")[0] || name;
  const gc = sanitizeHexColor(gradeColor, "#6B7280");
  const gb = sanitizeHexColor(gradeBg, "#F9FAFB");
  const grad = String(grade);
  const gradDisplay = e(grad);
  const geo = e(gradeEmoji);
  const gpri = e(gradePriority);
  const pContact = e(preferredContact);
  const bDay = e(bestDay);
  const bTime = e(bestTime);

  const noAgentPhrases = [
    "don't have",
    "no agent",
    "still putting",
    "not yet",
    "i don't",
    "no, i",
    "no i",
    "haven't",
    "not working with",
    "no real estate",
    "don't have an agent",
    "i do not",
  ];
  const hasAgentPhrases = [
    "working with",
    "have an agent",
    "my agent",
    "yes, i have",
    "yes i have",
    "already have",
    "yes, working",
  ];

  const noAgent = noAgentPhrases.some((p) => visitorLines.includes(p));
  const hasAgent = !noAgent && hasAgentPhrases.some((p) => visitorLines.includes(p));

  const isPurchase =
    visitorLines.includes("purchase") || visitorLines.includes("buy") || visitorLines.includes("buying");
  const isRefi = visitorLines.includes("refinanc");
  const isFirstTime =
    visitorLines.includes("first time") ||
    visitorLines.includes("first home") ||
    visitorLines.includes("never bought") ||
    visitorLines.includes("first purchase");
  const hasCredit =
    visitorLines.includes("pulled my credit") ||
    visitorLines.includes("checked my credit") ||
    visitorLines.includes("know my score");
  const wantsCredit =
    (visitorLines.includes("explore") && visitorLines.includes("credit")) ||
    visitorLines.includes("want to explore") ||
    visitorLines.includes("advisor");
  const hasBudget =
    visitorLines.includes("budget") ||
    visitorLines.includes("price range") ||
    visitorLines.includes("afford") ||
    visitorLines.includes("000");
  const nearTerm =
    visitorLines.includes("next few months") ||
    visitorLines.includes("six months") ||
    visitorLines.includes("6 months") ||
    visitorLines.includes("spring") ||
    visitorLines.includes("summer") ||
    visitorLines.includes("soon") ||
    visitorLines.includes("ready");
  const earlyStage =
    visitorLines.includes("planning") || visitorLines.includes("early") || visitorLines.includes("not sure");

  const budgetMatch = visitorOnlyTranscript.match(/\$[\d,]+|\d{3},\d{3}|\d+ thousand/i);
  const budget = budgetMatch ? budgetMatch[0] : null;

  const timelineMatch = visitorOnlyTranscript.match(/(\d+)\s*(month|year|week)/i);
  const timeline = timelineMatch ? `${timelineMatch[1]} ${timelineMatch[2]}s` : null;

  const visitorLineCount = transcript.split("\n").filter((l) => l.toLowerCase().trim().startsWith("visitor")).length;

  const gradeReasons: string[] = [];
  if (nearTerm) gradeReasons.push("Near-term buying timeline");
  if (hasBudget && budget) gradeReasons.push(`Specific budget identified (${budget})`);
  if (isFirstTime) gradeReasons.push("First-time buyer — high motivation");
  if (noAgent) gradeReasons.push("No agent yet — full referral opportunity");
  if (wantsCredit) gradeReasons.push("Wants credit guidance — advisor dependent");
  if (isPurchase) gradeReasons.push("Clear purchase intent");
  if (earlyStage) gradeReasons.push("Early planning stage — nurture needed");
  if (visitorLineCount > 6) gradeReasons.push("High conversation engagement");
  if (!gradeReasons.length) gradeReasons.push("Lead details captured — see profile and transcript below.");

  const channel = preferredContact || "phone";
  const actionMap: Record<string, string> = {
    HOT: "Contact within 2 hours via " + channel,
    WARM: "Contact within 24 hours via " + channel,
    NEUTRAL: "Add to nurture sequence — follow up within 48 hours",
  };
  const recAction = /HOT/i.test(grad) ? actionMap.HOT : /WARM/i.test(grad) ? actionMap.WARM : actionMap.NEUTRAL;

  const leadTopics: string[] = [];
  if (isFirstTime) leadTopics.push("First-time buyer programs available in MD/DC/VA");
  if (isFirstTime) leadTopics.push("Down payment assistance options — could save thousands");
  if (wantsCredit || !hasCredit) leadTopics.push("Soft credit pull — zero impact to their score");
  if (budget) leadTopics.push(`Payment breakdown on a ${budget} home at current rates`);
  if (isPurchase) leadTopics.push("Pre-approval process — fast and obligation-free with IHL");
  if (isRefi) leadTopics.push("Refinance options and current rate environment");
  if (!leadTopics.length) {
    leadTopics.push("IHL loan options overview");
    leadTopics.push("Pre-approval process walkthrough");
  }

  const handleWithCare: string[] = [];
  if (noAgent) {
    handleWithCare.push("No agent yet — offer to connect with a trusted IHL partner agent in their area");
  }
  if (wantsCredit && !hasCredit) {
    handleWithCare.push("Credit not yet explored — be reassuring and educational, not clinical");
  }
  if (isFirstTime) handleWithCare.push("First-time buyer — may feel overwhelmed, go slow and explain each step");
  if (earlyStage) {
    handleWithCare.push("Still in early stages — educate first, don't rush to application");
  }
  if (!handleWithCare.length) {
    handleWithCare.push("Visitor seems well-informed — match their energy and go deeper on specifics");
  }

  const purposeText = isPurchase
    ? `buy${isFirstTime ? " your first" : " a"} home${timeline ? ` in the next ${timeline}` : ""}`
    : isRefi
      ? "refinance your home"
      : "explore your mortgage options";

  const openingLine = `"Hi ${firstName}, this is [your name] from Infinite Home Lending. Luna mentioned you're looking to ${purposeText}${budget ? ` with a budget around ${budget}` : ""} — I'd love to help make that happen!"`;

  return `
    <!-- SECTION 1: LEAD GRADE -->
    <tr>
      <td style="padding: 0 40px 24px 40px;background-color:#ffffff;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;overflow:hidden;border:2px solid ${gc};">
          <!-- Grade Header -->
          <tr>
            <td style="background-color:${gc};padding:20px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;color:#ffffff;font-size:22px;font-weight:bold;letter-spacing:1px;">${geo} ${gradDisplay} LEAD</p>
                    <p style="margin:4px 0 0 0;color:#ffffff;font-size:13px;opacity:0.85;">${gpri}</p>
                  </td>
                  <td align="right" valign="middle">
                    <div style="background-color:rgba(255,255,255,0.2);border-radius:8px;padding:8px 16px;">
                      <p style="margin:0;color:#ffffff;font-size:12px;font-weight:bold;">RECOMMENDED ACTION</p>
                      <p style="margin:4px 0 0 0;color:#ffffff;font-size:13px;">${e(recAction)}</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Grade Reasons -->
          <tr>
            <td style="background-color:${gb};padding:20px 24px;">
              <p style="margin:0 0 12px 0;color:#0B2A4A;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;">Why this lead is graded ${gradDisplay}:</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${gradeReasons
                  .map(
                    (r) => `
                  <tr>
                    <td style="padding:4px 0;">
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="width:20px;color:${gc};font-size:14px;font-weight:bold;vertical-align:top;">✓</td>
                          <td style="color:#1e293b;font-size:13px;line-height:1.5;">${e(r)}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                `,
                  )
                  .join("")}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    ${generateSpeedAlert(grad, gradeColor, gradeBg, date, time, preferredContact)}

    <!-- SECTION 2: VISITOR PROFILE -->
    <tr>
      <td style="padding: 0 40px 24px 40px;background-color:#ffffff;">
        <p style="margin:0 0 14px 0;color:#0B2A4A;font-size:17px;font-weight:bold;">👤 Visitor Profile</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">
          <tr style="background-color:#f8fafc;">
            <td style="padding:10px 20px;color:#64748b;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;width:140px;border-bottom:1px solid #e2e8f0;">Goal</td>
            <td style="padding:10px 20px;color:#0B2A4A;font-size:13px;font-weight:bold;border-bottom:1px solid #e2e8f0;">${
              isPurchase ? "🏠 Purchase new home" : isRefi ? "🔄 Refinance existing home" : "❓ To be confirmed"
            }</td>
          </tr>
          <tr>
            <td style="padding:10px 20px;color:#64748b;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #e2e8f0;">Timeline</td>
            <td style="padding:10px 20px;color:#1e293b;font-size:13px;border-bottom:1px solid #e2e8f0;">${
              timeline
                ? `⏰ ${e(timeline)}`
                : nearTerm
                  ? "⏰ Near-term (confirmed)"
                  : earlyStage
                    ? "📅 Early planning stage"
                    : "❓ To be confirmed"
            }</td>
          </tr>
          <tr style="background-color:#f8fafc;">
            <td style="padding:10px 20px;color:#64748b;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #e2e8f0;">Budget</td>
            <td style="padding:10px 20px;color:#1e293b;font-size:13px;border-bottom:1px solid #e2e8f0;">${
              budget
                ? `💰 ${e(budget)}`
                : hasBudget
                  ? "💰 Has budget (confirm on call)"
                  : "❓ Not yet discussed"
            }</td>
          </tr>
          <tr>
            <td style="padding:10px 20px;color:#64748b;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #e2e8f0;">Agent</td>
            <td style="padding:10px 20px;color:#1e293b;font-size:13px;border-bottom:1px solid #e2e8f0;">${
              hasAgent
                ? "✅ Working with agent"
                : noAgent
                  ? "⚠️ No agent yet — referral opportunity"
                  : "❓ To be confirmed"
            }</td>
          </tr>
          <tr style="background-color:#f8fafc;">
            <td style="padding:10px 20px;color:#64748b;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #e2e8f0;">Credit</td>
            <td style="padding:10px 20px;color:#1e293b;font-size:13px;border-bottom:1px solid #e2e8f0;">${
              hasCredit
                ? "✅ Has reviewed credit"
                : wantsCredit
                  ? "📊 Wants to explore with advisor"
                  : "❓ Not yet discussed"
            }</td>
          </tr>
          <tr>
            <td style="padding:10px 20px;color:#64748b;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;">First-time buyer</td>
            <td style="padding:10px 20px;color:#1e293b;font-size:13px;">${
              isFirstTime ? "🌟 Yes — first-time buyer" : "🔄 Has bought before"
            }</td>
          </tr>
        </table>
      </td>
    </tr>

    ${generateLoanProfile(transcript)}

    <!-- SECTION 3: FIRST CONTACT PLAYBOOK -->
    <tr>
      <td style="padding: 0 40px 24px 40px;background-color:#ffffff;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#EFE6D6;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:24px;">
              <p style="margin:0 0 20px 0;color:#0B2A4A;font-size:17px;font-weight:bold;">💡 First Contact Playbook</p>

              <!-- Opening Line -->
              <p style="margin:0 0 8px 0;color:#0B2A4A;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;">🎯 Suggested Opening Line</p>
              <div style="background-color:#ffffff;border-left:3px solid #C6A15B;border-radius:0 8px 8px 0;padding:14px 16px;margin-bottom:20px;">
                <p style="margin:0;color:#1e293b;font-size:13px;line-height:1.7;font-style:italic;">${e(openingLine)}</p>
              </div>

              <!-- Lead With -->
              <p style="margin:0 0 8px 0;color:#0B2A4A;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;">✅ Lead With These Topics</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                ${leadTopics
                  .map(
                    (t) => `
                  <tr>
                    <td style="padding:5px 0;">
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="width:24px;color:#22c55e;font-size:16px;vertical-align:top;line-height:1.4;">•</td>
                          <td style="color:#1e293b;font-size:13px;line-height:1.5;">${e(t)}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                `,
                  )
                  .join("")}
              </table>

              <!-- Handle With Care -->
              <p style="margin:0 0 8px 0;color:#0B2A4A;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;">⚠️ Approach With Care</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                ${handleWithCare
                  .map(
                    (h) => `
                  <tr>
                    <td style="padding:5px 0;">
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="width:24px;color:#f59e0b;font-size:16px;vertical-align:top;line-height:1.4;">•</td>
                          <td style="color:#1e293b;font-size:13px;line-height:1.5;">${e(h)}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                `,
                  )
                  .join("")}
              </table>

              <!-- Preferred Contact -->
              <p style="margin:0 0 8px 0;color:#0B2A4A;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;">📞 Preferred Contact Details</p>
              <div style="background-color:#ffffff;border-radius:8px;padding:14px 16px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="color:#64748b;font-size:12px;width:100px;">Method</td>
                    <td style="color:#0B2A4A;font-size:13px;font-weight:bold;">${pContact}</td>
                  </tr>
                  <tr>
                    <td style="color:#64748b;font-size:12px;padding-top:6px;">Best Day</td>
                    <td style="color:#0B2A4A;font-size:13px;font-weight:bold;padding-top:6px;">${bDay}</td>
                  </tr>
                  <tr>
                    <td style="color:#64748b;font-size:12px;padding-top:6px;">Best Time</td>
                    <td style="color:#0B2A4A;font-size:13px;font-weight:bold;padding-top:6px;">${bTime}</td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    ${generateFollowUpSequence(preferredContact, bestDay, bestTime)}

    <!-- SECTION 4: CONVERSATION FLOW -->
    <tr>
      <td style="padding: 0 40px 24px 40px;background-color:#ffffff;">
        <p style="margin:0 0 6px 0;color:#0B2A4A;font-size:17px;font-weight:bold;">💬 Conversation Flow</p>
        <p style="margin:0 0 16px 0;color:#64748b;font-size:12px;">Full transcript of the Luna AI conversation that led to this lead.</p>
        ${formatTranscript(transcript)}
      </td>
    </tr>

    <!-- SECTION 5: KEY MOMENTS TIMELINE -->
    <tr>
      <td style="padding: 0 40px 24px 40px;background-color:#ffffff;">
        <p style="margin:0 0 16px 0;color:#0B2A4A;font-size:17px;font-weight:bold;">⏱ Key Moments</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${generateTimeline(transcript)}
        </table>
      </td>
    </tr>

    ${generateComplianceNote()}
  `;
}

export function createMortgageConciergeSendLeadRouter(): Router {
  const router = Router();

  router.post("/send-lead", async (req: Request, res: Response) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: "RESEND_API_KEY not configured" });
      return;
    }

    const b = req.body as Record<string, unknown>;
    const lead_name = String(b.lead_name ?? "").trim();
    const lead_email = String(b.lead_email ?? "").trim();
    if (!lead_name || !lead_email) {
      res.status(400).json({ error: "Missing required lead fields" });
      return;
    }

    const {
      lead_phone,
      best_day,
      best_time,
      preferred_contact,
      lead_grade,
      lead_emoji,
      lead_color,
      lead_bg,
      lead_priority,
      date,
      time,
      transcript,
    } = b;

    const tRaw = String(transcript ?? "");
    const c = sanitizeHexColor(lead_color, "#6B7280");
    const bg = sanitizeHexColor(lead_bg, "#F9FAFB");

    const e = escapeHtml;
    const en = (v: unknown) => e(String(v ?? ""));

    const playbookHtml = generatePlaybook(
      tRaw,
      lead_name,
      String(preferred_contact ?? "Not specified"),
      String(best_day ?? "Not specified"),
      String(best_time ?? "Not specified"),
      String(lead_grade ?? "NEUTRAL"),
      String(lead_color ?? "#6B7280"),
      String(lead_bg ?? "#F9FAFB"),
      String(lead_emoji ?? ""),
      String(lead_priority ?? ""),
      String(date ?? ""),
      String(time ?? ""),
    );

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Mortgage Lead</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="background-color:#0B2A4A;border-radius:12px 12px 0 0;padding:32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <p style="margin:0;font-size:11px;font-weight:bold;letter-spacing:3px;color:#C6A15B;text-transform:uppercase;">INFINITE</p>
                          <p style="margin:0;font-size:20px;font-weight:bold;color:#ffffff;letter-spacing:1px;line-height:1.2;">Home Lending</p>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:6px 0 0 0;color:#94a3b8;font-size:13px;">IHL Mortgage Concierge · Lead Notification</p>
                  </td>
                  <td align="right" valign="middle">
                    <div style="background-color:${c};border-radius:50px;padding:8px 20px;display:inline-block;">
                      <p style="margin:0;color:#ffffff;font-size:16px;font-weight:bold;">${e(String(lead_emoji ?? ""))} ${e(String(lead_grade ?? ""))}</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:${bg};border-left:4px solid ${c};padding:16px 40px;">
              <p style="margin:0;color:${c};font-size:14px;font-weight:bold;">${e(String(lead_priority ?? ""))}</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#ffffff;padding:32px 40px;">
              <p style="margin:0 0 20px 0;color:#0B2A4A;font-size:18px;font-weight:bold;">Contact Information</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
                <tr style="background-color:#f8fafc;">
                  <td style="padding:12px 20px;color:#64748b;font-size:13px;width:160px;border-bottom:1px solid #e2e8f0;">Full Name</td>
                  <td style="padding:12px 20px;color:#0B2A4A;font-size:14px;font-weight:bold;border-bottom:1px solid #e2e8f0;">${en(lead_name)}</td>
                </tr>
                <tr>
                  <td style="padding:12px 20px;color:#64748b;font-size:13px;border-bottom:1px solid #e2e8f0;">Email</td>
                  <td style="padding:12px 20px;border-bottom:1px solid #e2e8f0;"><a href="mailto:${encodeURIComponent(lead_email)}" style="color:#C6A15B;font-size:14px;text-decoration:none;">${en(lead_email)}</a></td>
                </tr>
                <tr style="background-color:#f8fafc;">
                  <td style="padding:12px 20px;color:#64748b;font-size:13px;border-bottom:1px solid #e2e8f0;">Phone</td>
                  <td style="padding:12px 20px;border-bottom:1px solid #e2e8f0;"><a href="tel:${encodeURIComponent(String(lead_phone ?? ""))}" style="color:#C6A15B;font-size:14px;text-decoration:none;">${en(lead_phone)}</a></td>
                </tr>
                <tr>
                  <td style="padding:12px 20px;color:#64748b;font-size:13px;border-bottom:1px solid #e2e8f0;">Best Day</td>
                  <td style="padding:12px 20px;color:#1e293b;font-size:14px;border-bottom:1px solid #e2e8f0;">${en(best_day)}</td>
                </tr>
                <tr style="background-color:#f8fafc;">
                  <td style="padding:12px 20px;color:#64748b;font-size:13px;border-bottom:1px solid #e2e8f0;">Best Time</td>
                  <td style="padding:12px 20px;color:#1e293b;font-size:14px;border-bottom:1px solid #e2e8f0;">${en(best_time)}</td>
                </tr>
                <tr>
                  <td style="padding:12px 20px;color:#64748b;font-size:13px;border-bottom:1px solid #e2e8f0;">Preferred Contact</td>
                  <td style="padding:12px 20px;border-bottom:1px solid #e2e8f0;">
                    <span style="background-color:#EFE6D6;color:#0B2A4A;font-size:13px;font-weight:bold;padding:4px 12px;border-radius:20px;">${en(preferred_contact)}</span>
                  </td>
                </tr>
                <tr style="background-color:#f8fafc;">
                  <td style="padding:12px 20px;color:#64748b;font-size:13px;">Date &amp; Time</td>
                  <td style="padding:12px 20px;color:#1e293b;font-size:14px;">${en(date)} at ${en(time)}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:#ffffff;padding:0 40px 32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:0 8px 0 0;">
                    <a href="mailto:${encodeURIComponent(lead_email)}" style="display:block;background-color:#0B2A4A;color:#C6A15B;text-decoration:none;font-size:14px;font-weight:bold;padding:14px 0;border-radius:8px;text-align:center;">✉ Reply by Email</a>
                  </td>
                  <td align="center" style="padding:0 0 0 8px;">
                    <a href="tel:${encodeURIComponent(String(lead_phone ?? ""))}" style="display:block;background-color:#C6A15B;color:#0B2A4A;text-decoration:none;font-size:14px;font-weight:bold;padding:14px 0;border-radius:8px;text-align:center;">📞 Call Now</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${playbookHtml}
          <tr>
            <td style="padding:24px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;color:#94a3b8;font-size:12px;">This lead was captured via the <strong>IHL Mortgage Concierge</strong> widget on infinitehomelending.com</p>
                    <p style="margin:4px 0 0 0;color:#94a3b8;font-size:12px;">© 2026 Infinite Home Lending · Maryland · DC · Virginia</p>
                  </td>
                  <td align="right">
                    <p style="margin:0;color:#C6A15B;font-size:12px;font-weight:bold;">infinitehomelending.com</p>
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

    const subject = `${String(lead_emoji ?? "")} ${String(lead_grade ?? "")} Lead — ${lead_name} · ${String(preferred_contact ?? "")} · ${String(best_day ?? "")}`;

    const resendBody = {
      from: "IHL Mortgage Concierge <luna@update.infinitehomelending.com>",
      to: "Info@infinitehomelending.com",
      subject,
      html,
    };

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(resendBody),
      });

      const data: unknown = await response.json().catch(() => ({}));
      appendLead({
        timestamp: new Date().toISOString(),
        source: "concierge",
        grade: String(b.lead_grade ?? "NEUTRAL"),
        goal: /heloc|home equity|equity line|line of credit/i.test(tRaw) ? "HELOC" : /refinanc/i.test(tRaw) ? "Refinance" : /reverse mortgage|reverse/i.test(tRaw) ? "Reverse Mortgage" : /purchase|buy|buying/i.test(tRaw) ? "Purchase" : "Unknown",
        name: lead_name,
        email: lead_email,
        phone: String(lead_phone ?? ""),
        bestDay: String(best_day ?? ""),
        bestTime: String(best_time ?? ""),
        preferredContact: String(preferred_contact ?? ""),
        conversationLength: tRaw.split("\n").filter((l) => l.toLowerCase().startsWith("visitor")).length,
        budget: tRaw.match(/\$[\d,]+|\d{3},\d{3}/i)?.[0] ?? "",
        firstTimeBuyer: tRaw.toLowerCase().includes("first time") || tRaw.toLowerCase().includes("first home"),
        hasAgent: tRaw.toLowerCase().includes("no agent")
          ? false
          : tRaw.toLowerCase().includes("working with")
            ? true
            : null,
        creditStatus: tRaw.toLowerCase().includes("explore") && tRaw.toLowerCase().includes("credit")
          ? "Wants to explore"
          : tRaw.toLowerCase().includes("checked")
            ? "Has reviewed"
            : "Not discussed",
        timeline: tRaw.match(/(\d+)\s*(month|year)/i)?.[0] ?? "",
        transcript: tRaw,
      });
      res.status(response.status).json(data);
    } catch {
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  return router;
}
