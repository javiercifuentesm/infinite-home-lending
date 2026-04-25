import type { RLEResults } from "../../../hooks/useRLEMath";
import { fmt, fmtK } from "../../../hooks/useRLEMath";

type Props = { results: RLEResults };

export function RLEInsight({ results }: Props) {
  const {
    daysToClose,
    rateEnv,
    monthlyRisk,
    monthlyUpside,
    asymRatio,
    term,
    lockedPmt,
    risePmt,
    lifetimeRisk,
    riseScenario,
    floatWorth,
    floatCost,
    floatNetSave,
    floatThresh,
    floatDownCost,
    dropScenario,
  } = results;

  let text: string;

  if (daysToClose <= 10) {
    text = `With ${daysToClose} days until closing, this is not a decision — this is an emergency. At this distance, floating exposes you to any rate movement between now and closing with almost no time to recover. Lock your rate today. The potential savings from waiting are trivial relative to the risk.`;
  } else if (rateEnv === "rising" && monthlyRisk > 100) {
    text = `In a rising rate environment, floating your rate means accepting ${fmt(monthlyRisk)} more per month — potentially forever — in exchange for the possibility that rates reverse before your closing in ${daysToClose} days. ${fmt(monthlyRisk * 12)} per year in extra interest. Experts consistently caution that rates take the elevator up and the stairs down. The lock eliminates that exposure completely.`;
  } else if (parseFloat(asymRatio) >= 2.0) {
    text = `The asymmetry here is real: your downside is ${asymRatio}× your upside. Floating is a bet with unfavorable odds — not because rates will not drop, but because if they rise, you absorb ${fmt(monthlyRisk)} more every month for ${term} years. The potential saving of ${fmt(monthlyUpside)}/month does not justify the exposure for most borrowers.`;
  } else if (floatWorth && floatCost > 0) {
    text = `The most interesting option here may be the float-down. You get rate protection in both directions — locked against rises, eligible to capture drops of ${floatThresh}%+. If rates drop ${dropScenario}%, the net benefit is ${fmtK(floatNetSave)} after the ${fmt(floatDownCost)} cost. That is the best-of-both-worlds option — if your lender offers it at these terms.`;
  } else {
    text = `The rate lock question is fundamentally about risk tolerance, not rate prediction. Nobody knows where rates will be in ${daysToClose} days. What we do know: if you lock, your payment is ${fmt(lockedPmt)}/month for ${term} years. If rates rise ${riseScenario}% while you float, your payment becomes ${fmt(risePmt)}/month for ${term} years. That is ${fmtK(lifetimeRisk)} in additional interest. The decision is yours — this engine just makes sure you know exactly what you are deciding.`;
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
