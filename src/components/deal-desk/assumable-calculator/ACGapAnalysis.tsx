import type { AssumableResults } from "../../../hooks/useAssumableMath";
import { fmt, fmtK } from "../../../hooks/useAssumableMath";

type Props = { results: AssumableResults };

export function ACGapAnalysis({ results }: Props) {
  const { purchasePrice, loanBal, equityGap, gapRate, pmtGap, blendedRate, mktRate } = results;
  const diff = Math.abs(blendedRate - mktRate);
  const lowerOrHigher = blendedRate < mktRate ? "lower" : "higher";

  return (
    <div id="ac-gap-analysis" className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">
        Equity gap analysis — what the buyer needs to bridge
      </h3>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-slate-200/80 bg-[#F4F6F9] px-3 py-3 text-center">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-wide text-slate-500">Purchase price</p>
          <p className="mt-1 font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">{fmtK(purchasePrice)}</p>
        </div>
        <div className="rounded-lg border border-slate-200/80 bg-[#F4F6F9] px-3 py-3 text-center">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-wide text-slate-500">Assumed loan balance</p>
          <p className="mt-1 font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">{fmtK(loanBal)}</p>
        </div>
        <div className="rounded-lg border border-slate-200/80 bg-[#F4F6F9] px-3 py-3 text-center">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-wide text-slate-500">Equity gap</p>
          <p className="mt-1 font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">{fmtK(equityGap)}</p>
        </div>
        <div className="rounded-lg border border-slate-200/80 bg-[#F4F6F9] px-3 py-3 text-center">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-wide text-slate-500">Gap payment at {gapRate.toFixed(3)}%</p>
          <p className="mt-1 font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">
            {equityGap > 0 ? `${fmt(pmtGap)}/mo` : "No gap needed"}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-[10px] border-[1.5px] border-[rgba(11,42,74,0.15)] bg-[rgba(11,42,74,0.04)] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-sans text-[12px] font-medium text-[#0B2A4A]">Blended rate across both loans</p>
          <p className="mt-1 font-sans text-[12px] text-slate-500">
            vs. {mktRate.toFixed(3)}% on a new single loan — {diff.toFixed(3)}% {lowerOrHigher}
          </p>
        </div>
        <p className="shrink-0 font-[Georgia,serif] text-[22px] font-medium text-[#0B2A4A]">{blendedRate.toFixed(3)}%</p>
      </div>

      {equityGap > 250000 ? (
        <p className="mt-4 rounded-lg border border-amber-200/80 bg-amber-50 px-3 py-2 font-sans text-[12px] leading-relaxed text-amber-950">
          ⚠ The equity gap is substantial — confirm that gap financing at {gapRate.toFixed(3)}% is available for this buyer profile before presenting
          this option.
        </p>
      ) : null}
    </div>
  );
}
