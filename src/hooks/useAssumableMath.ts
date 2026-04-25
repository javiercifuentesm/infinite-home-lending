export function monthlyPmt(principal: number, annualRate: number, termMonths: number): number {
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / termMonths;
  return (principal * (r * Math.pow(1 + r, termMonths))) / (Math.pow(1 + r, termMonths) - 1);
}

export type LoanType = "va" | "fha" | "usda";
export type VaElig = "yes" | "no";

export type AssumableInputs = {
  loanType: LoanType;
  assumedRate: number;
  loanBal: number;
  termYrs: number;
  purchasePrice: number;
  gapRate: number;
  gapTerm: number;
  mktRate: number;
  vaElig: VaElig;
};

export type AssumableResults = ReturnType<typeof runCalculation>;

export function runCalculation(inputs: AssumableInputs) {
  const { loanType, assumedRate, loanBal, termYrs, purchasePrice, gapRate, gapTerm, mktRate, vaElig } = inputs;

  const termMos = Math.round(termYrs * 12);
  const gapTermMos = Math.round(gapTerm * 12);

  const equityGap = Math.max(0, purchasePrice - loanBal);

  const pmtAssumed = monthlyPmt(loanBal, assumedRate, termMos);

  const pmtGap = equityGap > 0 ? monthlyPmt(equityGap, gapRate, gapTermMos) : 0;

  const totalAssumed = Math.round(pmtAssumed + pmtGap);

  const pmtNewLoan = monthlyPmt(purchasePrice, mktRate, 360);
  const totalNew = Math.round(pmtNewLoan);

  const monthlySaving = Math.round(totalNew - totalAssumed);
  const annualSaving = monthlySaving * 12;

  const blendedRate =
    equityGap > 0 ? (assumedRate * loanBal + gapRate * equityGap) / (loanBal + equityGap) : assumedRate;

  const totalIntAssumed = Math.round(
    pmtAssumed * termMos - loanBal + (equityGap > 0 ? pmtGap * gapTermMos - equityGap : 0),
  );
  const totalIntNew = Math.round(pmtNewLoan * 360 - purchasePrice);
  const lifetimeSaving = Math.round(totalIntNew - totalIntAssumed);

  const assumptionFee =
    loanType === "va" ? Math.round(loanBal * 0.005) : loanType === "fha" ? 1800 : 800;
  const processingFee = loanType === "va" ? 300 : loanType === "fha" ? 900 : 500;
  const totalFees = assumptionFee + processingFee;

  const breakEvenMos = monthlySaving > 0 ? Math.ceil(totalFees / monthlySaving) : null;

  let worthIt: "yes" | "marginal" | "no";
  if (monthlySaving >= 400 && blendedRate < mktRate) worthIt = "yes";
  else if (monthlySaving >= 100 && blendedRate < mktRate) worthIt = "marginal";
  else worthIt = "no";

  const rateAdvantage = mktRate - blendedRate;

  return {
    loanType,
    assumedRate,
    loanBal,
    termYrs,
    termMos,
    purchasePrice,
    gapRate,
    gapTerm,
    gapTermMos,
    mktRate,
    vaElig,
    equityGap,
    pmtAssumed: Math.round(pmtAssumed),
    pmtGap: Math.round(pmtGap),
    totalAssumed,
    pmtNewLoan: Math.round(pmtNewLoan),
    totalNew,
    monthlySaving,
    annualSaving,
    blendedRate,
    totalIntAssumed: Math.max(0, totalIntAssumed),
    totalIntNew: Math.max(0, totalIntNew),
    lifetimeSaving,
    assumptionFee,
    processingFee,
    totalFees,
    breakEvenMos,
    worthIt,
    rateAdvantage,
  };
}

/** Monthly / line-item dollars */
export function fmt(n: number): string {
  const v = Math.round(n);
  const abs = Math.abs(v).toLocaleString();
  return v < 0 ? `-$${abs}` : `$${abs}`;
}

/** Thousands-style; supports negative for lifetime deltas */
export function fmtK(n: number): string {
  const v = Math.round(n);
  const sign = v < 0 ? "-" : "";
  const av = Math.abs(v);
  if (av >= 1_000_000) return `${sign}$${(av / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M`;
  return `${sign}$${Math.round(av / 1000)}k`;
}
