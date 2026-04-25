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

export default function AcceleratorCalculator() {
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
      <SmartToolIntro title="The Principal Accelerator">
        <p>
          Most people don&apos;t realize that small extra payments toward your principal can shave years off your mortgage and save
          tens of thousands in interest. This tool shows you exactly what your money can do — move the slider and watch your loan
          transform in real time.
        </p>
        <p>
          Weighing extra payments vs. borrowing against equity?{" "}
          <Link to="/tools/heloc-planner">
            HELOC Smart Planner
          </Link>{" "}
          — see the full draw-to-repayment cost picture.
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

        <p className="text-center text-[11px] leading-relaxed text-[var(--color-text-tertiary)]">
          Estimates are for educational purposes only. Actual savings depend on your loan terms, lender policies, and payment timing.
          Some loans have prepayment restrictions — confirm with your lender. Contact Infinite Home Lending for a personalized
          analysis.
        </p>
      </section>
    </div>
  );
}
