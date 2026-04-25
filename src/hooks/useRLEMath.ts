export type RateEnv = "volatile" | "rising" | "falling" | "stable";
export type RiskTol = "low" | "medium" | "high";

export type RLEInputs = {
  loan: number;
  rate: number;
  term: number;
  daysToClose: number;
  riseScenario: number;
  dropScenario: number;
  rateEnv: RateEnv;
  extFee: number;
  floatCost: number;
  floatThresh: number;
  riskTol: RiskTol;
};

export type RLEResults = ReturnType<typeof runCalculation>;

/** Standard P&I monthly payment */
export function monthlyPmt(principal: number, annualRate: number, termMonths: number): number {
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / termMonths;
  return (principal * (r * Math.pow(1 + r, termMonths))) / (Math.pow(1 + r, termMonths) - 1);
}

/** Total interest over loan life */
export function totalInterest(principal: number, annualRate: number, termMonths: number): number {
  return monthlyPmt(principal, annualRate, termMonths) * termMonths - principal;
}

export function runCalculation(inputs: RLEInputs) {
  const {
    loan,
    rate,
    term,
    daysToClose,
    riseScenario,
    dropScenario,
    rateEnv,
    extFee,
    floatCost,
    floatThresh,
    riskTol,
  } = inputs;

  const termMos = term * 12;

  const rateRise = rate + riseScenario;
  const rateDrop = Math.max(0, rate - dropScenario);

  const lockedPmt = monthlyPmt(loan, rate, termMos);
  const risePmt = monthlyPmt(loan, rateRise, termMos);
  const dropPmt = monthlyPmt(loan, rateDrop, termMos);

  const lockedTotalInt = totalInterest(loan, rate, termMos);
  const riseTotalInt = totalInterest(loan, rateRise, termMos);
  const dropTotalInt = totalInterest(loan, rateDrop, termMos);

  const monthlyRisk = Math.round(risePmt - lockedPmt);
  const monthlyUpside = Math.round(lockedPmt - dropPmt);
  const lifetimeRisk = Math.round(riseTotalInt - lockedTotalInt);
  const lifetimeUpside = Math.round(lockedTotalInt - dropTotalInt);

  const ratioRaw = monthlyRisk / Math.max(1, monthlyUpside);
  const asymRatio = Math.max(1, ratioRaw).toFixed(1);
  const maxBar = Math.max(monthlyRisk, monthlyUpside, 1);
  const downBarPct = Math.round((monthlyRisk / maxBar) * 100);
  const upBarPct = Math.round((monthlyUpside / maxBar) * 100);

  const ext15Cost = Math.round((loan * extFee) / 100);
  const ext30Cost = ext15Cost * 2;
  const ext45Cost = ext15Cost * 3;
  const extBreakeven = ext15Cost / Math.max(1, monthlyRisk);

  const floatDownCost = Math.round((loan * floatCost) / 100);
  const floatActivates = dropScenario >= floatThresh;
  const floatNetSave = floatActivates ? lifetimeUpside - floatDownCost : 0;
  const floatBreakeven = Math.round(floatDownCost / Math.max(1, monthlyUpside));
  const floatWorth = floatActivates && floatNetSave > 5000 && daysToClose >= 21;

  const closeCall = Math.abs(monthlyRisk - monthlyUpside) < 20;
  const lockSignal =
    riskTol === "low" ||
    rateEnv === "rising" ||
    (monthlyRisk > monthlyUpside * 1.5 && riskTol !== "high");
  const floatSignal = riskTol === "high" && (rateEnv === "falling" || rateEnv === "stable");

  const daysBuffer = daysToClose <= 30 ? 5 : daysToClose <= 45 ? 7 : 10;
  const lockWindowEnd = Math.max(0, daysToClose - daysBuffer);
  const warningZone = daysToClose <= 10;
  const inSweetSpot = daysToClose >= 30 && daysToClose <= 45;

  return {
    rateRise,
    rateDrop,
    lockedPmt: Math.round(lockedPmt),
    risePmt: Math.round(risePmt),
    dropPmt: Math.round(dropPmt),
    lockedTotalInt: Math.round(lockedTotalInt),
    riseTotalInt: Math.round(riseTotalInt),
    dropTotalInt: Math.round(dropTotalInt),
    monthlyRisk,
    monthlyUpside,
    lifetimeRisk,
    lifetimeUpside,
    asymRatio,
    downBarPct,
    upBarPct,
    maxBar,
    ext15Cost,
    ext30Cost,
    ext45Cost,
    extBreakeven,
    floatDownCost,
    floatActivates,
    floatNetSave,
    floatBreakeven,
    floatWorth,
    closeCall,
    lockSignal,
    floatSignal,
    daysBuffer,
    lockWindowEnd,
    warningZone,
    inSweetSpot,
    loan,
    rate,
    term,
    termMos,
    daysToClose,
    riseScenario,
    dropScenario,
    rateEnv,
    extFee,
    floatCost,
    floatThresh,
    riskTol,
  };
}

export function fmt(n: number): string {
  return "$" + Math.round(Math.abs(n)).toLocaleString("en-US");
}

/** Full dollars with optional negative sign (Unicode minus). */
export function fmtK(n: number): string {
  const sign = n < 0 ? "\u2212" : "";
  return sign + "$" + Math.round(Math.abs(n)).toLocaleString("en-US");
}
