import type { FHAInputs, FHAResult } from "../../../hooks/useFHAMath";
import { fmt } from "../../../hooks/useFHAMath";

type Props = {
  inputs: FHAInputs;
  results: FHAResult;
};

export function FHAInsight({ inputs, results }: Props) {
  const { convWins, stay, fhaUFMIP, cs, dpPercentFha } = results;

  let text: string;

  if (inputs.dp >= 20) {
    text =
      "With a 20% down payment, the comparison simplifies significantly: Conventional requires no PMI at all, making it almost universally the stronger choice. The only scenario where FHA could still be considered is if a credit score below 640 makes qualifying for Conventional difficult — but at 20% down, that's rare.";
  } else if (cs >= 720 && convWins) {
    const mipPhrase =
      dpPercentFha < 10
        ? "never cancels on this loan, meaning you carry that cost for 30 years unless you refinance."
        : `lasts 11 years even with ${inputs.dp}% down.`;
    text = `At a ${cs}+ credit score, Conventional PMI is priced favorably — often lower than FHA's MIP — and it cancels automatically once you reach 20% equity. FHA's MIP ${mipPhrase} For buyers with strong credit and a long-term horizon, Conventional consistently wins.`;
  } else if (!convWins && stay <= 7) {
    text = `FHA's lower interest rate makes it the better deal over your ${stay}-year timeline. The upfront MIP is the tradeoff — it's rolled into the loan and doesn't require cash at closing, but it does increase your balance by ${fmt(fhaUFMIP)}. For buyers who will sell or refinance before the cumulative MIP cost becomes significant, FHA is a legitimate financial choice, not just a fallback option.`;
  } else if (cs < 680) {
    text = `At a ${cs} credit score, Conventional PMI is priced at a higher tier — which is why FHA often wins on monthly cost in this range even though its MIP is less flexible. The strategic move: use FHA now, focus on credit improvement over the next 2–3 years, then refinance to Conventional when your score crosses 720+. That refinance eliminates MIP permanently and typically saves $100–200/month.`;
  } else {
    text =
      "When the costs are this close, the decision should be driven by factors beyond the math: how long you're confident you'll stay, whether you anticipate your credit score improving significantly, and how flexible your qualifying situation is. FHA's lower entry bar is its advantage; Conventional's PMI cancellation is its advantage. Neither is wrong — one fits your situation better, and that's worth a conversation.";
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
