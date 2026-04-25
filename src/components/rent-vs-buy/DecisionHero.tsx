import { FUTURE_SHOCK_WAIT_YEARS, formatUsd, type DecisionEngineV2 } from "../../lib/rentVsBuy/decisionEngineV2";

type View = "buyNow" | "wait";

type Props = {
  decision: DecisionEngineV2;
  view: View;
};

/**
 * One number, one message — subtext always anchors to renting baseline.
 */
export function DecisionHero({ decision, view }: Props) {
  const sub = "Compared to continuing to rent";
  const amt = formatUsd(decision.headlineAmount);
  const waitCost = formatUsd(decision.twoYearWaitCostTotal);

  if (decision.buysAhead) {
    if (view === "buyNow") {
      return (
        <header className="text-center">
          <h1 className="font-display text-[clamp(1.65rem,5.2vw,2.35rem)] font-semibold leading-[1.12] tracking-[-0.02em] text-[#0B1F3A]">
            Buying now puts you ahead by {wrapMoney(amt)}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[#0B1F3A]/65">{sub}</p>
        </header>
      );
    }
    return (
      <header className="text-center">
        <h1 className="font-display text-[clamp(1.65rem,5.2vw,2.35rem)] font-semibold leading-[1.12] tracking-[-0.02em] text-[#0B1F3A]">
          Waiting {FUTURE_SHOCK_WAIT_YEARS} years costs you {wrapMoney(waitCost)}
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[#0B1F3A]/65">{sub}</p>
      </header>
    );
  }

  if (view === "wait") {
    return (
      <header className="text-center">
        <h1 className="font-display text-[clamp(1.65rem,5.2vw,2.35rem)] font-semibold leading-[1.12] tracking-[-0.02em] text-[#0B1F3A]">
          Renting leaves you ahead by {wrapMoney(amt)}
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[#0B1F3A]/65">{sub}</p>
      </header>
    );
  }

  return (
    <header className="text-center">
      <h1 className="font-display text-[clamp(1.65rem,5.2vw,2.35rem)] font-semibold leading-[1.12] tracking-[-0.02em] text-[#0B1F3A]">
        Buying now costs you more than renting by {wrapMoney(amt)}
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-[#0B1F3A]/65">{sub}</p>
    </header>
  );
}

function wrapMoney(s: string) {
  return (
    <span className="numeric block pt-1 text-[clamp(2rem,6vw,2.85rem)] font-bold text-[#0B1F3A] sm:inline sm:pt-0">
      {s}
    </span>
  );
}
