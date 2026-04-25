import { useMemo, useState, type CSSProperties } from "react";
import { runCalculation, type WealthInputs } from "../../../hooks/useWealthMath";
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
      <SmartToolIntro title="The Mortgage Wealth Tracker">
        <p>
          Every mortgage calculator shows you a monthly payment. This one shows you six parallel wealth streams — equity,
          appreciation, PMI elimination, rent inflation protection, tax benefit, and opportunity cost — and calculates your net
          worth advantage from owning vs. renting at years 5, 10, 20, and 30. Federal Reserve Survey of Consumer Finances and NAR
          analyses have reported large average net worth gaps between homeowners and renters nationally (often cited on the
          order of roughly $430,000 — varies by survey year and methodology). This tool shows how wealth can build from your
          specific inputs — not as a guarantee, but as a transparent model.
        </p>
        <p className="!text-[11px] !leading-relaxed !text-slate-500">
          Source context (not a link): homeowner vs. renter wealth comparisons are typically drawn from Federal Reserve Survey of
          Consumer Finances and National Association of Realtors research summaries; exact figures change over time.
        </p>
      </SmartToolIntro>

      <section className="mt-10 space-y-8">
        <div
          className="rounded-lg border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-[12px] leading-relaxed text-amber-950"
          role="note"
        >
          <strong>Honest framing:</strong> At high investment return assumptions, renting plus disciplined investing can
          outperform in this model. Opportunity cost of your down payment is shown in red because most calculators omit it. This
          is the complete picture so you can decide — not a claim that buying always wins.
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

        <p className="text-center text-[10px] leading-relaxed text-slate-500">
          All projections are hypothetical and for educational purposes only. Actual wealth outcomes depend on market conditions,
          personal savings behavior, tax situation, and many other factors. Home appreciation rates, rent increases, and
          investment returns are not guaranteed. Mortgage interest deductibility depends on individual tax situation — consult a
          tax advisor. The homeowner vs. renter wealth gap data cited in research is sourced from Federal Reserve Survey of
          Consumer Finances and NAR analyses. This tool does not constitute financial advice or a loan offer.
        </p>
      </section>
    </div>
  );
}
