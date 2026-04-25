import type { ReactNode } from "react";
import type { OfferOptimizerResults } from "../../../hooks/useOfferOptimizerMath";
import { fmt, fmtK } from "../../../hooks/useOfferOptimizerMath";

type Props = {
  results: OfferOptimizerResults;
  marketRate: number;
  salePrice: number;
};

export function OOQualificationDelta({ results, marketRate, salePrice }: Props) {
  const {
    yr1Rate,
    maxPriceAtMarket,
    maxPriceAtBuydown,
    qualificationLift,
    buyerQualifiesAtAsk,
    buyerQualifiesWithBuydown,
  } = results;

  let row4: ReactNode;
  if (buyerQualifiesAtAsk) {
    row4 = <span className="font-medium text-[#27500A]">✓ Yes at current rate</span>;
  } else if (buyerQualifiesWithBuydown) {
    row4 = <span className="font-medium text-amber-700">✓ Yes — but ONLY with the buydown rate applied</span>;
  } else {
    row4 = <span className="font-medium text-[#A32D2D]">✗ Buyer may not qualify — refer to IHL for pre-approval</span>;
  }

  const liftDisplay =
    qualificationLift > 0 ? (
      <span className="font-medium text-[#27500A]">+{fmtK(qualificationLift)}</span>
    ) : (
      <span className="text-slate-600">$0 — already well within qualifying range</span>
    );

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">What the buydown does to buyer qualification</h3>
      <dl className="mt-4 divide-y divide-slate-200/80">
        <div className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between">
          <dt className="text-[12px] text-slate-600">Max qualifying price at market rate ({marketRate.toFixed(3)}%)</dt>
          <dd className="text-[12px] font-medium">{fmt(maxPriceAtMarket)}</dd>
        </div>
        <div className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between">
          <dt className="text-[12px] text-slate-600">Max qualifying price with Year 1 buydown rate ({yr1Rate.toFixed(3)}%)</dt>
          <dd className={`text-[12px] font-medium ${maxPriceAtBuydown > maxPriceAtMarket ? "text-[#27500A]" : ""}`}>
            {fmt(maxPriceAtBuydown)}
          </dd>
        </div>
        <div className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between">
          <dt className="text-[12px] text-slate-600">Qualification lift from buydown</dt>
          <dd className="text-[12px]">{liftDisplay}</dd>
        </div>
        <div className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between sm:items-start">
          <dt className="text-[12px] text-slate-600">Can buyer qualify at ask price ({fmt(salePrice)})?</dt>
          <dd className="text-[12px] text-right">{row4}</dd>
        </div>
      </dl>
    </div>
  );
}
