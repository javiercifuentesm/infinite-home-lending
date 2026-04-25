import { useMemo, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { defaultFHAInputs, runCalculation, type FHAInputs } from "../../../hooks/useFHAMath";
import { FHAPurchaseInputs } from "./FHAPurchaseInputs";
import { FHARateInputs } from "./FHARateInputs";
import { FHAVerdictBanner } from "./FHAVerdictBanner";
import { FHALoanColumns } from "./FHALoanColumns";
import { FHAMetrics } from "./FHAMetrics";
import { FHACrossoverFlag } from "./FHACrossoverFlag";
import { FHACostChart } from "./FHACostChart";
import { FHAMIChart } from "./FHAMIChart";
import { FHAMIExplainer } from "./FHAMIExplainer";
import { FHARefiStrategy } from "./FHARefiStrategy";
import { FHAProfileGrid } from "./FHAProfileGrid";
import { FHAInsight } from "./FHAInsight";
import { FHACTA } from "./FHACTA";
import { SmartToolIntro } from "../SmartToolIntro";

export default function FHACalculator() {
  const [inputs, setInputs] = useState<FHAInputs>(() => defaultFHAInputs());

  const results = useMemo(
    () =>
      runCalculation({
        ...inputs,
        dpPct: inputs.dp / 100,
      }),
    [inputs],
  );

  const chartKey = useMemo(() => JSON.stringify(inputs), [inputs]);

  const showCrossoverFlag = results.crossoverYear !== null && results.crossoverYear <= 30;

  return (
    <div
      className="fha-comparison-tool mx-auto max-w-5xl px-4 pb-16 pt-0 font-[Lato,system-ui,sans-serif] sm:px-6 lg:px-8"
      style={
        {
          "--color-text-tertiary": "#64748b",
        } as CSSProperties
      }
    >
      <SmartToolIntro title="Conventional vs. FHA: The Full Cost Comparison">
        <p>
          Most comparison tools show you two monthly payments and call it a decision. This one shows you the mortgage insurance crossover year,
          the FHA-to-Conventional refinance strategy, how your credit score changes the verdict, and a personalized recommendation based on
          your actual financial profile.
        </p>
      </SmartToolIntro>

      <section className="mt-10 space-y-8">
        <FHAPurchaseInputs inputs={inputs} onChange={setInputs} />
        <FHARateInputs inputs={inputs} onChange={setInputs} />

        {inputs.cs >= 640 && inputs.cs <= 680 ? (
          <p className="rounded-lg border border-[#C6A15B]/25 bg-[rgba(198,161,91,0.06)] px-4 py-3 text-[13px] leading-relaxed text-[rgba(11,42,74,0.88)]">
            <Link
              to="/tools/credit-score-roi"
              className="font-semibold text-[#0B2A4A] underline decoration-[#C6A15B]/50 hover:text-[#C6A15B]"
            >
              Calculate what improving your score would save you →
            </Link>
          </p>
        ) : null}

        <FHAVerdictBanner results={results} dpInput={inputs.dp} />
        <FHALoanColumns results={results} dpInput={inputs.dp} />
        <FHAMetrics results={results} />

        {showCrossoverFlag ? <FHACrossoverFlag crossoverYear={results.crossoverYear} /> : null}
        <FHACostChart results={results} chartKey={chartKey} />
        <FHAMIChart results={results} chartKey={chartKey} />

        <FHAMIExplainer results={results} />
        <FHARefiStrategy results={results} />
        <FHAProfileGrid cs={inputs.cs} />
        <FHAInsight inputs={inputs} results={results} />
        <FHACTA />

        <p className="text-center text-[10px] leading-relaxed text-[var(--color-text-tertiary)]">
          Estimates are for educational purposes only. 2026 FHA loan limits: $524,225 (standard) to $1,249,125 (high-cost). Conventional conforming
          limit: $832,750. FHA MIP rates: 0.55% annually for most 30-year loans with less than 10% down. PMI rates vary by lender, credit score, and
          LTV. Actual rates and insurance costs depend on lender, borrower profile, and market conditions. Contact Infinite Home Lending for a
          personalized analysis.
        </p>
      </section>
    </div>
  );
}
