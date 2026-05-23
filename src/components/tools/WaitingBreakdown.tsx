import type { WaitingCalcResult } from "../../hooks/useWaitingMath";
import { fmtK } from "../../hooks/useWaitingMath";
import { useLanguage } from "../../i18n/LanguageContext";

type Props = {
  data: WaitingCalcResult;
  waitMonths: number;
};

export function WaitingBreakdown({ data, waitMonths }: Props) {
  const { t } = useLanguage();
  const m = Math.max(1, Math.floor(waitMonths));
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div
        className="rounded-xl p-5"
        style={{ background: "var(--color-background-danger)" }}
      >
        <p className="text-[12px] font-semibold text-[#A32D2D]">{t("tool.waiting.breakdown.rentTitle")}</p>
        <p className="mt-1 font-[Georgia,serif] text-[1.5rem] font-medium text-[#791F1F]">{fmtK(data.rentPaid)}</p>
        <p className="mt-2 text-[12px] text-[#A32D2D]">{t("tool.waiting.breakdown.rentSub")}</p>
      </div>
      <div
        className="rounded-xl p-5"
        style={{ background: "var(--color-background-warning)" }}
      >
        <p className="text-[12px] font-semibold text-[#854F0B]">{t("tool.waiting.breakdown.apprTitle")}</p>
        <p className="mt-1 font-[Georgia,serif] text-[1.5rem] font-medium text-[#633806]">{fmtK(data.appreciationMissed)}</p>
        <p className="mt-2 text-[12px] text-[#854F0B]">{t("tool.waiting.breakdown.apprSub")}</p>
      </div>
      <div className="rounded-xl border border-[#C6A15B]/25 bg-[rgba(198,161,91,0.1)] p-5">
        <p className="text-[12px] font-semibold text-[#854F0B]">{t("tool.waiting.breakdown.downTitle")}</p>
        <p className="mt-1 font-[Georgia,serif] text-[1.5rem] font-medium text-[#0B2A4A]">{fmtK(data.extraDown)}</p>
        <p className="mt-2 text-[12px] text-[#C6A15B]">{t("tool.waiting.breakdown.downSub")}</p>
      </div>
      <div
        className="rounded-xl p-5"
        style={{ background: "var(--color-background-secondary)" }}
      >
        <p className="text-[12px] font-semibold text-[var(--color-text-tertiary)]">
          {t("tool.waiting.breakdown.equityTitle")}
        </p>
        <p className="mt-1 font-[Georgia,serif] text-[1.5rem] font-medium text-[var(--color-text-primary)]">
          {fmtK(data.equityMissed)}
        </p>
        <p className="mt-2 text-[12px] text-[var(--color-text-tertiary)]">
          {t("tool.waiting.breakdown.equitySub").replace("{m}", String(m))}
        </p>
      </div>
    </div>
  );
}
