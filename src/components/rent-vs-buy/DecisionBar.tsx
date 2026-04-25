import type { ImpactLevel } from "../../lib/rentVsBuy/decisionEngineV2";

type Props = {
  level: ImpactLevel;
};

const copy: Record<ImpactLevel, { label: string; textClass: string; dot: string }> = {
  low: {
    label: "Low",
    textClass: "text-emerald-800",
    dot: "left-[14%]",
  },
  medium: {
    label: "Medium",
    textClass: "text-amber-900",
    dot: "left-1/2 -translate-x-1/2",
  },
  high: {
    label: "High",
    textClass: "text-rose-800",
    dot: "right-[14%]",
  },
};

export function DecisionBar({ level }: Props) {
  const c = copy[level];
  return (
    <section className="rounded-2xl border border-black/[0.06] bg-white px-5 py-6 shadow-sm sm:px-7">
      <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#0B1F3A]/55">Financial impact of waiting</p>
      <div className="relative mt-6 h-3 w-full overflow-hidden rounded-full bg-[#0B1F3A]/10">
        <div
          className="absolute inset-0 bg-gradient-to-r from-emerald-400/35 via-amber-400/45 to-rose-500/45"
          aria-hidden
        />
        <div
          className={`absolute top-1/2 size-4 -translate-y-1/2 rounded-full border-2 border-white bg-gradient-to-br from-[#D4AF37] to-[#0B1F3A] shadow-md ${c.dot}`}
        />
      </div>
      <div className="mt-3 flex justify-between text-[10px] font-bold uppercase tracking-wide text-[#0B1F3A]/40">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
      </div>
      <p className={`mt-3 text-center font-display text-lg font-semibold ${c.textClass}`}>
        Impact of waiting: <span className="underline decoration-[#D4AF37]/50 underline-offset-4">{c.label}</span>
      </p>
    </section>
  );
}
