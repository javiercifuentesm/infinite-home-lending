import { useEffect, useMemo, useRef, useState } from "react";
import type { SellerNetInputs } from "../../../hooks/useSellerNetMath";
import { runCalculation } from "../../../hooks/useSellerNetMath";
import { DealDeskHeader } from "../DealDeskHeader";
import { SNSCTA } from "./SNSCTA";
import { SNSGuidedTour } from "./SNSGuidedTour";
import { SNSInsight } from "./SNSInsight";
import { SNSJurisdictionInputs } from "./SNSJurisdictionInputs";
import { SNSNetSheetTable } from "./SNSNetSheetTable";
import { SNSPrintButton } from "./SNSPrintButton";
import { SNSPropertyInputs } from "./SNSPropertyInputs";
import { SNSScenarioHero } from "./SNSScenarioHero";
import { SNSTaxNote } from "./SNSTaxNote";
import { SNSUnderwaterWarning } from "./SNSUnderwaterWarning";

const defaultInputs: SellerNetInputs = {
  price: 550000,
  payoff: 285000,
  comm: 5.0,
  concession: 0,
  hoa: 0,
  warranty: 0,
  titleFee: 1200,
  taxPro: 1800,
  other: 0,
  state: "va_nova",
};

export default function SNSCalculator() {
  const [inputs, setInputs] = useState<SellerNetInputs>(defaultInputs);
  const [tourUiActive, setTourUiActive] = useState(false);
  const [replayToken, setReplayToken] = useState(0);
  const mainToolRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => runCalculation(inputs), [inputs]);

  useEffect(() => {
    document.body.classList.add("sns-print-mode");
    return () => document.body.classList.remove("sns-print-mode");
  }, []);

  return (
    <div className="sns-print-root relative min-h-screen bg-[#F4F6F9] pb-16 pt-0 font-[Lato,system-ui,sans-serif]">
      <div ref={mainToolRef} tabIndex={-1} aria-hidden={tourUiActive} className="outline-none">
        <div className="print:hidden">
          <DealDeskHeader toolTitle="The Seller Net Sheet" />
        </div>

        <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
          <div className="print:hidden border-b border-slate-200/90 pb-8">
            <h1 className="font-[Georgia,serif] text-[22px] font-medium text-[#0B2A4A] sm:text-[1.4rem]">The Seller Net Sheet</h1>
            <p className="mt-1 font-sans text-[12px] font-medium text-slate-500">
              The Seller Net Sheet: Real Numbers Before the Listing Agreement
            </p>
            <p className="mt-4 max-w-3xl font-sans text-[14px] leading-[1.6] text-slate-600">
              Every seller wants to know one thing before they sign the listing agreement: what will I actually walk away with? This tool answers
              that question — in three price scenarios, with real jurisdiction-specific transfer tax rates for MD, DC, and VA — before the first
              showing.
            </p>
          </div>

          <section className="mt-10 space-y-8 print:mt-0 print:space-y-6">
            <div className="sns-inputs space-y-8 print:hidden">
              <SNSPropertyInputs inputs={inputs} onChange={setInputs} />
              <SNSJurisdictionInputs inputs={inputs} onChange={setInputs} />
            </div>

            <div className="sns-results space-y-8">
              <SNSScenarioHero results={results} />

              <div className="print:hidden">
                <SNSPrintButton />
              </div>

              <SNSNetSheetTable results={results} />

              <SNSTaxNote jurisdictionName={results.jurisdictionName} jurisdictionNote={results.jurisdictionNote} />

              {results.ask.isUnderwater ? <SNSUnderwaterWarning /> : null}

              <SNSInsight results={results} />

              <div className="print:hidden">
                <SNSCTA results={results} />
              </div>

              <p className="disc print:hidden font-sans text-[10px] leading-relaxed text-slate-500">
                All figures are estimates for planning purposes. Transfer tax rates reflect 2026 data for MD, DC, and VA but may vary by county and
                change without notice. Title and settlement fees vary by company. Mortgage payoff should be confirmed with your servicer — per diem
                interest is not included. Property tax proration depends on closing date and local tax calendar. Seller concessions are subject to
                lender limits based on loan type and LTV. This tool does not constitute legal, tax, or financial advice. Consult your title company for
                precise closing cost figures before going to market.
              </p>

              <p className="print:hidden mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setReplayToken((n) => n + 1)}
                  className="font-sans text-[11px] text-slate-500 underline decoration-slate-300 underline-offset-2 transition-colors hover:text-[#0B2A4A]"
                >
                  Replay tour
                </button>
              </p>
            </div>
          </section>
        </div>
      </div>

      <SNSGuidedTour
        mainContentRef={mainToolRef}
        replayToken={replayToken}
        onActiveChange={setTourUiActive}
        results={results}
      />
    </div>
  );
}
