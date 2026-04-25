/** Pure rent vs buy wealth math — 30 years monthly, yearly snapshots. */

export type BuyVsRentInputs = {
  hp: number;
  dp: number;
  ir: number;
  lt: number;
  pt: number;
  hi: number;
  hoa: number;
  maint: number;
  rent: number;
  ri: number;
  rins: number;
  sd: number;
  appr: number;
  inv: number;
  tax: number;
  cc: number;
  sc: number;
};

export type YearlySnapshot = {
  yr: number;
  buyNetWealth: number;
  rentPortfolio: number;
  homeVal: number;
  loanBal: number;
  equity: number;
  buyTotalPaid: number;
  rentTotalPaid: number;
  monthlyBuyCost: number;
  monthlyRent: number;
  buyInterest: number;
};

export type BuyVsRentResult = {
  yearlyData: YearlySnapshot[];
  crossoverYr: number | null;
  stdPmt: number;
};

export function runCalculation(inputs: BuyVsRentInputs): BuyVsRentResult {
  const {
    hp,
    dp,
    ir,
    lt,
    pt,
    hi,
    hoa,
    maint,
    rent,
    ri,
    rins,
    sd,
    appr,
    inv,
    cc,
    sc,
  } = inputs;

  const dpPct = dp / 100;
  const irMo = ir / 100 / 12;
  const ptRate = pt / 100;
  const maintRate = maint / 100;
  const riRate = ri / 100;
  const apprRate = appr / 100;
  const invRate = inv / 100;
  const ccPct = cc / 100;
  const scPct = sc / 100;

  const downPmt = hp * dpPct;
  const loan = hp - downPmt;
  const closingCosts = hp * ccPct;
  const termMos = lt * 12;

  const r = irMo;
  const stdPmt =
    r === 0 ? loan / termMos : (loan * (r * Math.pow(1 + r, termMos))) / (Math.pow(1 + r, termMos) - 1);

  let rentPortfolio = Math.max(0, (downPmt + closingCosts + sd) * (1 + invRate / 12));
  let curRent = rent;
  let loanBal = loan;
  let homeVal = hp;
  let buyTotalPaid = downPmt + closingCosts;
  let rentTotalPaid = 0;
  let buyTotalInterest = 0;

  const yearlyData: YearlySnapshot[] = [];

  for (let mo = 1; mo <= 360; mo++) {
    const intPmt = loanBal * r;
    const prinPmt = mo <= termMos && loanBal > 0 ? Math.min(stdPmt - intPmt, loanBal) : 0;
    loanBal = Math.max(0, loanBal - prinPmt);
    homeVal *= 1 + apprRate / 12;
    buyTotalInterest += intPmt;

    const monthlyPropTax = (homeVal * ptRate) / 12;
    const monthlyIns = hi / 12;
    const monthlyHOA = hoa;
    const monthlyMaint = (homeVal * maintRate) / 12;
    const monthlyPI = intPmt + prinPmt;
    const monthlyBuyCost = monthlyPI + monthlyPropTax + monthlyIns + monthlyHOA + monthlyMaint;
    buyTotalPaid += monthlyBuyCost;

    const sellProceeds = homeVal * (1 - scPct);
    const buyNetWealth = sellProceeds - loanBal;

    if (mo % 12 === 0 && mo > 12) curRent *= 1 + riRate;

    const monthlyRentCost = curRent + rins / 12;

    const monthlyCostDiff = monthlyBuyCost - monthlyRentCost;
    rentPortfolio *= 1 + invRate / 12;
    if (monthlyCostDiff > 0) rentPortfolio += monthlyCostDiff;
    rentPortfolio = Math.max(0, rentPortfolio);

    if (mo === 1) rentTotalPaid += curRent + rins / 12 + sd;
    else rentTotalPaid += monthlyRentCost;

    if (mo % 12 === 0) {
      yearlyData.push({
        yr: mo / 12,
        buyNetWealth: Math.round(buyNetWealth),
        rentPortfolio: Math.round(rentPortfolio),
        homeVal: Math.round(homeVal),
        loanBal: Math.round(loanBal),
        equity: Math.round(homeVal - loanBal),
        buyTotalPaid: Math.round(buyTotalPaid),
        rentTotalPaid: Math.round(rentTotalPaid),
        monthlyBuyCost: Math.round(monthlyBuyCost),
        monthlyRent: Math.round(curRent),
        buyInterest: Math.round(buyTotalInterest),
      });
    }
  }

  let crossoverYr: number | null = null;
  for (const d of yearlyData) {
    if (d.buyNetWealth > d.rentPortfolio) {
      crossoverYr = d.yr;
      break;
    }
  }

  return { yearlyData, crossoverYr, stdPmt: Math.round(stdPmt) };
}

export function fmtK(n: number): string {
  const a = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (a >= 1_000_000) return sign + "$" + (a / 1_000_000).toFixed(2) + "M";
  if (a >= 1000) return sign + "$" + (a / 1000).toFixed(1) + "k";
  return sign + "$" + Math.round(a);
}

export function fmt(n: number): string {
  return "$" + Math.abs(Math.round(n)).toLocaleString();
}

export function yFmt(v: number): string {
  const a = Math.abs(v);
  if (a >= 1_000_000) return "$" + (v / 1_000_000).toFixed(1) + "M";
  if (a >= 1000) return "$" + Math.round(v / 1000) + "k";
  return "$" + Math.round(v);
}

export const TIMELINE_YEARS = [1, 3, 5, 7, 10, 15, 20, 30] as const;

export const defaultBuyVsRentInputs = (): BuyVsRentInputs => ({
  hp: 480000,
  dp: 10,
  ir: 6.75,
  lt: 30,
  pt: 1.1,
  hi: 1800,
  hoa: 0,
  maint: 1.0,
  rent: 2400,
  ri: 3.5,
  rins: 240,
  sd: 2400,
  appr: 3.5,
  inv: 7.0,
  tax: 22,
  cc: 3.0,
  sc: 6.0,
});
