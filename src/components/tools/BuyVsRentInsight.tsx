import { useLanguage } from "../../i18n/LanguageContext";

type Props = {
  crossoverYr: number | null;
};

export function BuyVsRentInsight({ crossoverYr }: Props) {
  const { t } = useLanguage();
  let text: string;
  if (crossoverYr == null) {
    text = t("tool.bvr.insight.noCrossover");
  } else if (crossoverYr <= 5) {
    text = t("tool.bvr.insight.earlyCrossover").replace("{yr}", String(crossoverYr));
  } else if (crossoverYr <= 10) {
    text = t("tool.bvr.insight.midCrossover").replace("{yr}", String(crossoverYr));
  } else {
    text = t("tool.bvr.insight.lateCrossover").replace("{yr}", String(crossoverYr));
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
