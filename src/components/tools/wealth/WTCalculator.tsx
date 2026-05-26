import { useMemo, useState, type CSSProperties } from "react";
import { runCalculation, type WealthInputs } from "../../../hooks/useWealthMath";
import { useLanguage } from "../../../i18n/LanguageContext";
import { SmartToolIntro } from "../SmartToolIntro";
import { WTPurchaseInputs } from "./WTPurchaseInputs";
import { WTAssumptionInputs } from "./WTAssumptionInputs";
import { WTWealthHero } from "./WTWealthHero";
import { WTMilestoneStrip } from "./WTMilestoneStrip";
import { WTWealthChart } from "./WTWealthChart";
import { WTStreamGrid } from "./WTStreamGrid";
import { WTBreakevenBox } from "./WTBreakevenBox";
import { WTRenterPath } from "./WTRenterPath";
import { WTInsight } from "./WTInsight";
import { WTCTA } from "./WTCTA";

const defaultInputs: WealthInputs = {
  hp: 450000,
  dp: 10,
  rate: 6.875,
  rent: 2200,
  appr: 3.5,
  rentInc: 4.0,
  invReturn: 7.0,
  propTax: 1.1,
  maint: 1.0,
  taxRate: 24,
};

export default function WTCalculator() {
  const { t } = useLanguage();
  const [inputs, setInputs] = useState<WealthInputs>(defaultInputs);
  const results = useMemo(() => runCalculation(inputs), [inputs]);
  const chartKey = useMemo(() => JSON.stringify(inputs), [inputs]);

  return (
    <div
      className="wealth-tracker mx-auto max-w-5xl px-4 pb-16 pt-0 font-[Lato,system-ui,sans-serif] sm:px-6 lg:px-8"
      style={
        {
          "--color-text-tertiary": "#64748b",
        } as CSSProperties
      }
    >
      <SmartToolIntro title={t("wt.title")}>
        <p>{t("wt.intro.p1")}</p>
        <p className="!text-[11px] !leading-relaxed !text-slate-500">{t("wt.intro.source")}</p>
      </SmartToolIntro>

      <section className="mt-10 space-y-8">
        <div
          className="rounded-lg border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-[12px] leading-relaxed text-amber-950"
          role="note"
        >
          <strong>{t("wt.honestFraming.label")}</strong> {t("wt.honestFraming.text")}
        </div>

        <WTPurchaseInputs inputs={inputs} onChange={(next) => setInputs(next)} />
        <WTAssumptionInputs inputs={inputs} onChange={(next) => setInputs(next)} />

        <WTWealthHero results={results} />
        <WTMilestoneStrip results={results} />
        <WTWealthChart results={results} chartKey={chartKey} />
        <WTStreamGrid results={results} />
        <WTBreakevenBox results={results} />
        <WTRenterPath results={results} />
        <WTInsight results={results} />
        <WTCTA results={results} />

        <p className="text-center text-[10px] leading-relaxed text-slate-500">{t("wt.disclaimer")}</p>
      </section>
    </div>
  );
}
