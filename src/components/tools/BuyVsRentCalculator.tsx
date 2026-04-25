import { useMemo, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import {
  defaultBuyVsRentInputs,
  runCalculation,
  type BuyVsRentInputs,
} from "../../hooks/useBuyVsRentMath";
import type { BuyTab } from "./BuyVsRentInputTabs";
import { BuyVsRentInputTabs } from "./BuyVsRentInputTabs";
import { BuyVsRentTimelineSelector } from "./BuyVsRentTimelineSelector";
import { BuyVsRentVerdictBanner } from "./BuyVsRentVerdictBanner";
import { BuyVsRentWowStrip } from "./BuyVsRentWowStrip";
import { BuyVsRentCrossoverFlag } from "./BuyVsRentCrossoverFlag";
import { BuyVsRentCharts } from "./BuyVsRentCharts";
import { BuyVsRentCompare } from "./BuyVsRentCompare";
import { BuyVsRentFactors } from "./BuyVsRentFactors";
import { BuyVsRentInsight } from "./BuyVsRentInsight";
import { BuyVsRentCTA } from "./BuyVsRentCTA";
import { SmartToolIntro } from "./SmartToolIntro";

export default function BuyVsRentCalculator() {
  const [inputs, setInputs] = useState<BuyVsRentInputs>(defaultBuyVsRentInputs);
  const [activeTab, setActiveTab] = useState<BuyTab>("buying");
  const [viewYear, setViewYear] = useState(5);

  const { yearlyData, crossoverYr } = runCalculation(inputs);
  const snapshot = yearlyData[viewYear - 1] ?? yearlyData[yearlyData.length - 1];

  const chartInputKey = useMemo(() => JSON.stringify(inputs), [inputs]);

  return (
    <div
      className="buy-vs-rent-tool mx-auto max-w-5xl px-4 pb-16 pt-0 font-[Lato,system-ui,sans-serif] sm:px-6 lg:px-8"
      style={
        {
          "--color-text-tertiary": "#64748b",
        } as CSSProperties
      }
    >
      <SmartToolIntro title="Buy vs. Rent: The Full Picture">
        <p>
          Most calculators pick a winner and stop there. This one shows you exactly when the crossover happens, what drives
          it, and what both paths do to your wealth over time — so the answer makes sense for your life, not just the math.
        </p>
        <p>
          Already own?{" "}
          <Link to="/tools/heloc-planner">
            See the HELOC Planner
          </Link>{" "}
          — model tapping equity vs. other options.
        </p>
        <p>
          Want the full six-stream wealth model with opportunity cost?{" "}
          <Link to="/tools/wealth-tracker" className="font-semibold text-[#0B2A4A] underline decoration-[#C6A15B]/45 underline-offset-[3px]">
            Run the full 30-year wealth analysis →
          </Link>
        </p>
      </SmartToolIntro>

      <section className="mt-10 space-y-8">
        <BuyVsRentInputTabs activeTab={activeTab} onTabChange={setActiveTab} inputs={inputs} onChange={setInputs} />

        <div>
          <p className="mb-3 text-[13px] font-semibold text-[#0B2A4A]">Explore by year</p>
          <BuyVsRentTimelineSelector viewYear={viewYear} onChange={setViewYear} />
        </div>

        <BuyVsRentVerdictBanner snapshot={snapshot} viewYear={viewYear} crossoverYr={crossoverYr} />
        <BuyVsRentWowStrip snapshot={snapshot} crossoverYr={crossoverYr} />

        <div className="space-y-3">
          <BuyVsRentCrossoverFlag crossoverYr={crossoverYr} />
          <BuyVsRentCharts yearlyData={yearlyData} chartInputKey={chartInputKey} />
        </div>

        <BuyVsRentCompare snapshot={snapshot} inputs={inputs} viewYear={viewYear} />
        <BuyVsRentFactors inputs={inputs} snapshot={snapshot} crossoverYr={crossoverYr} />
        <BuyVsRentInsight crossoverYr={crossoverYr} />
        <BuyVsRentCTA />

        <p className="text-center text-[10px] leading-relaxed text-[var(--color-text-tertiary)]">
          For educational purposes only. Does not constitute financial or tax advice. Projections are estimates based on your
          inputs and assumed growth rates. Actual results will vary. Consult a financial advisor and tax professional for
          personalized guidance. Contact Infinite Home Lending for mortgage-specific analysis.
        </p>
      </section>
    </div>
  );
}
