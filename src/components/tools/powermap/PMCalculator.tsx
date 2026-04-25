import { useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { runCalculation, type PowerMapInputs } from "../../../hooks/usePowerMapMath";
import { SmartToolIntro } from "../SmartToolIntro";
import { PMFinancialInputs } from "./PMFinancialInputs";
import { PMImprovementSliders } from "./PMImprovementSliders";
import { PMPowerHero } from "./PMPowerHero";
import { PMPowerBar } from "./PMPowerBar";
import { PMMarketMap } from "./PMMarketMap";
import { PMImpactGrid } from "./PMImpactGrid";
import { PMRoadmap } from "./PMRoadmap";
import { PMInsight } from "./PMInsight";
import { PMCTA } from "./PMCTA";

const defaultInputs: PowerMapInputs = {
  income: 95000,
  debts: 900,
  scoreBase: 660,
  savings: 28000,
  savingsRate: 800,
  creditImp: 0,
  debtPayoff: 0,
  savingsBoost: 0,
  incomeGrowth: 0,
};

export default function PMCalculator() {
  const [inputs, setInputs] = useState<PowerMapInputs>(defaultInputs);
  const results = runCalculation(inputs);

  return (
    <div
      className="homebuying-power-map mx-auto max-w-5xl px-4 pb-16 pt-0 font-[Lato,system-ui,sans-serif] sm:px-6 lg:px-8"
      style={
        {
          "--color-background-primary": "#ffffff",
          "--color-background-secondary": "rgb(248 250 252)",
          "--color-text-primary": "#0f172a",
          "--color-text-tertiary": "#64748b",
        } as CSSProperties
      }
    >
      <SmartToolIntro title="The Homebuying Power Map">
        <p>
          Most calculators tell you what you can afford today — and stop there. This one shows you where you&apos;ll be in 90
          days, 6 months, and 12 months as your financial picture improves, mapped against real MD-DC-VA market data so you can see
          exactly which neighborhoods become accessible as you build toward homeownership.
        </p>
      </SmartToolIntro>

      <section className="mt-10 space-y-8">
        <PMFinancialInputs inputs={inputs} onChange={setInputs} />
        <PMImprovementSliders inputs={inputs} onChange={setInputs} />

        <PMPowerHero results={results} />
        <PMPowerBar results={results} />
        <PMMarketMap results={results} />
        <PMImpactGrid inputs={inputs} results={results} />
        <PMRoadmap inputs={inputs} results={results} />
        <PMInsight results={results} />
        <PMCTA results={results} />

        <p className="text-center text-[13px] leading-relaxed text-slate-600">
          <Link
            to="/tools/wealth-tracker"
            className="font-semibold text-[#0B2A4A] underline decoration-[#C6A15B]/50 underline-offset-[3px] transition-colors hover:text-[#B48E48]"
          >
            See the 30-year wealth picture for this home →
          </Link>
        </p>

        <p className="text-center text-[10px] leading-relaxed text-slate-500">
          Buying power estimates use standard DTI methodology (43% maximum) and current market rate assumptions. MD-DC-VA market data
          reflects 2025 median sold prices from regional market reports. Market accessibility shown is based on median prices and
          may not reflect all available inventory at any price point. Down payment assistance programs vary by county, income,
          and household size — ask your advisor about eligibility. This tool is for educational purposes and does not constitute
          a loan offer.
        </p>
      </section>
    </div>
  );
}
