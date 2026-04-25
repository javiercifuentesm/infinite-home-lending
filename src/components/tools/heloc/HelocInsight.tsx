import type { HelocInputs, HelocResult } from "../../../hooks/useHelocMath";
import { fmt } from "../../../hooks/useHelocMath";
import type { UseCaseKey } from "./HelocUseCaseSelector";

type Props = {
  inputs: HelocInputs;
  results: HelocResult;
  activeUse: UseCaseKey;
};

export function HelocInsight({ inputs, results, activeUse }: Props) {
  const { maxLine, actualDraw, cliffPct, ioPmt, piPmtVal, rate } = results;
  const draw = inputs.draw;

  let text: string;

  if (draw > maxLine) {
    text = `Your requested draw of ${fmt(draw)} exceeds your available credit limit of ${fmt(maxLine)}. Adjusting your draw amount or checking whether a lender allows a higher CLTV would be the first conversation to have.`;
  } else if (cliffPct > 80) {
    text = `The payment cliff from draw period to repayment is significant — ${fmt(ioPmt)}/month becomes ${fmt(piPmtVal)}/month, a ${cliffPct}% increase. The most common mistake with HELOCs is treating the draw-period payment as the real payment. The repayment-period payment is the one you need to budget for today.`;
  } else if (activeUse === "debt" && rate > 9) {
    text = `At ${rate.toFixed(2)}%, debt consolidation into a HELOC needs careful analysis. If the debt you're consolidating is at rates above ${(rate + 3).toFixed(2)}%+, the math supports it. Below that, the risk-to-reward — putting your home at stake — deserves a harder look.`;
  } else if (activeUse === "reno") {
    text =
      "Using a HELOC for home renovation is one of the cleanest financial moves available to a homeowner. You draw as work progresses, you only pay interest on what you've used, the interest is likely tax-deductible, and the improvement may increase the home value that secures the loan. This is the use case HELOCs were designed for.";
  } else if (maxLine > 150000 && actualDraw < maxLine * 0.4) {
    text = `You have ${fmt(maxLine)} available but plan to draw ${fmt(actualDraw)} — less than 40% of your line. That's financially conservative and strategically smart. The unused portion of a HELOC costs you nothing but is there when you need it. Many homeowners establish the full line and draw only what each project requires.`;
  } else {
    text =
      "A HELOC is the right tool when you need flexible, phased access to equity — not a lump sum. If your need is a single, defined expense with a known amount, a home equity loan's fixed rate and predictable payment may serve you better. The right answer depends on what the money is for and how confident you are in the amount.";
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
