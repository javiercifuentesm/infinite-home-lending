import { useMemo, useState, type CSSProperties } from "react";
import { defaultHelocInputs, runCalculation } from "../../../hooks/useHelocMath";
import type { HelocInputs } from "../../../hooks/useHelocMath";
import { HelocEquityInputs } from "./HelocEquityInputs";
import { HelocTermInputs } from "./HelocTermInputs";
import { HelocUseCaseSelector, type UseCaseKey } from "./HelocUseCaseSelector";
import { HelocEquityHero } from "./HelocEquityHero";
import { HelocMetrics } from "./HelocMetrics";
import { HelocRateScenarios } from "./HelocRateScenarios";
import { HelocCliffCallout } from "./HelocCliffCallout";
import { HelocPaymentChart } from "./HelocPaymentChart";
import { HelocEquityChart } from "./HelocEquityChart";
import { HelocComparison } from "./HelocComparison";
import { HelocUseCaseVerdict } from "./HelocUseCaseVerdict";
import { HelocInsight } from "./HelocInsight";
import { HelocCTA } from "./HelocCTA";
import { SmartToolIntro } from "../SmartToolIntro";

export default function HelocCalculator() {
  const [inputs, setInputs] = useState<HelocInputs>(() => defaultHelocInputs());
  const [activeUse, setActiveUse] = useState<UseCaseKey>("reno");

  const results = useMemo(
    () =>
      runCalculation({
        ...inputs,
        cltvPct: inputs.cltv / 100,
      }),
    [inputs],
  );

  const chartKey = useMemo(() => JSON.stringify(inputs), [inputs]);

  return (
    <div
      className="heloc-planner mx-auto max-w-5xl px-4 pb-16 pt-0 font-[Lato,system-ui,sans-serif] sm:px-6 lg:px-8"
      style={
        {
          "--color-text-tertiary": "#64748b",
        } as CSSProperties
      }
    >
      <SmartToolIntro title="HELOC Smart Planner">
        <p>
          Most HELOC calculators show you a credit limit and stop there. This one shows you your full borrowing power, the real
          cost through both phases of the loan, what happens when rates rise, and whether a HELOC is actually the right tool for
          what you&apos;re trying to do — compared to your other options.
        </p>
      </SmartToolIntro>

      <section className="mt-10 space-y-8">
        <HelocEquityInputs inputs={inputs} onChange={setInputs} />
        <HelocTermInputs inputs={inputs} onChange={setInputs} />
        <HelocUseCaseSelector activeUse={activeUse} onChange={setActiveUse} />

        <HelocEquityHero inputs={inputs} results={results} />
        <HelocMetrics results={results} />
        <HelocRateScenarios results={results} />
        <HelocCliffCallout results={results} />
        <HelocPaymentChart results={results} chartKey={chartKey} />
        <HelocEquityChart results={results} chartKey={chartKey} />
        <HelocComparison results={results} />
        <HelocUseCaseVerdict activeUse={activeUse} rate={results.rate} />
        <HelocInsight inputs={inputs} results={results} activeUse={activeUse} />
        <HelocCTA />

        <p className="text-center text-[10px] leading-relaxed text-[var(--color-text-tertiary)]">
          Estimates are for educational purposes only and do not constitute a loan offer. HELOC availability, rates, and CLTV
          limits vary by lender, state, and borrower qualification. Variable rates may increase significantly — model rate
          scenarios accordingly. Tax deductibility of HELOC interest depends on use of funds; consult a tax advisor. Contact
          Infinite Home Lending for a personalized analysis.
        </p>
      </section>
    </div>
  );
}
