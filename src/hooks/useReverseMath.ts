/** Educational HECM-style estimates — not a lender quote. */

export type ReverseInputs = {
  homeVal: number;
  mortBal: number;
  age: number;
  coAge: number | null;
  intRate: number;
  retIncome: number;
  retExpenses: number;
  appr: number;
};

export type YearlyRow = { yr: number; homeValue: number; loanBalance: number; equity: number };

export type ReverseResult = {
  eligible: boolean;
  effectiveAge: number;
  grossPL: number;
  closingCosts: number;
  mipUpfront: number;
  netPL: number;
  tenurePayment: number;
  termPayment: number;
  locGrowthRate: number;
  incomeGap: number;
  yearlyData: YearlyRow[];
  heirData: { yr: number; equity: number }[];
  yr10: { homeValue: number; loanBalance: number; equity: number };
  locAt10: number;
  claimedVal: number;
  initialLoanBalance: number;
  loanGrowthRate: number;
};

const BASE_PLF: Record<number, number> = {
  62: 0.31,
  63: 0.32,
  64: 0.33,
  65: 0.34,
  66: 0.35,
  67: 0.36,
  68: 0.37,
  69: 0.38,
  70: 0.39,
  71: 0.4,
  72: 0.41,
  73: 0.42,
  74: 0.43,
  75: 0.443,
  76: 0.456,
  77: 0.469,
  78: 0.482,
  79: 0.495,
  80: 0.508,
  81: 0.521,
  82: 0.534,
  83: 0.547,
  84: 0.56,
  85: 0.57,
  86: 0.58,
  87: 0.59,
  88: 0.6,
  89: 0.61,
  90: 0.618,
  91: 0.626,
  92: 0.634,
  93: 0.642,
  94: 0.649,
  95: 0.656,
};

export function getPLF(age: number, expectedRate: number): number {
  const clampedAge = Math.min(Math.max(Math.round(age), 62), 95);
  let plf = BASE_PLF[clampedAge] ?? 0.39;
  const rateAdj = (expectedRate - 5.0) * -0.018;
  return Math.max(0.1, Math.min(0.75, plf + rateAdj));
}

export function fmt(n: number): string {
  return "$" + Math.abs(Math.round(n)).toLocaleString("en-US");
}

export function fmtK(n: number): string {
  const a = Math.abs(n);
  if (a >= 1_000_000) return "$" + (a / 1_000_000).toFixed(2) + "M";
  if (a >= 1000) return "$" + (a / 1000).toFixed(1) + "k";
  return "$" + Math.round(n);
}

export function chartYFmt(v: number): string {
  const a = Math.abs(v);
  if (a >= 1_000_000) return "$" + (v / 1_000_000).toFixed(1) + "M";
  if (a >= 1000) return "$" + Math.round(v / 1000) + "k";
  return "$" + Math.round(v);
}

export const HECM_LIMIT_2026 = 1_209_750;

export function defaultReverseInputs(): ReverseInputs {
  return {
    homeVal: 550000,
    mortBal: 0,
    age: 70,
    coAge: null,
    intRate: 6.5,
    retIncome: 3200,
    retExpenses: 4500,
    appr: 3.5,
  };
}

export function runCalculation(inputs: ReverseInputs): ReverseResult {
  const homeVal = Math.max(0, inputs.homeVal);
  const mortBal = Math.max(0, inputs.mortBal);
  const age = Math.round(inputs.age);
  const coAge = inputs.coAge;
  const intRate = Number.isFinite(inputs.intRate) ? inputs.intRate : 6.5;
  const retIncome = Math.max(0, inputs.retIncome);
  const retExpenses = Math.max(0, inputs.retExpenses);
  const appr = Number.isFinite(inputs.appr) ? inputs.appr : 3.5;

  const effectiveAge = coAge != null && coAge > 0 ? Math.min(age, coAge) : age;

  const claimedVal = Math.min(homeVal, HECM_LIMIT_2026);
  const plf = getPLF(effectiveAge, intRate);
  const grossPL = Math.round(claimedVal * plf);

  const origFee = Math.min(6000, Math.max(2500, homeVal * 0.02));
  const closingCosts = Math.round(homeVal * 0.03 + origFee);
  const mipUpfront = Math.round(claimedVal * 0.02);
  const netPL = Math.max(0, grossPL - mortBal - closingCosts - mipUpfront);

  const annualMipRate = 0.005;
  const eligible =
    age >= 62 &&
    homeVal > 0 &&
    mortBal < grossPL * 0.6 &&
    (coAge == null || coAge >= 62);

  const monthlyRate = intRate / 100 / 12;
  const monthsTo100 = Math.max(1, (100 - effectiveAge) * 12);
  const tenurePayment =
    netPL > 0 && monthlyRate > 0
      ? Math.round(
          (netPL * (monthlyRate * Math.pow(1 + monthlyRate, monthsTo100))) /
            (Math.pow(1 + monthlyRate, monthsTo100) - 1),
        )
      : 0;

  const termMonths = 120;
  const termPayment =
    netPL > 0 && monthlyRate > 0
      ? Math.round(
          (netPL * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) / (Math.pow(1 + monthlyRate, termMonths) - 1),
        )
      : 0;

  const locGrowthRate = intRate / 100 + annualMipRate;

  const incomeGap = Math.round(retExpenses - retIncome);

  const apprRate = appr / 100;
  const loanGrowthRate = intRate / 100 + annualMipRate;
  const initialLoanBalance = mortBal + closingCosts + mipUpfront;

  const yearlyData: YearlyRow[] = Array.from({ length: 20 }, (_, i) => {
    const yr = i + 1;
    const homeValue = Math.round(homeVal * Math.pow(1 + apprRate, yr));
    const loanBalance = Math.round(initialLoanBalance * Math.pow(1 + loanGrowthRate, yr));
    const equity = Math.max(0, homeValue - loanBalance);
    return { yr, homeValue, loanBalance, equity };
  });

  const heirYears = [5, 10, 15, 20];
  const heirData = heirYears.map((y) => ({
    yr: y,
    equity: yearlyData[y - 1]?.equity ?? 0,
  }));

  const yr10 = yearlyData[9] ?? { homeValue: 0, loanBalance: 0, equity: 0 };

  const locAt10 = Math.round(netPL * Math.pow(1 + locGrowthRate, 10));

  return {
    eligible,
    effectiveAge,
    grossPL,
    closingCosts,
    mipUpfront,
    netPL,
    tenurePayment,
    termPayment,
    locGrowthRate,
    incomeGap,
    yearlyData,
    heirData,
    yr10,
    locAt10,
    claimedVal,
    initialLoanBalance,
    loanGrowthRate,
  };
}
