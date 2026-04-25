import { formatBuyVsWaitCurrency } from "../../lib/buyVsWaitModel";

export type ComparisonBarsRow = {
  label: string;
  buyValue: number;
  waitValue: number;
};

type Props = {
  rows: ComparisonBarsRow[];
};

/**
 * Div-only Buy vs Wait bars for quick scanning (table stays source of truth).
 * Each row scales the two bars to max(buy, wait) within that row.
 */
export function ComparisonBars({ rows }: Props) {
  return (
    <div className="space-y-5">
      {rows.map((row) => (
        <div key={row.label}>
          <ComparisonBarRow row={row} />
        </div>
      ))}
    </div>
  );
}

function ComparisonBarRow({ row }: { row: ComparisonBarsRow }) {
  const { label, buyValue, waitValue } = row;
  const max = Math.max(buyValue, waitValue, 1);
  const buyPct = Math.min(100, (buyValue / max) * 100);
  const waitPct = Math.min(100, (waitValue / max) * 100);

  return (
    <div>
      <p className="type-body-xs mb-2 text-slate-600">{label}</p>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="type-body-xs w-9 shrink-0 text-slate-500 sm:w-10">Buy</span>
          <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-sm bg-slate-100">
            <div className="h-2 rounded-sm bg-navy/85" style={{ width: `${buyPct}%` }} />
          </div>
          <span className="type-metric shrink-0 text-right text-sm tabular-nums text-navy sm:min-w-[5rem]">
            {formatBuyVsWaitCurrency(buyValue)}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="type-body-xs w-9 shrink-0 text-slate-500 sm:w-10">Wait</span>
          <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-sm bg-slate-100">
            <div
              className="h-2 rounded-sm bg-gold/60"
              style={{ width: waitValue <= 0 ? "2px" : `${waitPct}%` }}
            />
          </div>
          <span className="type-metric shrink-0 text-right text-sm tabular-nums text-slate-700 sm:min-w-[5rem]">
            {formatBuyVsWaitCurrency(waitValue)}
          </span>
        </div>
      </div>
    </div>
  );
}
