import { motion } from "motion/react";
import { Link } from "react-router-dom";
import type { FinancialRealityOutcome } from "../../lib/financialReality/engine";
import { formatCurrency } from "../../lib/financialReality/engine";
import { QuizShareButton } from "./QuizShareButton";
import { ConsequenceTrackerPanel } from "./ConsequenceTrackerPanel";
import { DecisionVerdict } from "./DecisionVerdict";
import { FinancialRealityDeepDive } from "./FinancialRealityDeepDive";
import { IrreversibilityPanel } from "./IrreversibilityPanel";
import { PresentTensePanel } from "./PresentTensePanel";
import { MicDropPanel } from "./MicDropPanel";
import { ViralReportCard } from "./ViralReportCard";
import { FlagshipCtaPrimary } from "./FlagshipCta";

type Props = {
  outcome: FinancialRealityOutcome;
  onRetake: () => void;
};

export function FinancialRealityResult({ outcome, onRetake }: Props) {
  const {
    narrative,
    situationSummary,
    reportCard,
    identity,
    decision,
    consequenceTracker,
    irreversibility,
    presentTense,
    micDrop,
    consequence,
    consequenceBullets,
  } = outcome;
  const {
    diagnosisStatement,
    primaryConstraintLabel,
    primaryConstraintDetail,
  } = narrative;

  const annualRentGone = Math.round(consequence.monthly_loss_estimate * 12);

  const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  } as const;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-24 pb-16 md:space-y-32 md:pb-20">
      <motion.header {...fadeUp} className="text-center">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B8941E]">Your diagnosis</p>
        <h1 className="mt-4 font-heading text-[2.5rem] font-bold leading-[1.08] tracking-[-0.03em] text-[#0B1F3A] sm:text-[3rem] md:text-[3.5rem]">
          Here&apos;s what your numbers say — right now
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-[16px] leading-relaxed text-[rgba(11,31,58,0.65)] md:text-[17px]">
          Reality → consequence → pattern → action. One section at a time.
        </p>
      </motion.header>

      {/* Diagnosis report */}
      <motion.section {...fadeUp} className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-black/[0.05] bg-white p-6 shadow-[0_20px_56px_rgba(11,31,58,0.07)] transition-transform duration-300 hover:-translate-y-1 sm:col-span-2 md:p-8">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B8941E]">Your situation</p>
          <p className="mt-4 text-[17px] font-semibold leading-snug text-[#0B1F3A] md:text-[18px]">{situationSummary}</p>
        </div>
        <div className="rounded-2xl border border-black/[0.05] bg-white p-6 shadow-[0_20px_56px_rgba(11,31,58,0.07)] transition-transform duration-300 hover:-translate-y-1 md:p-8">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgba(11,31,58,0.45)]">What&apos;s actually happening</p>
          <p className="mt-3 font-heading text-[1.15rem] font-bold leading-snug text-[#0B1F3A] md:text-[1.25rem]">{diagnosisStatement}</p>
          <p className="mt-2 text-[14px] font-medium text-[rgba(11,31,58,0.65)] md:text-[15px]">{primaryConstraintLabel}</p>
        </div>
        <div className="rounded-2xl border border-black/[0.05] bg-[#F7F9FC] p-6 shadow-[0_12px_40px_rgba(11,31,58,0.05)] transition-transform duration-300 hover:-translate-y-1 md:p-8">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgba(11,31,58,0.45)]">What this means financially</p>
          <ul className="mt-3 space-y-2 text-[15px] font-medium leading-snug text-[#0B1F3A] md:text-[16px]">
            {consequenceBullets.slice(0, 2).map((line, i) => (
              <li key={i}>
                • <span className="font-bold text-[#D64545]">{line}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-black/[0.05] bg-white p-6 shadow-[0_20px_56px_rgba(11,31,58,0.07)] transition-transform duration-300 hover:-translate-y-1 sm:col-span-2 md:p-8">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[rgba(11,31,58,0.45)]">Where you stand vs most buyers</p>
          <p className="mt-3 text-[17px] font-semibold leading-snug text-[#0B1F3A] md:text-[18px]">{identity.identityHeadline}</p>
          <p className="mt-2 text-[14px] text-[rgba(11,31,58,0.65)] md:text-[15px]">
            Position: <span className="font-semibold text-[#B8941E]">{reportCard.positionStatus}</span> · Readiness{" "}
            <span className="font-semibold tabular-nums text-[#0B1F3A]">{reportCard.buyingReadinessScore}/100</span>
          </p>
          {reportCard.buyingReadinessScore < 55 ? (
            <p className="mt-4 rounded-xl border border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.06)] px-4 py-3 text-[13px] leading-relaxed text-[rgba(11,31,58,0.75)]">
              Also see:{" "}
              <Link to="/tools/true-cost-of-waiting" className="font-semibold text-[#0B1F3A] underline decoration-[#D4AF37]/50 hover:text-[#B8941E]">
                The True Cost of Waiting
              </Link>{" "}
              — understand the cost of a longer runway. Also explore:{" "}
              <Link to="/tools/buy-vs-rent" className="font-semibold text-[#0B1F3A] underline decoration-[#D4AF37]/50 hover:text-[#B8941E]">
                Buy vs. Rent — the full wealth comparison
              </Link>
              .
            </p>
          ) : (
            <p className="mt-4 rounded-xl border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.04)] px-4 py-3 text-[13px] leading-relaxed text-[rgba(11,31,58,0.75)]">
              Also explore:{" "}
              <Link to="/tools/buy-vs-rent" className="font-semibold text-[#0B1F3A] underline decoration-[#D4AF37]/50 hover:text-[#B8941E]">
                Buy vs. Rent — the full wealth comparison
              </Link>
              .
            </p>
          )}
          {reportCard.buyingReadinessScore < 80 ? (
            <p className="mt-3 rounded-xl border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.04)] px-4 py-3 text-[13px] leading-relaxed text-[rgba(11,31,58,0.75)]">
              See how much your credit score is worth in dollars:{" "}
              <Link
                to="/tools/credit-score-roi"
                className="font-semibold text-[#0B1F3A] underline decoration-[#D4AF37]/50 hover:text-[#B8941E]"
              >
                Credit Score ROI Calculator →
              </Link>
            </p>
          ) : null}
          {reportCard.buyingReadinessScore >= 80 ? (
            <p className="mt-3 rounded-xl border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.04)] px-4 py-3 text-[13px] leading-relaxed text-[rgba(11,31,58,0.75)]">
              See how much wealth homeownership could build in your situation:{" "}
              <Link
                to="/tools/wealth-tracker"
                className="font-semibold text-[#0B1F3A] underline decoration-[#D4AF37]/50 hover:text-[#B8941E]"
              >
                Mortgage Wealth Tracker — 30-year net worth comparison →
              </Link>
            </p>
          ) : null}
          {reportCard.buyingReadinessScore >= 44 && reportCard.buyingReadinessScore <= 70 ? (
            <p className="mt-3 rounded-xl border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.04)] px-4 py-3 text-[13px] leading-relaxed text-[rgba(11,31,58,0.75)]">
              See your buying power trajectory:{" "}
              <Link
                to="/tools/homebuying-power-map"
                className="font-semibold text-[#0B1F3A] underline decoration-[#D4AF37]/50 hover:text-[#B8941E]"
              >
                Homebuying Power Map →
              </Link>{" "}
              — today, 90 days, 6 and 12 months, mapped to real MD-DC-VA neighborhoods.
            </p>
          ) : null}
          <p className="mt-3 rounded-xl border border-[rgba(212,175,55,0.15)] bg-[rgba(212,175,55,0.03)] px-4 py-3 text-[13px] leading-relaxed text-[rgba(11,31,58,0.75)]">
            Self-employed, 1099, or uneven income?{" "}
            <Link
              to="/tools/self-employed-qualifier"
              className="font-semibold text-[#0B1F3A] underline decoration-[#D4AF37]/50 hover:text-[#B8941E]"
            >
              Calculate your self-employed qualifying income →
            </Link>
          </p>
          {reportCard.buyingReadinessScore >= 68 ? (
            <p className="mt-3 rounded-xl border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.04)] px-4 py-3 text-[13px] leading-relaxed text-[rgba(11,31,58,0.75)]">
              If you&apos;re 62+ and weighing how home equity fits retirement:{" "}
              <Link
                to="/tools/reverse-mortgage-planner"
                className="font-semibold text-[#0B1F3A] underline decoration-[#D4AF37]/50 hover:text-[#B8941E]"
              >
                Reverse Mortgage Retirement Planner
              </Link>{" "}
              — payout strategies, income gap, and heir inheritance in one place.
            </p>
          ) : null}
          {reportCard.positionStatus === "Within Range" ? (
            <p className="mt-3 rounded-xl border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.04)] px-4 py-3 text-[13px] leading-relaxed text-[rgba(11,31,58,0.75)]">
              Already own or planning to tap equity?{" "}
              <Link
                to="/tools/heloc-planner"
                className="font-semibold text-[#0B1F3A] underline decoration-[#D4AF37]/50 hover:text-[#B8941E]"
              >
                HELOC Smart Planner
              </Link>{" "}
              — payment cliff, rate scenarios, and HELOC vs home equity loan vs cash-out refi.
            </p>
          ) : null}
          {reportCard.buyingReadinessScore >= 74 && reportCard.positionStatus === "Within Range" ? (
            <p className="mt-3 rounded-xl border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.04)] px-4 py-3 text-[13px] leading-relaxed text-[rgba(11,31,58,0.75)]">
              See how Conventional compares to FHA for your profile:{" "}
              <Link
                to="/tools/conventional-vs-fha"
                className="font-semibold text-[#0B1F3A] underline decoration-[#D4AF37]/50 hover:text-[#B8941E]"
              >
                Conventional vs. FHA — full cost comparison
              </Link>
              .
            </p>
          ) : null}
          {reportCard.buyingReadinessScore >= 80 ? (
            <p className="mt-3 rounded-xl border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.04)] px-4 py-3 text-[13px] leading-relaxed text-[rgba(11,31,58,0.75)]">
              Under contract? Use the{" "}
              <Link
                to="/tools/rate-lock-engine"
                className="font-semibold text-[#0B1F3A] underline decoration-[#D4AF37]/50 hover:text-[#B8941E]"
              >
                Rate Lock Decision Engine →
              </Link>{" "}
              — see your downside vs. upside from floating in real dollars before you lock or float.
            </p>
          ) : null}
        </div>
      </motion.section>

      {/* CTA #1 — after first insight */}
      <motion.div {...fadeUp} className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <FlagshipCtaPrimary to="/contact">See what this means for you</FlagshipCtaPrimary>
      </motion.div>

      {/* Social proof (trust) */}
      <motion.section
        {...fadeUp}
        className="rounded-2xl border border-black/[0.05] bg-white px-8 py-8 text-center shadow-[0_12px_40px_rgba(11,31,58,0.06)] md:px-10 md:py-10"
      >
        <p className="font-sans text-[13px] font-medium leading-snug text-[rgba(11,31,58,0.72)] md:text-[14px]">
          Trusted by homebuyers making smarter decisions.
        </p>
        <p className="mt-3 text-[15px] text-[#D4AF37]" aria-hidden>
          ★★★★★
        </p>
        <p className="mt-2 font-sans text-[13px] text-[rgba(11,31,58,0.55)]">Trusted guidance. No pressure.</p>
      </motion.section>

      {/* Loss moment */}
      <motion.section
        {...fadeUp}
        className="rounded-2xl border border-[rgba(214,69,69,0.18)] bg-[rgba(214,69,69,0.05)] px-8 py-10 shadow-[0_16px_48px_rgba(214,69,69,0.08)] md:px-10 md:py-12"
      >
        <p className="font-heading text-[1.5rem] font-bold leading-snug text-[#0B1F3A] md:text-[1.65rem]">
          You&apos;ve already spent ~<span className="tabular-nums font-bold text-[#D64545]">{formatCurrency(annualRentGone)}</span> renting — and kept{" "}
          <span className="font-semibold text-[#D64545]">none</span> of it
        </p>
        <ul className="mt-6 space-y-3 text-[15px] font-semibold leading-snug text-[#0B1F3A] md:text-[16px]">
          <li>That money is gone.</li>
          <li>You don&apos;t get it back.</li>
          <li>Every month repeats this pattern.</li>
        </ul>
      </motion.section>

      {/* CTA #2 — mid page after loss */}
      <motion.div {...fadeUp} className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <FlagshipCtaPrimary to="/contact">Run your numbers</FlagshipCtaPrimary>
      </motion.div>

      <ConsequenceTrackerPanel tracker={consequenceTracker} />

      <PresentTensePanel data={presentTense} />

      <IrreversibilityPanel data={irreversibility} />

      {/* Pattern / peer behavior */}
      <motion.section
        {...fadeUp}
        className="rounded-2xl border border-black/[0.05] bg-white px-8 py-8 shadow-[0_12px_40px_rgba(11,31,58,0.06)] md:px-10 md:py-10"
      >
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgba(11,31,58,0.45)]">You&apos;re not alone</p>
        <ul className="mt-4 space-y-3 text-[15px] font-semibold leading-snug text-[#0B1F3A] md:text-[16px]">
          <li>• Most buyers wait longer than they planned.</li>
          <li>• Many delay hoping rates drop.</li>
          <li>• Some never end up buying at all.</li>
        </ul>
      </motion.section>

      {/* Decision engine */}
      <motion.section {...fadeUp} className="space-y-6">
        <div className="rounded-2xl border border-black/[0.05] bg-white px-8 py-10 text-center shadow-[0_20px_56px_rgba(11,31,58,0.08)] md:px-10 md:py-12">
          <p className="font-heading text-[1.35rem] font-bold leading-snug text-[#0B1F3A] md:text-[1.5rem] md:leading-snug">
            Based on your situation, waiting is costing you more than you think
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <FlagshipCtaPrimary to="/contact">Get my strategy</FlagshipCtaPrimary>
          </div>
        </div>
        <DecisionVerdict decision={decision} />
      </motion.section>

      {/* Viral + share */}
      <motion.section {...fadeUp} className="space-y-6">
        <div className="mx-auto max-w-md rounded-2xl border border-black/[0.05] bg-white px-6 py-10 text-center shadow-[0_20px_56px_rgba(11,31,58,0.08)] md:px-8">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B8941E]">Share this line</p>
          <p className="mt-4 font-heading text-[1.2rem] font-bold leading-snug text-[#0B1F3A] md:text-[1.35rem]">
            I just realized I&apos;ve spent ~<span className="font-semibold text-[#D64545]">{formatCurrency(annualRentGone)}</span> renting — and built nothing
          </p>
        </div>
        <ViralReportCard card={reportCard} />
        <p className="text-center font-sans text-[11px] uppercase tracking-[0.14em] text-[rgba(11,31,58,0.45)]">Screenshot the card</p>
        <div className="flex justify-center">
          <QuizShareButton theme="light" />
        </div>
      </motion.section>

      {/* CTA #3 — final */}
      <motion.div {...fadeUp} className="flex flex-col items-center gap-3">
        <FlagshipCtaPrimary to="/contact">Get my strategy</FlagshipCtaPrimary>
        <p className="text-center font-sans text-[13px] text-[rgba(11,31,58,0.55)]">
          Book a short call — we&apos;ll walk your numbers with you. No pressure.
        </p>
      </motion.div>

      <details className="group rounded-2xl border border-black/[0.05] bg-white shadow-[0_12px_40px_rgba(11,31,58,0.06)] open:shadow-[0_16px_48px_rgba(11,31,58,0.08)]">
        <summary className="cursor-pointer list-none px-6 py-5 font-heading text-[15px] font-semibold text-[#0B1F3A] marker:content-none [&::-webkit-details-marker]:hidden">
          Deeper breakdown — beliefs, numbers, next steps
        </summary>
        <FinancialRealityDeepDive outcome={outcome} />
      </details>

      <MicDropPanel micDrop={micDrop} />

      <p className="text-center text-[11px] leading-relaxed text-[rgba(11,31,58,0.45)]">
        Illustrative estimates only — not a loan approval, commitment, or tax advice.
      </p>

      <button
        type="button"
        onClick={onRetake}
        className="w-full rounded-xl border border-black/[0.12] bg-white py-4 text-[14px] font-medium text-[rgba(11,31,58,0.7)] shadow-sm transition-all hover:-translate-y-0.5 hover:border-black/[0.18] hover:text-[#0B1F3A] hover:shadow-md"
      >
        Start over
      </button>
    </div>
  );
}
