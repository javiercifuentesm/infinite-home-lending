import type { CreditCalcResult } from "../../../hooks/useCreditMath";
import { fmt, fmtK } from "../../../hooks/useCreditMath";

type Props = { results: CreditCalcResult };

export function CreditTimeline({ results }: Props) {
  const { timeframe, monthlySavings, lifetimeSavings, term } = results;
  const rowCls = "flex items-center justify-between border-b border-[var(--color-border-tertiary,#e2e8f0)] py-3 text-[13px] last:border-b-0";
  const green = "text-[#27500A]";

  return (
    <div className="rounded-lg border border-[var(--color-border-tertiary,#e2e8f0)] bg-white px-4 py-4 sm:px-6">
      <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">
        The improvement investment: what {timeframe} months buys you
      </h3>
      <div className="mt-2 divide-y divide-[var(--color-border-tertiary,#e2e8f0)]">
        <div className={rowCls}>
          <span className="text-slate-600">Time to improve score</span>
          <span className="font-medium text-[#0B2A4A]">{timeframe} months</span>
        </div>
        <div className={rowCls}>
          <span className="text-slate-600">Rent paid while improving</span>
          <span className="text-right text-slate-600">Ongoing (sunk cost regardless)</span>
        </div>
        <div className={rowCls}>
          <span className="text-slate-600">Monthly savings once you close</span>
          <span className={`font-medium ${green}`}>${fmt(monthlySavings)}/mo</span>
        </div>
        <div className={rowCls}>
          <span className="text-slate-600">Break-even on the wait</span>
          <span className={`font-medium ${green}`}>Month 1 of your mortgage</span>
        </div>
        <div className={`${rowCls} border-b-0`}>
          <span className="text-slate-600">Total return over {term} years</span>
          <span className={`font-medium ${green}`} style={{ fontWeight: 500 }}>
            {fmtK(lifetimeSavings)}
          </span>
        </div>
      </div>
    </div>
  );
}
