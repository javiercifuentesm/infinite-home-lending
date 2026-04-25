import { useMemo, useRef, useState } from "react";
import type { AssumableInputs } from "../../../hooks/useAssumableMath";
import { runCalculation } from "../../../hooks/useAssumableMath";
import { DealDeskHeader } from "../DealDeskHeader";
import { ACCTA } from "./ACCTA";
import { ACEligibility } from "./ACEligibility";
import { ACGapAnalysis } from "./ACGapAnalysis";
import { ACGuidedTour } from "./ACGuidedTour";
import { ACInsight } from "./ACInsight";
import { ACLoanInputs } from "./ACLoanInputs";
import { ACPurchaseInputs } from "./ACPurchaseInputs";
import { ACSavingsHero } from "./ACSavingsHero";
import { ACSavingsTable } from "./ACSavingsTable";
import { ACDualPanel } from "./ACDualPanel";
import { ACWorthItBanner } from "./ACWorthItBanner";

const defaultInputs: AssumableInputs = {
  loanType: "fha",
  assumedRate: 3.25,
  loanBal: 310000,
  termYrs: 27,
  purchasePrice: 475000,
  gapRate: 8.5,
  gapTerm: 20,
  mktRate: 6.875,
  vaElig: "no",
};

export default function ACCalculator() {
  const [inputs, setInputs] = useState<AssumableInputs>(defaultInputs);
  const [tourUiActive, setTourUiActive] = useState(false);
  const [replayToken, setReplayToken] = useState(0);
  const mainToolRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => runCalculation(inputs), [inputs]);

  return (
    <div className="relative min-h-screen bg-[#F4F6F9] pb-16 pt-0 font-[Lato,system-ui,sans-serif]">
      <div ref={mainToolRef} tabIndex={-1} aria-hidden={tourUiActive} className="outline-none">
        <DealDeskHeader toolTitle="The Assumable Calculator" />

        <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
          <div className="border-b border-slate-200/90 pb-8">
            <h1 className="font-[Georgia,serif] text-[22px] font-medium text-[#0B2A4A] sm:text-[1.4rem]">The Assumable Calculator</h1>
            <p className="mt-1 font-sans text-[12px] font-medium text-slate-500">
              The Assumable Calculator: Is This Loan Worth Assuming?
            </p>
            <p className="mt-4 max-w-3xl font-sans text-[14px] leading-[1.6] text-slate-600">
              Most agents know assumable loans exist. Almost none can calculate whether the deal is actually worth it — especially when the buyer
              needs gap financing to cover the equity difference. This tool does the math in 60 seconds: blended rate, monthly saving, lifetime interest
              advantage, and whether the assumption is actually worth the complexity.
            </p>
          </div>

          <section className="mt-10 space-y-8">
            <ACLoanInputs inputs={inputs} onChange={setInputs} />
            <ACPurchaseInputs inputs={inputs} onChange={setInputs} />

            <ACSavingsHero results={results} />

            <ACWorthItBanner results={results} />

            <ACDualPanel results={results} />

            <ACGapAnalysis results={results} />

            <ACSavingsTable results={results} />

            <ACEligibility results={results} />

            <ACInsight results={results} />

            <ACCTA results={results} />

            <p className="font-sans text-[10px] leading-relaxed text-slate-500">
              All calculations are educational estimates. Assumed loan payment uses remaining balance and term — actual payment may differ based on
              escrow, MIP, and servicer requirements. Gap financing rate is an estimate — actual second mortgage rates vary by lender and buyer profile.
              Blended rate is a weighted average approximation. VA funding fee: 0.5% of assumed balance. FHA assumption fee: up to $1,800 per HUD 4000.1.
              Assumption process typically takes 45–75 days. This tool does not confirm loan assumability — contact the servicer directly. Not a loan
              offer or commitment to lend.
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

      <ACGuidedTour
        mainContentRef={mainToolRef}
        replayToken={replayToken}
        onActiveChange={setTourUiActive}
        results={results}
      />
    </div>
  );
}
