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
  type RefinanceRealMathStrings,
  type RefinanceVerdictKind,
} from "../lib/refinanceRealMathModel";
import { useLanguage } from "../i18n/LanguageContext";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useAnimatedNumber } from "../hooks/useAnimatedNumber";
import {
  findCurrentLoanPayoffMonth,
  RefinanceEquityChartRecharts,
  RefinanceInterestChartRecharts,
  type RefinanceChartStrings,
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

function ChartInteractionHint({ t }: { t: (key: string) => string }) {
  return (
    <div className="chart-interaction-bar">
      <span className="interaction-icon" aria-hidden>
        ↔
      </span>
      <span className="interaction-text">
        {t("rrm.charts.moveAcross")}{" "}
        <span className="font-semibold text-navy/85">{t("rrm.charts.chart")}</span> {t("rrm.charts.toSeeHow")}{" "}
        <span className="font-semibold text-navy/85">{t("rrm.charts.numbers")}</span> {t("rrm.charts.changeOverTime")}
      </span>
    </div>
  );
}

export default function RefinanceRealMath() {
  usePageMetadata(PAGE_METADATA.refinanceRealMath);
  const { t, lang } = useLanguage();
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

  const rrmStrings: RefinanceRealMathStrings = useMemo(
    () => ({
      keyInsight: t("rrm.keyInsight"),
      verdict: {
        paymentNotLower: {
          title: t("rrm.verdict.paymentNotLower.title"),
          body: t("rrm.verdict.paymentNotLower.body"),
        },
        modestChange: {
          title: t("rrm.verdict.modestChange.title"),
          body: t("rrm.verdict.modestChange.body"),
        },
        paymentDownCostUp: {
          title: t("rrm.verdict.paymentDownCostUp.title"),
          body: t("rrm.verdict.paymentDownCostUp.body"),
        },
        likelyWorthIt: {
          title: t("rrm.verdict.likelyWorthIt.title"),
          bodyWithYears: t("rrm.verdict.likelyWorthIt.bodyWithYears"),
          bodyQuick: t("rrm.verdict.likelyWorthIt.bodyQuick"),
        },
        dependsTimeline: {
          title: t("rrm.verdict.dependsTimeline.title"),
          body: t("rrm.verdict.dependsTimeline.body"),
        },
        closerLook: {
          title: t("rrm.verdict.closerLook.title"),
          body: t("rrm.verdict.closerLook.body"),
          lower: t("rrm.verdict.closerLook.lower"),
          higher: t("rrm.verdict.closerLook.higher"),
        },
      },
    }),
    [lang, t]
  );

  const chartStrings: RefinanceChartStrings = useMemo(
    () => ({
      breakEvenLabel: (month: number) => t("rrm.charts.breakEvenLabel").replace("{month}", String(month)),
      lessInterestLabel: (amount: string) => t("rrm.charts.lessInterestLabel").replace("{amount}", amount),
      moreInterestLabel: (amount: string) => t("rrm.charts.moreInterestLabel").replace("{amount}", amount),
      loanPaidOff: t("rrm.charts.loanPaidOff"),
      principalAccelerating: t("rrm.charts.principalAccelerating"),
      tooltipYear: (year: number, month: number) =>
        t("rrm.charts.tooltipYear").replace("{year}", String(year)).replace("{month}", String(month)),
      totalInterestCurrent: t("rrm.charts.totalInterestCurrent"),
      totalInterestNew: t("rrm.charts.totalInterestNew"),
      remainingCurrent: t("rrm.charts.remainingCurrent"),
      remainingNew: t("rrm.charts.remainingNew"),
      equityBuiltCurrent: t("rrm.charts.equityBuiltCurrent"),
      equityBuiltNew: t("rrm.charts.equityBuiltNew"),
      equityPctCurrent: t("rrm.charts.equityPctCurrent"),
      equityPctNew: t("rrm.charts.equityPctNew"),
      equityCurrent: t("rrm.charts.equityCurrent"),
      equityNew: t("rrm.charts.equityNew"),
      balanceCurrent: t("rrm.charts.balanceCurrent"),
      balanceNew: t("rrm.charts.balanceNew"),
      pctPaidCurrent: t("rrm.charts.pctPaidCurrent"),
    }),
    [lang, t]
  );

  const result = useMemo(
    () => computeRefinanceRealMath(committedInputs, rrmStrings),
    [committedInputs, rrmStrings]
  );

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
            <span className="type-label">{t("rrm.badge")}</span>
          </div>
          <h1 className="type-editorial-section-title text-[2rem] sm:text-4xl lg:text-[2.75rem] mb-5 leading-[1.08]">
            {t("rrm.title")}
          </h1>
          <p className="type-body-lg mx-auto max-w-2xl text-slate-600 lg:mx-0">
            {t("rrm.subtitle")}
          </p>
        </header>

        {/* Hook — above inputs */}
        <div className="mx-auto mb-7 max-w-3xl rounded-xl bg-white p-6 shadow-sm">
          <p className="font-heading text-[16px] font-semibold leading-snug text-navy">
            {t("rrm.hook.heading")}
          </p>
          <p className="mt-3 font-sans text-[12px] leading-relaxed text-slate-500 sm:text-[13px]">
            {t("rrm.hook.body")}
          </p>
          <p className="mt-4 font-sans text-[12px] leading-relaxed text-slate-600 sm:text-[13px]">
            {t("rrm.hook.alsoSee")}{" "}
            <Link to="/tools/principal-accelerator" className="font-semibold text-navy underline decoration-gold/40 hover:text-gold">
              {t("rrm.hook.acceleratorLink")}
            </Link>{" "}
            {t("rrm.hook.acceleratorDesc")}
          </p>
        </div>

        {/* Inputs */}
        <div id="rrm-inputs" className="scroll-mt-28">
          <section
            className="relative mx-auto mb-7 w-full max-w-3xl overflow-hidden rounded-xl bg-white p-6 shadow-sm"
            aria-label={t("rrm.inputs.title")}
          >
            {loading && (
              <div
                className="pointer-events-none absolute inset-0 z-10 rounded-xl bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse"
                aria-hidden
              />
            )}
            <div className="mb-6">
              <h2 className="font-heading text-lg font-semibold text-navy sm:text-xl">{t("rrm.inputs.title")}</h2>
              <p className="mt-2 font-sans text-[13px] leading-relaxed text-slate-500 sm:text-[14px]">
                {t("rrm.inputs.subtitle")}
              </p>
            </div>
            <div
              className={`grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-6 ${loading ? "pointer-events-none opacity-60" : ""}`}
            >
              <label className="block">
                <span className="type-label mb-2 block text-navy">{t("rrm.inputs.currentBalance")}</span>
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
                <span className="type-label mb-2 block text-navy">{t("rrm.inputs.currentRate")}</span>
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
                <span className="type-label mb-2 block text-navy">{t("rrm.inputs.yearsLeft")}</span>
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
                <span className="type-label mb-2 block text-navy">{t("rrm.inputs.newRate")}</span>
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
                <span className="type-label mb-2 block text-navy">{t("rrm.inputs.newTerm")}</span>
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
                <span className="type-label mb-2 block text-navy">{t("rrm.inputs.closingCosts")}</span>
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
                <span className="type-label mb-2 block text-navy">{t("rrm.inputs.compareInterest")}</span>
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
              {t("rrm.inputs.ratesHint")}
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
                    <span className="relative z-[1]">{t("rrm.inputs.calculating")}</span>
                    <Loader2 className="relative z-[1] h-4 w-4 shrink-0 animate-spin" aria-hidden />
                  </>
                ) : (
                  <span className="relative z-[1]">{t("rrm.inputs.calculate")}</span>
                )}
              </button>
              {isDirty ? (
                <p className="font-sans text-[12px] leading-snug sm:text-[13px]" style={{ color: DIRTY_HINT_COLOR }}>
                  {t("rrm.inputs.dirtyHint")}
                </p>
              ) : (
                <p className="font-sans text-[12px] text-slate-500 sm:text-[13px]">
                  {t("rrm.inputs.cleanHint")}
                </p>
              )}
            </div>
            <p className="mt-4 font-sans text-[12px] leading-relaxed text-slate-500 sm:text-[13px]">
              {t("rrm.inputs.mapHint")}
            </p>
            <p className="type-body-xs mt-6 border-t border-slate-100 pt-6 text-slate-500">
              {t("rrm.inputs.disclaimer")}
            </p>
          </section>
        </div>

        {!result && (
          <div className="mx-auto mb-7 max-w-3xl rounded-xl border border-amber-200/90 bg-white p-6 shadow-sm">
            <p className="type-body-sm text-amber-950">
              {t("rrm.inputs.invalidResult")}
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
                      {t("rrm.mic.headline")}
                    </h2>
                    <p className="mt-4 font-sans text-[15px] leading-relaxed text-slate-700 sm:text-[16px]">
                      {(() => {
                        const m = Math.abs(result.monthlyDelta);
                        const dInterest = result.interestTotalNewHorizon - result.interestTotalCurrentHorizon;
                        const yrs = committedInputs.compareHorizonYears;
                        if (result.monthlyDelta > 1e-2 && dInterest > 1e-2) {
                          return t("rrm.mic.reduceCostUp")
                            .replace("{monthly}", formatCurrency(m))
                            .replace("{interest}", formatCurrency(dInterest))
                            .replace("{years}", String(yrs));
                        }
                        if (result.monthlyDelta > 1e-2 && dInterest < -1e-2) {
                          return t("rrm.mic.reduceBothLower")
                            .replace("{monthly}", formatCurrency(m))
                            .replace("{interest}", formatCurrency(-dInterest))
                            .replace("{years}", String(yrs));
                        }
                        if (result.monthlyDelta <= 1e-2 && result.monthlyDelta >= -1e-2) {
                          return t("rrm.mic.smallMove");
                        }
                        if (result.monthlyDelta < -1e-2) {
                          return t("rrm.mic.paymentRises");
                        }
                        return t("rrm.mic.fallback").replace("{years}", String(yrs));
                      })()}
                    </p>
                    <p className="mt-5 font-sans text-3xl font-semibold tabular-nums tracking-tight text-navy sm:text-4xl">
                      {interestDeltaSigned >= 0 ? "+" : "−"}
                      {formatCurrencyTight(Math.abs(interestDeltaSigned))}
                      <span className="ml-2 block text-sm font-medium tracking-normal text-slate-500 sm:inline sm:text-base">
                        {t("rrm.mic.intDiff").replace("{years}", String(committedInputs.compareHorizonYears))}
                      </span>
                    </p>
                  </div>
                  <div
                    className={`mt-8 rounded-lg p-6 sm:p-8 ${verdictPanelClasses(result.verdictKind)}`}
                    role="region"
                    aria-label={t("rrm.verdict.eyebrow")}
                  >
                    <p className="text-center font-sans text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 lg:text-left">
                      {t("rrm.verdict.eyebrow")}
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
                {t("rrm.metrics.intro")}
              </p>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
                <div className="rounded-lg bg-[#F7F7F5] p-4">
                  <p className="type-body-xs uppercase tracking-[0.14em] text-slate-500">{t("rrm.metrics.monthlyChange")}</p>
                  <p className="mt-2 font-sans text-2xl font-semibold tabular-nums text-navy">
                    {result.monthlyDelta >= 0 ? "−" : "+"}
                    {formatCurrencyTight(animMonthly)}
                  </p>
                  <p className="type-body-xs mt-2 text-slate-500">{t("rrm.metrics.perMonth")}</p>
                </div>
                <div className="rounded-lg bg-[#F7F7F5] p-4">
                  <p className="type-body-xs uppercase tracking-[0.14em] text-slate-500">{t("rrm.metrics.newVsCurrent")}</p>
                  <p className="mt-2 font-sans text-2xl font-semibold tabular-nums text-navy">
                    {formatCurrencyTight(animNewPay)}
                  </p>
                  <p className="type-body-xs mt-2 text-slate-500">vs {formatCurrencyTight(animCurPay)}</p>
                </div>
                <div className="rounded-lg bg-[#F7F7F5] p-4">
                  <p className="type-body-xs uppercase tracking-[0.14em] text-slate-500">{t("rrm.metrics.breakEven")}</p>
                  <p className="mt-2 font-sans text-2xl font-semibold tabular-nums text-navy">
                    {result.breakEvenMonths != null && Number.isFinite(result.breakEvenMonths)
                      ? `${Math.ceil(animBe)} mo`
                      : "—"}
                  </p>
                  <p className="type-body-xs mt-2 text-slate-500">{t("rrm.metrics.breakEvenTimeline")}</p>
                </div>
                <div className="rounded-lg bg-[#F7F7F5] p-4">
                  <p className="type-body-xs uppercase tracking-[0.14em] text-slate-500">
                    {t("rrm.metrics.interest").replace("{years}", String(committedInputs.compareHorizonYears))}
                  </p>
                  <p className="mt-2 font-sans text-2xl font-semibold tabular-nums text-navy">
                    {formatCurrencyTight(animIntDiff)}
                  </p>
                  <p className="type-body-xs mt-2 text-slate-500">
                    {result.interestTotalCurrentHorizon >= result.interestTotalNewHorizon
                      ? t("rrm.metrics.lessInterest")
                      : t("rrm.metrics.moreInterest")}
                  </p>
                </div>
              </div>
            </div>

            {/* Comparison cards */}
            <div className="mb-8 w-full max-w-3xl mx-auto rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-6 max-w-3xl">
                <h2 className="font-heading text-lg font-semibold text-navy sm:text-xl">{t("rrm.sidebyside.title")}</h2>
                <p className="mt-2 font-sans text-[13px] leading-relaxed text-slate-500 sm:text-[14px]">
                  {t("rrm.sidebyside.subtitle")}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                <div className="rounded-lg border border-slate-200/90 bg-[#F7F7F5]/80 p-6">
                  <h3 className="type-label text-navy/50">{t("rrm.sidebyside.keepCurrent")}</h3>
                  <p className="mt-4 font-sans text-2xl font-semibold tabular-nums text-navy">
                    {formatCurrency(result.currentMonthlyPayment)}
                    <span className="block text-[11px] font-normal uppercase tracking-[0.12em] text-slate-500">
                      {t("rrm.sidebyside.perMonth")}
                    </span>
                  </p>
                  <p className="mt-6 type-body-sm text-slate-600">
                    {t("rrm.sidebyside.interestOver").replace("{years}", String(committedInputs.compareHorizonYears))}{" "}
                    <span className="font-semibold text-navy">{formatCurrency(result.interestTotalCurrentHorizon)}</span>
                  </p>
                  <p className="mt-3 type-body-xs text-slate-500">{t("rrm.sidebyside.existingSchedule")}</p>
                </div>
                <div
                  className={`rounded-lg bg-white p-6 transition-transform duration-200 motion-reduce:transition-none motion-reduce:hover:scale-100 ${
                    result.verdictKind === "likely_worth_it"
                      ? "border-2 border-emerald-600 shadow-sm hover:scale-[1.01]"
                      : "border border-slate-200/90 ring-1 ring-gold/25"
                  }`}
                >
                  <h3 className="type-label text-gold/90">{t("rrm.sidebyside.refinanceTo")}</h3>
                  <p className="mt-4 font-sans text-2xl font-semibold tabular-nums text-navy">
                    {formatCurrency(result.newMonthlyPayment)}
                    <span className="block text-[11px] font-normal uppercase tracking-[0.12em] text-slate-500">
                      {t("rrm.sidebyside.perMonth")}
                    </span>
                  </p>
                  <p className="mt-6 type-body-sm text-slate-600">
                    {t("rrm.sidebyside.interestOver").replace("{years}", String(committedInputs.compareHorizonYears))}{" "}
                    <span className="font-semibold text-navy">{formatCurrency(result.interestTotalNewHorizon)}</span>
                  </p>
                  <p className="mt-3 type-body-xs text-slate-500">
                    {t("rrm.sidebyside.closingCosts").replace("{amount}", formatCurrency(committedInputs.closingCosts))}
                  </p>
                </div>
              </div>
            </div>

            {/* Charts (Tier 3) */}
            <div className="mb-8 w-full max-w-3xl mx-auto rounded-xl border border-slate-200/80 bg-white p-6 shadow-md">
              <div className="mb-6 max-w-3xl">
                <h2 className="font-heading text-lg font-semibold text-navy sm:text-xl">{t("rrm.charts.title")}</h2>
                <p className="mt-2 font-sans text-[13px] leading-relaxed text-slate-600 sm:text-[14px]">
                  {t("rrm.charts.subtitle")}
                </p>
              </div>
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="font-heading text-base font-semibold text-navy sm:text-lg">{t("rrm.charts.interestTitle")}</h3>
                  <p className="mt-1 font-sans text-[13px] leading-relaxed text-slate-500">
                    {t("rrm.charts.interestSubtitle")}
                  </p>
                  <p className="chart-context">{t("rrm.charts.eachPoint")}</p>
                  <ChartInteractionHint t={t} />
                  <div className="mt-4 rounded-xl bg-slate-100/90 p-4 shadow-inner">
                    <div className="mb-3 flex flex-wrap items-center gap-6 text-[12px] text-slate-600">
                      <span className="inline-flex items-center gap-2">
                        <span className="h-0.5 w-6 bg-navy" aria-hidden />
                        {t("rrm.charts.currentLoan")}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <span className="h-0.5 w-6 bg-gold" aria-hidden />
                        {t("rrm.charts.newLoan")}
                      </span>
                    </div>
                    <RefinanceInterestChartRecharts
                      seriesCurrent={result.seriesCurrent}
                      seriesNew={result.seriesNew}
                      breakEvenMonths={result.breakEvenMonths}
                      chartKey={chartKey}
                      reducedMotion={reducedMotion}
                      currentPayoffMonth={payoffCurrent}
                      chartStrings={chartStrings}
                    />
                  </div>
                </div>
                <div className="border-t border-slate-200/90 pt-6">
                  <h3 className="font-heading text-base font-semibold text-navy sm:text-lg">{t("rrm.charts.equityTitle")}</h3>
                  <p className="mt-1 font-sans text-[13px] leading-relaxed text-slate-500">
                    {t("rrm.charts.equitySubtitle")}
                  </p>
                  <p className="chart-context">{t("rrm.charts.eachPoint")}</p>
                  <ChartInteractionHint t={t} />
                  <div className="mt-4 rounded-xl bg-slate-100/90 p-4 shadow-inner">
                    <div className="mb-3 flex flex-wrap items-center gap-6 text-[12px] text-slate-600">
                      <span className="inline-flex items-center gap-2">
                        <span className="h-0.5 w-6 bg-navy" aria-hidden />
                        {t("rrm.charts.currentLoan")}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <span className="h-0.5 w-6 bg-gold" aria-hidden />
                        {t("rrm.charts.newLoan")}
                      </span>
                    </div>
                    <RefinanceEquityChartRecharts
                      seriesCurrent={result.seriesCurrent}
                      seriesNew={result.seriesNew}
                      chartKey={`eq-${chartKey}`}
                      reducedMotion={reducedMotion}
                      chartStrings={chartStrings}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* What this actually means */}
            <div className="mx-auto mb-8 max-w-3xl rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-semibold text-navy sm:text-xl">{t("rrm.means.title")}</h2>
              <p className="mt-3 font-sans text-[15px] leading-relaxed text-slate-700">
                {t("rrm.means.subtitle")}
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5 font-sans text-[14px] leading-relaxed text-slate-700">
                <li>{t("rrm.means.resetAmort")}</li>
                {yearsAdded > 0 && (
                  <li>{t("rrm.means.addYears").replace("{years}", String(yearsAdded))}</li>
                )}
                <li>
                  {interestDeltaSigned > 0
                    ? t("rrm.means.increaseCost")
                        .replace("{amount}", formatCurrency(Math.abs(interestDeltaSigned)))
                        .replace("{years}", String(committedInputs.compareHorizonYears))
                    : interestDeltaSigned < 0
                      ? t("rrm.means.decreaseCost")
                          .replace("{amount}", formatCurrency(Math.abs(interestDeltaSigned)))
                          .replace("{years}", String(committedInputs.compareHorizonYears))
                      : t("rrm.means.changeCost")
                          .replace("{amount}", formatCurrency(Math.abs(interestDeltaSigned)))
                          .replace("{years}", String(committedInputs.compareHorizonYears))}
                </li>
              </ul>
              <p className="mt-5 font-sans text-[14px] font-medium text-navy">{t("rrm.means.makeSenseIf")}</p>
              <ul className="mt-2 list-none space-y-1.5 font-sans text-[14px] leading-relaxed text-slate-600">
                <li className="before:mr-2 before:text-gold before:content-['→']">{t("rrm.means.breathingRoom")}</li>
                <li className="before:mr-2 before:text-gold before:content-['→']">
                  {t("rrm.means.planToSell").replace("{min}", String(Math.min(10, committedInputs.compareHorizonYears)))}
                </li>
              </ul>
              <p className="mt-5 font-sans text-[14px] font-medium text-navy">{t("rrm.means.lessIdealIf")}</p>
              <ul className="mt-2 list-none space-y-1.5 font-sans text-[14px] leading-relaxed text-slate-600">
                <li className="before:mr-2 before:text-gold before:content-['→']">{t("rrm.means.minimizingCost")}</li>
                <li className="before:mr-2 before:text-gold before:content-['→']">{t("rrm.means.wellInto")}</li>
              </ul>
            </div>

            {/* Insight */}
            <div className="mx-auto mb-8 max-w-3xl rounded-xl border border-slate-200/70 border-l-4 border-l-[#C6A15B] bg-[#FAF6EF] p-5 shadow-sm sm:p-6">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-navy/50">{t("rrm.insight.eyebrow")}</p>
              <div className="mt-3 space-y-3 font-sans text-[15px] italic leading-relaxed text-slate-800">
                {splitParagraphs(result.keyInsight).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            <div className="mx-auto mb-8 max-w-3xl rounded-xl border border-slate-200/80 bg-white p-5 text-center shadow-sm sm:p-6">
              <p className="font-sans text-[14px] leading-relaxed text-slate-700">
                {t("rrm.rateLock")}{" "}
                <Link
                  to="/tools/rate-lock-engine"
                  className="font-semibold text-navy underline decoration-gold/40 hover:text-gold"
                >
                  {t("rrm.rateLockLink")}
                </Link>
              </p>
            </div>

            {/* CTA */}
            <section
              className="bvw-cta mx-auto max-w-3xl rounded-xl border border-slate-200/80 bg-[#F9F9F7] p-8 shadow-sm lg:p-10"
              aria-labelledby="rrm-cta-heading"
            >
              <h2 id="rrm-cta-heading" className="type-section-heading-sm mx-auto mb-3 max-w-xl text-center">
                {t("rrm.cta.title")}
              </h2>
              <p className="type-body-sm mx-auto max-w-md text-center leading-relaxed text-slate-600">
                {t("rrm.cta.subtitle")}
              </p>
              <Link
                to="/contact?topic=refinance-real-math"
                className="btn-primary mx-auto mt-7 inline-flex min-h-[52px] min-w-[280px] items-center justify-center gap-2 px-8 text-[15px] shadow-[0_6px_24px_rgba(10,25,47,0.2)] transition-shadow duration-200 hover:shadow-[0_10px_36px_rgba(10,25,47,0.28)] motion-reduce:transition-none"
              >
                {t("rrm.cta.button")}
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
