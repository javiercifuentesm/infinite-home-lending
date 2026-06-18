/**
 * POST /api/send-lead — build flagship lead email and send via Resend (server-side; avoids browser CORS).
 */
import crypto from "crypto";
import { appendLead } from "./leadsStore";
import { createOrUpdateHubSpotContact } from "./hubspotClient";
import { buildSarahLeadHubSpotNotes, rateFromStructured } from "./hubspotFormFields";
import { sendBrevoWelcomeEmail } from "./brevoEmailRoute";
import { Router, type Request, type Response } from "express";

/*
 * ─── MORTGAGE ADVISOR (MA) CONFIGURATION ──────────────────────
 *
 * MAs are configured via the MORTGAGE_ADVISORS environment variable.
 * Format: "Full Name:email@domain.com,Full Name 2:email2@domain.com"
 *
 * Current MA list:
 *   Alma Jaramillo:Alma.Jaramillo@infinitehomelending.com
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  🅿️  PARKING LOT — Adding a new MA when you hire            │
 * │                                                             │
 * │  1. Go to Railway dashboard                                 │
 * │  2. Open infinite-home-lending service → Variables          │
 * │  3. Find: MORTGAGE_ADVISORS                                 │
 * │  4. Current value:                                          │
 * │     Alma Jaramillo:Alma.Jaramillo@infinitehomelending.com   │
 * │  5. Add new MA with a comma separator:                      │
 * │     Alma Jaramillo:Alma.Jaramillo@infinitehomelending.com,  │
 * │     New Name:newname@infinitehomelending.com                │
 * │  6. Click Save → Redeploy                                   │
 * │  7. New MA appears in assignment emails automatically        │
 * │     — zero code changes needed.                             │
 * └─────────────────────────────────────────────────────────────┘
 */

export function escapeHtml(s: string): string {
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
      // Legacy transcripts may prefix assistant lines as "Luna" or "Sarah"
      const isSarah = /^(luna|sarah)\b/i.test(line.trim());
      const bgColor = isSarah ? "#EFE6D6" : "#f0f4ff";
      const nameColor = isSarah ? "#0B2A4A" : "#1e40af";
      const borderRadius = isSarah ? "4px 16px 16px 16px" : "16px 4px 16px 16px";
      const timeMatch = line.match(/\((\d{1,2}:\d{2}\s*(?:AM|PM))\)/i);
      const time = timeMatch ? timeMatch[1] : "";
      const message = line
        .replace(/^(Luna|Sarah|Visitor)\s*\([^)]+\):\s*/i, "")
        .trim();
      const speaker = isSarah ? "Sarah · IHL Concierge" : "Visitor";

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

/** Visitor-only lines (lowercased, joined) — excludes assistant lines so detection is not biased by prompts. */
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

type TranscriptTurn = { speaker: "sarah" | "visitor"; message: string };

function parseTranscriptTurns(transcript: string): TranscriptTurn[] {
  const turns: TranscriptTurn[] = [];
  for (const line of transcript.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const sarah = trimmed.match(/^(?:luna|sarah)\s*\([^)]*\):\s*(.*)$/i);
    if (sarah) {
      turns.push({ speaker: "sarah", message: sarah[1].trim() });
      continue;
    }
    const visitor = trimmed.match(/^visitor\s*\([^)]*\):\s*(.*)$/i);
    if (visitor) {
      turns.push({ speaker: "visitor", message: visitor[1].trim() });
    }
  }
  return turns;
}

/** After Sarah asks a matching question, return the next visitor reply (if any). */
function nextVisitorReplyAfterSarahQuestion(
  turns: TranscriptTurn[],
  questionPatterns: RegExp[],
): string {
  for (let i = 0; i < turns.length; i++) {
    const turn = turns[i];
    if (turn.speaker !== "sarah") continue;
    if (!questionPatterns.some((p) => p.test(turn.message))) continue;
    for (let j = i + 1; j < turns.length; j++) {
      if (turns[j].speaker === "visitor") return turns[j].message;
      if (turns[j].speaker === "sarah") break;
    }
  }
  return "";
}

/** Index of Sarah turn matching question patterns, or -1. */
function findSarahQuestionIndex(turns: TranscriptTurn[], questionPatterns: RegExp[]): number {
  for (let i = 0; i < turns.length; i++) {
    if (turns[i].speaker !== "sarah") continue;
    if (questionPatterns.some((p) => p.test(turns[i].message))) return i;
  }
  return -1;
}

function isAffirmativeReply(raw: string): boolean {
  const t = raw.trim().toLowerCase().replace(/[!.?,]/g, "");
  return /^(yes|yeah|yep|yup|correct|that(?:'s| is) right|that(?:'s| is) correct|sure|ok(?:ay)?|yes please|please|absolutely|exactly|right|affirmative)$/.test(
    t,
  );
}

function parseMoneyFromText(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const dollar = trimmed.match(/\$\s*([\d,]+(?:\.\d+)?)/);
  if (dollar?.[1]) return dollar[1].replace(/,/g, "");
  const plain = trimmed.match(/^([\d,]+(?:\.\d+)?)\s*(?:k|thousand)?$/i);
  if (plain?.[1]) {
    const digits = plain[1].replace(/,/g, "");
    if (/k|thousand/i.test(trimmed)) {
      const num = Number(digits);
      if (Number.isFinite(num)) return String(Math.round(num * 1000));
    }
    return digits;
  }
  const embedded = trimmed.match(/\b([\d,]{4,}(?:\.\d+)?)\b/);
  return embedded?.[1]?.replace(/,/g, "") ?? "";
}

/** Parse money from a visitor reply (alias for shared money parser). */
function parseMoneyFromVisitorReply(raw: string): string {
  return parseMoneyFromText(raw);
}

/**
 * After Sarah's market-value question, parse the visitor reply — or, if the reply is
 * affirmative/non-numeric (e.g. "Yes" to a clarifying question), extract from Sarah's
 * follow-up message that restates the amount.
 */
function isSarahValueClarification(message: string): boolean {
  return /clarif|confirm|just to (?:make sure|clarify)|is that|you mean|so (?:that'?s|it'?s)/i.test(
    message,
  );
}

function extractEstimatedValueFromSarahTurns(
  turns: TranscriptTurn[],
  valueQuestionPatterns: RegExp[],
  stopPattern: RegExp,
): string {
  const sarahIdx = findSarahQuestionIndex(turns, valueQuestionPatterns);
  if (sarahIdx < 0) return "";

  for (let j = sarahIdx + 1; j < turns.length; j++) {
    const turn = turns[j];
    if (turn.speaker === "sarah" && stopPattern.test(turn.message)) break;

    if (turn.speaker === "visitor") {
      const money = parseMoneyFromText(turn.message);
      if (money) return money;
      continue;
    }

    if (turn.speaker === "sarah" && isSarahValueClarification(turn.message)) {
      const money = parseMoneyFromText(turn.message);
      if (!money) continue;
      for (let k = j + 1; k < turns.length; k++) {
        if (turns[k].speaker === "visitor") {
          if (isAffirmativeReply(turns[k].message) || !parseMoneyFromText(turns[k].message)) {
            return money;
          }
          break;
        }
        if (turns[k].speaker === "sarah") break;
      }
    }
  }

  return "";
}

function parseRefinanceGoalFromReply(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const t = trimmed.toLowerCase();
  if (/lower(?:ing)?\s*(?:my\s*)?rate|reduce\s*(?:my\s*)?rate|better\s*rate|rate\s*reduction/.test(t)) {
    return "reduce_rate";
  }
  if (/lower(?:ing)?\s*(?:my\s*)?payment|reduce\s*(?:my\s*)?payment|smaller\s*payment|monthly\s*payment/.test(t)) {
    return "lower_payment";
  }
  if (/equity|cash\s*out|access\s*(?:my\s*)?equity|pull\s*(?:out\s*)?equity|tap\s*equity/.test(t)) {
    return "cash_out";
  }
  if (/debt|consolidat/.test(t)) {
    return "consolidate_debt";
  }
  if (/unsure|not\s*sure|don'?t\s*know|exploring|figure\s*out/.test(t)) {
    return "unsure";
  }
  return trimmed;
}

function parseRateFromVisitorReply(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const m = trimmed.match(/(\d+(?:\.\d+)?)\s*(?:%|percent)?/i);
  return m?.[1] ? `${m[1]}%` : "";
}

const REFINANCE_GOAL_QUESTION_PATTERNS = [
  /main goal/i,
  /lowering your rate.*reducing your payment|reducing your payment.*accessing equity/i,
  /lower(?:ing)? your rate|accessing equity/i,
];

const REFINANCE_BALANCE_QUESTION_PATTERNS = [
  /principal balance/i,
  /current (?:loan )?balance/i,
  /mortgage balance/i,
  /loan balance/i,
  /how much (?:do you )?(?:still )?(?:owe|own)/i,
  /remaining (?:on (?:your|the) (?:mortgage|loan))/i,
];

const REFINANCE_VALUE_QUESTION_PATTERNS = [
  /market value/i,
  /estimate.*(?:home|house|property).*value/i,
  /(?:home|house|property).*(?:worth|valued)/i,
  /what would you estimate/i,
];

const REFINANCE_RATE_QUESTION_PATTERNS = [
  /interest rate/i,
  /current rate/i,
  /(?:do you )?know your (?:current )?rate/i,
  /what rate/i,
];

const REFINANCE_ADDRESS_QUESTION_PATTERNS = [
  /address.*(?:property|refinanc)/i,
  /property.*address/i,
  /what(?:'s| is) the address/i,
];

function extractEstimatedValueFromTurns(turns: TranscriptTurn[]): string {
  return extractEstimatedValueFromSarahTurns(
    turns,
    REFINANCE_VALUE_QUESTION_PATTERNS,
    /principal balance|interest rate|address of the property|credit situation|when did you purchase/i,
  );
}

const VOLUNTEERED_BALANCE_KEYWORDS =
  /\b(balance|principal|payoff|owe|owing|mortgage balance|loan balance|remaining|left on (?:the )?mortgage)\b/i;

const VOLUNTEERED_VALUE_KEYWORDS =
  /\b(worth|market value|home value|property value|estimated value|valued at|home is worth|house is worth)\b/i;

const STREET_SUFFIX =
  /(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|blvd|boulevard|court|ct|way|place|pl|circle|cir|parkway|pkwy)\.?\b/i;

/** Street + optional directional suffix + optional city, state, ZIP. */
const FULL_ADDRESS_PATTERN = new RegExp(
  String.raw`\d+\s+[A-Za-z0-9\s.,#'-]+${STREET_SUFFIX.source}\s*(?:[NSEW]{1,2}\b\.?\s*)?(?:,\s*[A-Za-z0-9][A-Za-z0-9\s.'-]*(?:,?\s*[A-Z]{2}\s+)?\d{5}(?:-\d{4})?)?`,
  "i",
);

function visitorMessagesFromTurns(turns: TranscriptTurn[]): string[] {
  return turns.filter((t) => t.speaker === "visitor").map((t) => t.message);
}

/** Visitor lines before Sarah's first matching question — empty if she never asked. */
function visitorMessagesBeforeSarahQuestion(
  turns: TranscriptTurn[],
  questionPatterns: RegExp[],
): string[] {
  const sarahIdx = findSarahQuestionIndex(turns, questionPatterns);
  if (sarahIdx < 0) return visitorMessagesFromTurns(turns);
  return turns.slice(0, sarahIdx).filter((t) => t.speaker === "visitor").map((t) => t.message);
}

function textClauses(text: string): string[] {
  const placeholders: string[] = [];
  const protectedText = text.replace(/\$\d{1,3}(?:,\d{3})+(?:\.\d+)?/g, (match) => {
    placeholders.push(match);
    return `\x00${placeholders.length - 1}\x00`;
  });

  return protectedText
    .split(/[,;]|\band\b|(?<=\.)\s+(?=[A-Z])/i)
    .map((s) => s.replace(/\x00(\d+)\x00/g, (_, i) => placeholders[Number(i)] ?? "").trim())
    .filter(Boolean);
}

function extractMoneyNearKeywords(text: string, keywordPattern: RegExp): string {
  for (const clause of textClauses(text)) {
    if (!keywordPattern.test(clause)) continue;
    const money = parseMoneyFromText(clause);
    if (money) return money;
  }
  if (keywordPattern.test(text)) {
    const money = parseMoneyFromText(text);
    if (money) return money;
  }
  return "";
}

function extractRateFromVolunteeredText(text: string): string {
  for (const clause of textClauses(text)) {
    if (!/\b(rate|interest|apr)\b/i.test(clause) && !/\d+(?:\.\d+)?\s*%/.test(clause)) continue;
    const rate = parseRateFromVisitorReply(clause);
    if (rate) return rate;
  }
  if (/\b(rate|interest|apr)\b/i.test(text) || /\d+(?:\.\d+)?\s*%/.test(text)) {
    return parseRateFromVisitorReply(text);
  }
  return "";
}

function extractAddressFromVolunteeredText(text: string): string {
  const streetTail = String.raw`\s*(?:[NSEW]{1,2}\b\.?\s*)?(?:,\s*[A-Za-z0-9][A-Za-z0-9\s.'-]*(?:,?\s*[A-Z]{2}\s+)?\d{5}(?:-\d{4})?)?`;

  const atAddressPattern = new RegExp(
    String.raw`\bat\s+(\d+\s+[A-Za-z0-9\s.,#'-]+${STREET_SUFFIX.source}${streetTail})`,
    "i",
  );
  const atMatch = text.match(atAddressPattern);
  if (atMatch?.[1]) return atMatch[1].replace(/\s+/g, " ").trim();

  const streetNumberPattern = new RegExp(
    String.raw`\d{3,}\s+[A-Za-z0-9\s.,#'-]+${STREET_SUFFIX.source}${streetTail}`,
    "i",
  );
  const streetMatch = text.match(streetNumberPattern);
  if (streetMatch?.[0]) return streetMatch[0].replace(/\s+/g, " ").trim();

  const match = text.match(FULL_ADDRESS_PATTERN);
  return match?.[0]?.replace(/\s+/g, " ").trim() ?? "";
}

function extractGoalFromVolunteeredText(text: string): string {
  if (!/refinanc|goal|lower|reduce|equity|payment|cash\s*out|consolidat/i.test(text)) return "";
  return parseRefinanceGoalFromReply(text);
}

/** Scan visitor messages for a field volunteered before Sarah asked (or anywhere if still missing). */
function volunteeredVisitorMessagesForField(
  turns: TranscriptTurn[],
  questionPatterns: RegExp[],
): string[] {
  const beforeQuestion = visitorMessagesBeforeSarahQuestion(turns, questionPatterns);
  if (beforeQuestion.length > 0) return beforeQuestion;
  return visitorMessagesFromTurns(turns);
}

function extractVolunteeredRefinanceGoal(turns: TranscriptTurn[]): string {
  const msgs = volunteeredVisitorMessagesForField(turns, REFINANCE_GOAL_QUESTION_PATTERNS);
  for (const msg of msgs) {
    const goal = extractGoalFromVolunteeredText(msg);
    if (goal) {
      return goal;
    }
  }
  return "";
}

function extractVolunteeredBalance(turns: TranscriptTurn[]): string {
  const msgs = volunteeredVisitorMessagesForField(turns, REFINANCE_BALANCE_QUESTION_PATTERNS);
  for (const msg of msgs) {
    const balance = extractMoneyNearKeywords(msg, VOLUNTEERED_BALANCE_KEYWORDS);
    if (balance) {
      return balance;
    }
  }
  return "";
}

function extractVolunteeredEstimatedValue(turns: TranscriptTurn[]): string {
  const msgs = volunteeredVisitorMessagesForField(turns, REFINANCE_VALUE_QUESTION_PATTERNS);
  for (const msg of msgs) {
    const value = extractMoneyNearKeywords(msg, VOLUNTEERED_VALUE_KEYWORDS);
    if (value) {
      return value;
    }
  }
  return "";
}

function extractVolunteeredRate(turns: TranscriptTurn[]): string {
  const msgs = volunteeredVisitorMessagesForField(turns, REFINANCE_RATE_QUESTION_PATTERNS);
  for (const msg of msgs) {
    const rate = extractRateFromVolunteeredText(msg);
    if (rate) {
      return rate;
    }
  }
  return "";
}

function extractVolunteeredAddress(turns: TranscriptTurn[]): string {
  const primaryMsgs = volunteeredVisitorMessagesForField(turns, REFINANCE_ADDRESS_QUESTION_PATTERNS);
  for (const msg of primaryMsgs) {
    const address = extractAddressFromVolunteeredText(msg);
    if (address) {
      return address;
    }
  }
  for (const msg of visitorMessagesFromTurns(turns)) {
    const address = extractAddressFromVolunteeredText(msg);
    if (address) {
      return address;
    }
  }
  return "";
}

/** Extract refinance property/loan fields from Sarah transcript for HubSpot. */
function extractSarahRefinanceHubSpotFields(transcript: string): Record<string, string> {
  const fields: Record<string, string> = {};
  const turns = parseTranscriptTurns(transcript);

  const goalReply = nextVisitorReplyAfterSarahQuestion(turns, REFINANCE_GOAL_QUESTION_PATTERNS);
  const goal = parseRefinanceGoalFromReply(goalReply);
  if (goal) fields.ihl_refinance_goal = goal;

  const balanceReply = nextVisitorReplyAfterSarahQuestion(turns, REFINANCE_BALANCE_QUESTION_PATTERNS);
  const balance = parseMoneyFromVisitorReply(balanceReply);
  if (balance) fields.ihl_current_balance = balance;

  const value = extractEstimatedValueFromTurns(turns);
  if (value) fields.ihl_estimated_value = value;

  const rateReply = nextVisitorReplyAfterSarahQuestion(turns, REFINANCE_RATE_QUESTION_PATTERNS);
  const rate = parseRateFromVisitorReply(rateReply);
  if (rate) fields.ihl_current_rate = rate;

  const addressReply = nextVisitorReplyAfterSarahQuestion(turns, REFINANCE_ADDRESS_QUESTION_PATTERNS);
  const addressFromReply = extractAddressFromVolunteeredText(addressReply) || addressReply.trim();
  if (addressFromReply) {
    fields.ihl_property_address = addressFromReply;
  } else {
    for (const turn of turns) {
      if (turn.speaker !== "visitor") continue;
      const volunteeredAddress = extractAddressFromVolunteeredText(turn.message);
      if (volunteeredAddress) {
        fields.ihl_property_address = volunteeredAddress;
        break;
      }
    }
  }

  if (!fields.ihl_refinance_goal) {
    const volunteeredGoal = extractVolunteeredRefinanceGoal(turns);
    if (volunteeredGoal) fields.ihl_refinance_goal = volunteeredGoal;
  }
  if (!fields.ihl_current_balance) {
    const volunteeredBalance = extractVolunteeredBalance(turns);
    if (volunteeredBalance) fields.ihl_current_balance = volunteeredBalance;
  }
  if (!fields.ihl_estimated_value) {
    const volunteeredValue = extractVolunteeredEstimatedValue(turns);
    if (volunteeredValue) fields.ihl_estimated_value = volunteeredValue;
  }
  if (!fields.ihl_current_rate) {
    const volunteeredRate = extractVolunteeredRate(turns);
    if (volunteeredRate) fields.ihl_current_rate = volunteeredRate;
  }
  if (!fields.ihl_property_address) {
    const volunteeredAddress = extractVolunteeredAddress(turns);
    if (volunteeredAddress) fields.ihl_property_address = volunteeredAddress;
  }

  return fields;
}

const HELOC_PURPOSE_QUESTION_PATTERNS = [
  /use the funds for/i,
  /looking to use the funds/i,
  /what are you looking to use/i,
  /purpose.*(?:heloc|equity|funds)/i,
];

const HELOC_ACCESS_QUESTION_PATTERNS = [
  /how much.*access/i,
  /looking to access/i,
  /ballpark figure/i,
  /amount.*access/i,
  /access amount/i,
  /how much.*(?:draw|borrow|take out)/i,
];

const HELOC_VALUE_QUESTION_PATTERNS = [
  /market value/i,
  /estimate.*(?:home|house|property).*value/i,
  /(?:home|house|property).*(?:worth|valued)/i,
  /what would you estimate/i,
  /how much.*(?:home|house|property).*(?:worth|valued)/i,
  /property value/i,
];

const HELOC_BALANCE_QUESTION_PATTERNS = [
  /principal balance/i,
  /current (?:loan )?balance/i,
  /mortgage balance/i,
  /loan balance/i,
  /how much (?:do you )?(?:still )?(?:owe|own)/i,
  /remaining (?:on (?:your|the) (?:mortgage|loan))/i,
  /current mortgage/i,
];

const HELOC_ADDRESS_QUESTION_PATTERNS = [
  /address.*(?:property|home|heloc)/i,
  /property.*address/i,
  /what(?:'s| is) the address/i,
  /where.*(?:property|home).*(?:located|is)/i,
];

const HELOC_VALUE_STOP_PATTERN =
  /use the funds|how much.*access|credit situation|ballpark figure|mortgage balance|interest rate/i;

const VOLUNTEERED_ACCESS_KEYWORDS =
  /\b(access|draw|line amount|looking to access|want to access|need about|borrow|take out|ballpark|heloc amount|amount i need|looking to get|looking for|need|want)\b/i;

function parseHelocPurposeFromReply(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const t = trimmed.toLowerCase();
  if (/home\s+improvements?|home\s*improv|renovat|remodel|repair|upgrade/i.test(t)) return "home_improvements";
  if (/debt\s*consolid|pay\s*off\s*debt|credit\s*card/i.test(t)) return "debt_consolidation";
  if (/major\s*expense|medical|wedding|education|tuition/i.test(t)) return "major_expense";
  if (/flexible|emergency|general|rainy\s*day|backup|something\s*else/i.test(t)) return "flexible_funds";
  if (/unsure|not\s*sure|don'?t\s*know|exploring/i.test(t)) return "unsure";
  return trimmed;
}

function parseDesiredAccessFromReply(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const t = trimmed.toLowerCase();
  if (/unsure|not\s*sure|don'?t\s*know/.test(t)) return "unsure";
  if (/under\s*25|less than\s*25|<\s*25|under\s*\$?\s*25/i.test(t)) return "under_25k";
  if (/25.*75|25\s*[-–to]+\s*75|\$?25\s*k.*\$?75\s*k/i.test(t)) return "range_25_75";
  if (/75.*150|75\s*[-–to]+\s*150|\$?75\s*k.*\$?150\s*k/i.test(t)) return "range_75_150";
  if (/over\s*150|more than\s*150|>\s*150|\$?150\s*k\+/i.test(t)) return "over_150k";
  const money = parseMoneyFromText(trimmed);
  if (money) {
    const n = Number(money);
    if (Number.isFinite(n)) {
      if (n < 25000) return "under_25k";
      if (n <= 75000) return "range_25_75";
      if (n <= 150000) return "range_75_150";
      return "over_150k";
    }
    return money;
  }
  return trimmed;
}

function extractHelocPurposeFromVolunteeredText(text: string): string {
  if (
    !/heloc|home equity|equity line|use the funds|funds for|home improvements?|improv|consolid|access|line of credit/i.test(
      text,
    )
  ) {
    return "";
  }
  return parseHelocPurposeFromReply(text);
}

function extractDesiredAccessFromVolunteeredText(text: string): string {
  const fromKeywords = extractMoneyNearKeywords(text, VOLUNTEERED_ACCESS_KEYWORDS);
  if (fromKeywords) return parseDesiredAccessFromReply(fromKeywords);
  if (VOLUNTEERED_ACCESS_KEYWORDS.test(text)) return parseDesiredAccessFromReply(text);

  if (!/heloc|home equity|equity line|line of credit|access|draw/i.test(text)) {
    return "";
  }
  for (const clause of textClauses(text)) {
    if (VOLUNTEERED_BALANCE_KEYWORDS.test(clause) || VOLUNTEERED_VALUE_KEYWORDS.test(clause)) {
      continue;
    }
    if (!/\$|\d{4,}/.test(clause)) continue;
    const money = parseMoneyFromText(clause);
    if (money) return parseDesiredAccessFromReply(money);
  }
  return "";
}

function extractVolunteeredHelocPurpose(turns: TranscriptTurn[]): string {
  const msgs = volunteeredVisitorMessagesForField(turns, HELOC_PURPOSE_QUESTION_PATTERNS);
  for (const msg of msgs) {
    const parsed = extractHelocPurposeFromVolunteeredText(msg);
    if (parsed) {
      return parsed;
    }
  }
  return "";
}

function extractVolunteeredDesiredAccess(turns: TranscriptTurn[]): string {
  const msgs = volunteeredVisitorMessagesForField(turns, HELOC_ACCESS_QUESTION_PATTERNS);
  for (const msg of msgs) {
    const parsed = extractDesiredAccessFromVolunteeredText(msg);
    if (parsed) {
      return parsed;
    }
  }
  return "";
}

/** Extract HELOC property/loan fields from Sarah transcript for HubSpot. */
function extractSarahHelocHubSpotFields(transcript: string): Record<string, string> {
  const fields: Record<string, string> = {};
  const turns = parseTranscriptTurns(transcript);

  const purposeReply = nextVisitorReplyAfterSarahQuestion(turns, HELOC_PURPOSE_QUESTION_PATTERNS);
  const purpose = parseHelocPurposeFromReply(purposeReply);
  if (purpose) fields.ihl_heloc_purpose = purpose;

  const addressReply = nextVisitorReplyAfterSarahQuestion(turns, HELOC_ADDRESS_QUESTION_PATTERNS);
  const addressFromReply = extractAddressFromVolunteeredText(addressReply) || addressReply.trim();
  if (addressFromReply) {
    fields.ihl_property_address = addressFromReply;
  } else {
    for (const turn of turns) {
      if (turn.speaker !== "visitor") continue;
      const volunteeredAddress = extractAddressFromVolunteeredText(turn.message);
      if (volunteeredAddress) {
        fields.ihl_property_address = volunteeredAddress;
        break;
      }
    }
  }

  const value = extractEstimatedValueFromSarahTurns(
    turns,
    HELOC_VALUE_QUESTION_PATTERNS,
    HELOC_VALUE_STOP_PATTERN,
  );
  if (value) fields.ihl_estimated_value = value;

  const balanceReply = nextVisitorReplyAfterSarahQuestion(turns, HELOC_BALANCE_QUESTION_PATTERNS);
  const balance = parseMoneyFromVisitorReply(balanceReply);
  if (balance) fields.ihl_current_balance = balance;

  const accessReply = nextVisitorReplyAfterSarahQuestion(turns, HELOC_ACCESS_QUESTION_PATTERNS);
  const access = parseDesiredAccessFromReply(accessReply);
  if (access) fields.ihl_desired_access = access;

  if (!fields.ihl_heloc_purpose) {
    const volunteeredPurpose = extractVolunteeredHelocPurpose(turns);
    if (volunteeredPurpose) fields.ihl_heloc_purpose = volunteeredPurpose;
  }
  if (!fields.ihl_property_address) {
    for (const msg of volunteeredVisitorMessagesForField(turns, HELOC_ADDRESS_QUESTION_PATTERNS)) {
      const volunteeredAddress = extractAddressFromVolunteeredText(msg);
      if (volunteeredAddress) {
        fields.ihl_property_address = volunteeredAddress;
        break;
      }
    }
    if (!fields.ihl_property_address) {
      for (const msg of visitorMessagesFromTurns(turns)) {
        const volunteeredAddress = extractAddressFromVolunteeredText(msg);
        if (volunteeredAddress) {
          fields.ihl_property_address = volunteeredAddress;
          break;
        }
      }
    }
  }
  if (!fields.ihl_estimated_value) {
    for (const msg of volunteeredVisitorMessagesForField(turns, HELOC_VALUE_QUESTION_PATTERNS)) {
      const volunteeredValue = extractMoneyNearKeywords(msg, VOLUNTEERED_VALUE_KEYWORDS);
      if (volunteeredValue) {
        fields.ihl_estimated_value = volunteeredValue;
        break;
      }
    }
  }
  if (!fields.ihl_current_balance) {
    for (const msg of volunteeredVisitorMessagesForField(turns, HELOC_BALANCE_QUESTION_PATTERNS)) {
      const volunteeredBalance = extractMoneyNearKeywords(msg, VOLUNTEERED_BALANCE_KEYWORDS);
      if (volunteeredBalance) {
        fields.ihl_current_balance = volunteeredBalance;
        break;
      }
    }
  }
  if (!fields.ihl_desired_access) {
    const volunteeredAccess = extractVolunteeredDesiredAccess(turns);
    if (volunteeredAccess) fields.ihl_desired_access = volunteeredAccess;
  }

  return fields;
}

const REVERSE_GOAL_QUESTION_PATTERNS = [
  /main goal/i,
  /supplemental income|eliminating your mortgage payment/i,
  /supplement.*income|eliminat(?:e|ing).*(?:mortgage )?payment/i,
];

const REVERSE_VALUE_QUESTION_PATTERNS = [
  /market value/i,
  /estimate.*(?:home|house|property).*value/i,
  /(?:home|house|property).*(?:worth|valued)/i,
  /what would you estimate/i,
  /how much.*(?:home|house|property).*(?:worth|valued)/i,
  /rough sense of how much your home is worth/i,
  /when you purchased/i,
];

const REVERSE_BALANCE_QUESTION_PATTERNS = [
  /principal balance/i,
  /current (?:loan )?balance/i,
  /mortgage balance/i,
  /loan balance/i,
  /how much (?:do you )?(?:still )?(?:owe|own)/i,
  /remaining (?:on (?:your|the) (?:mortgage|loan))/i,
  /current mortgage/i,
];

const REVERSE_RATE_QUESTION_PATTERNS = [
  /interest rate/i,
  /current rate/i,
  /(?:do you )?know your (?:current )?rate/i,
  /what rate/i,
];

const REVERSE_ADDRESS_QUESTION_PATTERNS = [
  /address.*(?:property|home|reverse)/i,
  /property.*address/i,
  /what(?:'s| is) the address/i,
  /where.*(?:property|home).*(?:located|is)/i,
];

const REVERSE_VALUE_STOP_PATTERN =
  /primary residence|main goal|HUD-approved counselor|mortgage balance|interest rate|address of the property/i;

function formatSarahRateForHubSpot(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  return rateFromStructured(trimmed) ?? rateFromStructured(parseRateFromVisitorReply(trimmed)) ?? "";
}

function parseReverseGoalFromReply(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const t = trimmed.toLowerCase();
  if (/supplement(?:al)?\s*income|monthly\s*income|extra\s*income|income stream/i.test(t)) {
    return "supplement_income";
  }
  if (/eliminat(?:e|ing)\s*(?:my\s*)?(?:mortgage\s*)?payment|no\s*mortgage\s*payment|pay\s*off\s*mortgage|reduce\s*stress/i.test(t)) {
    return "reduce_stress";
  }
  if (/stay\s*(?:in|at)\s*(?:my\s*)?home|age\s*in\s*place|remain\s*(?:in\s*)?home/i.test(t)) {
    return "stay_home";
  }
  if (/upcoming\s*expense|major\s*expense|medical|bills/i.test(t)) {
    return "upcoming_expenses";
  }
  if (/explor|something\s*else|unsure|not\s*sure|don'?t\s*know/i.test(t)) {
    return "exploring";
  }
  return trimmed;
}

function extractReverseGoalFromVolunteeredText(text: string): string {
  if (
    !/reverse mortgage|reverse|supplemental income|supplement.*income|eliminat.*payment|stay.*home|main goal|age in place/i.test(
      text,
    )
  ) {
    return "";
  }
  return parseReverseGoalFromReply(text);
}

function extractVolunteeredReverseGoal(turns: TranscriptTurn[]): string {
  for (const msg of volunteeredVisitorMessagesForField(turns, REVERSE_GOAL_QUESTION_PATTERNS)) {
    const goal = extractReverseGoalFromVolunteeredText(msg);
    if (goal) return goal;
  }
  return "";
}

function extractVolunteeredReverseAddress(turns: TranscriptTurn[]): string {
  for (const msg of volunteeredVisitorMessagesForField(turns, REVERSE_ADDRESS_QUESTION_PATTERNS)) {
    const address = extractAddressFromVolunteeredText(msg);
    if (address) return address;
  }
  for (const msg of visitorMessagesFromTurns(turns)) {
    const address = extractAddressFromVolunteeredText(msg);
    if (address) return address;
  }
  return "";
}

/** Extract reverse mortgage property/loan fields from Sarah transcript for HubSpot. */
function extractSarahReverseHubSpotFields(transcript: string): Record<string, string> {
  const fields: Record<string, string> = {};
  const turns = parseTranscriptTurns(transcript);

  const goalReply = nextVisitorReplyAfterSarahQuestion(turns, REVERSE_GOAL_QUESTION_PATTERNS);
  const goal = parseReverseGoalFromReply(goalReply);
  if (goal) fields.ihl_reverse_goal = goal;

  const addressReply = nextVisitorReplyAfterSarahQuestion(turns, REVERSE_ADDRESS_QUESTION_PATTERNS);
  const addressFromReply = extractAddressFromVolunteeredText(addressReply);
  if (addressFromReply) {
    fields.ihl_property_address = addressFromReply;
  } else {
    for (const turn of turns) {
      if (turn.speaker !== "visitor") continue;
      const volunteeredAddress = extractAddressFromVolunteeredText(turn.message);
      if (volunteeredAddress) {
        fields.ihl_property_address = volunteeredAddress;
        break;
      }
    }
  }

  const value = extractEstimatedValueFromSarahTurns(
    turns,
    REVERSE_VALUE_QUESTION_PATTERNS,
    REVERSE_VALUE_STOP_PATTERN,
  );
  if (value) fields.ihl_estimated_value = value;

  const balanceReply = nextVisitorReplyAfterSarahQuestion(turns, REVERSE_BALANCE_QUESTION_PATTERNS);
  const balance = parseMoneyFromVisitorReply(balanceReply);
  if (balance) fields.ihl_current_balance = balance;

  const rateReply = nextVisitorReplyAfterSarahQuestion(turns, REVERSE_RATE_QUESTION_PATTERNS);
  const rate = formatSarahRateForHubSpot(rateReply);
  if (rate) fields.ihl_current_rate = rate;

  if (!fields.ihl_reverse_goal) {
    const volunteeredGoal = extractVolunteeredReverseGoal(turns);
    if (volunteeredGoal) fields.ihl_reverse_goal = volunteeredGoal;
  }
  if (!fields.ihl_property_address) {
    const volunteeredAddress = extractVolunteeredReverseAddress(turns);
    if (volunteeredAddress) fields.ihl_property_address = volunteeredAddress;
  }
  if (!fields.ihl_estimated_value) {
    for (const msg of volunteeredVisitorMessagesForField(turns, REVERSE_VALUE_QUESTION_PATTERNS)) {
      const volunteeredValue = extractMoneyNearKeywords(msg, VOLUNTEERED_VALUE_KEYWORDS);
      if (volunteeredValue) {
        fields.ihl_estimated_value = volunteeredValue;
        break;
      }
    }
  }
  if (!fields.ihl_current_balance) {
    for (const msg of volunteeredVisitorMessagesForField(turns, REVERSE_BALANCE_QUESTION_PATTERNS)) {
      const volunteeredBalance = extractMoneyNearKeywords(msg, VOLUNTEERED_BALANCE_KEYWORDS);
      if (volunteeredBalance) {
        fields.ihl_current_balance = volunteeredBalance;
        break;
      }
    }
  }
  if (!fields.ihl_current_rate) {
    for (const msg of volunteeredVisitorMessagesForField(turns, REVERSE_RATE_QUESTION_PATTERNS)) {
      const volunteeredRate = formatSarahRateForHubSpot(extractRateFromVolunteeredText(msg));
      if (volunteeredRate) {
        fields.ihl_current_rate = volunteeredRate;
        break;
      }
    }
  }

  return fields;
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
        <p style="margin:0 0 14px 0;color:#64748b;font-size:12px;">Based on information shared with Sarah. Verify all figures on the first call.</p>
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
                          <p style="margin:0;color:#1e293b;font-size:13px;line-height:1.5;">Call and leave a warm, brief voicemail: <em>"Hi [Name], this is [your name] from Infinite Home Lending. I saw you connected with our AI concierge Sarah today and I wanted to personally reach out. Give me a call back at [number] — no pressure, just here to help!"</em></p>
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
                          <p style="margin:0;color:#1e293b;font-size:13px;line-height:1.5;">Send a short, warm text: <em>"Hi [Name]! This is [name] from Infinite Home Lending — just following up on your chat with Sarah. Happy to answer any questions at your own pace. Feel free to text or call me anytime! 😊"</em></p>
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
                          <p style="margin:0;color:#1e293b;font-size:13px;line-height:1.5;">Send a personal email introducing yourself, referencing their conversation with Sarah, and including one helpful resource (e.g. first-time buyer guide, MD program overview, or payment calculator link).</p>
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

/* ── MA list parser ── */
export type MortgageAdvisor = {
  name: string;
  email: string;
};

export function getMortgageAdvisors(): MortgageAdvisor[] {
  const raw =
    process.env.MORTGAGE_ADVISORS ?? "Alma Jaramillo:Alma.Jaramillo@infinitehomelending.com";
  return raw
    .split(",")
    .map((entry) => {
      const [name, email] = entry.trim().split(":");
      return { name: name?.trim() ?? "", email: email?.trim() ?? "" };
    })
    .filter((ma) => ma.name && ma.email);
}

/* ── Token store (in-memory) ── */
export type AssignmentToken = {
  token: string;
  maName: string;
  maEmail: string;
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  leadGrade: string;
  leadEmoji: string;
  leadPriority: string;
  bestDay: string;
  bestTime: string;
  preferredContact: string;
  transactionType: string;
  transactionEmoji: string;
  transcript: string;
  html: string;
  createdAt: number;
  used: boolean;
};

const assignmentTokens = new Map<string, AssignmentToken>();

export function createAssignmentToken(
  data: Omit<AssignmentToken, "token" | "createdAt" | "used">,
): string {
  const token = crypto.randomBytes(32).toString("hex");
  assignmentTokens.set(token, {
    ...data,
    token,
    createdAt: Date.now(),
    used: false,
  });
  return token;
}

export function getAssignmentToken(token: string): AssignmentToken | null {
  const entry = assignmentTokens.get(token);
  if (!entry) return null;
  if (Date.now() - entry.createdAt > 48 * 60 * 60 * 1000) {
    assignmentTokens.delete(token);
    return null;
  }
  return entry;
}

export function markTokenUsed(token: string): void {
  const entry = assignmentTokens.get(token);
  if (entry) entry.used = true;
}

/* ── Transaction type detector ── */
export function detectTransactionType(transcript: string): {
  type: string;
  emoji: string;
} {
  const t = transcript.toLowerCase();
  if (/heloc|home equity|equity line|line of credit/i.test(t)) return { type: "HELOC", emoji: "🏦" };
  if (/refinanc/i.test(t)) return { type: "Refinance", emoji: "🔄" };
  if (/reverse mortgage|reverse/i.test(t)) return { type: "Reverse Mortgage", emoji: "🛡️" };
  if (/purchase|buy|buying|first home|first time/i.test(t)) return { type: "Purchase", emoji: "🏠" };
  return { type: "General Inquiry", emoji: "📋" };
}

/* ── MA assignment section HTML (appended to Javier's email) ── */
export function generateAssignmentSection(
  tokens: { ma: MortgageAdvisor; token: string }[],
  baseUrl: string,
): string {
  const buttons = tokens
    .map(
      ({ ma, token }) => `
        <tr>
          <td style="padding:6px 0;">
            <a href="${baseUrl}/api/assign-lead/review?token=${token}"
              style="display:block;background-color:#C6A15B;color:#0B2A4A;
              text-decoration:none;font-size:14px;font-weight:bold;
              padding:14px 24px;border-radius:8px;text-align:center;">
              🎯 Assign to ${escapeHtml(ma.name)} →
            </a>
          </td>
        </tr>`,
    )
    .join("");

  return `
    <tr>
      <td style="background-color:#F0F4FF;border-top:3px solid #C6A15B;
        padding:28px 40px;">
        <p style="margin:0 0 6px 0;color:#0B2A4A;font-size:11px;
          font-weight:bold;letter-spacing:2px;text-transform:uppercase;">
          📋 Assign This Lead
        </p>
        <p style="margin:0 0 18px 0;color:#475569;font-size:13px;">
          Review the lead above and assign to your Mortgage Advisor:
        </p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${buttons}
        </table>
        <p style="margin:16px 0 0 0;color:#94a3b8;font-size:11px;">
          ⏱ Assignment links expire after 48 hours.
        </p>
      </td>
    </tr>`;
}

function generateTimeline(transcript: string): string {
  const e = escapeHtml;
  const lines = transcript.split("\n").filter((l) => l.trim());
  const milestones: { time: string; event: string; color: string }[] = [];

  lines.forEach((line) => {
    const timeMatch = line.match(/\((\d+:\d+\s*[AP]M)\)/i);
    const time = timeMatch ? timeMatch[1] : "";
    const text = line.toLowerCase();

    // Match legacy greetings that name either assistant label in older transcripts
    if ((line.toLowerCase().startsWith("luna") || line.toLowerCase().startsWith("sarah")) && text.includes("hi") && (text.includes("luna") || text.includes("sarah"))) {
      milestones.push({ time, event: "Visitor initiated contact with Sarah", color: "#0B2A4A" });
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

  const openingLine = `"Hi ${firstName}, this is [your name] from Infinite Home Lending. Sarah mentioned you're looking to ${purposeText}${budget ? ` with a budget around ${budget}` : ""} — I'd love to help make that happen!"`;

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
        <p style="margin:0 0 16px 0;color:#64748b;font-size:12px;">Full transcript of the Sarah AI conversation that led to this lead.</p>
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
      lead_subject_override,
    } = b;

    const tRaw = String(transcript ?? "");
    const visitorTranscript = getVisitorOnlyTranscript(tRaw);
    const { type: transactionType, emoji: transactionEmoji } = detectTransactionType(visitorTranscript);
    const purchaseTimeline = tRaw.match(/(\d+)\s*(month|year)/i)?.[0] ?? "";
    const ihlBudget = tRaw.match(/\$[\d,]+|\d{3},\d{3}/i)?.[0] ?? "";
    const refinanceHubSpotFields =
      transactionType === "Refinance" ? extractSarahRefinanceHubSpotFields(tRaw) : {};
    const helocHubSpotFields =
      transactionType === "HELOC" ? extractSarahHelocHubSpotFields(tRaw) : {};
    const reverseHubSpotFields =
      transactionType === "Reverse Mortgage" ? extractSarahReverseHubSpotFields(tRaw) : {};

    // TEMP DEBUG — Sarah → HubSpot lead sync (remove after investigation)
    console.log("[hubspot][sarah] (1) detected loan type:", transactionType);
    console.log("[hubspot][sarah] (2) ihl_loan_purpose value (loanPurpose):", transactionType);
    console.log("[hubspot][sarah] (2b) path field: not sent on Sarah sync — contact form uses path; Sarah only sends loanPurpose → ihl_loan_purpose");
    const hubSpotPayload = {
      name: lead_name,
      email: lead_email,
      phone: String(lead_phone ?? ""),
      leadSource: "Sarah AI",
      loanPurpose: transactionType,
      aiSourced: true,
      purchaseTimeline,
      extraProperties: {
        ihl_lead_grade: String(lead_grade ?? ""),
        ihl_budget: ihlBudget,
        ...refinanceHubSpotFields,
        ...helocHubSpotFields,
        ...reverseHubSpotFields,
      },
    };
    console.log("[hubspot][sarah] HubSpot sync payload:", hubSpotPayload);

    void createOrUpdateHubSpotContact({
      name: hubSpotPayload.name,
      email: hubSpotPayload.email,
      phone: hubSpotPayload.phone,
      leadSource: hubSpotPayload.leadSource,
      loanPurpose: hubSpotPayload.loanPurpose,
      aiSourced: hubSpotPayload.aiSourced,
      purchaseTimeline: hubSpotPayload.purchaseTimeline,
      notes: [
        ...buildSarahLeadHubSpotNotes({
          preferredContact: String(preferred_contact ?? ""),
          bestDay: String(best_day ?? ""),
          bestTime: String(best_time ?? ""),
        }),
        `Sarah AI Conversation Transcript:\n${tRaw}`,
      ],
      extraProperties: hubSpotPayload.extraProperties,
    })
      .then(() => {
        console.log("[hubspot][sarah] HubSpot contact sync succeeded for:", lead_email);
        const nameParts = String(lead_name ?? "").trim().split(/\s+/);
        const firstName = nameParts[0] ?? "";
        const lastName = nameParts.slice(1).join(" ");
        void sendBrevoWelcomeEmail({
          firstName,
          lastName,
          email: String(lead_email ?? ""),
          loanPurpose: transactionType,
        }).catch(() => {});
      })
      .catch((err) => {
        console.error("[hubspot][sarah] (3) HubSpot API sync failed:", err);
        if (err instanceof Error) {
          console.error("[hubspot][sarah] HubSpot error message:", err.message);
          console.error("[hubspot][sarah] HubSpot error stack:", err.stack);
        }
      });

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

    const advisors = getMortgageAdvisors();
    const baseUrl = process.env.API_BASE_URL ?? "https://infinite-home-lending-production.up.railway.app";

    const advisorTokens = advisors.map((ma) => ({
      ma,
      token: createAssignmentToken({
        maName: ma.name,
        maEmail: ma.email,
        leadName: lead_name,
        leadEmail: lead_email,
        leadPhone: String(lead_phone ?? ""),
        leadGrade: String(lead_grade ?? ""),
        leadEmoji: String(lead_emoji ?? ""),
        leadPriority: String(lead_priority ?? ""),
        bestDay: String(best_day ?? ""),
        bestTime: String(best_time ?? ""),
        preferredContact: String(preferred_contact ?? ""),
        transactionType,
        transactionEmoji,
        transcript: tRaw,
        html: "",
      }),
    }));

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
          ${generateAssignmentSection(advisorTokens, baseUrl)}
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

    advisorTokens.forEach(({ token }) => {
      const entry = assignmentTokens.get(token);
      if (entry) entry.html = html;
    });

    const subjectOverride = String(lead_subject_override ?? "").trim();
    const subject = subjectOverride
      ? subjectOverride
      : `${String(lead_emoji ?? "")} ${String(lead_grade ?? "")} Lead — ${lead_name} · ${String(preferred_contact ?? "")} · ${String(best_day ?? "")}`;

    const resendBody = {
      // Ensure Resend + domain allow listing for this sender address.
      from: "IHL Mortgage Concierge <sarah@update.infinitehomelending.com>",
      to: process.env.LEAD_ADVISOR_EMAIL ?? "javier.cifuentes@infinitehomelending.com",
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
