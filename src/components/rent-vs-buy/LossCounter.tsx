import type { DecisionEngineV2 } from "../../lib/rentVsBuy/decisionEngineV2";
import { formatUsd } from "../../lib/rentVsBuy/decisionEngineV2";

type Props = {
  decision: DecisionEngineV2;
};

export function LossCounter({ decision }: Props) {
  const w = decision.waitPenalty;

  return (
    <section className="rounded-2xl border border-rose-700/15 bg-gradient-to-br from-rose-50/90 to-white px-5 py-6 shadow-sm sm:px-7">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-rose-900/55">Silent loss (each month you wait)</p>
      <p className="mt-2 font-display text-[clamp(1.25rem,4vw,1.5rem)] font-semibold text-rose-950">
        Every month you wait costs you about{" "}
        <span className="numeric mt-1 block text-[clamp(1.65rem,5vw,2rem)] font-bold text-rose-900 sm:mt-0 sm:inline">
          {formatUsd(w.monthlyTotal)}
        </span>
      </p>
      <ul className="mt-5 space-y-2 border-t border-rose-900/10 pt-4 text-[14px] text-[#0B1F3A]/85">
        <li className="flex justify-between gap-3">
          <span>Rent (no stake)</span>
          <span className="numeric font-semibold text-[#0B1F3A]">{formatUsd(w.rent)}</span>
        </li>
        <li className="flex justify-between gap-3">
          <span>Lost equity build (principal you could have paid)</span>
          <span className="numeric font-semibold text-[#0B1F3A]">{formatUsd(w.lostEquityMonthly)}</span>
        </li>
        <li className="flex justify-between gap-3">
          <span>Appreciation you don’t capture while renting</span>
          <span className="numeric font-semibold text-[#0B1F3A]">{formatUsd(w.appreciationLossMonthly)}</span>
        </li>
      </ul>
    </section>
  );
}
