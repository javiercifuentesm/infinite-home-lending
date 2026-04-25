import type { ListingBoostResults } from "../../../hooks/useListingBoostMath";
import { fmtK } from "../../../hooks/useListingBoostMath";

type Props = { results: ListingBoostResults };

export function LBNetProceeds({ results }: Props) {
  const { netA, netB, netC, bestNet, netDiff, poolGainVsCut } = results;
  const anyNegative = netA < 0 || netB < 0 || netC < 0;

  let summary: string;
  if (netB > netA) {
    summary = `The 2-1 Buydown nets the seller ${fmtK(netDiff)} more than a price cut — and expands the buyer pool ${poolGainVsCut}% more. Same budget. More money. More buyers.`;
  } else if (netA > netB) {
    summary = `The price cut nets the seller ${fmtK(Math.abs(netDiff))} more. However the 2-1 Buydown expands the buyer pool ${poolGainVsCut}% more — which may produce more offers and a better final price.`;
  } else {
    summary =
      "Both scenarios produce similar seller net proceeds. The 2-1 Buydown expands the buyer pool more (estimated).";
  }

  const cell = (value: number, isBest: boolean) => (
    <div
      className={`rounded-lg border px-4 py-4 text-center ${
        isBest ? "border-[#27500A] bg-[rgba(39,80,10,0.06)]" : "border-slate-200/80 bg-white"
      }`}
    >
      <p className={`font-[Georgia,serif] text-[18px] font-medium ${isBest ? "text-[#27500A]" : "text-[#0B2A4A]"}`}>
        {fmtK(value)}
      </p>
    </div>
  );

  return (
    <div className="rounded-xl border border-slate-200/80 bg-[rgba(244,246,249,0.9)] p-5 sm:p-6">
      <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">
        Seller net proceeds — what each strategy costs
      </h3>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <p className="mb-2 text-center font-sans text-[11px] font-semibold uppercase tracking-wide text-slate-500">Price cut</p>
          {cell(netA, netA === bestNet)}
        </div>
        <div>
          <p className="mb-2 text-center font-sans text-[11px] font-semibold uppercase tracking-wide text-slate-500">2-1 Buydown</p>
          {cell(netB, netB === bestNet)}
        </div>
        <div>
          <p className="mb-2 text-center font-sans text-[11px] font-semibold uppercase tracking-wide text-slate-500">1-0 Buydown</p>
          {cell(netC, netC === bestNet)}
        </div>
      </div>
      <p className="mt-4 font-sans text-[11px] italic leading-relaxed text-slate-500">{summary}</p>
      <p className="mt-3 font-sans text-[10px] leading-relaxed text-slate-500">
        Est. transfer tax uses MD average of 1.5%. Seller closing costs estimated at $8,000. Actual figures vary — consult your title company.
      </p>
      {anyNegative ? (
        <p className="mt-3 font-sans text-[12px] font-medium text-[#A32D2D]">
          ⚠ One or more scenarios produces negative net proceeds. Review the payoff amount — seller may be underwater at this price.
        </p>
      ) : null}
    </div>
  );
}
