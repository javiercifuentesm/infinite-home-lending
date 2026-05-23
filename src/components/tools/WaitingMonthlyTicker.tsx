import type { WaitingCalcResult } from "../../hooks/useWaitingMath";
import { fmt } from "../../hooks/useWaitingMath";
import { useLanguage } from "../../i18n/LanguageContext";

type Props = {
  data: WaitingCalcResult;
};

export function WaitingMonthlyTicker({ data }: Props) {
  const { t } = useLanguage();
  const bars = [
    { label: t("tool.waiting.ticker.barRent"), value: data.rentPaid, color: "#A32D2D" },
    { label: t("tool.waiting.ticker.barAppr"), value: data.appreciationMissed, color: "#C6A15B" },
    { label: t("tool.waiting.ticker.barUpfront"), value: data.extraDown + data.extraClosing, color: "#854F0B" },
    { label: t("tool.waiting.ticker.barEquity"), value: data.equityMissed, color: "#888780" },
  ];
  const maxValue = Math.max(...bars.map((b) => b.value), 1);

  return (
    <div className="rounded-xl border border-[var(--tcw-border,#e2e8f0)] bg-[var(--tcw-surface,#fff)] p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="max-w-md text-[15px] font-medium leading-snug text-[var(--tcw-text-primary,#0B2A4A)]">
          {t("tool.waiting.ticker.lead")}
        </p>
        <div className="flex flex-wrap items-baseline gap-1">
          <span className="font-[Georgia,serif] text-3xl font-semibold text-[#A32D2D]">{fmt(data.monthlyCostRate)}</span>
          <span className="text-[13px] text-[var(--tcw-text-muted,#64748b)]">{t("tool.waiting.ticker.perMonth")}</span>
        </div>
      </div>
      <div className="mt-8 space-y-5">
        {bars.map((b) => {
          const pct = Math.round((b.value / maxValue) * 100);
          return (
            <div key={b.label}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="min-w-[150px] max-w-[55%] text-[13px] text-[var(--tcw-text-primary,#0B2A4A)]">{b.label}</span>
                <span className="tabular-nums text-[13px] font-semibold text-[var(--tcw-text-primary,#0B2A4A)]">
                  {fmt(b.value)}
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[rgba(136,135,128,0.2)]">
                <div
                  className="h-2 rounded-full transition-[width] duration-500 ease-out"
                  style={{ width: `${pct}%`, backgroundColor: b.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
