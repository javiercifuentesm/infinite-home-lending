import { forwardRef, useLayoutEffect, useMemo, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import { CheckCircle2, Search, ShieldCheck, Target, Zap } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

/**
 * Raw section scroll (0→1) is remapped so the full 0–1 band range is reachable
 * before the section leaves view — avoids “missing” the last band on short scroll runs.
 */
const SECTION_PROGRESS_NORMALIZER = 0.72;

/**
 * Five equal bands on normalized [0,1):
 * [0,0.2)→0 … [0.8,1]→4 (Closing). No narrow end thresholds — same width per step.
 */
function activeStepFromBand(p: number): number {
  const t = Math.min(1, Math.max(0, p));
  if (t < 0.2) return 0;
  if (t < 0.4) return 1;
  if (t < 0.6) return 2;
  if (t < 0.8) return 3;
  return 4;
}

type InfiniteProcessRailProps = {
  reducedMotion: boolean;
};

export const InfiniteProcessRail = forwardRef<HTMLElement, InfiniteProcessRailProps>(
  function InfiniteProcessRail({ reducedMotion }, ref) {
    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ["start end", "end start"],
    });

    const sectionT = useTransform(scrollYProgress, (raw) =>
      Math.min(1, Math.max(0, raw / SECTION_PROGRESS_NORMALIZER))
    );

    const [activeStep, setActiveStep] = useState(0);

    useLayoutEffect(() => {
      setActiveStep(activeStepFromBand(sectionT.get()));
    }, [sectionT]);

    useMotionValueEvent(sectionT, "change", (p) => {
      const next = activeStepFromBand(p);
      setActiveStep((prev) => (prev !== next ? next : prev));
    });

    const { t } = useLanguage();

    const STEPS = [
      { title: t("home.process.step1.title"), desc: t("home.process.step1.desc"), icon: Search },
      { title: t("home.process.step2.title"), desc: t("home.process.step2.desc"), icon: Target },
      { title: t("home.process.step3.title"), desc: t("home.process.step3.desc"), icon: ShieldCheck },
      { title: t("home.process.step4.title"), desc: t("home.process.step4.desc"), icon: Zap },
      { title: t("home.process.step5.title"), desc: t("home.process.step5.desc"), icon: CheckCircle2 },
    ];

    const connectorTransition = reducedMotion ? "transition-none" : "transition-[width] duration-500 ease-out";

    const stepStates = useMemo(() => {
      return STEPS.map((_, idx) => ({
        isActive: idx === activeStep,
        isComplete: idx < activeStep,
        isUpcoming: idx > activeStep,
      }));
    }, [activeStep]);

    return (
      <section
        ref={ref}
        className="section-y-spacious relative min-h-[min(90vh,940px)] overflow-x-hidden bg-navy pb-24 text-white md:pb-32"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center md:mb-20">
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reducedMotion ? 0 : 0.75 }}
            >
              <h2 className="type-section-title-lg mb-6 text-[2rem] text-white sm:text-[2.35rem] lg:text-[2.65rem]">
                {t("home.process.title")}
              </h2>
              <p className="mx-auto max-w-2xl font-sans text-lg font-normal leading-[1.65] text-slate-400/95 lg:text-xl">
                {t("home.process.subtitle")}
              </p>
            </motion.div>
          </div>

          <div className="relative">
            {/* Desktop connector: base track + discrete gold length from completed journey (activeStep / 4) */}
            <div
              className="pointer-events-none absolute left-0 right-0 top-10 z-0 hidden h-[2px] overflow-hidden rounded-full md:block"
              aria-hidden
            >
              <div className="absolute inset-0 bg-white/[0.08]" />
              <div
                className={`absolute bottom-0 left-0 top-0 rounded-full bg-gradient-to-r from-gold/45 to-gold/75 ${connectorTransition}`}
                style={{ width: `${(activeStep / 4) * 100}%` }}
              />
            </div>

            <div className="relative z-10 grid grid-cols-1 gap-12 pt-1 md:grid-cols-5 md:gap-3 lg:gap-5">
              {STEPS.map((item, idx) => {
                const { isActive, isComplete, isUpcoming } = stepStates[idx];
                const Icon = item.icon;

                const titleClass = isActive
                  ? "text-white"
                  : isComplete
                    ? "text-white/[0.92]"
                    : "text-white/58";
                const descClass = isActive
                  ? "text-slate-200/95"
                  : isComplete
                    ? "text-slate-400/[0.95]"
                    : "text-slate-500/[0.88]";

                const iconScale = reducedMotion ? "scale-100" : isActive ? "scale-[1.06]" : isComplete ? "scale-[1.02]" : "scale-100";
                const iconRing = isActive ? "ring-1 ring-gold/35" : isComplete ? "ring-1 ring-gold/18" : "";

                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center border-b border-white/[0.07] pb-10 text-center last:border-0 last:pb-0 md:items-start md:border-0 md:pb-0 md:text-left"
                  >
                    <div className="relative mx-auto mb-6 h-20 w-20 shrink-0 md:mx-0 md:mb-10">
                      {isActive && !reducedMotion && (
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-0 scale-110 rounded-full bg-gold/18 blur-xl"
                        />
                      )}
                      <div
                        className={`relative z-10 flex h-full w-full origin-center items-center justify-center rounded-full border bg-navy text-gold shadow-md transition-transform duration-300 ease-out ${iconScale} ${iconRing} ${
                          isActive
                            ? "border-gold/55 shadow-[0_0_24px_rgba(197,160,89,0.32)]"
                            : isComplete
                              ? "border-white/12 shadow-[0_0_12px_rgba(197,160,89,0.1)]"
                              : "border-white/10"
                        }`}
                      >
                        <Icon size={24} strokeWidth={1.75} />
                        <span className="absolute -right-1.5 -top-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-navy text-[10px] font-bold text-white/45">
                          {idx + 1}
                        </span>
                      </div>
                    </div>

                    <div className="min-w-0 w-full">
                      <h3
                        className={`mb-2 font-heading text-lg font-semibold tracking-[-0.02em] transition-colors duration-300 sm:text-xl ${titleClass}`}
                      >
                        {item.title}
                      </h3>
                      <p
                        className={`font-sans text-[15px] leading-relaxed transition-[color,opacity] duration-300 sm:text-sm ${descClass} ${
                          isUpcoming ? "opacity-90" : ""
                        }`}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }
);

InfiniteProcessRail.displayName = "InfiniteProcessRail";
