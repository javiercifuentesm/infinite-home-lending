import type { WealthResults } from "../../../hooks/useWealthMath";
import { fmt, fmtK } from "../../../hooks/useWealthMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = { results: WealthResults };

export function WTInsight({ results }: Props) {
  const { t } = useLanguage();
  const {
    buyingWins,
    invReturn,
    advantage,
    appr,
    beYear,
    rent,
    rentAtYear30,
    rentInc,
    totalRentInflationExtra,
  } = results;

  let text: string;

  if (!buyingWins && invReturn >= 9) {
    text = t("wt.insight.renterWins").replace("{rate}", invReturn.toFixed(1));
  } else if (advantage > 300000) {
    text = t("wt.insight.highAdvantage")
      .replace("{appr}", appr.toFixed(1))
      .replace("{advantage}", fmtK(advantage));
  } else if (beYear && beYear <= 5) {
    text = t("wt.insight.fastBreakeven").replace("{year}", String(beYear));
  } else {
    text = t("wt.insight.rentProtection")
      .replace("{rent}", fmt(rent))
      .replace("{rentAtYear30}", fmt(rentAtYear30))
      .replace("{rentInc}", rentInc.toFixed(1))
      .replace("{extra}", fmtK(totalRentInflationExtra));
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
