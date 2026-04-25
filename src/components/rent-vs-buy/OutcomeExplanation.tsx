import type { DecisionEngineV2 } from "../../lib/rentVsBuy/decisionEngineV2";

type Props = {
  decision: DecisionEngineV2;
};

export function OutcomeExplanation({ decision }: Props) {
  const lines = decision.buysAhead
    ? [
        "Rent payments don’t build equity for you.",
        "Home values in this model keep moving.",
        "Your future loan will likely be heavier if prices and rates move up.",
        "The longer you wait, the wider this gap can get.",
      ]
    : [
        "In this scenario, your monthly rent is lower than the full cost of owning.",
        "You’re investing your down payment instead of locking it in a home.",
        "Buying can still be the right life move — this is only the money story.",
      ];

  return (
    <section className="rounded-2xl border border-black/[0.06] bg-white px-5 py-6 shadow-sm sm:px-7 sm:py-8">
      <h2 className="font-display text-lg font-semibold text-[#0B1F3A] sm:text-xl">{heading(decision)}</h2>
      <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-[#0B1F3A]/85">
        {lines.map((line) => (
          <li key={line} className="flex gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#D4AF37]" aria-hidden />
            {line}
          </li>
        ))}
      </ul>
    </section>
  );
}

function heading(d: DecisionEngineV2) {
  if (d.buysAhead) return "You’re losing ground by waiting because:";
  return "Why renting looks stronger here:";
}
