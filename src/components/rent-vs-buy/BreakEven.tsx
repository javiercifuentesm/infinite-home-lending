import type { DecisionEngineV2 } from "../../lib/rentVsBuy/decisionEngineV2";

type Props = {
  decision: DecisionEngineV2;
};

export function BreakEven({ decision }: Props) {
  const y = decision.breakEvenYears;

  if (y === null) {
    return (
      <section className="rounded-2xl border border-amber-200/80 bg-amber-50/90 px-5 py-6 sm:px-7">
        <h2 className="font-display text-lg font-semibold text-[#0B1F3A]">Break-even</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-[#0B1F3A]/80">
          In this model, buying doesn’t cross renting within 40 years — usually because rent is light vs the full cost of
          owning. Worth a conversation, not a verdict on your life.
        </p>
      </section>
    );
  }

  const label = y < 1 ? "less than a year" : `${y} years`;

  return (
    <section className="rounded-2xl border border-emerald-700/15 bg-emerald-50/80 px-5 py-6 sm:px-7">
      <h2 className="font-display text-lg font-semibold text-emerald-950">Break-even moment</h2>
      <p className="mt-2 text-[17px] font-medium text-emerald-950">
        You break even in about <span className="numeric font-bold">{label}</span>
      </p>
      <p className="mt-3 text-[15px] leading-relaxed text-emerald-950/85">
        After that, owning pulls ahead of renting in this illustration — holding everything else equal.
      </p>
    </section>
  );
}
