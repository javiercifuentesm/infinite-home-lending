import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { formatCurrency, type FinancialRealityOutcome } from "../../lib/financialReality/engine";
import { computeFromQuickInputs, normalizeRentMonthly } from "../../lib/financialReality/quickFlow";
import { useAnimatedNumber } from "../../hooks/useAnimatedNumber";
import { FlagshipCtaPrimaryButton, FlagshipCtaSecondary, FlagshipTextLink } from "./FlagshipCta";

type Props = {
  onComplete: (outcome: FinancialRealityOutcome) => void;
};

const STAT_LINES = [
  "Average renter spends ~$18,000/year with no return",
  "Home values historically rise over time",
  "Waiting doesn’t pause cost — it compounds it",
] as const;

const RENT_PRESETS = [1600, 2000, 2500, 3200, 4000, 4800] as const;

const INCOME_OPTIONS = [
  { label: "Under $75K", idx: 0 },
  { label: "$75K–$125K", idx: 1 },
  { label: "$125K–$200K", idx: 2 },
  { label: "$200K+", idx: 3 },
] as const;

const TIMING_OPTIONS = [
  { label: "Now", idx: 0 },
  { label: "3–6 months", idx: 1 },
  { label: "6–12 months", idx: 2 },
  { label: "Just exploring", idx: 3 },
] as const;

const sectionPad = "py-24 md:py-32 lg:py-36";
const card =
  "rounded-2xl border border-black/[0.05] bg-white p-6 shadow-[0_12px_40px_rgba(11,31,58,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(11,31,58,0.09)] md:p-8";

function LiveConsequencePulse({ outcome }: { outcome: FinancialRealityOutcome }) {
  const m = outcome.consequenceTracker.totalMonthlyImpact;
  const y = outcome.consequenceTracker.yearlyLossApprox ?? Math.round(m * 12);
  const runKey = Math.round(m / 50);
  const animM = useAnimatedNumber(m, 550, runKey, true);
  const animY = useAnimatedNumber(y, 650, runKey + 1, true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-[#D64545]/15 bg-[rgba(214,69,69,0.05)] px-6 py-7 sm:px-8 sm:py-8"
    >
      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D64545]/90">Live read</p>
      <p className="mt-4 font-heading text-[1.35rem] font-bold leading-snug text-[#0B1F3A] sm:text-[1.5rem]">
        You&apos;re currently losing ~
        <span className="tabular-nums font-bold text-[#B83838]">{formatCurrency(Math.round(animM))}</span>/month
      </p>
      <p className="mt-2 font-heading text-[1.1rem] font-semibold text-[#0B1F3A] sm:text-[1.15rem]">
        That&apos;s ~<span className="tabular-nums font-bold text-[#B83838]">{formatCurrency(Math.round(animY))}</span>/year
      </p>
      <p className="mt-4 text-[16px] font-medium leading-snug text-[#0B1F3A]/65 md:text-[17px]">
        That&apos;s money building zero ownership.
      </p>
    </motion.div>
  );
}

export function HomebuyerConversionFlow({ onComplete }: Props) {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [rent, setRent] = useState<number | null>(null);
  const [incomeIdx, setIncomeIdx] = useState<number | null>(null);
  const [timingIdx, setTimingIdx] = useState<number | null>(null);
  const inputsRef = useRef<HTMLDivElement>(null);

  const scrollToInputs = useCallback(() => {
    inputsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleStart = useCallback(() => {
    setStarted(true);
    window.setTimeout(scrollToInputs, 80);
  }, [scrollToInputs]);

  const previewOutcome = useMemo(() => {
    if (rent == null || incomeIdx == null || timingIdx == null) return null;
    return computeFromQuickInputs(rent, incomeIdx, timingIdx);
  }, [rent, incomeIdx, timingIdx]);

  const goReveal = useCallback(() => {
    if (rent == null || incomeIdx == null || timingIdx == null) return;
    onComplete(computeFromQuickInputs(rent, incomeIdx, timingIdx));
  }, [rent, incomeIdx, timingIdx, onComplete]);

  const pct = started ? ((step + 1) / 3) * 100 : 0;

  useEffect(() => {
    if (step === 1 && rent != null) scrollToInputs();
    if (step === 2 && incomeIdx != null) scrollToInputs();
  }, [step, rent, incomeIdx, scrollToInputs]);

  const btnBase =
    "rounded-xl border px-3 py-3.5 text-[14px] font-semibold transition-colors text-[#0B1F3A]";
  const btnIdle = "border-black/[0.08] bg-[#F7F9FC] hover:border-[#0B1F3A]/15";
  const btnActive = "border-[#D4AF37]/60 bg-[#D4AF37]/10 ring-1 ring-[#D4AF37]/25";

  return (
    <div className="w-full">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`mx-auto flex min-h-[68vh] max-w-4xl flex-col justify-center px-2 ${sectionPad}`}
      >
        <p className="text-center font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">Free check</p>
        <h1 className="mt-6 text-center font-heading text-[2.5rem] font-bold leading-[1.08] tracking-[-0.03em] text-[#0B1F3A] sm:text-[3rem] md:text-[3.25rem] lg:text-[3.5rem]">
          You might already be losing money by waiting to buy
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-center text-[17px] font-normal leading-relaxed text-[#0B1F3A]/65 md:text-[18px]">
          Most people don&apos;t realize it until it&apos;s too late
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className={`mx-auto max-w-5xl px-2 ${sectionPad}`}
      >
        <div className="grid gap-5 sm:grid-cols-3">
          {STAT_LINES.map((line) => (
            <div key={line} className={`${card} px-5 py-7 text-center`}>
              <Sparkles className="mx-auto h-5 w-5 text-[#D4AF37]" strokeWidth={1.75} aria-hidden />
              <p className="mt-4 text-[15px] font-semibold leading-snug text-[#0B1F3A] md:text-[16px]">{line}</p>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-center gap-5">
          <button
            type="button"
            onClick={handleStart}
            className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-[#0B1F3A] px-10 py-3.5 text-[16px] font-bold text-white shadow-[0_8px_28px_rgba(11,31,58,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(11,31,58,0.28)] active:translate-y-0"
          >
            Find out in 30 seconds
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" strokeWidth={2} aria-hidden />
          </button>
          <FlagshipTextLink to="/contact">See what this means for you →</FlagshipTextLink>
        </div>
      </motion.section>

      <div ref={inputsRef} id="homebuyer-quick-input" className="mx-auto max-w-lg scroll-mt-28 px-2 pb-28 md:pb-36">
        {!started ? (
          <p className="text-center text-[14px] font-medium text-[#0B1F3A]/45">Tap the navy button above to begin.</p>
        ) : (
          <div className={card}>
            <div className="mb-8">
              <div className="flex items-center justify-between gap-3">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0B1F3A]/45">
                  Step {step + 1} of 3
                </p>
                <p className="text-[13px] font-medium text-[#0B1F3A]/45">One tap each</p>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#0B1F3A]/10">
                <motion.div
                  className="h-full rounded-full bg-[#D4AF37]"
                  initial={false}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="rent"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="font-heading text-[1.65rem] font-bold leading-snug text-[#0B1F3A] md:text-[1.85rem]">
                    What&apos;s your monthly rent?
                  </h2>
                  <p className="mt-2 text-[15px] text-[#0B1F3A]/65 md:text-[16px]">Pick the closest number.</p>
                  <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                    {RENT_PRESETS.map((n) => {
                      const active = rent === n;
                      return (
                        <button
                          key={n}
                          type="button"
                          onClick={() => {
                            setRent(n);
                            setStep(1);
                          }}
                          className={`${btnBase} ${active ? btnActive : btnIdle}`}
                        >
                          {formatCurrency(n)}/mo
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="income"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="text-[13px] font-medium text-[#0B1F3A]/55 hover:text-[#0B1F3A]"
                  >
                    ← Back
                  </button>
                  <h2 className="mt-4 font-heading text-[1.65rem] font-bold leading-snug text-[#0B1F3A] md:text-[1.85rem]">
                    Household income (approx.)?
                  </h2>
                  {rent != null && (
                    <p className="mt-3 rounded-lg border border-[#0B1F3A]/10 bg-[#F7F9FC] px-3 py-2.5 text-[13px] font-medium text-[#0B1F3A]/80">
                      You ship ~{formatCurrency(normalizeRentMonthly(rent) * 12)}/year in rent — $0 equity back.
                    </p>
                  )}
                  <ul className="mt-6 space-y-2.5">
                    {INCOME_OPTIONS.map((o) => (
                      <li key={o.idx}>
                        <button
                          type="button"
                          onClick={() => {
                            setIncomeIdx(o.idx);
                            setStep(2);
                          }}
                          className="w-full rounded-xl border border-black/[0.06] bg-white px-4 py-3.5 text-left text-[14px] font-semibold text-[#0B1F3A] shadow-sm transition-all hover:border-[#D4AF37]/40"
                        >
                          {o.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="timing"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setTimingIdx(null);
                    }}
                    className="text-[13px] font-medium text-[#0B1F3A]/55 hover:text-[#0B1F3A]"
                  >
                    ← Back
                  </button>
                  <h2 className="mt-4 font-heading text-[1.65rem] font-bold leading-snug text-[#0B1F3A] md:text-[1.85rem]">
                    When are you thinking about buying?
                  </h2>
                  {incomeIdx != null && (
                    <p className="mt-3 text-[15px] font-medium text-[#0B1F3A]/65">Noted — rent is locked against this income band.</p>
                  )}
                  <ul className="mt-6 space-y-2.5">
                    {TIMING_OPTIONS.map((o) => (
                      <li key={o.idx}>
                        <button
                          type="button"
                          onClick={() => setTimingIdx(o.idx)}
                          className={`w-full rounded-xl border px-4 py-3.5 text-left text-[14px] font-semibold transition-colors ${btnBase} ${
                            timingIdx === o.idx ? btnActive : `${btnIdle} border-black/[0.06] bg-white shadow-sm`
                          }`}
                        >
                          {o.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            {timingIdx != null && rent != null && incomeIdx != null && previewOutcome && (
              <div className="mt-10 space-y-8 border-t border-black/[0.06] pt-10">
                <LiveConsequencePulse outcome={previewOutcome} />
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                  <FlagshipCtaPrimaryButton onClick={goReveal}>Reveal my full diagnosis</FlagshipCtaPrimaryButton>
                  <FlagshipCtaSecondary to="/contact">Get my strategy</FlagshipCtaSecondary>
                </div>
                <p className="text-center text-[13px] text-[#0B1F3A]/45">Illustrative — not a quote or approval.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
