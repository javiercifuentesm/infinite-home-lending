import type { ReverseResult } from "../../../hooks/useReverseMath";
import { fmt } from "../../../hooks/useReverseMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = {
  results: ReverseResult;
};

export function ReverseMetrics({ results }: Props) {
  const { t } = useLanguage();
  const { grossPL, netPL, tenurePayment, incomeGap } = results;

  let m4Value: string;
  let m4Sub: string;
  if (incomeGap <= 0) {
    m4Value = t("tool.reverse.metrics.noGap");
    m4Sub = t("tool.reverse.metrics.noGapSub");
  } else if (tenurePayment >= incomeGap) {
    m4Value = t("tool.reverse.metrics.fully");
    m4Sub = `${fmt(incomeGap)}${t("tool.reverse.metrics.moGap")}`;
  } else {
    m4Value = t("tool.reverse.metrics.partially");
    m4Sub = `${fmt(incomeGap)}${t("tool.reverse.metrics.moGap")}`;
  }

  const cards = [
    { label: t("tool.reverse.metrics.grossPL"), value: fmt(grossPL), sub: t("tool.reverse.metrics.grossPLSub") },
    { label: t("tool.reverse.metrics.netPL"), value: fmt(netPL), sub: t("tool.reverse.metrics.netPLSub") },
    { label: t("tool.reverse.metrics.tenure"), value: fmt(tenurePayment), sub: t("tool.reverse.metrics.tenureSub") },
    { label: t("tool.reverse.metrics.gapCovered"), value: m4Value, sub: m4Sub },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-[var(--border-radius-md)] px-4 py-4"
          style={{ background: "var(--color-background-secondary)" }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">{c.label}</p>
          <p className="mt-2 font-[Georgia,serif] text-xl font-semibold text-[#0B2A4A]">{c.value}</p>
          <p className="mt-1 text-[13px] leading-snug text-[var(--color-text-tertiary)]">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}
