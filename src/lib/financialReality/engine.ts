/**
 * Directional estimates only — not underwriting. Believable ranges for clarity.
 * Home Buying Diagnosis Engine — Diagnosis + Cause + Consequence + Prescription.
 */

import { buildConsequenceTracker, type ConsequenceTracker } from "./consequenceTracker";
import { buildIrreversibility, type IrreversibilityEngine } from "./irreversibility";
import { buildMicDrop, type MicDropEngine } from "./micDrop";
import { buildPresentTense, type PresentTenseEngine } from "./presentTense";
import type { SharpBlock } from "./sharpLines";
export type { ConsequenceTracker };
export type { IrreversibilityEngine };
export type { MicDropEngine, MicDropPersona } from "./micDrop";
export type { PresentTenseEngine, PresentTenseVoice } from "./presentTense";
export type { SharpBlock } from "./sharpLines";

export type RealityAnswers = {
  income: number;
  paymentComfort: number;
  credit: number;
  savings: number;
  timing: number;
};

/** Optional overrides for conversion / quick-input flows */
export type ComputeFinancialRealityOptions = {
  /** User-stated rent — replaces income-based rent estimate when set */
  rentMonthly?: number;
};

const INCOME_MID_ANNUAL = [55_000, 100_000, 162_500, 275_000] as const;
const PAYMENT_MID = [1750, 2500, 3750, 5250] as const;
/** Assumed purchase rates by credit bucket (30yr fixed, illustrative) */
const RATE_BY_CREDIT = [0.06125, 0.065, 0.07, 0.0675] as const;
const CREDIT_BP_MULT = [1.06, 1.0, 0.9, 0.94] as const;
const SAVINGS_MID = [5000, 20_000, 52_500, 100_000] as const;

function monthlyPI(loan: number, annualRate: number, months = 360): number {
  if (loan <= 0) return 0;
  const r = annualRate / 12;
  return (loan * r) / (1 - Math.pow(1 + r, -months));
}

/** PITI ≈ PI * taxInsFactor (taxes + insurance + PMI buffer) */
const PITI_FACTOR = 1.32;

export type FinancialRealityNumbers = {
  buyingPowerLow: number;
  buyingPowerHigh: number;
  paymentLow: number;
  paymentHigh: number;
  piMonthlyLow: number;
  piMonthlyHigh: number;
  taxInsMonthlyLow: number;
  taxInsMonthlyHigh: number;
  tiShareOfPitiPctLow: number;
  tiShareOfPitiPctHigh: number;
  costOfWaitingLow: number;
  costOfWaitingHigh: number;
  waitPaymentIncreaseLow: number;
  waitPaymentIncreaseHigh: number;
  waitRentLow: number;
  waitRentHigh: number;
  waitBuyingPowerDropLow: number;
  waitBuyingPowerDropHigh: number;
};

/** Quantified consequence layer — ties to payment, rate, price, psychology */
export type ConsequenceData = {
  /** Monthly rent as housing spend with no equity build (illustrative) */
  monthly_loss_estimate: number;
  /** Buying power erosion from market drift (~2–3% price path proxy) */
  buying_power_change: number;
  /** Extra monthly payment from modest rate drift on same home (illustrative) */
  rate_sensitivity: number;
  /** Short line on how waiting affects confidence vs facts */
  confidence_impact: string;
};

/** Belief → contrast → data → reframe → consequence psychology → new frame */
export type BeliefBreakNarrative = {
  assumedBelief: string;
  breakLead: string;
  challenge: string;
  inYourCase: {
    paymentLine: string;
    incomeLine: string;
    constraintLine: string;
  };
  reframe: string;
  thinkingConsequence: [string, string, string];
  newBelief: {
    headline: string;
    body: string;
  };
};

/** Shareable / screenshot-friendly card layer */
export type ViralReportCard = {
  cardTitle: string;
  identityLabel: string;
  oneLineTruth: string;
  estimatedBuyingPower: string;
  estimatedMonthlyPayment: string;
  confidenceLevelLabel: string;
  beliefYouMayThink: string;
  beliefButLine: string;
  consequenceRentRange: string;
  consequencePaymentRange: string;
  consequenceBuyingPowerRange: string;
  prescriptionShort: [string, string, string];
  buyingReadinessScore: number;
  positionStatus: string;
  /** Loss-framed strip + belief labels */
  lossStripLabel: string;
  beliefCheckLabel: string;
};

/** Final verdict + one action + contrast — conviction layer, no hedge words */
export type DecisionEngine = {
  positionLabel: string;
  sharp: SharpBlock;
  /** Always leads the block — sets decisive tone */
  realityLead: string;
  /** “You are … — and … is what’s holding you back.” (no likely/may/could) */
  strongVerdict: string;
  confidenceLevel: "High" | "Moderate" | "Low";
  whatThisMeansLead: string;
  whatThisMeansBody: string;
  urgencyLead: string;
  urgencyConsequence: string;
  /** Behavioral close — fixed line */
  finalLine: string;
  recommendedAction: string;
  ifNothing: string;
  ifAction: string;
};

/** Psychological mirror — identity recognition, not advice */
export type IdentityLayer = {
  identityHeadline: string;
  behaviorMirror: string;
  rootCause: string;
  consequenceReframe: string;
  identityReframe: string;
  shareableLine: string;
};

/** Narrative + positioning for the diagnosis report */
export type DiagnosisNarrative = {
  /** Text after “Diagnosis:” */
  diagnosisStatement: string;
  /** Short label under Primary Constraint */
  primaryConstraintLabel: string;
  /** Completes “the biggest factor holding you back is…” */
  primaryConstraintDetail: string;
  /** “You’re focusing on … when …” */
  rootCause: string;
  /** Exactly three actionable lines */
  prescription: [string, string, string];
  /** Full outlook paragraph */
  outlook: string;
  /** Readiness: affects tone only */
  readinessLevel: "early" | "building" | "positioned";
  /** Secondary pressure (optional nuance) */
  secondaryNote: string | null;
};

function fmtMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  const k = Math.round(n / 1000);
  return `$${k}K`;
}

function fmtMoneyFull(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

function outlookWindow(a: RealityAnswers): string {
  const base = ["3–6 months", "4–9 months", "6–14 months", "9–18 months"] as const;
  let i = a.timing;
  if (a.credit >= 2) i = Math.min(3, i + 1);
  if (a.savings === 0) i = Math.min(3, i + 1);
  if (a.credit === 3) i = Math.min(3, i + 1);
  return base[i];
}

function readinessFrom(a: RealityAnswers): DiagnosisNarrative["readinessLevel"] {
  const score = (a.income >= 2 ? 1 : 0) + (a.savings >= 2 ? 1 : 0) + (a.credit <= 1 ? 1 : 0) + (a.paymentComfort >= 2 ? 1 : 0);
  if (score >= 3) return "positioned";
  if (score >= 1) return "building";
  return "early";
}

type NarrativePartial = Omit<DiagnosisNarrative, "readinessLevel" | "secondaryNote" | "outlook">;

type NarrativeBuilder = (a: RealityAnswers) => NarrativePartial;

/** Unified next steps — decision-impact layer (replaces per-branch prescription) */
const FLAGSHIP_PRESCRIPTION: [string, string, string] = [
  "Run a real monthly payment scenario (not just a price range).",
  "Get a soft pre-approval to understand your true buying power.",
  "Review strategy with an advisor before making timing decisions.",
];

const PRESCRIPTION_SHAREABLE: [string, string, string] = [
  "Stop sending rent to zero equity",
  "Lock your real monthly number",
  "Take the next move off pause",
];

function pickIdentityLabel(a: RealityAnswers): string {
  if (a.credit === 3) return "The Hidden Buyer";
  if (a.paymentComfort <= 1 && a.income >= 2) return "The Payment-Constrained Buyer";
  if (a.timing === 3) return "The Over-Thinker";
  if (a.savings === 0) return "The Misaligned Planner";
  if (a.credit === 2) return "The Tier-Watcher";
  if (a.income >= 2 && a.credit <= 1 && a.timing <= 1) return "The Ready-but-Hesitant Buyer";
  return "The Quietly Qualified Buyer";
}

function oneLineTruthHook(a: RealityAnswers, rentMonthly: number): string {
  const rm = fmtMoneyFull(Math.round(rentMonthly));
  if (a.timing === 3) {
    return `You are losing ${rm}/month to rent with $0 going to equity — and the meter keeps running.`;
  }
  if (a.timing <= 1) {
    return `You are bleeding ${rm}/month to housing with $0 ownership — speed doesn't fix that.`;
  }
  return `You are paying ${rm}/month with nothing converting to ownership — that's the loss today.`;
}

function buyingReadinessScoreCalc(a: RealityAnswers): number {
  let s = 44;
  s += a.income * 7;
  s += a.savings * 5;
  s += (3 - a.credit) * 8;
  s += a.paymentComfort * 6;
  s -= a.timing * 3;
  return Math.min(91, Math.max(44, Math.round(s)));
}

function positionFromScore(score: number): string {
  if (score >= 74) return "Within Range";
  if (score >= 58) return "Building Toward Range";
  return "Needs Clarity";
}

function confidenceFromReadiness(level: DiagnosisNarrative["readinessLevel"]): string {
  if (level === "positioned") return "Strong";
  if (level === "building") return "Moderate";
  return "Building";
}

/** Completes “… is what’s holding you back” — short, decisive */
function holdingBackPhrase(narrative: DiagnosisNarrative): string {
  switch (narrative.primaryConstraintLabel) {
    case "Credit positioning":
      return "credit tier clarity — not whether you’re a buyer";
    case "Monthly affordability clarity":
      return "how you’re evaluating affordability — not gross income alone";
    case "Savings structure":
      return "savings versus program fit — not one cash number";
    case "Timing uncertainty":
      return "your hesitation";
    default:
      return narrative.primaryConstraintLabel;
  }
}

function recommendedSingleAction(narrative: DiagnosisNarrative): string {
  switch (narrative.primaryConstraintLabel) {
    case "Monthly affordability clarity":
      return "Adjust your target monthly range";
    case "Credit positioning":
      return "Get a soft pre-approval (no impact)";
    case "Timing uncertainty":
      return "Review strategy before making timing decisions";
    case "Savings structure":
      return "Run a real scenario with actual loan options";
    default:
      return "Run a real scenario with actual loan options";
  }
}

function buildStrongVerdict(
  positionLabel: string,
  narrative: DiagnosisNarrative,
  a: RealityAnswers,
): string {
  const hb = holdingBackPhrase(narrative);

  if (narrative.primaryConstraintLabel === "Monthly affordability clarity" && a.income >= 2) {
    return "You are not blocked by income — you are blocked by how you’re evaluating affordability.";
  }

  if (positionLabel === "Not Ready Yet — But Fixable") {
    return "You are closer than you think — but your current assumptions are delaying you.";
  }

  let positionPhrase: string;
  switch (positionLabel) {
    case "Stronger Position Than Expected":
      positionPhrase = "stronger on paper than your confidence shows";
      break;
    case "Within Buying Range":
      positionPhrase = "within buying range today";
      break;
    case "Close — With Adjustments":
      positionPhrase = "close — targeted adjustments close the gap, not a full reset";
      break;
    case "Currently Constrained — Strategy Needed":
      positionPhrase = "constrained on paper until a lender file replaces guesswork";
      break;
    default:
      positionPhrase = "in range once structure matches your numbers";
  }

  if (narrative.primaryConstraintLabel === "Timing uncertainty") {
    return `You are ${positionPhrase} — and your hesitation is what’s holding you back.`;
  }

  return `You are ${positionPhrase} — and ${hb} is what’s holding you back.`;
}

function buildDecisionSharp(n: FinancialRealityNumbers): SharpBlock {
  const band = `${fmtMoneyFull(n.waitRentLow)}–${fmtMoneyFull(n.waitRentHigh)}`;
  return {
    hit: `You sent rent out — ~${band}/yr band — $0 owned.`,
    reality: `You're still paying — equity line: zero.`,
    interpretation: `Guesses don't pay rent — you do.`,
    escalation: `That money doesn't come back.`,
    micDrop: `Doing nothing is still a financial decision.`,
  };
}

function buildDecisionEngine(
  a: RealityAnswers,
  narrative: DiagnosisNarrative,
  n: FinancialRealityNumbers,
): DecisionEngine {
  const score = buyingReadinessScoreCalc(a);
  const sharp = buildDecisionSharp(n);

  let positionLabel: string;
  if (a.credit === 3) {
    positionLabel = "Currently Constrained — Strategy Needed";
  } else if (score >= 78 && a.credit <= 1 && a.income >= 2 && a.savings >= 1) {
    positionLabel = "Stronger Position Than Expected";
  } else if (score >= 72) {
    positionLabel = "Within Buying Range";
  } else if ((a.paymentComfort <= 1 && a.income >= 2) || a.credit === 2) {
    positionLabel = "Close — With Adjustments";
  } else if (a.savings === 0 && a.income <= 1) {
    positionLabel = "Not Ready Yet — But Fixable";
  } else if (a.timing === 3) {
    positionLabel = "Close — With Adjustments";
  } else if (score < 56) {
    positionLabel = "Not Ready Yet — But Fixable";
  } else {
    positionLabel = "Within Buying Range";
  }

  const realityLead = "Here’s the reality:";
  const strongVerdict = buildStrongVerdict(positionLabel, narrative, a);

  let confidenceLevel: "High" | "Moderate" | "Low";
  if (score >= 74 && a.credit <= 1) {
    confidenceLevel = "High";
  } else if (a.credit === 3 || (a.savings === 0 && a.income === 0)) {
    confidenceLevel = "Low";
  } else {
    confidenceLevel = "Moderate";
  }

  const whatThisMeansLead = "What this means:";
  const whatThisMeansBody = "Stop deciding from guesses — use real numbers.";

  const urgencyLead = "Every unclear month:";
  let urgencyConsequence: string;
  if (positionLabel === "Currently Constrained — Strategy Needed" || positionLabel === "Not Ready Yet — But Fixable") {
    urgencyConsequence = "You lose position on the sideline — now.";
  } else if (narrative.primaryConstraintLabel === "Timing uncertainty" || a.timing === 3) {
    urgencyConsequence = "Rent leaves — decision stays open.";
  } else {
    urgencyConsequence = "Months burn — $0 equity attached.";
  }

  const finalLine = "The story — not the numbers — costs you.";

  const recommendedAction = recommendedSingleAction(narrative);

  const ifNothing = `Next year ships ~${fmtMoneyFull(n.waitRentLow)}–${fmtMoneyFull(n.waitRentHigh)} to rent — zero equity back.`;

  const ifAction = "Lock the monthly number — move — or keep paying rent.";

  return {
    positionLabel,
    sharp,
    realityLead,
    strongVerdict,
    confidenceLevel,
    whatThisMeansLead,
    whatThisMeansBody,
    urgencyLead,
    urgencyConsequence,
    finalLine,
    recommendedAction,
    ifNothing,
    ifAction,
  };
}

type IdentityTone = "cautious" | "aggressive" | "confused";

function identityTone(a: RealityAnswers, narrative: DiagnosisNarrative): IdentityTone {
  if (a.credit === 2 || a.credit === 3 || narrative.primaryConstraintLabel === "Monthly affordability clarity") {
    return "confused";
  }
  if (a.timing <= 1 && a.income >= 2 && a.savings >= 1 && a.credit <= 1) {
    return "aggressive";
  }
  return "cautious";
}

function empowerByDecision(base: string, decision: DecisionEngine): string {
  if (decision.positionLabel === "Stronger Position Than Expected") {
    return "You're actually in a position most buyers wish they were in — stronger than you're letting yourself admit.";
  }
  return base;
}

function buildIdentityLayer(
  a: RealityAnswers,
  narrative: DiagnosisNarrative,
  n: FinancialRealityNumbers,
  consequence: ConsequenceData,
  decision: DecisionEngine,
): IdentityLayer {
  const tone = identityTone(a, narrative);
  const rentBand = `${fmtMoneyFull(n.waitRentLow)}–${fmtMoneyFull(n.waitRentHigh)}`;
  const rentMo = formatCurrency(consequence.monthly_loss_estimate);
  const bpDrift = fmtMoney(consequence.buying_power_change);
  const rateDrift = formatCurrency(consequence.rate_sensitivity);

  /** Credit unknown — notSureCredit */
  if (a.credit === 3) {
    const headline =
      tone === "confused"
        ? "You're not disqualified — you're deciding from a blind spot."
        : "You're not priced out — you're hesitating before you've looked.";
    return {
      identityHeadline: headline,
      behaviorMirror:
        "You've been treating “I don't know my score” like a verdict — when it's a missing input, not a final answer.",
      rootCause:
        "This usually happens when buyers believe one surprise on paper would undo everything — so they don't look.",
      consequenceReframe: `The longer you wait, the more you're paying in rent instead of building ownership. Roughly ${rentBand} over the next year (illustrative) — real money that doesn't move your file forward.`,
      identityReframe: empowerByDecision(
        "You're not behind — you're one clear read away from a different conversation.",
        decision,
      ),
      shareableLine: "It's not that you can't buy — it's that you've been waiting for the wrong signal.",
    };
  }

  /** Fair credit — fairCredit */
  if (a.credit === 2) {
    const headline =
      tone === "aggressive"
        ? "You're leaving leverage on the table — not because you can't qualify, but because you're waiting to feel perfect."
        : "You're not priced out — you're hesitating at the wrong time.";
    return {
      identityHeadline: headline,
      behaviorMirror:
        "You've been watching your tier like a scoreboard — instead of testing what structure actually does to your monthly.",
      rootCause:
        "This comes from thinking the score is the whole story — when pricing, structure, and timing move the payment more than the number in your head.",
      consequenceReframe: `Waiting here doesn't reduce risk — it shifts it. You're still paying ~${rentMo}/mo in rent (illustrative) while your tier stays a guess — and a modest rate drift can add ~${rateDrift}/mo on the same home later.`,
      identityReframe: empowerByDecision(
        "You're actually in a position most buyers wish they were in — you just haven't matched structure to it yet.",
        decision,
      ),
      shareableLine: "Most people wait for the market to change — the ones who win adjust their strategy instead.",
    };
  }

  /** Payment vs income — paymentVsIncome */
  if (a.paymentComfort <= 1 && a.income >= 2) {
    return {
      identityHeadline:
        tone === "aggressive"
          ? "You're set up to move — but you're still negotiating with a monthly number you haven't fully tested."
          : "You're financially capable, but mentally waiting for perfect conditions.",
      behaviorMirror:
        "You've been treating your payment comfort like a hard ceiling — before you've seen the full PITI picture against your real income band.",
      rootCause:
        "This usually happens when buyers believe they need to feel certain before they deserve clarity — that's backwards.",
      consequenceReframe: `Delaying isn't protecting you — it's costing you quietly. Roughly ${rentBand} in rent this year (illustrative) — while your buying power window can shrink by ~${bpDrift} if prices drift.`,
      identityReframe: empowerByDecision(
        "You're closer to buying than you're allowing yourself to believe.",
        decision,
      ),
      shareableLine: "It's not that you can't buy — it's that you've been waiting for the wrong signal.",
    };
  }

  /** Low savings — lowSavings */
  if (a.savings === 0) {
    return {
      identityHeadline:
        tone === "cautious"
          ? "You're not broke — you're letting a savings story run louder than the math."
          : "You're not stuck — you're overestimating the risk.",
      behaviorMirror:
        "You've been assuming you need more saved than structure would actually ask for — so the goalpost keeps moving.",
      rootCause:
        "Most people in your position delay because they fear the wrong mistake more than they fear missing the window.",
      consequenceReframe: `The longer you wait, the more you're paying in rent instead of building ownership. Roughly ${rentBand} this year (illustrative) — while the market doesn't pause for your feelings about cash on hand.`,
      identityReframe: empowerByDecision("You're not behind — you're early, but hesitating.", decision),
      shareableLine: "You're not stuck — you're just waiting for certainty that never comes.",
    };
  }

  /** Timing exploring — timing === 3 */
  if (a.timing === 3) {
    return {
      identityHeadline:
        tone === "cautious"
          ? "You're not stuck — you're overestimating the risk of moving."
          : "You're closer than you think, but your assumptions are holding you back.",
      behaviorMirror:
        "You've been waiting for rates or the market to feel right before you commit — while research quietly replaces a decision.",
      rootCause: "This usually happens when buyers believe timing matters more than structure.",
      consequenceReframe: `The longer you wait, the more you're paying in rent instead of building ownership. Roughly ${rentBand} this year (illustrative) — and waiting doesn't freeze prices or rates.`,
      identityReframe: empowerByDecision(
        "You're closer to buying than you're allowing yourself to believe.",
        decision,
      ),
      shareableLine: "Most people wait for the market to change — the ones who win adjust their strategy instead.",
    };
  }

  /** Default — monthly clarity */
  const defHeadline =
    tone === "aggressive"
      ? "You're not underpowered — you're under-informed on what 'affordable' actually means for you."
      : "You're closer than you think, but your assumptions are holding you back.";
  return {
    identityHeadline: defHeadline,
    behaviorMirror:
      "You've been comparing worst-case scenarios in your head instead of anchoring on real numbers for your income band.",
    rootCause:
      "This comes from thinking buying requires perfect conditions — clean emotions, perfect timing, perfect rates.",
    consequenceReframe: `Waiting here doesn't reduce risk — it shifts it. Roughly ${rentBand} in rent this year (illustrative), plus buying power can slide ~${bpDrift} if the market drifts — same hesitation, higher cost.`,
    identityReframe: empowerByDecision(
      "You're not behind — you're early, but hesitating.",
      decision,
    ),
    shareableLine: "You're not stuck — you're just waiting for certainty that never comes.",
  };
}

function buildViralReportCard(
  a: RealityAnswers,
  narrative: DiagnosisNarrative,
  beliefBreak: BeliefBreakNarrative,
  n: FinancialRealityNumbers,
  rentMonthly: number,
): ViralReportCard {
  const score = buyingReadinessScoreCalc(a);
  return {
    cardTitle: "Your Home Buying Profile",
    identityLabel: pickIdentityLabel(a),
    oneLineTruth: oneLineTruthHook(a, rentMonthly),
    estimatedBuyingPower: `${fmtMoney(n.buyingPowerLow)}–${fmtMoney(n.buyingPowerHigh)}`,
    estimatedMonthlyPayment: `${fmtMoneyFull(n.paymentLow)}–${fmtMoneyFull(n.paymentHigh)}/mo`,
    confidenceLevelLabel: confidenceFromReadiness(narrative.readinessLevel),
    beliefYouMayThink: beliefBreak.assumedBelief,
    beliefButLine: beliefBreak.breakLead,
    consequenceRentRange: `${fmtMoneyFull(n.waitRentLow)}–${fmtMoneyFull(n.waitRentHigh)}`,
    consequencePaymentRange: `${fmtMoneyFull(n.waitPaymentIncreaseLow)}–${fmtMoneyFull(n.waitPaymentIncreaseHigh)}`,
    consequenceBuyingPowerRange: `${fmtMoney(n.waitBuyingPowerDropLow)}–${fmtMoney(n.waitBuyingPowerDropHigh)}`,
    prescriptionShort: PRESCRIPTION_SHAREABLE,
    buyingReadinessScore: score,
    positionStatus: positionFromScore(score),
    lossStripLabel: "What standing still already costs you",
    beliefCheckLabel: "You tell yourself",
  };
}

const notSureCredit: NarrativeBuilder = () => ({
  diagnosisStatement:
    "You may already qualify — but not knowing your credit tier is blocking your next move.",
  primaryConstraintLabel: "Credit positioning",
  primaryConstraintDetail: "uncertainty about your score and what actually moves your approval tier.",
  rootCause:
    "You’re focusing on headlines and guesswork, when your real constraint is a clear read on your credit profile and how lenders bucket you.",
  prescription: FLAGSHIP_PRESCRIPTION,
});

const fairCredit: NarrativeBuilder = (a) => ({
  diagnosisStatement:
    a.income >= 2
      ? "You’re closer than you think — but you’re likely overpaying in rate tier, not in income."
      : "You’re not as far off as you think — but your credit band is doing more of the talking than your cash flow.",
  primaryConstraintLabel: "Credit positioning",
  primaryConstraintDetail: "your rate tier—not a lack of will—shaping what feels affordable each month.",
  rootCause:
    "You’re focusing on a ‘perfect’ score, when your real constraint is moving within your tier and matching structure to your monthly number.",
  prescription: FLAGSHIP_PRESCRIPTION,
});

const paymentVsIncome: NarrativeBuilder = () => ({
  diagnosisStatement:
    "You’re closer than you think — but your biggest issue is monthly clarity, not savings.",
  primaryConstraintLabel: "Monthly affordability clarity",
  primaryConstraintDetail: "how total monthly cost (not sticker price) lines up with what you’re willing to pay.",
  rootCause:
    "You’re focusing on home price, when your real constraint is total monthly cost—including taxes and insurance.",
  prescription: FLAGSHIP_PRESCRIPTION,
});

const lowSavings: NarrativeBuilder = (a) => ({
  diagnosisStatement:
    a.income >= 2
      ? "You may already qualify — but you’re treating savings as the gatekeeper when structure matters more."
      : "You’re not as far off as you think — but your down payment story is louder in your head than on paper.",
  primaryConstraintLabel: "Savings structure",
  primaryConstraintDetail: "how much cash you think you need versus what your monthly number can support.",
  rootCause:
    "You’re focusing on a single savings target, when your real constraint is which programs fit your income and payment comfort.",
  prescription: FLAGSHIP_PRESCRIPTION,
});

const timingExploring: NarrativeBuilder = () => ({
  diagnosisStatement:
    "Your timing assumptions may be working against you — open-ended waiting still has a price tag.",
  primaryConstraintLabel: "Timing uncertainty",
  primaryConstraintDetail: "when you’ll act—and what changes if you don’t.",
  rootCause:
    "You’re focusing on ‘someday,’ when your real constraint is the cost of rent drift, rates, and prices while you stay on the sidelines.",
  prescription: FLAGSHIP_PRESCRIPTION,
});

const defaultNarrative: NarrativeBuilder = (a) => ({
  diagnosisStatement:
    a.income >= 2 && a.credit <= 1
      ? "You may already qualify — but you’re underestimating how much buying power you actually have."
      : "You’re closer than you think — but you’re underestimating how much of your payment isn’t the mortgage.",
  primaryConstraintLabel: "Monthly affordability clarity",
  primaryConstraintDetail: "seeing the full monthly picture before you anchor on price or rate alone.",
  rootCause:
    "You’re focusing on price or rate in isolation, when your real constraint is total monthly load—including taxes and insurance.",
  prescription: FLAGSHIP_PRESCRIPTION,
});

function pickNarrative(a: RealityAnswers): DiagnosisNarrative {
  let builder: NarrativeBuilder;
  if (a.credit === 3) builder = notSureCredit;
  else if (a.credit === 2) builder = fairCredit;
  else if (a.paymentComfort <= 1 && a.income >= 2) builder = paymentVsIncome;
  else if (a.savings === 0) builder = lowSavings;
  else if (a.timing === 3) builder = timingExploring;
  else builder = defaultNarrative;

  const partial = builder(a);
  const readinessLevel = readinessFrom(a);
  let secondaryNote: string | null = null;
  if (a.timing <= 1 && a.credit <= 1 && partial.primaryConstraintLabel !== "Timing uncertainty") {
    secondaryNote = "Your timeline is aggressive—small shifts in rate or price hit you faster.";
  } else if (a.savings >= 3 && a.paymentComfort <= 1) {
    secondaryNote = "You have capital—but your monthly comfort may be the real ceiling.";
  }

  return {
    ...partial,
    secondaryNote,
    readinessLevel,
    outlook: `With the right adjustments, you could realistically move into buying within ${outlookWindow(a)}.`,
  };
}

function buildSituationSummary(a: RealityAnswers, primaryConstraintLabel: string): string {
  if (a.timing === 3) {
    return "Right now, you're closer to buying than you think — but open-ended waiting still has a price.";
  }
  if (a.timing <= 1) {
    return "Right now, you're closer to buying than the calendar suggests — but standing still isn't neutral.";
  }
  if (primaryConstraintLabel === "Timing uncertainty") {
    return "Right now, you're closer to buying than you think — but hesitation is still a decision.";
  }
  return "Right now, your numbers are moving in the background — even when your plan feels frozen.";
}

function buildConsequenceData(
  n: FinancialRealityNumbers,
  midPrice: number,
  rentMonthly: number,
): ConsequenceData {
  const bpMid = Math.round((n.waitBuyingPowerDropLow + n.waitBuyingPowerDropHigh) / 2);
  const priceDriftEffect = Math.round(midPrice * 0.025);
  const buyingPowerChange = Math.round(bpMid * 0.55 + priceDriftEffect * 0.45);
  const rateSens = Math.round((n.waitPaymentIncreaseLow + n.waitPaymentIncreaseHigh) / 2);
  return {
    monthly_loss_estimate: Math.round(rentMonthly),
    buying_power_change: Math.max(18_000, buyingPowerChange),
    rate_sensitivity: rateSens,
    confidence_impact: "You pay rent while the numbers move — that feels safer than it is.",
  };
}

function buildConsequenceBullets(c: ConsequenceData, fmtK: (n: number) => string): string[] {
  const rentMo = c.monthly_loss_estimate;
  return [
    `~${formatCurrency(rentMo)}/mo to housing — $0 ownership.`,
    `Buying power down ~${fmtK(c.buying_power_change)} — gone.`,
    `Standing still costs ~${formatCurrency(c.rate_sensitivity)}/mo extra — same home.`,
    `You qualify — the loss is what you leave on the table.`,
  ];
}

const OPPORTUNITY_SHIFT = {
  headline: "The good news:",
  body: "You're not stuck — your position is actually stronger than it feels. A few small adjustments could significantly improve your buying position.",
} as const;

const BELIEF_BREAK_LEAD = "But your numbers already tell a different story.";

function buildBeliefBreak(
  a: RealityAnswers,
  n: FinancialRealityNumbers,
  narrative: DiagnosisNarrative,
  incomeAnnual: number,
): BeliefBreakNarrative {
  const payLo = formatCurrency(n.paymentLow);
  const payHi = formatCurrency(n.paymentHigh);
  const bpR = formatBuyingPowerRange(n.buyingPowerLow, n.buyingPowerHigh);
  const incShort =
    incomeAnnual >= 200_000 ? "~$200K+" : incomeAnnual >= 125_000 ? "~$125K–$200K" : incomeAnnual >= 75_000 ? "~$75K–$125K" : "under ~$75K";

  const inYourCaseBase = {
    paymentLine: `Your estimated monthly payment (PITI) is running about ${payLo}–${payHi}/mo — not just a mortgage payment.`,
    incomeLine: `On roughly ${incShort} household income (the band you selected), your numbers support buying power around ${bpR} — if structure matches.`,
    constraintLine: "",
  };

  if (a.credit === 3) {
    return {
      assumedBelief: "I can't know anything real until I pull my credit and see the score.",
      breakLead: BELIEF_BREAK_LEAD,
      challenge:
        "You may think 'no score on paper' means 'no options' — but waiting in the dark is what shrinks your timeline, not the unknown itself.",
      inYourCase: {
        ...inYourCaseBase,
        constraintLine: `In your case, the bottleneck reads more like ${narrative.primaryConstraintLabel.toLowerCase()} than a hard "no."`,
      },
      reframe:
        "This means: you're not early — you're operating with missing information, and that's fixable in days, not years.",
      thinkingConsequence: [
        "You may keep postponing while rent quietly competes with savings.",
        "You may assume you're not ready when you haven't modeled the full payment yet.",
        "You may let uncertainty feel like disqualification.",
      ],
      newBelief: {
        headline: "A better way to think about your situation:",
        body: "Clarity beats waiting. Get the real file view — then decide, instead of deciding from anxiety.",
      },
    };
  }

  if (a.credit === 2) {
    return {
      assumedBelief: "I need my credit to be in a better tier before I'm a serious buyer.",
      breakLead: BELIEF_BREAK_LEAD,
      challenge:
        "You may think you need to wait for lower rates — but waiting can chip away at buying power while the market doesn't pause.",
      inYourCase: {
        ...inYourCaseBase,
        constraintLine: `In your case, rate tier matters — yet your payment band (${payLo}–${payHi}/mo) is doing more of the steering than you think.`,
      },
      reframe:
        "This means: you're not as far off as you think — you've been watching one dial while the payment math runs on another.",
      thinkingConsequence: [
        "You may delay for a 'perfect' credit story while prices and rents move anyway.",
        "You may lose leverage by waiting for a rate miracle.",
        "You may underestimate how structure changes the same score.",
      ],
      newBelief: {
        headline: "A better way to think about your situation:",
        body: "Focus on monthly structure and tier reality — not a fantasy perfect score before you move.",
      },
    };
  }

  if (a.paymentComfort <= 1 && a.income >= 2) {
    return {
      assumedBelief: "I can't afford enough house in this market — my income isn't enough.",
      breakLead: BELIEF_BREAK_LEAD,
      challenge:
        "You may think you need more savings first — but your monthly affordability is the real driver, and it's tighter on paper than in structure.",
      inYourCase: {
        ...inYourCaseBase,
        constraintLine: `In your case, ${narrative.primaryConstraintLabel.toLowerCase()} is the pinch — not 'not enough income' in isolation.`,
      },
      reframe:
        "This means: you're not looking at the wrong life — you're looking at the wrong variable first (price, not total monthly load).",
      thinkingConsequence: [
        "You may shrink your goal before you shrink the payment problem.",
        "You may over-save while the monthly number stays fuzzy.",
        "You may feel stuck when the fix is structure, not a bigger salary.",
      ],
      newBelief: {
        headline: "A better way to think about your situation:",
        body: "Anchor on total monthly cost (PITI) and programs that fit it — not sticker price alone.",
      },
    };
  }

  if (a.savings === 0) {
    return {
      assumedBelief: "I need a lot more money saved before I can realistically buy.",
      breakLead: BELIEF_BREAK_LEAD,
      challenge:
        "You may think the down payment is the gate — but for many buyers, monthly payment and program fit matter more than a 20% story.",
      inYourCase: {
        ...inYourCaseBase,
        constraintLine: `In your case, buying power still shows ${bpR} — the question is which path matches your cash flow, not a single savings number.`,
      },
      reframe:
        "This means: you're not as cash-heavy as the internet says you must be — you're closer on monthly math than on the savings myth.",
      thinkingConsequence: [
        "You may delay for a savings target that isn't required for your path.",
        "You may rent longer while the monthly payment story stays unmodeled.",
        "You may overestimate how much cash blocks you versus how much structure opens you.",
      ],
      newBelief: {
        headline: "A better way to think about your situation:",
        body: "Separate move-in cash from program fit — then build savings toward a closing date, not shame.",
      },
    };
  }

  if (a.timing === 3) {
    return {
      assumedBelief: "I should wait until the market or rates get better for me.",
      breakLead: BELIEF_BREAK_LEAD,
      challenge:
        "You may think waiting is neutral — but waiting has a cost: rent, drift, and the feeling of being 'less ready' later.",
      inYourCase: {
        ...inYourCaseBase,
        constraintLine: `In your case, ${narrative.primaryConstraintLabel.toLowerCase()} is what compounds if you stay in browse mode.`,
      },
      reframe:
        "This means: you're not early — you're uncommitted on paper, and that's a different problem than 'not qualified.'",
      thinkingConsequence: [
        "You may delay while buying power and payment assumptions move without you.",
        "You may mistake open-ended research for safety.",
        "You may watch rates and prices from the sidelines until urgency spikes.",
      ],
      newBelief: {
        headline: "A better way to think about your situation:",
        body: "Clarity matters more than timing the market — pick a decision window and model the cost of waiting.",
      },
    };
  }

  return {
    assumedBelief: "I need perfect conditions — better rate, bigger down, more certainty — before I can buy.",
    breakLead: BELIEF_BREAK_LEAD,
    challenge:
      "You may think the next step is 'more ready' — but readiness without numbers is just another way to wait.",
    inYourCase: {
      ...inYourCaseBase,
      constraintLine: `In your case, the signal is ${narrative.primaryConstraintLabel.toLowerCase()} — not missing character, missing structure.`,
    },
    reframe:
      "This means: you don't need perfect conditions — you need the right strategy aligned to your actual payment and income band.",
    thinkingConsequence: [
      "You may keep moving the goalpost while the monthly picture stays vague.",
      "You may lose buying power while you wait for confidence to 'feel' higher.",
      "You may overestimate what was required all along.",
    ],
    newBelief: {
      headline: "A better way to think about your situation:",
      body: "You don't need perfect conditions — you need the right strategy.",
    },
  };
}

export function computeFinancialReality(
  a: RealityAnswers,
  options?: ComputeFinancialRealityOptions,
): {
  numbers: FinancialRealityNumbers;
  narrative: DiagnosisNarrative;
  situationSummary: string;
  beliefBreak: BeliefBreakNarrative;
  reportCard: ViralReportCard;
  decision: DecisionEngine;
  identity: IdentityLayer;
  consequence: ConsequenceData;
  consequenceBullets: string[];
  opportunityShift: typeof OPPORTUNITY_SHIFT;
  consequenceTracker: ConsequenceTracker;
  irreversibility: IrreversibilityEngine;
  presentTense: PresentTenseEngine;
  micDrop: MicDropEngine;
} {
  const incomeAnnual = INCOME_MID_ANNUAL[a.income] ?? INCOME_MID_ANNUAL[1];
  const grossMonthly = incomeAnnual / 12;
  const rate = RATE_BY_CREDIT[a.credit] ?? RATE_BY_CREDIT[1];
  const cMult = CREDIT_BP_MULT[a.credit] ?? 1;
  const savings = SAVINGS_MID[a.savings] ?? SAVINGS_MID[1];
  const comfortPiti = PAYMENT_MID[a.paymentComfort] ?? PAYMENT_MID[1];

  const bpLowRaw = incomeAnnual * (3.6 * cMult + 0.05 * a.savings);
  const bpHighRaw = incomeAnnual * (4.85 * cMult + 0.08 * a.savings);
  const bpLow = Math.round(Math.max(120_000, bpLowRaw) / 5000) * 5000;
  const bpHigh = Math.round(Math.max(bpLow + 25_000, bpHighRaw) / 5000) * 5000;

  const midPrice = (bpLow + bpHigh) / 2;
  const down = Math.min(savings, midPrice * 0.2);
  const loan = Math.max(0, midPrice - down);
  const pi = monthlyPI(loan, rate);
  const pitiMid = pi * PITI_FACTOR;

  const pitiLow = Math.max(800, pitiMid * 0.88);
  const pitiHigh = Math.min(comfortPiti * 1.15, pitiMid * 1.12);

  const piLow = pitiLow / PITI_FACTOR;
  const piHigh = pitiHigh / PITI_FACTOR;
  const tiLow = pitiLow - piLow;
  const tiHigh = pitiHigh - piHigh;
  const tiPctLow = Math.round((tiLow / pitiLow) * 100);
  const tiPctHigh = Math.round((tiHigh / pitiHigh) * 100);

  const rentMonthly =
    options?.rentMonthly != null
      ? Math.min(10_000, Math.max(400, Math.round(options.rentMonthly)))
      : Math.min(4500, Math.max(1400, grossMonthly * 0.32));
  const waitRentLow = Math.round(rentMonthly * 11);
  const waitRentHigh = Math.round(rentMonthly * 13.5);

  const rateBump = 0.0075 + a.credit * 0.0015;
  const priceBump = 0.035 + a.timing * 0.004;
  const loanWait = loan * (1 + priceBump);
  const piWait = monthlyPI(loanWait, rate + rateBump);
  const pitiMidWait = piWait * PITI_FACTOR;
  const payDelta = Math.max(120, pitiMidWait - pitiMid);
  const waitPayLow = Math.round(payDelta + 40 + a.income * 15);
  const waitPayHigh = Math.round(payDelta + 180 + a.income * 35);

  const bpDrop = midPrice * (priceBump + rateBump * 3.5);
  const waitBpDropLow = Math.round(Math.max(22_000, bpDrop * 0.75) / 1000) * 1000;
  const waitBpDropHigh = Math.round(Math.max(waitBpDropLow + 8000, bpDrop * 1.15) / 1000) * 1000;

  const costOfWaitingLow = Math.round(waitRentLow + waitPayLow * 8);
  const costOfWaitingHigh = Math.round(waitRentHigh + waitPayHigh * 11);

  const narrative = pickNarrative(a);
  const situationSummary = buildSituationSummary(a, narrative.primaryConstraintLabel);

  const numbers: FinancialRealityNumbers = {
    buyingPowerLow: bpLow,
    buyingPowerHigh: bpHigh,
    paymentLow: Math.round(pitiLow),
    paymentHigh: Math.round(pitiHigh),
    piMonthlyLow: Math.round(piLow),
    piMonthlyHigh: Math.round(piHigh),
    taxInsMonthlyLow: Math.round(tiLow),
    taxInsMonthlyHigh: Math.round(tiHigh),
    tiShareOfPitiPctLow: Math.min(40, Math.max(22, tiPctLow)),
    tiShareOfPitiPctHigh: Math.min(42, Math.max(24, tiPctHigh)),
    costOfWaitingLow,
    costOfWaitingHigh,
    waitPaymentIncreaseLow: waitPayLow,
    waitPaymentIncreaseHigh: waitPayHigh,
    waitRentLow,
    waitRentHigh,
    waitBuyingPowerDropLow: waitBpDropLow,
    waitBuyingPowerDropHigh: waitBpDropHigh,
  };

  const consequence = buildConsequenceData(numbers, midPrice, rentMonthly);
  const consequenceBullets = buildConsequenceBullets(consequence, fmtMoney);
  const beliefBreak = buildBeliefBreak(a, numbers, narrative, incomeAnnual);
  const reportCard = buildViralReportCard(a, narrative, beliefBreak, numbers, rentMonthly);
  const decision = buildDecisionEngine(a, narrative, numbers);
  const identity = buildIdentityLayer(a, narrative, numbers, consequence, decision);

  const consequenceTracker = buildConsequenceTracker(a, numbers, narrative, {
    midPrice,
    rentMonthly,
    baseRate: rate,
    rateBumpAnnual: rateBump,
    priceBumpAnnual: priceBump,
    incomeAnnual,
    savings,
  });

  const irreversibility = buildIrreversibility(a, narrative, consequenceTracker, numbers, {
    midPrice,
    priceBumpAnnual: priceBump,
  });

  const presentTense = buildPresentTense(a, narrative, numbers, consequence, consequenceTracker, irreversibility);

  const micDrop = buildMicDrop(a, narrative, identity, consequenceTracker, irreversibility);

  return {
    numbers,
    narrative,
    situationSummary,
    beliefBreak,
    reportCard,
    decision,
    identity,
    consequence,
    consequenceBullets,
    opportunityShift: OPPORTUNITY_SHIFT,
    consequenceTracker,
    irreversibility,
    presentTense,
    micDrop,
  };
}

export function formatBuyingPowerRange(low: number, high: number): string {
  return `${fmtMoney(low)}–${fmtMoney(high)}`;
}

export function formatCurrency(n: number): string {
  return fmtMoneyFull(n);
}

function clampIdx(n: number | undefined, fallback: number): number {
  if (n == null || Number.isNaN(n)) return fallback;
  return Math.max(0, Math.min(3, Math.floor(n)));
}

/** Question order: payment, income, credit, savings, timing */
export function answersToReality(answers: number[]): RealityAnswers {
  return {
    paymentComfort: clampIdx(answers[0], 1),
    income: clampIdx(answers[1], 1),
    credit: clampIdx(answers[2], 1),
    savings: clampIdx(answers[3], 1),
    timing: clampIdx(answers[4], 2),
  };
}

export type FinancialRealityOutcome = ReturnType<typeof computeFinancialReality>;

export function computeFromAnswerIndices(
  answers: number[],
  options?: ComputeFinancialRealityOptions,
): FinancialRealityOutcome {
  return computeFinancialReality(answersToReality(answers), options);
}
