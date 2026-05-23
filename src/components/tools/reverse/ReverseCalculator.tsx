import { useMemo, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { defaultReverseInputs, runCalculation } from "../../../hooks/useReverseMath";
import type { ReverseInputs } from "../../../hooks/useReverseMath";
import { useLanguage } from "../../../i18n/LanguageContext";
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
  const { t } = useLanguage();
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
      <SmartToolIntro title={t("tool.reverse.title")}>
        <p>{t("tool.reverse.intro1")}</p>
        <p>
          {t("tool.reverse.intro2Lead")}{" "}
          <Link to="/tools/heloc-planner">{t("tool.reverse.helocLink")}</Link> {t("tool.reverse.intro2Trail")}
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

        <p className="text-center text-[10px] leading-relaxed text-[var(--color-text-tertiary)]">{t("tool.reverse.disclaimer")}</p>
      </section>
    </div>
  );
}
