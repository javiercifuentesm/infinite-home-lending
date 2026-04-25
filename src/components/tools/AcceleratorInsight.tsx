import type { PaymentFreq } from "../../hooks/useAcceleratorMath";
import { fmt } from "../../hooks/useAcceleratorMath";

type Props = {
  extraAmt: number;
  monthsSaved: number;
  intSaved: number;
  yearsSaved: number;
  basePayment: number;
  freq: PaymentFreq;
};

function freqPhrase(f: PaymentFreq, amount: number): string {
  if (amount === 0) return "";
  switch (f) {
    case "monthly":
      return `${fmt(amount)} per month`;
    case "biweekly":
      return `${fmt(amount)} bi-weekly toward principal`;
    case "annual":
      return `${fmt(amount)} annually`;
    case "onetime":
      return `a one-time ${fmt(amount)} payment`;
    default:
      return fmt(amount);
  }
}

export function AcceleratorInsight({
  extraAmt,
  monthsSaved,
  intSaved,
  yearsSaved,
  basePayment,
  freq,
}: Props) {
  let text: string;

  if (extraAmt === 0) {
    text =
      "Move the slider above to see what even a small extra payment does to your loan. Most people are surprised by how quickly the numbers change — especially the total interest saved. Start with $100 and go from there.";
  } else if (monthsSaved >= 36 && intSaved >= 20000) {
    const pctOfPayment = basePayment > 0 ? Math.round((extraAmt / basePayment) * 100) : 0;
    text = `Adding ${freqPhrase(freq, extraAmt)} is one of the highest-impact financial moves available to a homeowner. That's roughly ${pctOfPayment}% more than your standard payment — and it's shaving ${yearsSaved} years off your mortgage while eliminating ${fmt(intSaved)} in interest. The compounding effect of early principal reduction is what makes this so powerful.`;
  } else if (monthsSaved >= 12) {
    text = `${freqPhrase(freq, extraAmt)} adds up to more than it looks. The reason the savings are disproportionate to the payment size is that every dollar of principal you eliminate today eliminates all the interest that would have accrued on that dollar for the remaining life of the loan. Early payments are the most powerful ones.`;
  } else {
    text = `Even this amount is doing real work — removing ${fmt(intSaved)} in interest and shortening your loan. The earlier in the loan term you make extra payments, the larger the impact. Principal eliminated now eliminates decades of future interest compounding.`;
  }

  return (
    <blockquote
      className="border-l-[3px] border-[#C6A15B] py-4 pl-[1.1rem] pr-4 font-[Georgia,serif] text-[15px] italic leading-relaxed text-[#0B2A4A]"
      style={{ background: "var(--color-background-secondary)" }}
    >
      {text}
    </blockquote>
  );
}
