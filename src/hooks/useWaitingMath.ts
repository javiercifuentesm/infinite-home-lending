/** Pure waiting-cost math — no React. */

export type WaitingInputs = {
  hp: number;
  rent: number;
  dp: number;
  rate: number;
  appr: number;
  ri: number;
  futureRate: number;
  lt: number;
};

export type WaitingCalcResult = {
  totalCost: number;
  monthlyCostRate: number;
  rentPaid: number;
  appreciationMissed: number;
  extraDown: number;
  extraClosing: number;
  equityMissed: number;
  lifetimePmtImpact: number;
  priceIncrease: number;
  futurePrice: number;
  pmtNow: number;
  pmtThen: number;
  monthlyPmtIncrease: number;
};

export function monthlyPayment(principal: number, annualRatePct: number, termMonths: number): number {
  const r = annualRatePct / 100 / 12;
  if (!Number.isFinite(principal) || principal <= 0) return 0;
  if (!Number.isFinite(termMonths) || termMonths <= 0) return 0;
  if (r === 0) return principal / termMonths;
  return (principal * (r * Math.pow(1 + r, termMonths))) / (Math.pow(1 + r, termMonths) - 1);
}

export function calcCostForMonths(waitMonths: number, inputs: WaitingInputs): WaitingCalcResult {
  const safeMonths = Math.max(1, Math.floor(waitMonths));
  const {
    hp,
    dp,
    rate,
    appr,
    ri,
    futureRate,
    rent,
    lt,
  } = inputs;

  const dpPct = dp / 100;
  const apprRate = appr / 100;
  const riRate = ri / 100;
  const termMos = lt * 12;
  const downNow = hp * dpPct;
  const closingNow = hp * 0.03;

  let rentPaid = 0;
  let curRent = rent;
  for (let m = 1; m <= safeMonths; m++) {
    if (m > 1 && (m - 1) % 12 === 0) curRent *= 1 + riRate;
    rentPaid += curRent;
  }

  const futurePrice = hp * Math.pow(1 + apprRate / 12, safeMonths);
  const priceIncrease = futurePrice - hp;

  const downThen = futurePrice * dpPct;
  const extraDown = downThen - downNow;
  const closingThen = futurePrice * 0.03;
  const extraClosing = closingThen - closingNow;

  const loanNow = hp * (1 - dpPct);
  const pmtNow = monthlyPayment(loanNow, rate, termMos);
  const loanThen = futurePrice * (1 - dpPct);
  const pmtThen = monthlyPayment(loanThen, futureRate, termMos);
  const monthlyPmtIncrease = pmtThen - pmtNow;
  const lifetimePmtImpact = monthlyPmtIncrease * termMos;

  let equityMissed = 0;
  let bal = hp * (1 - dpPct);
  const r = rate / 100 / 12;
  const pmt = monthlyPayment(bal, rate, termMos);
  for (let m = 0; m < safeMonths; m++) {
    const intP = bal * r;
    const prinP = pmt - intP;
    equityMissed += prinP;
    bal -= prinP;
  }

  const totalCost = rentPaid + priceIncrease + extraDown + extraClosing;
  const monthlyCostRate = totalCost / safeMonths;

  return {
    totalCost: Math.round(totalCost),
    monthlyCostRate: Math.round(monthlyCostRate),
    rentPaid: Math.round(rentPaid),
    appreciationMissed: Math.round(priceIncrease),
    extraDown: Math.round(extraDown),
    extraClosing: Math.round(extraClosing),
    equityMissed: Math.round(equityMissed),
    lifetimePmtImpact: Math.round(lifetimePmtImpact),
    priceIncrease: Math.round(priceIncrease),
    futurePrice: Math.round(futurePrice),
    pmtNow: Math.round(pmtNow),
    pmtThen: Math.round(pmtThen),
    monthlyPmtIncrease: Math.round(monthlyPmtIncrease),
  };
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

/** Eyebrow / badge: 1–11 months, 12 = 1 year, 13+ as years */
export function formatWaitPeriodLabel(months: number): string {
  const m = Math.max(1, Math.floor(months));
  if (m < 12) return m === 1 ? "1 month" : `${m} months`;
  if (m === 12) return "1 year";
  const y = m / 12;
  const rounded = Math.round(y * 10) / 10;
  const s = rounded % 1 === 0 ? String(Math.round(rounded)) : String(rounded);
  return `${s} years`;
}

/** Compact: "6 mo", "1 yr", "1y 3m" */
export function formatCompactWait(months: number): string {
  const m = Math.max(1, Math.floor(months));
  if (m < 12) return `${m} mo`;
  if (m === 12) return "1 yr";
  const y = Math.floor(m / 12);
  const mo = m % 12;
  if (mo === 0) return `${y}y`;
  return `${y}y ${mo}m`;
}

export const SCENARIO_PRESETS = [3, 6, 12, 18, 24, 36] as const;

export function scenarioMonthsForStrip(waitMonths: number): number[] {
  const s = new Set<number>([...SCENARIO_PRESETS, Math.max(1, Math.floor(waitMonths))]);
  return Array.from(s).sort((a, b) => a - b);
}

export function scenarioLabel(mo: number): string {
  if (mo < 12) return `${mo} mo`;
  if (mo === 12) return "1 yr";
  if (mo % 12 === 0) return `${mo / 12} yrs`;
  const y = Math.floor(mo / 12);
  const m = mo % 12;
  return `${y}y ${m}m`;
}

/** Localized variants — pass `t` from useLanguage(). */
export function formatWaitPeriodLabelI18n(months: number, t: (key: string) => string): string {
  const m = Math.max(1, Math.floor(months));
  if (m < 12) return m === 1 ? `1 ${t("tool.waiting.time.month")}` : `${m} ${t("tool.waiting.time.months")}`;
  if (m === 12) return `1 ${t("tool.waiting.time.year")}`;
  const y = m / 12;
  const rounded = Math.round(y * 10) / 10;
  const s = rounded % 1 === 0 ? String(Math.round(rounded)) : String(rounded);
  return `${s} ${t("tool.waiting.time.years")}`;
}

export function formatCompactWaitI18n(months: number, t: (key: string) => string): string {
  const m = Math.max(1, Math.floor(months));
  if (m < 12) return m === 1 ? `1 ${t("tool.waiting.time.month")}` : `${m} ${t("tool.waiting.time.months")}`;
  if (m === 12) return t("tool.waiting.time.scenario12");
  const y = Math.floor(m / 12);
  const mo = m % 12;
  if (mo === 0) return `${y}${t("tool.waiting.time.yChar")}`;
  return `${y}${t("tool.waiting.time.yChar")} ${mo}${t("tool.waiting.time.mChar")}`;
}

export function scenarioLabelI18n(mo: number, t: (key: string) => string): string {
  if (mo < 12) return mo === 1 ? `1 ${t("tool.waiting.time.month")}` : `${mo} ${t("tool.waiting.time.months")}`;
  if (mo === 12) return t("tool.waiting.time.scenario12");
  if (mo % 12 === 0) return t("tool.waiting.time.scenarioNYrs").replace("{n}", String(mo / 12));
  const y = Math.floor(mo / 12);
  const m = mo % 12;
  return t("tool.waiting.time.scenarioYrMo").replace("{y}", String(y)).replace("{m}", String(m));
}
