export type WealthInputs = {
  hp: number;
  /** Percentage points, e.g. 10 = 10% */
  dp: number;
  rate: number;
  rent: number;
  appr: number;
  rentInc: number;
  invReturn: number;
  propTax: number;
  maint: number;
  taxRate: number;
};

export function monthlyPmt(principal: number, annualRate: number, termMonths: number): number {
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / termMonths;
  return (principal * (r * Math.pow(1 + r, termMonths))) / (Math.pow(1 + r, termMonths) - 1);
}

export function runCalculation(inputs: WealthInputs) {
  const { hp, dp, rate, rent, appr, rentInc, invReturn, propTax, maint, taxRate } = inputs;

  const dpPct = dp / 100;
  const dpDollars = Math.round(hp * dpPct);
  const loan = hp - dpDollars;
  const closingCosts = Math.round(hp * 0.03);
  const totalUpfront = dpDollars + closingCosts;
  const termMos = 360;
  const r = rate / 100 / 12;

  const pmiRate = dpPct < 0.2 ? 0.008 : 0;
  const pmiMo = pmiRate > 0 ? Math.round((loan * pmiRate) / 12) : 0;

  const basePmt = monthlyPmt(loan, rate, termMos);

  let loanBal = loan;
  let homeVal = hp;
  let renterPortfolio = totalUpfront;
  let renterMonthlyRent = rent;
  let pmiRemoved = false;
  let pmiRemoveYear: number | null = null;

  let totalPMIPaid = 0;
  let totalRentPaid = 0;
  let totalMortgagePaid = 0;
  let totalMaintenancePaid = 0;
  let totalPropTaxPaid = 0;
  let totalTaxBenefit = 0;

  const ownerNWArr: number[] = [];
  const renterNWArr: number[] = [];
  const labels: string[] = [];

  const MILESTONE_YEARS = [5, 10, 20, 30];
  const milestoneData: Record<
    number,
    { ownerNW: number; renterNW: number; adv: number; homeVal: number; loanBal: number }
  > = {};

  const initialLoan = loan;
  const rMonthly = rate / 100 / 12;

  for (let yr = 1; yr <= 30; yr++) {
    let yearPMI = 0;
    let yearTaxBenefit = 0;

    for (let mo = 1; mo <= 12; mo++) {
      const intPart = loanBal * rMonthly;
      const prinPart = basePmt - intPart;
      loanBal = Math.max(0, loanBal - prinPart);

      homeVal *= 1 + appr / 100 / 12;

      const currentLTV = loanBal / homeVal;
      if (pmiRate > 0 && !pmiRemoved) {
        if (currentLTV > 0.8) {
          yearPMI += pmiMo;
        } else {
          pmiRemoved = true;
          pmiRemoveYear = yr;
        }
      }

      yearTaxBenefit += intPart * (taxRate / 100);

      const monthlyPropTax = (homeVal * propTax) / 100 / 12;
      const monthlyMaint = (homeVal * maint) / 100 / 12;
      const totalOwnerMonthly =
        basePmt + (pmiRemoved ? 0 : pmiMo) + monthlyPropTax + monthlyMaint;

      const rentDiff = Math.max(0, totalOwnerMonthly - renterMonthlyRent);
      renterPortfolio = renterPortfolio * (1 + invReturn / 100 / 12) + rentDiff;
      totalRentPaid += renterMonthlyRent;
    }

    renterMonthlyRent *= 1 + rentInc / 100;

    totalPMIPaid += yearPMI;
    totalTaxBenefit += yearTaxBenefit;
    totalMortgagePaid += basePmt * 12;
    totalMaintenancePaid += homeVal * (maint / 100);
    totalPropTaxPaid += homeVal * (propTax / 100);

    const sellingCosts = homeVal * 0.06;
    const ownerNWVal = Math.round(Math.max(0, homeVal - loanBal - sellingCosts));
    const renterNWVal = Math.round(Math.max(0, renterPortfolio));

    ownerNWArr.push(ownerNWVal);
    renterNWArr.push(renterNWVal);
    labels.push(`Yr ${yr}`);

    if (MILESTONE_YEARS.includes(yr)) {
      milestoneData[yr] = {
        ownerNW: ownerNWVal,
        renterNW: renterNWVal,
        adv: ownerNWVal - renterNWVal,
        homeVal: Math.round(homeVal),
        loanBal: Math.round(loanBal),
      };
    }
  }

  const ownerFinal = ownerNWArr[29]!;
  const renterFinal = renterNWArr[29]!;
  const advantage = ownerFinal - renterFinal;
  const buyingWins = advantage > 0;

  let beYear: number | null = null;
  for (let i = 0; i < 30; i++) {
    if (ownerNWArr[i]! >= renterNWArr[i]!) {
      beYear = i + 1;
      break;
    }
  }

  const m30 = milestoneData[30]!;
  const totalAppreciation = Math.round(m30.homeVal - hp);
  const finalPrincipal = Math.round(initialLoan - m30.loanBal);
  const totalOppCost = Math.round(totalUpfront * (Math.pow(1 + invReturn / 100, 30) - 1));

  let totalRentInflationExtra = 0;
  for (let y = 0; y < 30; y++) {
    totalRentInflationExtra += Math.round(rent * 12 * (Math.pow(1 + rentInc / 100, y) - 1));
  }

  const totalOwnerMoToday = Math.round(
    basePmt + pmiMo + (hp * propTax) / 100 / 12 + (hp * maint) / 100 / 12,
  );
  const monthlyCostDiff = totalOwnerMoToday - rent;

  const monthlyR = invReturn / 100 / 12;
  const fvFactor = (Math.pow(1 + monthlyR, 360) - 1) / monthlyR;
  const pvFactor = Math.pow(1 + monthlyR, 360);
  const monthlyToMatch = Math.round((ownerFinal - totalUpfront * pvFactor) / fvFactor);

  const rentAtYear30 = Math.round(rent * Math.pow(1 + rentInc / 100, 30));

  const year1PrincipalApprox = Math.round(basePmt - initialLoan * rMonthly);

  return {
    dpDollars,
    loan,
    closingCosts,
    totalUpfront,
    pmiMo,
    pmiRate,
    pmiRemoveYear,
    basePmt,
    ownerNWArr,
    renterNWArr,
    labels,
    milestoneData,
    ownerFinal,
    renterFinal,
    advantage,
    buyingWins,
    beYear,
    totalAppreciation,
    finalPrincipal,
    totalPMIPaid: Math.round(totalPMIPaid),
    totalRentInflationExtra: Math.round(totalRentInflationExtra),
    totalTaxBenefit: Math.round(totalTaxBenefit),
    totalOppCost,
    totalRentPaid: Math.round(totalRentPaid),
    totalMortgagePaid: Math.round(totalMortgagePaid),
    totalMaintenancePaid: Math.round(totalMaintenancePaid),
    totalPropTaxPaid: Math.round(totalPropTaxPaid),
    totalPrincipalPaid: finalPrincipal,
    totalOwnerMoToday,
    monthlyCostDiff,
    monthlyToMatch: Math.max(0, monthlyToMatch),
    rentAtYear30,
    year1PrincipalApprox,
    hp,
    /** Down payment as percentage points (same as inputs.dp, e.g. 10 = 10%) */
    dp: inputs.dp,
    dpPct,
    rate,
    rent,
    appr,
    rentInc,
    invReturn,
    propTax,
    maint,
    taxRate,
  };
}

export type WealthResults = ReturnType<typeof runCalculation>;

export function fmt(n: number): string {
  return "$" + Math.round(Math.abs(n)).toLocaleString("en-US");
}

export function fmtK(n: number): string {
  const sign = n < 0 ? "−" : "";
  return sign + "$" + Math.round(Math.abs(n)).toLocaleString("en-US");
}
