export function monthlyPmt(principal: number, annualRate: number, termMonths: number): number {
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / termMonths;
  return (
    (principal * (r * Math.pow(1 + r, termMonths))) / (Math.pow(1 + r, termMonths) - 1)
  );
}

export function incomeNeeded(totalMonthlyPmt: number, monthlyDebts: number): number {
  return Math.round(((totalMonthlyPmt + monthlyDebts) / 0.43) * 12);
}

export function poolPercent(incomeThreshold: number, medianIncome: number): number {
  const ratio = medianIncome / incomeThreshold;
  const raw = 50 + (ratio - 1) * 40;
  return Math.round(Math.min(95, Math.max(5, raw)));
}

export function calcNetProceeds(salePrice: number, payoff: number, commPct: number, concession: number): number {
  const commAmt = Math.round((salePrice * commPct) / 100);
  const transfer = Math.round(salePrice * 0.015);
  const sellerClose = 8000;
  return Math.round(salePrice - payoff - commAmt - transfer - sellerClose - concession);
}

export function calc21Cost(loanAmount: number, marketRate: number, termMos: number): number {
  const yr1Rate = Math.max(0, marketRate - 2);
  const yr2Rate = Math.max(0, marketRate - 1);
  const pmtMkt = monthlyPmt(loanAmount, marketRate, termMos);
  const pmt1 = monthlyPmt(loanAmount, yr1Rate, termMos);
  const pmt2 = monthlyPmt(loanAmount, yr2Rate, termMos);
  return Math.round((pmtMkt - pmt1) * 12 + (pmtMkt - pmt2) * 12);
}

export function calc10Cost(loanAmount: number, marketRate: number, termMos: number): number {
  const yr1Rate = Math.max(0, marketRate - 1);
  const pmtMkt = monthlyPmt(loanAmount, marketRate, termMos);
  const pmt1 = monthlyPmt(loanAmount, yr1Rate, termMos);
  return Math.round((pmtMkt - pmt1) * 12);
}

export type ListingBoostInputs = {
  listPrice: number;
  dom: number;
  rate: number;
  budget: number;
  payoff: number;
  comm: number;
  areaIncome: number;
  areaDebts: number;
  downPct: number;
  ptaxRate: number;
};

export type ListingBoostResults = ReturnType<typeof runCalculation>;

export function runCalculation(inputs: ListingBoostInputs) {
  const {
    listPrice,
    dom,
    rate,
    budget,
    payoff,
    comm,
    areaIncome,
    areaDebts,
    downPct,
    ptaxRate,
  } = inputs;

  const TERM_MOS = 360;
  const dpAmt = Math.round((listPrice * downPct) / 100);
  const loan = listPrice - dpAmt;
  const taxMo = Math.round(((listPrice * ptaxRate) / 100) / 12);
  const insMo = Math.round((listPrice * 0.005) / 12);

  const pmtCurrent = monthlyPmt(loan, rate, TERM_MOS);
  const totalCurrent = Math.round(pmtCurrent + taxMo + insMo);
  const incCurrent = incomeNeeded(totalCurrent, areaDebts);
  const poolCurrent = poolPercent(incCurrent, areaIncome);

  const priceA = listPrice - budget;
  const dpA = Math.round((priceA * downPct) / 100);
  const loanA = priceA - dpA;
  const taxMoA = Math.round(((priceA * ptaxRate) / 100) / 12);
  const pmtA = monthlyPmt(loanA, rate, TERM_MOS);
  const totalA = Math.round(pmtA + taxMoA + insMo);
  const incA = incomeNeeded(totalA, areaDebts);
  const poolA = poolPercent(incA, areaIncome);
  const netA = calcNetProceeds(priceA, payoff, comm, 0);
  const costA = budget;

  const raw21Cost = calc21Cost(loan, rate, TERM_MOS);
  const cost21 = Math.min(raw21Cost, budget);
  const rate21yr1 = Math.max(0, rate - 2);
  const rate21yr2 = Math.max(0, rate - 1);
  const pmtB_yr1 = monthlyPmt(loan, rate21yr1, TERM_MOS);
  const pmtB_yr2 = monthlyPmt(loan, rate21yr2, TERM_MOS);
  const totalB_yr1 = Math.round(pmtB_yr1 + taxMo + insMo);
  const totalB_yr2 = Math.round(pmtB_yr2 + taxMo + insMo);
  const incB = incomeNeeded(totalB_yr1, areaDebts);
  const poolB = poolPercent(incB, areaIncome);
  const netB = calcNetProceeds(listPrice, payoff, comm, cost21);
  const remainB = Math.max(0, budget - cost21);

  const raw10Cost = calc10Cost(loan, rate, TERM_MOS);
  const cost10 = Math.min(raw10Cost, budget);
  const rate10yr1 = Math.max(0, rate - 1);
  const pmtC_yr1 = monthlyPmt(loan, rate10yr1, TERM_MOS);
  const totalC_yr1 = Math.round(pmtC_yr1 + taxMo + insMo);
  const incC = incomeNeeded(totalC_yr1, areaDebts);
  const poolC = poolPercent(incC, areaIncome);
  const netC = calcNetProceeds(listPrice, payoff, comm, cost10);
  const remainC = Math.max(0, budget - cost10);

  const buydownWinsPool = poolB >= poolA;
  const bestNet = Math.max(netA, netB, netC);
  const poolGain = poolB - poolCurrent;
  const poolGainVsCut = poolB - poolA;
  const incDropB = incCurrent - incB;
  const incDropA = incCurrent - incA;
  const netDiff = netB - netA;

  const pmtSavingB_yr1 = Math.round(totalCurrent - totalB_yr1);
  const pmtSavingA = Math.round(totalCurrent - totalA);

  return {
    listPrice,
    dom,
    rate,
    budget,
    payoff,
    comm,
    areaIncome,
    areaDebts,
    downPct,
    ptaxRate,
    loan,
    dpAmt,
    taxMo,
    insMo,
    totalCurrent,
    incCurrent,
    poolCurrent,
    priceA,
    loanA,
    totalA,
    incA,
    poolA,
    netA,
    costA,
    pmtSavingA,
    cost21,
    remainB,
    rate21yr1,
    rate21yr2,
    totalB_yr1,
    totalB_yr2,
    incB,
    poolB,
    netB,
    pmtSavingB_yr1,
    cost10,
    remainC,
    rate10yr1,
    totalC_yr1,
    incC,
    poolC,
    netC,
    buydownWinsPool,
    bestNet,
    poolGain,
    poolGainVsCut,
    incDropB,
    incDropA,
    netDiff,
    pmtCurrent,
  };
}

export function fmtK(n: number): string {
  const v = Math.max(0, Math.round(n));
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M`;
  return `$${Math.round(v / 1000)}k`;
}

export function fmtMoney(n: number): string {
  return `$${Math.max(0, Math.round(n)).toLocaleString()}`;
}
