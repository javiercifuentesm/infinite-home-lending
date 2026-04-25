import type { WealthResults } from "../../../hooks/useWealthMath";
import { fmt, fmtK } from "../../../hooks/useWealthMath";

type Props = { results: WealthResults };

export function WTInsight({ results }: Props) {
  const {
    buyingWins,
    invReturn,
    advantage,
    appr,
    beYear,
    rent,
    rentAtYear30,
    rentInc,
    totalRentInflationExtra,
  } = results;

  let text: string;

  if (!buyingWins && invReturn >= 9) {
    text = `At a ${invReturn.toFixed(1)}% investment return, the renter who consistently invests the down payment and monthly payment difference does mathematically outperform in this model. That is a real result — and it is honest. But it assumes disciplined monthly investing over 30 years and an above-average return. The homeowner's wealth builds automatically, through mortgage payments that would otherwise be made anyway. The renter's requires consistent behavior and market performance that isn't guaranteed.`;
  } else if (advantage > 300000) {
    text = `At ${appr.toFixed(1)}% appreciation in the MD-DC-VA market, owning builds ${fmtK(advantage)} more wealth than renting over 30 years in this scenario. The Federal Reserve's Survey of Consumer Finances and NAR analyses often cite large homeowner vs. renter net worth gaps nationally. This tool shows you the mechanism: forced equity, compounding appreciation, and fixed housing costs while rents rise. None of this is guaranteed — but the structural advantage of ownership is real and measurable.`;
  } else if (beYear && beYear <= 5) {
    text = `The break-even arrives at year ${beYear} — remarkably fast. That is when the combined equity, appreciation, and rent inflation protection overcome the closing costs and early interest-heavy payments. Beyond that point, every year of owning adds to the wealth advantage. The longer you hold, the more powerfully the gap compounds.`;
  } else {
    text = `Stream 4 — rent inflation protection — is the most underrated wealth lever in this tool. Your mortgage payment is fixed forever. Today's ${fmt(rent)}/mo rent becomes ${fmt(rentAtYear30)}/mo by year 30 at ${rentInc.toFixed(1)}%/yr. That's ${fmtK(totalRentInflationExtra)} of cumulative extra rent cost that your fixed mortgage payment shields you from. Nobody who talks about renting vs. buying calculates that number — but it is one of the most powerful structural arguments for ownership.`;
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
