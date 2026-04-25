import type { ReactNode } from "react";
import type { RLEResults } from "../../../hooks/useRLEMath";
import { fmt, fmtK } from "../../../hooks/useRLEMath";

type Props = { results: RLEResults };

export function RLEExtensionAnalysis({ results }: Props) {
  const { extFee, ext15Cost, ext30Cost, ext45Cost, monthlyRisk, lifetimeRisk, riseScenario, extBreakeven } = results;

  const rows: { label: string; value: ReactNode; valueClass?: string }[] = [
    { label: "Extension fee rate", value: `${extFee}% of loan per 15 days` },
    { label: "15-day extension cost", value: fmt(ext15Cost), valueClass: "text-[#A32D2D]" },
    { label: "30-day extension cost", value: fmt(ext30Cost), valueClass: "text-[#A32D2D]" },
    { label: "45-day extension cost", value: fmt(ext45Cost), valueClass: "text-[#A32D2D]" },
    {
      label: `Cost of rates rising +${riseScenario}% instead`,
      value: (
        <>
          +{fmt(monthlyRisk)}/mo forever ({fmtK(lifetimeRisk)} total)
        </>
      ),
      valueClass: "text-[#A32D2D]",
    },
    {
      label: "Verdict: if closing delayed",
      value: "Always pay the extension fee",
      valueClass: "font-medium text-[#3B6D11]",
    },
    {
      label: "Extension fee break-even",
      value: `${extBreakeven.toFixed(1)} months of payment savings to recover`,
    },
  ];

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">
        Extension fee analysis — if your closing is delayed
      </h3>
      <dl className="mt-4 divide-y divide-slate-200/80">
        {rows.map((row, i) => (
          <div key={row.label} className="flex flex-col justify-between gap-1 py-3 sm:flex-row sm:items-center">
            <dt className="text-[12px] text-slate-600">{row.label}</dt>
            <dd className={`text-right text-[13px] tabular-nums ${row.valueClass ?? "text-slate-700"}`}>{row.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
        A {fmt(ext15Cost)} extension fee is almost always better than accepting a higher rate. {fmtK(lifetimeRisk)} in extra
        lifetime interest vs. {fmt(ext15Cost)} extension fee — the math is clear.
      </p>
    </div>
  );
}
