import { useMemo, useRef, useState } from "react";
import type { ListingBoostInputs } from "../../../hooks/useListingBoostMath";
import { runCalculation } from "../../../hooks/useListingBoostMath";
import { DealDeskHeader } from "../DealDeskHeader";
import { LBBuyerPoolInputs } from "./LBBuyerPoolInputs";
import { LBCTA } from "./LBCTA";
import { LBGuidedTour } from "./LBGuidedTour";
import { LBInsight } from "./LBInsight";
import { LBListingInputs } from "./LBListingInputs";
import { LBNetProceeds } from "./LBNetProceeds";
import { LBPoolBars } from "./LBPoolBars";
import { LBPoolHero } from "./LBPoolHero";
import { LBScenarioGrid } from "./LBScenarioGrid";
import { LBThresholdTable } from "./LBThresholdTable";

const defaultInputs: ListingBoostInputs = {
  listPrice: 525000,
  dom: 28,
  rate: 6.875,
  budget: 15000,
  payoff: 290000,
  comm: 5.0,
  areaIncome: 105000,
  areaDebts: 700,
  downPct: 10,
  ptaxRate: 1.1,
};

export default function LBCalculator() {
  const [inputs, setInputs] = useState<ListingBoostInputs>(defaultInputs);
  const [tourUiActive, setTourUiActive] = useState(false);
  const [replayToken, setReplayToken] = useState(0);
  const mainToolRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => runCalculation(inputs), [inputs]);

  return (
    <div className="relative min-h-screen bg-[#F4F6F9] pb-16 pt-0 font-[Lato,system-ui,sans-serif]">
      <div ref={mainToolRef} tabIndex={-1} aria-hidden={tourUiActive} className="outline-none">
        <DealDeskHeader toolTitle="The Listing Boost" />

        <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
          <div className="border-b border-slate-200/90 pb-8">
            <h1 className="font-[Georgia,serif] text-[22px] font-medium text-[#0B2A4A] sm:text-[1.4rem]">The Listing Boost</h1>
            <p className="mt-1 font-sans text-[12px] font-medium text-slate-500">
              The Listing Boost: What Would Lower Payments Do to Your Buyer Pool?
            </p>
            <p className="mt-4 max-w-3xl font-sans text-[14px] leading-[1.6] text-slate-600">
              A price cut reduces what buyers pay. A buydown reduces what they need to earn to qualify — expanding your buyer pool. This tool shows
              your seller exactly how many more buyers can afford their home under each scenario, what it costs them, and what they walk away with.
            </p>
          </div>

          <section className="mt-10 space-y-8">
            <LBListingInputs inputs={inputs} onChange={setInputs} />
            <LBBuyerPoolInputs inputs={inputs} onChange={setInputs} />

            <LBPoolHero results={results} />

            <LBScenarioGrid results={results} />

            <LBPoolBars results={results} />

            <LBThresholdTable results={results} />

            <LBNetProceeds results={results} />

            <LBInsight results={results} />

            <LBCTA results={results} />

            <p className="font-sans text-[10px] leading-relaxed text-slate-500">
              Buyer pool estimates use regional income distribution modeling and standard 43% DTI methodology. Actual pool size depends on local
              market conditions, available inventory, buyer credit profiles, and lender guidelines. Payment estimates use 30-year fixed amortization.
              Seller net proceeds include estimated transfer tax (1.5% MD average) and seller closing costs ($8,000 estimate) — actual figures vary by
              county and transaction. Buydown costs are approximations — IHL will quote exact costs for any specific transaction. This tool is for
              educational and negotiation planning purposes only and does not constitute a loan offer.
            </p>

            <p className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setReplayToken((n) => n + 1)}
                className="font-sans text-[11px] text-slate-500 underline decoration-slate-300 underline-offset-2 transition-colors hover:text-[#0B2A4A]"
              >
                Replay tour
              </button>
            </p>
          </section>
        </div>
      </div>

      <LBGuidedTour
        mainContentRef={mainToolRef}
        replayToken={replayToken}
        onActiveChange={setTourUiActive}
        results={results}
      />
    </div>
  );
}
