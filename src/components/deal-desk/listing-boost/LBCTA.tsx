import { Link } from "react-router-dom";
import type { ListingBoostResults } from "../../../hooks/useListingBoostMath";

type Props = { results: ListingBoostResults };

export function LBCTA({ results }: Props) {
  const { buydownWinsPool, poolGain } = results;

  let heading: string;
  if (buydownWinsPool && poolGain > 10) {
    heading = `The 2-1 buydown expands your buyer pool by ${poolGain}% — let's structure it.`;
  } else if (buydownWinsPool) {
    heading = "Ready to structure the concession and get a buyer pre-approved?";
  } else {
    heading = "Run the concession strategy with a live buyer — contact IHL.";
  }

  return (
    <div className="rounded-xl bg-[#0B2A4A] px-5 py-6 sm:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-[Georgia,serif] text-[13px] font-medium text-[#C6A15B]">{heading}</p>
          <p className="mt-2 font-sans text-[11px] leading-relaxed text-[rgba(255,255,255,0.6)]">
            IHL will confirm buyer qualification under the buydown structure and issue a pre-approval letter that references it — making your offer
            package complete.
          </p>
        </div>
        <Link
          to="/contact"
          className="inline-flex shrink-0 items-center justify-center rounded-md bg-[#C6A15B] px-5 py-2.5 font-sans text-[13px] font-semibold text-[#0B2A4A] transition-colors hover:bg-[#b48e48]"
        >
          Talk to IHL ↗
        </Link>
      </div>
    </div>
  );
}
