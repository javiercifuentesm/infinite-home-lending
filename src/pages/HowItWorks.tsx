import { Fragment, useEffect, type ReactNode } from "react";
import { motion } from "motion/react";
import { AgentV2Launcher } from "../components/agent-v2/AgentV2Launcher";
import { PageContainer } from "../components/PageContainer";
import { PAGE_CONTENT_RAIL_CLASS } from "../constants/layout";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import {
  ArrowRight,
  ClipboardCheck,
  FileSearch,
  Infinity,
  LayoutGrid,
  MessageSquare,
  ListOrdered,
} from "lucide-react";

const INFINITE_PATH_STAGES = [
  {
    num: "01",
    title: "Strategic Consultation",
    positioning: "We don't start with rates. We start with direction.",
    description:
      "We begin with a structured conversation around your timeline, goals, and priorities—so every decision that follows has context.",
    Icon: MessageSquare,
  },
  {
    num: "02",
    title: "Discovery & Analysis",
    positioning: "We look beyond qualification.",
    description:
      "We analyze your full financial picture—not just to approve a loan, but to understand how different structures affect your future.",
    Icon: FileSearch,
  },
  {
    num: "03",
    title: "Strategy Presentation",
    positioning: "Options, explained clearly.",
    description:
      "We present structured paths side-by-side—so you understand not just what works, but what works best for you.",
    Icon: LayoutGrid,
  },
  {
    num: "04",
    title: "Disciplined Processing",
    positioning: "Clarity doesn't stop once you move forward.",
    description:
      "We guide the process proactively, keeping you informed so there are no surprises or uncertainty along the way.",
    Icon: ListOrdered,
  },
  {
    num: "05",
    title: "Precise Execution",
    positioning: "Details matter most at the finish line.",
    description:
      "We coordinate with lenders and partners to ensure your closing is smooth, accurate, and stress-free.",
    Icon: ClipboardCheck,
  },
  {
    num: "06",
    title: "Strategic Continuity",
    positioning: "Our role doesn't end at closing.",
    description:
      "We remain available as your advisor—because your financial decisions don't stop once the loan funds.",
    Icon: Infinity,
  },
] as const;

const COMPARISON_ROWS = [
  {
    traditional: "Often limited to a single lender's options",
    infinite: "Access to multiple lenders—structured around your goals",
  },
  {
    traditional: "Focused on closing the loan",
    infinite: "Built around a clear strategy from the start",
  },
  {
    traditional: "You're left waiting for updates",
    infinite: "Clear communication at every step",
  },
  {
    traditional: "Prioritizes speed over structure",
    infinite: "Designed around long-term fit—not just approval",
  },
] as const;

const sectionMotion = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  /* Earlier trigger on narrow viewports — avoids long “blank” bands before reveal */
  viewport: { once: true, amount: 0.18 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

/** Signature brand statement — serif italic, navy, subtle gold vertical accent left of centered copy */
function StrategicPullQuote({ children }: { children: ReactNode }) {
  return (
    <figure className="mx-auto max-w-[min(100%,36rem)] px-2 sm:px-4">
      <blockquote className="m-0 flex items-stretch justify-center gap-3 sm:gap-4 md:gap-5">
        <div
          className="w-px shrink-0 self-stretch min-h-[2.75rem] bg-gradient-to-b from-gold/40 via-gold/28 to-gold/40 rounded-full"
          aria-hidden
        />
        <p className="min-w-0 flex-1 font-heading text-[1.0625rem] sm:text-[1.125rem] md:text-[1.3125rem] text-navy italic font-medium leading-[1.72] tracking-[-0.02em] text-center text-pretty [text-wrap:balance]">
          {children}
        </p>
      </blockquote>
    </figure>
  );
}

export default function HowItWorks() {
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const previous = document.title;
    document.title = "How We Work | Infinite Home Lending";
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <PageContainer className="min-w-0 overflow-x-hidden">
      {/* 1. Hero */}
      <section className="relative pt-[100px] lg:pt-[120px] pb-12 lg:pb-16 overflow-hidden bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-center">
            <div className="lg:col-span-7 relative">
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="type-eyebrow inline-block px-5 py-2 bg-surface text-gold rounded-[4px] mb-7 border border-slate-100">
                  How We Work
                </span>
                <h1 className="type-display mb-6 max-w-[22ch] text-[2.5rem] sm:text-5xl md:text-[3.25rem] lg:text-[3.75rem] xl:text-[4rem] leading-[1.06]">
                  From consultation to closing—with a defined strategy.
                </h1>
                <p className="type-body-lg text-slate-600 mb-5 max-w-2xl">
                  Most mortgage experiences feel rushed and unclear. We built a process designed to give you structure,
                  visibility, and confidence at every step.
                </p>
                <p className="type-body text-slate-600 mb-5 max-w-2xl">
                  Make confident decisions knowing your loan is structured the right way from the start.
                </p>
                <p className="text-sm sm:text-[0.9375rem] text-slate-700 mb-5 max-w-2xl font-medium leading-relaxed">
                  Most borrowers don't realize how much structure matters—until it's too late.
                </p>
                <p className="type-caption text-slate-500 mb-10 max-w-xl uppercase tracking-[0.12em]">
                  No guesswork. No pressure. No last-minute surprises.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
                  <div className="flex flex-col items-center sm:items-start">
                    <AgentV2Launcher
                      pageContext="hero"
                      className="inline-flex items-center justify-center gap-3 group shadow-[0_8px_28px_rgba(10,25,47,0.12)]"
                    >
                      Start My Strategy
                      <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" aria-hidden />
                    </AgentV2Launcher>
                    <p className="mt-2.5 text-xs text-slate-500 text-center sm:text-left max-w-[16rem] sm:max-w-none">
                      Get a personalized recommendation in minutes
                    </p>
                  </div>
                  <div className="flex flex-col items-center sm:items-start">
                    <AgentV2Launcher
                      pageContext="how-we-work"
                      variant="secondary"
                      className="text-center inline-flex items-center justify-center"
                    >
                      Schedule a Consultation
                    </AgentV2Launcher>
                    <p className="mt-2.5 text-xs text-slate-500 text-center sm:text-left max-w-[16rem] sm:max-w-none">
                      Speak directly with an advisor—no pressure
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 1.03, x: 16 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative aspect-[4/5] min-h-[280px] sm:min-h-0 rounded-sm overflow-hidden bg-slate-100 shadow-[0_80px_120px_-20px_rgba(10,25,47,0.28)]">
                <picture className="absolute inset-0 block">
                  <source srcSet="/how-it-works-hero.webp" type="image/webp" />
                  <img
                    src="/how-it-works-hero.png"
                    alt="Townhomes at sunset with pathway, gardens, and distant waterfront skyline"
                    className="absolute inset-0 h-full w-full object-cover object-[center_36%] max-[480px]:object-[center_32%] sm:object-[center_40%]"
                    width={1024}
                    height={731}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                  />
                </picture>
                {/* Brand control: readability on left (text column side in layout); keep right side clearer */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-[rgba(10,18,32,0.35)] to-[rgba(10,18,32,0.08)] pointer-events-none"
                  aria-hidden
                />
                <div
                  className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(10,18,32,0.1)]"
                  aria-hidden
                />
              </div>
            </motion.div>
          </div>
        </div>
        <div
          className="absolute top-0 right-0 w-1/3 h-full bg-surface -z-10 skew-x-12 translate-x-1/4 opacity-50 pointer-events-none"
          aria-hidden
        />
      </section>

      {/* 2. Transition / tension */}
      <section className="section-y border-b border-slate-100 bg-surface">
        <motion.div
          {...sectionMotion}
          className="max-w-3xl mx-auto px-6 text-center"
        >
          <h2 className="type-editorial-section-title text-[1.85rem] sm:text-3xl lg:text-[2.35rem] mb-8 lg:mb-10 leading-[1.1] max-w-[28ch] mx-auto">
            Most mortgage processes aren't designed for clarity.
          </h2>
          <div className="space-y-6 text-left sm:text-center max-w-2xl mx-auto">
            <p className="type-body text-slate-600">
              They're designed to move fast. To collect documents. To get to closing.
            </p>
            <p className="type-body text-navy font-medium text-[15px] lg:text-base">
              But speed without structure is where mistakes happen.
            </p>
            <p className="type-body text-slate-600">
              We built a different path—one that prioritizes understanding before execution.
            </p>
          </div>
          <p className="mt-8 max-w-2xl mx-auto font-heading text-[1.0625rem] sm:text-[1.125rem] font-semibold text-navy leading-snug tracking-[-0.02em]">
            A structured process designed to eliminate guesswork and prevent costly mistakes.
          </p>
        </motion.div>
      </section>

      {/* 3. The Infinite Path */}
      <section className="py-20 lg:py-24 border-b border-slate-100 bg-white" id="infinite-path">
        <div className={PAGE_CONTENT_RAIL_CLASS}>
          <motion.div {...sectionMotion} className="max-w-3xl mx-auto mb-16 lg:mb-20 text-center">
            <h2 className="type-editorial-section-title text-[1.85rem] sm:text-3xl lg:text-[2.5rem] mb-4 leading-[1.08]">
              The Infinite Path
            </h2>
            <p className="type-body text-slate-600 max-w-2xl mx-auto">
              Six stages, one coherent strategy—from first conversation to what comes after closing.
            </p>
          </motion.div>

          <div className="relative mx-auto max-w-5xl">
            <div
              className="pointer-events-none absolute left-[18px] top-2 bottom-2 w-px bg-gradient-to-b from-gold/25 via-gold/15 to-gold/25 md:hidden"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute left-1/2 top-0 bottom-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-gold/25 via-gold/18 to-gold/25 md:block"
              aria-hidden
            />

            <ul className="relative list-none p-0 m-0">
              {INFINITE_PATH_STAGES.map(({ num, title, positioning, description, Icon }, idx) => {
                const isLeft = idx % 2 === 0;
                const stepGapClass =
                  idx === 5 ? "pb-5 md:pb-6" : idx >= 3 ? "pb-14 md:pb-20" : "pb-20 md:pb-28";
                const stepTransition = reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.5, delay: idx * 0.07, ease: [0.22, 1, 0.36, 1] as const };

                const stepBody = (
                  <>
                    <div className="flex md:hidden items-center gap-3 mb-2">
                      <span className="font-heading font-semibold text-gold tabular-nums text-lg">{num}</span>
                      <span className="h-px flex-1 bg-gold/20 max-w-[3rem]" aria-hidden />
                    </div>
                    <div
                      className={`flex flex-col gap-4 sm:gap-5 sm:flex-row sm:items-start ${
                        isLeft ? "md:flex-row-reverse md:justify-end" : ""
                      }`}
                    >
                      <div className="shrink-0 w-12 h-12 flex items-center justify-center border border-gold/25 text-gold bg-gold/[0.04] mx-auto sm:mx-0">
                        <Icon className="w-5 h-5" strokeWidth={1.35} aria-hidden />
                      </div>
                      <div
                        className={`min-w-0 flex-1 ${
                          isLeft ? "text-center sm:text-left md:text-right" : "text-center sm:text-left"
                        }`}
                      >
                        <h3 className="font-heading font-bold text-navy text-[1.25rem] sm:text-xl lg:text-[1.625rem] tracking-[-0.03em] leading-[1.1] mb-2.5">
                          {title}
                        </h3>
                        <p className="font-heading text-[1.0625rem] sm:text-[1.125rem] lg:text-[1.1875rem] text-navy/90 font-semibold leading-snug mb-3.5 tracking-[-0.015em]">
                          {positioning}
                        </p>
                        <p
                          className={`type-body text-slate-600 text-[15px] lg:text-base max-w-[40rem] ${
                            isLeft ? "md:ml-auto md:mr-0 md:text-right" : ""
                          }`}
                        >
                          {description}
                        </p>
                      </div>
                    </div>
                  </>
                );

                return (
                  <Fragment key={num}>
                    <motion.li
                      className={`relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] md:gap-x-8 lg:gap-x-10 ${stepGapClass}`}
                      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={stepTransition}
                    >
                      <div
                        className="absolute left-[12px] top-3 z-[1] h-3 w-3 rounded-full border-2 border-white bg-gold shadow-[0_0_0_1px_rgba(197,160,89,0.28),0_2px_12px_rgba(10,25,47,0.12)] md:hidden"
                        aria-hidden
                      />
                      {isLeft ? (
                        <>
                          <div className="pl-8 md:col-start-1 md:pl-0 md:pr-8 lg:pr-10">{stepBody}</div>
                          <div className="hidden md:col-start-2 md:flex md:justify-center md:pt-2" aria-hidden>
                            <div className="h-[14px] w-[14px] shrink-0 rounded-full border-2 border-white bg-gold shadow-[0_0_0_1px_rgba(197,160,89,0.35),0_0_20px_rgba(197,160,89,0.22)]" />
                          </div>
                          <div className="hidden md:col-start-3 md:block" aria-hidden />
                        </>
                      ) : (
                        <>
                          <div className="hidden md:col-start-1 md:block" aria-hidden />
                          <div className="hidden md:col-start-2 md:flex md:justify-center md:pt-2" aria-hidden>
                            <div className="h-[14px] w-[14px] shrink-0 rounded-full border-2 border-white bg-gold shadow-[0_0_0_1px_rgba(197,160,89,0.35),0_0_20px_rgba(197,160,89,0.22)]" />
                          </div>
                          <div className="pl-8 md:col-start-3 md:pl-8 lg:pl-10">{stepBody}</div>
                        </>
                      )}
                    </motion.li>

                    {idx === 2 && (
                      <motion.li
                        className="relative w-full border-t border-slate-200/80 bg-slate-50/35 pt-9 pb-8 md:pt-10 md:pb-9"
                        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={
                          reduceMotion ? { duration: 0 } : { duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }
                        }
                      >
                        <div className="mx-auto w-full max-w-md px-5 sm:px-6 text-center sm:max-w-lg">
                          <p className="font-heading text-lg leading-snug text-navy font-semibold sm:text-xl mb-5">
                            This is where most borrowers start to see the difference.
                          </p>
                          <div className="flex flex-col items-center">
                            <AgentV2Launcher
                              pageContext="mid-path"
                              className="inline-flex items-center justify-center gap-3 group shadow-[0_8px_28px_rgba(10,25,47,0.12)]"
                            >
                              Start My Strategy
                              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" aria-hidden />
                            </AgentV2Launcher>
                            <p className="mt-2.5 text-center text-xs text-slate-500">
                              Get a personalized recommendation in minutes
                            </p>
                          </div>
                        </div>
                      </motion.li>
                    )}
                  </Fragment>
                );
              })}
            </ul>
          </div>
          <motion.div
            {...sectionMotion}
            className="mt-2 w-full border-t border-slate-100/90 pt-8">
            <StrategicPullQuote>
              This is how our clients move forward with clarity—without second-guessing their decisions later.
            </StrategicPullQuote>
          </motion.div>
        </div>
      </section>

      {/* 4. Comparison */}
      <section className="border-b border-slate-100 bg-surface pt-12 pb-24 lg:pt-14 lg:pb-28">
        <div className={`${PAGE_CONTENT_RAIL_CLASS} min-w-0`}>
          <motion.div {...sectionMotion} className="text-center mb-7 lg:mb-8">
            <h2 className="type-editorial-section-title text-[1.85rem] sm:text-3xl lg:text-[2.35rem] mb-4 leading-[1.1] max-w-[30ch] mx-auto">
              Most mortgage experiences follow the same path. Ours doesn't.
            </h2>
            <p className="type-body text-slate-600 max-w-2xl mx-auto text-[15px] lg:text-base leading-relaxed mb-6 lg:mb-7">
              The difference isn't just how the process works—it's how it shapes the outcome.
            </p>
          </motion.div>

          <motion.div
            {...sectionMotion}
            className="rounded-[4px] border border-slate-200/90 bg-white overflow-hidden shadow-[0_12px_40px_rgba(10,25,47,0.04)]"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="px-6 py-4 md:py-5 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/60">
                <p className="type-label text-slate-500/60">Traditional experience</p>
              </div>
              <div className="px-6 py-4 md:py-5 border-b border-slate-100 bg-gold/[0.055]">
                <p className="type-label text-gold font-bold">The Infinite experience</p>
              </div>
            </div>
            {COMPARISON_ROWS.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-slate-100/90"
              >
                <div className="min-w-0 px-6 py-5 md:py-6 md:border-r border-slate-100">
                  <p className="type-body text-slate-500/80 text-[15px] break-words">{row.traditional}</p>
                </div>
                <div className="min-w-0 px-6 py-5 md:py-6 bg-white">
                  <p className="type-body text-navy font-bold text-[15px] break-words">{row.infinite}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div {...sectionMotion} className="mt-6 lg:mt-7 px-2">
            <StrategicPullQuote>
              The difference isn't more options—it's avoiding the wrong decision from the start.
            </StrategicPullQuote>
          </motion.div>
          <motion.p
            {...sectionMotion}
            className="text-center font-heading text-[1.0625rem] sm:text-[1.125rem] font-medium text-navy/88 max-w-xl mx-auto mt-4 lg:mt-5 leading-[1.6] tracking-[-0.02em]"
          >
            This is where the structure of your loan starts to matter.
          </motion.p>
        </div>
      </section>

      {/* 5. Trust reinforcement */}
      <section className="section-y border-b border-slate-100 bg-white">
        <motion.div {...sectionMotion} className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="type-editorial-section-title text-[1.85rem] sm:text-3xl lg:text-[2.35rem] mb-8 leading-[1.1]">
            Why this structure matters
          </h2>
          <div className="space-y-6 text-left sm:text-center">
            <p className="type-body text-slate-600">
              A mortgage is not just a transaction—it's a long-term financial decision.
            </p>
            <p className="type-body text-slate-600">
              The way it's structured impacts your monthly cash flow, your flexibility, and your future opportunities.
            </p>
            <p className="type-body text-slate-600 font-semibold text-[15px] lg:text-base">
              The way your loan is structured can impact you by tens of thousands of dollars over time.
            </p>
            <p className="type-body text-navy font-medium text-[15px] lg:text-base">
              This process exists to make sure those decisions are made with clarity—not pressure.
            </p>
            <p className="type-body text-slate-600">
              Most people only understand this after they've gone through it. Our goal is to make sure you
              understand it before.
            </p>
          </div>
        </motion.div>
      </section>

      {/* 6. Final CTA */}
      <section className="section-y-spacious relative overflow-hidden bg-navy">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <img
            src="/how-it-works-hero.png"
            alt=""
            className="h-full w-full object-cover object-[center_58%] opacity-[0.35]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/92 to-navy/88" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(197,160,89,0.08),transparent_55%)]" />
        </div>

        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <motion.div {...sectionMotion}>
            <p className="font-sans text-sm sm:text-[0.9375rem] text-slate-300/90 mb-4 font-medium leading-relaxed">
              You've seen How We Work. Now take the first step.
            </p>
            <h2 className="type-section-title-lg text-white mb-5 text-[2rem] sm:text-[2.35rem] lg:text-[2.85rem] leading-[1.12] tracking-[-0.03em]">
              Ready to move forward with a defined strategy?
            </h2>
            <p className="font-sans text-base sm:text-lg text-slate-300/90 mb-4 max-w-xl mx-auto leading-relaxed">
              You don't need to have everything figured out. You just need a clear starting point.
            </p>
            <p className="font-sans text-lg sm:text-xl text-slate-300/95 mb-10 lg:mb-12 leading-[1.65]">
              Start with clarity. Continue with confidence.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-6 sm:gap-7">
              <div className="flex flex-col items-center sm:items-start">
                <AgentV2Launcher
                  pageContext="final-cta"
                  variant="gold"
                  className="inline-flex items-center justify-center gap-2.5 !px-10 !py-[1.15rem] shadow-[0_10px_40px_rgba(197,160,89,0.28)] hover:shadow-[0_18px_52px_rgba(197,160,89,0.4)] transition-all duration-300 group/btn"
                >
                  <span>Start My Strategy</span>
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover/btn:translate-x-0.5"
                    aria-hidden
                  />
                </AgentV2Launcher>
                <p className="mt-2.5 text-xs text-slate-400 text-center sm:text-left max-w-[16rem] sm:max-w-none">
                  Get a personalized recommendation in minutes
                </p>
              </div>
              <div className="flex flex-col items-center sm:items-start">
                <AgentV2Launcher pageContext="final-cta" variant="outlineLight" className="text-center">
                  Talk Through Your Scenario
                </AgentV2Launcher>
                <p className="mt-2.5 text-xs text-slate-400 text-center sm:text-left max-w-[16rem] sm:max-w-none">
                  Speak directly with an advisor—no pressure
                </p>
              </div>
            </div>
            <p className="mt-8 type-caption text-slate-400 max-w-md mx-auto">
              No obligation. Just a structured starting point.
            </p>
          </motion.div>
        </div>
      </section>
    </PageContainer>
  );
}
