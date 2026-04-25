import type { ListingBoostResults } from "../../../hooks/useListingBoostMath";
import { fmtK } from "../../../hooks/useListingBoostMath";

type Props = { results: ListingBoostResults };

export function LBInsight({ results }: Props) {
  const {
    dom,
    incCurrent,
    budget,
    incA,
    incDropA,
    poolA,
    poolCurrent,
    incB,
    incDropB,
    poolB,
    netB,
    netA,
  } = results;

  const poolMoreA = Math.max(0, poolA - poolCurrent);
  const poolMoreB = Math.max(0, poolB - poolCurrent);

  const closing =
    netB > netA
      ? ` And it nets you ${fmtK(netB - netA)} more than the price cut. Same budget. More buyers. More money in your pocket.`
      : " The net proceeds are similar either way — the difference is how many more buyers walk through your door.";

  const text = `Your listing has been on the market ${dom} days. Here's what the numbers tell us. At the current price with no concession, the minimum household income a buyer needs to qualify is ${fmtK(
    incCurrent,
  )} a year — that's the ceiling of your buyer pool right now.

A ${fmtK(budget)} price cut moves that qualifying threshold to ${fmtK(incA)} a year — ${fmtK(incDropA)} less income required, which opens your home to roughly ${poolMoreA}% more of the local buyer pool (estimated).

But the 2-1 Buydown moves the Year 1 qualifying threshold all the way to ${fmtK(incB)} a year — ${fmtK(incDropB)} less income required, opening your home to ${poolMoreB}% more buyers (estimated).${closing}`;

  return (
    <div
      id="lb-agent-script"
      className="rounded-r-lg border border-[rgba(11,42,74,0.08)] border-l-[3px] border-l-[#C6A15B] bg-[rgba(11,42,74,0.04)] py-[0.85rem] pl-4 pr-4"
    >
      <p className="font-sans text-[10px] font-semibold uppercase tracking-wide text-[#C6A15B]">📋 Agent script</p>
      <p className="mt-2 whitespace-pre-line font-[Georgia,serif] text-[13px] italic leading-[1.65] text-[#0B2A4A]">{text}</p>
    </div>
  );
}
