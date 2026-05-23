import type { RLEResults } from "../../../hooks/useRLEMath";
import { fmt, fmtK } from "../../../hooks/useRLEMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = { results: RLEResults };

export function RLEInsight({ results }: Props) {
  const { t } = useLanguage();
  const {
    daysToClose,
    rateEnv,
    monthlyRisk,
    monthlyUpside,
    asymRatio,
    term,
    lockedPmt,
    risePmt,
    lifetimeRisk,
    riseScenario,
    floatWorth,
    floatCost,
    floatNetSave,
    floatThresh,
    floatDownCost,
    dropScenario,
  } = results;

  let text: string;

  if (daysToClose <= 10) {
    text = t("tool.rle.insight.urgent").replace("{days}", String(daysToClose));
  } else if (rateEnv === "rising" && monthlyRisk > 100) {
    text = t("tool.rle.insight.rising")
      .replace("{risk}", fmt(monthlyRisk))
      .replace("{days}", String(daysToClose))
      .replace("{annual}", fmt(monthlyRisk * 12));
  } else if (parseFloat(asymRatio) >= 2.0) {
    text = t("tool.rle.insight.asym")
      .replace("{ratio}", asymRatio)
      .replace("{risk}", fmt(monthlyRisk))
      .replace("{term}", String(term))
      .replace("{save}", fmt(monthlyUpside));
  } else if (floatWorth && floatCost > 0) {
    const costStr = fmt(floatDownCost);
    text = t("tool.rle.insight.floatOpt")
      .replace("{thresh}", String(floatThresh))
      .replace("{drop}", String(dropScenario))
      .replace("{net}", fmtK(floatNetSave))
      .replaceAll("{cost}", costStr);
  } else {
    text = t("tool.rle.insight.default")
      .replace("{days}", String(daysToClose))
      .replace("{locked}", fmt(lockedPmt))
      .replace("{term}", String(term))
      .replace("{rise}", String(riseScenario))
      .replace("{risePmt}", fmt(risePmt))
      .replace("{lifetime}", fmtK(lifetimeRisk));
  }

  return (
    <aside
      className="border-l-[3px] px-4 py-[0.9rem] font-[Georgia,serif] text-[14px] italic leading-relaxed text-slate-800"
      style={{ borderColor: "#C6A15B", background: "rgba(248,250,252,0.95)" }}
    >
      {text}
    </aside>
  );
}
