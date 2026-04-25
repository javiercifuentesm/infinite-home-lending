import type { PowerMapResults } from "../../../hooks/usePowerMapMath";
import { fmtK } from "../../../hooks/usePowerMapMath";

type Props = { results: PowerMapResults };

export function PMPowerHero({ results }: Props) {
  const {
    currentPrice,
    improvedPrice,
    powerGain,
    baseRate,
    impRate,
    scoreBase,
    impScore,
  } = results;

  const gainZero = powerGain === 0;

  return (
    <div className="grid gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-3" style={{ background: "#0B2A4A" }}>
      <div className="px-5 py-6 sm:px-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.5)" }}>
          Today&apos;s buying power
        </p>
        <p className="mt-3 font-[Georgia,serif] text-[28px] font-medium leading-none" style={{ color: "#C6A15B" }}>
          {fmtK(currentPrice)}
        </p>
        <p className="mt-2 text-[11px]" style={{ color: "rgba(255,255,255,0.55)" }}>
          at {baseRate.toFixed(3)}% rate · {scoreBase} credit score
        </p>
      </div>
      <div className="px-5 py-6 sm:px-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.5)" }}>
          With your improvements
        </p>
        <p className="mt-3 font-[Georgia,serif] text-[28px] font-medium leading-none" style={{ color: "#9FE1CB" }}>
          {fmtK(improvedPrice)}
        </p>
        <p className="mt-2 text-[11px]" style={{ color: "rgba(159,225,203,0.7)" }}>
          at {impRate.toFixed(3)}% rate · {impScore} credit score
        </p>
      </div>
      <div className="px-5 py-6 sm:px-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.5)" }}>
          Buying power gained
        </p>
        <p className="mt-3 font-[Georgia,serif] text-[28px] font-medium leading-none text-white">
          {gainZero ? "—" : `${powerGain > 0 ? "+" : ""}${fmtK(powerGain)}`}
        </p>
        <p className="mt-2 text-[11px]" style={{ color: "rgba(255,255,255,0.55)" }}>
          {gainZero ? "Adjust sliders above" : "from your improvement plan"}
        </p>
      </div>
    </div>
  );
}
