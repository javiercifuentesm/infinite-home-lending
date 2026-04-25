/**
 * v2 decision engine — buy path vs rent path, wait penalty, break-even, future shock.
 * Single source for Decision Experience components.
 */

export const DOWN_PCT = 0.2;
export const PITI_FACTOR = 1.32;
export const TERM_MONTHS = 360;
export const APPRECIATION_ANNUAL = 0.024;
export const RENT_INFLATION_ANNUAL = 0.025;
export const OPPORTUNITY_ANNUAL = 0.04;
export const PRICE_DRIFT_WAIT = 0.025;
export const RATE_BUMP_WAIT = 0.0025;
/** Future shock headline uses this many years */
export const FUTURE_SHOCK_WAIT_YEARS = 2;

export type DecisionEngineV2Input = {
  purchasePrice: number;
  monthlyRent: number;
  interestRateAnnual: number;
  yearsHorizon: number;
  /** If false, renter keeps down payment idle (no market growth). */
  includeInvestmentOpportunity: boolean;
};

export type ImpactLevel = "low" | "medium" | "high";

export type PathColumn = {
  monthlyHousingCost: number;
  equityGained: number;
  netPosition: number;
};

export type DecisionEngineV2 = {
  buysAhead: boolean;
  /** Primary headline amount (always positive in display layer) */
  headlineAmount: number;
  /** Illustrative cumulative drag if you delay ~2 years (rent + opportunity). */
  twoYearWaitCostTotal: number;
  /** Years used in “Wait X years” copy */
  waitLabelYears: number;
  buyer: {
    monthlyPi: number;
    monthlyTaxInsurance: number;
    monthlyPiti: number;
    equityEnd: number;
    principalPaidHorizon: number;
    appreciationGain: number;
    totalInterestPaid: number;
  };
  renter: {
    avgMonthlyRent: number;
    totalRentPaid: number;
    investmentEnd: number;
  };
  comparison: {
    buyNow: PathColumn;
    waitRent: PathColumn;
    difference: number;
    pctDifference: number;
  };
  waitPenalty: {
    monthlyTotal: number;
    rent: number;
    lostEquityMonthly: number;
    appreciationLossMonthly: number;
  };
  futureShock: {
    waitYears: number;
    priceIncrease: number;
    paymentIncreaseMonthly: number;
  };
  breakEvenYears: number | null;
  impact: ImpactLevel;
  totalCostDelta: number;
};

function monthlyPI(loanAmount: number, annualRate: number, termMonths: number): number {
  const r = annualRate / 12;
  if (loanAmount <= 0) return 0;
  if (r === 0) return loanAmount / termMonths;
  const factor = Math.pow(1 + r, termMonths);
  return (loanAmount * (r * factor)) / (factor - 1);
}

function amortizeThroughMonths(
  loanAmount: number,
  annualRate: number,
  termMonths: number,
  payMonths: number,
): { balance: number; principalSum: number; interestSum: number; principalByMonth: number[] } {
  const pmt = monthlyPI(loanAmount, annualRate, termMonths);
  const r = annualRate / 12;
  let balance = loanAmount;
  let principalSum = 0;
  let interestSum = 0;
  const principalByMonth: number[] = [];
  const n = Math.min(payMonths, termMonths);
  for (let i = 0; i < n; i++) {
    const interest = balance * r;
    const principal = pmt - interest;
    principalSum += principal;
    interestSum += interest;
    principalByMonth.push(principal);
    balance -= principal;
  }
  return { balance, principalSum, interestSum, principalByMonth };
}

function roundMoney(n: number): number {
  return Math.round(n);
}

function totalRentThroughYears(monthlyRent: number, years: number): number {
  let t = 0;
  for (let y = 0; y < years; y++) {
    t += monthlyRent * 12 * Math.pow(1 + RENT_INFLATION_ANNUAL, y);
  }
  return t;
}

function buyerRenterNetAtYear(
  purchasePrice: number,
  monthlyRent: number,
  interestRateAnnual: number,
  year: number,
  includeInvestment: boolean,
): { buyerNet: number; renterNet: number } {
  const down = purchasePrice * DOWN_PCT;
  const loan = purchasePrice - down;
  const months = Math.min(Math.round(year * 12), TERM_MONTHS);
  const amort = amortizeThroughMonths(loan, interestRateAnnual, TERM_MONTHS, months);
  const homeVal = purchasePrice * Math.pow(1 + APPRECIATION_ANNUAL, year);
  const buyerNet = homeVal - amort.balance;
  const rentPaid = totalRentThroughYears(monthlyRent, year);
  const inv = includeInvestment ? down * Math.pow(1 + OPPORTUNITY_ANNUAL, year) : down;
  const renterNet = inv - rentPaid;
  return { buyerNet, renterNet };
}

/** First time (in years) owning’s net wealth exceeds renting’s — illustrative. */
function computeBreakEvenYears(
  purchasePrice: number,
  monthlyRent: number,
  interestRateAnnual: number,
  includeInvestment: boolean,
  maxYears = 40,
): number | null {
  const atMax = buyerRenterNetAtYear(purchasePrice, monthlyRent, interestRateAnnual, maxYears, includeInvestment);
  if (atMax.buyerNet <= atMax.renterNet) return null;

  for (let y = 0.25; y <= maxYears; y += 0.25) {
    const { buyerNet, renterNet } = buyerRenterNetAtYear(
      purchasePrice,
      monthlyRent,
      interestRateAnnual,
      y,
      includeInvestment,
    );
    if (buyerNet > renterNet) {
      return Math.round(y * 10) / 10;
    }
  }
  return null;
}

function impactLevel(absDiff: number, purchasePrice: number, monthlyWaitCost: number): ImpactLevel {
  const ratio = purchasePrice > 0 ? absDiff / purchasePrice : 0;
  const score =
    (absDiff > 80_000 ? 3 : absDiff > 35_000 ? 2 : absDiff > 12_000 ? 1 : 0) +
    (ratio > 0.12 ? 3 : ratio > 0.05 ? 2 : ratio > 0.02 ? 1 : 0) +
    (monthlyWaitCost > 3500 ? 2 : monthlyWaitCost > 1800 ? 1 : 0);
  if (score >= 5) return "high";
  if (score >= 2) return "medium";
  return "low";
}

export function computeDecisionV2(input: DecisionEngineV2Input): DecisionEngineV2 | null {
  const { purchasePrice, monthlyRent, interestRateAnnual, yearsHorizon, includeInvestmentOpportunity } = input;
  if (
    !Number.isFinite(purchasePrice) ||
    !Number.isFinite(monthlyRent) ||
    !Number.isFinite(interestRateAnnual) ||
    !Number.isFinite(yearsHorizon)
  ) {
    return null;
  }
  if (purchasePrice <= 0 || monthlyRent < 0 || interestRateAnnual <= 0 || yearsHorizon <= 0 || yearsHorizon > 40) {
    return null;
  }

  const downPayment = purchasePrice * DOWN_PCT;
  const loanAmount = purchasePrice - downPayment;
  const pi = monthlyPI(loanAmount, interestRateAnnual, TERM_MONTHS);
  const monthlyTaxInsurance = pi * (PITI_FACTOR - 1);
  const monthlyPiti = pi * PITI_FACTOR;

  const horizonMonths = Math.min(Math.round(yearsHorizon * 12), TERM_MONTHS);
  const amort = amortizeThroughMonths(loanAmount, interestRateAnnual, TERM_MONTHS, horizonMonths);

  const homeValueEnd = purchasePrice * Math.pow(1 + APPRECIATION_ANNUAL, yearsHorizon);
  const appreciationGain = homeValueEnd - purchasePrice;
  const equityEnd = homeValueEnd - amort.balance;

  const totalRentPaid = totalRentThroughYears(monthlyRent, yearsHorizon);
  const investmentEnd = includeInvestmentOpportunity
    ? downPayment * Math.pow(1 + OPPORTUNITY_ANNUAL, yearsHorizon)
    : downPayment;

  const buyerNet = equityEnd;
  const renterNet = investmentEnd - totalRentPaid;
  const netAdvantage = buyerNet - renterNet;
  const buysAhead = netAdvantage >= 0;

  const principalArr = amort.principalByMonth;
  const sumLast12 = principalArr
    .slice(-Math.min(12, principalArr.length))
    .reduce((a, b) => a + b, 0);
  const avgMonthlyPrincipal =
    principalArr.length >= 12
      ? sumLast12 / 12
      : principalArr.reduce((a, b) => a + b, 0) / Math.max(1, principalArr.length);

  const monthlyAppreciationMissed = purchasePrice * (Math.pow(1 + APPRECIATION_ANNUAL, 1 / 12) - 1);
  const rentComponent = monthlyRent;
  const lostEquityMonthly = avgMonthlyPrincipal;
  const monthlyTotal = roundMoney(rentComponent + lostEquityMonthly + monthlyAppreciationMissed);

  const priceAfterWait = purchasePrice * Math.pow(1 + PRICE_DRIFT_WAIT, FUTURE_SHOCK_WAIT_YEARS);
  const loanAfterWait = priceAfterWait * (1 - DOWN_PCT);
  const piWait = monthlyPI(loanAfterWait, interestRateAnnual + RATE_BUMP_WAIT, TERM_MONTHS);
  const waitTwoYearsPriceIncrease = roundMoney(priceAfterWait - purchasePrice);
  const waitTwoYearsPaymentDeltaMonthly = roundMoney(
    Math.max(0, piWait * PITI_FACTOR - monthlyPiti),
  );

  const breakEvenYears = computeBreakEvenYears(
    purchasePrice,
    monthlyRent,
    interestRateAnnual,
    includeInvestmentOpportunity,
  );

  const difference = roundMoney(netAdvantage);
  const pctDiff =
    Math.abs(renterNet) > 1 ? Math.abs((difference / Math.abs(renterNet)) * 100) : Math.min(100, Math.abs(difference) / 1000);

  const buyColumn: PathColumn = {
    monthlyHousingCost: roundMoney(monthlyPiti),
    equityGained: roundMoney(amort.principalSum),
    netPosition: roundMoney(buyerNet),
  };
  const waitColumn: PathColumn = {
    monthlyHousingCost: roundMoney(monthlyRent),
    equityGained: 0,
    netPosition: roundMoney(renterNet),
  };

  const headlineAmount = roundMoney(Math.abs(netAdvantage));
  const twoYearWaitCostTotal = roundMoney(monthlyTotal * 12 * FUTURE_SHOCK_WAIT_YEARS);

  const totalCostDelta = roundMoney(Math.abs(netAdvantage));

  return {
    buysAhead,
    headlineAmount,
    twoYearWaitCostTotal,
    waitLabelYears: yearsHorizon,
    buyer: {
      monthlyPi: roundMoney(pi),
      monthlyTaxInsurance: roundMoney(monthlyTaxInsurance),
      monthlyPiti: roundMoney(monthlyPiti),
      equityEnd: roundMoney(equityEnd),
      principalPaidHorizon: roundMoney(amort.principalSum),
      appreciationGain: roundMoney(appreciationGain),
      totalInterestPaid: roundMoney(amort.interestSum),
    },
    renter: {
      avgMonthlyRent: roundMoney(monthlyRent),
      totalRentPaid: roundMoney(totalRentPaid),
      investmentEnd: roundMoney(investmentEnd),
    },
    comparison: {
      buyNow: buyColumn,
      waitRent: waitColumn,
      difference,
      pctDifference: Math.round(pctDiff * 10) / 10,
    },
    waitPenalty: {
      monthlyTotal,
      rent: roundMoney(rentComponent),
      lostEquityMonthly: roundMoney(lostEquityMonthly),
      appreciationLossMonthly: roundMoney(monthlyAppreciationMissed),
    },
    futureShock: {
      waitYears: FUTURE_SHOCK_WAIT_YEARS,
      priceIncrease: waitTwoYearsPriceIncrease,
      paymentIncreaseMonthly: waitTwoYearsPaymentDeltaMonthly,
    },
    breakEvenYears,
    impact: impactLevel(Math.abs(difference), purchasePrice, monthlyTotal),
    totalCostDelta,
  };
}

export function formatUsd(n: number): string {
  const abs = Math.abs(Math.round(n));
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(abs);
}
