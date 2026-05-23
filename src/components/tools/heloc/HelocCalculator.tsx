import { useMemo, useState, type CSSProperties } from "react";
import { defaultHelocInputs, runCalculation } from "../../../hooks/useHelocMath";
import type { HelocInputs } from "../../../hooks/useHelocMath";
import { useLanguage } from "../../../i18n/LanguageContext";
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
  const { t } = useLanguage();
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
      <SmartToolIntro title={t("tool.heloc.title")}>
        <p>{t("tool.heloc.intro")}</p>
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

        <p className="text-center text-[10px] leading-relaxed text-[var(--color-text-tertiary)]">{t("tool.heloc.disclaimer")}</p>
      </section>
    </div>
  );
}
