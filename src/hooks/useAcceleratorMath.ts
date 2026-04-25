/** Pure principal prepayment / amortization math for The Principal Accelerator. */

export type PaymentFreq = "monthly" | "biweekly" | "annual" | "onetime";

export type AcceleratorInputs = {
  principal: number;
  rate: number;
  termYrs: number;
  paidYrs: number;
  extraAmt: number;
  freq: PaymentFreq;
};

export type YearPoint = {
  year: number;
  balance: number;
  totalInterest: number;
};

export type ScheduleResult = {
  months: number;
  totalInterest: number;
  payment: number;
  byYear: YearPoint[];
};

export function monthlyExtra(extraAmt: number, freq: PaymentFreq): number {
  if (freq === "monthly") return extraAmt;
  if (freq === "biweekly") return (extraAmt * 26) / 12;
  if (freq === "annual") return extraAmt / 12;
  if (freq === "onetime") return 0;
  return extraAmt;
}

export function buildSchedule(
  principal: number,
  annualRate: number,
  termMonths: number,
  extraMonthly: number,
  oneTime = 0,
): ScheduleResult {
  const r = annualRate / 100 / 12;
  const stdPmt =
    r === 0
      ? principal / termMonths
      : (principal * (r * Math.pow(1 + r, termMonths))) / (Math.pow(1 + r, termMonths) - 1);

  let bal = principal - oneTime;
  let totalInt = 0;
  let month = 0;
  const byYear: YearPoint[] = [];

  while (bal > 0.01 && month < termMonths) {
    const intPmt = bal * r;
    const prinPmt = Math.min(stdPmt - intPmt + extraMonthly, bal);
    totalInt += intPmt;
    bal = Math.max(0, bal - prinPmt);
    month++;
    if (month % 12 === 0 || bal <= 0.01) {
      byYear.push({
        year: Math.ceil(month / 12),
        balance: Math.round(bal),
        totalInterest: Math.round(totalInt),
      });
    }
  }

  return { months: month, totalInterest: totalInt, payment: stdPmt, byYear };
}

export function runCalculation(inputs: AcceleratorInputs) {
  const { principal, rate, termYrs, paidYrs, extraAmt, freq } = inputs;

  const paidClamped = Math.max(0, Math.min(paidYrs, Math.max(0, termYrs - 1)));
  const termMonths = Math.max(1, (termYrs - paidClamped) * 12);

  const extraMo = monthlyExtra(extraAmt, freq);
  const oneTime = freq === "onetime" ? extraAmt : 0;

  const base = buildSchedule(principal, rate, termMonths, 0, 0);
  const accel = buildSchedule(principal, rate, termMonths, extraMo, oneTime);

  const monthsSaved = Math.max(0, base.months - accel.months);
  const yearsSaved = Math.floor(monthsSaved / 12);
  const moSaved = monthsSaved % 12;
  const intSaved = Math.max(0, base.totalInterest - accel.totalInterest);

  const basePayoff = paidClamped + Math.ceil(base.months / 12);
  const accelPayoff = paidClamped + Math.ceil(accel.months / 12);

  const totalExtraPaid =
    freq === "onetime" ? extraAmt : extraMo * accel.months;

  let effectiveReturn = 0;
  if (totalExtraPaid > 0 && Number.isFinite(intSaved)) {
    const er = (intSaved / totalExtraPaid) * 100;
    effectiveReturn = Number.isFinite(er) && er < 1e6 ? er : 0;
  }

  return {
    base,
    accel,
    monthsSaved,
    yearsSaved,
    moSaved,
    intSaved,
    basePayoff,
    accelPayoff,
    effectiveReturn,
    extraMo,
    termMonths,
    paidClamped,
  };
}

export function fmtK(n: number): string {
  const a = Math.abs(n);
  if (a >= 1_000_000) return "$" + (a / 1_000_000).toFixed(2) + "M";
  if (a >= 1000) return "$" + (a / 1000).toFixed(1) + "k";
  return "$" + Math.round(n);
}

export function fmt(n: number): string {
  return "$" + Math.abs(Math.round(n)).toLocaleString("en-US");
}

export function chartYFmt(v: number): string {
  const a = Math.abs(v);
  if (a >= 1_000_000) return "$" + (v / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (a >= 1000) return "$" + Math.round(v / 1000) + "k";
  return "$" + Math.round(v);
}

export function tooltipMoney(v: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
}

export const defaultAcceleratorState = () => ({
  bal: 400000,
  rate: 6.75,
  term: 30,
  paid: 0,
  extra: 200,
  freq: "monthly" as PaymentFreq,
});
