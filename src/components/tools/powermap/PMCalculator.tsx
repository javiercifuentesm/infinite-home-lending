import { useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { runCalculation, type PowerMapInputs } from "../../../hooks/usePowerMapMath";
import { useLanguage } from "../../../i18n/LanguageContext";
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
  const { t } = useLanguage();
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
      <SmartToolIntro title={t("tool.pm.title")}>
        <p>{t("tool.pm.intro")}</p>
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
            {t("tool.pm.wealthLink")}
          </Link>
        </p>

        <p className="text-center text-[10px] leading-relaxed text-slate-500">{t("tool.pm.disclaimer")}</p>
      </section>
    </div>
  );
}
