import type { SEQRunResult } from "../../../hooks/useSEQMath";
import type { SEQPath } from "./SEQPathTabs";
import { fmt, fmtK } from "./seqFormat";

type Props = {
  path: SEQPath;
  results: SEQRunResult;
  planReduction: number;
};

export function SEQInsight({ path, results, planReduction }: Props) {
  const { tx, txMaxPrice, bsMaxPrice, txCanAfford, bsCanAfford, planHomeDiff, planning, targetPrice } = results;

  const diffPaths = Math.abs(txMaxPrice - bsMaxPrice);
  const winner = txMaxPrice >= bsMaxPrice ? "tax return" : "bank statement";

  let text: string;

  if (path === "compare" && diffPaths > 30000) {
    text = `There's a $${fmtK(diffPaths)} difference between your two paths — that's not a small gap. The ${winner} path is clearly stronger for your current numbers. The right strategy depends on whether you want to qualify on your documented income as-is, or whether adjusting next year's filing changes the picture more favorably.`;
  } else if (!txCanAfford && !bsCanAfford && planHomeDiff > 25000) {
    text = `Neither standard path quite reaches your $${fmt(targetPrice)} target — but the mortgage planning scenario shows that reducing write-offs by $${fmt(planReduction)} could add $${fmtK(planHomeDiff)} in buying power, at a tax cost of $${fmt(planning.planTaxCost)}. That's a trade worth modeling with your CPA before your next filing.`;
  } else if (tx.declining) {
    text = `Your income declined from Year 1 to Year 2 — lenders will use only the lower, most recent year's income. This is one of the most impactful and least-understood rules in self-employed mortgage qualification. If that decline was temporary, a current-year P&L and a CPA letter explaining the reason can help offset the concern.`;
  } else if (tx.totalAddback > 5000) {
    text = `Your add-backs total $${fmt(tx.totalAddback)} per year — that's real qualifying income that standard tax return math leaves on the table. Depreciation, home office, and meals add-backs are legitimate and expected. Make sure your loan officer is capturing every one of them.`;
  } else {
    text = `Self-employed mortgage qualification is not a yes or no — it's a calculation. Your qualifying income is not your revenue and not your net profit. It's net profit, adjusted by specific add-backs, averaged correctly depending on income trend. The difference between a loan officer who understands this math and one who doesn't can be $100,000+ in buying power.`;
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
