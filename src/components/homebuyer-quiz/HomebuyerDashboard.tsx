import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronDown, Info } from "lucide-react";
import type { FinancialRealityOutcome } from "../../lib/financialReality/engine";
import { formatCurrency } from "../../lib/financialReality/engine";
import { useAnimatedNumber } from "../../hooks/useAnimatedNumber";
import { QuizShareButton } from "./QuizShareButton";
import { FlagshipCtaPrimary, FlagshipTextLink } from "./FlagshipCta";
import { PAGE_CONTENT_RAIL_CLASS } from "../../constants/layout";

type Props = {
  outcome: FinancialRealityOutcome;
  onReset: () => void;
};

function ConfidenceBadge({ level }: { level: FinancialRealityOutcome["decision"]["confidenceLevel"] }) {
  const map = {
    High: "border-emerald-200 bg-emerald-50 text-emerald-900",
    Moderate: "border-amber-200 bg-amber-50 text-amber-950",
    Low: "border-slate-200 bg-slate-50 text-[#0B1F3A]",
  } as const;
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${map[level]}`}>
      {level} confidence
    </span>
  );
}

/**
 * Flagship single-screen financial decision dashboard — grid + sticky actions, minimal scroll.
 */
export function HomebuyerDashboard({ outcome, onReset }: Props) {
  const { consequence, consequenceTracker, presentTense, decision, reportCard } = outcome;
  const rentMo = consequence.monthly_loss_estimate;
  const annualRentGone = Math.round(rentMo * 12);
  const t = consequenceTracker;
  const nowScenario = t.scenarios[0];
  const loss12mo = t.accumulationCurve.find((p) => p.month === 12)?.cumulativeLoss ?? Math.round(rentMo * 12 + t.monthlyPriceDrift * 12);
  const fiveYearDrag = Math.round(t.yearlyLossApprox * 5);
  const animKey = 1;
  const countLoss = useAnimatedNumber(loss12mo, 1400, animKey, true);

  const headline = useMemo(() => presentTense.presentRealityHeadline, [presentTense.presentRealityHeadline]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]">
        <div className={`${PAGE_CONTENT_RAIL_CLASS} mx-auto max-w-4xl pb-4 pt-1`}>
          {/* 1 — Top summary bar (anchor) */}
          <div className="sticky top-0 z-20 -mx-1 mb-3 border-b border-black/[0.06] bg-[#F7F9FC]/95 px-1 py-3 backdrop-blur-md">
            <p className="text-center font-heading text-[15px] font-bold leading-snug text-[#0B1F3A] sm:text-[17px]">{headline}</p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
              <span className="metric-glow rounded-xl px-3 py-1.5 font-heading text-[1.35rem] font-bold tabular-nums text-[#D64545] sm:text-[1.55rem]">
                {formatCurrency(t.totalMonthlyImpact)}/mo
              </span>
              <span className="text-[13px] font-medium text-[rgba(11,31,58,0.55)]">combined leak</span>
            </div>
            <p className="mt-2 text-center text-[13px] text-[rgba(11,31,58,0.65)]">
              That&apos;s ~<span className="font-semibold tabular-nums text-[#0B1F3A]">{formatCurrency(fiveYearDrag)}</span> over 5 years in illustrative drag
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
              <ConfidenceBadge level={decision.confidenceLevel} />
              <span className="text-[12px] font-medium text-[#0B1F3A]/70">This is a clear financial leak.</span>
            </div>
          </div>

          {/* 2 — Hero card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto mt-2 max-w-xl overflow-hidden rounded-2xl border-2 border-[#D64545]/25 bg-gradient-to-b from-[rgba(214,69,69,0.08)] to-white px-5 py-8 text-center shadow-[0_24px_64px_rgba(214,69,69,0.12)] sm:px-8 sm:py-10"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(214,69,69,0.12),transparent_55%)]" aria-hidden />
            <p className="relative text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D64545]/90">The number to sit with</p>
            <p className="relative mt-4 font-heading text-[1.65rem] font-bold leading-[1.15] tracking-tight text-[#0B1F3A] sm:text-[2rem] md:text-[2.15rem]">
              You&apos;ve already spent ~<span className="tabular-nums text-[#D64545]">{formatCurrency(annualRentGone)}</span> renting
            </p>
            <p className="relative mt-3 font-heading text-[1.25rem] font-bold text-[#0B1F3A] sm:text-[1.4rem]">— and kept none of it.</p>
            <p className="relative mt-5 text-[13px] font-medium text-[rgba(11,31,58,0.55)]">Screenshot &amp; share — then fix the leak.</p>
            <div className="relative mt-4 flex justify-center">
              <QuizShareButton theme="light" />
            </div>
          </motion.div>

          {/* 3 — Core grid 2x2 */}
          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-2">
            <div
              title="What you pay today — rent builds 0% equity."
              className="rounded-xl border border-black/[0.06] bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:p-4"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0B1F3A]/45">Current reality</p>
              <p className="mt-2 font-heading text-[1.05rem] font-bold tabular-nums text-[#0B1F3A] sm:text-[1.15rem]">{formatCurrency(rentMo)}/mo</p>
              <p className="mt-1 text-[12px] font-semibold text-[#0B1F3A]/70">You pay rent</p>
              <p className="mt-2 rounded-lg bg-slate-50 px-2 py-1.5 text-center text-[11px] font-bold uppercase tracking-wide text-[#D64545]">0% builds wealth</p>
            </div>

            <div
              title="12-month cumulative leak from rent + drift (illustrative)."
              className="rounded-xl border border-[#D64545]/20 bg-[rgba(214,69,69,0.04)] p-3 shadow-sm transition-shadow hover:shadow-md sm:p-4"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#D64545]/80">Loss tracker</p>
              <p className="mt-2 font-heading text-[1.05rem] font-bold tabular-nums text-[#D64545] sm:text-[1.15rem]">
                ~{formatCurrency(Math.round(countLoss))}
              </p>
              <p className="mt-1 text-[12px] text-[rgba(11,31,58,0.7)]">Illustrative 12-mo leak (rent + drift)</p>
            </div>

            <div
              title="Approximate extra yearly cost if habits and timing stay the same."
              className="rounded-xl border border-amber-200/80 bg-amber-50/90 p-3 shadow-sm transition-shadow hover:shadow-md sm:p-4"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-900/70">If nothing changes</p>
              <p className="mt-2 font-heading text-[1.05rem] font-bold tabular-nums text-amber-950 sm:text-[1.15rem]">
                ~{formatCurrency(t.yearlyLossApprox)} more/yr
              </p>
              <p className="mt-1 text-[12px] text-amber-950/85">Waiting 12 mo vs now (model)</p>
            </div>

            <div
              title="5-year equity build if you buy now in the model (principal + appreciation share)."
              className="rounded-xl border border-emerald-200/90 bg-emerald-50/95 p-3 shadow-sm transition-shadow hover:shadow-md sm:p-4"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-900/70">Opportunity</p>
              <p className="mt-2 font-heading text-[1.05rem] font-bold tabular-nums text-emerald-900 sm:text-[1.15rem]">
                ~{formatCurrency(nowScenario.equityGainedFiveYear)}
              </p>
              <p className="mt-1 text-[12px] text-emerald-900/85">Equity in 5 yrs if you own (illus.)</p>
            </div>
          </div>

          {/* 4 — Consequence strip */}
          <div className="mt-5 rounded-xl border border-[#D64545]/20 bg-[#0B1F3A] px-4 py-4 text-center shadow-lg sm:px-6">
            <p className="font-heading text-[15px] font-bold text-white sm:text-[16px]">
              Every month you wait costs ~{formatCurrency(t.totalMonthlyImpact)} combined.
            </p>
            <p className="mt-2 text-[13px] font-medium text-white/80">
              Waiting 1 year ≈ ~{formatCurrency(t.yearlyLossApprox)} lost on this model — same habits, no equity back.
            </p>
          </div>

          {/* Facts & assumptions */}
          <details className="group mt-4 rounded-xl border border-black/[0.06] bg-white shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-left marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-2 text-[13px] font-semibold text-[#0B1F3A]">
                <Info className="h-4 w-4 shrink-0 text-[#0B1F3A]/45" aria-hidden />
                Facts &amp; assumptions
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-[#0B1F3A]/45 transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <div className="space-y-3 border-t border-black/[0.06] px-4 py-3 text-[12px] leading-relaxed text-[#0B1F3A]/80">
              <p>
                <span className="font-semibold text-[#0B1F3A]">Rates &amp; prices:</span> Illustrative only — not a live rate lock or quote. Model uses payment drift and price bands consistent with your inputs.
              </p>
              <p>
                <span className="font-semibold text-[#0B1F3A]">Rent:</span> Your selected monthly rent is treated as non-recoverable spend (0% equity).
              </p>
              <p>
                <span className="font-semibold text-[#0B1F3A]">Appreciation:</span> ~2.2%/yr on home value in the 5-yr equity illustration (not a guarantee).
              </p>
              <p className="rounded-lg bg-[#F7F9FC] px-3 py-2 font-mono text-[11px] text-[#0B1F3A]/85">
                Monthly impact ≈ rent ({formatCurrency(t.monthlyRentLost)}) + missed equity ({formatCurrency(t.monthlyMissedEquity)}) + drift ({formatCurrency(t.monthlyPriceDrift)}). Yearly ≈ monthly × 12.
              </p>
              <p className="text-[11px] text-[#0B1F3A]/55">
                +0.5% rate move ≈ {formatCurrency(Math.abs(t.marketSensitivity.ratePlusHalf.paymentDiff))}/mo payment shift (same loan size, illustrative). Price +3–5% band adds ~
                {formatCurrency(t.marketSensitivity.priceRiseBand.paymentLift)}/mo vs today (model).
              </p>
            </div>
          </details>

          <p className="mt-4 text-center text-[11px] text-[rgba(11,31,58,0.45)]">
            Readiness {reportCard.buyingReadinessScore}/100 · {reportCard.positionStatus}
          </p>

          {reportCard.identityLabel === "The Tier-Watcher" || reportCard.identityLabel === "The Hidden Buyer" ? (
            <p className="mt-3 rounded-xl border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.04)] px-4 py-3 text-center text-[12px] leading-relaxed text-[rgba(11,31,58,0.75)]">
              <Link
                to="/tools/credit-score-roi"
                className="font-semibold text-[#0B1F3A] underline decoration-[#D4AF37]/50 hover:text-[#B8941E]"
              >
                Find out what your credit score is worth →
              </Link>
            </p>
          ) : null}
          {reportCard.identityLabel === "The Tier-Watcher" ? (
            <p className="mt-3 rounded-xl border border-[rgba(212,175,55,0.15)] bg-[rgba(212,175,55,0.03)] px-4 py-3 text-center text-[12px] leading-relaxed text-[rgba(11,31,58,0.75)]">
              <Link
                to="/tools/wealth-tracker"
                className="font-semibold text-[#0B1F3A] underline decoration-[#D4AF37]/50 hover:text-[#B8941E]"
              >
                See the full 30-year wealth comparison (own vs. rent + opportunity cost) →
              </Link>
            </p>
          ) : null}
          {reportCard.identityLabel === "The Hidden Buyer" ? (
            <p className="mt-3 rounded-xl border border-[rgba(212,175,55,0.15)] bg-[rgba(212,175,55,0.03)] px-4 py-3 text-center text-[12px] leading-relaxed text-[rgba(11,31,58,0.75)]">
              <Link
                to="/tools/self-employed-qualifier"
                className="font-semibold text-[#0B1F3A] underline decoration-[#D4AF37]/50 hover:text-[#B8941E]"
              >
                See your real qualifying income (tax return vs. bank statement) →
              </Link>
            </p>
          ) : null}

          {reportCard.buyingReadinessScore >= 74 && reportCard.positionStatus === "Within Range" ? (
            <p className="mt-3 rounded-xl border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.04)] px-4 py-3 text-center text-[12px] leading-relaxed text-[rgba(11,31,58,0.75)]">
              Run the{" "}
              <Link
                to="/tools/conventional-vs-fha"
                className="font-semibold text-[#0B1F3A] underline decoration-[#D4AF37]/50 hover:text-[#B8941E]"
              >
                FHA vs. Conventional comparison
              </Link>{" "}
              — MI crossover, total cost, and refi strategy for your numbers.
            </p>
          ) : null}

          <button
            type="button"
            onClick={onReset}
            className="mt-3 w-full rounded-lg py-2.5 text-[13px] font-medium text-[#0B1F3A]/50 hover:text-[#0B1F3A]"
          >
            Start over
          </button>
        </div>
      </div>

      {/* 6 — Action panel (sticky bottom) */}
      <div className="shrink-0 border-t border-black/[0.08] bg-white/98 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_32px_rgba(11,31,58,0.06)] backdrop-blur-sm">
        <div className={`${PAGE_CONTENT_RAIL_CLASS} mx-auto flex max-w-4xl flex-col gap-2.5`}>
          <FlagshipCtaPrimary to="/contact" className="w-full justify-center text-center text-[15px]">
            See what buying looks like
          </FlagshipCtaPrimary>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center">
            <FlagshipTextLink to="/contact" className="text-[13px] font-semibold">
              Talk to an advisor
            </FlagshipTextLink>
            <span className="hidden text-[#0B1F3A]/25 sm:inline" aria-hidden>
              |
            </span>
            <FlagshipTextLink to="/contact" className="text-[13px] font-semibold">
              Get pre-approved
            </FlagshipTextLink>
          </div>
        </div>
      </div>
    </div>
  );
}
