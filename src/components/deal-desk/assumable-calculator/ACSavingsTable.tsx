import type { AssumableResults } from "../../../hooks/useAssumableMath";
import { fmt, fmtK } from "../../../hooks/useAssumableMath";

type Props = { results: AssumableResults };

export function ACSavingsTable({ results }: Props) {
  const {
    monthlySaving,
    annualSaving,
    totalIntAssumed,
    totalIntNew,
    lifetimeSaving,
    totalFees,
    breakEvenMos,
    rateAdvantage,
  } = results;

  const pos = monthlySaving >= 0;
  const moneyColor = pos ? "text-[#27500A]" : "text-[#A32D2D]";
  const lifeColor =
    lifetimeSaving >= 0 ? "font-[Georgia,serif] text-[#C6A15B]" : "font-[Georgia,serif] text-[#A32D2D]";

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <p className="font-sans text-[11px] font-semibold uppercase tracking-wide text-slate-500">Savings breakdown</p>
      <div className="mt-4 overflow-hidden rounded-lg border border-slate-200/80">
        <div className="flex justify-between bg-slate-100/90 px-4 py-2 font-sans text-[11px] font-semibold uppercase tracking-wide text-slate-600">
          <span>Savings metric</span>
          <span>Amount</span>
        </div>
        <div className="divide-y divide-slate-200/80">
          <div className={`flex justify-between px-4 py-3 font-sans text-[12px] ${moneyColor}`}>
            <span>Monthly saving vs. new loan</span>
            <span className="font-medium">
              {monthlySaving >= 0 ? "+" : ""}
              {fmt(monthlySaving)}
              /mo
            </span>
          </div>
          <div className={`flex justify-between px-4 py-3 font-sans text-[12px] ${moneyColor}`}>
            <span>Annual saving</span>
            <span className="font-medium">
              {annualSaving >= 0 ? "+" : ""}
              {fmt(annualSaving)}/yr
            </span>
          </div>
          <div className="flex justify-between px-4 py-3 font-sans text-[12px] text-[#0B2A4A]">
            <span>Total interest — assumption path</span>
            <span className="font-medium">{fmtK(totalIntAssumed)}</span>
          </div>
          <div className="flex justify-between px-4 py-3 font-sans text-[12px] text-[#A32D2D]">
            <span>Total interest — new loan path</span>
            <span className="font-medium">{fmtK(totalIntNew)}</span>
          </div>
          <div className={`flex justify-between px-4 py-3 font-sans text-[12px] ${lifeColor}`}>
            <span>Lifetime interest saving (est.)</span>
            <span className="font-medium">
              {lifetimeSaving >= 0 ? "+" : ""}
              {fmtK(lifetimeSaving)}
            </span>
          </div>
          <div className="flex justify-between px-4 py-3 font-sans text-[12px] text-[#0B2A4A]">
            <span>Assumption fees (est.)</span>
            <span className="font-medium">{fmt(totalFees)}</span>
          </div>
          <div className="flex justify-between px-4 py-3 font-sans text-[12px] text-[#0B2A4A]">
            <span>Months to recoup fees</span>
            <span className="font-medium">{breakEvenMos ? `${breakEvenMos} months` : "N/A"}</span>
          </div>
          <div
            className={`flex justify-between px-4 py-3 font-sans text-[12px] ${
              rateAdvantage > 0 ? "text-[#27500A]" : "text-[#A32D2D]"
            }`}
          >
            <span>Rate advantage over new loan</span>
            <span className="font-medium">
              {rateAdvantage > 0 ? "−" : "+"}
              {Math.abs(rateAdvantage).toFixed(3)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
