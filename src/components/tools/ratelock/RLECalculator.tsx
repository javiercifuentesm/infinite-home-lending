import { useState, type CSSProperties } from "react";
import { runCalculation, type RLEInputs } from "../../../hooks/useRLEMath";
import { useLanguage } from "../../../i18n/LanguageContext";
import { SmartToolIntro } from "../SmartToolIntro";
import { RLEFramingBanner } from "./RLEFramingBanner";
import { RLELoanInputs } from "./RLELoanInputs";
import { RLEScenarioInputs } from "./RLEScenarioInputs";
import { RLEExtensionInputs } from "./RLEExtensionInputs";
import { RLEDecisionHero } from "./RLEDecisionHero";
import { RLEAsymmetryVisual } from "./RLEAsymmetryVisual";
import { RLEVerdictBanner } from "./RLEVerdictBanner";
import { RLEMetrics } from "./RLEMetrics";
import { RLEScenarioGrid } from "./RLEScenarioGrid";
import { RLETimelineStrip } from "./RLETimelineStrip";
import { RLEExtensionAnalysis } from "./RLEExtensionAnalysis";
import { RLEFloatDownAnalysis } from "./RLEFloatDownAnalysis";
import { RLEInsight } from "./RLEInsight";
import { RLECTA } from "./RLECTA";

const defaultInputs: RLEInputs = {
  loan: 420000,
  rate: 6.875,
  term: 30,
  daysToClose: 35,
  riseScenario: 0.25,
  dropScenario: 0.25,
  rateEnv: "falling",
  extFee: 0.125,
  floatCost: 0.25,
  floatThresh: 0.25,
  riskTol: "medium",
};

export default function RLECalculator() {
  const { t } = useLanguage();
  const [inputs, setInputs] = useState<RLEInputs>(defaultInputs);
  const results = runCalculation(inputs);

  return (
    <div
      className="rate-lock-engine mx-auto max-w-5xl px-4 pb-16 pt-0 font-[Lato,system-ui,sans-serif] sm:px-6 lg:px-8"
      style={
        {
          "--rle-navy": "#0B2A4A",
          "--rle-gold": "#C6A15B",
          "--rle-risk": "#A32D2D",
          "--rle-upside": "#3B6D11",
        } as CSSProperties
      }
    >
      <SmartToolIntro title={t("tool.rle.title")}>
        <p>{t("tool.rle.intro")}</p>
      </SmartToolIntro>

      <section className="mt-10 space-y-8">
        <RLEFramingBanner />

        <RLELoanInputs inputs={inputs} onChange={setInputs} />
        <RLEScenarioInputs inputs={inputs} onChange={setInputs} />
        <RLEExtensionInputs inputs={inputs} onChange={setInputs} />

        {results.daysToClose <= 10 ? (
          <div
            className="rounded-lg border px-4 py-3 text-[13px] font-medium"
            style={{ background: "rgba(163,45,45,0.08)", borderColor: "rgba(163,45,45,0.25)", color: "#A32D2D" }}
            role="alert"
          >
            {t("tool.rle.urgentPre")} {results.daysToClose} {t("tool.rle.urgentPost")}
          </div>
        ) : null}

        <RLEDecisionHero results={results} />
        <RLEAsymmetryVisual results={results} />
        <RLEVerdictBanner results={results} />
        <RLEMetrics results={results} />
        <RLEScenarioGrid results={results} />
        <RLETimelineStrip results={results} />
        <RLEExtensionAnalysis results={results} />
        <RLEFloatDownAnalysis results={results} />
        <RLEInsight results={results} />
        <RLECTA results={results} />

        <p className="text-center text-[10px] leading-relaxed text-slate-500">{t("tool.rle.disclaimer")}</p>
      </section>
    </div>
  );
}
