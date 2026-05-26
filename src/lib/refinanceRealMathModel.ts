/**
 * Refinance Real Math — advisory comparison (rate-and-term style).
 * Closing costs assumed paid in cash at close (not financed).
 */

import { monthlyPI } from "./mortgage";

function fmtMoney(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export type RefinanceRealMathStrings = {
  keyInsight: string;
  verdict: {
    paymentNotLower: { title: string; body: string };
    modestChange: { title: string; body: string };
    paymentDownCostUp: { title: string; body: string };
    likelyWorthIt: { bodyWithYears: string; bodyQuick: string; title: string };
    dependsTimeline: { title: string; body: string };
    closerLook: { title: string; body: string; lower: string; higher: string };
  };
};

export type RefinanceRealMathInputs = {
  currentBalance: number;
  currentRatePct: number;
  remainingYears: number;
  newRatePct: number;
  newTermYears: number;
  closingCosts: number;
  /** How far out to compare interest / cash (years) */
  compareHorizonYears: number;
};

export type AmortMonth = {
  monthIndex: number;
  payment: number;
  interest: number;
  principal: number;
  balanceEnd: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
};

export type RefinanceVerdictKind =
  | "likely_worth_it"
  | "depends_on_timeline"
  | "modest_change"
  | "payment_not_lower"
  | "payment_down_cost_up"
  | "invalid";

export type RefinanceRealMathResult = {
  inputs: RefinanceRealMathInputs;
  horizonMonths: number;
  currentMonthlyPayment: number;
  newMonthlyPayment: number;
  monthlyDelta: number;
  breakEvenMonths: number | null;
  interestTotalCurrentHorizon: number;
  interestTotalNewHorizon: number;
  cashOutCurrentHorizon: number;
  cashOutNewHorizon: number;
  /** Closing costs + new loan payments over horizon */
  totalCashNewPathHorizon: number;
  /** Current loan payments over horizon */
  totalCashCurrentPathHorizon: number;
  seriesCurrent: AmortMonth[];
  seriesNew: AmortMonth[];
  verdictKind: RefinanceVerdictKind;
  verdictTitle: string;
  verdictBody: string;
  keyInsight: string;
};

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

function buildSchedule(
  startingBalance: number,
  annualRatePct: number,
  termMonths: number,
  monthsToRun: number
): AmortMonth[] {
  const n = Math.max(0, Math.floor(termMonths));
  const H = Math.max(0, Math.floor(monthsToRun));
  if (startingBalance <= 0 || n === 0 || H === 0) return [];

  const pmt = monthlyPI(startingBalance, annualRatePct, n);
  const r = annualRatePct / 100 / 12;
  let bal = startingBalance;
  let cumInt = 0;
  let cumPrin = 0;
  const out: AmortMonth[] = [];

  for (let m = 0; m < H; m++) {
    if (bal <= 0.01) break;
    const interest = r > 0 ? bal * r : 0;
    let principal = pmt - interest;
    if (principal > bal) principal = bal;
    const balanceEnd = Math.max(0, bal - principal);
    cumInt += interest;
    cumPrin += principal;
    out.push({
      monthIndex: m,
      payment: pmt,
      interest,
      principal,
      balanceEnd,
      cumulativeInterest: cumInt,
      cumulativePrincipal: cumPrin,
    });
    bal = balanceEnd;
  }

  return out;
}

export function computeRefinanceRealMath(
  raw: RefinanceRealMathInputs,
  strings?: RefinanceRealMathStrings
): RefinanceRealMathResult | null {
  const currentBalance = clamp(raw.currentBalance, 1, 50_000_000);
  const currentRatePct = clamp(raw.currentRatePct, 0.1, 25);
  const remainingYears = clamp(raw.remainingYears, 0.25, 40);
  const newRatePct = clamp(raw.newRatePct, 0.1, 25);
  const newTermYears = clamp(raw.newTermYears, 5, 40);
  const closingCosts = clamp(raw.closingCosts, 0, 500_000);
  const compareHorizonYears = clamp(raw.compareHorizonYears, 1, 30);

  const remainingMonths = Math.round(remainingYears * 12);
  const newTermMonths = Math.round(newTermYears * 12);
  const horizonMonths = Math.min(Math.round(compareHorizonYears * 12), 600);

  if (remainingMonths < 1 || newTermMonths < 1) return null;

  const currentMonthlyPayment = monthlyPI(currentBalance, currentRatePct, remainingMonths);
  const newMonthlyPayment = monthlyPI(currentBalance, newRatePct, newTermMonths);

  const monthlyDelta = currentMonthlyPayment - newMonthlyPayment;
  let breakEvenMonths: number | null = null;
  if (monthlyDelta > 1e-6 && closingCosts > 0) {
    breakEvenMonths = closingCosts / monthlyDelta;
  } else if (monthlyDelta > 1e-6 && closingCosts <= 0) {
    breakEvenMonths = 0;
  }

  const seriesCurrent = buildSchedule(currentBalance, currentRatePct, remainingMonths, horizonMonths);
  const seriesNew = buildSchedule(currentBalance, newRatePct, newTermMonths, horizonMonths);

  const interestTotalCurrentHorizon =
    seriesCurrent.length > 0 ? seriesCurrent[seriesCurrent.length - 1].cumulativeInterest : 0;
  const interestTotalNewHorizon =
    seriesNew.length > 0 ? seriesNew[seriesNew.length - 1].cumulativeInterest : 0;

  const totalCashCurrentPathHorizon = seriesCurrent.reduce((s, row) => s + row.payment, 0);
  const totalCashNewPathHorizon = closingCosts + seriesNew.reduce((s, row) => s + row.payment, 0);

  const cashOutCurrentHorizon = totalCashCurrentPathHorizon;
  const cashOutNewHorizon = totalCashNewPathHorizon;

  const { verdictKind, verdictTitle, verdictBody, keyInsight } = buildVerdict({
    monthlyDelta,
    breakEvenMonths,
    horizonMonths,
    interestTotalCurrentHorizon,
    interestTotalNewHorizon,
    closingCosts,
    currentMonthlyPayment,
    newMonthlyPayment,
    newTermYears,
    compareHorizonYears,
    strings,
  });

  const inputs: RefinanceRealMathInputs = {
    currentBalance,
    currentRatePct,
    remainingYears,
    newRatePct,
    newTermYears,
    closingCosts,
    compareHorizonYears,
  };

  return {
    inputs,
    horizonMonths,
    currentMonthlyPayment,
    newMonthlyPayment,
    monthlyDelta,
    breakEvenMonths,
    interestTotalCurrentHorizon,
    interestTotalNewHorizon,
    cashOutCurrentHorizon,
    cashOutNewHorizon,
    totalCashNewPathHorizon,
    totalCashCurrentPathHorizon,
    seriesCurrent,
    seriesNew,
    verdictKind,
    verdictTitle,
    verdictBody,
    keyInsight,
  };
}

const KEY_INSIGHT_AHA = `Here's what most people miss:

Refinancing doesn't just change your rate — it resets how your loan works over time.

Early years are interest-heavy. When you restart the clock, you go back to paying more interest again.

That's why a lower payment doesn't always mean a better outcome.`;

function buildVerdict(p: {
  monthlyDelta: number;
  breakEvenMonths: number | null;
  horizonMonths: number;
  interestTotalCurrentHorizon: number;
  interestTotalNewHorizon: number;
  closingCosts: number;
  currentMonthlyPayment: number;
  newMonthlyPayment: number;
  newTermYears: number;
  compareHorizonYears: number;
  strings?: RefinanceRealMathStrings;
}): {
  verdictKind: RefinanceVerdictKind;
  verdictTitle: string;
  verdictBody: string;
  keyInsight: string;
} {
  const {
    monthlyDelta,
    breakEvenMonths,
    horizonMonths,
    interestTotalCurrentHorizon,
    interestTotalNewHorizon,
    currentMonthlyPayment,
    newMonthlyPayment,
    newTermYears,
    compareHorizonYears,
    strings,
  } = p;

  const keyInsight = strings?.keyInsight ?? KEY_INSIGHT_AHA;
  const interestDelta = interestTotalCurrentHorizon - interestTotalNewHorizon;
  const horizonYears = horizonMonths / 12;
  const termRounded = Math.round(newTermYears);
  const extraInterestIfNewHigher = Math.max(0, interestTotalNewHorizon - interestTotalCurrentHorizon);

  if (newMonthlyPayment > currentMonthlyPayment + 1e-2) {
    return {
      verdictKind: "payment_not_lower",
      verdictTitle: strings?.verdict.paymentNotLower.title ?? "Your payment may not actually drop",
      verdictBody:
        strings?.verdict.paymentNotLower.body ??
        "A lower rate on paper doesn't always mean a lower payment when the loan stretches to a longer term. Before you chase the rate, look at the payment line and the interest totals — they're telling different stories.",
      keyInsight,
    };
  }

  if (monthlyDelta <= 1e-2) {
    return {
      verdictKind: "modest_change",
      verdictTitle: strings?.verdict.modestChange.title ?? "The monthly move is small — the decision is still real",
      verdictBody:
        strings?.verdict.modestChange.body ??
        "A few dollars either way doesn't mean you're wrong to look — it means closing costs and how long you'll keep the loan are doing most of the talking.",
      keyInsight,
    };
  }

  const be = breakEvenMonths ?? Infinity;
  const recoversInHorizon = be <= horizonMonths;

  if (monthlyDelta > 0 && interestDelta < -1e-2) {
    const bodyTemplate =
      strings?.verdict.paymentDownCostUp.body ??
      `By resetting to a ${termRounded}-year loan, you're extending how long interest works against you. Over the next ${compareHorizonYears} years, this model shows about ${fmtMoney(
        extraInterestIfNewHigher
      )} more in interest than staying on your current path — even with a lower check each month.

That lower payment comes with a tradeoff most people never see clearly. It isn't automatically wrong — but it's worth deciding with your eyes open.`;

    return {
      verdictKind: "payment_down_cost_up",
      verdictTitle: strings?.verdict.paymentDownCostUp.title ?? "Your payment goes down — but the cost can go up",
      verdictBody: bodyTemplate
        .replace("{term}", String(termRounded))
        .replace("{years}", String(compareHorizonYears))
        .replace("{amount}", fmtMoney(extraInterestIfNewHigher)),
      keyInsight,
    };
  }

  if (monthlyDelta > 0 && recoversInHorizon && interestDelta > 1e-2) {
    const beYears = breakEvenMonths != null && Number.isFinite(breakEvenMonths) ? breakEvenMonths / 12 : null;
    const useWithYears = beYears != null && beYears > 0.05;
    const bodyTemplate = useWithYears
      ? (strings?.verdict.likelyWorthIt.bodyWithYears ??
          `You save about ${fmtMoney(monthlyDelta)}/month and break even in roughly ${beYears!.toFixed(1)} years. After that, the savings are real — if you stay.

The key question isn't the rate — it's whether you stay long enough for the math to play out. Life moves; the numbers don't.`)
      : (strings?.verdict.likelyWorthIt.bodyQuick ??
          `You save about ${fmtMoney(monthlyDelta)}/month and break even quickly on this model. After that, the savings are real — if you stay.

The key question isn't the rate — it's whether you stay long enough for the math to play out. Life moves; the numbers don't.`);

    const verdictBody = useWithYears
      ? bodyTemplate.replace("{monthly}", fmtMoney(monthlyDelta)).replace("{years}", beYears!.toFixed(1))
      : bodyTemplate.replace("{monthly}", fmtMoney(monthlyDelta));

    return {
      verdictKind: "likely_worth_it",
      verdictTitle: strings?.verdict.likelyWorthIt.title ?? "This can work — if the timeline holds",
      verdictBody,
      keyInsight,
    };
  }

  if (monthlyDelta > 0 && !recoversInHorizon) {
    const bodyTemplate =
      strings?.verdict.dependsTimeline.body ??
      `You'd free about ${fmtMoney(
        monthlyDelta
      )}/month, but closing costs don't break even in your ${compareHorizonYears}-year comparison window. If you move or refinance again before that, the savings can evaporate.

That doesn't mean "no." It means the decision is about time, not just the rate.`;

    return {
      verdictKind: "depends_on_timeline",
      verdictTitle: strings?.verdict.dependsTimeline.title ?? "The payment improves — your calendar might not",
      verdictBody: bodyTemplate
        .replace("{monthly}", fmtMoney(monthlyDelta))
        .replace("{years}", String(compareHorizonYears)),
      keyInsight,
    };
  }

  const closerBodyTemplate =
    strings?.verdict.closerLook.body ??
    `Over ~${horizonYears.toFixed(
      0
    )} years, interest paid is ${interestDelta >= 0 ? "lower" : "higher"} on the new loan in this model — a starting point, not a verdict. Taxes, MI, and lender fees beyond this estimate still change the picture.`;

  return {
    verdictKind: "depends_on_timeline",
    verdictTitle: strings?.verdict.closerLook.title ?? "Worth a closer look with your full picture",
    verdictBody: closerBodyTemplate
      .replace("{years}", horizonYears.toFixed(0))
      .replace(
        "{direction}",
        interestDelta >= 0
          ? (strings?.verdict.closerLook.lower ?? "lower")
          : (strings?.verdict.closerLook.higher ?? "higher")
      ),
    keyInsight,
  };
}

export const DEFAULT_REFINANCE_INPUTS: RefinanceRealMathInputs = {
  currentBalance: 385_000,
  currentRatePct: 6.875,
  remainingYears: 26,
  newRatePct: 6.125,
  newTermYears: 30,
  closingCosts: 6_500,
  compareHorizonYears: 7,
};
