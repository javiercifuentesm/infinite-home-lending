/**
 * Wait vs act — illustrative projections only, not underwriting.
 */

import type { DiagnosisNarrative, FinancialRealityNumbers, RealityAnswers } from "./engine";
import type { SharpBlock } from "./sharpLines";

const PITI_FACTOR = 1.32;

function monthlyPI(loan: number, annualRate: number, months = 360): number {
  if (loan <= 0) return 0;
  const r = annualRate / 12;
  return (loan * r) / (1 - Math.pow(1 + r, -months));
}

function sumPrincipalMonths(loan: number, annualRate: number, months: number): number {
  if (loan <= 0) return 0;
  const r = annualRate / 12;
  const payment = monthlyPI(loan, annualRate);
  let balance = loan;
  let total = 0;
  for (let i = 0; i < months; i++) {
    const interest = balance * r;
    const princ = payment - interest;
    total += princ;
    balance -= princ;
  }
  return total;
}

export type TrackerTone = "hesitant" | "aggressive" | "unsure";

export type ConsequenceScenario = {
  id: "now" | "6m" | "12m";
  label: string;
  monthsWait: number;
  purchasePrice: number;
  monthlyPayment: number;
  totalCostFiveYear: number;
  equityGainedFiveYear: number;
};

export type ConsequenceTracker = {
  sharp: SharpBlock;
  yearlyLossApprox: number;
  primaryHeadline: string;
  primaryHeadlineSub: string;
  monthlyMissedEquity: number;
  monthlyRentLost: number;
  monthlyPriceDrift: number;
  totalMonthlyImpact: number;
  sixMonthCostIllustrative: number;
  scenarios: ConsequenceScenario[];
  accumulationCurve: { month: number; cumulativeLoss: number }[];
  marketSensitivity: {
    ratePlusHalf: { paymentDiff: number; qualificationLine: string };
    rateMinusHalf: { paymentDiff: number };
    priceRiseBand: { lowPct: number; highPct: number; extraDown: number; paymentLift: number; incomeNote: string };
  };
  consequenceStatement: string;
  decisionPressureLine: string;
  trackerTone: TrackerTone;
};

function trackerTone(a: RealityAnswers, narrative: DiagnosisNarrative): TrackerTone {
  if (a.timing === 3 || narrative.primaryConstraintLabel === "Timing uncertainty") return "hesitant";
  if (a.timing <= 1 && a.income >= 2 && a.savings >= 1 && a.credit <= 1) return "aggressive";
  return "unsure";
}

function pitiFor(loan: number, rate: number): number {
  return monthlyPI(loan, rate) * PITI_FACTOR;
}

function fmt(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

export function buildConsequenceTracker(
  a: RealityAnswers,
  n: FinancialRealityNumbers,
  narrative: DiagnosisNarrative,
  ctx: {
    midPrice: number;
    rentMonthly: number;
    baseRate: number;
    rateBumpAnnual: number;
    priceBumpAnnual: number;
    incomeAnnual: number;
    savings: number;
  },
): ConsequenceTracker {
  const { midPrice, rentMonthly, baseRate, rateBumpAnnual, priceBumpAnnual, incomeAnnual, savings } = ctx;

  const down = Math.min(savings, midPrice * 0.2);
  const loan0 = Math.max(0, midPrice - down);
  const paymentNow = pitiFor(loan0, baseRate);

  const firstMonthInterest = loan0 * (baseRate / 12);
  const firstMonthPrincipal = Math.max(0, monthlyPI(loan0, baseRate) - firstMonthInterest);
  const monthlyAppreciationEquity = midPrice * (0.024 / 12) * (down / Math.max(midPrice, 1));
  const monthlyMissedEquity = Math.round(firstMonthPrincipal + monthlyAppreciationEquity);

  const monthlyRentLost = Math.round(rentMonthly);
  const waitPayMid = (n.waitPaymentIncreaseLow + n.waitPaymentIncreaseHigh) / 2;
  const monthlyPriceDrift = Math.max(0, Math.round(waitPayMid / 12));
  const totalMonthlyImpact = monthlyMissedEquity + monthlyRentLost + monthlyPriceDrift;

  const sixMonthCostIllustrative = Math.round(rentMonthly * 6 + waitPayMid * 3);
  const yearlyLossApprox = Math.round(totalMonthlyImpact * 12);

  const tone = trackerTone(a, narrative);

  let sharp: SharpBlock;
  if (tone === "hesitant") {
    sharp = {
      hit: `Six months already burned ~${fmt(sixMonthCostIllustrative)}.`,
      reality: `You're losing ~${fmt(totalMonthlyImpact)}/month combined.`,
      interpretation: `Every rent dollar — zero equity.`,
      escalation: `You don't get this time back.`,
      micDrop: `Doing nothing is still a financial decision.`,
    };
  } else if (tone === "aggressive") {
    sharp = {
      hit: `You're bleeding ~${fmt(totalMonthlyImpact)}/mo while you wait.`,
      reality: `That's ~${fmt(yearlyLossApprox)}/year — gone.`,
      interpretation: `Opportunity left — rent stayed.`,
      escalation: `This doesn't fix itself later.`,
      micDrop: `You're paying — just not for yourself.`,
    };
  } else {
    sharp = {
      hit: `You're down ~${fmt(totalMonthlyImpact)}/month on the model.`,
      reality: `Stack that — ~${fmt(yearlyLossApprox)}/year walking out.`,
      interpretation: `Cash out — nothing owned.`,
      escalation: `That money is gone.`,
      micDrop: `Rent is the only payment you never see again.`,
    };
  }

  const primaryHeadline =
    tone === "hesitant"
      ? `Six months costs you ~${fmt(sixMonthCostIllustrative)} — gone.`
      : tone === "aggressive"
        ? `You lose ~${fmt(totalMonthlyImpact)}/month on the sideline.`
        : `You bleed ~${fmt(totalMonthlyImpact)}/month — rent, drift, missed equity.`;

  const primaryHeadlineSub =
    tone === "hesitant"
      ? `Combined drag: ~${fmt(totalMonthlyImpact)}/month — rent plus drift.`
      : tone === "aggressive"
        ? `You can move — stillness turns into rent you never recover.`
        : `Stillness isn't free — you pay rent with $0 ownership.`;

  function scenario(monthsWait: number, id: ConsequenceScenario["id"], label: string): ConsequenceScenario {
    const t = monthsWait / 12;
    const price = midPrice * (1 + priceBumpAnnual * t);
    const downT = Math.min(savings, price * 0.2);
    const loan = Math.max(0, price - downT);
    const rate = baseRate + rateBumpAnnual * t;
    const payment = pitiFor(loan, rate);
    const rentBefore = rentMonthly * monthsWait;
    const closing = price * 0.01;
    const totalCostFiveYear = rentBefore + closing + payment * 60;
    const appreciation = price * (Math.pow(1.022, 5) - 1);
    const principalPaid = sumPrincipalMonths(loan, rate, 60);
    const equityGainedFiveYear = Math.round(principalPaid + appreciation * (downT / price));

    return {
      id,
      label,
      monthsWait,
      purchasePrice: Math.round(price),
      monthlyPayment: Math.round(payment),
      totalCostFiveYear: Math.round(totalCostFiveYear),
      equityGainedFiveYear,
    };
  }

  const scenarios: ConsequenceScenario[] = [
    scenario(0, "now", "Buy now"),
    scenario(6, "6m", "Wait 6 months"),
    scenario(12, "12m", "Wait 12 months"),
  ];

  const accumulationCurve = [0, 2, 4, 6, 8, 10, 12].map((month) => ({
    month,
    cumulativeLoss: Math.round(month * rentMonthly + month * (waitPayMid / 12)),
  }));

  const loanSame = loan0;
  const payPlus = pitiFor(loanSame, baseRate + 0.005);
  const payMinus = pitiFor(loanSame, baseRate - 0.005);
  const ratePlusHalf = {
    paymentDiff: Math.round(payPlus - paymentNow),
    qualificationLine: `+0.5%: payment shifts ~${fmt(Math.abs(payPlus - paymentNow))}/mo ${payPlus >= paymentNow ? "higher" : "lower"} — same loan.`,
  };
  const rateMinusHalf = {
    paymentDiff: Math.round(payMinus - paymentNow),
  };

  const priceRiseLow = midPrice * 1.03;
  const priceRiseHigh = midPrice * 1.05;
  const downLow = Math.min(savings, priceRiseLow * 0.2);
  const downHigh = Math.min(savings, priceRiseHigh * 0.2);
  const extraDown = Math.round((downLow + downHigh) / 2 - down);
  const loanHigh = Math.max(0, priceRiseHigh - downHigh);
  const payHigh = pitiFor(loanHigh, baseRate);
  const paymentLift = Math.round(payHigh - paymentNow);
  const incomeStep = Math.round((paymentLift * 12) / 0.36);
  const priceRiseBand = {
    lowPct: 3,
    highPct: 5,
    extraDown: Math.max(0, extraDown),
    paymentLift,
    incomeNote:
      incomeStep > 500
        ? `~4% higher prices: need +${fmt(incomeStep)}/yr income — same comfort — or shrink.`
        : `~4% higher: +${fmt(paymentLift)}/mo payment — you eat it or downsize.`,
  };

  const consequenceStatement =
    tone === "hesitant"
      ? "You paid rent and drift — zero refund coming."
      : tone === "aggressive"
        ? "Rent cleared — equity didn't."
        : "Safety was rent — equity stayed zero.";

  const decisionPressureLine =
    tone === "hesitant"
      ? "Waiting already cost you — it keeps costing."
      : tone === "aggressive"
        ? "Every rent month subtracts what you keep."
        : "Rent left — certainty never showed.";

  return {
    sharp,
    yearlyLossApprox,
    primaryHeadline,
    primaryHeadlineSub,
    monthlyMissedEquity,
    monthlyRentLost,
    monthlyPriceDrift,
    totalMonthlyImpact,
    sixMonthCostIllustrative,
    scenarios,
    accumulationCurve,
    marketSensitivity: {
      ratePlusHalf,
      rateMinusHalf,
      priceRiseBand,
    },
    consequenceStatement,
    decisionPressureLine,
    trackerTone: tone,
  };
}
