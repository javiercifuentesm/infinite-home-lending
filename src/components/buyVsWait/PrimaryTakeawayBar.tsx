import type { BuyVsWaitPrimaryTakeawayBar } from "../../lib/buyVsWaitModel";

type Props = {
  bar: BuyVsWaitPrimaryTakeawayBar;
};

/**
 * Lightweight bar(s) inside Primary Takeaway — no axes, no animation.
 * buy_now: stacked rent vs missed equity (matches headline total).
 * wait: single full-width band (short-term savings anchor).
 * close: two narrow rows comparing monthly rent vs PITI (balance, not drama).
 */
export function PrimaryTakeawayBar({ bar }: Props) {
  if (bar.kind === "buy_now_stronger") {
    const { rent, missedEquity } = bar;
    const total = Math.max(rent + missedEquity, 1e-9);
    const pRent = (rent / total) * 100;
    const pMiss = (missedEquity / total) * 100;

    return (
      <div className="mt-5" aria-hidden="true">
        <p className="type-body-xs mb-2 text-slate-500">Where this comes from</p>
        <div className="flex h-2 w-full max-w-full overflow-hidden rounded-sm bg-slate-100">
          {pRent > 0 && <div className="h-2 shrink-0 bg-navy/85" style={{ width: `${pRent}%` }} />}
          {pMiss > 0 && <div className="h-2 shrink-0 bg-gold/55" style={{ width: `${pMiss}%` }} />}
        </div>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 type-body-xs text-slate-500">
          <li className="flex items-center gap-1.5">
            <span className="h-1.5 w-4 shrink-0 rounded-sm bg-navy/85" aria-hidden />
            Rent
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-1.5 w-4 shrink-0 rounded-sm bg-gold/55" aria-hidden />
            Missed equity by waiting
          </li>
        </ul>
      </div>
    );
  }

  if (bar.kind === "wait_may_help_short_term") {
    return (
      <div className="mt-5" aria-hidden="true">
        <p className="type-body-xs mb-2 text-slate-500">Where this comes from</p>
        <div className="h-2 w-full overflow-hidden rounded-sm bg-slate-100">
          <div className="h-2 w-full rounded-sm bg-navy/80" />
        </div>
      </div>
    );
  }

  const max = Math.max(bar.monthlyRent, bar.monthlyPiti, 1);
  const wRent = (bar.monthlyRent / max) * 100;
  const wPiti = (bar.monthlyPiti / max) * 100;

  return (
    <div className="mt-5" aria-hidden="true">
      <p className="type-body-xs mb-2 text-slate-500">Where this comes from</p>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="type-body-xs w-10 shrink-0 text-slate-500">Rent</span>
          <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-sm bg-slate-100">
            <div className="h-2 rounded-sm bg-gold/55" style={{ width: `${wRent}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="type-body-xs w-10 shrink-0 text-slate-500">PITI</span>
          <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-sm bg-slate-100">
            <div className="h-2 rounded-sm bg-navy/70" style={{ width: `${wPiti}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
