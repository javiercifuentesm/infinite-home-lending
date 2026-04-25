import type { PowerMapResults } from "../../../hooks/usePowerMapMath";
import { fmtK } from "../../../hooks/usePowerMapMath";

type Props = { results: PowerMapResults };

export function PMMarketMap({ results }: Props) {
  const { currentPrice, improvedPrice, marketsWithStatus, unlockedCount, improvedCount } = results;

  const sub =
    currentPrice < 350000
      ? `Currently, your buying power of ${fmtK(currentPrice)} is building toward your first accessible markets. With your improvements, ${improvedCount} more market${improvedCount === 1 ? "" : "s"} open up.`
      : `Your current buying power of ${fmtK(currentPrice)} unlocks ${unlockedCount} market${unlockedCount === 1 ? "" : "s"} today. Your improvement plan unlocks ${improvedCount} more.`;

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">MD-DC-VA Market Access Map</h3>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{sub}</p>

      <div className="mt-6 flex flex-col gap-3">
        {marketsWithStatus.map((m) => {
          const threshold = m.price * 1.05;
          const shortfall = Math.max(0, Math.round(threshold - currentPrice));
          const locked = m.status === "locked";

          return (
            <div
              key={m.id}
              className="rounded-lg border-[0.5px] border-slate-200/80 p-4 transition-[background,border-color,opacity] duration-300 ease-out"
              style={{
                opacity: locked ? 0.35 : 1,
                background:
                  m.status === "improved"
                    ? "rgba(59,109,17,0.05)"
                    : m.status === "unlocked"
                      ? "var(--color-surface-slate, rgb(248 250 252))"
                      : "var(--color-background-primary, #ffffff)",
                borderColor:
                  m.status === "improved"
                    ? "rgba(59,109,17,0.15)"
                    : "rgba(148, 163, 184, 0.35)",
              }}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <span className={`text-[13px] font-medium ${locked ? "text-slate-600" : "text-[#0B2A4A]"}`}>{m.name}</span>
                <span
                  className={`text-[12px] font-medium tabular-nums ${
                    locked ? "text-slate-400" : "text-[#27500A]"
                  }`}
                >
                  {fmtK(m.price)}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {m.badges.slice(0, 3).map((b) => (
                  <span
                    key={b}
                    className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-600"
                  >
                    {b}
                  </span>
                ))}
              </div>
              <p className={`mt-2 text-[10px] font-medium ${locked ? "text-slate-500" : "text-[#27500A]"}`}>
                {m.status === "locked" && `🔒 ${fmtK(shortfall)} more needed`}
                {m.status === "unlocked" && "✓ Within your current buying power"}
                {m.status === "improved" && "→ Unlocked by your improvement plan"}
              </p>
              {!locked && m.note ? <p className="mt-1.5 text-[10px] leading-snug text-slate-500">{m.note}</p> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
