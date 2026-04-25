import type { HelocResult } from "../../../hooks/useHelocMath";
import { fmt } from "../../../hooks/useHelocMath";

type Props = { results: HelocResult };

export function HelocCliffCallout({ results }: Props) {
  const { drawYrs, ioPmt, piPmtVal, cliffAmount, cliffPct } = results;

  return (
    <div
      className="flex gap-3 rounded-xl border border-amber-200/80 px-4 py-4"
      style={{ background: "var(--color-background-warning)" }}
    >
      <span
        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-200/80 text-[#854F0B]"
        aria-hidden="true"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
        </svg>
      </span>
      <p className="text-[12px] leading-relaxed text-[#633806]">
        <strong>Payment cliff warning:</strong> when the draw period ends in {drawYrs} years, your monthly payment jumps from{" "}
        {fmt(ioPmt)} to {fmt(piPmtVal)} — an increase of {fmt(cliffAmount)}/month ({cliffPct}% higher). Plan for this transition
        before it arrives.
      </p>
    </div>
  );
}
