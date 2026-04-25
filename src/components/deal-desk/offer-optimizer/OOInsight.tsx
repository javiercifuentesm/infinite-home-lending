import type { BuydownType, OfferOptimizerResults } from "../../../hooks/useOfferOptimizerMath";
import { fmt } from "../../../hooks/useOfferOptimizerMath";

type Props = {
  results: OfferOptimizerResults;
  buydownType: BuydownType;
};

function typeWord(t: BuydownType): string {
  if (t === "2-1") return "2-1";
  if (t === "1-0") return "1-0";
  return "permanent";
}

export function OOInsight({ results, buydownType }: Props) {
  const {
    buydownWins,
    buydownBetterForSeller,
    buyerQualifiesAtAsk,
    buyerQualifiesWithBuydown,
    remainingConcession,
    pmtDiff,
    buydownCost,
    sellerNetDiff,
  } = results;

  const tw = typeWord(buydownType);

  let text: string;

  if (buydownWins && buydownBetterForSeller) {
    text = `This is your listing presentation moment. The ${tw} buydown costs the seller ${fmt(buydownCost)} — but nets them ${fmt(Math.abs(sellerNetDiff))} MORE than a straight price cut, while delivering ${fmt(pmtDiff)}/month in real payment relief to the buyer. Lead with this math in your seller consultation and watch the conversation shift.`;
  } else if (!buyerQualifiesAtAsk && buyerQualifiesWithBuydown) {
    text = `This buyer doesn't qualify at the market rate — but they DO qualify with the ${tw} buydown in place. The seller's concession isn't just making the deal more attractive; it's making the deal possible. That's the framing that moves sellers who are hesitant about concessions.`;
  } else if (remainingConcession > 2000) {
    text = `After funding the ${tw} buydown (${fmt(buydownCost)}), there's ${fmt(remainingConcession)} of the seller's concession budget remaining. Consider applying it to buyer closing costs — which shows up directly on the settlement statement and makes the offer even cleaner for the buyer.`;
  } else if (!buydownWins) {
    text = `The price cut wins on payment by ${fmt(pmtDiff)}/month — a narrow margin. Before defaulting to a price reduction, consider whether the ${tw} buydown structure could be reframed as a closing cost credit or a rate lock buy-down for a buyer who is rate-sensitive. The math is close enough that presentation matters more than the numbers do.`;
  } else {
    text = `The ${tw} buydown delivers ${fmt(pmtDiff)}/month in payment relief vs. a price cut of the same dollar amount. Present this side by side to your buyer — not as a 'concession,' but as a 'rate advantage.' Buyers respond to lower payments; sellers respond to protecting their price. This structure gives both parties what they actually care about.`;
  }

  return (
    <aside
      className="border-l-[3px] border-[#C6A15B] bg-[#F4F6F9] px-4 py-[0.9rem] font-[Georgia,serif] text-[14px] italic leading-relaxed text-slate-800"
    >
      {text}
    </aside>
  );
}
