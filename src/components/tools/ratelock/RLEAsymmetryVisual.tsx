import type { RLEResults } from "../../../hooks/useRLEMath";
import { fmt } from "../../../hooks/useRLEMath";

type Props = { results: RLEResults };

export function RLEAsymmetryVisual({ results }: Props) {
  const {
    monthlyRisk,
    monthlyUpside,
    downBarPct,
    upBarPct,
    asymRatio,
    dropScenario,
    riseScenario,
    daysToClose,
    term,
  } = results;

  const asymNum = parseFloat(asymRatio);

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">
        The asymmetric risk: what you&apos;re betting when you float
      </h3>

      <div className="mt-6 space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <span className="min-w-[100px] text-[11px] font-medium" style={{ color: "#A32D2D" }}>
            ⬆ Downside risk
          </span>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="h-7 flex-1 overflow-hidden rounded bg-slate-100">
              <div
                className="h-full rounded transition-[width] duration-500 ease-out"
                style={{ width: `${downBarPct}%`, background: "#A32D2D" }}
              />
            </div>
            <span className="shrink-0 text-right text-[11px] font-medium tabular-nums" style={{ color: "#A32D2D" }}>
              +{fmt(monthlyRisk)}/mo if rates rise +{riseScenario}%
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <span className="min-w-[100px] text-[11px] font-medium" style={{ color: "#27500A" }}>
            ⬇ Upside potential
          </span>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="h-7 flex-1 overflow-hidden rounded bg-slate-100">
              <div
                className="h-full rounded transition-[width] duration-500 ease-out"
                style={{ width: `${upBarPct}%`, background: "#3B6D11" }}
              />
            </div>
            <span className="shrink-0 text-right text-[11px] font-medium tabular-nums" style={{ color: "#27500A" }}>
              −{fmt(monthlyUpside)}/mo if rates drop −{dropScenario}%
            </span>
          </div>
        </div>
      </div>

      <p className="mt-6 text-[11px] leading-[1.5] text-slate-500">
        Floating your rate is a bet that rates will drop {dropScenario}% before your closing in {daysToClose} days. Your downside (
        {fmt(monthlyRisk)}/month more for {term} years) is {asymRatio}× your upside ({fmt(monthlyUpside)}/month saved). This is
        not a judgment — it&apos;s the math of the decision.
      </p>

      {asymNum >= 2.0 ? (
        <p className="mt-3 text-[11px] font-medium" style={{ color: "#A32D2D" }}>
          The downside is significantly larger than the upside in this scenario.
        </p>
      ) : null}
    </div>
  );
}
