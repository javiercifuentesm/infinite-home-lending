import type { SellerNetResults } from "../../../hooks/useSellerNetMath";
import { fmtK } from "../../../hooks/useSellerNetMath";

type Props = { results: SellerNetResults };

export function SNSInsight({ results }: Props) {
  const { price, ask, below3, below5, diff3, diff5 } = results;

  let text = `Before we talk about what price to list at, I want to make sure you understand what each number actually means for your bottom line.

At your asking price of ${fmtK(price)}, you walk away with approximately ${fmtK(ask.net)}. If we accept an offer 3% below — at ${fmtK(below3.price)} — your net drops to ${fmtK(below3.net)}, that is ${fmtK(diff3)} less in your pocket. At 5% below — ${fmtK(below5.price)} — you net ${fmtK(below5.net)}, which is ${fmtK(diff5)} less.

This is your baseline before any offers come in. Every negotiation decision we make from here comes back to these numbers.`;

  if (ask.isUnderwater) {
    text += ` I do want to flag that at the current payoff amount, the net proceeds are negative at your asking price — we need to discuss pricing strategy before going to market.`;
  }

  return (
    <div
      id="sns-agent-script"
      className="rounded-r-lg border border-[rgba(11,42,74,0.08)] border-l-[3px] border-l-[#C6A15B] bg-[rgba(11,42,74,0.04)] py-[0.85rem] pl-4 pr-4"
    >
      <p className="font-sans text-[10px] font-semibold uppercase tracking-wide text-[#C6A15B]">📋 Agent script</p>
      <p className="mt-2 whitespace-pre-line font-[Georgia,serif] text-[13px] italic leading-[1.65] text-[#0B2A4A]">{text}</p>
    </div>
  );
}
