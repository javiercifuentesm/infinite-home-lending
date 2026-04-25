import type { WealthResults } from "../../../hooks/useWealthMath";
import { fmtK } from "../../../hooks/useWealthMath";

const YEARS = [5, 10, 20, 30] as const;

type Props = { results: WealthResults };

export function WTMilestoneStrip({ results }: Props) {
  const { milestoneData } = results;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {YEARS.map((yr) => {
        const m = milestoneData[yr];
        const adv = m?.adv ?? 0;
        const pos = adv >= 0;
        return (
          <div
            key={yr}
            className="rounded-[10px] border-[0.5px] border-slate-200/90 bg-white p-4 shadow-sm"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: "#C6A15B" }}>
              Year {yr}
            </p>
            <p
              className="mt-2 font-[Georgia,serif] text-[17px] font-medium"
              style={{ color: pos ? "#27500A" : "#A32D2D" }}
            >
              {adv >= 0 ? "+" : ""}
              {fmtK(adv)}
            </p>
            <p className="mt-1 text-[10px] text-slate-500">{pos ? "Owner advantage" : "Renter advantage"}</p>
          </div>
        );
      })}
    </div>
  );
}
