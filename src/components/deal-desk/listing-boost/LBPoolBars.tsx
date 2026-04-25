import type { CSSProperties } from "react";
import type { ListingBoostResults } from "../../../hooks/useListingBoostMath";
import { fmtK } from "../../../hooks/useListingBoostMath";

type Props = { results: ListingBoostResults };

function BarRow({
  label,
  pctRight,
  fillClass,
  fillStyle,
  note,
}: {
  label: string;
  pctRight: string;
  fillClass: string;
  fillStyle?: CSSProperties;
  note: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="font-sans text-[12px] font-medium text-[#0B2A4A]">{label}</span>
        <span className="font-sans text-[12px] text-slate-600">{pctRight}</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200/90">
        <div
          className={`h-2.5 rounded-full transition-[width] duration-500 ease-out ${fillClass}`}
          style={fillStyle}
        />
      </div>
      <p className="mt-1 font-sans text-[10px] leading-snug text-slate-500">{note}</p>
    </div>
  );
}

export function LBPoolBars({ results }: Props) {
  const { poolCurrent, poolA, poolB, poolC, incCurrent, incA, incB, incC } = results;
  const maxPct = Math.max(poolCurrent, poolA, poolB, poolC, 60);

  const w = (p: number) => `${Math.min(100, Math.max(0, (p / maxPct) * 100))}%`;

  return (
    <div id="lb-pool-bars" className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">
        Qualifying income threshold — how each scenario expands the pool (estimated)
      </h3>
      <div className="mt-6 space-y-5">
        <BarRow
          label="Today — no concession"
          pctRight={`${poolCurrent}%`}
          fillClass="bg-[#CBD5E1]"
          fillStyle={{ width: w(poolCurrent) }}
          note={`${poolCurrent}% of local buyers qualify (est.) — income needed: ${fmtK(incCurrent)}/yr`}
        />
        <BarRow
          label="Scenario A — Price cut"
          pctRight={`${poolA}%`}
          fillClass="bg-[#185FA5]"
          fillStyle={{ width: w(poolA) }}
          note={`${poolA}% qualify (est.) — income needed: ${fmtK(incA)}/yr (${
            poolA - poolCurrent >= 0 ? "+" : ""
          }${poolA - poolCurrent}% vs today)`}
        />
        <BarRow
          label="Scenario B — 2-1 Buydown"
          pctRight={`${poolB}%`}
          fillClass="bg-gradient-to-r from-[#0B2A4A] to-[#1E4D8C]"
          fillStyle={{ width: w(poolB) }}
          note={`${poolB}% qualify (est.) — income needed: ${fmtK(incB)}/yr (${
            poolB - poolCurrent >= 0 ? "+" : ""
          }${poolB - poolCurrent}% vs today)`}
        />
        <BarRow
          label="Scenario C — 1-0 Buydown"
          pctRight={`${poolC}%`}
          fillClass="bg-gradient-to-r from-[rgba(11,42,74,0.5)] to-[rgba(30,77,140,0.5)]"
          fillStyle={{ width: w(poolC) }}
          note={`${poolC}% qualify (est.) — income needed: ${fmtK(incC)}/yr (${
            poolC - poolCurrent >= 0 ? "+" : ""
          }${poolC - poolCurrent}% vs today)`}
        />
      </div>
    </div>
  );
}
