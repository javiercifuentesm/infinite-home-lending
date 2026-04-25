import type { AssumableResults } from "../../../hooks/useAssumableMath";
import { fmt, fmtK } from "../../../hooks/useAssumableMath";

type Props = { results: AssumableResults };

function loanUpper(lt: string): string {
  if (lt === "va") return "VA";
  if (lt === "fha") return "FHA";
  return "USDA";
}

export function ACInsight({ results }: Props) {
  const {
    loanType,
    assumedRate,
    mktRate,
    equityGap,
    gapRate,
    blendedRate,
    rateAdvantage,
    monthlySaving,
    annualSaving,
    lifetimeSaving,
  } = results;

  const lt = loanUpper(loanType);
  const rateGap = Math.abs(mktRate - assumedRate).toFixed(3);

  const gapSentence =
    equityGap > 0
      ? ` The buyer needs to bridge a ${fmtK(equityGap)} equity gap through cash or a second mortgage at ${gapRate.toFixed(3)}%.`
      : "";

  const blendedSentence =
    blendedRate < mktRate
      ? `${Math.abs(rateAdvantage).toFixed(3)}% below what a new loan would cost.`
      : `above what a new loan would cost.`;

  let tier = "";
  if (monthlySaving >= 400) {
    tier = ` The ${fmt(monthlySaving)}/month saving is significant — that is ${fmtK(annualSaving)} per year and ${fmtK(Math.max(0, lifetimeSaving))} over the life of the loan. This is a feature worth leading with in the listing description and in every buyer conversation.`;
  } else if (monthlySaving >= 100) {
    tier = ` The ${fmt(monthlySaving)}/month saving is real but modest given the complexity of the assumption process. Weigh the 45–75 day timeline and dual-payment structure against the benefit for this specific buyer.`;
  } else {
    tier = ` At these numbers, the assumption advantage is narrow. The gap financing cost is absorbing most of the rate benefit. Consider negotiating the purchase price down to improve the blended rate before presenting this to a buyer.`;
  }

  const text = `This ${lt} loan at ${assumedRate.toFixed(3)}% is ${rateGap}% below today's ${mktRate.toFixed(3)}% market rate.${gapSentence} Even after accounting for the gap financing, the blended rate across both loans is ${blendedRate.toFixed(3)}% — ${blendedSentence}${tier}`;

  return (
    <div className="rounded-r-lg border border-[rgba(11,42,74,0.08)] border-l-[3px] border-l-[#C6A15B] bg-[rgba(11,42,74,0.04)] py-[0.85rem] pl-4 pr-4">
      <p className="font-sans text-[10px] font-semibold uppercase tracking-wide text-[#C6A15B]">📋 Agent script</p>
      <p className="mt-2 font-[Georgia,serif] text-[13px] italic leading-[1.65] text-[#0B2A4A]">{text}</p>
    </div>
  );
}
