import type { WaitingCalcResult } from "../../hooks/useWaitingMath";
import { fmt, fmtK, formatWaitPeriodLabelI18n } from "../../hooks/useWaitingMath";
import { useLanguage } from "../../i18n/LanguageContext";

type Props = {
  data: WaitingCalcResult;
  waitMonths: number;
};

export function WaitingCostHero({ data, waitMonths }: Props) {
  const { t } = useLanguage();
  const up = Math.max(1, Math.floor(waitMonths));
  const upfront = data.extraDown + data.extraClosing;

  return (
    <div className="w-full rounded-xl bg-[#0B2A4A] px-5 py-10 text-center shadow-lg sm:px-8 sm:py-12">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[rgba(255,255,255,0.55)]">
        {t("tool.waiting.hero.tag")} {formatWaitPeriodLabelI18n(up, t)}
      </p>
      <p
        className="mt-4 font-[Georgia,serif] text-[44px] font-medium leading-none text-[#C6A15B]"
        style={{ fontWeight: 500 }}
      >
        {fmtK(data.totalCost)}
      </p>
      <p className="mx-auto mt-5 max-w-xl text-[13px] leading-relaxed text-[rgba(255,255,255,0.7)]">
        {t("tool.waiting.hero.detail")
          .replace("{rent}", fmt(data.rentPaid))
          .replace("{appr}", fmt(data.appreciationMissed))
          .replace("{upfront}", fmt(upfront))}
      </p>
      <p className="mt-4 text-[11px] leading-relaxed text-[rgba(255,255,255,0.4)]">
        {t("tool.waiting.hero.monthlyNote").replace("{rate}", fmt(data.monthlyCostRate))}
      </p>
    </div>
  );
}
