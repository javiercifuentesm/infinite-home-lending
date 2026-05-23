import type { CreditCalcResult } from "../../../hooks/useCreditMath";
import { fmt, fmtK } from "../../../hooks/useCreditMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = { results: CreditCalcResult };

export function CreditTimeline({ results }: Props) {
  const { t } = useLanguage();
  const { timeframe, monthlySavings, lifetimeSavings, term } = results;
  const rowCls = "flex items-center justify-between border-b border-[var(--color-border-tertiary,#e2e8f0)] py-3 text-[13px] last:border-b-0";
  const green = "text-[#27500A]";

  return (
    <div className="rounded-lg border border-[var(--color-border-tertiary,#e2e8f0)] bg-white px-4 py-4 sm:px-6">
      <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">
        {t("tool.credit.timeline.title").replace("{timeframe}", String(timeframe))}
      </h3>
      <div className="mt-2 divide-y divide-[var(--color-border-tertiary,#e2e8f0)]">
        <div className={rowCls}>
          <span className="text-slate-600">{t("tool.credit.timeline.timeLabel")}</span>
          <span className="font-medium text-[#0B2A4A]">{t("tool.credit.timeline.timeVal").replace("{timeframe}", String(timeframe))}</span>
        </div>
        <div className={rowCls}>
          <span className="text-slate-600">{t("tool.credit.timeline.rent")}</span>
          <span className="text-right text-slate-600">{t("tool.credit.timeline.rentNote")}</span>
        </div>
        <div className={rowCls}>
          <span className="text-slate-600">{t("tool.credit.timeline.moSave")}</span>
          <span className={`font-medium ${green}`}>${fmt(monthlySavings)}/mo</span>
        </div>
        <div className={rowCls}>
          <span className="text-slate-600">{t("tool.credit.timeline.breakeven")}</span>
          <span className={`font-medium ${green}`}>{t("tool.credit.timeline.breakevenVal")}</span>
        </div>
        <div className={`${rowCls} border-b-0`}>
          <span className="text-slate-600">{t("tool.credit.timeline.totalReturn").replace("{term}", String(term))}</span>
          <span className={`font-medium ${green}`} style={{ fontWeight: 500 }}>
            {fmtK(lifetimeSavings)}
          </span>
        </div>
      </div>
    </div>
  );
}
