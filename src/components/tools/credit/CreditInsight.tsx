import type { CreditCalcResult } from "../../../hooks/useCreditMath";
import { fmt, fmtK } from "../../../hooks/useCreditMath";

type Props = {
  results: CreditCalcResult;
  curScore: number;
  isTopTier: boolean;
};

export function CreditInsight({ results, curScore, isTopTier }: Props) {
  const { lifetimeSavings, ptsDiff, effectiveTgt, dollarPerPoint } = results;

  let body: string;
  if (isTopTier) {
    body =
      "You’re already in the top rate tier — the rate you’re offered is effectively the best available. The focus now shifts from score improvement to loan structuring: down payment optimization, loan type selection, and rate lock timing are where the remaining opportunity lives.";
  } else if (lifetimeSavings > 50_000) {
    body = `${fmtK(lifetimeSavings)} is a real number — not a marketing claim. Improving your credit from ${curScore} to ${effectiveTgt} before you buy is the highest-return financial move available to you right now. No investment, no side hustle, no cost-cutting delivers ${fmtK(dollarPerPoint)} per point of effort with this kind of certainty. The question isn't whether to do it. It's how to do it in the shortest time.`;
  } else if (ptsDiff <= 30) {
    body = `Only ${ptsDiff} points separate you from a meaningfully better rate — and that gap is often closeable in 60–90 days with one or two targeted moves. Paying a credit card balance below 30% utilization alone has driven 30+ point improvements in a single billing cycle for many borrowers. The return on that one action, in your situation, is ${fmtK(lifetimeSavings)}.`;
  } else {
    body = `At $${fmt(dollarPerPoint)} per point, improving your credit score is one of the most efficient financial moves you can make before buying a home. Unlike saving for a larger down payment — which requires cash you may not have — credit improvement is largely a behavior change and a timeline decision. An advisor can map your specific path.`;
  }

  return (
    <aside
      className="border-l-[3px] border-[#C6A15B] bg-[var(--color-background-secondary,#f8fafc)] px-4 py-[0.9rem] text-[14px] leading-relaxed text-[#0B2A4A]"
      style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}
    >
      {body}
    </aside>
  );
}
