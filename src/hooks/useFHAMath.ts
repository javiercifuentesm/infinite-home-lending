/** Conventional vs FHA educational comparison — not a lender quote. */

export type FHAInputs = {
  hp: number;
  dp: number;
  cs: number;
  appr: number;
  convRate: number;
  fhaRate: number;
  term: number;
  stay: number;
};

export type FHAResult = {
  dpAmt: number;
  dpAmtFha: number;
  convLoan: number;
  fhaLoan: number;
  fhaUFMIP: number;
  convLTV: number;
  fhaLTV: number;
  dpPercent: number;
  dpPercentFha: number;
  convPmt: number;
  fhaPmt: number;
  pmiRate: number;
  mipRate: number;
  pmiMoInit: number;
  mipMoInit: number;
  convTotalCost: number;
  fhaTotalCost: number;
  convMiTotal: number;
  fhaMiTotal: number;
  convAtStay: number;
  fhaAtStay: number;
  convWins: boolean;
  diff: number;
  close: boolean;
  crossoverYear: number | null;
  pmiRemoveYr: number | null;
  pmiRemoveMonth: number | null;
  labels: string[];
  convCostsArr: number[];
  fhaCostsArr: number[];
  convMiArr: number[];
  fhaMiArr: number[];
  homeVal5: number;
  fhaBal5: number;
  equity5: number;
  refiLTV5: number;
  newConvPmt5: number;
  newPmiMo5: number;
  refiSavings: number;
  stay: number;
  cs: number;
  hp: number;
  convRate: number;
  fhaRate: number;
  termYears: number;
  fhaUsesMinDown: boolean;
};

export function getPMIRate(creditScore: number, ltvPercent: number): number {
  if (ltvPercent <= 80) return 0;
  if (creditScore >= 760) {
    if (ltvPercent <= 85) return 0.0025;
    if (ltvPercent <= 90) return 0.004;
    return 0.006;
  }
  if (creditScore >= 720) {
    if (ltvPercent <= 85) return 0.004;
    if (ltvPercent <= 90) return 0.006;
    return 0.008;
  }
  if (creditScore >= 680) {
    if (ltvPercent <= 85) return 0.006;
    if (ltvPercent <= 90) return 0.009;
    return 0.012;
  }
  if (ltvPercent <= 85) return 0.009;
  if (ltvPercent <= 90) return 0.012;
  return 0.016;
}

export function getMIPRate(ltvPercent: number, dpPercent: number): number {
  if (dpPercent >= 10) return 0.005;
  if (ltvPercent > 95) return 0.0055;
  return 0.005;
}

export function monthlyPmt(principal: number, annualRate: number, termMonths: number): number {
  const r = annualRate / 100 / 12;
  if (termMonths === 0) return 0;
  if (r === 0) return Math.round(principal / termMonths);
  return Math.round(
    (principal * (r * Math.pow(1 + r, termMonths))) / (Math.pow(1 + r, termMonths) - 1),
  );
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

export function chartCostYFmt(v: number): string {
  const a = Math.abs(v);
  if (a >= 1_000_000) return "$" + (v / 1_000_000).toFixed(2) + "m";
  if (a >= 1000) return "$" + Math.round(v / 1000) + "k";
  return "$" + Math.round(v);
}

export function defaultFHAInputs(): FHAInputs {
  return {
    hp: 420000,
    dp: 5,
    cs: 720,
    appr: 3.5,
    convRate: 6.875,
    fhaRate: 6.625,
    term: 30,
    stay: 7,
  };
}

export function runCalculation(inputs: FHAInputs & { dpPct: number }): FHAResult {
  const { hp, cs, appr, convRate, fhaRate, term, stay } = inputs;
  const dpPctUser = inputs.dpPct;
  const dpPctFha = Math.max(dpPctUser, 0.035);
  const fhaUsesMinDown = dpPctUser < 0.035;

  const termMos = term * 12;
  const apprRate = appr / 100;

  const dpAmt = Math.round(hp * dpPctUser);
  const dpAmtFha = Math.round(hp * dpPctFha);
  const convLoan = Math.max(0, hp - dpAmt);
  const fhaBaseLoan = Math.max(0, hp - dpAmtFha);
  const fhaUFMIP = Math.round(fhaBaseLoan * 0.0175);
  const fhaLoan = fhaBaseLoan + fhaUFMIP;

  const convLTV = hp > 0 ? (convLoan / hp) * 100 : 0;
  const fhaLTV = hp > 0 ? (fhaLoan / hp) * 100 : 0;

  const convPmt = monthlyPmt(convLoan, convRate, termMos);
  const fhaPmt = monthlyPmt(fhaLoan, fhaRate, termMos);

  const dpPercent = dpPctUser * 100;
  const dpPercentFha = dpPctFha * 100;
  const pmiRate = getPMIRate(cs, convLTV);
  const mipRate = getMIPRate(fhaLTV, dpPercentFha);

  const pmiMoInit = pmiRate > 0 ? Math.round((convLoan * pmiRate) / 12) : 0;
  const mipMoInit = Math.round((fhaLoan * mipRate) / 12);

  let convBal = convLoan;
  let fhaBal = fhaLoan;
  let convTotalCost = dpAmt;
  let fhaTotalCost = dpAmtFha;
  let convMiTotal = 0;
  let fhaMiTotal = fhaUFMIP;
  let pmiRemoveMonth: number | null = null;
  let mipRemoveMonth: number | null = null;
  let crossoverYear: number | null = null;

  const rConv = convRate / 100 / 12;
  const rFha = fhaRate / 100 / 12;

  const convCostsArr: number[] = [];
  const fhaCostsArr: number[] = [];
  const convMiArr: number[] = [];
  const fhaMiArr: number[] = [];
  const labels: string[] = [];

  const totalMonths = termMos;

  for (let mo = 1; mo <= totalMonths; mo++) {
    const homeValNow = hp * Math.pow(1 + apprRate / 12, mo);

    const convInt = convBal * rConv;
    const convPrin = convPmt - convInt;
    convBal = Math.max(0, convBal - convPrin);

    const convLTVNow = homeValNow > 0 ? (convBal / homeValNow) * 100 : 0;
    let convMiMo = 0;
    if (pmiRate > 0 && pmiRemoveMonth === null) {
      if (convLTVNow > 80) {
        convMiMo = Math.round((convLoan * pmiRate) / 12);
      } else {
        pmiRemoveMonth = mo;
      }
    }
    convTotalCost += convPmt + convMiMo;
    convMiTotal += convMiMo;

    const fhaInt = fhaBal * rFha;
    const fhaPrin = fhaPmt - fhaInt;
    fhaBal = Math.max(0, fhaBal - fhaPrin);

    const mipDurationDone = dpPercentFha >= 10 && mo >= 132;
    let fhaMiMo = 0;
    if (!mipDurationDone && mipRemoveMonth === null) {
      fhaMiMo = Math.round((fhaLoan * mipRate) / 12);
    } else if (mipDurationDone && mipRemoveMonth === null) {
      mipRemoveMonth = mo;
    }
    fhaTotalCost += fhaPmt + fhaMiMo;
    fhaMiTotal += fhaMiMo;

    if (crossoverYear === null && convTotalCost < fhaTotalCost) {
      crossoverYear = Math.ceil(mo / 12);
    }

    if (mo % 12 === 0) {
      const yr = mo / 12;
      labels.push("Yr " + yr);
      convCostsArr.push(Math.round(convTotalCost));
      fhaCostsArr.push(Math.round(fhaTotalCost));
      convMiArr.push(Math.round(convMiMo));
      fhaMiArr.push(Math.round(fhaMiMo));
    }
  }

  const termYears = term;
  const maxIdx = Math.max(0, convCostsArr.length - 1);
  const stayIdx = Math.min(Math.max(0, stay - 1), maxIdx);
  const convAtStay = convCostsArr[stayIdx] ?? convCostsArr[maxIdx] ?? 0;
  const fhaAtStay = fhaCostsArr[stayIdx] ?? fhaCostsArr[maxIdx] ?? 0;
  const convWins = convAtStay < fhaAtStay;
  const diff = Math.abs(convAtStay - fhaAtStay);
  const close = diff < 8000;

  const pmiRemoveYr = pmiRemoveMonth ? Math.round((pmiRemoveMonth / 12) * 10) / 10 : null;

  let fhaBal5 = fhaLoan;
  const rF = fhaRate / 100 / 12;
  for (let m = 0; m < 60; m++) {
    const intP = fhaBal5 * rF;
    const prinP = fhaPmt - intP;
    fhaBal5 = Math.max(0, fhaBal5 - prinP);
  }
  const homeVal5 = Math.round(hp * Math.pow(1 + apprRate, 5));
  const fhaBal5R = Math.round(fhaBal5);
  const equity5 = Math.max(0, Math.round(homeVal5 - fhaBal5R));
  const refiLTV5 = homeVal5 > 0 ? Math.round((fhaBal5 / homeVal5) * 100) : 0;
  const newPmiRate5 = getPMIRate(cs, refiLTV5);
  const remainingAfter5 = Math.max(1, termMos - 60);
  const newConvPmt5 = monthlyPmt(fhaBal5R, convRate, remainingAfter5);
  const newPmiMo5 = newPmiRate5 > 0 ? Math.round((fhaBal5R * newPmiRate5) / 12) : 0;
  const fhaMonthly = fhaPmt + mipMoInit;
  const convMonthly5 = newConvPmt5 + newPmiMo5;
  const refiSavings = Math.round(fhaMonthly - convMonthly5);

  return {
    dpAmt,
    dpAmtFha,
    convLoan,
    fhaLoan,
    fhaUFMIP,
    convLTV,
    fhaLTV,
    dpPercent,
    dpPercentFha,
    convPmt,
    fhaPmt,
    pmiRate,
    mipRate,
    pmiMoInit,
    mipMoInit,
    convTotalCost,
    fhaTotalCost,
    convMiTotal,
    fhaMiTotal,
    convAtStay,
    fhaAtStay,
    convWins,
    diff,
    close,
    crossoverYear,
    pmiRemoveYr,
    pmiRemoveMonth,
    labels,
    convCostsArr,
    fhaCostsArr,
    convMiArr,
    fhaMiArr,
    homeVal5,
    fhaBal5: fhaBal5R,
    equity5,
    refiLTV5,
    newConvPmt5,
    newPmiMo5,
    refiSavings,
    stay,
    cs,
    hp,
    convRate,
    fhaRate,
    termYears,
    fhaUsesMinDown,
  };
}
