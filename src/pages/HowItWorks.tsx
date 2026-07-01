import { Fragment, useEffect, useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { AgentV2Launcher } from "../components/agent-v2/AgentV2Launcher";
import { PageContainer } from "../components/PageContainer";
import { PAGE_CONTENT_RAIL_CLASS } from "../constants/layout";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useLanguage } from "../i18n/LanguageContext";
import { usePageMetadata } from "../hooks/usePageMetadata";
import {
  ArrowRight,
  ClipboardCheck,
  FileSearch,
  Infinity,
  LayoutGrid,
  MessageSquare,
  ListOrdered,
  ShieldCheck,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";

const INFINITE_PATH_STAGE_DEFS = [
  {
    num: "01",
    titleKey: "howItWorks.step1.title",
    positioningKey: "howItWorks.step1.positioning",
    descriptionKey: "howItWorks.step1.desc",
    Icon: MessageSquare,
  },
  {
    num: "02",
    titleKey: "howItWorks.step2.title",
    positioningKey: "howItWorks.step2.positioning",
    descriptionKey: "howItWorks.step2.desc",
    Icon: FileSearch,
  },
  {
    num: "03",
    titleKey: "howItWorks.step3.title",
    positioningKey: "howItWorks.step3.positioning",
    descriptionKey: "howItWorks.step3.desc",
    Icon: LayoutGrid,
  },
  {
    num: "04",
    titleKey: "howItWorks.step4.title",
    positioningKey: "howItWorks.step4.positioning",
    descriptionKey: "howItWorks.step4.desc",
    Icon: ListOrdered,
  },
  {
    num: "05",
    titleKey: "howItWorks.step5.title",
    positioningKey: "howItWorks.step5.positioning",
    descriptionKey: "howItWorks.step5.desc",
    Icon: ClipboardCheck,
  },
  {
    num: "06",
    titleKey: "howItWorks.step6.title",
    positioningKey: "howItWorks.step6.positioning",
    descriptionKey: "howItWorks.step6.desc",
    Icon: Infinity,
  },
] as const;

const COMPARISON_ROW_KEYS = [
  {
    traditionalKey: "howItWorks.compare.row1.traditional",
    infiniteKey: "howItWorks.compare.row1.infinite",
  },
  {
    traditionalKey: "howItWorks.compare.row2.traditional",
    infiniteKey: "howItWorks.compare.row2.infinite",
  },
  {
    traditionalKey: "howItWorks.compare.row3.traditional",
    infiniteKey: "howItWorks.compare.row3.infinite",
  },
  {
    traditionalKey: "howItWorks.compare.row4.traditional",
    infiniteKey: "howItWorks.compare.row4.infinite",
  },
] as const;

const WHY_INSIGHT_CARDS = [
  {
    titleKey: "howItWorks.why.card1.title",
    bodyKey: "howItWorks.why.card1.body",
    Icon: Wallet,
  },
  {
    titleKey: "howItWorks.why.card2.title",
    bodyKey: "howItWorks.why.card2.body",
    Icon: TrendingUp,
  },
  {
    titleKey: "howItWorks.why.card3.title",
    bodyKey: "howItWorks.why.card3.body",
    Icon: ShieldCheck,
  },
] as const;

const WHY_INSIGHT_BODY_CLASS =
  "type-body text-[15px] lg:text-base text-slate-600 font-normal leading-[1.65]";

function WhyInsightCard({
  titleKey,
  bodyKey,
  Icon,
  t,
}: {
  titleKey: string;
  bodyKey: string;
  Icon: LucideIcon;
  t: (key: string) => string;
}) {
  return (
    <article className="how-why-insight-card card-home flex h-full min-h-0 flex-col rounded-[4px] border border-slate-200/90 bg-white p-7 lg:p-8 text-left shadow-[0_10px_32px_rgba(10,25,47,0.05)]">
      <div className="mb-6 shrink-0">
        <div className="how-why-insight-accent mb-4 h-[2px] w-10 bg-gold" aria-hidden />
        <div className="how-why-insight-icon-wrap mb-4 flex h-10 w-10 items-center justify-center rounded-[4px] border border-gold/20 bg-gold/[0.06] text-gold">
          <Icon className="how-why-insight-icon h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} aria-hidden />
        </div>
        <h3 className="type-heading-sans flex min-h-[2.75rem] items-end text-gold leading-[1.35]">
          {t(titleKey)}
        </h3>
      </div>
      <div className="flex min-h-0 flex-1 flex-col">
        <p className={WHY_INSIGHT_BODY_CLASS}>{t(bodyKey)}</p>
      </div>
    </article>
  );
}

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
  const { t } = useLanguage();
  const pathSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: pathProgress } = useScroll({
    target: pathSectionRef,
    offset: ["start 85%", "end 15%"],
  });
  const lineScaleY = useTransform(pathProgress, [0, 1], [0, 1]);

  usePageMetadata({
    title: t("howItWorks.meta.title"),
    description: t("howItWorks.meta.description"),
    canonical: "https://www.infinitehomelending.com/how-we-work",
  });

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
                  {t("howItWorks.eyebrow")}
                </span>
                <h1 className="type-display mb-6 max-w-[22ch] text-[2.5rem] sm:text-5xl md:text-[3.25rem] lg:text-[3.75rem] xl:text-[4rem] leading-[1.06]">
                  {t("howItWorks.title")}
                </h1>
                <p className="type-body-lg text-slate-600 mb-5 max-w-2xl">
                  {t("howItWorks.subtitle")}
                </p>
                <p className="type-body text-slate-600 mb-5 max-w-2xl">
                  {t("howItWorks.hero.body")}
                </p>
                <p className="text-sm sm:text-[0.9375rem] text-slate-700 mb-5 max-w-2xl font-medium leading-relaxed">
                  {t("howItWorks.hero.emphasis")}
                </p>
                <p className="type-caption text-slate-500 mb-10 max-w-xl uppercase tracking-[0.12em]">
                  {t("howItWorks.hero.caption")}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
                  <div className="flex flex-col items-center sm:items-start">
                    <AgentV2Launcher
                      pageContext="hero"
                      className="inline-flex items-center justify-center gap-3 group shadow-[0_8px_28px_rgba(10,25,47,0.12)]"
                    >
                      {t("howItWorks.hero.cta1")}
                      <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" aria-hidden />
                    </AgentV2Launcher>
                    <p className="mt-2.5 text-xs text-slate-500 text-center sm:text-left max-w-[16rem] sm:max-w-none">
                      {t("howItWorks.hero.cta1Sub")}
                    </p>
                  </div>
                  <div className="flex flex-col items-center sm:items-start">
                    <AgentV2Launcher
                      pageContext="how-we-work"
                      variant="secondary"
                      className="text-center inline-flex items-center justify-center"
                    >
                      {t("howItWorks.hero.cta2")}
                    </AgentV2Launcher>
                    <p className="mt-2.5 text-xs text-slate-500 text-center sm:text-left max-w-[16rem] sm:max-w-none">
                      {t("howItWorks.hero.cta2Sub")}
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
                    alt={t("howItWorks.hero.imageAlt")}
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
            {t("howItWorks.problem.title")}
          </h2>
          <div className="space-y-6 text-left sm:text-center max-w-2xl mx-auto">
            <p className="type-body text-slate-600">
              {t("howItWorks.problem.body1")}
            </p>
            <p className="type-body text-navy font-medium text-[15px] lg:text-base">
              {t("howItWorks.problem.body2")}
            </p>
            <p className="type-body text-slate-600">
              {t("howItWorks.problem.body3")}
            </p>
          </div>
          <p className="mt-8 max-w-2xl mx-auto font-heading text-[1.0625rem] sm:text-[1.125rem] font-semibold text-navy leading-snug tracking-[-0.02em]">
            {t("howItWorks.problem.closing")}
          </p>
        </motion.div>
      </section>

      {/* 3. The Infinite Path */}
      <section className="py-20 lg:py-24 border-b border-slate-100 bg-white" id="infinite-path">
        <div className={PAGE_CONTENT_RAIL_CLASS}>
          <motion.div {...sectionMotion} className="max-w-3xl mx-auto mb-16 lg:mb-20 text-center">
            <h2 className="type-editorial-section-title text-[1.85rem] sm:text-3xl lg:text-[2.5rem] mb-4 leading-[1.08]">
              {t("howItWorks.path.title")}
            </h2>
            <p className="type-body text-slate-600 max-w-2xl mx-auto">
              {t("howItWorks.path.subtitle")}
            </p>
          </motion.div>

          <div ref={pathSectionRef} className="relative mx-auto max-w-5xl isolate">
            <div
              className="pointer-events-none absolute left-[18px] top-2 bottom-2 w-px md:hidden"
              aria-hidden
            >
              <div className="absolute inset-0 bg-gradient-to-b from-gold/10 via-gold/8 to-gold/10" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-gold/60 via-gold/45 to-gold/30 origin-top will-change-transform"
                style={{ scaleY: lineScaleY }}
              />
            </div>
            <div
              className="pointer-events-none absolute left-1/2 top-0 bottom-0 hidden w-px -translate-x-1/2 md:block"
              aria-hidden
            >
              <div className="absolute inset-0 bg-gradient-to-b from-gold/10 via-gold/8 to-gold/10" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-gold/60 via-gold/45 to-gold/30 origin-top will-change-transform"
                style={{ scaleY: lineScaleY }}
              />
            </div>

            <ul className="relative list-none p-0 m-0">
              {INFINITE_PATH_STAGE_DEFS.map(({ num, titleKey, positioningKey, descriptionKey, Icon }, idx) => {
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
                          {t(titleKey)}
                        </h3>
                        <p className="font-heading text-[1.0625rem] sm:text-[1.125rem] lg:text-[1.1875rem] text-navy/90 font-semibold leading-snug mb-3.5 tracking-[-0.015em]">
                          {t(positioningKey)}
                        </p>
                        <p
                          className={`type-body text-slate-600 text-[15px] lg:text-base max-w-[40rem] ${
                            isLeft ? "md:ml-auto md:mr-0 md:text-right" : ""
                          }`}
                        >
                          {t(descriptionKey)}
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
                            {t("howItWorks.path.midCta")}
                          </p>
                          <div className="flex flex-col items-center">
                            <AgentV2Launcher
                              pageContext="mid-path"
                              className="inline-flex items-center justify-center gap-3 group shadow-[0_8px_28px_rgba(10,25,47,0.12)]"
                            >
                              {t("howItWorks.hero.cta1")}
                              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" aria-hidden />
                            </AgentV2Launcher>
                            <p className="mt-2.5 text-center text-xs text-slate-500">
                              {t("howItWorks.path.midCtaBtn")}
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
            <StrategicPullQuote>{t("howItWorks.path.pullQuote")}</StrategicPullQuote>
          </motion.div>
        </div>
      </section>

      {/* 4. Comparison */}
      <section className="border-b border-slate-100 bg-surface pt-12 pb-24 lg:pt-14 lg:pb-28">
        <div className={`${PAGE_CONTENT_RAIL_CLASS} min-w-0`}>
          <motion.div {...sectionMotion} className="text-center mb-7 lg:mb-8">
            <h2 className="type-editorial-section-title text-[1.85rem] sm:text-3xl lg:text-[2.35rem] mb-4 leading-[1.1] max-w-[30ch] mx-auto">
              {t("howItWorks.compare.title")}
            </h2>
            <p className="type-body text-slate-600 max-w-2xl mx-auto text-[15px] lg:text-base leading-relaxed mb-6 lg:mb-7">
              {t("howItWorks.compare.intro")}
            </p>
          </motion.div>

          <motion.div
            {...sectionMotion}
            className="rounded-[4px] border border-slate-200/90 bg-white overflow-hidden shadow-[0_12px_40px_rgba(10,25,47,0.04)]"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="px-6 py-4 md:py-5 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/60">
                <p className="type-label text-slate-500/60">{t("howItWorks.compare.traditional")}</p>
              </div>
              <div className="px-6 py-4 md:py-5 border-b border-slate-100 bg-gold/[0.055]">
                <p className="type-label text-gold font-bold">{t("howItWorks.compare.infinite")}</p>
              </div>
            </div>
            {COMPARISON_ROW_KEYS.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-slate-100/90"
              >
                <div className="min-w-0 px-6 py-5 md:py-6 md:border-r border-slate-100">
                  <p className="type-body text-slate-500/80 text-[15px] break-words">{t(row.traditionalKey)}</p>
                </div>
                <div className="min-w-0 px-6 py-5 md:py-6 bg-white">
                  <p className="type-body text-navy font-bold text-[15px] break-words">{t(row.infiniteKey)}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div {...sectionMotion} className="mt-6 lg:mt-7 px-2">
            <StrategicPullQuote>{t("howItWorks.compare.pullQuote")}</StrategicPullQuote>
          </motion.div>
          <motion.p
            {...sectionMotion}
            className="text-center font-heading text-[1.0625rem] sm:text-[1.125rem] font-medium text-navy/88 max-w-xl mx-auto mt-4 lg:mt-5 leading-[1.6] tracking-[-0.02em]"
          >
            {t("howItWorks.compare.closing")}
          </motion.p>
        </div>
      </section>

      {/* 5. Trust reinforcement */}
      <section className="section-y border-b border-slate-100 bg-white">
        <motion.div {...sectionMotion} className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
            <h2 className="type-editorial-section-title text-[1.85rem] sm:text-3xl lg:text-[2.35rem] mb-6 lg:mb-7 leading-[1.1]">
              {t("howItWorks.why.title")}
            </h2>
            <p className="type-body text-slate-600 max-w-[46rem] lg:max-w-[48rem] mx-auto leading-[1.7] text-pretty">
              {t("howItWorks.why.body1")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
            {WHY_INSIGHT_CARDS.map((card) => (
              <WhyInsightCard key={card.titleKey} {...card} t={t} />
            ))}
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
              {t("howItWorks.finalCta.eyebrow")}
            </p>
            <h2 className="type-section-title-lg text-white mb-5 text-[2rem] sm:text-[2.35rem] lg:text-[2.85rem] leading-[1.12] tracking-[-0.03em]">
              {t("howItWorks.finalCta.title")}
            </h2>
            <p className="font-sans text-base sm:text-lg text-slate-300/90 mb-4 max-w-xl mx-auto leading-relaxed">
              {t("howItWorks.finalCta.body")}
            </p>
            <p className="font-sans text-lg sm:text-xl text-slate-300/95 mb-10 lg:mb-12 leading-[1.65]">
              {t("howItWorks.finalCta.sub")}
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-6 sm:gap-7">
              <div className="flex flex-col items-center sm:items-start">
                <AgentV2Launcher
                  pageContext="final-cta"
                  variant="gold"
                  className="inline-flex items-center justify-center gap-2.5 !px-10 !py-[1.15rem] shadow-[0_10px_40px_rgba(197,160,89,0.28)] hover:shadow-[0_18px_52px_rgba(197,160,89,0.4)] transition-all duration-300 group/btn"
                >
                  <span>{t("howItWorks.finalCta.cta1")}</span>
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover/btn:translate-x-0.5"
                    aria-hidden
                  />
                </AgentV2Launcher>
                <p className="mt-2.5 text-xs text-slate-400 text-center sm:text-left max-w-[16rem] sm:max-w-none">
                  {t("howItWorks.finalCta.cta1Sub")}
                </p>
              </div>
              <div className="flex flex-col items-center sm:items-start">
                <AgentV2Launcher pageContext="final-cta" variant="outlineLight" className="text-center">
                  {t("howItWorks.finalCta.cta2")}
                </AgentV2Launcher>
                <p className="mt-2.5 text-xs text-slate-400 text-center sm:text-left max-w-[16rem] sm:max-w-none">
                  {t("howItWorks.finalCta.cta2Sub")}
                </p>
              </div>
            </div>
            <p className="mt-8 type-caption text-slate-400 max-w-md mx-auto">
              {t("howItWorks.finalCta.disclaimer")}
            </p>
          </motion.div>
        </div>
      </section>
    </PageContainer>
  );
}
