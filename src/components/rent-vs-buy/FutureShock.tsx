import type { DecisionEngineV2 } from "../../lib/rentVsBuy/decisionEngineV2";
import { formatUsd } from "../../lib/rentVsBuy/decisionEngineV2";

type Props = {
  decision: DecisionEngineV2;
};

export function FutureShock({ decision }: Props) {
  const f = decision.futureShock;

  return (
    <section className="rounded-2xl border border-black/[0.07] bg-[#0B1F3A] px-5 py-6 text-white shadow-lg sm:px-7 sm:py-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#D4AF37]/90">Future snapshot</p>
      <h2 className="font-display mt-2 text-xl font-semibold leading-snug sm:text-2xl">
        If you wait {f.waitYears} {f.waitYears === 1 ? "year" : "years"}:
      </h2>
      <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-white/90">
        <li className="flex flex-wrap items-baseline justify-between gap-2">
          <span>Home price moves (model)</span>
          <span className="numeric font-bold text-[#D4AF37]">+{formatUsd(f.priceIncrease)}</span>
        </li>
        <li className="flex flex-wrap items-baseline justify-between gap-2">
          <span>Monthly payment moves (model)</span>
          <span className="numeric font-bold text-[#D4AF37]">+{formatUsd(f.paymentIncreaseMonthly)}/mo</span>
        </li>
      </ul>
      <p className="mt-5 border-t border-white/10 pt-4 text-[15px] font-medium text-white/85">
        Same home — heavier monthly weight if prices and rates run against you.
      </p>
    </section>
  );
}
