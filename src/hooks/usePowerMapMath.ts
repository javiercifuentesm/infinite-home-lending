import { MARKETS, type MarketRecord } from "../data/mdcvaMarkets";

/** 2026 approximate rate tiers by FICO score */
export const RATE_TABLE: Record<number, number> = {
  580: 8.375,
  620: 7.875,
  640: 7.5,
  660: 7.25,
  680: 7.0,
  700: 6.875,
  720: 6.75,
  740: 6.5,
};

export function getRate(creditScore: number): number {
  const keys = Object.keys(RATE_TABLE)
    .map(Number)
    .sort((a, b) => b - a);
  for (const k of keys) {
    if (creditScore >= k) return RATE_TABLE[k]!;
  }
  return 8.375;
}

/** Max loan from DTI 43% on 30-year fixed (reverse amortization). */
export function maxLoanFromDTI(annualIncome: number, monthlyDebts: number, annualRate: number): number {
  const monthlyIncome = annualIncome / 12;
  const maxPmt = monthlyIncome * 0.43 - monthlyDebts;
  if (maxPmt <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = 360;
  if (r === 0) return Math.round(maxPmt * n);
  return Math.round((maxPmt * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n)));
}

/** 5% down floor: price = loan / 0.95 */
export function maxHomePrice(loanAmount: number, _savings: number): number {
  const dpPct = 0.05;
  return Math.round(loanAmount / (1 - dpPct));
}

export const ACCESSIBILITY_BUFFER = 1.05;

export type MarketStatus = "locked" | "unlocked" | "improved";

export function getMarketStatus(
  currentPower: number,
  improvedPower: number,
  marketPrice: number,
): MarketStatus {
  const threshold = marketPrice * ACCESSIBILITY_BUFFER;
  if (currentPower >= threshold) return "unlocked";
  if (improvedPower >= threshold) return "improved";
  return "locked";
}

export type PowerMapInputs = {
  income: number;
  debts: number;
  scoreBase: number;
  savings: number;
  savingsRate: number;
  creditImp: number;
  debtPayoff: number;
  savingsBoost: number;
  incomeGrowth: number;
};

export function runCalculation(inputs: PowerMapInputs) {
  const { income, debts, scoreBase, savings, savingsRate, creditImp, debtPayoff, savingsBoost, incomeGrowth } = inputs;

  const baseRate = getRate(scoreBase);
  const currentLoan = maxLoanFromDTI(income, debts, baseRate);
  const currentPrice = maxHomePrice(currentLoan, savings);

  const impScore = Math.min(760, scoreBase + creditImp);
  const impRate = getRate(impScore);
  const impDebts = Math.max(0, debts - debtPayoff);
  const impIncome = income + incomeGrowth;
  const impLoan = maxLoanFromDTI(impIncome, impDebts, impRate);
  const improvedPrice = maxHomePrice(impLoan, savings);
  const powerGain = improvedPrice - currentPrice;

  function priceAtPct(pct: number): number {
    const sScore = Math.min(760, scoreBase + Math.round(creditImp * pct));
    const sRate = getRate(sScore);
    const sDebts = Math.max(0, debts - Math.round(debtPayoff * pct));
    const sIncome = income + Math.round(incomeGrowth * pct);
    const sLoan = maxLoanFromDTI(sIncome, sDebts, sRate);
    return maxHomePrice(sLoan, savings);
  }

  const q90Price = priceAtPct(0.25);
  const m6Price = priceAtPct(0.5);
  const m12Price = improvedPrice;

  const totalMonthlySavings = savingsRate + savingsBoost;
  const q90Savings = Math.round(savings + totalMonthlySavings * 3);
  const m6Savings = Math.round(savings + totalMonthlySavings * 6);
  const m12Savings = Math.round(savings + totalMonthlySavings * 12);

  const creditImpactLoan = maxLoanFromDTI(income, debts, impRate) - currentLoan;
  const creditImpactPrice = Math.round(creditImpactLoan / 0.95);

  const debtImpactLoan = maxLoanFromDTI(income, impDebts, baseRate) - currentLoan;
  const debtImpactPrice = Math.round(debtImpactLoan / 0.95);

  const incomeImpactLoan = maxLoanFromDTI(impIncome, debts, baseRate) - currentLoan;
  const incomeImpactPrice = Math.round(incomeImpactLoan / 0.95);

  const marketsWithStatus = MARKETS.map((m: MarketRecord) => ({
    ...m,
    status: getMarketStatus(currentPrice, improvedPrice, m.price),
  }));

  const unlockedCount = marketsWithStatus.filter((m) => m.status === "unlocked").length;
  const improvedCount = marketsWithStatus.filter((m) => m.status === "improved").length;
  const lockedCount = marketsWithStatus.filter((m) => m.status === "locked").length;

  return {
    baseRate,
    currentLoan,
    currentPrice,
    impScore,
    impRate,
    impDebts,
    impIncome,
    impLoan,
    improvedPrice,
    powerGain,
    q90Price,
    m6Price,
    m12Price,
    q90Savings,
    m6Savings,
    m12Savings,
    totalMonthlySavings,
    creditImpactPrice: Math.max(0, creditImpactPrice),
    debtImpactPrice: Math.max(0, debtImpactPrice),
    incomeImpactPrice: Math.max(0, incomeImpactPrice),
    marketsWithStatus,
    unlockedCount,
    improvedCount,
    lockedCount,
    income,
    debts,
    scoreBase,
    savings,
    savingsRate,
    creditImp,
    debtPayoff,
    savingsBoost,
    incomeGrowth,
  };
}

export type PowerMapResults = ReturnType<typeof runCalculation>;

export function fmtK(n: number): string {
  const sign = n < 0 ? "−" : "";
  return sign + "$" + Math.round(Math.abs(n)).toLocaleString("en-US");
}

export function fmt(n: number): string {
  return "$" + Math.round(Math.abs(n)).toLocaleString("en-US");
}
