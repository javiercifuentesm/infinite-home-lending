import type { ReactNode } from "react";
import type { SellerNetResults } from "../../../hooks/useSellerNetMath";
import { fmt, fmtK } from "../../../hooks/useSellerNetMath";

type Props = { results: SellerNetResults };

const cell = "px-2 py-2.5 text-right font-sans text-[12px] tabular-nums sm:px-3";
const cellHideNarrow = `${cell} max-[399px]:hidden`;
const labelCell = "px-2 py-2.5 font-sans text-[12px] sm:px-3";

function SectionHeader({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))] bg-[rgba(11,42,74,0.03)]">
      <div className="col-span-4 px-2 py-2 font-sans text-[11px] font-medium uppercase tracking-wide text-[#0B2A4A] sm:px-3">{children}</div>
    </div>
  );
}

export function SNSNetSheetTable({ results }: Props) {
  const { ask, below3, below5, payoff, comm, jurisdictionName, concession, hoa, warranty, titleFee, taxPro, other } = results;

  const showConcession = concession > 0;
  const showHoa = hoa > 0;
  const showWarranty = warranty > 0;
  const showOther = other > 0;

  const rec = ask.recordingFee;

  return (
    <div
      id="sns-net-sheet-table"
      className="sns-net-sheet-table overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm"
    >
      <div className="grid grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))] border-b border-slate-200/80 bg-slate-100/90">
        <div className={`${labelCell} text-[10px] font-semibold uppercase tracking-wide text-slate-600`}>Line item</div>
        <div className={`${cell} text-[10px] font-semibold uppercase tracking-wide text-slate-600`}>At ask</div>
        <div className={`${cell} text-[10px] font-semibold uppercase tracking-wide text-slate-600`}>3% below</div>
        <div className={`${cellHideNarrow} text-[10px] font-semibold uppercase tracking-wide text-slate-600`}>5% below</div>
      </div>

      <SectionHeader>Sale proceeds</SectionHeader>
      <div className="grid grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))] border-b border-slate-200/60">
        <div className={`${labelCell} text-[#27500A]`}>Gross sale price</div>
        <div className={`${cell} font-medium text-[#27500A]`}>{fmt(ask.price)}</div>
        <div className={`${cell} font-medium text-[#27500A]`}>{fmt(below3.price)}</div>
        <div className={`${cellHideNarrow} font-medium text-[#27500A]`}>{fmt(below5.price)}</div>
      </div>

      <SectionHeader>Deductions</SectionHeader>
      <div className="grid grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))] border-b border-slate-200/60">
        <div className={`${labelCell} pl-5 text-[#A32D2D]`}>Mortgage payoff</div>
        <div className={`${cell} text-[#A32D2D]`}>−{fmt(payoff)}</div>
        <div className={`${cell} text-[#A32D2D]`}>−{fmt(payoff)}</div>
        <div className={`${cellHideNarrow} text-[#A32D2D]`}>−{fmt(payoff)}</div>
      </div>
      <div className="grid grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))] border-b border-slate-200/60">
        <div className={`${labelCell} pl-5 text-[#A32D2D]`}>Commission ({comm}%)</div>
        <div className={`${cell} text-[#A32D2D]`}>−{fmt(ask.commAmt)}</div>
        <div className={`${cell} text-[#A32D2D]`}>−{fmt(below3.commAmt)}</div>
        <div className={`${cellHideNarrow} text-[#A32D2D]`}>−{fmt(below5.commAmt)}</div>
      </div>
      <div className="grid grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))] border-b border-slate-200/60">
        <div className={`${labelCell} pl-5 text-[#A32D2D]`}>
          Transfer/grantor tax — {jurisdictionName}
        </div>
        <div className={`${cell} text-[#A32D2D]`}>−{fmt(ask.transferTax)}</div>
        <div className={`${cell} text-[#A32D2D]`}>−{fmt(below3.transferTax)}</div>
        <div className={`${cellHideNarrow} text-[#A32D2D]`}>−{fmt(below5.transferTax)}</div>
      </div>
      <div className="grid grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))] border-b border-slate-200/60">
        <div className={`${labelCell} pl-5 text-[#A32D2D]`}>Recording fee (est.)</div>
        <div className={`${cell} text-[#A32D2D]`}>−{fmt(rec)}</div>
        <div className={`${cell} text-[#A32D2D]`}>−{fmt(rec)}</div>
        <div className={`${cellHideNarrow} text-[#A32D2D]`}>−{fmt(rec)}</div>
      </div>
      <div className="grid grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))] border-b border-slate-200/60">
        <div className={`${labelCell} pl-5 text-[#A32D2D]`}>Title / settlement fee</div>
        <div className={`${cell} text-[#A32D2D]`}>−{fmt(titleFee)}</div>
        <div className={`${cell} text-[#A32D2D]`}>−{fmt(titleFee)}</div>
        <div className={`${cellHideNarrow} text-[#A32D2D]`}>−{fmt(titleFee)}</div>
      </div>
      <div className="grid grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))] border-b border-slate-200/60">
        <div className={`${labelCell} pl-5 text-[#A32D2D]`}>Property tax proration</div>
        <div className={`${cell} text-[#A32D2D]`}>−{fmt(taxPro)}</div>
        <div className={`${cell} text-[#A32D2D]`}>−{fmt(taxPro)}</div>
        <div className={`${cellHideNarrow} text-[#A32D2D]`}>−{fmt(taxPro)}</div>
      </div>

      {showConcession ? (
        <div className="grid grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))] border-b border-slate-200/60">
          <div className={`${labelCell} pl-5 text-[#A32D2D]`}>Seller concession / credit</div>
          <div className={`${cell} text-[#A32D2D]`}>−{fmt(concession)}</div>
          <div className={`${cell} text-[#A32D2D]`}>−{fmt(concession)}</div>
          <div className={`${cellHideNarrow} text-[#A32D2D]`}>−{fmt(concession)}</div>
        </div>
      ) : null}
      {showHoa ? (
        <div className="grid grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))] border-b border-slate-200/60">
          <div className={`${labelCell} pl-5 text-[#A32D2D]`}>HOA transfer fee</div>
          <div className={`${cell} text-[#A32D2D]`}>−{fmt(hoa)}</div>
          <div className={`${cell} text-[#A32D2D]`}>−{fmt(hoa)}</div>
          <div className={`${cellHideNarrow} text-[#A32D2D]`}>−{fmt(hoa)}</div>
        </div>
      ) : null}
      {showWarranty ? (
        <div className="grid grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))] border-b border-slate-200/60">
          <div className={`${labelCell} pl-5 text-[#A32D2D]`}>Home warranty</div>
          <div className={`${cell} text-[#A32D2D]`}>−{fmt(warranty)}</div>
          <div className={`${cell} text-[#A32D2D]`}>−{fmt(warranty)}</div>
          <div className={`${cellHideNarrow} text-[#A32D2D]`}>−{fmt(warranty)}</div>
        </div>
      ) : null}
      {showOther ? (
        <div className="grid grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))] border-b border-slate-200/60">
          <div className={`${labelCell} pl-5 text-[#A32D2D]`}>Other costs</div>
          <div className={`${cell} text-[#A32D2D]`}>−{fmt(other)}</div>
          <div className={`${cell} text-[#A32D2D]`}>−{fmt(other)}</div>
          <div className={`${cellHideNarrow} text-[#A32D2D]`}>−{fmt(other)}</div>
        </div>
      ) : null}

      <div className="grid grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))] bg-[#0B2A4A]">
        <div className="px-2 py-3 font-[Georgia,serif] text-[14px] font-medium text-[#C6A15B] sm:px-3">Estimated net proceeds</div>
        <div className={`px-2 py-3 text-right font-[Georgia,serif] text-[13px] font-medium text-[#9FE1CB] sm:px-3`}>{fmtK(ask.net)}</div>
        <div className={`px-2 py-3 text-right font-[Georgia,serif] text-[13px] font-medium text-white sm:px-3`}>{fmtK(below3.net)}</div>
        <div className={`max-[399px]:hidden px-2 py-3 text-right font-[Georgia,serif] text-[13px] font-medium text-white sm:px-3`}>
          {fmtK(below5.net)}
        </div>
      </div>
    </div>
  );
}
