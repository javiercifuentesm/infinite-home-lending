/**
 * Insight-driven financial intelligence layer — directional estimates, not underwriting.
 * Feeds one-idea cards: single headline number + contrast + microcopy.
 */

import type { FinancialRealityOutcome } from "./engine";

const PITI_FACTOR = 1.32;

function monthlyPI(loan: number, annualRate: number, months = 360): number {
  if (loan <= 0) return 0;
  const r = annualRate / 12;
  return (loan * r) / (1 - Math.pow(1 + r, -months));
}

function sumInterestMonths(loan: number, annualRate: number, months: number): number {
  if (loan <= 0) return 0;
  const r = annualRate / 12;
  const payment = monthlyPI(loan, annualRate);
  let balance = loan;
  let totalInterest = 0;
  for (let i = 0; i < months; i++) {
    const interest = balance * r;
    totalInterest += interest;
    const princ = payment - interest;
    balance -= princ;
  }
  return totalInterest;
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

function pitiFor(loan: number, rate: number): number {
  return monthlyPI(loan, rate) * PITI_FACTOR;
}

export type InsightPack = {
  paymentTruth: {
    pitiRounded: number;
    principalMonthly: number;
    lostMonthly: number;
    usablePerDollar: number;
    lostPerDollar: number;
    microcopy: string;
  };
  wastedMoney: {
    toInterestPerDollar: number;
    toPrincipalPerDollar: number;
    wastedRatio: number;
    microcopy: string;
  };
  timePenalty: {
    monthsWaited: number;
    rentCost: number;
    priceIncrease: number;
    paymentLift60mo: number;
    totalPenalty: number;
    microcopy: string;
  };
  rateImpact: {
    paymentDeltaMonthly: number;
    line: string;
    microcopy: string;
  };
  breakEven: {
    totalUpfrontCost: number;
    monthlyAdvantage: number;
    months: number;
    yearsLabel: string;
    microcopy: string;
  };
  wealthPosition: {
    rentNet5: number;
    ownershipNet5: number;
    microcopy: string;
  };
  decisionScore: {
    buyNow: number;
    wait: number;
    microcopy: string;
  };
};

/**
 * Build all insight card inputs from a full engine outcome (same assumptions as consequence tracker).
 */
export function buildInsightPack(o: FinancialRealityOutcome): InsightPack {
  const n = o.numbers;
  const t = o.consequenceTracker;
  const midPrice = (n.buyingPowerLow + n.buyingPowerHigh) / 2;
  const rentMonthly = o.consequence.monthly_loss_estimate;

  const scenarios = t.scenarios;
  const now = scenarios[0]!;
  const wait12 = scenarios[2] ?? scenarios[1]!;

  const pitiMid = now.monthlyPayment;
  const downApprox = Math.min(midPrice * 0.2, 85_000);
  const loan0 = Math.max(0, now.purchasePrice - downApprox);
  const rate = 0.065;
  const firstInterest = loan0 * (rate / 12);
  const firstPrincipal = Math.max(0, monthlyPI(loan0, rate) - firstInterest);

  const usablePerDollar = pitiMid > 0 ? firstPrincipal / pitiMid : 0;
  const lostPerDollar = pitiMid > 0 ? (pitiMid - firstPrincipal) / pitiMid : 0;

  const interestFirst = firstInterest;
  const principalFirst = firstPrincipal;
  const piPortion = interestFirst + principalFirst;
  const toInterestPerDollar = piPortion > 0 ? interestFirst / piPortion : 0;
  const toPrincipalPerDollar = piPortion > 0 ? principalFirst / piPortion : 0;
  const wastedRatio = toInterestPerDollar + toPrincipalPerDollar > 0 ? toInterestPerDollar / (toInterestPerDollar + toPrincipalPerDollar) : 0.5;

  const monthsWaited = 12;
  const rentCost = Math.round(rentMonthly * monthsWaited);
  const priceIncrease = Math.max(0, wait12.purchasePrice - now.purchasePrice);
  const payDiff = wait12.monthlyPayment - now.monthlyPayment;
  const paymentLift60mo = Math.round(payDiff * 60);
  const totalPenalty = Math.round(rentCost + priceIncrease + paymentLift60mo);

  const payDelta = t.marketSensitivity.ratePlusHalf.paymentDiff;
  const rateImpact = {
    paymentDeltaMonthly: payDelta,
    line: t.marketSensitivity.ratePlusHalf.qualificationLine,
    microcopy: "Small rate moves add up when you stretch them over years.",
  };

  const closingCosts = Math.round(now.purchasePrice * 0.01);
  const totalUpfrontCost = Math.round(closingCosts + downApprox * 0.12);
  const lostToRentVsOwn = Math.max(0, pitiMid - firstPrincipal);
  const monthlyAdvantage = Math.max(50, rentMonthly - lostToRentVsOwn);
  const monthsRaw = totalUpfrontCost / monthlyAdvantage;
  const months = Math.max(6, Math.min(120, Math.round(monthsRaw)));
  const yearsLabel = months >= 12 ? `${(months / 12).toFixed(1)} years` : `${months} months`;

  const loanNow = loan0;
  const interest5 = sumInterestMonths(loanNow, rate, 60);
  const principal5 = sumPrincipalMonths(loanNow, rate, 60);
  const appreciation5 = now.purchasePrice * (Math.pow(1.022, 5) - 1);
  const equityApprox = Math.round(principal5 + appreciation5 * (downApprox / Math.max(now.purchasePrice, 1)));
  const ownershipNet5 = Math.round(equityApprox - interest5);
  const rentNet5 = -Math.round(rentMonthly * 12 * 5);

  const equityGain = now.equityGainedFiveYear;
  const totalCostDrag = t.totalMonthlyImpact * 12 * 5;
  const stability = 72 - Math.min(40, Math.abs(payDelta) * 2);
  const volatility = 35 + Math.min(30, priceIncrease / 1000);

  const buyRaw =
    0.38 * Math.min(100, equityGain / 450) +
    0.28 * Math.max(-85, -totalCostDrag / 2200) +
    0.22 * stability * 0.6 +
    0.12 * (-volatility);
  const waitRaw =
    0.38 * (equityGain * 0.25) / 500 +
    0.28 * (-rentCost / 900) +
    0.22 * (stability * 0.55) +
    0.12 * (-volatility * 1.05);

  function scaleTo100(x: number): number {
    const nrm = 48 + x * 7;
    return Math.max(22, Math.min(92, Math.round(nrm)));
  }

  const buyNow = scaleTo100(buyRaw);
  const waitScore = Math.max(24, Math.min(buyNow - 12, scaleTo100(waitRaw)));

  return {
    paymentTruth: {
      pitiRounded: Math.round(pitiMid),
      principalMonthly: Math.round(firstPrincipal),
      lostMonthly: Math.round(pitiMid - firstPrincipal),
      usablePerDollar: usablePerDollar,
      lostPerDollar: lostPerDollar,
      microcopy: "This is where most people lose money without realizing it.",
    },
    wastedMoney: {
      toInterestPerDollar: toInterestPerDollar,
      toPrincipalPerDollar: toPrincipalPerDollar,
      wastedRatio: wastedRatio,
      microcopy: "Early in the loan, interest eats most of your payment — equity builds slowly at first.",
    },
    timePenalty: {
      monthsWaited,
      rentCost,
      priceIncrease,
      paymentLift60mo,
      totalPenalty,
      microcopy: "This is the hidden cost of waiting.",
    },
    rateImpact,
    breakEven: {
      totalUpfrontCost,
      monthlyAdvantage: Math.round(monthlyAdvantage),
      months,
      yearsLabel,
      microcopy: "After this point, you’re ahead — not catching up.",
    },
    wealthPosition: {
      rentNet5,
      ownershipNet5,
      microcopy: "Same time. Completely different outcome.",
    },
    decisionScore: {
      buyNow,
      wait: waitScore,
      microcopy: "One path clearly puts you ahead — directional score, not a promise.",
    },
  };
}
