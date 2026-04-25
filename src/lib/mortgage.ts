/** Pure mortgage math for the Loan Structure Simulator */

export function monthlyPI(principal: number, annualRatePct: number, termMonths: number): number {
  if (principal <= 0 || termMonths <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / termMonths;
  const factor = Math.pow(1 + r, termMonths);
  return (principal * (r * factor)) / (factor - 1);
}

export type PaymentBreakdown = {
  principalAndInterest: number;
  propertyTax: number;
  insurance: number;
  total: number;
  loanAmount: number;
};

export function computePaymentScenario(input: {
  price: number;
  downPercent: number;
  rate: number;
  termYears: number;
  annualTax: number;
  annualInsurance: number;
}): PaymentBreakdown {
  const loan = Math.max(0, input.price * (1 - input.downPercent / 100));
  const n = Math.round(input.termYears * 12);
  const pi = monthlyPI(loan, input.rate, n);
  const taxMo = input.annualTax / 12;
  const insMo = input.annualInsurance / 12;
  return {
    principalAndInterest: pi,
    propertyTax: taxMo,
    insurance: insMo,
    total: pi + taxMo + insMo,
    loanAmount: loan,
  };
}

/** Max purchase price given a target total monthly PITI; tax & insurance scale with value (annual %). */
export function computeMaxAffordablePrice(input: {
  targetTotalMonthly: number;
  downPercent: number;
  rate: number;
  termYears: number;
  taxPctOfValueAnnual: number;
  insurancePctOfValueAnnual: number;
}): number {
  const { targetTotalMonthly, downPercent, rate, termYears } = input;
  const n = Math.round(termYears * 12);
  const d = downPercent / 100;
  const tp = input.taxPctOfValueAnnual / 100;
  const ip = input.insurancePctOfValueAnnual / 100;

  function totalAtPrice(P: number): number {
    if (P <= 0) return 0;
    const loan = P * (1 - d);
    const pi = monthlyPI(loan, rate, n);
    const tax = (P * tp) / 12;
    const ins = (P * ip) / 12;
    return pi + tax + ins;
  }

  let lo = 25_000;
  let hi = 50_000_000;
  if (totalAtPrice(hi) <= targetTotalMonthly) return Math.round(hi);
  if (totalAtPrice(lo) > targetTotalMonthly) return 0;

  for (let i = 0; i < 90; i++) {
    const mid = (lo + hi) / 2;
    if (totalAtPrice(mid) <= targetTotalMonthly) lo = mid;
    else hi = mid;
  }
  return Math.round(lo);
}

export function breakdownFromPrice(
  price: number,
  input: {
    downPercent: number;
    rate: number;
    termYears: number;
    taxPctOfValueAnnual: number;
    insurancePctOfValueAnnual: number;
  }
): PaymentBreakdown {
  const annualTax = price * (input.taxPctOfValueAnnual / 100);
  const annualInsurance = price * (input.insurancePctOfValueAnnual / 100);
  return computePaymentScenario({
    price,
    downPercent: input.downPercent,
    rate: input.rate,
    termYears: input.termYears,
    annualTax,
    annualInsurance,
  });
}

/** UI time-horizon keys for the Loan Structure Simulator (years). */
export type SimulatorHorizonYears = 5 | 7 | 10;

/**
 * Calendar months modeled for each selector. "10+ years" is the first **10 years** (120 payments),
 * not an open-ended horizon.
 */
export const SIMULATOR_HORIZON_MONTHS: Record<SimulatorHorizonYears, number> = {
  5: 60,
  7: 84,
  10: 120,
};

/** Payments in the analysis window: first `horizonMonths` months, capped by loan term. */
export function effectiveAnalysisMonths(horizonMonths: number, termMonths: number): number {
  const h = Math.max(0, Math.floor(horizonMonths));
  const t = Math.max(0, Math.floor(termMonths));
  return Math.min(h, t);
}

export type HorizonSlice = {
  interestPaid: number;
  principalPaid: number;
  remainingBalance: number;
};

/**
 * P&I split for the Nth scheduled payment (1-based), standard fixed-rate amortization.
 * When N exceeds the term, uses the final payment month.
 */
export function paymentSplitForNthPayment(
  principal: number,
  annualRatePct: number,
  termMonths: number,
  paymentOneBased: number
): { interest: number; principal: number } {
  if (principal <= 0 || termMonths <= 0 || paymentOneBased < 1) {
    return { interest: 0, principal: 0 };
  }
  const n = Math.min(Math.floor(paymentOneBased), termMonths);
  const r = annualRatePct / 100 / 12;
  const payment = monthlyPI(principal, annualRatePct, termMonths);
  let balance = principal;
  for (let m = 1; m < n; m++) {
    const interest = r === 0 ? 0 : balance * r;
    const principalPart = payment - interest;
    balance -= principalPart;
    balance = Math.max(0, balance);
  }
  const interest = r === 0 ? 0 : balance * r;
  const principalPart = payment - interest;
  return { interest, principal: Math.max(0, principalPart) };
}

export type AmortizationScheduleRow = {
  paymentNumber: number;
  /** Full P&I payment (fixed for level-pay loan). */
  paymentAmount: number;
  principal: number;
  interest: number;
  /** Loan balance after this payment. */
  remainingBalance: number;
};

/**
 * Month-by-month P&I schedule for months 1..horizon (capped by term). No taxes/insurance.
 */
export function buildAmortizationSchedule(
  principal: number,
  annualRatePct: number,
  termMonths: number,
  horizonMonths: number
): AmortizationScheduleRow[] {
  const months = effectiveAnalysisMonths(horizonMonths, termMonths);
  if (principal <= 0 || months <= 0) return [];

  const r = annualRatePct / 100 / 12;
  const payment = monthlyPI(principal, annualRatePct, termMonths);
  let balance = principal;
  const rows: AmortizationScheduleRow[] = [];

  for (let m = 1; m <= months; m++) {
    const interest = r === 0 ? 0 : balance * r;
    const principalPart = payment - interest;
    const newBalance = Math.max(0, balance - principalPart);
    rows.push({
      paymentNumber: m,
      paymentAmount: payment,
      principal: principalPart,
      interest,
      remainingBalance: newBalance,
    });
    balance = newBalance;
  }

  return rows;
}

/** Cumulative interest & principal over the first `horizonMonths` payments (P&I only). */
export function cumulativePIOverHorizon(
  principal: number,
  annualRatePct: number,
  termMonths: number,
  horizonMonths: number
): HorizonSlice {
  if (principal <= 0 || termMonths <= 0) {
    return { interestPaid: 0, principalPaid: 0, remainingBalance: 0 };
  }
  const r = annualRatePct / 100 / 12;
  const payment = monthlyPI(principal, annualRatePct, termMonths);
  let balance = principal;
  let interestPaid = 0;
  let principalPaid = 0;
  const months = effectiveAnalysisMonths(horizonMonths, termMonths);

  for (let m = 0; m < months; m++) {
    const interest = r === 0 ? 0 : balance * r;
    const principalPart = payment - interest;
    interestPaid += interest;
    principalPaid += principalPart;
    balance -= principalPart;
  }

  return {
    interestPaid,
    principalPaid,
    remainingBalance: Math.max(0, balance),
  };
}

/** Cumulative view after `horizonMonths` — P&I from amortization plus taxes/insurance outflow. */
export type PositionSnapshot = {
  /** PITI: mortgage payments + taxes + insurance over the horizon */
  totalHousingOutflow: number;
  /** P&I only (principal + interest portions) */
  totalPiPaid: number;
  interestPaid: number;
  principalPaid: number;
  remainingBalance: number;
  /** Same as interest over period — explicit “cost of borrowing” for the loan */
  netBorrowingCost: number;
};

export function buildPositionSnapshot(
  slice: HorizonSlice,
  result: PaymentBreakdown,
  horizonMonths: number,
  termMonths: number
): PositionSnapshot {
  /** Must match the P&I window in `cumulativePIOverHorizon` so totals aren’t mixed across different month counts. */
  const months = effectiveAnalysisMonths(horizonMonths, termMonths);
  const totalPiPaid = slice.principalPaid + slice.interestPaid;
  const taxInsOutflow = (result.propertyTax + result.insurance) * months;
  return {
    totalHousingOutflow: totalPiPaid + taxInsOutflow,
    totalPiPaid,
    interestPaid: slice.interestPaid,
    principalPaid: slice.principalPaid,
    remainingBalance: slice.remainingBalance,
    netBorrowingCost: slice.interestPaid,
  };
}
