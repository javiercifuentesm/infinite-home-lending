import type { OfferOptimizerInputs, OfferOptimizerResults } from "../../../hooks/useOfferOptimizerMath";
import { fmt } from "../../../hooks/useOfferOptimizerMath";

type Props = {
  inputs: OfferOptimizerInputs;
  results: OfferOptimizerResults;
};

export function OOShareSummary({ inputs, results }: Props) {
  const lines = [
    `Offer Optimizer — ${fmt(inputs.salePrice)} list, ${fmt(inputs.concessionBudget)} concession`,
    `Market rate ${inputs.marketRate.toFixed(3)}% · Buydown: ${inputs.buydownType}`,
    `Year 1 payment — Price cut: ${fmt(results.pmtAfterCut)} vs Buydown: ${fmt(results.yr1Pmt)}`,
    `Seller net — Price cut: ${fmt(results.netA.netProceeds)} vs Buydown: ${fmt(results.netB.netProceeds)}`,
  ].join("\n");

  return (
    <div className="rounded-xl border border-slate-200/90 bg-[#F4F6F9] p-5">
      <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">Share this analysis</h3>
      <p className="mt-1 text-[11px] text-slate-500">Copy and paste into an email or client note.</p>
      <pre className="mt-4 max-h-40 overflow-auto whitespace-pre-wrap rounded-md border border-slate-200/80 bg-white p-4 font-sans text-[11px] leading-relaxed text-slate-700">
        {lines}
      </pre>
    </div>
  );
}
