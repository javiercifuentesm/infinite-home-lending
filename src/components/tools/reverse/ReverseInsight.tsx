import type { ReverseResult } from "../../../hooks/useReverseMath";
import { fmt } from "../../../hooks/useReverseMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = {
  results: ReverseResult;
};

export function ReverseInsight({ results }: Props) {
  const { t } = useLanguage();
  const {
    eligible,
    incomeGap,
    tenurePayment,
    netPL,
    locGrowthRate,
    locAt10,
  } = results;

  const locPct = (locGrowthRate * 100).toFixed(1);
  let text: string;

  if (!eligible) {
    text = t("tool.reverse.insight.ineligible");
  } else if (incomeGap > 0 && tenurePayment >= incomeGap) {
    const spare = Math.max(0, tenurePayment - incomeGap);
    text = t("tool.reverse.insight.gapFull")
      .replace("{gap}", fmt(incomeGap))
      .replace("{tenure}", fmt(tenurePayment))
      .replace("{spare}", fmt(spare))
      .replace("{net}", fmt(netPL))
      .replace("{locPct}", locPct);
  } else if (incomeGap > 0 && tenurePayment < incomeGap) {
    const rem = Math.max(0, incomeGap - tenurePayment);
    text = t("tool.reverse.insight.gapPartial")
      .replace("{tenure}", fmt(tenurePayment))
      .replace("{gap}", fmt(incomeGap))
      .replace("{rem}", fmt(rem));
  } else {
    text = t("tool.reverse.insight.surplus")
      .replace("{locPct}", locPct)
      .replace("{net}", fmt(netPL))
      .replace("{locAt10}", fmt(locAt10));
  }

  return (
    <blockquote
      className="border-l-[3px] border-[#C6A15B] py-[0.9rem] pl-4 pr-4 font-[Georgia,serif] text-[15px] italic leading-relaxed text-[#0B2A4A]"
      style={{ background: "var(--color-background-secondary)" }}
    >
      {text}
    </blockquote>
  );
}
