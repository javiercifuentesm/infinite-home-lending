import type { ListingBoostResults } from "../../../hooks/useListingBoostMath";
import { fmtK } from "../../../hooks/useListingBoostMath";

type Props = { results: ListingBoostResults };

export function LBPoolHero({ results }: Props) {
  const { poolGain, incCurrent, incB } = results;
  const showNoChange = poolGain <= 0;

  return (
    <div id="lb-pool-hero" className="rounded-xl bg-[#0B2A4A] p-6 sm:p-8">
      <div className="text-center">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-wide text-[rgba(255,255,255,0.45)]">
          Additional buyers who qualify with the 2-1 buydown vs. today
        </p>
        <div className="mt-3">
          {showNoChange ? (
            <p className="font-[Georgia,serif] text-[40px] font-medium leading-none text-[#C6A15B] sm:text-[48px]">No change</p>
          ) : (
            <p className="font-[Georgia,serif] text-[40px] font-medium leading-none text-[#C6A15B] sm:text-[48px]">
              {poolGain > 0 ? "+" : ""}
              {poolGain}%
            </p>
          )}
        </div>
        <p className="mx-auto mt-3 max-w-lg font-sans text-[14px] leading-relaxed text-[rgba(255,255,255,0.7)]">
          {showNoChange
            ? "At this concession budget, the 2-1 buydown does not expand the estimated buyer pool vs. today’s list price. Try increasing the budget or check inputs."
            : "more of the buyer pool qualifies with the 2-1 buydown vs. today’s list price (estimated)."}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-[rgba(255,255,255,0.07)] px-4 py-4 text-center">
          <p className="font-sans text-[11px] font-medium text-white/70">At list price today</p>
          <p className="mt-2 font-[Georgia,serif] text-[20px] font-medium text-white">{fmtK(incCurrent)}/yr</p>
          <p className="mt-1 font-sans text-[11px] text-white/55">income needed to qualify</p>
        </div>
        <div className="rounded-lg bg-[rgba(255,255,255,0.07)] px-4 py-4 text-center">
          <p className="font-sans text-[11px] font-medium text-[#9FE1CB]">With 2-1 buydown</p>
          <p className="mt-2 font-[Georgia,serif] text-[20px] font-medium text-[#9FE1CB]">{fmtK(incB)}/yr</p>
          <p className="mt-1 font-sans text-[11px] text-white/55">income needed to qualify</p>
        </div>
        <div className="rounded-lg bg-[rgba(255,255,255,0.07)] px-4 py-4 text-center">
          <p className="font-sans text-[11px] font-medium text-[#C6A15B]">Pool expansion</p>
          <p className="mt-2 font-[Georgia,serif] text-[20px] font-medium text-[#C6A15B]">
            {showNoChange ? "No change" : `${poolGain > 0 ? "+" : ""}${poolGain}%`}
          </p>
          <p className="mt-1 font-sans text-[11px] text-white/55">
            {showNoChange ? "little or no change at this budget (est.)" : "more buyers qualify (est.)"}
          </p>
        </div>
      </div>
    </div>
  );
}
