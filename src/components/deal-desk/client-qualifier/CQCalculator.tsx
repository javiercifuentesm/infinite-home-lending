import { useMemo, useRef, useState } from "react";
import type { ClientQualifierInputs } from "../../../hooks/useClientQualifierMath";
import { runCalculation } from "../../../hooks/useClientQualifierMath";
import { DealDeskHeader } from "../DealDeskHeader";
import { CQActionPlan } from "./CQActionPlan";
import { CQBuyerInputs } from "./CQBuyerInputs";
import { CQCTA } from "./CQCTA";
import { CQDownPaymentGap } from "./CQDownPaymentGap";
import { CQGuidedTour } from "./CQGuidedTour";
import { CQInsight } from "./CQInsight";
import { CQLoanTypeEngine } from "./CQLoanTypeEngine";
import { CQMarketInputs } from "./CQMarketInputs";
import { CQPaymentRange } from "./CQPaymentRange";
import { CQSnapshotGrid } from "./CQSnapshotGrid";
import { CQTrafficLight } from "./CQTrafficLight";

const defaultInputs: ClientQualifierInputs = {
  income: 95000,
  debts: 650,
  score: 660,
  savings: 25000,
  target: 450000,
  vaEligible: false,
  marketRate: 6.875,
  ptaxRate: 1.1,
};

export default function CQCalculator() {
  const [inputs, setInputs] = useState<ClientQualifierInputs>(defaultInputs);
  const [tourUiActive, setTourUiActive] = useState(false);
  const [replayToken, setReplayToken] = useState(0);
  const mainToolRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => runCalculation(inputs), [inputs]);

  return (
    <div className="relative min-h-screen bg-[#F4F6F9] pb-16 pt-0 font-[Lato,system-ui,sans-serif]">
      <div ref={mainToolRef} tabIndex={-1} aria-hidden={tourUiActive} className="outline-none">
        <DealDeskHeader toolTitle="The Client Qualifier" />

        <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
          <div className="border-b border-slate-200/90 pb-8">
            <h1 className="font-[Georgia,serif] text-[22px] font-medium text-[#0B2A4A] sm:text-[1.4rem]">The Client Qualifier</h1>
            <p className="mt-1 font-sans text-[12px] font-medium text-slate-500">
              The Client Qualifier: Realtor&apos;s Pre-Showing Mortgage Snapshot
            </p>
            <p className="mt-4 max-w-3xl font-sans text-[14px] leading-[1.6] text-slate-600">
              Run this before you unlock a single door. Know who&apos;s ready, who needs 30 days, and who needs a plan — before you spend an afternoon
              showing homes they can&apos;t afford.
            </p>
          </div>

          <section className="mt-10 space-y-8">
            <CQBuyerInputs inputs={inputs} onChange={setInputs} />
            <CQMarketInputs inputs={inputs} onChange={setInputs} />

            <CQTrafficLight results={results} />

            <CQSnapshotGrid results={results} />

            <CQLoanTypeEngine results={results} />

            <CQPaymentRange results={results} />

            <CQDownPaymentGap results={results} />

            <CQActionPlan results={results} />

            <CQInsight results={results} />

            <CQCTA results={results} />

            <p className="font-sans text-[10px] leading-relaxed text-slate-500">
              This snapshot uses estimated figures and standard DTI methodology (43% maximum). Actual qualification depends on full underwriting,
              verified income, credit pull, and current lender guidelines. This is not a pre-approval or commitment to lend. Tax rates are estimates —
              actual rates vary by county and municipality. VA loan eligibility requires a Certificate of Eligibility (COE). Down payment assistance
              program eligibility varies — contact IHL for current program availability in MD, DC, and VA.
            </p>

            <p className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setReplayToken((n) => n + 1)}
                className="font-sans text-[11px] text-slate-500 underline decoration-slate-300 underline-offset-2 transition-colors hover:text-[#0B2A4A]"
              >
                First time here? Take the guided tour →
              </button>
            </p>
          </section>
        </div>
      </div>

      <CQGuidedTour mainContentRef={mainToolRef} replayToken={replayToken} onActiveChange={setTourUiActive} />
    </div>
  );
}
