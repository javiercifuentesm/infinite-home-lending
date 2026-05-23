import type { HelocResult } from "../../../hooks/useHelocMath";
import { fmt, fmtK } from "../../../hooks/useHelocMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = { results: HelocResult };

export function HelocMetrics({ results }: Props) {
  const { t } = useLanguage();
  const { ioPmt, piPmtVal, cliffAmount, totalInt } = results;
  const cards = [
    { label: t("tool.heloc.metrics.drawPmt"), value: fmt(ioPmt), sub: t("tool.heloc.metrics.drawPmtSub") },
    { label: t("tool.heloc.metrics.repayPmt"), value: fmt(piPmtVal), sub: t("tool.heloc.metrics.repayPmtSub") },
    { label: t("tool.heloc.metrics.cliff"), value: fmt(cliffAmount), sub: t("tool.heloc.metrics.cliffSub") },
    { label: t("tool.heloc.metrics.totalInt"), value: fmtK(totalInt), sub: t("tool.heloc.metrics.totalIntSub") },
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
