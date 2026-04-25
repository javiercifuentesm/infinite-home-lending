import type { WaitingCalcResult, WaitingInputs } from "../../hooks/useWaitingMath";
import { fmtK } from "../../hooks/useWaitingMath";

type Props = {
  waitMonths: number;
  inputs: WaitingInputs;
  data: WaitingCalcResult;
};

export function WaitingInsight({ waitMonths, inputs, data }: Props) {
  const m = Math.max(1, Math.floor(waitMonths));
  const appr = inputs.appr;
  let text: string;

  if (m <= 3) {
    text = `Even a ${m}-month wait carries a real financial cost — ${fmtK(data.totalCost)} that doesn't come back. The biggest driver at short timelines isn't the rent paid, it's the equity and appreciation you miss from the moment you could have owned. In a market appreciating at ${appr}% annually, every month of delay moves the price — and your required down payment — higher.`;
  } else if (m <= 12) {
    text = `${fmtK(data.totalCost)} is the price of a ${m}-month wait. That's not a dramatic or hypothetical number — it's rent paid with no return, a home price that moves higher every month, and equity you don't build while watching from the sidelines. None of this means buying is the right decision for everyone right now. But it does mean that 'waiting to see what happens' has a cost, and that cost should be part of the conversation.`;
  } else {
    const waitYrs = (m / 12).toFixed(1).replace(/\.0$/, "");
    text = `Waiting ${waitYrs} years has a compounding cost that most people underestimate. Home prices don't wait. Rent doesn't wait. And the equity you're not building compounds against you in both directions. The right time to buy is when your financial picture supports it — not when the market is perfect, because the market doesn't signal perfection. It just keeps moving.`;
  }

  return (
    <blockquote
      className="border-l-[3px] border-[#C6A15B] py-[0.9rem] pl-4 pr-4 font-[Georgia,serif] text-[15px] italic leading-relaxed text-[var(--tcw-text-primary,#0B2A4A)]"
      style={{ background: "var(--color-background-secondary)" }}
    >
      {text}
    </blockquote>
  );
}
