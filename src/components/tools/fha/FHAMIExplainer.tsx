import type { ReactNode } from "react";
import type { FHAResult } from "../../../hooks/useFHAMath";
import { fmt, fmtK } from "../../../hooks/useFHAMath";

type Props = { results: FHAResult };

export function FHAMIExplainer({ results }: Props) {
  const {
    pmiRate,
    pmiMoInit,
    pmiRemoveYr,
    fhaUFMIP,
    mipMoInit,
    convMiTotal,
    fhaMiTotal,
    dpPercentFha,
  } = results;

  const row = (label: string, value: ReactNode, last?: boolean) => (
    <div
      className={`flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${last ? "" : "border-b border-[var(--color-border-tertiary)]"}`}
    >
      <span className="text-[12px] text-[var(--color-text-tertiary)]">{label}</span>
      <span className="text-[12px] font-medium">{value}</span>
    </div>
  );

  return (
    <div className="rounded-xl border border-[var(--color-border-tertiary)] bg-white p-5 sm:p-6">
      <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">Mortgage insurance: the key difference explained</h3>
      <div className="mt-4">
        {row(
          "Conventional PMI monthly",
          pmiRate === 0 ? <span className="text-[#27500A]">$0 (no PMI required)</span> : fmt(pmiMoInit),
        )}
        {row(
          "PMI cancellation",
          pmiRate === 0 ? (
            <span className="text-[#27500A]">N/A — no PMI</span>
          ) : pmiRemoveYr ? (
            `Automatically at year ~${pmiRemoveYr}`
          ) : (
            "When LTV reaches 80%"
          ),
        )}
        {row("FHA upfront MIP (1.75%)", <span className="text-[#A32D2D]">{fmt(fhaUFMIP)} (rolled into loan)</span>)}
        {row("FHA annual MIP monthly", <span className="text-[#A32D2D]">{fmt(mipMoInit)}</span>)}
        {row(
          "FHA MIP cancellation",
          dpPercentFha >= 10 ? (
            <span className="text-[#854F0B]">After 11 years (10%+ down)</span>
          ) : (
            <span className="text-[#A32D2D]">Never — must refinance to remove</span>
          ),
        )}
        {row("Total PMI paid (Conventional)", fmtK(convMiTotal))}
        {row("Total MIP paid (FHA incl. upfront)", <span className="text-[#854F0B]">{fmtK(fhaMiTotal)}</span>, true)}
      </div>
    </div>
  );
}
