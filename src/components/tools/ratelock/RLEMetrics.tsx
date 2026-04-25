import type { RLEResults } from "../../../hooks/useRLEMath";
import { fmt, fmtK } from "../../../hooks/useRLEMath";

type Props = { results: RLEResults };

export function RLEMetrics({ results }: Props) {
  const { lockedPmt, rate, monthlyRisk, monthlyUpside, riseScenario, dropScenario, lifetimeRisk } = results;

  const cards = [
    {
      title: "Locked monthly payment",
      value: fmt(lockedPmt),
      valueClass: "text-[#0B2A4A]",
      sub: `at ${rate.toFixed(3)}% forever`,
    },
    {
      title: "Monthly risk if rates rise",
      value: `+${fmt(monthlyRisk)}`,
      valueClass: "text-[#A32D2D]",
      sub: `more per month, +${riseScenario}%`,
    },
    {
      title: "Monthly gain if rates drop",
      value: `−${fmt(monthlyUpside)}`,
      valueClass: "text-[#27500A]",
      sub: `saved per month, −${dropScenario}%`,
    },
    {
      title: "Lifetime exposure",
      value: fmtK(lifetimeRisk),
      valueClass: "text-[#A32D2D]",
      sub: `more interest if rates rise +${riseScenario}%`,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.title} className="rounded-lg border border-slate-200/90 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{c.title}</p>
          <p className={`mt-2 font-[Georgia,serif] text-xl font-semibold tabular-nums ${c.valueClass}`}>{c.value}</p>
          <p className="mt-1 text-[11px] text-slate-500">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}
