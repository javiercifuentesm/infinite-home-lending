import type { PaymentFreq, ScheduleResult } from "../../hooks/useAcceleratorMath";
import { fmt } from "../../hooks/useAcceleratorMath";
import { useLanguage } from "../../i18n/LanguageContext";

type Props = {
  base: ScheduleResult;
  accel: ScheduleResult;
  principal: number;
  extraAmt: number;
  freq: PaymentFreq;
  basePayoff: number;
  accelPayoff: number;
};

export function AcceleratorCompare({
  base,
  accel,
  principal,
  extraAmt,
  freq,
  basePayoff,
  accelPayoff,
}: Props) {
  const { t } = useLanguage();

  const freqLabel = (f: PaymentFreq): string => {
    switch (f) {
      case "monthly":
        return t("tool.accelerator.freq.monthlyLabel");
      case "biweekly":
        return t("tool.accelerator.freq.biweeklyLabel");
      case "annual":
        return t("tool.accelerator.freq.annualLabel");
      case "onetime":
        return t("tool.accelerator.freq.onetimeLabel");
      default:
        return "";
    }
  };

  const extraDisplay = extraAmt === 0 ? "$0" : `${fmt(extraAmt)} ${freqLabel(freq)}`;

  const totalWithBase = principal + base.totalInterest;
  const totalWithAccel = principal + accel.totalInterest + (freq === "onetime" ? extraAmt : 0);

  const row = (label: string, val: string, tone: "good" | "bad" | "neutral") => {
    const cls =
      tone === "good" ? "text-[#27500A]" : tone === "bad" ? "text-[#A32D2D]" : "text-[#0B2A4A]";
    return (
      <div className="flex justify-between gap-3 border-b border-[var(--color-border-tertiary)] py-2.5 text-[14px] last:border-0">
        <span className="text-[var(--color-text-tertiary)]">{label}</span>
        <span className={`tabular-nums font-semibold ${cls}`}>{val}</span>
      </div>
    );
  };

  return (
    <div>
      <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">{t("tool.accelerator.compare.title")}</h3>
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border-[0.5px] border-[var(--color-border-tertiary)] bg-white p-5 shadow-sm">
          <h4 className="font-[Georgia,serif] text-[18px] font-semibold text-[#0B2A4A]">{t("tool.accelerator.compare.without")}</h4>
          <div className="mt-3">
            {row(t("tool.accelerator.compare.monthlyPayment"), fmt(base.payment), "bad")}
            {row(t("tool.accelerator.compare.payoffIn"), `${basePayoff} ${t("tool.accelerator.compare.years")}`, "bad")}
            {row(t("tool.accelerator.compare.totalInterest"), fmt(base.totalInterest), "bad")}
            {row(t("tool.accelerator.compare.totalCost"), fmt(totalWithBase), "neutral")}
          </div>
        </div>
        <div className="rounded-xl border-2 border-[#27500A] bg-white p-5 shadow-sm">
          <h4 className="font-[Georgia,serif] text-[18px] font-semibold text-[#C6A15B]">{t("tool.accelerator.compare.with")}</h4>
          <div className="mt-3">
            {row(t("tool.accelerator.compare.extraPayment"), extraDisplay, "good")}
            {row(t("tool.accelerator.compare.payoffIn"), `${accelPayoff} ${t("tool.accelerator.compare.years")}`, "good")}
            {row(t("tool.accelerator.compare.totalInterest"), fmt(accel.totalInterest), "good")}
            {row(t("tool.accelerator.compare.totalCost"), fmt(totalWithAccel), "neutral")}
          </div>
        </div>
      </div>
    </div>
  );
}
