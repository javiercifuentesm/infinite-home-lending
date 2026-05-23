import type { SEQRunResult } from "../../../hooks/useSEQMath";
import { useLanguage } from "../../../i18n/LanguageContext";
import type { SEQPath } from "./SEQPathTabs";
import { fmt, fmtK } from "./seqFormat";

type Props = {
  path: SEQPath;
  results: SEQRunResult;
  planReduction: number;
};

export function SEQInsight({ path, results, planReduction }: Props) {
  const { t } = useLanguage();
  const { tx, txMaxPrice, bsMaxPrice, txCanAfford, bsCanAfford, planHomeDiff, planning, targetPrice } = results;

  const diffPaths = Math.abs(txMaxPrice - bsMaxPrice);
  const winnerKey = txMaxPrice >= bsMaxPrice ? "tool.seq.insight.winnerTax" : "tool.seq.insight.winnerBs";

  let text: string;

  if (path === "compare" && diffPaths > 30000) {
    text = t("tool.seq.insight.compareGap")
      .replace("${diff}", fmtK(diffPaths))
      .replace("${winner}", t(winnerKey));
  } else if (!txCanAfford && !bsCanAfford && planHomeDiff > 25000) {
    text = t("tool.seq.insight.planning")
      .replace("${target}", fmt(targetPrice))
      .replace("${reduction}", fmt(planReduction))
      .replace("${gain}", fmtK(planHomeDiff))
      .replace("${tax}", fmt(planning.planTaxCost));
  } else if (tx.declining) {
    text = t("tool.seq.insight.declining");
  } else if (tx.totalAddback > 5000) {
    text = t("tool.seq.insight.addbacks").replace("${total}", fmt(tx.totalAddback));
  } else {
    text = t("tool.seq.insight.default");
  }

  return (
    <aside
      className="mb-8 border-l-[3px] bg-slate-50 px-4 py-3 font-serif text-[14px] italic leading-relaxed text-slate-800"
      style={{ borderColor: "#C6A15B" }}
    >
      {text}
    </aside>
  );
}
