import type { HelocResult } from "../../../hooks/useHelocMath";
import { fmt, fmtK } from "../../../hooks/useHelocMath";

type Props = { results: HelocResult };

export function HelocMetrics({ results }: Props) {
  const { ioPmt, piPmtVal, cliffAmount, totalInt } = results;
  const cards = [
    { label: "Draw period payment", value: fmt(ioPmt), sub: "interest only / month" },
    { label: "Repayment payment", value: fmt(piPmtVal), sub: "principal + interest / month" },
    { label: "Payment increase", value: fmt(cliffAmount), sub: "more per month at repayment" },
    { label: "Total interest cost", value: fmtK(totalInt), sub: "over full loan life" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-[var(--border-radius-md)] px-4 py-4" style={{ background: "var(--color-background-secondary)" }}>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">{c.label}</p>
          <p className="mt-2 font-[Georgia,serif] text-xl font-semibold text-[#0B2A4A]">{c.value}</p>
          <p className="mt-1 text-[13px] text-[var(--color-text-tertiary)]">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}
