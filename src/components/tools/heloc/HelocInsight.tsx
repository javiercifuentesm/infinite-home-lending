import type { HelocInputs, HelocResult } from "../../../hooks/useHelocMath";
import { fmt } from "../../../hooks/useHelocMath";
import { useLanguage } from "../../../i18n/LanguageContext";
import type { UseCaseKey } from "./HelocUseCaseSelector";

type Props = {
  inputs: HelocInputs;
  results: HelocResult;
  activeUse: UseCaseKey;
};

export function HelocInsight({ inputs, results, activeUse }: Props) {
  const { t } = useLanguage();
  const { maxLine, actualDraw, cliffPct, ioPmt, piPmtVal, rate } = results;
  const draw = inputs.draw;

  let text: string;

  if (draw > maxLine) {
    text = t("tool.heloc.insight.overLimit").replace("{draw}", fmt(draw)).replace("{max}", fmt(maxLine));
  } else if (cliffPct > 80) {
    text = t("tool.heloc.insight.cliffHigh")
      .replace("{io}", fmt(ioPmt))
      .replace("{pi}", fmt(piPmtVal))
      .replace("{pct}", String(cliffPct));
  } else if (activeUse === "debt" && rate > 9) {
    const thresh = (rate + 3).toFixed(2);
    text = t("tool.heloc.insight.debtHighRate")
      .replace("{rate}", rate.toFixed(2))
      .replace("{thresh}", thresh);
  } else if (activeUse === "reno") {
    text = t("tool.heloc.insight.reno");
  } else if (maxLine > 150000 && actualDraw < maxLine * 0.4) {
    text = t("tool.heloc.insight.conservativeDraw").replace("{max}", fmt(maxLine)).replace("{actual}", fmt(actualDraw));
  } else {
    text = t("tool.heloc.insight.default");
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
