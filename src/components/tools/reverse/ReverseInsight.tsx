import type { ReverseResult } from "../../../hooks/useReverseMath";
import { fmt } from "../../../hooks/useReverseMath";

type Props = {
  results: ReverseResult;
};

export function ReverseInsight({ results }: Props) {
  const {
    eligible,
    incomeGap,
    tenurePayment,
    netPL,
    locGrowthRate,
    locAt10,
  } = results;

  const locPct = (locGrowthRate * 100).toFixed(1);
  let text: string;

  if (!eligible) {
    text =
      "Based on the numbers entered, eligibility needs closer review. A reverse mortgage specialist can assess whether a proprietary (non-FHA) product or a different strategy — such as a HELOC or refinance — better fits your situation.";
  } else if (incomeGap > 0 && tenurePayment >= incomeGap) {
    const spare = Math.max(0, tenurePayment - incomeGap);
    text = `Your monthly income gap of ${fmt(incomeGap)} is fully covered by the reverse mortgage tenure payment of ${fmt(tenurePayment)}/month — with ${fmt(spare)}/month to spare. For many retirees in this position, the more strategic choice is actually the line of credit: leave the ${fmt(netPL)} untouched, let it grow at ${locPct}% annually, and use it as a healthcare or emergency reserve while your gap is covered another way.`;
  } else if (incomeGap > 0 && tenurePayment < incomeGap) {
    const rem = Math.max(0, incomeGap - tenurePayment);
    text = `The reverse mortgage tenure payment covers ${fmt(tenurePayment)}/month of your ${fmt(incomeGap)}/month income gap. The remaining ${fmt(rem)}/month will need to come from savings, investments, or other income. A reverse mortgage is not a complete solution here — but it's a meaningful one that reduces the pressure on other assets and may extend how long your portfolio lasts.`;
  } else {
    text = `Your income currently covers expenses — which actually makes this the ideal time to consider a reverse mortgage line of credit. You don't need the money now, which means the credit line sits untouched and grows at ${locPct}% annually. In 10 years at that rate, your ${fmt(netPL)} line of credit could grow to approximately ${fmt(locAt10)}. That's a healthcare or legacy reserve built from equity you already have.`;
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
