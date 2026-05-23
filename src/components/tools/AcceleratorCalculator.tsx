import { useMemo, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { defaultAcceleratorState, runCalculation } from "../../hooks/useAcceleratorMath";
import type { AcceleratorFormState } from "./AcceleratorInputs";
import { AcceleratorInputs } from "./AcceleratorInputs";
import { AcceleratorSlider } from "./AcceleratorSlider";
import { AcceleratorWowStrip } from "./AcceleratorWowStrip";
import { AcceleratorCharts } from "./AcceleratorCharts";
import { AcceleratorCompare } from "./AcceleratorCompare";
import { AcceleratorMilestones } from "./AcceleratorMilestones";
import { AcceleratorInsight } from "./AcceleratorInsight";
import { AcceleratorCTA } from "./AcceleratorCTA";
import { SmartToolIntro } from "./SmartToolIntro";
import { useLanguage } from "../../i18n/LanguageContext";

export default function AcceleratorCalculator() {
  const { t } = useLanguage();
  const [inputs, setInputs] = useState<AcceleratorFormState>(() => defaultAcceleratorState());

  const results = runCalculation({
    principal: inputs.bal,
    rate: inputs.rate,
    termYrs: inputs.term,
    paidYrs: inputs.paid,
    extraAmt: inputs.extra,
    freq: inputs.freq,
  });

  const {
    base,
    accel,
    monthsSaved,
    yearsSaved,
    moSaved,
    intSaved,
    basePayoff,
    accelPayoff,
    effectiveReturn,
    termMonths,
    paidClamped,
  } = results;

  const chartKey = useMemo(() => JSON.stringify(inputs), [inputs]);

  return (
    <div
      className="principal-accelerator mx-auto max-w-5xl px-4 pb-16 pt-0 font-[Lato,system-ui,sans-serif] sm:px-6 lg:px-8"
      style={
        {
          "--color-text-tertiary": "#64748b",
        } as CSSProperties
      }
    >
      <SmartToolIntro title={t("tool.accelerator.title")}>
        <p>{t("tool.accelerator.intro1")}</p>
        <p>
          {t("tool.accelerator.intro2Lead")}{" "}
          <Link to="/tools/heloc-planner">{t("tool.accelerator.helocLink")}</Link> {t("tool.accelerator.intro2Trail")}
        </p>
      </SmartToolIntro>

      <section className="mt-10 space-y-8">
        <AcceleratorInputs inputs={inputs} onChange={setInputs} />
        <AcceleratorSlider inputs={inputs} onChange={setInputs} />

        <AcceleratorWowStrip
          yearsSaved={yearsSaved}
          moSaved={moSaved}
          intSaved={intSaved}
          accelPayoff={accelPayoff}
          paidYrs={paidClamped}
        />

        <AcceleratorCharts base={base} accel={accel} chartKey={chartKey} />

        <AcceleratorCompare
          base={base}
          accel={accel}
          principal={inputs.bal}
          extraAmt={inputs.extra}
          freq={inputs.freq}
          basePayoff={basePayoff}
          accelPayoff={accelPayoff}
        />

        <AcceleratorMilestones
          monthsSaved={monthsSaved}
          yearsSaved={yearsSaved}
          moSaved={moSaved}
          intSaved={intSaved}
          effectiveReturn={effectiveReturn}
          basePayoff={basePayoff}
          accelPayoff={accelPayoff}
          base={base}
          accel={accel}
          principal={inputs.bal}
          rate={inputs.rate}
          termMonths={termMonths}
          extraAmt={inputs.extra}
          freq={inputs.freq}
        />

        <AcceleratorInsight
          extraAmt={inputs.extra}
          monthsSaved={monthsSaved}
          intSaved={intSaved}
          yearsSaved={yearsSaved}
          basePayment={base.payment}
          freq={inputs.freq}
        />

        <AcceleratorCTA />

        <p className="text-center text-[11px] leading-relaxed text-[var(--color-text-tertiary)]">{t("tool.accelerator.disclaimer")}</p>
      </section>
    </div>
  );
}
