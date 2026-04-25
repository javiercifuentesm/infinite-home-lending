import { useCallback, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Scale } from "lucide-react";
import {
  computeBuyVsWait,
  classifyBuyVsWaitOutcome,
  getBuyVsWaitOutcomeCopy,
  buildPrimaryTakeaway,
  buildDecisionAmplification,
  formatBuyVsWaitCurrency,
  getAssumptionsTrustBullets,
  DEFAULT_ANNUAL_HOME_APPRECIATION,
  DEFAULT_RATE_DRIFT_POINTS,
  DEFAULT_TAX_PCT_ANNUAL,
  DEFAULT_INSURANCE_PCT_ANNUAL,
  type BuyVsWaitHorizonYears,
  type BuyVsWaitInputs,
  type BuyVsWaitResult,
  type BuyVsWaitPrimaryTakeaway,
  type BuyVsWaitOutcomeKind,
} from "../lib/buyVsWaitModel";
import { PrimaryTakeawayBar } from "../components/buyVsWait/PrimaryTakeawayBar";
import { ComparisonBars } from "../components/buyVsWait/ComparisonBars";
import {
  BuyVsWaitExplainerDialog,
  BuyVsWaitExplainerTriggerButton,
} from "../components/buyVsWait/BuyVsWaitExplainer";
import { BuyVsWaitMethodologyDialog } from "../components/buyVsWait/BuyVsWaitMethodologyDialog";
import { BuyVsWaitAmortizationSnapshot } from "../components/buyVsWait/BuyVsWaitAmortizationSnapshot";

const HORIZONS: { value: BuyVsWaitHorizonYears; label: string }[] = [
  { value: 1, label: "1 year" },
  { value: 2, label: "2 years" },
  { value: 3, label: "3 years" },
];

type BuyVsWaitCtaCopy = {
  headline: string;
  supporting: string;
  button: string;
  reassurance: string;
};

/** Outcome-aware CTA — forward when buying leads, softer when waiting helps, neutral when close. */
function getBuyVsWaitCtaCopy(kind: BuyVsWaitOutcomeKind): BuyVsWaitCtaCopy {
  const reassurance = "No pressure — just clarity on your next move.";

  if (kind === "buy_now_stronger") {
    return {
      headline: "Let's map this to your real purchase scenario",
      supporting:
        "We'll review your numbers, pressure-test the assumptions, and show you exactly how this could play out with real loan options.",
      button: "Explore your options",
      reassurance,
    };
  }

  if (kind === "wait_may_help_short_term") {
    return {
      headline: "Turn this into a real plan",
      supporting:
        "When you're ready, we'll review your numbers, pressure-test the assumptions, and walk through how each path could look with real loan options — without rushing the timing.",
      button: "See your real scenario",
      reassurance: "No pressure — we'll meet you where you are.",
    };
  }

  return {
    headline: "Let's map your next step with real numbers",
    supporting:
      "We'll review your numbers, pressure-test the assumptions, and help you compare paths with real loan options — without pushing one answer.",
    button: "Explore your options",
    reassurance,
  };
}

const defaultInputs = (): BuyVsWaitInputs => ({
  purchasePrice: 550_000,
  downPercent: 10,
  interestRatePct: 6.75,
  monthlyRent: 2_800,
  horizonYears: 2,
});

function parseMoneyInput(s: string): number {
  const cleaned = s.replace(/[^0-9.]/g, "");
  if (!cleaned) return 0;
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function BvwMoneyField({
  id,
  label,
  value,
  onCommit,
  min,
}: {
  id: string;
  label: string;
  value: number;
  onCommit: (n: number) => void;
  min?: number;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const safe = Number.isFinite(value) ? value : 0;
  const displayValue = draft !== null ? draft : formatBuyVsWaitCurrency(safe);

  return (
    <label className="block">
      <span className="type-label mb-2 block text-navy">{label}</span>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        className="type-input tabular-nums"
        value={displayValue}
        onFocus={() => {
          setDraft(safe === 0 ? "" : safe.toFixed(2));
        }}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          const raw = draft ?? "";
          setDraft(null);
          let n = parseMoneyInput(raw);
          if (min !== undefined) n = Math.max(min, n);
          onCommit(n);
        }}
      />
    </label>
  );
}

export default function BuyVsWaitAnalyzer() {
  const [draftInputs, setDraftInputs] = useState<BuyVsWaitInputs>(defaultInputs);
  const [committedInputs, setCommittedInputs] = useState<BuyVsWaitInputs>(defaultInputs);
  const [calcBusy, setCalcBusy] = useState(false);
  const [explainerOpen, setExplainerOpen] = useState(false);
  const explainerAnchorRef = useRef<HTMLButtonElement>(null);
  const [methodologyOpen, setMethodologyOpen] = useState(false);

  const isDirty = useMemo(
    () => JSON.stringify(draftInputs) !== JSON.stringify(committedInputs),
    [draftInputs, committedInputs]
  );

  const { result, computeError } = useMemo(() => {
    try {
      return { result: computeBuyVsWait(committedInputs), computeError: null as string | null };
    } catch {
      return {
        result: null,
        computeError: "Check that price, down payment, and rates are valid positive numbers.",
      };
    }
  }, [committedInputs]);

  const outcome = useMemo(() => {
    if (!result) return null;
    const kind = classifyBuyVsWaitOutcome(result, committedInputs);
    return getBuyVsWaitOutcomeCopy(kind, result, committedInputs);
  }, [result, committedInputs]);

  const primaryTakeaway = useMemo(() => {
    if (!result || !outcome) return null;
    return buildPrimaryTakeaway(outcome.kind, result, committedInputs);
  }, [result, committedInputs, outcome]);

  const decisionAmplification = useMemo(() => {
    if (!result || !outcome) return null;
    return buildDecisionAmplification(outcome.kind, result);
  }, [result, outcome]);

  const ctaCopy = useMemo(() => (outcome ? getBuyVsWaitCtaCopy(outcome.kind) : null), [outcome]);

  const update = useCallback(<K extends keyof BuyVsWaitInputs>(key: K, value: BuyVsWaitInputs[K]) => {
    setDraftInputs((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleCalculate = useCallback(() => {
    setCommittedInputs({ ...draftInputs });
    setCalcBusy(true);
    window.setTimeout(() => setCalcBusy(false), 220);
  }, [draftInputs]);

  const assumptionsTrustBullets = useMemo(() => {
    return getAssumptionsTrustBullets({
      annualHomeAppreciation: draftInputs.annualHomeAppreciation ?? DEFAULT_ANNUAL_HOME_APPRECIATION,
      rateDriftPoints: draftInputs.rateDriftPoints ?? DEFAULT_RATE_DRIFT_POINTS,
      taxPctOfValueAnnual: draftInputs.taxPctOfValueAnnual ?? DEFAULT_TAX_PCT_ANNUAL,
      insurancePctOfValueAnnual: draftInputs.insurancePctOfValueAnnual ?? DEFAULT_INSURANCE_PCT_ANNUAL,
    });
  }, [draftInputs]);

  return (
    <div
      className="
        bg-surface min-h-screen border-b border-slate-100 font-sans
        pt-[calc(var(--site-header-height)+0.375rem)]
      "
    >
      <section className="max-w-7xl mx-auto px-6 pb-16 lg:pb-20">
        {/* Hero — same structure + rhythm as Loan Structure Simulator */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-12 mb-12 lg:mb-14 pt-2 sm:pt-3 lg:pt-4">
          <header className="max-w-3xl min-w-0 flex-1 text-center lg:text-left">
            <div className="mb-4 inline-flex items-center gap-2 rounded-[4px] border border-gold/20 bg-white px-3 py-1.5 text-navy/70">
              <Scale size={14} className="text-gold" strokeWidth={1.75} aria-hidden />
              <span className="type-label">Decision support</span>
            </div>
            <h1 className="type-editorial-section-title text-[2rem] sm:text-4xl lg:text-[2.75rem] mb-5 leading-[1.08]">
              Buy vs. Wait Analyzer
            </h1>
            <p className="type-body-lg mx-auto max-w-2xl text-slate-600 lg:mx-0">
              See what waiting could actually cost you — or save you — based on your numbers.
            </p>
          </header>
          <div className="hidden shrink-0 lg:flex lg:justify-end lg:pt-0.5">
            <BuyVsWaitExplainerTriggerButton
              buttonRef={explainerAnchorRef}
              type="button"
              aria-expanded={explainerOpen}
              aria-haspopup="dialog"
              onClick={() => setExplainerOpen(true)}
            />
          </div>
        </div>

        <div className="flex justify-center pb-2 pt-0 lg:hidden">
          <BuyVsWaitExplainerTriggerButton
            type="button"
            aria-expanded={explainerOpen}
            aria-haspopup="dialog"
            onClick={() => setExplainerOpen(true)}
          />
        </div>

        <BuyVsWaitExplainerDialog open={explainerOpen} onClose={() => setExplainerOpen(false)} anchorRef={explainerAnchorRef} />
        <BuyVsWaitMethodologyDialog open={methodologyOpen} onClose={() => setMethodologyOpen(false)} />

        <div id="bvw-inputs" className="scroll-mt-28">
          <div className="max-w-3xl mb-6 lg:mb-8">
            <h2 id="bvw-scenario-heading" className="type-label text-navy/40 tracking-[0.18em] mb-2">
              Your scenario
            </h2>
          </div>
          <section
            className="bvw-card-surface bvw-card-pad bvw-section-gap mx-auto w-full max-w-3xl"
            aria-labelledby="bvw-scenario-heading"
          >
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-7">
            <BvwMoneyField
              id="bvw-purchase-price"
              label="Purchase price"
              value={draftInputs.purchasePrice}
              min={1}
              onCommit={(n) => update("purchasePrice", n)}
            />
            <label className="block">
              <span className="type-label mb-2 block text-navy">Down payment (%)</span>
              <input
                type="number"
                min={0}
                max={100}
                step={0.5}
                className="type-input"
                value={draftInputs.downPercent || ""}
                onChange={(e) => update("downPercent", Number(e.target.value))}
              />
            </label>
            <label className="block">
              <span className="type-label mb-2 block text-navy">Interest rate (%)</span>
              <input
                type="number"
                min={0}
                max={25}
                step={0.125}
                className="type-input"
                value={draftInputs.interestRatePct || ""}
                onChange={(e) => update("interestRatePct", Number(e.target.value))}
              />
            </label>
            <BvwMoneyField
              id="bvw-monthly-rent"
              label="Monthly rent (while waiting)"
              value={draftInputs.monthlyRent}
              min={0}
              onCommit={(n) => update("monthlyRent", n)}
            />
            <label className="block sm:col-span-2">
              <span className="type-label mb-2 block text-navy">Time horizon</span>
              <select
                className="type-input max-w-md"
                value={draftInputs.horizonYears}
                onChange={(e) => update("horizonYears", Number(e.target.value) as BuyVsWaitHorizonYears)}
              >
                {HORIZONS.map((h) => (
                  <option key={h.value} value={h.value}>
                    {h.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="type-body-xs mt-8 text-slate-500">
            Uses real loan calculations and market-based estimates.
          </p>
          <p className="type-body-xs mt-3 text-slate-600">
            <Link to="/tools/true-cost-of-waiting" className="font-semibold text-gold hover:underline">
              Thinking of waiting?
            </Link>{" "}
            See{" "}
            <Link to="/tools/true-cost-of-waiting" className="text-navy underline decoration-gold/40 hover:text-gold">
              The True Cost of Waiting
            </Link>{" "}
            — itemized rent, appreciation, and equity missed.
          </p>
          <div className="mt-8 flex flex-col gap-4 border-t border-slate-100 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleCalculate}
              disabled={!isDirty || calcBusy}
              className="inline-flex min-h-[48px] min-w-[220px] items-center justify-center rounded-[4px] bg-navy px-10 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-[0_5px_20px_rgba(10,25,47,0.22)] transition-[transform,box-shadow,opacity] duration-300 ease-out hover:-translate-y-px hover:shadow-[0_8px_26px_rgba(10,25,47,0.26)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/45 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 motion-reduce:hover:translate-y-0"
            >
              {calcBusy ? "Running analysis…" : "Run analysis"}
            </button>
            <p className="type-body-xs text-slate-500 sm:max-w-xs sm:text-right">
              {isDirty ? "Update your inputs, then run the analysis." : "Results below reflect these inputs."}
            </p>
          </div>
        </section>
        </div>

        <div>
          <div className="max-w-3xl mb-6 lg:mb-8">
            <h2 id="bvw-grounded-heading" className="type-label text-navy/40 tracking-[0.18em] mb-2">
              How these estimates are grounded
            </h2>
          </div>
          <section aria-labelledby="bvw-grounded-heading" className="bvw-card-surface bvw-card-pad bvw-section-gap">
          <ul className="list-none space-y-3 type-body-sm leading-relaxed text-slate-600">
            {assumptionsTrustBullets.map((line) => (
              <li key={line} className="flex gap-2.5 pl-0.5">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-navy/30" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="type-body-xs mt-3 border-t border-slate-100 pt-3 text-slate-500">
            These are neutral, market-based estimates — not optimized to favor buying or waiting.
          </p>
          <p className="type-body-xs mt-2">
            <button
              type="button"
              className="text-left text-navy/55 underline decoration-navy/25 underline-offset-[3px] transition-colors hover:text-navy/85"
              aria-expanded={methodologyOpen}
              aria-haspopup="dialog"
              onClick={() => setMethodologyOpen(true)}
            >
              Learn how we model this
            </button>
          </p>
        </section>
        </div>

        {computeError && (
          <div className="bvw-section-gap rounded-[4px] border border-amber-200/90 bg-amber-50/80 px-6 py-4">
            <p className="type-body-sm text-amber-950">{computeError}</p>
          </div>
        )}

        {result && outcome && isDirty && (
          <div className="mb-8 rounded-[4px] border border-slate-200/90 bg-slate-50/90 px-5 py-3.5 type-body-sm text-slate-700">
            Showing results from your last calculation. Click <span className="font-semibold text-navy">Run analysis</span> to refresh.
          </div>
        )}

        {result && outcome && (
          <>
            <div className="space-y-10 lg:space-y-12">
              <section className="rounded-[4px] border border-gold/20 bg-navy px-6 py-10 text-white shadow-[0_24px_56px_rgba(10,25,47,0.14)] sm:px-8 sm:py-12 lg:px-10 lg:py-12">
                <p className="type-outcome-lead text-white">{outcome.headlineLead}</p>
                <p className="type-body-sm mt-3 max-w-2xl text-white/85">{outcome.headlineSupport}</p>
                {outcome.kind === "buy_now_stronger" ? (
                  <p className="type-body-xs mt-4 max-w-2xl text-white/65 border-t border-white/10 pt-4">
                    This is where waiting starts to work against you.
                  </p>
                ) : null}
              </section>

              {decisionAmplification && (
                <section aria-label="Verdict" className="bvw-verdict">
                  <h2 className="font-heading text-xl sm:text-2xl text-navy tracking-[-0.02em] leading-snug">
                    {decisionAmplification.verdictTitle}
                  </h2>
                  <p className="type-body-sm mt-3 max-w-2xl leading-relaxed text-slate-600">
                    {decisionAmplification.verdictSupport}
                  </p>
                </section>
              )}

              {primaryTakeaway && <PrimaryTakeawayCard takeaway={primaryTakeaway} />}

              {decisionAmplification && (
                <section aria-labelledby="bvw-amplifier-heading" className="bvw-amplifier">
                  <h2 id="bvw-amplifier-heading" className="type-label text-gold/90 tracking-[0.18em] mb-2">
                    What this means
                  </h2>
                  <div className="mt-3 space-y-2.5">
                    {decisionAmplification.whatThisMeansLines.map((line, i) => (
                      <p key={i} className="type-body-sm max-w-2xl leading-relaxed text-slate-700">
                        {line}
                      </p>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="mt-10 lg:mt-12">
              <div className="max-w-3xl mb-6 lg:mb-8">
                <h2 className="type-label text-navy/40 tracking-[0.18em] mb-2">Side-by-side comparison</h2>
              </div>
              <section className="bvw-card-surface bvw-section-gap overflow-hidden">
              <div className="overflow-x-auto">
                <table className="type-table">
                  <thead>
                    <tr className="border-b border-slate-100 bg-surface/80">
                      <th className="type-table-title border-b border-slate-100" scope="col" />
                      <th className="type-table-title border-b border-slate-100" scope="col">
                        Buy now
                      </th>
                      <th className="type-table-title border-b border-slate-100" scope="col">
                        Wait
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="type-body-sm text-slate-600">Monthly payment</td>
                      <td className="type-metric">
                        {formatBuyVsWaitCurrency(result.buyNow.monthlyPaymentTotal)}
                        <span className="text-slate-500"> · PITI</span>
                      </td>
                      <td className="type-metric">{formatBuyVsWaitCurrency(committedInputs.monthlyRent)}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="type-body-sm text-slate-600">Total cash out (horizon)</td>
                      <td className="type-metric">{formatBuyVsWaitCurrency(result.buyNow.totalCashSpent)}</td>
                      <td className="type-metric">{formatBuyVsWaitCurrency(result.wait.rentPaidTotal)}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="type-body-sm text-slate-600">Total equity gained over horizon</td>
                      <td className="type-metric">{formatBuyVsWaitCurrency(result.equity.totalEquityGained)}</td>
                      <td className="type-metric-muted">—</td>
                    </tr>
                    <tr>
                      <td className="type-body-sm text-slate-600">Projected home value (modeled)</td>
                      <td className="type-metric">{formatBuyVsWaitCurrency(result.buyNow.homeValueEnd)}</td>
                      <td className="type-metric">{formatBuyVsWaitCurrency(result.wait.futurePurchasePrice)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="border-t border-slate-100 px-6 py-6 sm:px-8">
                <ComparisonBars
                  rows={[
                    {
                      label: "Monthly cost",
                      buyValue: result.buyNow.monthlyPaymentTotal,
                      waitValue: committedInputs.monthlyRent,
                    },
                    {
                      label: "Total cash over horizon",
                      buyValue: result.buyNow.totalCashSpent,
                      waitValue: result.wait.rentPaidTotal,
                    },
                    {
                      label: "Total equity gained",
                      buyValue: result.equity.totalEquityGained,
                      waitValue: 0,
                    },
                  ]}
                />
              </div>
            </section>
            </div>

            <div>
              <div className="max-w-3xl mb-6 lg:mb-8">
                <h2 id="bvw-cash-equity-heading" className="type-label text-navy/40 tracking-[0.18em] mb-2">
                  Cash &amp; equity comparison
                </h2>
              </div>
              <section aria-labelledby="bvw-cash-equity-heading" className="bvw-card-surface bvw-card-pad bvw-section-gap">
                <CashEquityBars result={result} />
              </section>
            </div>

            {result.amortizationSnapshot.startingBalance > 0 && (
              <div className="bvw-section-gap">
                <div className="max-w-3xl mb-6 lg:mb-8">
                  <h2 id="bvw-amort-snapshot-heading" className="type-label text-navy/40 tracking-[0.18em] mb-2">
                    How ownership builds over {result.horizonYears === 1 ? "1 year" : `${result.horizonYears} years`}
                  </h2>
                </div>
                <BuyVsWaitAmortizationSnapshot
                  result={result}
                  interestRatePct={committedInputs.interestRatePct}
                  hideHeading
                />
              </div>
            )}

            <section className="bvw-cta mx-auto mt-24 max-w-3xl lg:mt-32" aria-labelledby="bvw-main-cta-heading">
              <h2 id="bvw-main-cta-heading" className="type-section-heading-sm mx-auto mb-3 max-w-xl text-center">
                {ctaCopy?.headline}
              </h2>
              <p className="type-body-sm mx-auto max-w-md text-center leading-relaxed text-slate-600">
                {ctaCopy?.supporting}
              </p>
              <p className="type-body-xs mx-auto mt-4 max-w-md text-center text-slate-500">{ctaCopy?.reassurance}</p>
              <p className="type-body-xs mx-auto mt-6 max-w-md text-center text-slate-500">
                Takes 2–3 minutes. No credit check.
              </p>
              <Link
                to="/contact?topic=buy-vs-wait"
                className="btn-primary mx-auto mt-4 inline-flex min-h-[48px] min-w-[220px] items-center justify-center gap-2 px-10 shadow-[0_5px_22px_rgba(10,25,47,0.18)]"
              >
                {ctaCopy?.button}
                <ArrowRight size={18} aria-hidden />
              </Link>
            </section>
          </>
        )}
      </section>
    </div>
  );
}

function breakdownHasTiers(breakdown: BuyVsWaitPrimaryTakeaway["breakdown"]): boolean {
  return breakdown.some((r) => r.tier);
}

function TieredTakeawayBreakdown({ breakdown }: { breakdown: BuyVsWaitPrimaryTakeaway["breakdown"] }) {
  const drivers = breakdown.filter((r) => r.tier === "driver");
  const summaryRow = breakdown.find((r) => r.tier === "summary");
  const contextRow = breakdown.find((r) => r.tier === "context");

  return (
    <div className="mt-8 border-t border-slate-100 pt-8">
      <ul className="space-y-2.5">
        {drivers.map((row) => (
          <li
            key={row.label}
            className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
          >
            <span className="type-body-sm font-normal text-slate-500">{row.label}</span>
            <span className="type-body-sm font-normal tabular-nums text-slate-600 sm:text-right">{row.value}</span>
          </li>
        ))}
      </ul>
      {(summaryRow || contextRow) && (
        <div className="mt-6 border-t border-slate-100 pt-6">
          {summaryRow ? (
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <span className="type-body-sm font-semibold tracking-tight text-navy">{summaryRow.label}</span>
              <span className="text-right text-lg font-semibold tabular-nums text-navy sm:text-xl">
                {summaryRow.value}
              </span>
            </div>
          ) : null}
          {contextRow ? (
            <div
              className={`flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 ${
                summaryRow ? "mt-4 border-t border-slate-100/80 pt-4" : ""
              }`}
            >
              <span className="type-body-xs font-normal text-slate-500">{contextRow.label}</span>
              <span className="type-body-sm font-medium tabular-nums text-slate-600 sm:text-right">{contextRow.value}</span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function PrimaryTakeawayCard({ takeaway }: { takeaway: BuyVsWaitPrimaryTakeaway }) {
  const hasTitle = Boolean(takeaway.title.trim());
  const titleId = "bvw-primary-takeaway-title";
  const tiered = breakdownHasTiers(takeaway.breakdown);

  return (
    <section
      aria-labelledby={hasTitle ? titleId : undefined}
      aria-label={hasTitle ? undefined : "Primary takeaway"}
      className="bvw-takeaway bvw-card-pad"
    >
      <p className="type-label mb-4 text-navy/40 tracking-[0.18em]">Primary takeaway</p>
      {hasTitle ? (
        <h2 id={titleId} className="type-section-heading-sm">
          {takeaway.title}
        </h2>
      ) : null}
      <p className={`type-body-xs text-slate-500 ${hasTitle ? "mt-4" : ""}`}>{takeaway.numberMicroLabel}</p>
      <p className="type-bvw-hero-metric mt-2">{takeaway.mainValue}</p>
      <p className="type-body-sm mt-3 leading-relaxed text-slate-600">{takeaway.humanTranslation}</p>
      <p className="type-body-xs mt-2 text-slate-500">{takeaway.mainSublabel}</p>
      {takeaway.equityNote ? (
        <p className="type-body-xs mt-2 text-slate-500">{takeaway.equityNote}</p>
      ) : null}
      <PrimaryTakeawayBar bar={takeaway.bar} />
      {tiered ? (
        <TieredTakeawayBreakdown breakdown={takeaway.breakdown} />
      ) : (
        <ul className="mt-8 space-y-3.5 border-t border-slate-100 pt-8">
          {takeaway.breakdown.map((row) => (
            <li
              key={row.label}
              className={`flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 ${
                row.summary ? "mt-1 border-t border-slate-100/90 pt-3" : ""
              }`}
            >
              <span
                className={
                  row.summary ? "type-body-sm font-medium text-navy" : "type-body-sm text-slate-600"
                }
              >
                {row.label}
              </span>
              <span
                className={
                  row.summary
                    ? "type-metric text-right font-semibold tabular-nums text-navy"
                    : "type-metric text-right tabular-nums"
                }
              >
                {row.value}
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="type-body-sm mt-8 border-t border-slate-100 pt-8 font-medium leading-relaxed text-navy/90">
        {takeaway.conclusionLine}
      </p>

      {takeaway.supporting ? (
        <p className="type-body-sm mt-6 border-t border-slate-100 pt-6 leading-relaxed text-slate-600">{takeaway.supporting}</p>
      ) : null}
    </section>
  );
}

function CashEquityBars({ result }: { result: BuyVsWaitResult }) {
  const { buyNow, wait, equity } = result;
  const cashBarMax = Math.max(buyNow.totalCashSpent, wait.rentPaidTotal, 1);
  const equityBarMax = Math.max(equity.totalEquityGained, 1);
  const cashLabel =
    result.horizonYears === 1 ? "Cash over 1 year" : `Cash over ${result.horizonYears} years`;

  return (
    <div className="space-y-10">
      <div>
        <p className="type-body-xs mb-4 text-slate-500">{cashLabel}</p>
        <div className="space-y-4">
          <div>
            <div className="mb-1.5 flex justify-between gap-4">
              <span className="type-body-sm text-slate-600">Buy now (down + PITI)</span>
              <span className="type-metric shrink-0 tabular-nums">{formatBuyVsWaitCurrency(buyNow.totalCashSpent)}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-3 rounded-full bg-navy/90"
                style={{ width: `${(buyNow.totalCashSpent / cashBarMax) * 100}%` }}
              />
            </div>
          </div>
          <div>
            <div className="mb-1.5 flex justify-between gap-4">
              <span className="type-body-sm text-slate-600">Wait (rent only in this window)</span>
              <span className="type-metric shrink-0 tabular-nums">{formatBuyVsWaitCurrency(wait.rentPaidTotal)}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-3 rounded-full bg-gold/90"
                style={{ width: `${(wait.rentPaidTotal / cashBarMax) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <p className="type-body-xs mb-4 text-slate-500">Total equity gained (over horizon)</p>
        <div className="space-y-4">
          <div>
            <div className="mb-1.5 flex justify-between gap-4">
              <span className="type-body-sm text-slate-600">If you buy now</span>
              <span className="type-metric shrink-0 tabular-nums">{formatBuyVsWaitCurrency(equity.totalEquityGained)}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-3 rounded-full bg-navy/90" style={{ width: `${(equity.totalEquityGained / equityBarMax) * 100}%` }} />
            </div>
          </div>
          <div>
            <div className="mb-1.5 flex justify-between gap-4">
              <span className="type-body-sm text-slate-600">If you wait (no ownership in window)</span>
              <span className="type-metric shrink-0 tabular-nums text-slate-400">
                {formatBuyVsWaitCurrency(0)}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-3 w-[2%] min-w-[4px] rounded-full bg-slate-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
