import type { ReactNode } from "react";
import type { BuydownType, OfferOptimizerResults } from "../../../hooks/useOfferOptimizerMath";
import { fmt } from "../../../hooks/useOfferOptimizerMath";

function buydownTitle(t: BuydownType): string {
  if (t === "2-1") return "2-1 Buydown";
  if (t === "1-0") return "1-0 Buydown";
  return "Permanent Buydown";
}

type Props = {
  results: OfferOptimizerResults;
  inputs: { concessionBudget: number; buyerDP: number; marketRate: number; buydownType: BuydownType };
};

function RowA({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-slate-200/80 py-2.5 text-[13px] last:border-b-0 sm:flex-row sm:justify-between sm:gap-4">
      <span className="text-slate-600">{label}</span>
      <span className="font-medium text-[#0B2A4A]">{value}</span>
    </div>
  );
}

function RowB({ label, value, valueClass = "text-white" }: { label: string; value: ReactNode; valueClass?: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-white/[0.12] py-2.5 text-[13px] last:border-b-0 sm:flex-row sm:justify-between sm:gap-4">
      <span className="text-white/80">{label}</span>
      <span className={`font-medium ${valueClass}`}>{value}</span>
    </div>
  );
}

export function OODualPanel({ results, inputs }: Props) {
  const {
    salePrice,
    concessionBudget,
    buyerDP,
    marketRate,
    buydownType,
  } = inputs;

  const {
    priceAfterCut,
    loanAfterCut,
    dpAtCut,
    pmtAfterCut,
    priceReductionSaving,
    yr1Rate,
    yr2Rate,
    yr3Rate,
    yr1Pmt,
    yr2Pmt,
    yr3Pmt,
    loanAtAsk,
    dpAmt,
    buydownCost,
    netA,
    netB,
    buydownWins,
    pmtDiff,
    permNewRate,
  } = results;

  const year2Display =
    buydownType === "2-1"
      ? `${yr2Rate.toFixed(3)}% / ${fmt(yr2Pmt)}`
      : buydownType === "1-0"
        ? `${marketRate.toFixed(3)}% / ${fmt(yr3Pmt)} (market)`
        : `${permNewRate.toFixed(3)}% / ${fmt(yr1Pmt)} (permanent)`;

  const year3Display =
    buydownType === "2-1" || buydownType === "1-0"
      ? `${marketRate.toFixed(3)}% / ${fmt(yr3Pmt)}`
      : `${permNewRate.toFixed(3)}% / ${fmt(yr1Pmt)} (permanent)`;

  const netAColor = netA.rawNetProceeds < 0 ? "text-[#A32D2D]" : netA.netProceeds > 0 ? "text-[#27500A]" : "text-slate-700";

  return (
    <div id="oo-dual-panel" className="grid gap-4 max-sm:grid-cols-1 sm:grid-cols-2">
      {/* Panel A */}
      <div
        className={`relative flex flex-col rounded-xl border-2 overflow-hidden ${
          !buydownWins ? "border-[#C6A15B] shadow-[0_0_0_1px_rgba(198,161,91,0.35)]" : "border-slate-200/90"
        }`}
      >
        {!buydownWins && (
          <div className="absolute right-3 top-3 z-10 rounded-full bg-[#C6A15B] px-2 py-0.5 font-sans text-[11px] font-semibold text-[#0B2A4A]">
            ⭐ Lower payment
          </div>
        )}
        <div className="bg-[#E6F1FB] px-4 py-3">
          <p className="font-sans text-[12px] font-semibold uppercase tracking-wide text-[#185FA5]">Scenario A — Price Reduction</p>
          <p className="mt-1 text-[11px] text-slate-500">Seller drops price by {fmt(concessionBudget)}</p>
        </div>
        <div className="flex-1 bg-white p-4">
          <p className="font-sans text-[10px] font-semibold uppercase text-slate-500">Year 1 payment</p>
          <p className="font-[Georgia,serif] text-[28px] font-medium text-[#0B2A4A]">{fmt(pmtAfterCut)}</p>
          <p className="text-[11px] text-slate-500">every month at {marketRate.toFixed(3)}% rate</p>
          <div className="mt-4">
            <RowA label="New sale price" value={fmt(priceAfterCut)} />
            <RowA label="New loan amount" value={fmt(loanAfterCut)} />
            <RowA label="Buyer down payment" value={`${fmt(dpAtCut)} (${buyerDP}%)`} />
            <RowA label="Interest rate" value={`${marketRate.toFixed(3)}% — unchanged`} />
            <RowA label="Monthly saving vs. ask" value={`−${fmt(priceReductionSaving)}/mo`} />
            <RowA label="Rate in Year 2" value={`${marketRate.toFixed(3)}%`} />
            <RowA label="Rate in Year 3+" value={`${marketRate.toFixed(3)}%`} />
            <RowA label="Seller concession cost" value={`${fmt(concessionBudget)} (price reduction)`} />
            <RowA
              label="Seller net proceeds"
              value={<span className={netAColor}>{fmt(netA.netProceeds)}</span>}
            />
          </div>
        </div>
      </div>

      {/* Panel B */}
      <div
        className={`relative flex flex-col rounded-xl border-2 overflow-hidden ${
          buydownWins ? "border-[#C6A15B] shadow-[0_0_0_1px_rgba(198,161,91,0.35)]" : "border-slate-700"
        }`}
      >
        {buydownWins && (
          <div className="absolute right-3 top-3 z-10 rounded-full bg-[#C6A15B] px-2 py-0.5 font-sans text-[11px] font-semibold text-[#0B2A4A]">
            ⭐ Lower payment
          </div>
        )}
        <div className="bg-[#0B2A4A] px-4 py-3">
          <p className="font-sans text-[12px] font-semibold uppercase tracking-wide text-[#C6A15B]">
            Scenario B — {buydownTitle(buydownType)}
          </p>
          <p className="mt-1 text-[11px] text-white/60">Buyer pays full ask · seller funds rate buydown</p>
        </div>
        <div className="flex-1 bg-[#0B2A4A] p-4">
          <p className="font-sans text-[10px] font-semibold uppercase text-white/50">Year 1 payment</p>
          <p className="font-[Georgia,serif] text-[28px] font-medium text-[#C6A15B]">{fmt(yr1Pmt)}</p>
          <p className="text-[11px] text-white/70">in Year 1 at {yr1Rate.toFixed(3)}%</p>
          <div className="mt-4">
            <RowB label="Sale price" value={`${fmt(salePrice)} (full ask)`} />
            <RowB label="Loan amount" value={fmt(loanAtAsk)} />
            <RowB label="Buyer down payment" value={`${fmt(dpAmt)} (${buyerDP}%)`} />
            <RowB label="Year 1 rate" value={`${yr1Rate.toFixed(3)}%`} valueClass="text-[#C6A15B]" />
            <RowB label="Year 1 monthly payment" value={fmt(yr1Pmt)} valueClass="text-[#C6A15B]" />
            <RowB label="Year 2 rate / payment" value={year2Display} />
            <RowB label="Year 3+ rate / payment" value={year3Display} />
            <RowB label="Buydown cost to seller" value={fmt(buydownCost)} />
            <RowB label="Seller net proceeds" value={fmt(netB.netProceeds)} valueClass="text-[#C6A15B]" />
          </div>
        </div>
      </div>
    </div>
  );
}
