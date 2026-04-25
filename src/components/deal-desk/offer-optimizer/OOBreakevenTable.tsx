import type { BuydownType, OfferOptimizerResults } from "../../../hooks/useOfferOptimizerMath";
import { fmt } from "../../../hooks/useOfferOptimizerMath";

type Props = {
  results: OfferOptimizerResults;
  marketRate: number;
  buydownType: BuydownType;
};

export function OOBreakevenTable({ results, marketRate, buydownType }: Props) {
  const {
    pmtAtAsk,
    yr1Pmt,
    yr2Pmt,
    yr3Pmt,
    buydownCost,
    beMonths,
    savingsYr1,
    savingsYr12,
    termMos,
    permNewRate,
    totalSavingsPerm,
  } = results;

  if (buydownType === "perm") {
    return (
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">
          Buydown breakeven — when the buyer recovers the rate premium
        </h3>
        <p className="mt-1 text-[11px] text-slate-500">Permanent buydown — lifetime payment comparison</p>
        <dl className="mt-4 divide-y divide-slate-200/80">
          <div className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between">
            <dt className="text-[12px] text-slate-600">Rate reduced from</dt>
            <dd className="text-[12px] font-medium text-[#0B2A4A]">
              {marketRate.toFixed(3)}% → {permNewRate.toFixed(3)}%
            </dd>
          </div>
          <div className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between">
            <dt className="text-[12px] text-slate-600">Monthly payment saving</dt>
            <dd className="text-[12px] font-medium text-[#0B2A4A]">{fmt(Math.round(pmtAtAsk - yr1Pmt))}/mo forever</dd>
          </div>
          <div className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between">
            <dt className="text-[12px] text-slate-600">Cost to achieve this</dt>
            <dd className="text-[12px] font-medium">{fmt(buydownCost)}</dd>
          </div>
          <div className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between">
            <dt className="text-[12px] text-slate-600">Savings in Year 1</dt>
            <dd className="text-[12px] font-medium">{fmt(savingsYr1)}</dd>
          </div>
          <div className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between">
            <dt className="text-[12px] text-slate-600">Breakeven</dt>
            <dd className="text-[12px] font-medium">{beMonths ? `${beMonths} months` : "N/A"}</dd>
          </div>
          <div className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between">
            <dt className="text-[12px] text-slate-600">Total savings over loan term</dt>
            <dd className="text-[12px] font-medium">{fmt(totalSavingsPerm)}</dd>
          </div>
        </dl>
      </div>
    );
  }

  const yrEnd = buydownType === "2-1" ? 3 : 2;
  const insightSavings = buydownType === "2-1" ? savingsYr12 : savingsYr1;
  const insightText =
    beMonths != null
      ? `The seller spent ${fmt(buydownCost)} to save the buyer ${fmt(insightSavings)} over the buydown period. The buyer breaks even in ${beMonths} months.`
      : `The seller spent ${fmt(buydownCost)} to fund the buydown. Year 1 monthly saving vs. market rate: ${fmt(Math.round(pmtAtAsk - yr1Pmt))}/mo.`;

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">
        Buydown breakeven — when the buyer recovers the rate premium
      </h3>
      <dl className="mt-4 divide-y divide-slate-200/80">
        <div className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between">
          <dt className="text-[12px] text-slate-600">Year 1 monthly saving (vs. market rate)</dt>
          <dd className="text-[12px] font-medium">{fmt(Math.round(pmtAtAsk - yr1Pmt))}/mo</dd>
        </div>
        <div className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between">
          <dt className="text-[12px] text-slate-600">Buydown cost (paid by seller)</dt>
          <dd className="text-[12px] font-medium">{fmt(buydownCost)}</dd>
        </div>
        <div className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between">
          <dt className="text-[12px] text-slate-600">Months to break even</dt>
          <dd className="text-[12px] font-medium">{beMonths ? `${beMonths} months` : "N/A"}</dd>
        </div>
        <div className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between">
          <dt className="text-[12px] text-slate-600">Buyer net savings over Year 1</dt>
          <dd className="text-[12px] font-medium">{fmt(savingsYr1)}</dd>
        </div>
        <div className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between">
          <dt className="text-[12px] text-slate-600">Buyer net savings over Years 1–2</dt>
          <dd className="text-[12px] font-medium">
            {buydownType === "2-1" ? fmt(savingsYr12) : "N/A — 1-year only"}
          </dd>
        </div>
        <div className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between">
          <dt className="text-[12px] text-slate-600">Rate from Year {yrEnd} onward</dt>
          <dd className="text-[12px] font-medium">{marketRate.toFixed(3)}%</dd>
        </div>
        <div className="py-3">
          <dt className="text-[12px] font-medium text-slate-500">Insight</dt>
          <dd className="mt-2 text-[12px] italic leading-relaxed text-slate-600">{insightText}</dd>
        </div>
      </dl>
    </div>
  );
}
