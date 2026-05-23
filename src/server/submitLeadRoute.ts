/**
 * POST /api/submit-lead — build lead summary, optional S3 GET presign, email advisor via Resend.
 * Designed to never throw uncaught: always returns JSON (or HTML in DEBUG_SUMMARY mode).
 */
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { tryGetS3Client } from "./lib/s3Upload";
import { Router, type Request, type Response } from "express";
import { Resend } from "resend";

const GET_URL_EXPIRES_SEC = 86400;
const MAX_ANSWER_ENTRIES = 48;

/** Presigned GET for advisor email links (time-limited; bucket stays private). */
export async function getSignedDownloadUrl(fileKey: string): Promise<string | null> {
  const bucket = process.env.S3_BUCKET;
  const s3 = tryGetS3Client();
  if (!bucket || !s3) return null;
  try {
    const command = new GetObjectCommand({ Bucket: bucket, Key: fileKey });
    return await getSignedUrl(s3, command, { expiresIn: GET_URL_EXPIRES_SEC });
  } catch (err) {
    console.error("getSignedDownloadUrl:", err);
    return null;
  }
}

const ALLOWED_PATHS = new Set(["purchase", "refinance", "heloc", "reverse", "plan", "explore"]);

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Never emit raw JSON in HTML — objects summarized for advisor-facing copy. */
function formatAnswerValueSafe(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "string") {
    const t = v.trim();
    if (!t) return "—";
    if (t.startsWith("{") && t.includes("}") && t.length > 48) {
      return "—";
    }
    return t;
  }
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) {
    const parts = v.map((x) => formatAnswerValueSafe(x)).filter((s) => s !== "—");
    return parts.length ? parts.join(", ") : "—";
  }
  if (typeof v === "object") {
    return "Structured data — see Property & Loan snapshot where applicable.";
  }
  return "—";
}

const REFINANCE_STRUCTURED_KEY = "Refinance path (structured)";

function scalarFromUnknown(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v.trim();
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return "";
}

/** Pull first matching key from a structured object (case-insensitive / partial). */
function pickStructuredField(obj: Record<string, unknown>, hints: string[]): string {
  const keys = Object.keys(obj);
  for (const hint of hints) {
    const h = hint.toLowerCase();
    const k = keys.find((key) => key.toLowerCase() === h || key.toLowerCase().includes(h));
    if (k !== undefined) {
      const s = scalarFromUnknown(obj[k]);
      if (s) return s;
    }
  }
  return "";
}

function parseRefinanceStructured(answers: Record<string, unknown>): {
  address: string;
  estimatedValue: string;
  loanBalance: string;
  rate: string;
} | null {
  const raw = answers[REFINANCE_STRUCTURED_KEY];
  if (raw == null) return null;
  let obj: Record<string, unknown> | null = null;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)) {
        obj = parsed as Record<string, unknown>;
      }
    } catch {
      return null;
    }
  } else if (typeof raw === "object" && !Array.isArray(raw)) {
    obj = raw as Record<string, unknown>;
  }
  if (!obj || Object.keys(obj).length === 0) return null;

  return {
    address: pickStructuredField(obj, ["address", "property address", "street", "subject property"]),
    estimatedValue: pickStructuredField(obj, ["estimated value", "value", "home value", "property value"]),
    loanBalance: pickStructuredField(obj, ["loan balance", "balance", "mortgage balance", "payoff"]),
    rate: pickStructuredField(obj, ["rate", "interest rate", "current rate", "note rate"]),
  };
}

function findAnswerByHints(answers: Record<string, unknown>, patterns: RegExp[]): string {
  for (const [k, v] of Object.entries(answers)) {
    if (k === REFINANCE_STRUCTURED_KEY) continue;
    const kl = k.toLowerCase();
    for (const p of patterns) {
      if (p.test(kl)) {
        const s = scalarFromUnknown(v);
        if (s) return s;
      }
    }
  }
  return "";
}

function extractClientSnapshotFields(answers: Record<string, unknown>): {
  stage: string;
  priority: string;
  contactPreference: string;
  bestTime: string;
} {
  const stage = findAnswerByHints(answers, [
    /stage/,
    /where.*things.*stand/,
    /where.*stand/,
    /things stand/,
    /where.*you.*in/,
    /timeline(?!.*close)/,
    /step in/,
  ]);
  const priority = findAnswerByHints(answers, [
    /priority/,
    /urgenc/,
    /how soon/,
    /what matters/,
    /matters most/,
  ]);
  const contactPreference = findAnswerByHints(answers, [
    /contact.*prefer/,
    /preferred.*contact/,
    /how.*reach/,
    /best.*way.*contact/,
    /phone.*or.*email/,
  ]);
  const bestDay = findAnswerByHints(answers, [
    /best.*day/,
    /day.*call/,
    /preferred.*day/,
  ]);
  const bestTimeRaw = findAnswerByHints(answers, [
    /best.*time/,
    /when.*call/,
    /availability/,
    /meet/,
  ]);
  const bestTime =
    bestDay && bestTimeRaw
      ? `${bestDay} at ${bestTimeRaw}`
      : bestDay || bestTimeRaw;

  const dash = (s: string) => (s.trim() ? s : "—");
  return {
    stage: dash(stage),
    priority: dash(priority),
    contactPreference: dash(contactPreference),
    bestTime: dash(bestTime),
  };
}

function pathDisplayName(path: string): string {
  if (!path) return "this intake";
  return path.charAt(0).toUpperCase() + path.slice(1);
}

export function buildSituationSummary(path: string, answers: Record<string, unknown>): string {
  const haystack = `${path} ${JSON.stringify(answers)}`.toLowerCase();
  const label = pathDisplayName(path);

  const wantsRate =
    /\b((lower|reduce).{0,12}(rate|payment)|save on|monthly payment|reduce payment|better rate)\b/.test(haystack);
  const wantsCashOut = /\b(cash\s*out|take equity|heloc|line of credit|tap equity)\b/.test(haystack);
  const purchaseSignal = /\b(buy|purchase|pre-?approval|offer|house hunt|home search)\b/.test(haystack);
  const sellerSignal = /\b(sell|listing|net sheet|list price|seller)\b/.test(haystack);
  const reverseSignal = /\b(reverse|hecm|age 62|62\+)\b/.test(haystack);

  const activelyEngaged =
    /\b(actively|actively looking|ready to|moving fast|this month|asap|urgent|under contract|offer accepted|closing|lock|listed|approved now)\b/.test(
      haystack,
    );
  const exploringTone =
    /\b(explor|research|compare|eventually|someday|not sure|just starting|learning)\b/.test(haystack) ||
    path === "explore" ||
    path === "plan";

  const primaryIntent = (): string => {
    if (path === "refinance" || path === "heloc") {
      if (wantsCashOut && wantsRate) return "restructuring debt to improve payment while accessing equity";
      if (wantsCashOut) return "unlocking equity with a deliberate cost-benefit frame";
      if (wantsRate) return "reducing rate and tightening payment structure on the current loan";
      return "re-evaluating their existing loan against current market terms";
    }
    if (path === "purchase") {
      return purchaseSignal
        ? "buying on a defined timeline with financing as the constraint to solve"
        : "moving toward a purchase—capacity and structure are the open questions";
    }
    if (path === "reverse" || reverseSignal) {
      return "evaluating later-life equity options where age, equity, and residual income drive the math";
    }
    if (path === "plan" || path === "explore") {
      return "mapping the landscape before committing to a single product lane";
    }
    if (sellerSignal) return "seller-side positioning where numbers need to hold up in negotiation";
    return "advancing a mortgage decision with enough detail to advise, not guess";
  };

  const momentum = (): string => {
    if (activelyEngaged && !exploringTone) {
      return "Signals read as near-term execution: treat this as a live file, not a cold inquiry.";
    }
    if (exploringTone && !activelyEngaged) {
      return "Engagement is real, but the lane is still open—your job is to narrow options fast.";
    }
    return "Expect a consult that converts when you bring specificity, not a brochure.";
  };

  if (path === "refinance" || path === "heloc") {
    return `${label} conversation: the client is ${primaryIntent()}. ${momentum()} Lead with numbers they can defend to a spouse or CPA.`;
  }
  if (path === "purchase") {
    return `${label} lead: ${primaryIntent()}. ${momentum()} Anchor qualification range and contingency risk before product features.`;
  }
  if (path === "reverse") {
    return `${label} scenario: ${primaryIntent()}. ${momentum()} Lead with eligibility guardrails and household cash-flow clarity.`;
  }
  if (path === "plan" || path === "explore") {
    return `Discovery under ${label}: ${primaryIntent()}. ${momentum()} Win by assigning one next step and a decision deadline.`;
  }
  return `${label} intake: ${primaryIntent()}. ${momentum()} Use the snapshot below to frame the opening question.`;
}

export function buildAdvisorInsight(params: {
  path: string;
  hasUploadedStatement: boolean;
  answers: Record<string, unknown>;
}): string {
  const { path, hasUploadedStatement, answers } = params;
  const haystack = `${path} ${JSON.stringify(answers)}`.toLowerCase();
  const label = pathDisplayName(path);
  const structured = parseRefinanceStructured(answers);

  const core = (): string => {
    if (path === "refinance" || path === "heloc") {
      return `Repositioning existing financing. ${structured?.loanBalance ? "You have enough on paper to model in minute one." : "You need hard numbers before you name the move."}`;
    }
    if (path === "purchase") {
      return "Buyer needs a ceiling that matches the market not a rate on a page.";
    }
    if (path === "reverse") {
      return "Later-life equity call—suitability and budget beat rate talk.";
    }
    if (path === "plan" || path === "explore") {
      return "Still picking a lane—first call makes you the advisor or the next quote.";
    }
    return `${label} lead. How you open decides if they trust the plan.`;
  };

  const context = (): string => {
    if (hasUploadedStatement) {
      return "Docs are in play. Treat the file as live.";
    }
    if (structured && (structured.rate || structured.loanBalance)) {
      return "Intake has structure. Lead with it.";
    }
    if (/\b(urgent|asap|this week|closing soon)\b/.test(haystack)) {
      return "Time pressure shows. Own the sequence not the inbox.";
    }
    return "They're picking who to trust. Certainty beats volume.";
  };

  const hitLine = (): string => {
    if (path === "refinance" || path === "heloc") {
      return "Clarity wins here.";
    }
    if (path === "purchase") {
      return "Direction matters more than detail.";
    }
    if (path === "reverse") {
      return "Don't overcomplicate this.";
    }
    if (path === "plan" || path === "explore") {
      return "Lead the conversation.";
    }
    return "Clarity wins here.";
  };

  return `${core()} ${context()} ${hitLine()}`;
}

export type EngagementLevel = "high" | "moderate";

export function classifyEngagement(answers: Record<string, unknown>, path: string): EngagementLevel {
  const haystack = `${path} ${JSON.stringify(answers)}`.toLowerCase();
  const activelyLooking =
    /\b(actively looking|actively searching|ready to buy|ready to refi|ready to move|need this|need to move|soon|urgent|asap|this week|right now)\b/.test(
      haystack,
    );
  const exploring =
    /\b(explor|research|compare|eventually|someday|not sure|just looking|learning|evaluating options)\b/.test(haystack) ||
    path === "explore" ||
    path === "plan";

  if (activelyLooking && !exploring) return "high";
  if (exploring && !activelyLooking) return "moderate";
  if (activelyLooking) return "high";
  return "moderate";
}

export function engagementSignalCopy(
  level: EngagementLevel,
  leadCategory: "Hot" | "Warm" | "Neutral",
): { headline: string; body: string } {
  const line = (s: string) => ({ headline: s, body: "" as string });
  if (level === "high") {
    return line("Ready to move—don't slow this down.");
  }
  if (leadCategory === "Neutral") {
    return line("Early stage—build clarity first.");
  }
  return line("Momentum is there—keep it.");
}

export type OpportunitySnapshot = {
  title: string;
  strength: string;
  readiness: string;
  summary: string;
};

function summarizeOpportunitySnapshot(params: {
  path: string;
  strength: string;
  readiness: string;
  hasUploadedStatement: boolean;
}): string {
  const { path, strength, readiness, hasUploadedStatement } = params;
  const strong = strength === "Strong";
  const high = readiness === "High";

  if (path === "refinance" || path === "heloc") {
    if (strong && high) {
      return "Price two real scenarios. Make the winning path obvious.";
    }
    if (strong) {
      return hasUploadedStatement
        ? "Start from the statement—name two defensible options not a deck."
        : "Handle this by turning intake into two options with one owner for what happens next.";
    }
    if (high) {
      return "Open on payoff and goal—then deliver the side-by-side they can act on today.";
    }
    return "Name the economic target first—then cut to two paths that fit it.";
  }

  if (path === "purchase") {
    if (strong && high) {
      return "Qualify the offer in one pass—pin range and contingency before product.";
    }
    if (strong) {
      return "Handle this with one approval story that matches their search—not a rate grid.";
    }
    if (high) {
      return "Confirm price band and milestones—then own the very next touch.";
    }
    return "Set the ceiling against market reality—then fit structure underneath it.";
  }

  if (path === "reverse") {
    if (strong && high) {
      return "Anchor later-life suitability first—eligibility obligations and cash flow in that order.";
    }
    if (strong) {
      return "Handle this with tradeoffs in plain language—suitability is clear enough to advise now.";
    }
    if (high) {
      return "Validate eligibility first—then frame what sustainable looks like in dollars.";
    }
    return "Lead on suitability and what stays in the budget—certainty not a brochure.";
  }

  if (path === "plan" || path === "explore") {
    if (strong && high) {
      return "Run one lane and a dated decision point—no parallel stories.";
    }
    if (strong) {
      return "Book a concrete next step now—curiosity cools fast.";
    }
    return "Narrow the options and pick a spine—credibility now beats another quote.";
  }

  if (strong && high) {
    return "Own the follow-up and the timeline—priority file not another queue entry.";
  }
  if (strong) {
    return "Handle this in one decisive touch—structure not volume.";
  }
  if (high) {
    return "Tight loop: confirm facts name two paths book the next action.";
  }
  return "Lock numbers and a deadline in the first exchange or lose the file.";
}

export function createOpportunitySnapshot(params: {
  path: string;
  answers: Record<string, unknown>;
  hasUploadedStatement: boolean;
}): OpportunitySnapshot {
  const { path, answers, hasUploadedStatement } = params;
  const haystack = `${path} ${JSON.stringify(answers)}`.toLowerCase();

  const titleByPath: Record<string, string> = {
    refinance: "Refinance Optimization Opportunity",
    purchase: "Purchase Advisory Opportunity",
    reverse: "Equity Conversion Opportunity",
    heloc: "Equity Access Opportunity",
  };
  const title = titleByPath[path] ?? "Client Advisory Opportunity";

  const structured = parseRefinanceStructured(answers);
  const hasStructuredData =
    structured !== null &&
    Boolean(structured.address || structured.estimatedValue || structured.loanBalance || structured.rate);

  const activelyLooking =
    /\b(actively looking|actively searching|ready to buy|ready to refi|ready to move|need this|need to move|soon|urgent|asap|this week|right now)\b/.test(
      haystack,
    );

  const exploring =
    /\b(explor|research|compare|eventually|someday|not sure|just looking|learning|evaluating options)\b/.test(haystack) ||
    path === "explore" ||
    path === "plan";

  const strength =
    hasStructuredData || hasUploadedStatement || activelyLooking ? "Strong" : "Moderate";

  let readiness: string;
  if (activelyLooking && !exploring) {
    readiness = "High";
  } else if (exploring && !activelyLooking) {
    readiness = "Moderate";
  } else if (activelyLooking) {
    readiness = "High";
  } else if (exploring) {
    readiness = "Moderate";
  } else {
    readiness = "Moderate";
  }

  const summary = summarizeOpportunitySnapshot({
    path,
    strength,
    readiness,
    hasUploadedStatement,
  });

  return { title, strength, readiness, summary };
}

export type ConversationAngle = {
  openingPositioning: string;
  suggestedLeadIn: string;
  focusAreas: [string, string];
};

type PrimaryAngle =
  | "refi_equity_use"
  | "refi_payment_truth"
  | "refi_rate_cost_hold"
  | "heloc_access_draw"
  | "purchase_offer_defense"
  | "purchase_price_payment_fit"
  | "reverse_post_close_budget"
  | "reverse_comfort_suitability"
  | "plan_constraint_lane"
  | "plan_tradeoff_collapse"
  | "default_payment_truth"
  | "default_structure_stakes";

export function buildConversationAngle(params: {
  path: string;
  answers: Record<string, unknown>;
  opportunity: OpportunitySnapshot;
}): ConversationAngle {
  const { path, answers, opportunity } = params;
  const haystack = `${path} ${JSON.stringify(answers)}`.toLowerCase();
  const strong = opportunity.strength === "Strong";
  const high = opportunity.readiness === "High";

  const wantsCashOut = /\b(cash\s*out|take equity|tap equity|heloc|line of credit)\b/.test(haystack);
  const paymentFirst = /\b(payment|monthly|piti|budget|afford)\b/.test(haystack);
  const rateFirst = /\b(rate|apr|interest|lower rate)\b/.test(haystack);
  const timeSignal =
    high &&
    /\b(soon|urgent|asap|this week|closing|under contract|offer|deadline|lock)\b/.test(haystack);

  let primaryAngle: PrimaryAngle;

  if (path === "refinance" || path === "heloc") {
    if (path === "heloc") primaryAngle = "heloc_access_draw";
    else if (wantsCashOut) primaryAngle = "refi_equity_use";
    else if (paymentFirst || !rateFirst) primaryAngle = "refi_payment_truth";
    else primaryAngle = "refi_rate_cost_hold";

    if (!strong && high && primaryAngle === "refi_rate_cost_hold" && paymentFirst) {
      primaryAngle = "refi_payment_truth";
    }

    const refiNarratives: Record<
      "refi_equity_use" | "refi_payment_truth" | "refi_rate_cost_hold" | "heloc_access_draw",
      { opening: string; leadIn: string; f1: string; f2: string }
    > = {
      refi_equity_use: {
        opening: strong
          ? "Drive the call on equity use: purpose and LTV decide whether this refinance works—rate is downstream."
          : "Anchor equity use first: until purpose and leverage are clear, rate comparison is a distraction.",
        leadIn:
          "Based on what you shared, what stood out to me is what you're doing with the equity—there's a good chance structure and LTV matter more than shaving another eighth.",
        f1: "Purpose and leverage: how much equity goes to work versus payment you're willing to carry—push that thread.",
        f2: "Deadlines or life events that should set structure before another rate quote.",
      },
      refi_payment_truth: {
        opening: strong
          ? "Drive the call on payment truth: the monthly delta is the scoreboard—rate is the mechanism, not the message."
          : "Frame payment first: name what 'better' means on the statement, then fit structure to that.",
        leadIn:
          "What stood out to me is the payment story—based on what you shared, there's a good chance two structures win on the delta, not the lowest rate on the page.",
        f1: "Term, MI, points—where the monthly change actually comes from so savings hold up next year.",
        f2: "Cash-out or life spend that could change the payment picture after closing.",
      },
      refi_rate_cost_hold: {
        opening: strong
          ? "Drive the call on rate cost versus hold time: break-even against realistic tenure beats chasing another eighth."
          : "Center hold horizon: par versus points only matters once you know how long this loan lives.",
        leadIn:
          "What stood out to me is hold time—based on what you shared, there's a good chance break-even should pick the loan, not curiosity about rate alone.",
        f1: "Points, par, and break-even against how long they'll actually keep the paper.",
        f2: "Anything that could accelerate payoff or force a refi sooner than they think.",
      },
      heloc_access_draw: {
        opening: strong
          ? "Drive the call on access and draw: how they'll use the line decides the product—not a generic second-rate quote."
          : "Anchor draw behavior first: line versus fixed second follows how money moves in real life.",
        leadIn:
          "Based on what you shared, what stood out to me is access—there's a good chance draw pattern matters more than the sticker on a second.",
        f1: "Line versus fixed second against real draw behavior—behavior, not rate.",
        f2: "Purpose and reserves so the line doesn't become a slow leak.",
      },
    };

    const block = refiNarratives[primaryAngle];
    let leadIn = block.leadIn;
    if (timeSignal) {
      leadIn += " If the clock is real, I'd pin this angle now—not stack more quotes.";
    }
    return {
      openingPositioning: block.opening,
      suggestedLeadIn: leadIn,
      focusAreas: [block.f1, block.f2],
    };
  }

  if (path === "purchase") {
    primaryAngle = high ? "purchase_offer_defense" : "purchase_price_payment_fit";

    if (primaryAngle === "purchase_offer_defense") {
      let leadIn =
        "Based on what you shared, what stood out to me is offer readiness—there's a good chance the win is a ceiling you can defend under pressure, not a max on paper.";
      if (timeSignal) {
        leadIn += " If you're circling something live, guardrails first—same angle.";
      }
      return {
        openingPositioning: strong
          ? "Drive the call on offer-grade financing: the number has to survive negotiation and inspection—same story start to finish."
          : "Own offer reality: the ceiling must hold when the house and seller push back—not in theory.",
        suggestedLeadIn: leadIn,
        focusAreas: [
          "How your approved ceiling behaves at prices you're actually bidding—same defense, deeper.",
          "Appraisal and contingency fault lines—where deals break and how your financing still reads clean.",
        ],
      };
    }

    return {
      openingPositioning: strong
        ? "Drive the call on price-to-payment fit: bridge list psychology to a payment they'll actually own."
        : "Anchor list price against payment reality before programs—same gap, closed loop.",
      suggestedLeadIn:
        "What stood out to me is the gap between what homes list for and the payment you'll stomach—based on what you shared, I want to hold that line before we talk product.",
      focusAreas: [
        "Reserves and payment band when taxes, insurance, or rates nudge—same fit story.",
        "How wide the search can stay without the approval story falling apart.",
      ],
    };
  }

  if (path === "reverse") {
    primaryAngle = high ? "reverse_post_close_budget" : "reverse_comfort_suitability";

    if (primaryAngle === "reverse_post_close_budget") {
      return {
        openingPositioning:
          "Drive the call on post-close budget: suitability shows up as what stays in the household after the loan reshapes cash flow.",
        suggestedLeadIn:
          "Based on what you shared, what stood out to me is what stays in the budget after closing—there's a good chance cash flow owns this conversation, not rate.",
        focusAreas: [
          "Obligations and housing costs that can't flex—same budget narrative after closing.",
          "Tenure and legacy—how long this structure has to hold without regret.",
        ],
      };
    }

    return {
      openingPositioning:
        "Drive the call on comfort and suitability: name what 'safe' feels like monthly before product enters the room.",
      suggestedLeadIn:
        "What stood out to me is how personal this is—based on what you shared, I want comfort defined in dollars before we compare options.",
      focusAreas: [
        "Non-negotiables in the household budget—same suitability thread.",
        "Whether equity use is strategic or reactive—continuity for the same decision.",
      ],
    };
  }

  if (path === "plan" || path === "explore") {
    primaryAngle = high ? "plan_constraint_lane" : "plan_tradeoff_collapse";

    if (primaryAngle === "plan_constraint_lane") {
      return {
        openingPositioning:
          "Drive the call on the dominant constraint: one lane, one tradeoff—authority beats a catalog.",
        suggestedLeadIn:
          "Based on what you shared, there's a good chance one constraint is steering this—what stood out to me is what you won't bend on yet, and I'm building from that same center.",
        focusAreas: [
          "The constraint that actually runs the decision—expand that, don't add parallel stories.",
          "What 'yes' looks like on a calendar so the lane has a deadline.",
        ],
      };
    }

    return {
      openingPositioning:
        "Drive the call on collapsing to one tradeoff: fewer options, sharper spine—same decision, less noise.",
      suggestedLeadIn:
        "What stood out to me is too many open doors—based on what you shared, I want one dominant tradeoff on the table first.",
      focusAreas: [
        "The tradeoff that clears the board—continuation, not a second narrative.",
        "One dated next step so the collapse sticks.",
      ],
    };
  }

  primaryAngle = paymentFirst ? "default_payment_truth" : "default_structure_stakes";

  if (primaryAngle === "default_payment_truth") {
    return {
      openingPositioning:
        "Drive the call on payment reality: sticker rate versus what hits the account monthly—same truth, different labels.",
      suggestedLeadIn:
        "Based on what you shared, what stood out to me is payment—there's a good chance we should make the monthly picture explicit before we chase rate.",
      focusAreas: [
        "Where payment lands after costs and term—same angle, numbers on the table.",
        "The risk they actually fear—liquidity or volatility—and speak to that first.",
      ],
    };
  }

  return {
    openingPositioning:
      "Drive the call on structure and stakes: what has to stay true for this to be a win—product follows.",
    suggestedLeadIn:
      "What stood out to me is the outcome you're protecting—based on what you shared, I want structure matched to that stake before we compare labels.",
    focusAreas: [
      "What must hold if rates or life shift six months out—same structural bet.",
      "Timeline or cash needs that could force a different structure sooner than they think.",
    ],
  };
}

/** Future: route by product path. */
export function getAdvisorEmailForPath(path: string): string {
  const env = process.env;
  const byPath: Record<string, string | undefined> = {
    purchase: env.ADVISOR_PURCHASE,
    refinance: env.ADVISOR_REFINANCE,
    heloc: env.ADVISOR_HELOC,
    reverse: env.ADVISOR_REVERSE,
    plan: env.ADVISOR_PLAN,
    explore: env.ADVISOR_EXPLORE,
  };
  return (byPath[path] ?? env.LEAD_ADVISOR_EMAIL ?? env.RESEND_TO_EMAIL ?? "").trim();
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Human goal line for refinance / HELOC property snapshot (presentation only). */
function inferRefinanceGoalLabel(answers: Record<string, unknown>): string {
  const haystack = `${JSON.stringify(answers)}`.toLowerCase();
  const wantsCashOut = /\b(cash\s*out|take equity|tap equity|heloc|line of credit)\b/.test(haystack);
  const wantsRate = /\b(lower rate|reduce rate|better rate|save on rate|interest rate|refi.*rate)\b/.test(haystack);
  const wantsPayment = /\b(payment|monthly|piti|afford)\b/.test(haystack);
  if (wantsCashOut && wantsRate) return "Cash-out + rate improvement";
  if (wantsCashOut) return "Access equity";
  if (wantsPayment && wantsRate) return "Lower payment & rate";
  if (wantsPayment) return "Lower payment";
  if (wantsRate) return "Lower rate";
  return "Refinance optimization";
}

/** Structured refinance fields for intake / property sections — never emit raw JSON. */
function formatStructuredRefinanceLines(answers: Record<string, unknown>): string | null {
  const r = parseRefinanceStructured(answers);
  if (!r) return null;
  const lines = [
    `Goal: ${inferRefinanceGoalLabel(answers)}`,
    `Address: ${r.address || "—"}`,
    `Estimated value: ${r.estimatedValue || "—"}`,
    `Balance: ${r.loanBalance || "—"}`,
    `Rate: ${r.rate || "—"}`,
  ];
  return lines.map((line) => escapeHtml(line)).join("<br/>");
}

/** Spoken-style opener (max two short lines) — tight confident voice. */
function humanConversationOpening(params: {
  path: string;
  hasUrgency: boolean;
  isExploratory: boolean;
  leadCategory: "Hot" | "Warm" | "Neutral";
}): { main: string; followUp: string } {
  const { path, hasUrgency, isExploratory, leadCategory } = params;
  const isRefi = path === "refinance" || path === "heloc";
  const isPurchase = path === "purchase";
  const isReverse = path === "reverse";
  const isPlan = path === "plan" || path === "explore";

  if (leadCategory === "Hot") {
    if (hasUrgency) {
      if (isRefi) {
        return {
          main: "Let's get a straight read on the refi—what's going out the door every month right now?",
          followUp: "Two paths on this call. Name the number you're actually trying to change.",
        };
      }
      if (isPurchase) {
        return {
          main: "Let's sync financing with the search—how fast do you need to be set?",
          followUp: "Price band and hard deadline first—structure comes after that.",
        };
      }
      if (isReverse) {
        return {
          main: "Let's ground this in the budget—what has to stay after any move on equity?",
          followUp: "Eligibility and cash flow first. Labels second.",
        };
      }
      return {
        main: "Pick one outcome for this week—what's true by Friday?",
        followUp: "Answer or a working plan. Choose before we add options.",
      };
    }
    if (isRefi) {
      return {
        main: "Rate and payment on the table—which one's driving the refi?",
        followUp: "Whichever costs you sleep goes first.",
      };
    }
    if (isPurchase) {
      return {
        main: "Let's line up your pre-approval with the search—what range are you in right now?",
        followUp: "Ballpark's enough to set the next move. We'll tighten with comps.",
      };
    }
    return {
      main: "State the real objective in one line—what happens in the next 30 days?",
      followUp: "If you're in motion, book the follow-up on this call.",
    };
  }

  if (leadCategory === "Warm") {
    if (isExploratory) {
      if (isPlan || isPurchase) {
        return {
          main: "What's the open decision you're circling and not making?",
          followUp: "Two clean lanes. Pick one. Then we add product.",
        };
      }
      return {
        main: "Name what's still fuzzy on the loan—what do you need resolved first?",
        followUp: "Fifteen minutes, one thread. You leave with a next step.",
      };
    }
    if (isRefi) {
      return {
        main: "Where's the real pressure on the refi—where do you want clarity first?",
        followUp: "Book fifteen minutes this week. First touch sets the sequence.",
      };
    }
    return {
      main: "Let's handle this live—where's the file in two weeks?",
      followUp: "Send a time. The call ends with a dated next action.",
    };
  }

  if (isExploratory) {
    return {
      main: isPlan
        ? "What timeline are you actually working with?"
        : "Main question still open—what needs a clean answer before you move?",
      followUp: isPlan
        ? "One pass out loud. One lane. No parallel stories."
        : "Say it flat. The next step's smaller than you think.",
    };
  }
  if (isRefi) {
    return {
      main: "What does a good first call fix for you—what does handled look like?",
      followUp: "First call's alignment only. No product pick owed on the phone.",
    };
  }
  if (isPurchase) {
    return {
      main: "Line up numbers with the search—what range are you targeting now?",
      followUp: "Foggiest money piece first. That owns the first pass.",
    };
  }
  return {
    main: "What made you reach out—what are you locking down today?",
    followUp: "One topic. One next step. Then we're done.",
  };
}

function safeConversationLines(params: {
  path: string;
  hasUrgency: boolean;
  isExploratory: boolean;
  leadCategory: "Hot" | "Warm" | "Neutral";
}): { main: string; followUp: string } {
  try {
    const o = humanConversationOpening(params);
    if (o && typeof o === "object" && typeof o.main === "string") {
      return { main: o.main, followUp: typeof o.followUp === "string" ? o.followUp : "" };
    }
  } catch {
    /* ignore */
  }
  return {
    main: "Name the main open question—what still needs a clean answer before you move?",
    followUp: "",
  };
}

/** Single key phrase after em dash — bold first 3–5 words only (one &lt;strong&gt;). */
function emphasizeOpportunitySummaryHtml(summary: string): string {
  const e = escapeHtml(summary).trim();
  const sep = "—";
  const j = e.indexOf(sep);
  if (j > 0 && j < e.length - sep.length) {
    const tail = e.slice(j + sep.length).trim();
    const words = tail.split(/\s+/).filter(Boolean);
    if (words.length === 0) return e;
    const n = Math.min(5, Math.max(1, words.length));
    const phrase = words.slice(0, n).join(" ");
    const rest = words.slice(n).join(" ");
    const spacer = rest ? " " : "";
    return `${e.slice(0, j + sep.length)}<strong style="font-weight:600;color:#020617;">${phrase}</strong>${spacer}${rest}`;
  }
  return e;
}

function formatFullIntakeCellHtml(key: string, value: unknown, answers: Record<string, unknown>): string {
  if (key === REFINANCE_STRUCTURED_KEY) {
    const structured = formatStructuredRefinanceLines(answers);
    if (structured) return structured;
  }
  const safe = formatAnswerValueSafe(value);
  if (safe === "—" && value != null && typeof value === "object" && !Array.isArray(value)) {
    const sub = formatStructuredRefinanceLines({ ...answers, [REFINANCE_STRUCTURED_KEY]: value });
    if (sub) return sub;
  }
  return escapeHtml(safe).replace(/\n/g, "<br/>");
}

function calculateLeadScore(params: {
  path: string;
  opportunitySnapshot: OpportunitySnapshot;
  engagementLevel: EngagementLevel;
  hasUploadedStatement: boolean;
  answers: Record<string, unknown>;
}): number {
  const { path, opportunitySnapshot, engagementLevel, hasUploadedStatement, answers } = params;

  let score = 0;

  // Strength (0–30)
  if (opportunitySnapshot.strength === "Strong") score += 30;
  else score += 15;

  // Readiness (0–25)
  if (opportunitySnapshot.readiness === "High") score += 25;
  else score += 12;

  // Statement uploaded (0–20)
  if (hasUploadedStatement) score += 20;

  // Engagement (0–15)
  if (engagementLevel === "high") score += 15;
  else score += 8;

  // Path bonus — structured data present (0–10)
  const structured = parseRefinanceStructured(answers);
  const hasStructuredData =
    structured !== null &&
    Boolean(structured.address || structured.estimatedValue || structured.loanBalance || structured.rate);
  const bonusPaths = new Set(["refinance", "heloc", "purchase", "reverse"]);
  if (bonusPaths.has(path) && hasStructuredData) score += 10;

  return Math.min(100, score);
}

function buildEmailHtml(params: {
  name: string;
  email: string;
  phone: string;
  path: string;
  answers: Record<string, unknown>;
  entries: [string, unknown][];
  hasUploadedStatement: boolean;
  /** Presigned GET URL for uploaded PDF; not a public S3 URL. */
  documentUrl: string | null;
  submittedLang: "en" | "es";
}): string {
  const { name, email, phone, path, answers, entries, hasUploadedStatement, documentUrl, submittedLang } =
    params;

  const snap = extractClientSnapshotFields(answers);
  const opportunitySnapshot = createOpportunitySnapshot({ path, answers, hasUploadedStatement });
  const situationSummary = buildSituationSummary(path, answers);
  const advisorInsight = buildAdvisorInsight({ path, hasUploadedStatement, answers });
  const engagementLevel = classifyEngagement(answers, path);
  const leadScore = calculateLeadScore({
    path,
    opportunitySnapshot,
    engagementLevel,
    hasUploadedStatement,
    answers,
  });
  const refinance = parseRefinanceStructured(answers);

  const formatMoney = (v: string) => {
    const n = Number(v.replace(/\D/g, ""));
    return Number.isFinite(n) && n > 0 ? `$${n.toLocaleString("en-US")}` : v || "—";
  };

  const propertyRows: [string, string][] = refinance
    ? [
        ["Goal", inferRefinanceGoalLabel(answers)],
        ["Address", refinance.address || "—"],
        ["Estimated value", formatMoney(refinance.estimatedValue)],
        ["Balance", formatMoney(refinance.loanBalance)],
        ["Rate", refinance.rate ? `${refinance.rate}%` : "—"],
      ]
    : path === "refinance" || path === "heloc"
      ? [
          ["Goal", inferRefinanceGoalLabel(answers)],
          ["Structured loan details", "Not captured as structured fields—confirm on first touch."],
        ]
      : [["Summary", "Not provided or not applicable for this intake."]];

  const tableRow = (label: string, value: string) =>
    `<tr><td style="padding:8px 0;font-size:13px;color:#64748b;width:38%;vertical-align:top;line-height:1.7;">${escapeHtml(label)}</td><td style="padding:8px 0;font-size:14px;color:#0f172a;vertical-align:top;line-height:1.7;">${escapeHtml(value)}</td></tr>`;

  const statementBlock =
    hasUploadedStatement && !documentUrl
      ? `<p style="margin:12px 0 0;font-size:13px;color:#64748b;"><em>Statement flagged; link unavailable—verify in CRM or request from client.</em></p>`
      : "";

  const readinessHigh = opportunitySnapshot.readiness === "High";
  const strengthStrong = opportunitySnapshot.strength === "Strong";
  let leadCategory: "Hot" | "Warm" | "Neutral";
  let leadReasonSentence: string;
  if (readinessHigh && strengthStrong) {
    leadCategory = "Hot";
    leadReasonSentence = "Signals line up—treat as near-term not cold inquiry.";
  } else if (readinessHigh || strengthStrong) {
    leadCategory = "Warm";
    leadReasonSentence = "Real engagement. Nail the constraint before you sell structure.";
  } else {
    leadCategory = "Neutral";
    leadReasonSentence = "Early signal only—qualify before you over-invest.";
  }

  const leadCategoryColor =
    leadCategory === "Hot" ? "#dc2626" : leadCategory === "Warm" ? "#d97706" : "#475569";
  const leadCategoryLabel = leadCategory === "Hot" ? "HOT" : leadCategory === "Warm" ? "WARM" : "NEUTRAL";
  const leadPostureLine =
    leadCategory === "Hot"
      ? "Stance: direct time-aware. Name the next move."
      : leadCategory === "Warm"
        ? "Stance: consultative. Constraint first lane second."
        : "Stance: light. Map intent before you steer.";

  const engagement = engagementSignalCopy(engagementLevel, leadCategory);

  const signalHaystack = `${path} ${JSON.stringify(answers)}`.toLowerCase();
  const hasUrgency =
    /\b(soon|asap|immediately)\b/.test(signalHaystack) || signalHaystack.includes("this week");
  const isExploratory = /\b(exploring|not sure|thinking)\b/.test(signalHaystack);

  const convo =
    safeConversationLines({
      path,
      hasUrgency,
      isExploratory,
      leadCategory,
    }) || { main: "", followUp: "" };
  const mainLine = convo.main || "";
  const followUpLine = convo.followUp || "";

  const thisShouldMoveLine =
    leadCategory === "Hot"
      ? "Move fast."
      : leadCategory === "Warm"
        ? "Move with direction."
        : "Wait for clarity—then move.";

  const conversationBlockHtml = `<div style="background:#F1F5F9;padding:10px 12px;border-radius:8px;">
        <p style="margin:0;font-size:15px;font-weight:500;color:#020617;line-height:1.65;">${escapeHtml(mainLine)}</p>
        ${followUpLine ? `<p style="margin:4px 0 0;font-size:15px;font-weight:500;color:#020617;line-height:1.65;">${escapeHtml(followUpLine)}</p>` : ""}
      </div>`;

  const showOpportunityUrgency =
    opportunitySnapshot.readiness === "High" || opportunitySnapshot.strength === "Strong";

  const opportunityUrgencyHtml = showOpportunityUrgency
    ? `<div style="font-size:13px;color:#1d4ed8;margin-top:8px;line-height:1.7;">Timing matters here—move early.</div>`
    : "";

  const opportunitySummaryInner = emphasizeOpportunitySummaryHtml(opportunitySnapshot.summary);

  const seenKeyNorm = new Set<string>();
  const dedupedEntries = entries.filter(([key]) => {
    const norm = key.trim().toLowerCase();
    if (seenKeyNorm.has(norm)) return false;
    seenKeyNorm.add(norm);
    return true;
  });
  const fullIntakeEntries = dedupedEntries.filter(([key]) => {
    if (refinance !== null && key === REFINANCE_STRUCTURED_KEY) return false;
    return true;
  });

  const fullIntakeRows = fullIntakeEntries
    .map(([key, value]) => {
      const k = escapeHtml(key);
      const cellHtml = formatFullIntakeCellHtml(key, value, answers);
      return `<tr>
        <td style="padding:6px 10px 6px 0;vertical-align:top;font-size:12px;color:#94a3b8;border-bottom:1px solid #e2e8f0;width:32%;line-height:1.65;">${k}</td>
        <td style="padding:6px 0;vertical-align:top;font-size:12px;color:#0f172a;border-bottom:1px solid #e2e8f0;line-height:1.65;">${cellHtml}</td>
      </tr>`;
    })
    .join("");

  const scoreColor =
    leadScore >= 75 ? "#dc2626" : leadScore >= 50 ? "#d97706" : "#475569";

  const headerBar = `
<div style="background:#0b1f3a;color:white;border-radius:12px 12px 0 0;overflow:hidden;">
  <div style="padding:16px 24px;border-bottom:1px solid rgba(198,161,91,0.25);display:flex;align-items:center;justify-content:space-between;">
    <div style="font-size:15px;font-weight:600;color:#ffffff;letter-spacing:-0.01em;">
      Advisor Intelligence Report — ${escapeHtml(path.toUpperCase())}
    </div>
    <div style="font-size:12px;color:rgba(255,255,255,0.4);">
      ${escapeHtml(name)} · ${new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
    </div>
  </div>
  <div style="padding:12px 24px;display:flex;gap:0;align-items:center;">
    <div style="padding-right:20px;border-right:1px solid rgba(255,255,255,0.1);">
      <div style="font-size:10px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:3px;">Lead Score</div>
      <div style="font-size:26px;font-weight:700;color:${scoreColor};line-height:1;">${leadScore}</div>
    </div>
    <div style="padding:0 20px;border-right:1px solid rgba(255,255,255,0.1);">
      <div style="font-size:10px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:3px;">Lead</div>
      <div style="font-size:13px;font-weight:600;color:${leadCategoryColor};">${escapeHtml(leadCategoryLabel)}</div>
    </div>
    <div style="padding:0 20px;border-right:1px solid rgba(255,255,255,0.1);">
      <div style="font-size:10px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:3px;">Strength</div>
      <div style="font-size:13px;font-weight:600;color:#c6a15b;">${escapeHtml(opportunitySnapshot.strength)}</div>
    </div>
    <div style="padding:0 20px;border-right:1px solid rgba(255,255,255,0.1);">
      <div style="font-size:10px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:3px;">Readiness</div>
      <div style="font-size:13px;font-weight:600;color:#c6a15b;">${escapeHtml(opportunitySnapshot.readiness)}</div>
    </div>
    <div style="padding:0 20px;border-right:${hasUploadedStatement ? "1px solid rgba(255,255,255,0.1)" : "none"};">
      <div style="font-size:10px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:3px;">Call window</div>
      <div style="font-size:13px;font-weight:600;color:#c6a15b;">${escapeHtml(snap.bestTime !== "—" ? snap.bestTime : "Email preferred")}</div>
    </div>
    ${hasUploadedStatement ? `
    <div style="padding:0 0 0 20px;">
      <div style="font-size:10px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:3px;">Statement</div>
      <div style="font-size:13px;font-weight:600;color:#10b981;">Secured</div>
    </div>` : ""}
    ${submittedLang === "es" ? `
    <div style="padding:0 0 0 20px;border-left:1px solid rgba(255,255,255,0.1);margin-left:0;">
      <div style="font-size:10px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:3px;">Client language</div>
      <div style="font-size:13px;font-weight:600;color:#f59e0b;">Español</div>
    </div>` : ""}
  </div>
</div>`;

  const documentSectionHtml = documentUrl ? `
<div style="padding:20px 24px;border-bottom:1px solid #e2e8f0;">
  <div style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px;">Secured document — your competitive edge</div>
  <div style="background:#0b1f3a;border:1px solid rgba(198,161,91,0.5);border-radius:10px;padding:18px 20px;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
      <div style="width:32px;height:32px;background:rgba(198,161,91,0.15);border:1px solid rgba(198,161,91,0.3);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        <span style="font-size:14px;">📄</span>
      </div>
      <span style="font-size:11px;color:#c6a15b;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Mortgage statement on file</span>
    </div>
    <div style="font-size:15px;font-weight:600;color:#ffffff;margin-bottom:8px;">You have the full picture before the call.</div>
    <div style="font-size:13px;color:rgba(255,255,255,0.65);line-height:1.65;margin-bottom:12px;">
      Use it to anchor your opening — show them what you already know and lead with specificity, not a brochure. This is your edge.
    </div>
    <a href="${escapeHtml(documentUrl)}" target="_blank" rel="noopener noreferrer"
      style="display:inline-block;font-size:13px;font-weight:600;color:#c6a15b;text-decoration:none;border-bottom:1px solid rgba(198,161,91,0.4);padding-bottom:1px;">
      View mortgage statement →
    </a>
    <div style="margin-top:8px;font-size:11px;color:rgba(255,255,255,0.35);">Secure access · Time-limited · Internal use only</div>
  </div>
</div>` : "";

  const firstContactPlaybook = `
<div style="padding:20px 24px;border-bottom:1px solid #e2e8f0;">
  <div style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px;">First contact playbook</div>
  <div style="display:flex;flex-direction:column;gap:8px;">
    <div style="display:flex;align-items:flex-start;gap:12px;background:#f8fafc;border-radius:8px;padding:10px 14px;">
      <span style="font-size:11px;font-weight:700;color:#c6a15b;flex-shrink:0;min-width:20px;">01</span>
      <span style="font-size:13px;color:#0f172a;line-height:1.5;">${hasUploadedStatement ? "Open with the statement — anchor what can be improved immediately. They shared it for a reason." : "Open with a specific number from their intake — anchor the conversation before you sell structure."}</span>
    </div>
    <div style="display:flex;align-items:flex-start;gap:12px;background:#f8fafc;border-radius:8px;padding:10px 14px;">
      <span style="font-size:11px;font-weight:700;color:#c6a15b;flex-shrink:0;min-width:20px;">02</span>
      <span style="font-size:13px;color:#0f172a;line-height:1.5;">Name the real constraint before you sell structure. Rate is downstream of purpose.</span>
    </div>
    <div style="display:flex;align-items:flex-start;gap:12px;background:#f8fafc;border-radius:8px;padding:10px 14px;">
      <span style="font-size:11px;font-weight:700;color:#c6a15b;flex-shrink:0;min-width:20px;">03</span>
      <span style="font-size:13px;color:#0f172a;line-height:1.5;">Deliver two defensible options with clear tradeoffs — not a rate sheet.</span>
    </div>
    <div style="display:flex;align-items:flex-start;gap:12px;background:#f8fafc;border-radius:8px;padding:10px 14px;">
      <span style="font-size:11px;font-weight:700;color:#c6a15b;flex-shrink:0;min-width:20px;">04</span>
      <span style="font-size:13px;color:#0f172a;line-height:1.5;">Lock the follow-up before you hang up. Momentum is the product.</span>
    </div>
  </div>
</div>`;

  const leadEvaluationSection = `
<div style="padding:20px 24px;border-bottom:1px solid #e2e8f0;">
  <div style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px;">Lead evaluation</div>
  <div style="background:#EEF4FF;border:1px solid #dbeafe;border-radius:10px;padding:18px 20px;">
    <div style="margin-bottom:8px;">
      <span style="font-size:22px;font-weight:800;letter-spacing:0.08em;color:${leadCategoryColor};">${escapeHtml(leadCategoryLabel)}</span>
    </div>
    <div style="font-size:15px;font-weight:600;color:#020617;margin-bottom:6px;line-height:1.5;">${escapeHtml(leadReasonSentence)}</div>
    <div style="font-size:13px;color:#334155;margin-bottom:6px;line-height:1.5;">${escapeHtml(leadPostureLine)}</div>
    <div style="font-size:12px;color:#64748b;">${escapeHtml(thisShouldMoveLine)}</div>
  </div>
</div>`;

  const opportunitySection = `
<div style="padding:20px 24px;border-bottom:1px solid #e2e8f0;">
  <div style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px;">Opportunity snapshot</div>
  <div style="background:#EEF4FF;border:1px solid #cbd5f5;border-radius:10px;padding:18px 20px;">
    <div style="font-size:15px;font-weight:600;color:#0f172a;margin-bottom:6px;">${escapeHtml(opportunitySnapshot.title)}</div>
    <div style="font-size:13px;color:#334155;margin-bottom:4px;"><strong style="color:#0f172a;">Strength:</strong> ${escapeHtml(opportunitySnapshot.strength)}</div>
    <div style="font-size:13px;color:#334155;margin-bottom:10px;"><strong style="color:#0f172a;">Readiness:</strong> ${escapeHtml(opportunitySnapshot.readiness)}</div>
    <div style="font-size:14px;font-weight:600;color:#1e293b;line-height:1.5;margin-bottom:8px;">${opportunitySummaryInner}</div>
    ${opportunityUrgencyHtml}
  </div>
  <div style="margin-top:12px;padding:14px 16px;background:#f8fafc;border-radius:8px;">
    <div style="font-size:11px;font-weight:600;color:#64748b;margin-bottom:6px;">Here's what to say:</div>
    ${conversationBlockHtml}
  </div>
</div>`;

  const clientSnapshotSection = `
<div style="padding:20px 24px;border-bottom:1px solid #e2e8f0;">
  <div style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px;">Client snapshot</div>
  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
    ${tableRow("Name", name)}
    <tr><td style="padding:8px 0;font-size:13px;color:#64748b;width:38%;vertical-align:top;line-height:1.7;">Email</td><td style="padding:8px 0;font-size:14px;vertical-align:top;line-height:1.7;"><a href="mailto:${escapeHtml(email)}" style="color:#0f172a;text-decoration:none;">${escapeHtml(email)}</a></td></tr>
    ${tableRow("Phone", phone || "—")}
    ${tableRow("Where they are", snap.stage)}
    ${tableRow("Priority", snap.priority)}
    ${tableRow("Best time to connect", snap.bestTime)}
  </table>
</div>`;

  const keyInsightsSection = `
<div style="padding:20px 24px;border-bottom:1px solid #e2e8f0;">
  <div style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px;">Key insights</div>
  <ul style="margin:0;padding:0 0 0 20px;font-size:14px;color:#334155;line-height:1.7;">
    <li style="margin-bottom:10px;"><strong style="color:#0f172a;">Path:</strong> ${escapeHtml(pathDisplayName(path))}</li>
    <li style="margin-bottom:10px;"><strong style="color:#0f172a;">Opportunity:</strong> ${escapeHtml(opportunitySnapshot.title)} — Strength ${escapeHtml(opportunitySnapshot.strength)}, Readiness ${escapeHtml(opportunitySnapshot.readiness)}</li>
    <li style="margin-bottom:10px;"><strong style="color:#0f172a;">Engagement:</strong> ${escapeHtml(engagement.headline)}</li>
    <li style="margin-bottom:0;"><strong style="color:#0f172a;">Statement:</strong> ${hasUploadedStatement ? "Uploaded" : "Not uploaded"}</li>
  </ul>
</div>`;

  const propertySection = `
<div style="padding:20px 24px;border-bottom:1px solid #e2e8f0;">
  <div style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px;">Property & loan</div>
  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
    ${propertyRows.map(([label, val]) => tableRow(label, val)).join("")}
  </table>
  ${statementBlock}
</div>`;

  const situationSection = `
<div style="padding:20px 24px;border-bottom:1px solid #e2e8f0;">
  <div style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px;">Situation summary</div>
  <p style="margin:0;font-size:14px;color:#334155;line-height:1.7;">${escapeHtml(situationSummary)}</p>
</div>`;

  const advisorSection = `
<div style="padding:20px 24px;border-bottom:1px solid #e2e8f0;">
  <div style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">Advisor insight</div>
  <div style="font-size:10px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;color:#94a3b8;margin-bottom:10px;">Why this works</div>
  <div style="border-top:2px solid #e2e8f0;padding-top:12px;">
    <p style="margin:0;font-size:14px;color:#334155;line-height:1.7;">${escapeHtml(advisorInsight)}</p>
  </div>
</div>`;

  const engagementSection = `
<div style="padding:20px 24px;border-bottom:1px solid #e2e8f0;">
  <div style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px;">Engagement signal</div>
  <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#1e3a5f;line-height:1.7;">${escapeHtml(engagement.headline)}</p>
  <p style="margin:0;font-size:14px;color:#334155;line-height:1.7;">${escapeHtml(engagement.body)}</p>
</div>`;

  const recommendedSection = `
<div style="padding:20px 24px;border-bottom:1px solid #e2e8f0;">
  <div style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px;">Recommended next steps</div>
  <ul style="margin:0;padding:0 0 0 20px;font-size:14px;color:#334155;line-height:1.7;">
    <li style="margin-bottom:10px;font-weight:700;color:#020617;">State their range before you model.</li>
    <li style="margin-bottom:10px;">Open on a call.</li>
    <li style="margin-bottom:0;">Lock the follow-up on the way out.</li>
  </ul>
</div>`;

  const spanishContextSection =
    submittedLang === "es"
      ? `
<div style="padding:20px 24px;border-bottom:1px solid #e2e8f0;">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
    <div style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;">Client responses — submitted in Spanish</div>
    <span style="font-size:10px;font-weight:700;background:#FEF3C7;color:#92400E;padding:2px 8px;border-radius:99px;letter-spacing:0.06em;">ESPAÑOL</span>
  </div>
  <div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;padding:14px 16px;margin-bottom:12px;">
    <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#92400E;">This client submitted in Spanish.</p>
    <p style="margin:0;font-size:13px;color:#78350F;line-height:1.6;">Consider opening the call in Spanish or asking for their language preference. The responses below are shown as submitted.</p>
  </div>
  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
    ${fullIntakeRows || `<tr><td colspan="2" style="padding:10px 0;font-size:12px;color:#94a3b8;">No intake fields captured.</td></tr>`}
  </table>
</div>`
      : "";

  const fullIntakeSection =
    submittedLang === "es"
      ? `
<div style="padding:20px 24px;border-bottom:1px solid #e2e8f0;">
  <div style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px;">Full client responses</div>
  <p style="margin:0;font-size:13px;color:#94a3b8;font-style:italic;">See "Submitted in Spanish" section above for client's original responses.</p>
</div>`
      : `
<div style="padding:20px 24px;border-bottom:1px solid #e2e8f0;">
  <div style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px;">Full client responses</div>
  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
    ${fullIntakeRows || `<tr><td colspan="2" style="padding:10px 0;font-size:12px;color:#94a3b8;line-height:1.65;">No intake fields captured.</td></tr>`}
  </table>
</div>`;

  const footerSection = `
<div style="padding:16px 24px;">
  <p style="margin:0 0 8px;font-size:12px;color:#94a3b8;text-align:center;">Run this exactly once—then adapt based on response.</p>
  <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.55;text-align:center;">Infinite Home Lending · Internal advisory briefing · Do not forward as marketing.</p>
</div>`;

  const innerCard = `
<div style="max-width:700px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
  ${headerBar}
  ${leadEvaluationSection}
  ${opportunitySection}
  ${documentSectionHtml}
  ${firstContactPlaybook}
  ${advisorSection}
  ${clientSnapshotSection}
  ${keyInsightsSection}
  ${propertySection}
  ${situationSection}
  ${engagementSection}
  ${recommendedSection}
  ${spanishContextSection}
  ${fullIntakeSection}
  ${footerSection}
</div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;">
<div style="background:#f8fafc;padding:40px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
${innerCard}
</div>
</body>
</html>`;
}

export function createSubmitLeadRouter(): Router {
  const router = Router();

  router.post("/submit-lead", async (req: Request, res: Response) => {
    console.log("🚀 SUBMIT LEAD REQUEST RECEIVED");
    try {
      if (req.body == null || typeof req.body !== "object") {
        throw new Error("Missing request body");
      }

      const body = req.body as Record<string, unknown>;

      const name =
        (typeof body.name === "string" ? body.name.trim() : "") || "Unknown";
      const emailRaw = typeof body.email === "string" ? body.email.trim() : "";
      const email = emailRaw || "";
      const phone = typeof body.phone === "string" ? body.phone.trim() : "";
      const clientSessionId =
        typeof body.clientId === "string" ? body.clientId.trim().slice(0, 120) : "";
      const path = typeof body.path === "string" ? body.path.trim() : "";
      const hasUploadedStatement = Boolean(body.hasUploadedStatement);
      const fileKey =
        typeof body.fileKey === "string" && body.fileKey.trim().length > 0 ? body.fileKey.trim() : null;

      const submittedLang =
        typeof body.submittedLang === "string" && body.submittedLang === "es" ? "es" : "en";

      const answersRaw =
        body.answers !== null && typeof body.answers === "object" && !Array.isArray(body.answers)
          ? (body.answers as Record<string, unknown>)
          : {};

      if (!email || !validateEmail(email)) {
        return res.status(400).json({ error: "Valid email is required." });
      }

      if (!ALLOWED_PATHS.has(path)) {
        return res.status(400).json({ error: "Invalid path." });
      }

      const keyInsights: Record<string, unknown> = {};
      const entries = Object.entries(answersRaw).slice(0, MAX_ANSWER_ENTRIES);
      for (const [k, v] of entries) {
        keyInsights[k.slice(0, 120)] = v;
      }

      const documentUrl =
        fileKey && hasUploadedStatement ? await getSignedDownloadUrl(fileKey) : null;

      if (documentUrl) {
        console.log("📎 Document included in email:", documentUrl);
      }

      console.log("DEBUG INPUT:", {
        path,
        answers: keyInsights,
        entries,
        hasUploadedStatement,
      });

      console.log("STEP 1: Before buildEmailHtml");
      const emailHtml = buildEmailHtml({
        name,
        email,
        phone,
        path,
        answers: keyInsights,
        entries,
        hasUploadedStatement,
        documentUrl,
        submittedLang,
      });
      console.log("STEP 2: After buildEmailHtml");

      if (!emailHtml || typeof emailHtml !== "string") {
        console.error("❌ Invalid emailHtml:", emailHtml);
        return res.status(500).json({ error: "Invalid email HTML" });
      }

      /** Hit POST /api/submit-lead directly (e.g. curl) with DEBUG_SUMMARY=true — browser app expects JSON when false. */
      if (process.env.DEBUG_SUMMARY === "true") {
        return res.status(200).type("html").send(emailHtml);
      }

      if (!process.env.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY is missing — email system cannot run");
      }

      const resendKey = process.env.RESEND_API_KEY;

      if (!emailHtml || typeof emailHtml !== "string") {
        console.error("❌ Invalid emailHtml before send:", emailHtml);
        return res.status(500).json({ error: "Invalid email HTML" });
      }

      const resend = new Resend(resendKey);
      console.log("STEP 3: Before Resend");
      try {
        const traceId = `TRACE-${Date.now()}`;
        console.log("🚨 TRACE ID:", traceId);
        console.log("🚨 FINAL FROM VALUE:", "Infinite Home Lending <onboarding@resend.dev>");
        const subject = `[${traceId}] Advisor Intelligence Report — ${path.toUpperCase()}`;
        console.log("🚨 SENDING EMAIL WITH:", {
          from: "Infinite Home Lending <onboarding@resend.dev>",
          to: "javier.cifuentes@infinitehomelending.com",
        });
        const sendResult = await resend.emails.send({
          from: "Infinite Home Lending <onboarding@resend.dev>",
          to: ["javier.cifuentes@infinitehomelending.com"],
          subject,
          html: emailHtml,
          replyTo: email,
        });

        if (sendResult?.error) {
          console.error("❌ RESEND ERROR:", sendResult.error);
          return res.status(500).json({ error: "Email send failed" });
        }
      } catch (err) {
        console.error("❌ RESEND THREW ERROR:", err);
        throw err;
      }

      console.log("STEP 4: After Resend — Email sent successfully");

      return res.status(200).json({
        ok: true,
        emailSent: true,
      });
    } catch (error) {
      console.error("❌ SUBMIT LEAD ERROR:");
      console.error(error);
      console.error((error as Error | undefined)?.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  return router;
}
