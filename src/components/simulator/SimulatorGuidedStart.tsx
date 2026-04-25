import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Play, X } from "lucide-react";
import { SIMULATOR_DEMO_VIDEO_URL } from "../../lib/simulatorDemo";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { EASE_PREMIUM } from "../../lib/motionConfig";

const STEPS = [
  {
    body: "Set your purchase price, rate, and down payment to match your situation.",
    targetId: "sim-scenario-inputs",
  },
  {
    body: "See how each structure changes your monthly payment and long-term cost.",
    targetId: "sim-comparison-results",
  },
  {
    body: "Identify which structure gives you the strongest financial position.",
    targetId: "sim-decision-interpretation",
  },
] as const;

const HIGHLIGHT_MS = 2400;

function highlightSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const cls = [
    "ring-2",
    "ring-gold/40",
    "ring-offset-2",
    "ring-offset-surface",
    "shadow-[0_0_28px_rgba(197,160,89,0.14)]",
    "rounded-[4px]",
    "transition-shadow duration-300",
  ];
  el.classList.add(...cls);
  window.setTimeout(() => {
    el.classList.remove(...cls);
  }, HIGHLIGHT_MS);
}

export function SimulatorGuidedStart() {
  const reduced = usePrefersReducedMotion();
  const [walkOpen, setWalkOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [step, setStep] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const scrollToInputs = useCallback(() => {
    const el = document.getElementById("sim-scenario-inputs");
    el?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    window.setTimeout(() => {
      const first = el?.querySelector<HTMLInputElement>('input[type="number"]');
      first?.focus({ preventScroll: true });
    }, 400);
  }, [reduced]);

  const closeWalk = useCallback(() => {
    setWalkOpen(false);
    setStep(0);
  }, []);

  const openWalk = () => {
    setStep(0);
    setWalkOpen(true);
  };

  const advanceWalkthrough = () => {
    const { targetId } = STEPS[step];
    document.getElementById(targetId)?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "center",
    });
    window.setTimeout(() => highlightSection(targetId), reduced ? 80 : 320);

    if (step < STEPS.length - 1) {
      window.setTimeout(() => setStep((s) => s + 1), reduced ? 0 : 220);
    } else {
      window.setTimeout(() => closeWalk(), reduced ? 200 : 720);
    }
  };

  useEffect(() => {
    if (!videoOpen || !videoRef.current) return;
    const v = videoRef.current;
    v.muted = true;
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }, [videoOpen]);

  const modalRoot = typeof document !== "undefined" ? document.body : null;

  return (
    <>
      <motion.div
        className="relative max-w-[min(100%,22rem)] lg:max-w-[20.5rem] rounded-[4px] will-change-transform"
        initial={false}
        animate={
          reduced
            ? { boxShadow: "0 10px 40px rgba(10,25,47,0.07), 0 0 0 1px rgba(197,160,89,0.1)" }
            : {
                boxShadow: [
                  "0 8px 36px rgba(10,25,47,0.08), 0 0 0 1px rgba(197,160,89,0.08)",
                  "0 14px 48px rgba(10,25,47,0.1), 0 0 0 1px rgba(197,160,89,0.14), 0 0 40px rgba(197,160,89,0.06)",
                  "0 8px 36px rgba(10,25,47,0.08), 0 0 0 1px rgba(197,160,89,0.08)",
                ],
              }
        }
        transition={
          reduced
            ? { duration: 0 }
            : { duration: 4.2, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }
        }
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-[4px] bg-gradient-to-br from-white via-amber-50/[0.28] to-gold/[0.05] ring-1 ring-inset ring-slate-200/55"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -inset-px rounded-[5px] bg-gradient-to-br from-gold/15 via-transparent to-navy/[0.04] opacity-70 blur-[1px]"
          aria-hidden
        />
        <div className="relative z-[1] px-4 py-4 sm:px-5 sm:py-4">
          <p className="font-heading font-semibold text-navy text-[1.05rem] sm:text-lg tracking-[-0.02em] mb-1.5">
            Start here (30 sec)
          </p>
          <p className="text-[12px] sm:text-[13px] text-slate-500 leading-relaxed mb-4">
            We&apos;ll show you how to compare structures and what to focus on.
          </p>
          <div className="flex flex-col gap-2">
            <motion.button
              type="button"
              onClick={openWalk}
              whileHover={reduced ? {} : { y: -1 }}
              whileTap={reduced ? {} : { scale: 0.99 }}
              transition={{ duration: 0.2, ease: EASE_PREMIUM }}
              className="group w-full inline-flex items-center justify-center gap-2 text-center text-sm font-semibold text-white bg-navy hover:bg-navy/93 py-2.5 px-4 rounded-[4px] shadow-[0_4px_18px_rgba(10,25,47,0.2)] ring-1 ring-inset ring-white/10 transition-colors duration-150 active:bg-navy"
            >
              Show me how this works
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
                strokeWidth={2}
              />
            </motion.button>
            <p className="text-center text-[11px] text-slate-400 leading-snug px-1">
              3 quick steps · ~20 sec · No setup needed
            </p>
            <button
              type="button"
              onClick={scrollToInputs}
              className="w-full text-center text-[13px] text-slate-500 hover:text-navy/85 py-2.5 rounded-[3px] transition-colors duration-200 border border-transparent hover:border-slate-200/80 hover:bg-white/60"
            >
              I&apos;ll explore myself
            </button>
            {SIMULATOR_DEMO_VIDEO_URL && (
              <button
                type="button"
                onClick={() => setVideoOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 text-[12px] text-slate-400 hover:text-navy/65 mt-0.5 py-1.5 transition-colors"
              >
                <Play size={12} className="shrink-0 opacity-70" strokeWidth={2} />
                Watch How We Work
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {modalRoot &&
        createPortal(
          <AnimatePresence>
            {walkOpen && (
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="walkthrough-step-label"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.2 }}
                className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-3 sm:p-4 bg-navy/[0.18] backdrop-blur-[2px]"
                onClick={(e) => e.target === e.currentTarget && closeWalk()}
              >
                <motion.div
                  initial={{ opacity: 0, y: reduced ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduced ? 0 : 6 }}
                  transition={{ duration: reduced ? 0 : 0.26, ease: EASE_PREMIUM }}
                  className="w-full max-w-[min(100%,22rem)] sm:max-w-md rounded-[4px] border border-slate-200/90 bg-white shadow-[0_20px_56px_rgba(10,25,47,0.12)] p-5 sm:p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <p
                      id="walkthrough-step-label"
                      className="text-[11px] uppercase tracking-[0.2em] text-navy/40 font-medium"
                    >
                      Step {step + 1} of {STEPS.length}
                    </p>
                    <button
                      type="button"
                      onClick={closeWalk}
                      className="p-1.5 rounded-[3px] text-slate-400 hover:text-navy hover:bg-slate-50 transition-colors shrink-0"
                      aria-label="Close"
                    >
                      <X size={18} strokeWidth={1.5} />
                    </button>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, y: reduced ? 0 : 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: reduced ? 0 : -3 }}
                      transition={{ duration: reduced ? 0 : 0.2, ease: EASE_PREMIUM }}
                    >
                      <p className="text-slate-600 text-[15px] leading-relaxed">
                        {STEPS[step].body}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                  <div className="flex flex-wrap items-center justify-end gap-2 mt-6">
                    <button
                      type="button"
                      onClick={closeWalk}
                      className="text-sm text-slate-500 hover:text-navy px-3 py-2.5 rounded-[3px] transition-colors"
                    >
                      Skip
                    </button>
                    <button
                      type="button"
                      onClick={advanceWalkthrough}
                      className="text-sm font-semibold text-white bg-navy hover:bg-navy/90 px-4 py-2.5 rounded-[3px] transition-colors inline-flex items-center gap-2 group/btn"
                    >
                      {step < STEPS.length - 1 ? "Next" : "Done"}
                      <ArrowRight
                        size={16}
                        className="transition-transform duration-300 group-hover/btn:translate-x-0.5"
                      />
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          modalRoot
        )}

      {modalRoot &&
        createPortal(
          <AnimatePresence>
            {videoOpen && SIMULATOR_DEMO_VIDEO_URL && (
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="How We Work"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-navy/30 backdrop-blur-[2px]"
                onClick={(e) => e.target === e.currentTarget && setVideoOpen(false)}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="w-full max-w-md rounded-[4px] border border-slate-200/90 bg-white shadow-xl overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100">
                    <span className="text-sm font-medium text-navy">How We Work</span>
                    <button
                      type="button"
                      onClick={() => setVideoOpen(false)}
                      className="p-1.5 rounded-[3px] text-slate-400 hover:text-navy"
                      aria-label="Close"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className="aspect-video bg-navy/5">
                    <video
                      ref={videoRef}
                      src={SIMULATOR_DEMO_VIDEO_URL}
                      className="w-full h-full object-cover"
                      controls
                      playsInline
                      muted
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          modalRoot
        )}
    </>
  );
}
