import type { BuydownType, OfferOptimizerResults } from "../../../hooks/useOfferOptimizerMath";
import { fmt } from "../../../hooks/useOfferOptimizerMath";

type Props = {
  results: OfferOptimizerResults;
  buydownType: BuydownType;
};

function typeLabel(t: BuydownType): string {
  if (t === "2-1") return "2-1";
  if (t === "1-0") return "1-0";
  return "permanent";
}

export function OOPaymentWinner({ results, buydownType }: Props) {
  const { buydownWins, buydownBetterForSeller, pmtDiff, remainingConcession, sellerNetDiff } = results;
  const bt = typeLabel(buydownType);

  if (buydownWins && buydownBetterForSeller) {
    return (
      <div className="rounded-xl bg-[#0B2A4A] px-6 py-8 text-center sm:text-left">
        <p className="text-lg text-[#C6A15B]" aria-hidden>
          ⭐
        </p>
        <h3 className="mt-2 font-[Georgia,serif] text-lg font-medium text-[#C6A15B] sm:text-xl">
          The buydown wins both ways — lower payment for the buyer, higher net for the seller.
        </h3>
        <p className="mt-4 font-sans text-[14px] leading-relaxed text-white/90">
          The {bt} buydown delivers {fmt(pmtDiff)} less per month for the buyer in Year 1 — and nets the seller {fmt(Math.abs(sellerNetDiff))} more than a price cut. This is the conversation that wins the listing.
        </p>
      </div>
    );
  }

  if (buydownWins && !buydownBetterForSeller) {
    return (
      <div className="rounded-xl bg-[#0B2A4A] px-6 py-8 text-center sm:text-left">
        <p className="text-lg text-[#C6A15B]" aria-hidden>
          ⭐
        </p>
        <h3 className="mt-2 font-[Georgia,serif] text-lg font-medium text-[#C6A15B] sm:text-xl">
          The buydown delivers a lower payment — and the difference is clear.
        </h3>
        <p className="mt-4 font-sans text-[14px] leading-relaxed text-white/90">
          {fmt(pmtDiff)} less per month in Year 1. Present this to the buyer and let the math close it.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[rgba(24,95,165,0.2)] bg-[rgba(24,95,165,0.08)] px-6 py-8">
      <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A] sm:text-xl">
        At this concession level, the price cut creates a slightly lower payment.
      </h3>
      <p className="mt-4 font-sans text-[14px] leading-relaxed text-slate-600">
        The difference is {fmt(pmtDiff)}/mo. Consider whether the remaining {fmt(remainingConcession)} could be applied to closing costs to make the buydown scenario more attractive to the buyer.
      </p>
    </div>
  );
}
