import type { ReactNode } from "react";
import type { FHAResult } from "../../../hooks/useFHAMath";
import { fmt } from "../../../hooks/useFHAMath";

type Props = { results: FHAResult };

export function FHARefiStrategy({ results }: Props) {
  const { homeVal5, fhaBal5, equity5, refiLTV5, newConvPmt5, newPmiMo5, refiSavings } = results;

  const row = (label: string, value: ReactNode, last?: boolean) => (
    <div
      className={`flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${last ? "" : "border-b border-[var(--color-border-tertiary)]"}`}
    >
      <span className="text-[12px] text-[var(--color-text-tertiary)]">{label}</span>
      <span className="text-[12px] font-medium">{value}</span>
    </div>
  );

  return (
    <div className="rounded-xl border border-[var(--color-border-tertiary)] p-5 sm:p-6" style={{ background: "rgba(11,42,74,0.04)" }}>
      <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">
        The FHA upgrade strategy: start FHA, refinance to Conventional
      </h3>
      <p className="mt-2 text-[12px] leading-[1.5] text-[var(--color-text-tertiary)]">
        Many buyers use FHA to get into a home now, then refinance to Conventional once they&apos;ve built equity and improved their credit.
        Here&apos;s what that looks like at year 5 for your situation.
      </p>
      <div className="mt-4">
        {row("Home value at year 5", fmt(homeVal5))}
        {row("FHA balance at year 5", fmt(fhaBal5))}
        {row("Equity built", <span className="text-[#27500A]">{fmt(equity5)}</span>)}
        {row("LTV at refinance", `${refiLTV5}%`)}
        {row("New Conventional payment", `${fmt(newConvPmt5 + newPmiMo5)}/mo`)}
        {row(
          "Monthly savings vs. staying FHA",
          refiSavings > 0 ? (
            <span className="text-[#27500A]">+{fmt(refiSavings)}/mo savings</span>
          ) : (
            <span className="text-[#A32D2D]">{fmt(Math.abs(refiSavings))}/mo more</span>
          ),
          true,
        )}
      </div>
    </div>
  );
}
