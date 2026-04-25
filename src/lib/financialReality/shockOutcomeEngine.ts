/**
 * Shock math — decision framing, not a calculator. Directional only.
 */

import type { FinancialRealityOutcome } from "./engine";

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
    balance -= payment - interest;
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

export type ShockImpactLevel = "LOW" | "MEDIUM" | "HIGH";

export type ShockOutcome = {
  paymentDistortion: {
    looksLike: number;
    actuallyYours: number;
    trueCost: number;
    headline: string;
    punchline: string;
    microcopy: string;
  };
  silentLoss: {
    monthlyLoss: number;
    rentGone: number;
    lostEquity: number;
    rateImpact: number;
    totalLine: string;
    microcopy: string;
  };
  /** loss1yr = monthlyLoss*12; loss3yr = loss1yr*3*1.2; loss5yr = loss1yr*5*1.5 */
  escalatingLoss: {
    loss1yr: number;
    loss3yr: number;
    loss5yr: number;
    headline: string;
    subhead: string;
    punchline: string;
  };
  /** totalDamage = rentPaid + lostEquity + extraInterest (5 yr, illustrative) */
  totalDamage: {
    total: number;
    rentPaid: number;
    lostEquity: number;
    extraInterest: number;
    headline: string;
    punchline: string;
  };
  missedWealth: {
    buyTodayNet: number;
    waitNet: number;
    swing: number;
    headlineBuy: string;
    headlineWait: string;
    punchlineSwing: string;
  };
  timeIsCost: {
    monthlyLoss: number;
    lossPerDay: number;
    headline: string;
    punchline: string;
  };
  decisionPressure: {
    headline: string;
    buyLabel: string;
    buyOutcome: string;
    waitLabel: string;
    waitOutcome: string;
    punchline: string;
  };
  /** First read: two scenarios, one gap (5 yr model). */
  sideBySideTruth: {
    horizonYears: number;
    rentWaitOutcome: number;
    buyNowOutcome: number;
    difference: number;
  };
  /** Single clear outcome — BUY vs WAIT from model net positions. */
  winnerCard: {
    winner: "BUY" | "WAIT";
    buyNet: number;
    waitNet: number;
    advantageDollars: number;
    equityBuilt5yr: number;
    lossStackAvoided: number;
  };
  impactLevel: ShockImpactLevel;
  impactLabel: string;
  decisionScore: number;
};

function impactFromMonthlyLoss(monthlyLoss: number): { level: ShockImpactLevel; label: string } {
  const high = 2800;
  const mid = 1400;
  if (monthlyLoss >= high) return { level: "HIGH", label: "High" };
  if (monthlyLoss >= mid) return { level: "MEDIUM", label: "Medium" };
  return { level: "LOW", label: "Low" };
}

export function buildShockOutcome(o: FinancialRealityOutcome): ShockOutcome {
  const t = o.consequenceTracker;
  const rentMonthly = o.consequence.monthly_loss_estimate;
  const scenarios = t.scenarios;
  const now = scenarios[0]!;
  const wait12 = scenarios[2] ?? scenarios[1]!;

  const homeValue = now.purchasePrice;
  const appreciationRate = 0.024;
  const rate = 0.065;
  const downApprox = Math.min(homeValue * 0.2, 85_000);
  const loan0 = Math.max(0, homeValue - downApprox);

  const monthlyPayment = now.monthlyPayment;
  const firstInterest = loan0 * (rate / 12);
  const firstPrincipal = Math.max(0, monthlyPI(loan0, rate) - firstInterest);
  const trueCost = Math.round(monthlyPayment - firstPrincipal);

  const paymentDistortion = {
    looksLike: Math.round(monthlyPayment),
    actuallyYours: Math.round(firstPrincipal),
    trueCost,
    headline: "Your payment is misleading.",
    punchline: "Most of your money isn’t building anything.",
    microcopy: "Interest + taxes + insurance walk out the door — principal is what stays.",
  };

  const rentGone = Math.round(rentMonthly);
  const lostEquity = Math.round(t.monthlyMissedEquity);
  const rateImpact = Math.max(0, Math.round(t.monthlyPriceDrift + (wait12.monthlyPayment - now.monthlyPayment) * 0.25));
  const monthlyLoss = Math.round(rentGone + lostEquity + rateImpact);

  const silentLoss = {
    monthlyLoss,
    rentGone,
    lostEquity,
    rateImpact,
    totalLine: `That’s ${formatMoney(monthlyLoss)}/month in real impact`,
    microcopy: "Rent + missed equity + drift — compounding on the sideline.",
  };

  const loss1yr = Math.round(monthlyLoss * 12);
  const loss3yr = Math.round(loss1yr * 3 * 1.2);
  const loss5yr = Math.round(loss1yr * 5 * 1.5);

  const escalatingLoss = {
    loss1yr,
    loss3yr,
    loss5yr,
    headline: "Waiting doesn’t cost you the same every year…",
    subhead: "The damage stacks faster than it looks.",
    punchline: "It gets more expensive the longer you wait.",
  };

  const principal5 = sumPrincipalMonths(loan0, rate, 60);
  const equityGrowth5yr = Math.round(homeValue * appreciationRate * 5);
  const lostEquity5yr = Math.round(equityGrowth5yr + principal5);
  const interest5 = sumInterestMonths(loan0, rate, 60);
  const rentPaid = Math.round(rentMonthly * 60);
  const extraInterest = Math.round(interest5);
  const totalDamageNum = Math.round(rentPaid + lostEquity5yr + extraInterest);

  const totalDamage = {
    total: totalDamageNum,
    rentPaid,
    lostEquity: lostEquity5yr,
    extraInterest,
    headline: "Your total cost of waiting…",
    punchline: "This is the price of doing nothing.",
  };

  const appreciation5 = homeValue * (Math.pow(1 + appreciationRate, 5) - 1);
  const equityApprox = Math.round(principal5 + appreciation5 * (downApprox / Math.max(homeValue, 1)));
  const ownershipNet = Math.round(equityApprox - interest5);
  const rentNet = -Math.round(rentMonthly * 12 * 5);
  const swing = Math.abs(ownershipNet - rentNet);

  const missedWealth = {
    buyTodayNet: ownershipNet,
    waitNet: rentNet,
    swing: Math.round(swing),
    headlineBuy: "If you buy today…",
    headlineWait: "If you wait…",
    punchlineSwing: "That’s a $X swing.",
  };

  const horizonYears = 5;
  const sideBySideTruth = {
    horizonYears,
    rentWaitOutcome: rentNet,
    buyNowOutcome: ownershipNet,
    difference: Math.round(swing),
  };

  const buyWins = ownershipNet > rentNet;
  const advantageDollars = Math.round(Math.abs(ownershipNet - rentNet));
  const equityBuilt5yr = principal5 + equityGrowth5yr;
  const lossStackAvoided = Math.round(rentPaid + lostEquity5yr);

  const winnerCard = {
    winner: buyWins ? ("BUY" as const) : ("WAIT" as const),
    buyNet: ownershipNet,
    waitNet: rentNet,
    advantageDollars,
    equityBuilt5yr: Math.round(equityBuilt5yr),
    lossStackAvoided,
  };

  const lossPerDay = Math.round(monthlyLoss / (365 / 12));

  const timeIsCost = {
    monthlyLoss,
    lossPerDay,
    headline: "Every month you wait…",
    punchline: "That’s the daily cost of staying on the sideline.",
  };

  const decisionPressure = {
    headline: "This is what your decision looks like:",
    buyLabel: "Buy now",
    buyOutcome: "You move forward",
    waitLabel: "Wait",
    waitOutcome: "You fall behind",
    punchline: "The numbers already picked a direction — you still get to choose.",
  };

  const equityGain = now.equityGainedFiveYear;
  const buyRaw =
    0.38 * Math.min(100, equityGain / 450) +
    0.28 * Math.max(-85, (-t.totalMonthlyImpact * 12 * 5) / 2200) +
    0.22 * (72 - Math.min(40, Math.abs(t.marketSensitivity.ratePlusHalf.paymentDiff) * 2)) * 0.55;
  const decisionScore = Math.max(22, Math.min(92, Math.round(48 + buyRaw * 7)));

  const { level: impactLevel, label: impactLabel } = impactFromMonthlyLoss(monthlyLoss);

  return {
    paymentDistortion,
    silentLoss,
    escalatingLoss,
    totalDamage,
    missedWealth,
    timeIsCost,
    decisionPressure,
    sideBySideTruth,
    winnerCard,
    impactLevel,
    impactLabel,
    decisionScore,
  };
}

function formatMoney(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}
