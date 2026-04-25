import type { OfferOptimizerResults } from "../../../hooks/useOfferOptimizerMath";
import { fmt } from "../../../hooks/useOfferOptimizerMath";

type Props = {
  results: OfferOptimizerResults;
  commission: number;
  sellerClosing: number;
};

export function OONetProceedsBox({ results, commission, sellerClosing }: Props) {
  const { netA, netB, sellerNetDiff, priceAfterCut, salePrice, payoff, concessionBudget } = results;

  let diffLine: React.ReactNode;
  if (netB.netProceeds > netA.netProceeds) {
    diffLine = (
      <p className="font-sans text-[13px] font-medium text-[#27500A]">Buydown nets the seller {fmt(sellerNetDiff)} more than a price cut.</p>
    );
  } else if (netA.netProceeds > netB.netProceeds) {
    diffLine = (
      <p className="font-sans text-[13px] font-medium text-slate-800">Price cut nets the seller {fmt(Math.abs(sellerNetDiff))} more.</p>
    );
  } else {
    diffLine = <p className="font-sans text-[13px] font-medium text-slate-600">Both scenarios produce the same seller net proceeds.</p>;
  }

  return (
    <div id="oo-net-proceeds" className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">What each scenario does to the seller&apos;s proceeds</h3>
      <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:gap-10">
        <div className="min-w-0 flex-1">
          <p className="font-sans text-[12px] font-semibold uppercase tracking-wide text-slate-500">Price Cut</p>
          <p className="mt-2 font-[Georgia,serif] text-[22px] font-medium text-[#0B2A4A]">{fmt(netA.netProceeds)}</p>
          <ul className="mt-4 space-y-1.5 font-sans text-[11px] text-slate-600">
            <li>Gross: {fmt(priceAfterCut)}</li>
            <li>Mortgage payoff: −{fmt(payoff)}</li>
            <li>
              Commission ({commission}%): −{fmt(netA.commissionAmt)}
            </li>
            <li>Est. transfer tax: −{fmt(netA.transferTax)}</li>
            <li>Seller closing costs: −{fmt(sellerClosing)}</li>
          </ul>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-sans text-[12px] font-semibold uppercase tracking-wide text-slate-500">Seller Buydown</p>
          <p
            className={`mt-2 font-[Georgia,serif] text-[22px] font-medium ${
              netB.netProceeds > netA.netProceeds ? "text-[#27500A]" : "text-[#0B2A4A]"
            }`}
          >
            {fmt(netB.netProceeds)}
          </p>
          <ul className="mt-4 space-y-1.5 font-sans text-[11px] text-slate-600">
            <li>Gross: {fmt(salePrice)}</li>
            <li>Mortgage payoff: −{fmt(payoff)}</li>
            <li>
              Commission ({commission}%): −{fmt(netB.commissionAmt)}
            </li>
            <li>Est. transfer tax: −{fmt(netB.transferTax)}</li>
            <li>Seller closing costs: −{fmt(sellerClosing)}</li>
            <li>Buydown concession: −{fmt(concessionBudget)}</li>
          </ul>
        </div>
      </div>
      <div className="mt-8 border-t border-slate-200/80 pt-6">{diffLine}</div>
      <p className="mt-4 font-sans text-[10px] leading-relaxed text-slate-500">
        Est. transfer tax uses MD average of 1.5%. Actual rates vary by county and state. Ask your title company for precise figures.
      </p>
    </div>
  );
}
