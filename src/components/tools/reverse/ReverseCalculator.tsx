import { useMemo, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { defaultReverseInputs, runCalculation } from "../../../hooks/useReverseMath";
import type { ReverseInputs } from "../../../hooks/useReverseMath";
import { ReverseSituationInputs } from "./ReverseSituationInputs";
import { ReverseIncomeInputs } from "./ReverseIncomeInputs";
import { ReverseEligibilityBanner } from "./ReverseEligibilityBanner";
import { ReverseMetrics } from "./ReverseMetrics";
import type { StratId } from "./ReverseStrategyGrid";
import { ReverseStrategyGrid } from "./ReverseStrategyGrid";
import { ReverseEquityChart } from "./ReverseEquityChart";
import { ReverseIncomeGap } from "./ReverseIncomeGap";
import { ReverseHeirChart } from "./ReverseHeirChart";
import { ReverseHeirSnapshot } from "./ReverseHeirSnapshot";
import { ReverseMythBuster } from "./ReverseMythBuster";
import { ReverseInsight } from "./ReverseInsight";
import { ReverseCTA } from "./ReverseCTA";
import { SmartToolIntro } from "../SmartToolIntro";

export default function ReverseCalculator() {
  const [inputs, setInputs] = useState<ReverseInputs>(() => defaultReverseInputs());
  const [activeStrat, setActiveStrat] = useState<StratId>("loc");

  const results = runCalculation(inputs);
  const chartKey = useMemo(() => JSON.stringify(inputs), [inputs]);

  return (
    <div
      className="reverse-planner mx-auto max-w-5xl px-4 pb-16 pt-0 font-[Lato,system-ui,sans-serif] sm:px-6 lg:px-8"
      style={
        {
          "--color-text-tertiary": "#64748b",
        } as CSSProperties
      }
    >
      <SmartToolIntro title="Reverse Mortgage Retirement Planner">
        <p>
          Most reverse mortgage calculators give you one number and stop. This one shows you the full retirement picture — all
          four payout strategies compared side by side, your monthly income gap analysis, what each option does to your
          heirs&apos; inheritance, and the honest answers to the questions most people are afraid to ask.
        </p>
        <p>
          Comparing equity access options before 62?{" "}
          <Link to="/tools/heloc-planner">
            HELOC Smart Planner
          </Link>{" "}
          — draw period vs repayment, rate scenarios, and alternatives side by side.
        </p>
      </SmartToolIntro>

      <section className="mt-10 space-y-8">
        <ReverseSituationInputs inputs={inputs} onChange={setInputs} />
        <ReverseIncomeInputs inputs={inputs} onChange={setInputs} />

        <ReverseEligibilityBanner inputs={inputs} results={results} />
        <ReverseMetrics results={results} />

        <ReverseStrategyGrid
          inputs={inputs}
          results={results}
          activeStrat={activeStrat}
          onSelectStrat={setActiveStrat}
        />

        <ReverseEquityChart results={results} chartKey={chartKey} />
        <ReverseIncomeGap inputs={inputs} results={results} />
        <ReverseHeirChart results={results} chartKey={chartKey} />
        <ReverseHeirSnapshot results={results} />

        <ReverseMythBuster />
        <ReverseInsight results={results} />
        <ReverseCTA />

        <p className="text-center text-[10px] leading-relaxed text-[var(--color-text-tertiary)]">
          Estimates are for educational purposes only. Principal Limit Factors are approximated from HUD age/rate tables and may
          differ from actual HECM calculations. The 2026 HECM lending limit is $1,209,750. Results do not constitute a loan offer
          or financial advice. Closing costs, MIP, and lender-specific terms affect actual proceeds. Contact Infinite Home Lending
          for a personalized analysis.
        </p>
      </section>
    </div>
  );
}
