import { useState } from "react";
import type { BuyVsWaitResult } from "../../lib/buyVsWaitModel";
import { formatBuyVsWaitCurrency } from "../../lib/buyVsWaitModel";
import { BuyVsWaitAmortizationScheduleModal } from "./BuyVsWaitAmortizationScheduleModal";

type Props = {
  result: BuyVsWaitResult;
  /** Note rate used for the amortization schedule (committed scenario). */
  interestRatePct: number;
  /** When true, heading is rendered by the parent (LoanStructure-style section label). */
  hideHeading?: boolean;
};

function splitBar(interest: number, principal: number) {
  const t = Math.max(interest + principal, 1e-9);
  const wI = (interest / t) * 100;
  const wP = (principal / t) * 100;
  return (
    <div className="mt-1.5 flex h-1.5 w-full max-w-[14rem] overflow-hidden rounded-sm bg-slate-100" aria-hidden>
      <div className="h-full shrink-0 bg-gold/55" style={{ width: `${wI}%` }} />
      <div className="h-full shrink-0 bg-navy/78" style={{ width: `${wP}%` }} />
    </div>
  );
}

export function BuyVsWaitAmortizationSnapshot({ result, interestRatePct, hideHeading = false }: Props) {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const snap = result.amortizationSnapshot;
  const eq = result.equity;
  const { horizonYears, horizonMonths, amortizationScheduleRows } = result;

  if (snap.startingBalance <= 0) {
    return null;
  }

  const horizonLabel = horizonYears === 1 ? "1 year" : `${horizonYears} years`;
  const lastMonth = snap.lastPaymentInHorizon.month;
  const fi = snap.firstPayment.interest;
  const fp = snap.firstPayment.principal;
  const li = snap.lastPaymentInHorizon.interest;
  const lp = snap.lastPaymentInHorizon.principal;

  return (
    <section aria-labelledby="bvw-amort-snapshot-heading" className="bvw-card-surface bvw-card-pad">
      <div
        className={`mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4 ${
          hideHeading ? "sm:justify-end" : ""
        }`}
      >
        {!hideHeading ? (
          <div>
            <h2 id="bvw-amort-snapshot-heading" className="type-section-heading-sm">
              How ownership builds over {horizonLabel}
            </h2>
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => setScheduleOpen(true)}
          className={`type-body-xs shrink-0 rounded-[3px] border border-slate-200/90 bg-white px-3 py-2 text-navy/80 transition-colors hover:border-navy/25 hover:bg-slate-50 hover:text-navy ${
            hideHeading ? "self-end sm:self-start" : "self-start"
          }`}
        >
          View amortization schedule
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
        <div>
          <p className="type-body-xs text-slate-500">Appreciation gained</p>
          <p className="type-metric mt-0.5 tabular-nums text-navy">{formatBuyVsWaitCurrency(eq.appreciationOnly)}</p>
        </div>
        <div>
          <p className="type-body-xs text-slate-500">Principal paid down</p>
          <p className="type-metric mt-0.5 tabular-nums text-navy">{formatBuyVsWaitCurrency(eq.principalPaidDown)}</p>
        </div>
        <div>
          <p className="type-body-xs text-slate-500">Total equity gained</p>
          <p className="type-metric mt-0.5 tabular-nums text-navy">{formatBuyVsWaitCurrency(eq.totalEquityGained)}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2 sm:gap-6">
        <div>
          <p className="type-body-xs text-slate-500">Starting loan balance</p>
          <p className="type-metric mt-0.5 tabular-nums text-navy">{formatBuyVsWaitCurrency(snap.startingBalance)}</p>
        </div>
        <div>
          <p className="type-body-xs text-slate-500">Loan balance after {horizonLabel}</p>
          <p className="type-metric mt-0.5 tabular-nums text-navy">{formatBuyVsWaitCurrency(snap.endingBalance)}</p>
        </div>
      </div>

      <div className="mt-6 border-t border-slate-100 pt-6">
        <p className="type-label text-navy/50">Payment shift</p>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 sm:gap-8">
          <div>
            <p className="type-body-xs font-medium text-slate-700">First payment</p>
            {splitBar(fi, fp)}
            <p className="type-body-xs mt-2 text-slate-600">
              Interest {formatBuyVsWaitCurrency(fi)} · Principal {formatBuyVsWaitCurrency(fp)}
            </p>
          </div>
          <div>
            <p className="type-body-xs font-medium text-slate-700">Payment {lastMonth}</p>
            {splitBar(li, lp)}
            <p className="type-body-xs mt-2 text-slate-600">
              Interest {formatBuyVsWaitCurrency(li)} · Principal {formatBuyVsWaitCurrency(lp)}
            </p>
          </div>
        </div>
      </div>

      <p className="type-body-sm mt-6 border-t border-slate-100 pt-6 text-slate-600">
        Over this period, your loan balance declines and a larger share of each payment goes toward principal.
      </p>

      <BuyVsWaitAmortizationScheduleModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        rows={amortizationScheduleRows}
        horizonMonths={horizonMonths}
        horizonYears={horizonYears}
        interestRatePct={interestRatePct}
        startingBalance={snap.startingBalance}
        endingBalance={snap.endingBalance}
        principalPaidDown={eq.principalPaidDown}
        firstPayment={snap.firstPayment}
        lastPaymentInHorizon={snap.lastPaymentInHorizon}
      />
    </section>
  );
}
