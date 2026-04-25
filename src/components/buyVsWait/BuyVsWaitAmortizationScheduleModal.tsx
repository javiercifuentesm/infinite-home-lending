import { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { AmortizationScheduleRow } from "../../lib/buyVsWaitModel";
import { formatBuyVsWaitCurrency } from "../../lib/buyVsWaitModel";

type Props = {
  open: boolean;
  onClose: () => void;
  rows: AmortizationScheduleRow[];
  horizonMonths: number;
  horizonYears: number;
  interestRatePct: number;
  startingBalance: number;
  endingBalance: number;
  principalPaidDown: number;
  firstPayment: { interest: number; principal: number };
  lastPaymentInHorizon: { month: number; interest: number; principal: number };
};

function formatNoteRatePct(pct: number): string {
  const s = pct.toFixed(3).replace(/\.?0+$/, "");
  return `${s}%`;
}

function MiniPaymentMix({
  title,
  interest,
  principal,
}: {
  title: string;
  interest: number;
  principal: number;
}) {
  const t = Math.max(interest + principal, 1e-9);
  const wI = (interest / t) * 100;
  const wP = (principal / t) * 100;
  return (
    <div>
      <p className="type-body-xs font-medium text-slate-700">{title}</p>
      <div className="mt-1.5 flex h-1.5 w-full max-w-[11rem] overflow-hidden rounded-sm bg-slate-100" aria-hidden>
        <div className="h-full shrink-0 bg-gold/55" style={{ width: `${wI}%` }} />
        <div className="h-full shrink-0 bg-navy/78" style={{ width: `${wP}%` }} />
      </div>
      <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 type-body-xs text-slate-500">
        <li className="flex items-center gap-1">
          <span className="h-1.5 w-3 shrink-0 rounded-sm bg-navy/78" aria-hidden />
          Principal
        </li>
        <li className="flex items-center gap-1">
          <span className="h-1.5 w-3 shrink-0 rounded-sm bg-gold/55" aria-hidden />
          Interest
        </li>
      </ul>
    </div>
  );
}

export function BuyVsWaitAmortizationScheduleModal({
  open,
  onClose,
  rows,
  horizonMonths,
  horizonYears,
  interestRatePct,
  startingBalance,
  endingBalance,
  principalPaidDown,
  firstPayment,
  lastPaymentInHorizon,
}: Props) {
  const titleId = useId();
  const horizonLabel = horizonYears === 1 ? "1 year" : `${horizonYears} years`;
  const lastMonth = lastPaymentInHorizon.month;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1020] flex items-center justify-center overflow-y-auto bg-navy/40 p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        className="relative my-auto flex w-[95%] max-w-3xl max-h-[85vh] flex-col rounded-[4px] border border-slate-200/90 bg-white shadow-[0_16px_48px_rgba(10,25,47,0.14)]"
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
          <div>
            <h2 id={titleId} className="type-section-heading-sm text-navy">
              Payment breakdown over {horizonLabel}
            </h2>
            <p className="type-body-xs mt-1 text-slate-500">
              Months 1–{horizonMonths} · {formatNoteRatePct(interestRatePct)} note rate · Principal and interest only
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-[3px] p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        <div className="shrink-0 border-b border-slate-100 bg-slate-50/60 px-4 py-4 sm:px-5">
          <p className="type-label mb-3 text-navy/45">Loan balance and paydown</p>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
            <div>
              <p className="type-body-xs text-slate-500">Starting balance</p>
              <p className="type-metric mt-0.5 tabular-nums text-navy">{formatBuyVsWaitCurrency(startingBalance)}</p>
            </div>
            <div>
              <p className="type-body-xs text-slate-500">Balance after {horizonMonths} payments</p>
              <p className="type-metric mt-0.5 tabular-nums text-navy">{formatBuyVsWaitCurrency(endingBalance)}</p>
            </div>
            <div>
              <p className="type-body-xs text-slate-500">Principal paid down</p>
              <p className="type-metric mt-0.5 tabular-nums text-navy">{formatBuyVsWaitCurrency(principalPaidDown)}</p>
            </div>
            <div>
              <p className="type-body-xs text-slate-500">Selected horizon</p>
              <p className="type-metric mt-0.5 tabular-nums text-navy">
                {horizonMonths} months
              </p>
            </div>
          </div>
        </div>

        <div className="shrink-0 border-b border-slate-100 px-4 py-4 sm:px-5">
          <p className="type-label mb-3 text-navy/45">Payment mix</p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-8">
            <MiniPaymentMix title="Month 1" interest={firstPayment.interest} principal={firstPayment.principal} />
            <MiniPaymentMix
              title={`Month ${lastMonth}`}
              interest={lastPaymentInHorizon.interest}
              principal={lastPaymentInHorizon.principal}
            />
          </div>
          <p className="type-body-xs mt-4 text-slate-500">More of each payment goes toward principal over time.</p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 sm:px-5 sm:pb-5">
          <table className="type-table w-full min-w-[520px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-surface/80">
                <th className="type-table-title whitespace-nowrap py-3 pr-2" scope="col">
                  #
                </th>
                <th className="type-table-title whitespace-nowrap py-3 pr-2" scope="col">
                  Payment
                </th>
                <th className="type-table-title whitespace-nowrap py-3 pr-2" scope="col">
                  Principal
                </th>
                <th className="type-table-title whitespace-nowrap py-3 pr-2" scope="col">
                  Interest
                </th>
                <th className="type-table-title whitespace-nowrap py-3" scope="col">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.paymentNumber} className="border-b border-slate-100/90">
                  <td className="type-body-xs py-2.5 pr-2 tabular-nums text-slate-600">{row.paymentNumber}</td>
                  <td className="type-body-xs py-2.5 pr-2 tabular-nums text-navy">{formatBuyVsWaitCurrency(row.paymentAmount)}</td>
                  <td className="type-body-xs py-2.5 pr-2 tabular-nums text-navy">{formatBuyVsWaitCurrency(row.principal)}</td>
                  <td className="type-body-xs py-2.5 pr-2 tabular-nums text-slate-600">{formatBuyVsWaitCurrency(row.interest)}</td>
                  <td className="type-body-xs py-2.5 tabular-nums text-slate-600">{formatBuyVsWaitCurrency(row.remainingBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>,
    document.body
  );
}
