import type { SEQRunResult } from "../../../hooks/useSEQMath";
import type { SEQPath } from "./SEQPathTabs";
import { fmt, fmtK } from "./seqFormat";

type Props = {
  path: SEQPath;
  results: SEQRunResult;
};

export function SEQMetrics({ path, results }: Props) {
  const useBs = path === "bankstatement";
  const {
    tx,
    bs,
    txMaxLoan,
    txMaxPrice,
    txCanAfford,
    bsMaxLoan,
    bsMaxPrice,
    bsCanAfford,
    BASE_RATE,
    BS_RATE,
    DTI_MAX,
    targetPrice,
    debts,
  } = results;

  const primaryIncome = useBs ? bs.qualifyingMonthly : tx.qualifyingMonthly;
  const primaryMaxLoan = useBs ? bsMaxLoan : txMaxLoan;
  const primaryMaxPrice = useBs ? bsMaxPrice : txMaxPrice;
  const canAfford = useBs ? bsCanAfford : txCanAfford;
  const rate = useBs ? BS_RATE : BASE_RATE;

  const totalDtiPmt = Math.round(primaryIncome * DTI_MAX);
  const available = Math.max(0, totalDtiPmt - debts);
  const gap = Math.max(0, targetPrice - primaryMaxPrice);

  const priceColor = canAfford ? "text-[#27500A]" : "text-[#A32D2D]";

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-lg border border-slate-200/90 bg-white p-5 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Qualifying income</p>
        <p className="mt-2 font-serif text-2xl font-semibold text-[#0B2A4A]">${fmt(primaryIncome)}/mo</p>
        <p className="mt-1 text-[11px] text-slate-500">per month</p>
      </div>
      <div className="rounded-lg border border-slate-200/90 bg-white p-5 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Max qualifying loan</p>
        <p className="mt-2 font-serif text-2xl font-semibold text-[#0B2A4A]">${fmtK(primaryMaxLoan)}</p>
        <p className="mt-1 text-[11px] text-slate-500">
          at {rate.toFixed(2)}% / 43% DTI
        </p>
      </div>
      <div className="rounded-lg border border-slate-200/90 bg-white p-5 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Max home price</p>
        <p className={`mt-2 font-serif text-2xl font-semibold ${priceColor}`}>${fmtK(primaryMaxPrice)}</p>
        <p className="mt-1 text-[11px] text-slate-500">
          {canAfford ? "✓ covers target" : `Below target by $${fmtK(gap)}`}
        </p>
      </div>
      <div className="rounded-lg border border-slate-200/90 bg-white p-5 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Max total debt payment</p>
        <p className="mt-2 font-serif text-2xl font-semibold text-[#0B2A4A]">${fmt(totalDtiPmt)}</p>
        <p className="mt-1 text-[11px] text-slate-500">
          at 43% DTI · ${fmt(available)} available for mortgage
        </p>
      </div>
    </div>
  );
}
