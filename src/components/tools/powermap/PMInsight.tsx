import type { PowerMapResults } from "../../../hooks/usePowerMapMath";
import { fmtK } from "../../../hooks/usePowerMapMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = { results: PowerMapResults };

export function PMInsight({ results }: Props) {
  const { t } = useLanguage();
  const {
    currentPrice,
    improvedPrice,
    powerGain,
    creditImp,
    debtPayoff,
    savingsBoost,
    incomeGrowth,
    improvedCount,
    marketsWithStatus,
    m6Price,
  } = results;

  const allSlidersZero = creditImp === 0 && debtPayoff === 0 && savingsBoost === 0 && incomeGrowth === 0;

  const unlockedSorted = marketsWithStatus.filter((m) => m.status === "unlocked").sort((a, b) => b.price - a.price);
  const highUnlockedName = unlockedSorted[0]?.name ?? t("tool.pm.insight.starterMarkets");
  const highPlanName =
    [...marketsWithStatus].filter((m) => m.status === "unlocked" || m.status === "improved").sort((a, b) => b.price - a.price)[0]
      ?.name ?? t("tool.pm.insight.moreRegion");

  const firstImproved = marketsWithStatus.find((m) => m.status === "improved");
  const monthsAway = firstImproved && m6Price >= firstImproved.price * 1.05 ? 6 : 12;

  let text: string;

  if (currentPrice < 350000) {
    text = t("tool.pm.insight.early");
  } else if (powerGain > 100000) {
    text = t("tool.pm.insight.bigGain")
      .replace("{gain}", fmtK(powerGain))
      .replace("{current}", fmtK(currentPrice))
      .replace("{improved}", fmtK(improvedPrice))
      .replace("{highUnlocked}", highUnlockedName)
      .replace("{highPlan}", highPlanName);
  } else if (allSlidersZero) {
    text = t("tool.pm.insight.trySliders");
  } else {
    const s = improvedCount === 1 ? "" : "s";
    text = t("tool.pm.insight.marketsPlan")
      .replace("{count}", String(improvedCount))
      .replace("{s}", s)
      .replace("{months}", String(monthsAway));
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
