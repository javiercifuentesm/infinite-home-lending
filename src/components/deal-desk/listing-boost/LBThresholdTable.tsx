import type { ListingBoostResults } from "../../../hooks/useListingBoostMath";
import { fmtK } from "../../../hooks/useListingBoostMath";

type Props = { results: ListingBoostResults };

export function LBThresholdTable({ results }: Props) {
  const { budget, incCurrent, incA, incB, incC, incDropA, incDropB } = results;
  const incDropC = results.incCurrent - incC;

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">
        Minimum household income to qualify at each scenario (estimated)
      </h3>
      <div className="mt-5 divide-y divide-slate-200/90">
        <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-sans text-[12px] text-slate-700">Today — list price, no concession</span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-sans text-[12px] font-semibold text-[#0B2A4A]">{fmtK(incCurrent)}/yr</span>
            <span className="font-sans text-[11px] text-slate-500">—</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-sans text-[12px] text-slate-700">Scenario A — {fmtK(budget)} price cut</span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-sans text-[12px] font-semibold text-[#0B2A4A]">{fmtK(incA)}/yr</span>
            <span className="inline-flex items-center rounded-full bg-[rgba(39,80,10,0.08)] px-2 py-0.5 font-sans text-[11px] font-medium text-[#27500A]">
              ↓ {fmtK(incDropA)} less income needed
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-sans text-[12px] text-slate-700">Scenario B — 2-1 Buydown (Year 1 qualifying)</span>
          <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-2">
            <span className="font-sans text-[12px] font-semibold text-[#0B2A4A]">{fmtK(incB)}/yr</span>
            <div className="flex flex-wrap items-center justify-end gap-1">
              <span className="inline-flex items-center rounded-full bg-[rgba(39,80,10,0.08)] px-2 py-0.5 font-sans text-[11px] font-medium text-[#27500A]">
                ↓ {fmtK(incDropB)} less income needed
              </span>
              {incDropB > incDropA ? (
                <span className="font-sans text-[10px] font-medium text-[#27500A]">(more than price cut)</span>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-sans text-[12px] text-slate-700">Scenario C — 1-0 Buydown (Year 1 qualifying)</span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-sans text-[12px] font-semibold text-[#0B2A4A]">{fmtK(incC)}/yr</span>
            <span className="inline-flex items-center rounded-full bg-[rgba(39,80,10,0.08)] px-2 py-0.5 font-sans text-[11px] font-medium text-[#27500A]">
              ↓ {fmtK(incDropC)} less income needed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
