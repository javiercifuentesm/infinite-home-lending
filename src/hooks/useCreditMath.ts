/** Credit Score ROI — educational tier pricing; not a lender quote. */

import type { CreditAction } from "../data/creditActions";

export const RATE_TABLE: Record<number, number> = {
  760: 6.5,
  740: 6.625,
  720: 6.75,
  700: 6.875,
  680: 7.0,
  660: 7.25,
  640: 7.5,
  620: 7.875,
  580: 8.375,
};

export type ScoreTierOption = { value: number; label: string };

export const SCORE_TIERS: readonly ScoreTierOption[] = [
  { value: 760, label: "760+ — excellent" },
  { value: 740, label: "740–759 — very good" },
  { value: 720, label: "720–739 — very good" },
  { value: 700, label: "700–719 — good" },
  { value: 680, label: "680–699 — good" },
  { value: 660, label: "660–679 — fair" },
  { value: 640, label: "640–659 — fair" },
  { value: 620, label: "620–639 — fair" },
  { value: 580, label: "580–619 — below average" },
];

const TIER_KEYS_DESC = Object.keys(RATE_TABLE)
  .map(Number)
  .sort((a, b) => b - a);

export function getRate(score: number): number {
  for (const k of TIER_KEYS_DESC) {
    if (score >= k) return RATE_TABLE[k];
  }
  return RATE_TABLE[580];
}

/** Nearest tier floor at or below score (for row matching). */
export function tierFloorForScore(score: number): number {
  for (const k of TIER_KEYS_DESC) {
    if (score >= k) return k;
  }
  return 580;
}

export function nextTierAboveScore(score: number): number {
  const asc = [...SCORE_TIERS].sort((a, b) => a.value - b.value);
  const n = asc.find((t) => t.value > score);
  return n ? n.value : score;
}

export function monthlyPmt(principal: number, annualRate: number, termMonths: number): number {
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / termMonths;
  return (principal * (r * Math.pow(1 + r, termMonths))) / (Math.pow(1 + r, termMonths) - 1);
}

export function totalInterest(principal: number, annualRate: number, termMonths: number): number {
  const pmt = monthlyPmt(principal, annualRate, termMonths);
  return pmt * termMonths - principal;
}

export type CreditInputs = {
  hp: number;
  dp: number;
  curScore: number;
  tgtScore: number;
  term: number;
  timeframe: number;
};

export type CreditCalcResult = {
  loan: number;
  curRate: number;
  tgtRate: number;
  curPmt: number;
  tgtPmt: number;
  curTotalInt: number;
  tgtTotalInt: number;
  lifetimeSavings: number;
  monthlySavings: number;
  rateDiff: number;
  ptsDiff: number;
  dollarPerPoint: number;
  effectiveTgt: number;
  term: number;
  timeframe: number;
  chartLabels: string[];
  curCumArr: number[];
  tgtCumArr: number[];
  /** True when user had curScore >= tgtScore — tgt was coerced upward */
  hadInvalidScorePair: boolean;
};

export function runCalculation(inputs: CreditInputs): CreditCalcResult {
  const { hp, dp, curScore, tgtScore, term, timeframe } = inputs;
  const termMos = term * 12;
  const loan = Math.round(hp * (1 - dp / 100));

  /** Top FICO bucket — no higher pricing tier to model. */
  if (curScore >= 760) {
    const curRate = getRate(curScore);
    const curPmt = monthlyPmt(loan, curRate, termMos);
    const curTotalInt = totalInterest(loan, curRate, termMos);
    return {
      loan,
      curRate,
      tgtRate: curRate,
      curPmt: Math.round(curPmt),
      tgtPmt: Math.round(curPmt),
      curTotalInt: Math.round(curTotalInt),
      tgtTotalInt: Math.round(curTotalInt),
      lifetimeSavings: 0,
      monthlySavings: 0,
      rateDiff: 0,
      ptsDiff: 1,
      dollarPerPoint: 0,
      effectiveTgt: 760,
      term,
      timeframe,
      chartLabels: [],
      curCumArr: [],
      tgtCumArr: [],
      hadInvalidScorePair: false,
    };
  }

  const hadInvalidScorePair = curScore >= tgtScore;
  const sanitizedTgt = hadInvalidScorePair ? nextTierAboveScore(curScore) : tgtScore;
  const effectiveTgt = Math.max(sanitizedTgt, curScore + 20);

  const curRate = getRate(curScore);
  const tgtRate = getRate(effectiveTgt);

  const curPmt = monthlyPmt(loan, curRate, termMos);
  const tgtPmt = monthlyPmt(loan, tgtRate, termMos);
  const curTotalInt = totalInterest(loan, curRate, termMos);
  const tgtTotalInt = totalInterest(loan, tgtRate, termMos);

  const lifetimeSavings = Math.max(0, Math.round(curTotalInt - tgtTotalInt));
  const monthlySavings = Math.max(0, Math.round(curPmt - tgtPmt));
  const rateDiff = curRate - tgtRate;
  const ptsDiff = Math.max(1, effectiveTgt - curScore);
  const dollarPerPoint = Math.max(0, Math.round(lifetimeSavings / ptsDiff));

  const chartLabels: string[] = [];
  const curCumArr: number[] = [];
  const tgtCumArr: number[] = [];
  const skipYrs = Math.max(1, Math.floor(term / 8));

  const curTI = curTotalInt;
  const tgtTI = tgtTotalInt;

  for (let yr = 1; yr <= term; yr++) {
    const proportion = yr / term;
    const curCum = curTI * (1 - Math.pow(1 - proportion, 1.4));
    const tgtCum = tgtTI * (1 - Math.pow(1 - proportion, 1.4));
    if (yr % skipYrs === 0 || yr === term) {
      chartLabels.push("Yr " + yr);
      curCumArr.push(Math.round(curCum));
      tgtCumArr.push(Math.round(tgtCum));
    }
  }

  return {
    loan,
    curRate,
    tgtRate,
    curPmt: Math.round(curPmt),
    tgtPmt: Math.round(tgtPmt),
    curTotalInt: Math.round(curTotalInt),
    tgtTotalInt: Math.round(tgtTotalInt),
    lifetimeSavings,
    monthlySavings,
    rateDiff,
    ptsDiff,
    dollarPerPoint,
    effectiveTgt,
    term,
    timeframe,
    chartLabels,
    curCumArr,
    tgtCumArr,
    hadInvalidScorePair,
  };
}

export function calcActionROI(
  action: CreditAction,
  loan: number,
  termMos: number,
  curRate: number,
  rateDiff: number,
  ptsDiff: number,
): { midPts: number; lifetimeSavings: number; monthlySavings: number } {
  const midPts = Math.round((action.pts[0] + action.pts[1]) / 2);
  const ratePerPoint = rateDiff / Math.max(1, ptsDiff);
  const rateGain = ratePerPoint * midPts;
  const newRate = Math.max(RATE_TABLE[760], curRate - rateGain);
  const savings = totalInterest(loan, curRate, termMos) - totalInterest(loan, newRate, termMos);
  const monthSave = monthlyPmt(loan, curRate, termMos) - monthlyPmt(loan, newRate, termMos);
  return {
    midPts,
    lifetimeSavings: Math.max(0, Math.round(savings)),
    monthlySavings: Math.max(0, Math.round(monthSave)),
  };
}

export function fmt(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

export function fmtK(n: number): string {
  const x = Math.round(n);
  const abs = Math.abs(x);
  if (abs >= 1_000_000) return `$${(x / 1_000_000).toFixed(1)}M`.replace(".0M", "M");
  if (abs >= 1000) return `$${Math.round(x / 1000)}k`;
  return `$${x.toLocaleString("en-US")}`;
}