import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { usePageMetadata } from "../hooks/usePageMetadata";
import { PAGE_METADATA } from "../lib/pageMetadata";
import {
  computeRefinanceRealMath,
  DEFAULT_REFINANCE_INPUTS,
  type RefinanceRealMathInputs,
  type RefinanceRealMathResult,
  type RefinanceVerdictKind,
} from "../lib/refinanceRealMathModel";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useAnimatedNumber } from "../hooks/useAnimatedNumber";
import {
  findCurrentLoanPayoffMonth,
  RefinanceEquityChartRecharts,
  RefinanceInterestChartRecharts,
} from "../components/refinance/RefinanceRealMathCharts";

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatCurrencyTight(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const MIC_HEADLINE = "This isn’t about saving money — it’s about when you pay it.";

function micDropSupportingLine(result: RefinanceRealMathResult, horizonYears: number): string {
  const m = Math.abs(result.monthlyDelta);
  const dInterest = result.interestTotalNewHorizon - result.interestTotalCurrentHorizon;
  if (result.monthlyDelta > 1e-2 && dInterest > 1e-2) {
    return `You reduce your payment by ${formatCurrency(m)}/month, but add ${formatCurrency(dInterest)} in total cost over the next ${horizonYears} years (modeled).`;
  }
  if (result.monthlyDelta > 1e-2 && dInterest < -1e-2) {
    return `You reduce your payment by ${formatCurrency(m)}/month and pay ${formatCurrency(-dInterest)} less in interest over the next ${horizonYears} years (modeled).`;
  }
  if (result.monthlyDelta <= 1e-2 && result.monthlyDelta >= -1e-2) {
    return `On these numbers, the monthly move is small — closing costs and how long you stay drive the outcome.`;
  }
  if (result.monthlyDelta < -1e-2) {
    return `Your payment rises on these terms — weigh that against rate and timeline before you commit.`;
  }
  return `Over the next ${horizonYears} years (modeled), compare interest and timeline — not just the rate.`;
}

function verdictPanelClasses(kind: RefinanceVerdictKind): string {
  switch (kind) {
    case "likely_worth_it":
      return "border border-slate-200/80 border-l-4 border-l-emerald-600 bg-emerald-50/70";
    case "depends_on_timeline":
      return "border border-slate-200/80 border-l-4 border-l-amber-500 bg-amber-50/70";
    case "modest_change":
      return "border border-slate-200/80 border-l-4 border-l-slate-400 bg-slate-50/90";
    case "payment_not_lower":
      return "border border-slate-200/80 border-l-4 border-l-rose-500 bg-rose-50/60";
    case "payment_down_cost_up":
      return "border border-slate-200/80 border-l-4 border-l-orange-500 bg-orange-50/65";
    case "invalid":
    default:
      return "border border-slate-200/80 border-l-4 border-l-slate-400 bg-slate-50/90";
  }
}

const DIRTY_HINT_COLOR = "#888780";

export default function RefinanceRealMath() {
  usePageMetadata(PAGE_METADATA.refinanceRealMath);
  const [draftInputs, setDraftInputs] = useState<RefinanceRealMathInputs>(DEFAULT_REFINANCE_INPUTS);
  const [committedInputs, setCommittedInputs] = useState<RefinanceRealMathInputs>(DEFAULT_REFINANCE_INPUTS);
  const [loading, setLoading] = useState(false);
  const [transitionGeneration, setTransitionGeneration] = useState(0);
  const [verdictPulse, setVerdictPulse] = useState(false);
  const calcTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const isDirty = useMemo(
    () => JSON.stringify(draftInputs) !== JSON.stringify(committedInputs),
    [draftInputs, committedInputs]
  );

  const result = useMemo(() => computeRefinanceRealMath(committedInputs), [committedInputs]);

  const chartKey = useMemo(
    () =>
      `${committedInputs.currentBalance}-${committedInputs.currentRatePct}-${committedInputs.remainingYears}-${committedInputs.newRatePct}-${committedInputs.newTermYears}-${committedInputs.closingCosts}-${committedInputs.compareHorizonYears}`,
    [committedInputs]
  );

  const update = <K extends keyof RefinanceRealMathInputs>(key: K, value: RefinanceRealMathInputs[K]) => {
    setDraftInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleCalculate = useCallback(() => {
    if (loading || !isDirty) return;
    const snapshot: RefinanceRealMathInputs = { ...draftInputs };
    setLoading(true);
    if (calcTimeoutRef.current) clearTimeout(calcTimeoutRef.current);
    const delay = 400 + Math.random() * 300;
    calcTimeoutRef.current = setTimeout(() => {
      setCommittedInputs(snapshot);
      setLoading(false);
      setTransitionGeneration((g) => g + 1);
      setVerdictPulse(true);
      if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
      pulseTimeoutRef.current = setTimeout(() => setVerdictPulse(false), 1400);
      calcTimeoutRef.current = null;
    }, delay);
  }, [loading, isDirty, draftInputs]);

  useEffect(() => {
    return () => {
      if (calcTimeoutRef.current) clearTimeout(calcTimeoutRef.current);
      if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
    };
  }, []);

  const resultsMuted = isDirty;
  const kpiAnimate = transitionGeneration > 0 && !resultsMuted && !reducedMotion;

  const monthlyTarget = result ? Math.abs(result.monthlyDelta) : 0;
  const newPayTarget = result?.newMonthlyPayment ?? 0;
  const curPayTarget = result?.currentMonthlyPayment ?? 0;
  const beTarget =
    result?.breakEvenMonths != null && Number.isFinite(result.breakEvenMonths) ? result.breakEvenMonths : 0;
  const intDiffTarget = result ? Math.abs(result.interestTotalCurrentHorizon - result.interestTotalNewHorizon) : 0;

  const animMonthly = useAnimatedNumber(monthlyTarget, 850, transitionGeneration, kpiAnimate && !!result);
  const animNewPay = useAnimatedNumber(newPayTarget, 850, transitionGeneration, kpiAnimate && !!result);
  const animCurPay = useAnimatedNumber(curPayTarget, 850, transitionGeneration, kpiAnimate && !!result);
  const animBe = useAnimatedNumber(beTarget, 850, transitionGeneration, kpiAnimate && !!result);
  const animIntDiff = useAnimatedNumber(intDiffTarget, 900, transitionGeneration, kpiAnimate && !!result);

  const interestDeltaSigned = result
    ? result.interestTotalNewHorizon - result.interestTotalCurrentHorizon
    : 0;
  const yearsAdded = result
    ? Math.max(0, Math.round((committedInputs.newTermYears - committedInputs.remainingYears) * 10) / 10)
    : 0;
  const payoffCurrent = result ? findCurrentLoanPayoffMonth(result.seriesCurrent) : null;

  return (
    <div
      className="
        min-h-screen border-b border-slate-200/80 bg-[#F7F7F5] font-sans
        pt-[calc(var(--site-header-height)+0.375rem)]
      "
    >
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:pb-24">
        <header className="mb-10 lg:mb-12 max-w-3xl pt-2 sm:pt-3 lg:pt-4 text-center lg:text-left">
          <div className="mb-4 inline-flex items-center gap-2 rounded-[4px] border border-gold/20 bg-white px-3 py-1.5 text-navy/70">
            <RefreshCw size={14} className="text-gold" strokeWidth={1.75} aria-hidden />
            <span className="type-label">Smart tool</span>
          </div>
          <h1 className="type-editorial-section-title text-[2rem] sm:text-4xl lg:text-[2.75rem] mb-5 leading-[1.08]">
            Refinance Real Math
          </h1>
          <p className="type-body-lg mx-auto max-w-2xl text-slate-600 lg:mx-0">
            Model payment, break-even, and interest cost side by side — so you can see what actually changes before you commit.
          </p>
        </header>

        {/* Hook — above inputs */}
        <div className="mx-auto mb-7 max-w-3xl rounded-xl bg-white p-6 shadow-sm">
          <p className="font-heading text-[16px] font-semibold leading-snug text-navy">
            Most people refinance for a lower payment — and never see the full cost.
          </p>
          <p className="mt-3 font-sans text-[12px] leading-relaxed text-slate-500 sm:text-[13px]">
            This tool shows you what actually changes over time — including the part most calculators leave out.
          </p>
          <p className="mt-4 font-sans text-[12px] leading-relaxed text-slate-600 sm:text-[13px]">
            Also see:{" "}
            <Link to="/tools/principal-accelerator" className="font-semibold text-navy underline decoration-gold/40 hover:text-gold">
              The Principal Accelerator
            </Link>{" "}
            — what extra payments do to your current loan.
          </p>
        </div>

        {/* Inputs */}
        <div id="rrm-inputs" className="scroll-mt-28">
          <section
            className="relative mx-auto mb-7 w-full max-w-3xl overflow-hidden rounded-xl bg-white p-6 shadow-sm"
            aria-label="Loan inputs"
          >
            {loading && (
              <div
                className="pointer-events-none absolute inset-0 z-10 rounded-xl bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse"
                aria-hidden
              />
            )}
            <div className="mb-6">
              <h2 className="font-heading text-lg font-semibold text-navy sm:text-xl">Your scenario</h2>
              <p className="mt-2 font-sans text-[13px] leading-relaxed text-slate-500 sm:text-[14px]">
                Adjust the numbers to reflect your current loan and potential refinance
              </p>
            </div>
            <div
              className={`grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-6 ${loading ? "pointer-events-none opacity-60" : ""}`}
            >
              <label className="block">
                <span className="type-label mb-2 block text-navy">Current balance</span>
                <input
                  type="number"
                  min={1000}
                  step={1000}
                  className="type-input tabular-nums"
                  disabled={loading}
                  value={draftInputs.currentBalance}
                  onChange={(e) => update("currentBalance", Number(e.target.value))}
                />
              </label>
              <label className="block">
                <span className="type-label mb-2 block text-navy">Current rate (%)</span>
                <input
                  type="number"
                  min={0.125}
                  max={20}
                  step={0.125}
                  className="type-input tabular-nums"
                  disabled={loading}
                  value={draftInputs.currentRatePct}
                  onChange={(e) => update("currentRatePct", Number(e.target.value))}
                />
              </label>
              <label className="block">
                <span className="type-label mb-2 block text-navy">Years left on loan</span>
                <input
                  type="number"
                  min={1}
                  max={40}
                  step={0.5}
                  className="type-input tabular-nums"
                  disabled={loading}
                  value={draftInputs.remainingYears}
                  onChange={(e) => update("remainingYears", Number(e.target.value))}
                />
              </label>
              <label className="block">
                <span className="type-label mb-2 block text-navy">New rate (%)</span>
                <input
                  type="number"
                  min={0.125}
                  max={20}
                  step={0.125}
                  className="type-input tabular-nums"
                  disabled={loading}
                  value={draftInputs.newRatePct}
                  onChange={(e) => update("newRatePct", Number(e.target.value))}
                />
              </label>
              <label className="block">
                <span className="type-label mb-2 block text-navy">New loan term (years)</span>
                <input
                  type="number"
                  min={5}
                  max={40}
                  step={1}
                  className="type-input tabular-nums"
                  disabled={loading}
                  value={draftInputs.newTermYears}
                  onChange={(e) => update("newTermYears", Number(e.target.value))}
                />
              </label>
              <label className="block">
                <span className="type-label mb-2 block text-navy">Closing costs ($)</span>
                <input
                  type="number"
                  min={0}
                  step={100}
                  className="type-input tabular-nums"
                  disabled={loading}
                  value={draftInputs.closingCosts}
                  onChange={(e) => update("closingCosts", Number(e.target.value))}
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="type-label mb-2 block text-navy">Compare interest over (years)</span>
                <input
                  type="number"
                  min={1}
                  max={30}
                  step={1}
                  className="type-input max-w-md tabular-nums"
                  disabled={loading}
                  value={draftInputs.compareHorizonYears}
                  onChange={(e) => update("compareHorizonYears", Number(e.target.value))}
                />
              </label>
            </div>
            <p className="mt-6 font-sans text-[12px] leading-relaxed text-slate-500 sm:text-[13px]">
              You’re not just comparing rates — you’re comparing timelines, costs, and long-term impact.
            </p>
            <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-8 sm:flex-row sm:items-center sm:gap-6">
              <button
                type="button"
                onClick={handleCalculate}
                disabled={loading || !isDirty}
                className={`calculate-btn relative inline-flex min-h-[44px] items-center justify-center gap-2 overflow-hidden rounded-md bg-[#0B2A4A] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-[background-color,transform,opacity,box-shadow] duration-200 hover:bg-[#0d3761] hover:shadow-md disabled:pointer-events-none disabled:opacity-45 motion-reduce:transition-none ${
                  isDirty && !loading ? "ring-2 ring-gold/45 ring-offset-2 ring-offset-white" : ""
                }`}
              >
                {loading && (
                  <span
                    className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent"
                    aria-hidden
                  />
                )}
                {loading ? (
                  <>
                    <span className="relative z-[1]">Calculating...</span>
                    <Loader2 className="relative z-[1] h-4 w-4 shrink-0 animate-spin" aria-hidden />
                  </>
                ) : (
                  <span className="relative z-[1]">Calculate your scenario</span>
                )}
              </button>
              {isDirty ? (
                <p className="font-sans text-[12px] leading-snug sm:text-[13px]" style={{ color: DIRTY_HINT_COLOR }}>
                  Values updated — recalculate to see results
                </p>
              ) : (
                <p className="font-sans text-[12px] text-slate-500 sm:text-[13px]">
                  Results reflect your last calculation.
                </p>
              )}
            </div>
            <p className="mt-4 font-sans text-[12px] leading-relaxed text-slate-500 sm:text-[13px]">
              We’ll map your full loan timeline — not just your payment.
            </p>
            <p className="type-body-xs mt-6 border-t border-slate-100 pt-6 text-slate-500">
              Illustrative only — not a quote. Taxes, insurance, MI, and lender fees beyond this estimate aren’t modeled here.
            </p>
          </section>
        </div>

        {!result && (
          <div className="mx-auto mb-7 max-w-3xl rounded-xl border border-amber-200/90 bg-white p-6 shadow-sm">
            <p className="type-body-sm text-amber-950">
              Adjust your inputs — we couldn’t run the comparison with those numbers.
            </p>
          </div>
        )}

        {result && (
          <div
            className={`transition-opacity duration-300 ease-out ${resultsMuted ? "opacity-60" : "opacity-100"}`}
            aria-live="polite"
          >
            <motion.div
              key={transitionGeneration}
              initial={
                reducedMotion || transitionGeneration === 0 ? false : { opacity: 0, y: 10 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
              }
            >
            {/* VERDICT — hero (Tier 1) */}
            <div className="mb-8 w-full max-w-3xl mx-auto">
              <div
                className={`rounded-xl bg-gradient-to-br from-white via-white to-slate-50/90 p-6 shadow-[0_24px_60px_-18px_rgba(10,25,47,0.18)] ring-1 ring-slate-200/70 transition-[box-shadow,ring] duration-700 sm:p-8 ${
                  verdictPulse ? "ring-2 ring-gold/45 shadow-[0_28px_64px_-12px_rgba(197,160,89,0.25)]" : ""
                }`}
              >
                <motion.div
                  key={transitionGeneration}
                  initial={
                    reducedMotion || transitionGeneration === 0 ? false : { scale: 1.02, opacity: 0.96 }
                  }
                  animate={{ scale: 1, opacity: 1 }}
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
                  }
                >
                  <div className="text-center lg:text-left">
                    <h2 className="font-heading text-2xl font-semibold leading-[1.15] tracking-[-0.02em] text-navy sm:text-3xl">
                      {MIC_HEADLINE}
                    </h2>
                    <p className="mt-4 font-sans text-[15px] leading-relaxed text-slate-700 sm:text-[16px]">
                      {micDropSupportingLine(result, committedInputs.compareHorizonYears)}
                    </p>
                    <p className="mt-5 font-sans text-3xl font-semibold tabular-nums tracking-tight text-navy sm:text-4xl">
                      {interestDeltaSigned >= 0 ? "+" : "−"}
                      {formatCurrencyTight(Math.abs(interestDeltaSigned))}
                      <span className="ml-2 block text-sm font-medium tracking-normal text-slate-500 sm:inline sm:text-base">
                        total interest difference over {committedInputs.compareHorizonYears} yr (modeled)
                      </span>
                    </p>
                  </div>
                  <div
                    className={`mt-8 rounded-lg p-6 sm:p-8 ${verdictPanelClasses(result.verdictKind)}`}
                    role="region"
                    aria-label="Your refinance reality"
                  >
                    <p className="text-center font-sans text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 lg:text-left">
                      Your refinance reality
                    </p>
                    <h3 className="mt-3 text-center font-heading text-lg font-semibold leading-snug text-navy sm:text-xl lg:text-left">
                      {result.verdictTitle}
                    </h3>
                    <div className="mt-4 space-y-3 text-center font-sans text-[15px] leading-relaxed text-slate-700 lg:text-left lg:max-w-3xl">
                      {splitParagraphs(result.verdictBody).map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Metrics (Tier 2) */}
            <div className="mb-8 w-full max-w-3xl mx-auto rounded-xl bg-white p-6 shadow-sm">
              <p className="mb-5 max-w-3xl font-sans text-[13px] leading-relaxed text-slate-600 sm:text-[14px]">
                Here’s what actually changes when you refinance:
              </p>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
                <div className="rounded-lg bg-[#F7F7F5] p-4">
                  <p className="type-body-xs uppercase tracking-[0.14em] text-slate-500">Monthly change</p>
                  <p className="mt-2 font-sans text-2xl font-semibold tabular-nums text-navy">
                    {result.monthlyDelta >= 0 ? "−" : "+"}
                    {formatCurrencyTight(animMonthly)}
                  </p>
                  <p className="type-body-xs mt-2 text-slate-500">per month</p>
                </div>
                <div className="rounded-lg bg-[#F7F7F5] p-4">
                  <p className="type-body-xs uppercase tracking-[0.14em] text-slate-500">New vs current</p>
                  <p className="mt-2 font-sans text-2xl font-semibold tabular-nums text-navy">
                    {formatCurrencyTight(animNewPay)}
                  </p>
                  <p className="type-body-xs mt-2 text-slate-500">vs {formatCurrencyTight(animCurPay)}</p>
                </div>
                <div className="rounded-lg bg-[#F7F7F5] p-4">
                  <p className="type-body-xs uppercase tracking-[0.14em] text-slate-500">Break-even</p>
                  <p className="mt-2 font-sans text-2xl font-semibold tabular-nums text-navy">
                    {result.breakEvenMonths != null && Number.isFinite(result.breakEvenMonths)
                      ? `${Math.ceil(animBe)} mo`
                      : "—"}
                  </p>
                  <p className="type-body-xs mt-2 text-slate-500">break-even timeline</p>
                </div>
                <div className="rounded-lg bg-[#F7F7F5] p-4">
                  <p className="type-body-xs uppercase tracking-[0.14em] text-slate-500">Interest ({committedInputs.compareHorizonYears} yr)</p>
                  <p className="mt-2 font-sans text-2xl font-semibold tabular-nums text-navy">
                    {formatCurrencyTight(animIntDiff)}
                  </p>
                  <p className="type-body-xs mt-2 text-slate-500">
                    {result.interestTotalCurrentHorizon >= result.interestTotalNewHorizon
                      ? "less interest vs current path"
                      : "more interest vs current path"}
                  </p>
                </div>
              </div>
            </div>

            {/* Comparison cards */}
            <div className="mb-8 w-full max-w-3xl mx-auto rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-6 max-w-3xl">
                <h2 className="font-heading text-lg font-semibold text-navy sm:text-xl">Side-by-side impact</h2>
                <p className="mt-2 font-sans text-[13px] leading-relaxed text-slate-500 sm:text-[14px]">
                  Not just what you pay monthly — but what you pay over time
                </p>
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                <div className="rounded-lg border border-slate-200/90 bg-[#F7F7F5]/80 p-6">
                  <h3 className="type-label text-navy/50">Keep current loan</h3>
                  <p className="mt-4 font-sans text-2xl font-semibold tabular-nums text-navy">
                    {formatCurrency(result.currentMonthlyPayment)}
                    <span className="block text-[11px] font-normal uppercase tracking-[0.12em] text-slate-500">/ month</span>
                  </p>
                  <p className="mt-6 type-body-sm text-slate-600">
                    Interest over ~{committedInputs.compareHorizonYears} years (modeled):{" "}
                    <span className="font-semibold text-navy">{formatCurrency(result.interestTotalCurrentHorizon)}</span>
                  </p>
                  <p className="mt-3 type-body-xs text-slate-500">Payments continue on your existing amortization schedule.</p>
                </div>
                <div
                  className={`rounded-lg bg-white p-6 transition-transform duration-200 motion-reduce:transition-none motion-reduce:hover:scale-100 ${
                    result.verdictKind === "likely_worth_it"
                      ? "border-2 border-emerald-600 shadow-sm hover:scale-[1.01]"
                      : "border border-slate-200/90 ring-1 ring-gold/25"
                  }`}
                >
                  <h3 className="type-label text-gold/90">Refinance to new terms</h3>
                  <p className="mt-4 font-sans text-2xl font-semibold tabular-nums text-navy">
                    {formatCurrency(result.newMonthlyPayment)}
                    <span className="block text-[11px] font-normal uppercase tracking-[0.12em] text-slate-500">/ month</span>
                  </p>
                  <p className="mt-6 type-body-sm text-slate-600">
                    Interest over ~{committedInputs.compareHorizonYears} years (modeled):{" "}
                    <span className="font-semibold text-navy">{formatCurrency(result.interestTotalNewHorizon)}</span>
                  </p>
                  <p className="mt-3 type-body-xs text-slate-500">
                    Closing costs {formatCurrency(committedInputs.closingCosts)} assumed paid in cash at closing (not financed).
                  </p>
                </div>
              </div>
            </div>

            {/* Charts (Tier 3) */}
            <div className="mb-8 w-full max-w-3xl mx-auto rounded-xl border border-slate-200/80 bg-white p-6 shadow-md">
              <div className="mb-6 max-w-3xl">
                <h2 className="font-heading text-lg font-semibold text-navy sm:text-xl">How this decision plays out over time</h2>
                <p className="mt-2 font-sans text-[13px] leading-relaxed text-slate-600 sm:text-[14px]">
                  These charts show how your decision plays out over time — not just today.
                </p>
              </div>
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="font-heading text-base font-semibold text-navy sm:text-lg">Total interest over time</h3>
                  <p className="mt-1 font-sans text-[13px] leading-relaxed text-slate-500">
                    Shaded gap = cost difference between paths. Break-even = when monthly savings offset closing costs.
                  </p>
                  <p className="chart-context">
                    Each point reflects your full loan position at that moment in time.
                  </p>
                  <div className="chart-interaction-bar">
                    <span className="interaction-icon" aria-hidden>
                      ↔
                    </span>
                    <span className="interaction-text">
                      Move across the{" "}
                      <span className="font-semibold text-navy/85">chart</span> to see how the{" "}
                      <span className="font-semibold text-navy/85">numbers</span> change over time.
                    </span>
                  </div>
                  <div className="mt-4 rounded-xl bg-slate-100/90 p-4 shadow-inner">
                    <div className="mb-3 flex flex-wrap items-center gap-6 text-[12px] text-slate-600">
                      <span className="inline-flex items-center gap-2">
                        <span className="h-0.5 w-6 bg-navy" aria-hidden />
                        Current loan
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <span className="h-0.5 w-6 bg-gold" aria-hidden />
                        New loan
                      </span>
                    </div>
                    <RefinanceInterestChartRecharts
                      seriesCurrent={result.seriesCurrent}
                      seriesNew={result.seriesNew}
                      breakEvenMonths={result.breakEvenMonths}
                      chartKey={chartKey}
                      reducedMotion={reducedMotion}
                      currentPayoffMonth={payoffCurrent}
                    />
                  </div>
                </div>
                <div className="border-t border-slate-200/90 pt-6">
                  <h3 className="font-heading text-base font-semibold text-navy sm:text-lg">Equity over time</h3>
                  <p className="mt-1 font-sans text-[13px] leading-relaxed text-slate-500">
                    How equity builds — early years are interest-heavy; principal accelerates later.
                  </p>
                  <p className="chart-context">
                    Each point reflects your full loan position at that moment in time.
                  </p>
                  <div className="chart-interaction-bar">
                    <span className="interaction-icon" aria-hidden>
                      ↔
                    </span>
                    <span className="interaction-text">
                      Move across the{" "}
                      <span className="font-semibold text-navy/85">chart</span> to see how the{" "}
                      <span className="font-semibold text-navy/85">numbers</span> change over time.
                    </span>
                  </div>
                  <div className="mt-4 rounded-xl bg-slate-100/90 p-4 shadow-inner">
                    <div className="mb-3 flex flex-wrap items-center gap-6 text-[12px] text-slate-600">
                      <span className="inline-flex items-center gap-2">
                        <span className="h-0.5 w-6 bg-navy" aria-hidden />
                        Current loan
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <span className="h-0.5 w-6 bg-gold" aria-hidden />
                        New loan
                      </span>
                    </div>
                    <RefinanceEquityChartRecharts
                      seriesCurrent={result.seriesCurrent}
                      seriesNew={result.seriesNew}
                      chartKey={`eq-${chartKey}`}
                      reducedMotion={reducedMotion}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* What this actually means */}
            <div className="mx-auto mb-8 max-w-3xl rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-semibold text-navy sm:text-xl">What this actually means</h2>
              <p className="mt-3 font-sans text-[15px] leading-relaxed text-slate-700">
                You’re improving monthly flexibility — but extending your financial timeline.
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5 font-sans text-[14px] leading-relaxed text-slate-700">
                <li>You reset your amortization curve (more interest early again)</li>
                {yearsAdded > 0 && (
                  <li>You add {yearsAdded} years of payments vs. your remaining term on paper</li>
                )}
                <li>
                  You {interestDeltaSigned > 0 ? "increase" : interestDeltaSigned < 0 ? "decrease" : "change"} total
                  borrowing cost by {formatCurrency(Math.abs(interestDeltaSigned))} over the next{" "}
                  {committedInputs.compareHorizonYears} years (interest modeled)
                </li>
              </ul>
              <p className="mt-5 font-sans text-[14px] font-medium text-navy">This can make sense if:</p>
              <ul className="mt-2 list-none space-y-1.5 font-sans text-[14px] leading-relaxed text-slate-600">
                <li className="before:mr-2 before:text-gold before:content-['→']">You need monthly breathing room</li>
                <li className="before:mr-2 before:text-gold before:content-['→']">
                  You plan to sell or refinance within {Math.min(10, committedInputs.compareHorizonYears)}–10 years
                </li>
              </ul>
              <p className="mt-5 font-sans text-[14px] font-medium text-navy">Less ideal if:</p>
              <ul className="mt-2 list-none space-y-1.5 font-sans text-[14px] leading-relaxed text-slate-600">
                <li className="before:mr-2 before:text-gold before:content-['→']">Your goal is minimizing total cost</li>
                <li className="before:mr-2 before:text-gold before:content-['→']">
                  You’re already well into your current loan
                </li>
              </ul>
            </div>

            {/* Insight */}
            <div className="mx-auto mb-8 max-w-3xl rounded-xl border border-slate-200/70 border-l-4 border-l-[#C6A15B] bg-[#FAF6EF] p-5 shadow-sm sm:p-6">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-navy/50">Key insight most people miss</p>
              <div className="mt-3 space-y-3 font-sans text-[15px] italic leading-relaxed text-slate-800">
                {splitParagraphs(result.keyInsight).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            <div className="mx-auto mb-8 max-w-3xl rounded-xl border border-slate-200/80 bg-white p-5 text-center shadow-sm sm:p-6">
              <p className="font-sans text-[14px] leading-relaxed text-slate-700">
                Locking your refinance rate?{" "}
                <Link
                  to="/tools/rate-lock-engine"
                  className="font-semibold text-navy underline decoration-gold/40 hover:text-gold"
                >
                  Use the Rate Lock Decision Engine →
                </Link>
              </p>
            </div>

            {/* CTA */}
            <section
              className="bvw-cta mx-auto max-w-3xl rounded-xl border border-slate-200/80 bg-[#F9F9F7] p-8 shadow-sm lg:p-10"
              aria-labelledby="rrm-cta-heading"
            >
              <h2 id="rrm-cta-heading" className="type-section-heading-sm mx-auto mb-3 max-w-xl text-center">
                Want to see how this plays out for your exact situation?
              </h2>
              <p className="type-body-sm mx-auto max-w-md text-center leading-relaxed text-slate-600">
                No obligation — just clarity on whether this move actually works for you.
              </p>
              <Link
                to="/contact?topic=refinance-real-math"
                className="btn-primary mx-auto mt-7 inline-flex min-h-[52px] min-w-[280px] items-center justify-center gap-2 px-8 text-[15px] shadow-[0_6px_24px_rgba(10,25,47,0.2)] transition-shadow duration-200 hover:shadow-[0_10px_36px_rgba(10,25,47,0.28)] motion-reduce:transition-none"
              >
                Review my scenario with an advisor
                <ArrowRight size={18} aria-hidden />
              </Link>
            </section>
            </motion.div>
          </div>
        )}
      </section>
    </div>
  );
}
