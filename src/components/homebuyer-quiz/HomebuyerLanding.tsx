import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import type { FinancialRealityOutcome } from "../../lib/financialReality/engine";
import { formatCurrency } from "../../lib/financialReality/engine";
import { computeFromQuickInputs } from "../../lib/financialReality/quickFlow";
import { PAGE_CONTENT_RAIL_CLASS } from "../../constants/layout";
import { FlagshipCtaPrimary } from "./FlagshipCta";

/** Default timing: 3–6 months (index 1) — keeps hero to 2 inputs. */
const DEFAULT_TIMING_IDX = 1;

const RENT_PRESETS = [1600, 2000, 2500, 3200, 4000, 4800] as const;
const INCOME_OPTIONS = [
  { label: "Under $75K", idx: 0 },
  { label: "$75K–$125K", idx: 1 },
  { label: "$125K–$200K", idx: 2 },
  { label: "$200K+", idx: 3 },
] as const;

const sectionClass = `${PAGE_CONTENT_RAIL_CLASS} mx-auto max-w-3xl px-5 py-16 md:py-20`;

/**
 * Conversion-first landing: 5 sections, hero inputs, results inline, one contact CTA.
 */
export function HomebuyerLanding() {
  const resultRef = useRef<HTMLDivElement>(null);
  const [rent, setRent] = useState<number | null>(null);
  const [incomeIdx, setIncomeIdx] = useState<number | null>(null);
  const [outcome, setOutcome] = useState<FinancialRealityOutcome | null>(null);
  const [busy, setBusy] = useState(false);

  const canSubmit = rent != null && incomeIdx != null;

  const run = useCallback(() => {
    if (!canSubmit || rent == null || incomeIdx == null) return;
    setBusy(true);
    window.setTimeout(() => {
      const o = computeFromQuickInputs(rent, incomeIdx, DEFAULT_TIMING_IDX);
      setOutcome(o);
      setBusy(false);
      requestAnimationFrame(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }, 280);
  }, [canSubmit, incomeIdx, rent]);

  const btnPreset = (active: boolean) =>
    `rounded-xl border px-3 py-3 text-center text-[14px] font-semibold transition-colors sm:text-[15px] ${
      active
        ? "border-[#D4AF37]/60 bg-[#D4AF37]/10 text-[#0B1F3A] ring-1 ring-[#D4AF37]/25"
        : "border-black/[0.08] bg-white text-[#0B1F3A] hover:border-[#0B1F3A]/12"
    }`;

  return (
    <div className="min-h-screen bg-[#F7F9FC] font-sans text-[#0B1F3A]">
      {/* SECTION 1 — HERO */}
      <section className="border-b border-black/[0.05] bg-white">
        <div className={`${PAGE_CONTENT_RAIL_CLASS} pt-28 pb-16 sm:pt-32 md:min-h-[88vh] md:pb-24 md:pt-36`}>
          <div className="mx-auto max-w-2xl">
            <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link
                to="/smart-tools"
                className="inline-flex items-center gap-2 text-[13px] font-medium text-[#0B1F3A]/55 transition-colors hover:text-[#0B1F3A]"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                Smart tools
              </Link>
              <Link
                to="/tools/homebuying-power-map"
                className="text-[12px] font-medium text-[#0B1F3A]/70 underline decoration-[#D4AF37]/45 transition-colors hover:text-[#B8941E]"
              >
                Map your path to homeownership (buying power over time) →
              </Link>
            </div>

            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D64545]/90">Free check</p>
            <h1 className="mt-4 font-heading text-[2.25rem] font-bold leading-[1.08] tracking-[-0.03em] text-[#0B1F3A] sm:text-[2.75rem] md:text-[3.25rem]">
              Waiting to buy is quietly draining your money
            </h1>
            <p className="mt-5 text-[17px] leading-relaxed text-[rgba(11,31,58,0.68)] md:text-[18px]">
              Rent never comes back. See what you&apos;re losing — in one number.
            </p>

            <div className="mt-12 space-y-8">
              <div>
                <label className="text-[13px] font-semibold text-[#0B1F3A]">Monthly rent</label>
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-3">
                  {RENT_PRESETS.map((n) => (
                    <button key={n} type="button" onClick={() => setRent(n)} className={btnPreset(rent === n)}>
                      {formatCurrency(n)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[#0B1F3A]">Household income (approx.)</label>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {INCOME_OPTIONS.map((o) => (
                    <button key={o.idx} type="button" onClick={() => setIncomeIdx(o.idx)} className={btnPreset(incomeIdx === o.idx)}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12">
              <button
                type="button"
                onClick={run}
                disabled={!canSubmit || busy}
                className="w-full min-h-[56px] rounded-xl border-2 border-[#0B1F3A] bg-white px-8 text-[17px] font-bold text-[#0B1F3A] shadow-sm transition-all hover:bg-[#0B1F3A] hover:text-white disabled:pointer-events-none disabled:opacity-40 sm:w-auto sm:min-w-[280px]"
              >
                {busy ? "…" : "Show my number"}
              </button>
              <p className="mt-4 text-center text-[12px] text-[rgba(11,31,58,0.45)] sm:text-left">
                Illustrative model only — not a loan quote or approval.
              </p>
            </div>
          </div>
        </div>
      </section>

      {outcome && (
        <>
          {/* SECTION 2 — RESULT */}
          <section id="result" ref={resultRef} className="scroll-mt-8 border-b border-black/[0.05] bg-[#F7F9FC]">
            <div className={sectionClass}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-center font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D64545]/90">Your result</p>
                <p className="mx-auto mt-6 max-w-xl text-center font-heading text-[clamp(2.5rem,8vw,4rem)] font-bold leading-none tabular-nums tracking-tight text-[#D64545]">
                  {formatCurrency(outcome.consequenceTracker.totalMonthlyImpact)}
                  <span className="text-[0.45em] font-bold text-[#D64545]/90">/mo</span>
                </p>
                <p className="mx-auto mt-8 max-w-xl text-center text-[18px] font-medium leading-relaxed text-[#0B1F3A] md:text-[20px]">
                  {outcome.presentTense.presentRealityHeadline}
                </p>
                <p className="mx-auto mt-4 max-w-lg text-center text-[15px] leading-relaxed text-[rgba(11,31,58,0.65)]">
                  ~{formatCurrency(outcome.consequenceTracker.yearlyLossApprox)} a year walking out the door — illustrative combined leak (rent, drift, missed equity).
                </p>
                <p className="mx-auto mt-6 max-w-lg text-center text-[13px] leading-relaxed text-[rgba(11,31,58,0.6)]">
                  Want the full 30-year wealth comparison (including opportunity cost)?{" "}
                  <Link
                    to="/tools/wealth-tracker"
                    className="font-semibold text-[#0B1F3A] underline decoration-[#D4AF37]/45 hover:text-[#B8941E]"
                  >
                    Mortgage Wealth Tracker →
                  </Link>
                </p>
              </motion.div>
            </div>
          </section>

          {/* SECTION 3 — SIMPLE VISUAL (2 blocks) */}
          <section className="border-b border-black/[0.05] bg-white">
            <div className={sectionClass}>
              <p className="text-center font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0B1F3A]/45">Where your money goes</p>
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#D64545]/20 bg-[rgba(214,69,69,0.06)] p-6 text-center shadow-sm">
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-[#D64545]/90">Rent (monthly)</p>
                  <p className="mt-3 font-heading text-[2rem] font-bold tabular-nums text-[#D64545] sm:text-[2.25rem]">
                    {formatCurrency(outcome.consequence.monthly_loss_estimate)}
                  </p>
                  <p className="mt-2 text-[13px] text-[rgba(11,31,58,0.6)]">100% leaves — $0 equity</p>
                </div>
                <div className="rounded-2xl border border-black/[0.08] bg-[#F7F9FC] p-6 text-center shadow-sm">
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-[#0B1F3A]/45">Wealth from rent</p>
                  <p className="mt-3 font-heading text-[2rem] font-bold tabular-nums text-[#0B1F3A]/35 sm:text-[2.25rem]">$0</p>
                  <p className="mt-2 text-[13px] text-[rgba(11,31,58,0.55)]">Same next month. And the next.</p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4 — LOSS FRAMING */}
          <section className="border-b border-black/[0.05] bg-[#0B1F3A] text-white">
            <div className={sectionClass}>
              <p className="text-center font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]/90">Reality check</p>
              <ul className="mx-auto mt-8 max-w-xl space-y-4 text-[17px] font-semibold leading-snug sm:text-[18px]">
                {outcome.consequenceBullets.slice(0, 4).map((line, i) => (
                  <li key={i} className="flex gap-3 border-l-2 border-[#D64545] pl-4">
                    <span className="text-[#D64545]">—</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* SECTION 5 — TRUST + ONE CTA */}
          <section className="bg-white pb-24 pt-16 md:pb-32 md:pt-20">
            <div className={sectionClass}>
              <details className="group rounded-2xl border border-black/[0.06] bg-[#F7F9FC] open:bg-[#F7F9FC]">
                <summary className="cursor-pointer list-none px-6 py-5 font-heading text-[15px] font-semibold text-[#0B1F3A] marker:content-none [&::-webkit-details-marker]:hidden">
                  Facts &amp; assumptions
                </summary>
                <div className="space-y-3 border-t border-black/[0.06] px-6 pb-6 pt-4 text-[13px] leading-relaxed text-[rgba(11,31,58,0.75)]">
                  <p>
                    Illustrative model using your rent and income band. Not a credit pull, pre-approval, or live rate. Combined monthly impact includes rent, payment drift, and missed equity as modeled — not a guarantee.
                  </p>
                  <p>
                    Home price and rate paths are simplified; actual costs vary by market, loan product, and timing.
                  </p>
                </div>
              </details>

              <div className="mt-12 rounded-2xl border border-black/[0.06] bg-white px-8 py-10 text-center shadow-[0_16px_48px_rgba(11,31,58,0.06)]">
                <p className="text-[15px] text-[rgba(11,31,58,0.72)]">
                  &ldquo;Finally saw the real cost of waiting — not scary, just honest.&rdquo;
                </p>
                <p className="mt-4 text-[14px] font-semibold text-[#0B1F3A]">— Homebuyer, CA</p>
                <p className="mt-2 text-[#D4AF37]" aria-hidden>
                  ★★★★★
                </p>
              </div>

              <div className="mt-14 flex flex-col items-center gap-4">
                <p className="max-w-md text-center text-[15px] font-medium text-[rgba(11,31,58,0.7)]">
                  Clear next step: see what buying could look like with your numbers — no pressure.
                </p>
                <FlagshipCtaPrimary to="/contact" className="min-h-[56px] px-10 text-[17px]">
                  Get my strategy
                </FlagshipCtaPrimary>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
