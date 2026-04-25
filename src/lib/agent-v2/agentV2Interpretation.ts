/**
 * Normalization + intent extraction with per-field confidence.
 * Low confidence → do not commit; caller should clarify instead of advancing.
 *
 * Parsing examples (messy → committed + fieldConfidence):
 * - "in a few months" → timeline 1–3 months, high
 * - "around a year" / "maybe next year" → 6–12 months
 * - "just looking" / "just exploring" → timeline Just exploring, high
 * - "around 400" / "500k" → priceRange bucket, medium/high
 * - "credit is okay" → creditRange Good (700–739), medium
 * - "not sure yet" (comfort) → financialComfort Not sure yet, high
 * - "maybe early next year, around 500k" → timeline 3–6 months + priceRange 300–500K (both), medium+high
 */
import type { AgentV2Answers } from "./agentV2Types";

export type ConfidenceLevel = "high" | "medium" | "low";

export type InterpretableField =
  | "goal"
  | "timeline"
  | "priceRange"
  | "creditRange"
  | "financialComfort"
  | "contactPreference";

export type InterpretationResult = {
  committed: Partial<AgentV2Answers>;
  fieldConfidence: Partial<Record<InterpretableField, ConfidenceLevel>>;
  /** User hinted at a field but extraction was too weak to save — clarify before progressing */
  pendingClarification?: { focus: InterpretableField };
  /** Sparse echo when range (or similar) is medium confidence */
  echoLine?: string;
  /** Short acknowledgment for off-path but valid context (employment type, etc.) */
  offPathAck?: string;
  signalsUpdated: number;
  interpretationStrength: "strong" | "weak" | "none";
};

const CORRECTION = /\b(actually|instead|meant|changed|switch to|now i want)\b/i;

function shouldApplyField(
  key: InterpretableField,
  value: string | undefined,
  score: ConfidenceLevel,
  answers: AgentV2Answers,
  rawText: string,
): boolean {
  if (!value || score === "low") return false;
  const existing = answers[key as keyof AgentV2Answers];
  if (!existing) return true;
  if (score === "high") return true;
  if (CORRECTION.test(rawText)) return true;
  return false;
}

function interpretGoal(t: string): { value?: string; score: ConfidenceLevel } {
  if (/\b(refinance|refi|refinancing|lower my payment|cash out)\b/i.test(t)) return { value: "Refinance", score: "high" };
  if (/\b(buy|purchase|purchasing|first home|house hunting|buying)\b/i.test(t)) return { value: "Buy a home", score: "high" };
  if (/\b(explore|exploring|still exploring|just looking|seeing what|compare options|figure out first)\b/i.test(t))
    return { value: "Explore options", score: "high" };
  if (/\b(looking|shopping)\b/i.test(t)) return { value: "Explore options", score: "medium" };
  return { score: "low" };
}

/** Map loose month counts to supported timeline buckets; digits + common word numbers */
function monthCountFromPhrase(t: string): number | null {
  const range = t.match(/\b(\d{1,2})\s*(?:to|-|–)\s*(\d{1,2})\s+months?\b/i);
  if (range) return Math.round((parseInt(range[1]!, 10) + parseInt(range[2]!, 10)) / 2);
  const digit = t.match(
    /\b(?:in\s+around|around|in\s+about|about|in\s+roughly|roughly|maybe|probably|perhaps)?\s*(?:in\s+)?(\d{1,2})\s*(?:months?|mos?)\b/i,
  );
  if (digit) return parseInt(digit[1]!, 10);
  const inMonths = t.match(/\bin\s+(\d{1,2})\s+months?\b/i);
  if (inMonths) return parseInt(inMonths[1]!, 10);
  const w = t.match(
    /\b(?:in\s+around|around|about|maybe|probably)?\s*(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\s+(?:months?|mos?)\b/i,
  );
  if (w) {
    const map: Record<string, number> = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ten: 10,
      eleven: 11,
      twelve: 12,
    };
    return map[w[1]!.toLowerCase()] ?? null;
  }
  return null;
}

function interpretTimeline(t: string): { value?: string; score: ConfidenceLevel } {
  if (/\b(asap|right away|immediately|urgent|this week|this month|need to move fast)\b/i.test(t))
    return { value: "As soon as possible", score: "high" };

  if (/\b(around|about|in)\s+(?:a\s+)?year\b/i.test(t) || /\b(?:a\s+)?year\s+from\s+now\b/i.test(t))
    return { value: "6–12 months", score: "high" };
  if (/\bcloser\s+to\s+(?:a\s+)?year\b/i.test(t)) return { value: "6–12 months", score: "medium" };
  if (/\bnot\s+until\s+next\s+year\b/i.test(t)) return { value: "6–12 months", score: "high" };
  if (/\b(?:maybe|probably|perhaps)\s+next\s+year\b/i.test(t)) return { value: "6–12 months", score: "high" };

  const mc = monthCountFromPhrase(t);
  if (mc !== null) {
    if (mc <= 3) return { value: "1–3 months", score: "high" };
    if (mc <= 6) return { value: "3–6 months", score: "high" };
    if (mc <= 12) return { value: "6–12 months", score: "high" };
    return { value: "6–12 months", score: "medium" };
  }

  if (/\b(half\s+a\s+year|halfyear)\b/i.test(t)) return { value: "3–6 months", score: "high" };
  if (/\b(3[\s–-]6\s*mo|3\s*to\s*6)\b/i.test(t)) return { value: "3–6 months", score: "high" };
  if (/\b(six months|6\s+months)\b/i.test(t)) return { value: "3–6 months", score: "high" };

  if (/\b(probably|maybe|perhaps)\s+later\s+this\s+year\b/i.test(t))
    return { value: "3–6 months", score: "medium" };
  if (/\b(later\s+this\s+year|toward(s)?\s+the\s+end\s+of\s+the\s+year)\b/i.test(t))
    return { value: "3–6 months", score: "medium" };
  if (/\b(sometime|eventually)\s+next\s+year\b/i.test(t) || /\bearly\s+next\s+year\b/i.test(t))
    return { value: "6–12 months", score: "medium" };
  if (/\b(next\s+year|spring\s+next\s+year|q1|first\s+quarter)\b/i.test(t))
    return { value: "6–12 months", score: "medium" };

  if (/\b(just exploring|just looking|not ready|still researching|tbd|whenever|wide open|still figuring out)\b/i.test(t))
    return { value: "Just exploring", score: "high" };
  if (/\bno rush\b/i.test(t) && !/\b(months|year|weeks)\b/i.test(t)) return { value: "Just exploring", score: "medium" };
  if (/\bstill\s+a\s+ways?\s+out\b/i.test(t) || /\bstill\s+ways\s+out\b/i.test(t))
    return { value: "Just exploring", score: "medium" };
  if (/\bnot sure (yet )?(when|how soon|on timing)\b/i.test(t) || /\bno idea (yet )?when\b/i.test(t))
    return { value: "Just exploring", score: "medium" };

  if (/\bnot\s+(right\s+)?away\b/i.test(t) || /\bnot\s+in\s+a\s+rush\b/i.test(t) || /\bnot\s+rushing\b/i.test(t))
    return { value: "1–3 months", score: "medium" };

  if (
    /\b(in a few months|a few months from now|a few months|few months|next couple months|couple months|soon|shortly|before summer)\b/i.test(t) ||
    /\b1[\s–-]3\s*mo|one to three/i.test(t)
  )
    return { value: "1–3 months", score: "high" };
  if (/\b(a couple|one|two)\s+months?\b/i.test(t)) return { value: "1–3 months", score: "medium" };

  if (/\b(sometime|eventually|unclear timing)\b/i.test(t)) return { value: "6–12 months", score: "medium" };

  return { score: "low" };
}

function bucketFromThousands(k: number): string {
  if (k < 280) return "Under $300K";
  if (k <= 520) return "$300K–$500K";
  if (k <= 850) return "$500K–$800K";
  return "$800K+";
}

function interpretPriceRange(t: string): { value?: string; score: ConfidenceLevel } {
  if (/\bunder\s*\$?\s*2?[0-9]{2}k|below\s*300|less than\s*300/i.test(t)) return { value: "Under $300K", score: "high" };
  if (/\$?\s*300\s*[-–]\s*500|300\s*k\s*to\s*500|between\s*300\s*and\s*500/i.test(t))
    return { value: "$300K–$500K", score: "high" };
  if (/\$?\s*500\s*[-–]\s*800|500k\s*to\s*800/i.test(t)) return { value: "$500K–$800K", score: "high" };
  if (/\b(800k|900k|1\s*million|1m\b|over\s*800|above\s*800)\b/i.test(t)) return { value: "$800K+", score: "high" };

  const around = t.match(/\b(?:around|about|near|roughly|like)\s*\$?\s*(\d{2,4})\s*(k|thousand)?\b/i);
  if (around) {
    let k = Number(around[1]);
    if (around[2]) {
      if (k < 100) k *= 1000;
    } else if (k >= 200 && k <= 999) {
      /* "around 400" → $400K band */
    } else if (k >= 1000) {
      k = k / 1000;
    }
    if (k >= 200 && k <= 2000) {
      const bucket = bucketFromThousands(k);
      return { value: bucket, score: around[2] ? "high" : "medium" };
    }
  }

  const numK = t.match(/\b(\d{2,4})\s*k\b/i);
  if (numK) {
    const k = Number(numK[1]);
    if (k >= 200 && k <= 2000) return { value: bucketFromThousands(k), score: "high" };
  }

  const midBand = t.match(/\b(mid|upper|lower)[\s-]?(\d)\s?00s?\b/i);
  if (midBand) {
    const d = Number(midBand[2]);
    const k = d * 100;
    if (k >= 200 && k <= 900) return { value: bucketFromThousands(k), score: "medium" };
  }

  const bare = t.match(/\$\s*(\d{3,4})\b/i);
  if (bare) {
    const raw = Number(bare[1]);
    const k = raw >= 1000 ? raw / 1000 : raw;
    if (k >= 250 && k <= 2000) return { value: bucketFromThousands(k), score: "medium" };
  }

  if (/\b(price|budget|range|how much house)\b/i.test(t) && !/\d/.test(t)) return { score: "low" };
  return { score: "low" };
}

function interpretCredit(t: string): { value?: string; score: ConfidenceLevel } {
  if (/\bexcellent|740|750|800|very good score\b/i.test(t)) return { value: "Excellent (740+)", score: "high" };
  if (/\bgood\b/i.test(t) && /\b(credit|score|fico)\b/i.test(t)) return { value: "Good (700–739)", score: "high" };
  if (/\b(credit|score|fico)\b/i.test(t) && /\b(solid|decent|not bad|okay|ok|alright|fine|pretty good|so-so|so so)\b/i.test(t))
    return { value: "Good (700–739)", score: "medium" };
  if (/\bcredit (is )?(okay|ok|alright|fine|decent|pretty good)\b/i.test(t))
    return { value: "Good (700–739)", score: "medium" };
  if (/\b(fair|not great|could be better)\b/i.test(t) && /\b(credit|score)\b/i.test(t))
    return { value: "Fair (620–699)", score: "medium" };
  if (/\bfair\b/i.test(t)) return { value: "Fair (620–699)", score: "low" };
  if (/\b(not sure|unknown|haven'?t checked|no idea)\b/i.test(t) && /\b(credit|score)\b/i.test(t))
    return { value: "Not sure", score: "high" };
  if (/\b650|680|620|700|720\b/.test(t) && /\b(credit|score|fico)\b/i.test(t)) {
    if (/740|750|800/.test(t)) return { value: "Excellent (740+)", score: "medium" };
    if (/700|720/.test(t)) return { value: "Good (700–739)", score: "medium" };
    return { value: "Fair (620–699)", score: "medium" };
  }
  return { score: "low" };
}

function interpretComfort(t: string): { value?: string; score: ConfidenceLevel } {
  if (/\bnot sure yet|unsure overall|hard to say\b/i.test(t)) {
    if (/\b(when|timing|timeline|months|year|soon|move on|refi|refinance|buy|purchase)\b/i.test(t) && !/\b(comfort|feel|ready|afford|payment|numbers|financial|nervous|stress)\b/i.test(t))
      return { score: "low" };
    return { value: "Not sure yet", score: "high" };
  }
  if (/\b(strong|ready to go|very comfortable|good shape)\b/i.test(t)) return { value: "Strong and ready", score: "high" };
  if (/\bmostly comfortable|pretty comfortable|fairly comfortable\b/i.test(t)) return { value: "Mostly comfortable", score: "high" };
  if (/\b(questions|concerns|worried|nervous about)\b/i.test(t)) return { value: "I have some questions", score: "high" };
  if (/\bcomfortable\b/i.test(t)) return { value: "Mostly comfortable", score: "medium" };
  return { score: "low" };
}

function interpretContact(t: string): { value?: string; score: ConfidenceLevel } {
  if (/\b(call|phone|ring me)\b/i.test(t)) return { value: "Call", score: "high" };
  if (/\b(text|sms)\b/i.test(t)) return { value: "Text", score: "high" };
  if (/\bemail\b/i.test(t)) return { value: "Email", score: "high" };
  return { score: "low" };
}

function humanizeRangeLabel(range: string): string {
  if (range === "Under $300K") return "the low $200s or under-$300K";
  if (range === "$300K–$500K") return "$300–500K";
  if (range === "$500K–$800K") return "$500–800K";
  if (range === "$800K+") return "north of $800K";
  return range;
}

const OFF_PATH =
  /\b(self[- ]?employed|1099|contractor|freelance|gig work|small business|w2 and 1099|business owner)\b/i;

function applyField(
  key: InterpretableField,
  res: { value?: string; score: ConfidenceLevel },
  answers: AgentV2Answers,
  rawText: string,
  committed: Partial<AgentV2Answers>,
  fieldConfidence: Partial<Record<InterpretableField, ConfidenceLevel>>,
): number {
  if (!res.value || res.score === "low") return 0;
  if (!shouldApplyField(key, res.value, res.score, answers, rawText)) return 0;
  committed[key] = res.value;
  fieldConfidence[key] = res.score;
  return 1;
}

export function interpretUserMessage(rawText: string, answers: AgentV2Answers): InterpretationResult {
  const text = rawText.trim();
  const t = text.toLowerCase();

  const offPathAck = OFF_PATH.test(text)
    ? "That can still work — it just depends on how income is structured. A quick conversation helps sort that out."
    : undefined;

  const committed: Partial<AgentV2Answers> = {};
  const fieldConfidence: Partial<Record<InterpretableField, ConfidenceLevel>> = {};
  let signalsUpdated = 0;

  const g = interpretGoal(t);
  signalsUpdated += applyField("goal", g, answers, text, committed, fieldConfidence);

  const tl = interpretTimeline(t);
  signalsUpdated += applyField("timeline", tl, answers, text, committed, fieldConfidence);

  const pr = interpretPriceRange(t);
  if (pr.value && pr.score !== "low") {
    signalsUpdated += applyField("priceRange", pr, answers, text, committed, fieldConfidence);
  }

  const cr = interpretCredit(t);
  signalsUpdated += applyField("creditRange", cr, answers, text, committed, fieldConfidence);

  const fc = interpretComfort(t);
  signalsUpdated += applyField("financialComfort", fc, answers, text, committed, fieldConfidence);

  const cp = interpretContact(t);
  signalsUpdated += applyField("contactPreference", cp, answers, text, committed, fieldConfidence);

  let pendingClarification: InterpretationResult["pendingClarification"];
  if (
    !tl.value &&
    tl.score === "low" &&
    /\b(when|timing|soon|months|year|timeframe|next year)\b/i.test(t) &&
    !answers.timeline
  ) {
    pendingClarification = { focus: "timeline" };
  } else if (
    !pr.value &&
    pr.score === "low" &&
    /\b(price|budget|afford|how much|payment|\$)\b/i.test(t) &&
    !answers.priceRange &&
    !answers.propertyValueRange
  ) {
    pendingClarification = { focus: "priceRange" };
  }

  let echoLine: string | undefined;
  if (
    committed.priceRange &&
    fieldConfidence.priceRange === "medium" &&
    (text.length % 5 === 1 || text.length % 7 === 2)
  ) {
    echoLine = `So you’re thinking around ${humanizeRangeLabel(committed.priceRange)}, right?`;
  }

  const interpretationStrength =
    signalsUpdated >= 2 ? "strong" : signalsUpdated === 1 ? "weak" : "none";

  return {
    committed,
    fieldConfidence,
    pendingClarification,
    echoLine,
    offPathAck,
    signalsUpdated,
    interpretationStrength,
  };
}
