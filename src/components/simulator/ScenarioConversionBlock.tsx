import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check, X } from "lucide-react";
import type { SimulatorPurchaseTimeline } from "../../lib/simulatorLeadPayload";
import { EASE_PREMIUM } from "../../lib/motionConfig";
import {
  SimulatorConversionProvider,
  useSimulatorConversion,
  DEFER_STORAGE_KEY,
} from "./SimulatorConversionContext";
import { ConversionPanelScenarioSummary } from "./ConversionPanelScenarioSummary";

export { SimulatorConversionProvider, DEFER_STORAGE_KEY };

const TIMELINE_OPTIONS: { value: SimulatorPurchaseTimeline; label: string }[] = [
  { value: "exploring", label: "Just exploring" },
  { value: "3-6-months", label: "3–6 months" },
  { value: "buying-soon", label: "Buying soon" },
];

/** Slide-in panel — sole place for lead capture fields. */
export function SimulatorConversionSlideIn() {
  const {
    open,
    sent,
    loading,
    error,
    firstName,
    setFirstName,
    email,
    setEmail,
    phone,
    setPhone,
    timeline,
    setTimeline,
    closeReview,
    submit,
    continueExploring,
    reducedMotion,
    payload,
  } = useSimulatorConversion();

  const modalRoot = typeof document !== "undefined" ? document.body : null;
  const backdropTransition = { duration: reducedMotion ? 0 : 0.22 };
  const panelTransition = reducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 400, damping: 36, mass: 0.88 };

  if (!modalRoot) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="conversion-panel-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={backdropTransition}
          className="fixed inset-0 z-[70] flex justify-end"
        >
          <div
            className="absolute inset-0 bg-[#0f172a]/28 backdrop-blur-[2px]"
            onClick={() => !loading && closeReview()}
            aria-hidden
          />
          <motion.aside
            initial={reducedMotion ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { x: "100%" }}
            transition={panelTransition}
            className="
              relative z-[71] flex h-[100dvh] w-full max-w-full flex-col
              bg-white shadow-[-10px_0_40px_rgba(15,23,42,0.1)]
              sm:max-w-[min(100%,26rem)] lg:max-w-[27.5rem]
            "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100/90 px-5 py-4 sm:px-6 sm:py-5">
              <div className="min-w-0 pr-2">
                <h2
                  id="conversion-panel-title"
                  className="font-heading font-semibold text-navy text-lg sm:text-xl tracking-[-0.02em] leading-snug"
                >
                  Let&apos;s take a closer look at your scenario
                </h2>
                <p className="mt-2 text-[13px] sm:text-sm text-slate-600 leading-relaxed">
                  An advisor will review your scenario, validate the numbers, and show how this structure
                  would translate into a real approval.
                </p>
              </div>
              <button
                type="button"
                onClick={() => !loading && closeReview()}
                className="shrink-0 rounded-[4px] p-2 text-slate-400 hover:text-navy hover:bg-slate-50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6 sm:py-6">
              {!sent ? (
                <form onSubmit={submit} className="space-y-5">
                  <ConversionPanelScenarioSummary payload={payload} />
                  <div className="space-y-1.5">
                    <label htmlFor="conv-first" className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      First name
                    </label>
                    <input
                      id="conv-first"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Alex"
                      className="w-full min-h-[48px] bg-white border border-slate-200/90 rounded-[4px] px-4 text-sm font-medium text-navy placeholder:text-slate-300 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200/80 transition-shadow"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="conv-email" className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Email
                    </label>
                    <input
                      id="conv-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full min-h-[48px] bg-white border border-slate-200/90 rounded-[4px] px-4 text-sm font-medium text-navy placeholder:text-slate-300 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200/80 transition-shadow"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="conv-phone" className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Phone <span className="text-slate-400 font-normal normal-case tracking-normal">(optional)</span>
                    </label>
                    <input
                      id="conv-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 555-5555"
                      className="w-full min-h-[48px] bg-white border border-slate-200/90 rounded-[4px] px-4 text-sm font-medium text-navy placeholder:text-slate-300 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200/80 transition-shadow"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="conv-timeline" className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Timeline
                    </label>
                    <select
                      id="conv-timeline"
                      name="timeline"
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value as SimulatorPurchaseTimeline)}
                      className="w-full min-h-[48px] bg-white border border-slate-200/90 rounded-[4px] px-4 text-sm font-medium text-navy focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200/80"
                    >
                      {TIMELINE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {error && (
                    <p className="text-sm text-red-800/90" role="alert">
                      {error}
                    </p>
                  )}

                  {/* Trust — directly above submit */}
                  <div className="rounded-[4px] border border-slate-200/70 bg-white px-4 py-4 space-y-3 ring-1 ring-slate-100/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                    <p className="text-[13px] text-navy/90 leading-snug font-medium">
                      No pressure — just a professional review of your scenario
                    </p>
                    <p className="text-[13px] text-slate-600 leading-relaxed">
                      We never run credit without your permission
                    </p>
                    <p className="text-[13px] text-slate-600 leading-relaxed">
                      You&apos;ll speak with an actual mortgage advisor, not a call center
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full min-h-[52px] text-center text-sm font-semibold text-white bg-navy hover:bg-navy/92 disabled:opacity-65 rounded-[4px] shadow-[0_3px_14px_rgba(10,25,47,0.14)] transition-[transform,box-shadow] duration-200 hover:-translate-y-px motion-reduce:hover:translate-y-0"
                  >
                    {loading ? "Sending…" : "Request my review"}
                  </button>
                </form>
              ) : (
                <div className="flex flex-col items-center text-center pt-2 pb-4">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-navy ring-1 ring-slate-200/80">
                    <Check size={26} strokeWidth={2} />
                  </div>
                  <h3 className="font-heading font-semibold text-navy text-xl tracking-[-0.02em] mb-2">
                    Your scenario is in review
                  </h3>
                  <p className="text-slate-500 text-[15px] leading-relaxed mb-8 max-w-sm">
                    We&apos;re taking a closer look at your numbers and will follow up with next steps
                    shortly.
                  </p>
                  <button
                    type="button"
                    onClick={closeReview}
                    className="w-full min-h-[48px] text-sm font-semibold text-white bg-navy hover:bg-navy/92 rounded-[4px] shadow-[0_3px_14px_rgba(10,25,47,0.14)] transition-[transform,box-shadow] duration-200 hover:-translate-y-px motion-reduce:hover:translate-y-0 mb-3"
                  >
                    Return to simulator
                  </button>
                  <button
                    type="button"
                    onClick={continueExploring}
                    className="w-full min-h-[48px] text-sm font-semibold text-navy bg-white border border-slate-200/90 hover:bg-slate-50 rounded-[4px] transition-colors"
                  >
                    Continue exploring scenarios
                  </button>
                </div>
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>,
    modalRoot
  );
}

/** Soft suggestion after a clarity moment — lower visual weight. */
export function SimulatorConversionEarlyCta({ visible }: { visible: boolean }) {
  const { explorationReady, openReview, deferred, reducedMotion } = useSimulatorConversion();
  if (!explorationReady || !visible || deferred) return null;

  return (
    <motion.div
      role="region"
      aria-label="Advisor review"
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.4, ease: EASE_PREMIUM }}
      className="mt-6 lg:mt-7 max-w-xl"
    >
      <div className="rounded-[4px] border border-slate-200/60 bg-slate-50/40 px-4 py-4 sm:px-5 sm:py-4 ring-1 ring-slate-100/80">
        <p className="text-[15px] font-medium text-navy/90 tracking-[-0.01em] mb-3">
          This direction looks stronger — want to validate it?
        </p>
        <button
          type="button"
          onClick={openReview}
          className="inline-flex items-center gap-2 text-sm font-semibold text-navy/85 hover:text-navy border-b border-slate-300/90 hover:border-navy/40 pb-0.5 transition-colors"
        >
          Review this with an advisor
          <ArrowRight size={15} strokeWidth={2} className="opacity-90" />
        </button>
      </div>
    </motion.div>
  );
}

/** Main reinforcement CTA — same structure as spec; no form fields. */
export function SimulatorConversionMainCta() {
  const {
    explorationReady,
    openReview,
    saveForLater,
    deferred,
    resumeReview,
    reducedMotion,
  } = useSimulatorConversion();

  if (!explorationReady) return null;

  return (
    <AnimatePresence mode="wait">
      {!deferred ? (
        <motion.div
          key="cta-main"
          role="region"
          aria-labelledby="sim-main-cta-title"
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: reducedMotion ? 0 : 0.5, ease: EASE_PREMIUM }}
          className="relative left-1/2 mt-20 w-screen -translate-x-1/2 lg:mt-28"
        >
          {/* Transition from results → decision */}
          <div
            className="h-px w-full bg-gradient-to-r from-transparent via-white/25 to-transparent"
            aria-hidden
          />
          <div className="bg-gradient-to-b from-[#050a14] via-navy to-[#0f2847] px-6 py-20 sm:py-24 lg:py-28">
            <div className="mx-auto max-w-4xl text-center">
              <p className="type-label mb-10 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">
                Your loan structure, simplified
              </p>
              <h3
                id="sim-main-cta-title"
                className="font-heading text-[1.85rem] font-semibold leading-[1.12] tracking-[-0.03em] text-white sm:text-[2.15rem] lg:text-[2.45rem]"
              >
                Now let&apos;s turn this into your real loan strategy
              </h3>
              <p className="mx-auto mt-8 max-w-2xl text-[15px] leading-[1.75] text-white/80 sm:text-base">
                We&apos;ll take what you&apos;ve built here, refine the details, and map it directly to real
                loan options — so you can move forward with clarity.
              </p>
              <p
                className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-sans text-[12px] font-medium uppercase tracking-[0.08em] text-white/60"
                aria-label="Time commitment and trust"
              >
                <span>Takes 2–3 minutes</span>
                <span className="text-white/30" aria-hidden>
                  ·
                </span>
                <span>No credit check</span>
                <span className="text-white/30" aria-hidden>
                  ·
                </span>
                <span>No pressure</span>
              </p>
              <div className="mt-12 flex flex-col items-center gap-8">
                <button
                  type="button"
                  onClick={openReview}
                  className="inline-flex min-h-[54px] min-w-[260px] items-center justify-center gap-2 rounded-[4px] bg-white px-10 text-sm font-bold uppercase tracking-[0.12em] text-navy shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_12px_40px_rgba(0,0,0,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a192f] motion-reduce:hover:translate-y-0 active:translate-y-0"
                >
                  See your loan options
                  <ArrowRight size={18} strokeWidth={2} className="opacity-90" />
                </button>
                <button
                  type="button"
                  onClick={saveForLater}
                  className="font-sans text-sm font-medium text-white/55 underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  Save this for later
                </button>
                <p className="font-sans text-[13px] text-white/50">
                  Prefer to talk it through?{" "}
                  <Link
                    to="/contact?topic=loan-structure-call"
                    className="inline-flex items-center gap-1 font-medium text-gold/90 underline decoration-gold/30 underline-offset-[3px] transition-colors hover:text-gold hover:decoration-gold/60"
                  >
                    Schedule a quick call
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="cta-deferred"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 lg:mt-8 max-w-2xl rounded-[4px] border border-slate-200/70 bg-slate-50/40 px-5 py-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <p className="text-[14px] text-slate-500 leading-relaxed">
            Your scenario is saved for when you&apos;re ready — we&apos;ll pick up from your numbers here.
          </p>
          <button
            type="button"
            onClick={resumeReview}
            className="shrink-0 text-sm font-semibold text-navy underline underline-offset-4 decoration-slate-300 hover:decoration-navy min-h-[44px] sm:min-h-0"
          >
            Review my scenario
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
