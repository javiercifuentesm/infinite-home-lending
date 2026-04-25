import type { PowerMapResults } from "../../../hooks/usePowerMapMath";
import { fmtK } from "../../../hooks/usePowerMapMath";

type Props = { results: PowerMapResults };

export function PMInsight({ results }: Props) {
  const {
    currentPrice,
    improvedPrice,
    powerGain,
    creditImp,
    debtPayoff,
    savingsBoost,
    incomeGrowth,
    improvedCount,
    marketsWithStatus,
    m6Price,
  } = results;

  const allSlidersZero = creditImp === 0 && debtPayoff === 0 && savingsBoost === 0 && incomeGrowth === 0;

  const unlockedSorted = marketsWithStatus.filter((m) => m.status === "unlocked").sort((a, b) => b.price - a.price);
  const highUnlockedName = unlockedSorted[0]?.name ?? "nearby starter markets";
  const highPlanName =
    [...marketsWithStatus].filter((m) => m.status === "unlocked" || m.status === "improved").sort((a, b) => b.price - a.price)[0]
      ?.name ?? "more of the region";

  const firstImproved = marketsWithStatus.find((m) => m.status === "improved");
  const monthsAway = firstImproved && m6Price >= firstImproved.price * 1.05 ? 6 : 12;

  let text: string;

  if (currentPrice < 350000) {
    text =
      "You are earlier in your homebuying journey than most of the people who use this tool — and that is actually an advantage. The decisions you make now about credit, savings rate, and debt have a compounding effect that people who buy in a rush never get. Your 12-month plan is not just about saving more money. It is about building the financial profile that unlocks rates — and markets — that feel out of reach today.";
  } else if (powerGain > 100000) {
    text = `Your improvement plan adds ${fmtK(powerGain)} in buying power — that is not incremental, that is transformational. The difference between ${fmtK(currentPrice)} and ${fmtK(improvedPrice)} in the MD-DC-VA market is the difference between ${highUnlockedName} and ${highPlanName}. The actions that produce that gain are specific and achievable within your 12-month timeline.`;
  } else if (allSlidersZero) {
    text =
      "Try the improvement sliders above to see how specific financial moves translate into actual buying power and real market access. Moving the credit slider from 0 to +60 points typically unlocks $50,000–$80,000 in additional buying power and drops your interest rate. Every slider has a real dollar answer for your specific situation.";
  } else {
    const s = improvedCount === 1 ? "" : "s";
    text = `The ${improvedCount} market${s} your improvement plan unlocks represent a real geographic expansion of your options in the MD-DC-VA region. The roadmap above connects specific financial actions to specific market access — so instead of thinking you cannot afford that neighborhood, you can think in terms of being ${monthsAway} months away from qualifying there. That shift in framing is the entire point of this tool.`;
  }

  return (
    <aside
      className="border-l-[3px] px-4 py-[0.9rem] font-[Georgia,serif] text-[14px] italic leading-relaxed text-slate-800"
      style={{ borderColor: "#C6A15B", background: "rgba(248,250,252,0.95)" }}
    >
      {text}
    </aside>
  );
}
