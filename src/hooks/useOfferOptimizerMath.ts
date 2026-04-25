export type BuydownType = "2-1" | "1-0" | "perm";

export type OfferOptimizerInputs = {
  salePrice: number;
  concessionBudget: number;
  payoff: number;
  commission: number;
  sellerClosing: number;
  buyerDP: number;
  marketRate: number;
  buyerIncome: number;
  buyerDebts: number;
  loanTerm: number;
  buydownType: BuydownType;
};

export function monthlyPmt(principal: number, annualRate: number, termMonths: number): number {
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / termMonths;
  return (principal * (r * Math.pow(1 + r, termMonths))) / (Math.pow(1 + r, termMonths) - 1);
}

export function calc21BuydownCost(loanAmount: number, marketRate: number, termMonths: number): number {
  const rate1 = Math.max(0, marketRate - 2);
  const rate2 = Math.max(0, marketRate - 1);
  const pmtMarket = monthlyPmt(loanAmount, marketRate, termMonths);
  const pmt1 = monthlyPmt(loanAmount, rate1, termMonths);
  const pmt2 = monthlyPmt(loanAmount, rate2, termMonths);
  const yr1Cost = (pmtMarket - pmt1) * 12;
  const yr2Cost = (pmtMarket - pmt2) * 12;
  return Math.round(yr1Cost + yr2Cost);
}

export function calc10BuydownCost(loanAmount: number, marketRate: number, termMonths: number): number {
  const rate1 = Math.max(0, marketRate - 1);
  const pmtMarket = monthlyPmt(loanAmount, marketRate, termMonths);
  const pmt1 = monthlyPmt(loanAmount, rate1, termMonths);
  return Math.round((pmtMarket - pmt1) * 12);
}

export function calcPermBuydown(loanAmount: number, marketRate: number, concessionBudget: number) {
  const maxPoints = concessionBudget / (loanAmount * 0.01);
  const rateReduction = maxPoints * 0.25;
  const newRate = Math.max(0, marketRate - rateReduction);
  const cost = Math.round(Math.min(concessionBudget, loanAmount * maxPoints * 0.01));
  return { newRate, rateReduction, cost, maxPoints };
}

export function calcNetProceeds(
  salePrice: number,
  payoff: number,
  commissionPct: number,
  sellerClosing: number,
  concessionUsed: number,
) {
  const commissionAmt = Math.round((salePrice * commissionPct) / 100);
  const transferTax = Math.round(salePrice * 0.015);
  const gross = salePrice;
  const deductions = payoff + commissionAmt + sellerClosing + transferTax + concessionUsed;
  const rawNetProceeds = Math.round(gross - deductions);
  const netProceeds = Math.max(0, rawNetProceeds);
  return {
    gross,
    commissionAmt,
    transferTax,
    rawNetProceeds,
    netProceeds,
  };
}

export function maxBuyerPayment(monthlyIncome: number, monthlyDebts: number): number {
  return Math.round(monthlyIncome * 0.43 - monthlyDebts);
}

export function maxLoanFromPmt(maxPmt: number, annualRate: number, termMonths: number): number {
  const r = annualRate / 100 / 12;
  if (r === 0) return Math.round(maxPmt * termMonths);
  return Math.round((maxPmt * (Math.pow(1 + r, termMonths) - 1)) / (r * Math.pow(1 + r, termMonths)));
}

export function fmt(n: number): string {
  return "$" + Math.round(Math.abs(n)).toLocaleString("en-US");
}

export function fmtK(n: number): string {
  const sign = n < 0 ? "−" : "";
  return sign + "$" + Math.round(Math.abs(n)).toLocaleString("en-US");
}

export function runCalculation(inputs: OfferOptimizerInputs) {
  const {
    salePrice,
    concessionBudget,
    payoff,
    commission,
    sellerClosing,
    buyerDP,
    marketRate,
    buyerIncome,
    buyerDebts,
    loanTerm,
    buydownType,
  } = inputs;

  const termMos = loanTerm * 12;
  const dpAmt = Math.round((salePrice * buyerDP) / 100);
  const loanAtAsk = salePrice - dpAmt;

  const priceAfterCut = salePrice - concessionBudget;
  const dpAtCut = Math.round((priceAfterCut * buyerDP) / 100);
  const loanAfterCut = priceAfterCut - dpAtCut;

  const pmtAtAsk = monthlyPmt(loanAtAsk, marketRate, termMos);
  const pmtAfterCut = monthlyPmt(loanAfterCut, marketRate, termMos);
  const priceReductionSaving = Math.round(pmtAtAsk - pmtAfterCut);

  const netA = calcNetProceeds(priceAfterCut, payoff, commission, sellerClosing, 0);

  let buydownCost = 0;
  let yr1Rate = marketRate;
  let yr2Rate = marketRate;
  let yr3Rate = marketRate;
  let yr1Pmt = pmtAtAsk;
  let yr2Pmt = pmtAtAsk;
  let yr3Pmt = pmtAtAsk;
  let permNewRate = marketRate;

  if (buydownType === "2-1") {
    yr1Rate = Math.max(0, marketRate - 2);
    yr2Rate = Math.max(0, marketRate - 1);
    yr3Rate = marketRate;
    yr1Pmt = monthlyPmt(loanAtAsk, yr1Rate, termMos);
    yr2Pmt = monthlyPmt(loanAtAsk, yr2Rate, termMos);
    yr3Pmt = monthlyPmt(loanAtAsk, yr3Rate, termMos);
    buydownCost = calc21BuydownCost(loanAtAsk, marketRate, termMos);
    buydownCost = Math.min(buydownCost, concessionBudget);
  } else if (buydownType === "1-0") {
    yr1Rate = Math.max(0, marketRate - 1);
    yr2Rate = marketRate;
    yr3Rate = marketRate;
    yr1Pmt = monthlyPmt(loanAtAsk, yr1Rate, termMos);
    yr2Pmt = monthlyPmt(loanAtAsk, yr2Rate, termMos);
    yr3Pmt = yr2Pmt;
    buydownCost = calc10BuydownCost(loanAtAsk, marketRate, termMos);
    buydownCost = Math.min(buydownCost, concessionBudget);
  } else {
    const perm = calcPermBuydown(loanAtAsk, marketRate, concessionBudget);
    permNewRate = perm.newRate;
    yr1Rate = permNewRate;
    yr2Rate = permNewRate;
    yr3Rate = permNewRate;
    yr1Pmt = monthlyPmt(loanAtAsk, permNewRate, termMos);
    yr2Pmt = yr1Pmt;
    yr3Pmt = yr1Pmt;
    buydownCost = perm.cost;
  }

  const remainingConcession = Math.max(0, concessionBudget - buydownCost);
  const netB = calcNetProceeds(salePrice, payoff, commission, sellerClosing, concessionBudget);

  const yr1MoSaving = Math.round(pmtAtAsk - yr1Pmt);
  const beMonths =
    yr1MoSaving > 0 && buydownCost > 0 ? Math.ceil(buydownCost / yr1MoSaving) : null;

  const maxPmt = maxBuyerPayment(buyerIncome, buyerDebts);
  const maxLoanAtMarket = maxLoanFromPmt(maxPmt, marketRate, termMos);
  const maxLoanAtBuydown = maxLoanFromPmt(maxPmt, yr1Rate, termMos);
  const maxPriceAtMarket = Math.round(maxLoanAtMarket / (1 - buyerDP / 100));
  const maxPriceAtBuydown = Math.round(maxLoanAtBuydown / (1 - buyerDP / 100));
  const qualificationLift = Math.max(0, maxPriceAtBuydown - maxPriceAtMarket);
  const buyerQualifiesAtAsk = maxPriceAtMarket >= salePrice;
  const buyerQualifiesWithBuydown = maxPriceAtBuydown >= salePrice;

  const buydownYr1Pmt = Math.round(yr1Pmt);
  const priceReductPmtRounded = Math.round(pmtAfterCut);
  const buydownWins = buydownYr1Pmt < priceReductPmtRounded;
  const pmtDiff = Math.abs(buydownYr1Pmt - priceReductPmtRounded);

  const sellerNetDiff = netB.netProceeds - netA.netProceeds;
  const buydownBetterForSeller = sellerNetDiff > 0;

  const savingsYr1 = Math.round((pmtAtAsk - yr1Pmt) * 12);
  const savingsYr12 =
    buydownType === "2-1"
      ? Math.round((pmtAtAsk - yr1Pmt) * 12 + (pmtAtAsk - yr2Pmt) * 12)
      : 0;

  const totalSavingsPerm =
    buydownType === "perm" ? Math.round((pmtAtAsk - yr1Pmt) * termMos) : 0;

  return {
    salePrice,
    concessionBudget,
    marketRate,
    buydownType,
    buyerDP,
    termMos,
    loanAtAsk,
    loanAfterCut,
    dpAmt,
    dpAtCut,
    priceAfterCut,
    pmtAfterCut: Math.round(pmtAfterCut),
    pmtAtAsk: Math.round(pmtAtAsk),
    priceReductionSaving,
    netA,
    yr1Rate,
    yr2Rate,
    yr3Rate,
    yr1Pmt: Math.round(yr1Pmt),
    yr2Pmt: Math.round(yr2Pmt),
    yr3Pmt: Math.round(yr3Pmt),
    buydownCost,
    remainingConcession,
    netB,
    permNewRate,
    beMonths,
    maxPriceAtMarket,
    maxPriceAtBuydown,
    qualificationLift,
    buyerQualifiesAtAsk,
    buyerQualifiesWithBuydown,
    buydownWins,
    pmtDiff,
    sellerNetDiff,
    buydownBetterForSeller,
    savingsYr1,
    savingsYr12,
    totalSavingsPerm,
  };
}

export type OfferOptimizerResults = ReturnType<typeof runCalculation>;
