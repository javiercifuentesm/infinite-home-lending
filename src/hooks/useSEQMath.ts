/**
 * Self-Employed Mortgage Qualifier — pure calculation helpers.
 */

export type SEQInputs = {
  /** 1 | 2 | 3 — informational; not used in math yet */
  yearsEmp: number;
  bizType: string;
  cs: number;
  debts: number;
  dp: number;
  targetPrice: number;
  netY1: number;
  netY2: number;
  ab_dep: number;
  ab_dep2: number;
  ab_home: number;
  ab_loss: number;
  ab_meals: number;
  avgDeposits: number;
  bsPeriod: number;
  expFactor: string;
  customExpFactor: number;
  planReduction: number;
  taxRate: number;
};

export type TaxReturnResult = {
  qualifyingAnnual: number;
  qualifyingMonthly: number;
  baseIncome: number;
  totalAddback: number;
  declining: boolean;
  incomeMethod: string;
};

export type BankStatementResult = {
  qualifyingAnnual: number;
  qualifyingMonthly: number;
  expFactor: number;
  expFactorPct: number;
  incomeRatioPct: number;
  ratePremium: number;
};

export type PlanningResult = {
  planMonthly: number;
  planMaxPrice: number;
  planTaxCost: number;
};

export type SEQRunResult = {
  tx: TaxReturnResult;
  bs: BankStatementResult;
  txMaxLoan: number;
  txMaxPrice: number;
  txCanAfford: boolean;
  bsMaxLoan: number;
  bsMaxPrice: number;
  bsCanAfford: boolean;
  BASE_RATE: number;
  BS_RATE: number;
  DTI_MAX: number;
  TERM: number;
  planning: PlanningResult;
  planHomeDiff: number;
  txMaxDTIPmt: number;
  txMortgagePmt: number;
  cs: number;
  debts: number;
  dp: number;
  targetPrice: number;
};

/** Credit score bucket minimum → rate adjustment above base (percentage points as decimal fraction of rate number — spec uses 0.250 meaning +0.25% to rate) */
export function getRateAdj(creditScore: number): number {
  if (creditScore >= 760) return 0.0;
  if (creditScore >= 720) return 0.25;
  if (creditScore >= 680) return 0.5;
  if (creditScore >= 640) return 1.0;
  return 1.75;
}

export function monthlyPmt(principal: number, annualRate: number, termMonths: number): number {
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / termMonths;
  return (principal * (r * Math.pow(1 + r, termMonths))) / (Math.pow(1 + r, termMonths) - 1);
}

export function maxLoanFromDTI(
  monthlyIncome: number,
  debts: number,
  dtiMax: number,
  annualRate: number,
  termYears: number,
): number {
  const maxPmt = Math.max(0, monthlyIncome * dtiMax - debts);
  if (maxPmt <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  if (r === 0) return Math.round(maxPmt * n);
  const loan = (maxPmt * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
  return Math.max(0, Math.round(loan));
}

export function calcTaxReturn(inputs: Pick<
  SEQInputs,
  "netY1" | "netY2" | "ab_dep" | "ab_dep2" | "ab_home" | "ab_loss" | "ab_meals"
>): TaxReturnResult {
  const { netY1, netY2, ab_dep, ab_dep2, ab_home, ab_loss, ab_meals } = inputs;

  const totalAddback = ab_dep + ab_dep2 + ab_home + ab_loss + ab_meals * 0.5;
  const declining = netY2 < netY1;
  const baseIncome = declining ? netY2 : (netY1 + netY2) / 2;
  const qualifyingAnnual = baseIncome + totalAddback;
  const qualifyingMonthly = qualifyingAnnual / 12;

  return {
    qualifyingAnnual: Math.round(qualifyingAnnual),
    qualifyingMonthly: Math.round(qualifyingMonthly),
    baseIncome: Math.round(baseIncome),
    totalAddback: Math.round(totalAddback),
    declining,
    incomeMethod: declining ? "Year 2 only (declining)" : "2-year average",
  };
}

export function calcBankStatement(inputs: Pick<SEQInputs, "avgDeposits" | "expFactor" | "customExpFactor">): BankStatementResult {
  const { avgDeposits, expFactor, customExpFactor } = inputs;

  const ef =
    expFactor === "custom" ? customExpFactor / 100 : parseFloat(expFactor);

  const incomeRatio = 1 - ef;
  const qualifyingMonthly = Math.round(Math.max(0, avgDeposits * incomeRatio));
  const qualifyingAnnual = qualifyingMonthly * 12;
  const expFactorPct = Math.round(ef * 100);

  return {
    qualifyingAnnual,
    qualifyingMonthly,
    expFactor: ef,
    expFactorPct,
    incomeRatioPct: Math.round(incomeRatio * 100),
    ratePremium: 0.75,
  };
}

export function calcPlanning(
  txQualifyingMonthly: number,
  planReduction: number,
  taxRate: number,
  debts: number,
  baseRate: number,
  dp: number,
  termYears: number,
): PlanningResult {
  const dtiMax = 0.43;
  const planAddMonthly = planReduction / 12;
  const planMonthly = txQualifyingMonthly + planAddMonthly;
  const planMaxLoan = maxLoanFromDTI(planMonthly, debts, dtiMax, baseRate, termYears);
  const dpFrac = Math.min(0.97, Math.max(0.03, dp / 100));
  const planMaxPrice = Math.round(planMaxLoan / (1 - dpFrac));
  const planTaxCost = Math.round(planReduction * (taxRate / 100));

  return {
    planMonthly: Math.round(planMonthly),
    planMaxPrice: Math.max(0, planMaxPrice),
    planTaxCost,
  };
}

export function runCalculation(inputs: SEQInputs): SEQRunResult {
  const {
    cs,
    debts,
    dp,
    targetPrice,
    netY1,
    netY2,
    ab_dep,
    ab_dep2,
    ab_home,
    ab_loss,
    ab_meals,
    avgDeposits,
    expFactor,
    customExpFactor,
    planReduction,
    taxRate,
  } = inputs;

  const BASE_RATE = 6.875 + getRateAdj(cs);
  const BS_RATE = BASE_RATE + 0.75;
  const DTI_MAX = 0.43;
  const TERM = 30;

  const tx = calcTaxReturn({ netY1, netY2, ab_dep, ab_dep2, ab_home, ab_loss, ab_meals });
  const txMaxLoan = maxLoanFromDTI(tx.qualifyingMonthly, debts, DTI_MAX, BASE_RATE, TERM);
  const dpFrac = Math.min(0.97, Math.max(0.03, dp / 100));
  const txMaxPrice = Math.max(0, Math.round(txMaxLoan / (1 - dpFrac)));
  const txCanAfford = txMaxPrice >= targetPrice;

  const bs = calcBankStatement({ avgDeposits, expFactor, customExpFactor });
  const bsMaxLoan = maxLoanFromDTI(bs.qualifyingMonthly, debts, DTI_MAX, BS_RATE, TERM);
  const bsMaxPrice = Math.max(0, Math.round(bsMaxLoan / (1 - dpFrac)));
  const bsCanAfford = bsMaxPrice >= targetPrice;

  const planning = calcPlanning(
    tx.qualifyingMonthly,
    planReduction,
    taxRate,
    debts,
    BASE_RATE,
    dp,
    TERM,
  );
  const planHomeDiff = planning.planMaxPrice - txMaxPrice;

  const txMaxDTIPmt = Math.round(tx.qualifyingMonthly * DTI_MAX);
  const txMortgagePmt = Math.max(0, txMaxDTIPmt - debts);

  return {
    tx,
    bs,
    txMaxLoan,
    txMaxPrice,
    txCanAfford,
    bsMaxLoan,
    bsMaxPrice,
    bsCanAfford,
    BASE_RATE,
    BS_RATE,
    DTI_MAX,
    TERM,
    planning,
    planHomeDiff,
    txMaxDTIPmt,
    txMortgagePmt,
    cs,
    debts,
    dp,
    targetPrice,
  };
}
