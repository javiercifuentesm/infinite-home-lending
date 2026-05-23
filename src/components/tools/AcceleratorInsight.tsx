import type { PaymentFreq } from "../../hooks/useAcceleratorMath";
import { fmt } from "../../hooks/useAcceleratorMath";
import { useLanguage } from "../../i18n/LanguageContext";

type Props = {
  extraAmt: number;
  monthsSaved: number;
  intSaved: number;
  yearsSaved: number;
  basePayment: number;
  freq: PaymentFreq;
};

export function AcceleratorInsight({
  extraAmt,
  monthsSaved,
  intSaved,
  yearsSaved,
  basePayment,
  freq,
}: Props) {
  const { t, lang } = useLanguage();

  const freqPhrase = (f: PaymentFreq, amount: number): string => {
    if (amount === 0) return "";
    switch (f) {
      case "monthly":
        return `${fmt(amount)} ${t("tool.accelerator.insight.perMonth")}`;
      case "biweekly":
        return `${fmt(amount)} ${t("tool.accelerator.insight.biweekly")}`;
      case "annual":
        return `${fmt(amount)} ${t("tool.accelerator.insight.annually")}`;
      case "onetime":
        if (lang === "es") {
          return `${t("tool.accelerator.insight.onetime")} ${fmt(amount)}`;
        }
        return `${t("tool.accelerator.insight.onetime")} ${fmt(amount)} ${t("tool.accelerator.insight.payment")}`;
      default:
        return fmt(amount);
    }
  };

  let text: string;

  if (extraAmt === 0) {
    text = t("tool.accelerator.insight.zero");
  } else if (monthsSaved >= 36 && intSaved >= 20000) {
    const pctOfPayment = basePayment > 0 ? Math.round((extraAmt / basePayment) * 100) : 0;
    text = t("tool.accelerator.insight.high")
      .replace("{freqPhrase}", freqPhrase(freq, extraAmt))
      .replace("{pct}", String(pctOfPayment))
      .replace("{years}", String(yearsSaved))
      .replace("{intSaved}", fmt(intSaved));
  } else if (monthsSaved >= 12) {
    text = t("tool.accelerator.insight.medium").replace("{freqPhrase}", freqPhrase(freq, extraAmt));
  } else {
    text = t("tool.accelerator.insight.low");
  }

  return (
    <blockquote
      className="border-l-[3px] border-[#C6A15B] py-4 pl-[1.1rem] pr-4 font-[Georgia,serif] text-[15px] italic leading-relaxed text-[#0B2A4A]"
      style={{ background: "var(--color-background-secondary)" }}
    >
      {text}
    </blockquote>
  );
}
