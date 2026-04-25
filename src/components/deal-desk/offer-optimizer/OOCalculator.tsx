import { useMemo, useRef, useState } from "react";
import {
  runCalculation,
  type OfferOptimizerInputs,
} from "../../../hooks/useOfferOptimizerMath";
import { fmt } from "../../../hooks/useOfferOptimizerMath";
import { DealDeskHeader } from "../DealDeskHeader";
import { OOPropertyInputs } from "./OOPropertyInputs";
import { OOBuyerInputs } from "./OOBuyerInputs";
import { OOBuydownSelector } from "./OOBuydownSelector";
import { OODualPanel } from "./OODualPanel";
import { OOPaymentWinner } from "./OOPaymentWinner";
import { OOBreakevenTable } from "./OOBreakevenTable";
import { OONetProceedsBox } from "./OONetProceedsBox";
import { OOQualificationDelta } from "./OOQualificationDelta";
import { OOShareSummary } from "./OOShareSummary";
import { OOInsight } from "./OOInsight";
import { OOCTA } from "./OOCTA";
import { OOGuidedTour } from "./OOGuidedTour";

const defaultInputs: OfferOptimizerInputs = {
  salePrice: 550000,
  concessionBudget: 15000,
  payoff: 310000,
  commission: 5.0,
  sellerClosing: 8000,
  buyerDP: 10,
  marketRate: 6.875,
  buyerIncome: 8500,
  buyerDebts: 750,
  loanTerm: 30,
  buydownType: "2-1",
};

export default function OOCalculator() {
  const [inputs, setInputs] = useState<OfferOptimizerInputs>(defaultInputs);
  const [tourUiActive, setTourUiActive] = useState(false);
  const [replayToken, setReplayToken] = useState(0);
  const mainToolRef = useRef<HTMLDivElement>(null);
  const results = useMemo(() => runCalculation(inputs), [inputs]);
  const nearlyEqual = results.pmtDiff < 30 && results.pmtDiff > 0;
  const underwaterA = results.netA.rawNetProceeds < 0;

  return (
    <div className="relative min-h-screen bg-[#F4F6F9] pb-16 pt-0 font-[Lato,system-ui,sans-serif]">
      <div
        ref={mainToolRef}
        tabIndex={-1}
        aria-hidden={tourUiActive}
        className="outline-none"
      >
        <DealDeskHeader toolTitle="The Offer Optimizer" />

      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
        <div className="border-b border-slate-200/90 pb-8">
          <h1 className="font-[Georgia,serif] text-[1.35rem] font-medium text-[#0B2A4A] sm:text-[22px]">The Offer Optimizer</h1>
          <p className="mt-4 max-w-3xl text-[14px] leading-[1.6] text-slate-600">
            A {fmt(inputs.concessionBudget)} price cut and a {fmt(inputs.concessionBudget)} seller-funded buydown are not the same thing. This tool
            shows you exactly what each dollar of concession does — to the buyer&apos;s payment, qualification, and your seller&apos;s net proceeds.
          </p>
        </div>

        {underwaterA && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-sans text-[13px] text-red-900">
            Seller underwater at this price — net proceeds would be negative in the price-cut scenario. Review payoff amount.
          </div>
        )}

        <section className="mt-10 space-y-8">
          <OOPropertyInputs inputs={inputs} onChange={setInputs} />
          <OOBuyerInputs inputs={inputs} onChange={setInputs} />
          <OOBuydownSelector inputs={inputs} onChange={setInputs} />

          <OODualPanel results={results} inputs={inputs} />

          {nearlyEqual && (
            <p className="rounded-lg bg-amber-50 px-4 py-3 text-center font-sans text-[12px] text-amber-900">
              Nearly equal — see analysis below ({fmt(results.pmtDiff)}/mo apart in Year 1).
            </p>
          )}

          <OOPaymentWinner results={results} buydownType={inputs.buydownType} />

          <OOBreakevenTable results={results} marketRate={inputs.marketRate} buydownType={inputs.buydownType} />

          <OONetProceedsBox
            results={results}
            commission={inputs.commission}
            sellerClosing={inputs.sellerClosing}
          />

          <OOQualificationDelta results={results} marketRate={inputs.marketRate} salePrice={inputs.salePrice} />

          <OOInsight results={results} buydownType={inputs.buydownType} />

          <OOShareSummary inputs={inputs} results={results} />

          <OOCTA />

          <p className="font-sans text-[10px] leading-relaxed text-slate-500">
            All calculations are educational estimates for negotiation planning. Transfer tax rates, commission structures, and closing costs vary by
            county, state, and transaction. Buydown costs are approximations — actual costs are set by lender at time of transaction. Buyer qualification
            estimates use standard 43% DTI methodology. Contact Infinite Home Lending for precise figures on any specific transaction.
          </p>

          <p className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setReplayToken((n) => n + 1);
              }}
              className="font-sans text-[11px] text-slate-500 underline decoration-slate-300 underline-offset-2 transition-colors hover:text-[#0B2A4A]"
            >
              First time here? Take the guided tour →
            </button>
          </p>
        </section>
      </div>
      </div>

      <OOGuidedTour mainContentRef={mainToolRef} replayToken={replayToken} onActiveChange={setTourUiActive} />
    </div>
  );
}
