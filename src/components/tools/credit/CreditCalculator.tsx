import { useMemo, useState, useCallback, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import {
  runCalculation,
  SCORE_TIERS,
  type CreditInputs,
} from "../../../hooks/useCreditMath";
import { CreditModeTabs } from "./CreditModeTabs";
import { CreditSituationInputs } from "./CreditSituationInputs";
import { CreditActionGrid } from "./CreditActionGrid";
import { CreditRevealHero } from "./CreditRevealHero";
import { CreditDollarPerPoint } from "./CreditDollarPerPoint";
import { CreditMetrics } from "./CreditMetrics";
import { CreditTierTrack } from "./CreditTierTrack";
import { CreditCostChart } from "./CreditCostChart";
import { CreditActionResults } from "./CreditActionResults";
import { CreditTimeline } from "./CreditTimeline";
import { CreditInsight } from "./CreditInsight";
import { CreditCTA } from "./CreditCTA";
import { SmartToolIntro } from "../SmartToolIntro";

const defaultInputs: CreditInputs = {
  hp: 420_000,
  dp: 10,
  curScore: 660,
  tgtScore: 720,
  term: 30,
  timeframe: 6,
};

function normalizeInputs(next: CreditInputs): CreditInputs {
  let n = { ...next };
  const curOpts = SCORE_TIERS.filter(
    (t) => t.value < n.tgtScore || (t.value === 760 && n.tgtScore === 760),
  );
  const tgtOpts = SCORE_TIERS.filter(
    (t) => (t.value > n.curScore && t.value >= 620) || (t.value === 760 && n.curScore === 760),
  );
  if (!curOpts.some((t) => t.value === n.curScore)) {
    n.curScore = curOpts[curOpts.length - 1]?.value ?? 580;
  }
  if (!tgtOpts.some((t) => t.value === n.tgtScore)) {
    n.tgtScore = tgtOpts[0]?.value ?? 760;
  }
  return n;
}

export default function CreditCalculator() {
  const [inputs, setInputs] = useState<CreditInputs>(defaultInputs);
  const [mode, setMode] = useState<"compare" | "actions">("compare");
  const [selectedActions, setSelectedActions] = useState(new Set<string>());

  const applyInputs = useCallback((next: CreditInputs) => {
    setInputs(normalizeInputs(next));
  }, []);

  const results = useMemo(() => runCalculation(inputs), [inputs]);
  const isTopTier = inputs.curScore >= 760;

  const chartKey = useMemo(
    () =>
      JSON.stringify({
        hp: inputs.hp,
        dp: inputs.dp,
        curScore: inputs.curScore,
        tgtScore: inputs.tgtScore,
        term: inputs.term,
        timeframe: inputs.timeframe,
      }),
    [inputs.hp, inputs.dp, inputs.curScore, inputs.tgtScore, inputs.term, inputs.timeframe],
  );

  const toggleAction = (id: string) => {
    setSelectedActions((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  return (
    <div
      className="credit-roi-tool mx-auto max-w-5xl px-4 pb-16 pt-0 font-[Lato,system-ui,sans-serif] sm:px-6 lg:px-8"
      style={
        {
          "--color-text-tertiary": "#64748b",
          "--color-border-tertiary": "#e2e8f0",
          "--color-background-secondary": "#f8fafc",
        } as CSSProperties
      }
    >
      <SmartToolIntro title="The Credit Score ROI Calculator">
        <p>
          Every credit score point you earn before applying for a mortgage has a real dollar value. This tool calculates exactly what improving
          your score is worth — and which specific actions deliver the highest return on your time and effort.
        </p>
      </SmartToolIntro>

      <section className="mt-10 space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CreditModeTabs mode={mode} onModeChange={setMode} />
        </div>

        {isTopTier ? (
          <p className="rounded-md border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-[13px] leading-relaxed text-amber-950">
            You&apos;re already in the top rate tier. The Action Planner can help you maintain it. Score comparison results are hidden — adjust
            your current score below to model a lower tier, or use the action planner.
          </p>
        ) : null}

        <CreditSituationInputs
          inputs={inputs}
          onChange={applyInputs}
          showInvalidTgtNote={results.hadInvalidScorePair && inputs.curScore < 760}
        />

        {mode === "actions" ? (
          <CreditActionGrid
            selected={selectedActions}
            onToggle={toggleAction}
          />
        ) : null}

        {!isTopTier ? (
          <>
            <CreditRevealHero results={results} />
            <CreditDollarPerPoint results={results} curScore={inputs.curScore} />
            <CreditMetrics results={results} />
            <CreditTierTrack curScore={inputs.curScore} effectiveTgt={results.effectiveTgt} />
            <CreditCostChart results={results} curScore={inputs.curScore} chartKey={chartKey} />
            <CreditTimeline results={results} />
          </>
        ) : null}

        {mode === "actions" && selectedActions.size > 0 ? (
          <CreditActionResults selectedIds={selectedActions} results={results} />
        ) : null}

        <CreditInsight results={results} curScore={inputs.curScore} isTopTier={isTopTier} />

        <p className="rounded-lg border border-slate-200/80 bg-slate-50/90 px-4 py-3 text-center text-[13px] leading-relaxed text-slate-700">
          See which MD-DC-VA markets your improved score unlocks over time:{" "}
          <Link
            to="/tools/homebuying-power-map"
            className="font-semibold text-[#0B2A4A] underline decoration-[#C6A15B]/40 hover:text-[#C6A15B]"
          >
            The Homebuying Power Map →
          </Link>
        </p>

        <CreditCTA results={results} />

        <p className="text-center text-[10px] leading-relaxed text-[var(--color-text-tertiary)]">
          Rate estimates are based on industry-standard FICO score tier pricing as of 2026 and are for educational purposes only. Actual rates depend
          on lender, loan type, market conditions, and full borrower profile. Credit score improvement timelines are estimates — individual results
          vary. This tool does not constitute a loan offer or credit advice. Contact Infinite Home Lending for a personalized rate analysis.
        </p>

        <p className="text-center text-[12px] text-slate-500">
          <Link to="/smart-tools" className="font-semibold text-[#0B2A4A] underline decoration-[#C6A15B]/40 hover:text-[#C6A15B]">
            ← Back to Smart Tools
          </Link>
        </p>
      </section>
    </div>
  );
}
