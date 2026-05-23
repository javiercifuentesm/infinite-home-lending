import { useMemo, useState, type CSSProperties } from "react";
import {
  calcCostForMonths,
  scenarioMonthsForStrip,
  type WaitingInputs,
} from "../../hooks/useWaitingMath";
import { WaitingInputs as WaitingInputsForm } from "./WaitingInputs";
import { WaitingSlider } from "./WaitingSlider";
import { WaitingCostHero } from "./WaitingCostHero";
import { WaitingBreakdown } from "./WaitingBreakdown";
import { WaitingMonthlyTicker } from "./WaitingMonthlyTicker";
import { WaitingScenarioStrip } from "./WaitingScenarioStrip";
import { WaitingChart } from "./WaitingChart";
import { WaitingReframe } from "./WaitingReframe";
import { WaitingInsight } from "./WaitingInsight";
import { WaitingCTA } from "./WaitingCTA";
import { SmartToolIntro } from "./SmartToolIntro";
import { useLanguage } from "../../i18n/LanguageContext";

const defaultInputs: WaitingInputs = {
  hp: 480000,
  rent: 2400,
  dp: 10,
  rate: 6.75,
  appr: 3.5,
  ri: 3.5,
  futureRate: 6.75,
  lt: 30,
};

export default function WaitingCalculator() {
  const { t } = useLanguage();
  const [inputs, setInputs] = useState<WaitingInputs>(defaultInputs);
  const [waitMonths, setWaitMonths] = useState(6);

  const data = useMemo(() => calcCostForMonths(waitMonths, inputs), [waitMonths, inputs]);

  const scenarioData = useMemo(() => {
    const periods = scenarioMonthsForStrip(waitMonths);
    return periods.map((mo) => ({ mo, ...calcCostForMonths(mo, inputs) }));
  }, [waitMonths, inputs]);

  const chartMonths = Math.max(waitMonths, 12);
  const chartData = useMemo(
    () => Array.from({ length: chartMonths }, (_, i) => calcCostForMonths(i + 1, inputs)),
    [chartMonths, inputs],
  );

  const chartKey = JSON.stringify({ waitMonths, inputs });

  return (
    <div
      className="true-cost-waiting mx-auto max-w-5xl px-4 pb-16 pt-0 font-[Lato,system-ui,sans-serif] sm:px-6 lg:px-8"
      style={
        {
          "--tcw-text-primary": "#0B2A4A",
          "--tcw-text-secondary": "#475569",
          "--tcw-text-muted": "#64748b",
          "--tcw-border": "#e2e8f0",
          "--tcw-surface": "#ffffff",
        } as CSSProperties
      }
    >
      <SmartToolIntro title={t("tool.waiting.title")}>
        <p>{t("tool.waiting.intro")}</p>
      </SmartToolIntro>

      <section className="mt-10 space-y-8">
        <WaitingInputsForm inputs={inputs} onChange={setInputs} />
        <WaitingSlider waitMonths={waitMonths} onChange={setWaitMonths} />
        <WaitingCostHero data={data} waitMonths={waitMonths} />
        <WaitingBreakdown data={data} waitMonths={waitMonths} />
        <WaitingMonthlyTicker data={data} />
        <div>
          <p className="mb-3 text-[13px] font-semibold text-[#0B2A4A]">{t("tool.waiting.compareLabel")}</p>
          <WaitingScenarioStrip waitMonths={waitMonths} scenarioData={scenarioData} onSelect={setWaitMonths} />
        </div>
        <WaitingChart chartData={chartData} chartMonths={chartMonths} chartKey={chartKey} />
        <WaitingReframe inputs={inputs} data={data} />
        <WaitingInsight waitMonths={waitMonths} inputs={inputs} data={data} />
        <WaitingCTA />
        <p className="text-center text-[10px] leading-relaxed text-[var(--tcw-text-muted)]">
          {t("tool.waiting.disclaimer")}
        </p>
      </section>
    </div>
  );
}
