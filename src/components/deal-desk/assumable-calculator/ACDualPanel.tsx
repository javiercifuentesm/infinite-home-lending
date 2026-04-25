import type { ReactNode } from "react";
import type { AssumableResults } from "../../../hooks/useAssumableMath";
import { fmt, fmtK } from "../../../hooks/useAssumableMath";

type Props = { results: AssumableResults };

function loanLabel(lt: string): string {
  if (lt === "va") return "VA";
  if (lt === "fha") return "FHA";
  return "USDA";
}

function Row({ label, value, valueClass }: { label: string; value: ReactNode; valueClass?: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-slate-200/80 py-2 text-[11px] last:border-b-0 sm:flex-row sm:justify-between">
      <span className="text-slate-600">{label}</span>
      <span className={`font-medium ${valueClass ?? "text-[#0B2A4A]"}`}>{value}</span>
    </div>
  );
}

function RowRed({ label, value, valueClass }: { label: string; value: ReactNode; valueClass?: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-slate-200/80 py-2 text-[11px] last:border-b-0 sm:flex-row sm:justify-between">
      <span className="text-slate-600">{label}</span>
      <span className={`font-medium ${valueClass ?? "text-[#A32D2D]"}`}>{value}</span>
    </div>
  );
}

export function ACDualPanel({ results }: Props) {
  const {
    loanType,
    assumedRate,
    loanBal,
    termYrs,
    equityGap,
    pmtAssumed,
    pmtGap,
    blendedRate,
    totalFees,
    totalAssumed,
    purchasePrice,
    mktRate,
    pmtNewLoan,
    totalNew,
  } = results;

  const lt = loanLabel(loanType);

  return (
    <div className="space-y-3">
      <p className="font-sans text-[11px] font-semibold uppercase tracking-wide text-slate-500">Side-by-side comparison</p>
      <div id="ac-dual-panel" className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm">
          <div className="bg-[rgba(11,42,74,0.05)] px-4 py-3">
            <p className="font-sans text-[12px] font-semibold text-[#0B2A4A]">Option A — Assume the {lt} Loan</p>
          </div>
          <div className="flex-1 p-4">
            <p className="font-[Georgia,serif] text-[28px] font-medium text-[#0B2A4A]">{fmt(totalAssumed)}</p>
            <p className="mt-1 font-sans text-[12px] text-slate-500">/mo total (assumed + gap financing)</p>
            <div className="mt-4 space-y-0">
              <Row label="Assumed loan balance" value={fmtK(loanBal)} />
              <Row label="Assumed rate" value={`${assumedRate.toFixed(3)}%`} valueClass="text-[#27500A]" />
              <Row label="Assumed P&I payment" value={`${fmt(pmtAssumed)}/mo`} valueClass="text-[#27500A]" />
              <Row label="Equity gap to finance" value={fmtK(equityGap)} />
              <Row
                label="Gap financing payment"
                value={equityGap > 0 ? `${fmt(pmtGap)}/mo` : "$0 — no gap"}
              />
              <Row label="Blended rate (both loans)" value={`${blendedRate.toFixed(3)}%`} />
              <Row label="Remaining loan term" value={`${termYrs} years`} />
              <Row label="Assumption fees (est.)" value={fmt(totalFees)} />
            </div>
          </div>
        </div>

        <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm">
          <div className="bg-[rgba(163,45,45,0.05)] px-4 py-3">
            <p className="font-sans text-[12px] font-semibold text-[#A32D2D]">Option B — New Loan at Market Rate</p>
          </div>
          <div className="flex-1 p-4">
            <p className="font-[Georgia,serif] text-[28px] font-medium text-[#A32D2D]">{fmt(totalNew)}</p>
            <p className="mt-1 font-sans text-[12px] text-slate-500">/mo at {mktRate.toFixed(3)}% — 30-year fixed</p>
            <div className="mt-4 space-y-0">
              <RowRed label="New loan amount" value={fmtK(purchasePrice)} />
              <RowRed label="Interest rate" value={`${mktRate.toFixed(3)}%`} valueClass="text-[#A32D2D]" />
              <RowRed label="Monthly P&I" value={`${fmt(pmtNewLoan)}/mo`} valueClass="text-[#A32D2D]" />
              <RowRed label="Equity gap to finance" value="None — single loan" />
              <RowRed label="Gap financing payment" value="—" />
              <RowRed label="Effective rate" value={`${mktRate.toFixed(3)}%`} valueClass="text-[#A32D2D]" />
              <RowRed label="Loan term" value="30 years" />
              <RowRed label="Origination fees (est.)" value="$3,000–$6,000" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
