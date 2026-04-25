import type { CreditCalcResult } from "../../../hooks/useCreditMath";
import { fmt, fmtK } from "../../../hooks/useCreditMath";

type Props = { results: CreditCalcResult };

export function CreditMetrics({ results }: Props) {
  const { curPmt, tgtPmt, curRate, tgtRate, monthlySavings, lifetimeSavings, term } = results;
  const cardCls =
    "rounded-lg border border-[var(--color-border-tertiary,#e2e8f0)] bg-[var(--color-background-secondary,#f8fafc)] px-4 py-4 sm:px-5";

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className={cardCls}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Current monthly payment</p>
        <p className="mt-2 font-[Georgia,serif] text-[1.35rem] font-medium text-[#0B2A4A]">${fmt(curPmt)}</p>
        <p className="mt-1 text-[11px] text-slate-500">at {curRate.toFixed(3)}% rate</p>
      </div>
      <div className={cardCls}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Target monthly payment</p>
        <p className="mt-2 font-[Georgia,serif] text-[1.35rem] font-medium text-[#0B2A4A]">${fmt(tgtPmt)}</p>
        <p className="mt-1 text-[11px] text-slate-500">at {tgtRate.toFixed(3)}% rate</p>
      </div>
      <div className={cardCls}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Monthly savings</p>
        <p className="mt-2 font-[Georgia,serif] text-[1.35rem] font-medium text-[#27500A]">${fmt(monthlySavings)}</p>
        <p className="mt-1 text-[11px] text-slate-500">every month for {term} years</p>
      </div>
      <div className={cardCls}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Total interest saved</p>
        <p className="mt-2 font-[Georgia,serif] text-[1.35rem] font-medium text-[#27500A]">{fmtK(lifetimeSavings)}</p>
        <p className="mt-1 text-[11px] text-slate-500">over the loan lifetime</p>
      </div>
    </div>
  );
}
