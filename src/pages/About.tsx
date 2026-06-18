import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Compass, MessageCircle, Shield, Sparkles } from "lucide-react";
import { IHLLogo } from "../components/IHLLogo";
import { PageContainer } from "../components/PageContainer";
import { useLanguage } from "../i18n/LanguageContext";
import { usePageMetadata } from "../hooks/usePageMetadata";

/** Hero: Mid-Atlantic suburban aerial — brick and siding, streets and driveways (watermark trimmed). */
const IMG_HERO_RESIDENTIAL = "/about/about-hero-aerial.png";

/** Mid section: seasonal neighborhood aerial — winter snow, same regional housing character. */
const IMG_NARRATIVE_ARCH = "/about/about-neighborhood-winter.png";

/** Supporting: single-family suburban home — natural daylight, brick and siding context (watermark trimmed). */
const IMG_APPROACH_HOME = "/about/about-single-family.png";

const FOUNDER_PUBLIC_SRC = "/about/javier-cifuentes-founder.jpg";
const COFOUNDER_PUBLIC_SRC = "/about/alma-jaramillo-portrait.jpg";

const MORTGAGE_WANTS_GRID = (t: (k: string) => string) => [
  { title: t("about.wants.straightAnswers.title"), body: t("about.wants.straightAnswers.body"), Icon: MessageCircle },
  { title: t("about.wants.roomToExplore.title"), body: t("about.wants.roomToExplore.body"), Icon: Compass },
  { title: t("about.wants.guidanceThatFits.title"), body: t("about.wants.guidanceThatFits.body"), Icon: Sparkles },
  { title: t("about.wants.planYouCanTrust.title"), body: t("about.wants.planYouCanTrust.body"), Icon: Shield },
];

const CORE_VALUES = (t: (k: string) => string) => [
  { title: t("about.coreValues.strategic.title"), body: t("about.coreValues.strategic.body") },
  { title: t("about.coreValues.communication.title"), body: t("about.coreValues.communication.body") },
  { title: t("about.coreValues.execution.title"), body: t("about.coreValues.execution.body") },
];

function LeadershipPortrait(props: {
  src: string;
  alt: string;
  placeholderInitials: string;
  placeholderFilename: string;
  /** Premium leadership portrait: 4:5, gold-accent frame (Founder & Managing Director + Co-Founder). */
  variant?: "default" | "premium";
}) {
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const { src, alt, placeholderInitials, placeholderFilename, variant = "default" } = props;
  const isPremium = variant === "premium";

  const frameClass = isPremium
    ? "rounded-[22px] border border-gold/25 bg-white shadow-[0_22px_58px_-14px_rgba(10,25,47,0.24)] ring-1 ring-gold/15"
    : "rounded-none border border-slate-200/50 bg-white shadow-[0_24px_56px_-18px_rgba(10,25,47,0.18)]";

  const innerClass = isPremium
    ? "relative aspect-[4/5] overflow-hidden rounded-[20px]"
    : "relative aspect-[3/4] overflow-hidden rounded-none";

  const imgClass = isPremium
    ? "h-full w-full object-cover object-[center_22%]"
    : "h-full w-full object-cover object-center";

  const overlayClass = isPremium
    ? "pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-t from-navy/[0.04] via-transparent to-white/[0.08]"
    : "pointer-events-none absolute inset-0 rounded-none bg-gradient-to-t from-navy/[0.1] via-transparent to-white/10";

  return (
    <figure
      className={
        isPremium
          ? "w-full max-w-[min(100%,420px)] shrink-0 mx-auto lg:mx-0"
          : "w-full max-w-[min(100%,28rem)] shrink-0 mx-auto lg:mx-0"
      }
    >
      <div className={`relative overflow-hidden ${frameClass}`}>
        <div className={innerClass}>
          {!showPlaceholder ? (
            <img
              src={src}
              alt={alt}
              className={imgClass}
              width={isPremium ? 820 : 600}
              height={isPremium ? 1025 : 800}
              sizes={isPremium ? "(min-width: 1024px) 400px, 100vw" : "(min-width: 1024px) 28rem, 100vw"}
              loading="lazy"
              decoding="async"
              onError={() => setShowPlaceholder(true)}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div
              className="flex h-full min-h-[280px] flex-col items-center justify-center gap-2 px-5 py-10 bg-gradient-to-b from-surface to-white"
              aria-hidden
            >
              <span className="font-heading text-2xl text-navy/[0.1] tracking-tight">{placeholderInitials}</span>
              <p className="type-caption text-slate-400 max-w-[10.5rem] text-center leading-relaxed">
                Add <span className="font-mono text-[11px] text-slate-500">{placeholderFilename}</span>
              </p>
            </div>
          )}
          <div className={overlayClass} aria-hidden />
        </div>
      </div>
    </figure>
  );
}

export default function About() {
  const reduceMotion = useReducedMotion();
  const { t, lang } = useLanguage();

  usePageMetadata({
    title: t("about.meta.title"),
    description: t("about.meta.description"),
    canonical: "https://www.infinitehomelending.com/about",
  });

  return (
    <PageContainer>
      <section className="relative pt-[100px] lg:pt-[120px] pb-12 lg:pb-16 overflow-hidden bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
            <div className="lg:col-span-7 relative">
              <div className="absolute -inset-10 bg-white/40 backdrop-blur-[2px] rounded-full blur-3xl -z-10 opacity-60" aria-hidden />
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="type-eyebrow inline-block px-5 py-2 bg-surface text-gold rounded-[4px] mb-7 border border-slate-100">
                  {t("about.eyebrow")}
                </span>
                <h1 className="type-display mb-7 max-w-[22ch] text-[2.65rem] sm:text-5xl md:text-6xl lg:text-[4.1rem] xl:text-[4.35rem] leading-[1.05]">
                  {t("about.hero.title")}
                </h1>
                <p className="type-body text-slate-600 text-lg leading-[1.65] mb-10 max-w-2xl">
                  {t("about.hero.body")}
                </p>
                <div className="flex flex-col sm:flex-row gap-8">
                  <Link
                    to="/contact?topic=loan-strategy"
                    className="btn-primary flex items-center justify-center gap-3 group"
                  >
                    {t("about.startPreApproval")}
                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" aria-hidden />
                  </Link>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 1.05, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="lg:col-span-5 hidden lg:block relative"
            >
              <div className="relative aspect-[4/5] rounded-sm overflow-hidden shadow-[0_80px_120px_-20px_rgba(10,25,47,0.3)] group">
                <img
                  src={IMG_HERO_RESIDENTIAL}
                  alt="Aerial view of a Mid-Atlantic suburban neighborhood with brick and siding homes, streets, and driveways"
                  className="object-cover w-full h-full transition-transform duration-1000 ease-out"
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent opacity-60" aria-hidden />
                <div className="absolute inset-0 bg-navy/10 mix-blend-multiply" aria-hidden />
                <div
                  className="absolute inset-0 bg-gradient-to-tr from-gold/10 via-transparent to-transparent opacity-40 mix-blend-screen"
                  aria-hidden
                />
                <div
                  className="absolute -top-1/4 -right-1/4 w-full h-full bg-gold/5 rounded-full blur-[140px] pointer-events-none opacity-40"
                  aria-hidden
                />
              </div>
              <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-gold/10 -z-10 rounded-full blur-[100px] opacity-40" aria-hidden />
            </motion.div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-surface -z-10 skew-x-12 translate-x-1/4 opacity-50" aria-hidden />
      </section>

      {/* Narrative: copy + image with quote overlapped (editorial composition) */}
      <section className="section-y border-b border-slate-100 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div className="max-w-xl lg:py-4">
              <h2 className="type-editorial-section-title text-[1.85rem] sm:text-3xl lg:text-[2.35rem] mb-8 leading-[1.08] max-w-[22ch]">
                {t("about.narrative.title")}
              </h2>
              <div className="space-y-5">
                <p className="type-body text-slate-600 leading-[1.72]">
                  {t("about.narrative.body1")}
                </p>
                <p className="type-body text-slate-600 leading-[1.72]">
                  {t("about.narrative.body2")}
                </p>
              </div>
            </div>

            <div className="relative min-w-0 pb-6 lg:pb-8">
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-[0_80px_120px_-28px_rgba(10,25,47,0.25)]">
                <img
                  src={IMG_NARRATIVE_ARCH}
                  alt="Snow-covered Mid-Atlantic suburban neighborhood with brick and siding homes along a cleared street"
                  className="object-cover w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/25 via-transparent to-transparent pointer-events-none" aria-hidden />
              </div>
              <article className="card-home-elevated relative z-10 mx-4 -mt-10 sm:mx-6 lg:mx-0 lg:ml-auto lg:mr-0 lg:w-[94%] max-w-xl overflow-hidden rounded-[4px] border border-slate-200/90 bg-white p-8 lg:p-10 shadow-[0_12px_40px_rgba(10,25,47,0.07)] transition-shadow duration-500 hover:shadow-[0_22px_56px_rgba(10,25,47,0.1)] group">
                <div
                  className="pointer-events-none absolute inset-0 rounded-[4px] bg-gradient-to-br from-gold/[0.06] via-transparent to-transparent opacity-100"
                  aria-hidden
                />
                <blockquote className="type-editorial-pullquote mb-0 m-0 border-l-2 border-gold/40 pl-5 relative z-10">
                  <p className="m-0">
                    {t("about.narrative.pullQuote")}
                  </p>
                </blockquote>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="our-approach" className="section-y bg-surface border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div className="order-1 min-w-0">
              <div className="relative aspect-[4/5] rounded-sm overflow-hidden shadow-[0_80px_120px_-20px_rgba(10,25,47,0.3)]">
                <img
                  src={IMG_APPROACH_HOME}
                  alt="Single-family suburban home with siding, manicured lawn, and driveway in natural daylight"
                  className="object-cover w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className="order-2 max-w-xl min-w-0">
              <h2 className="type-editorial-section-title text-[1.85rem] sm:text-3xl lg:text-[2.35rem] mb-8 leading-[1.08] max-w-[22ch]">
                {t("about.approach.title")}
              </h2>
              <div className="space-y-5">
                <p className="type-body text-slate-600">
                  {t("about.approach.body1")}
                </p>
                <p className="type-body text-slate-600">
                  {t("about.approach.body2")}
                </p>
                <p className="type-body text-navy text-[15px] lg:text-base font-medium">
                  {t("about.approach.body3")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="loan-structure" className="section-y border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center border-l-[3px] border-l-gold/35 pl-6 sm:pl-8 py-2">
            <div className="mx-auto mb-8 h-px w-12 bg-gold/45" aria-hidden />
            <h2 className="type-editorial-section-title text-[1.85rem] sm:text-3xl lg:text-[2.35rem] mb-8 leading-[1.08] max-w-[22ch] mx-auto">
              {t("about.loanStructure.title")}
            </h2>
            <div className="space-y-5 text-left">
              <p className="type-body text-slate-600">
                {t("about.loanStructure.body1")}
              </p>
              <p className="type-body text-slate-600">
                {t("about.loanStructure.body2")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y border-b border-slate-100 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 lg:items-center">
            <div className="max-w-xl min-w-0">
              <h2 className="type-editorial-section-title text-[1.85rem] sm:text-3xl lg:text-[2.35rem] mb-8 leading-[1.08] max-w-[22ch]">
                {t("about.costOfWrong.title")}
              </h2>
              <div className="space-y-5">
                <p className="type-body text-slate-600">
                  {t("about.costOfWrong.body1")}
                </p>
                <p className="type-body text-slate-600">
                  {t("about.costOfWrong.body2")}
                </p>
              </div>
            </div>
            <aside className="flex min-w-0 w-full lg:min-h-[min(100%,26rem)] items-stretch">
              <div className="relative flex w-full flex-col justify-center min-h-[280px] lg:min-h-[min(100%,26rem)] overflow-hidden rounded-sm border border-white/[0.08] border-l-[3px] border-l-gold/70 bg-navy px-8 py-12 sm:px-10 sm:py-14 lg:px-12 lg:py-16 shadow-[0_28px_72px_-12px_rgba(10,25,47,0.45)]">
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-gold/[0.07] via-transparent to-navy opacity-90"
                  aria-hidden
                />
                <div className="relative z-10 mx-auto max-w-[min(100%,22rem)] text-center flex flex-col justify-center my-auto">
                  <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50 mb-6">
                    {t("about.costOfWrong.calloutLabel")}
                  </p>
                  <p className="font-heading text-[1.75rem] sm:text-[2.125rem] lg:text-[2.35rem] text-white font-semibold leading-[1.2] tracking-[-0.03em]">
                    {t("about.costOfWrong.calloutTitle")}
                  </p>
                  <p className="font-heading text-[1.35rem] sm:text-[1.65rem] lg:text-[1.85rem] text-white/72 italic leading-[1.5] tracking-[-0.02em] mt-3">
                    {t("about.costOfWrong.calloutSub")}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section id="leadership" className="section-y border-b border-slate-200/90 bg-surface scroll-mt-28">
        <div className="max-w-7xl mx-auto px-6">
          <header className="max-w-3xl mb-14 lg:mb-20">
            <h2 className="type-editorial-section-title text-[1.85rem] sm:text-3xl lg:text-[2.35rem] mb-4 leading-[1.08] text-navy">
              {t("about.title")}
            </h2>
            <p className="type-body text-slate-600 text-[1.0625rem] leading-[1.72] max-w-2xl">
              {t("about.subtitle")}
            </p>
          </header>

          <motion.article
            id="founder-message"
            className="pb-16 lg:pb-20 mb-16 lg:mb-24 border-b border-slate-200/50"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-navy/40 mb-6">
              {t("about.founder")}
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 lg:items-start">
              <div className="lg:col-span-5 order-2 lg:order-1 flex w-full justify-center lg:justify-start self-start mt-0 mb-2 sm:mb-3 lg:mb-0">
                <LeadershipPortrait
                  variant="premium"
                  src={FOUNDER_PUBLIC_SRC}
                  alt="Javier Cifuentes, Founder & Managing Director of Infinite Home Lending"
                  placeholderInitials="JC"
                  placeholderFilename="javier-cifuentes-founder.jpg"
                />
              </div>
              <div className="lg:col-span-7 order-1 lg:order-2 min-w-0 self-start text-left py-0 px-0 sm:px-2 lg:pl-0 lg:pr-8 lg:pt-0 lg:pb-2">
                <p className="type-body text-slate-600 mb-8 max-w-[42rem] text-[1.0625rem] leading-[1.72]">
                  {t("about.founderMessage.opening")}
                </p>
                <div className="space-y-5 text-slate-600 font-sans text-pretty [overflow-wrap:break-word] [word-break:normal] max-w-[42rem] text-[1.0625rem] leading-[1.72]">
                  <p>{t("about.founderMessage.p1")}</p>
                  <p>{t("about.founderMessage.p2")}</p>
                  <blockquote className="font-heading text-[1.15rem] sm:text-[1.2rem] italic text-navy/90 leading-[1.65] border-l-[3px] border-gold/35 pl-5 pr-2 my-6 py-1 mx-0">
                    <p className="mb-0">{t("about.founderMessage.pullQuote")}</p>
                  </blockquote>
                  <p>{t("about.founderMessage.p3")}</p>
                  <p>{t("about.founderMessage.p4")}</p>
                  <p>{t("about.founderMessage.p5")}</p>
                  <p>{t("about.founderMessage.p6")}</p>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-200/70 text-left">
                  <p className="font-heading text-lg text-navy font-medium tracking-[-0.02em]">— Javier Cifuentes</p>
                  <p className="type-body-sm text-slate-500 mt-2 font-normal">{t("about.founder")}</p>
                </div>
              </div>
            </div>
          </motion.article>

          <motion.article
            id="cofounder-message"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-navy/40 mb-6">
              {t("about.coFounder")}
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 lg:items-start">
              <div className="lg:col-span-5 order-2 lg:order-2 flex w-full justify-center lg:justify-end self-start mt-0 mb-2 sm:mb-3 lg:mb-0">
                <LeadershipPortrait
                  variant="premium"
                  src={COFOUNDER_PUBLIC_SRC}
                  alt="Alma Jaramillo, Co-Founder of Infinite Home Lending"
                  placeholderInitials="AJ"
                  placeholderFilename="alma-jaramillo-portrait.jpg"
                />
              </div>
              <div className="lg:col-span-7 order-1 lg:order-1 min-w-0 self-start text-left py-0 px-0 sm:px-2 lg:pr-2 lg:pl-8 lg:pt-0 lg:pb-2">
                <p className="type-body text-slate-600 mb-8 max-w-[42rem] text-[1.0625rem] leading-[1.72]">
                  {t("about.coFounderMessage.opening")}
                </p>
                <div className="space-y-5 text-slate-600 font-sans text-pretty [overflow-wrap:break-word] [word-break:normal] max-w-[42rem] text-[1.0625rem] leading-[1.72]">
                  <p>{t("about.coFounderMessage.p1")}</p>
                  <p>{t("about.coFounderMessage.p2")}</p>
                  <p>{t("about.coFounderMessage.p3")}</p>
                  <p>{t("about.coFounderMessage.p4")}</p>
                  <p>{t("about.coFounderMessage.p5")}</p>
                  <p>{t("about.coFounderMessage.p6")}</p>
                  <p>{t("about.coFounderMessage.p7")}</p>
                  <p>{t("about.coFounderMessage.p8")}</p>
                  <p>{t("about.coFounderMessage.p9")}</p>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-200/70 text-left">
                  <p className="font-heading text-lg text-navy font-medium tracking-[-0.02em]">— Alma Jaramillo</p>
                  <p className="type-body-sm text-slate-500 mt-2 font-normal">{t("about.coFounder")}</p>
                </div>
              </div>
            </div>
          </motion.article>
        </div>
      </section>

      <section id="mortgage-experience" className="section-y border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mx-auto w-full max-w-[72rem] flex flex-col items-center text-center">
            <div
              className="w-full max-w-3xl mx-auto pt-2 pb-4 lg:pt-4 lg:pb-6 mb-12 lg:mb-16 px-2"
              aria-labelledby="clarity-manifesto-heading"
            >
              <div className="mx-auto mb-8 lg:mb-10 h-px w-14 bg-gold/40" aria-hidden />
              <p
                id="clarity-manifesto-heading"
                className="font-heading font-semibold text-[1.85rem] sm:text-[2.25rem] lg:text-[2.65rem] xl:text-[2.85rem] text-navy leading-[1.12] tracking-[-0.035em] mb-8 lg:mb-10 text-balance"
              >
                {t("about.clarity.heading")}
              </p>
              <p className="text-[1.0625rem] sm:text-[1.125rem] lg:text-[1.1875rem] leading-[1.65] text-slate-600 font-sans max-w-2xl mx-auto text-pretty">
                {t("about.clarity.body")}
              </p>
            </div>

            <h2 className="type-editorial-section-title text-[1.85rem] sm:text-3xl lg:text-[2.35rem] mb-5 lg:mb-6 leading-[1.08] max-w-[24ch] text-navy mx-auto">
              {t("about.clarity.wantsTitle")}
            </h2>
            <p className="type-body text-slate-600 max-w-[42rem] mx-auto mb-12 lg:mb-14 text-pretty text-[1.0625rem] leading-[1.72]">
              {t("about.clarity.wantsBody")}
              <span className="block mt-3">
                {t("about.clarity.wantsBody2")}
              </span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10 w-full max-w-[52rem] mx-auto text-left">
              {MORTGAGE_WANTS_GRID(t).map(({ title, body, Icon }) => (
                <div
                  key={title}
                  className="flex h-full flex-col gap-4 rounded-[4px] border border-slate-200/90 bg-white p-6 lg:p-8 shadow-[0_8px_28px_rgba(10,25,47,0.04)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(10,25,47,0.1)] motion-reduce:hover:translate-y-0"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-gold/20 bg-gold/[0.06] text-gold shrink-0">
                    <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-heading text-lg sm:text-xl text-navy tracking-[-0.02em] leading-snug mb-2">
                      {title}
                    </h3>
                    <p className="type-body text-[15px] lg:text-base leading-[1.7]">{body}</p>
                  </div>
                </div>
              ))}
            </div>

            <blockquote className="mt-16 lg:mt-20 pt-12 border-t border-slate-200/90 max-w-[min(100%,36rem)] mx-auto px-3">
              <p className="font-heading text-[1.125rem] sm:text-[1.2rem] lg:text-[1.3rem] italic text-navy/[0.88] leading-[1.6] tracking-[-0.02em] text-center text-pretty">
                <span className="text-gold/45 not-italic select-none text-[1.35em] leading-none align-top" aria-hidden>
                  &ldquo;
                </span>
                {t("about.clarity.pullQuote")}
                <span className="text-gold/45 not-italic select-none text-[1.35em] leading-none align-top" aria-hidden>
                  &rdquo;
                </span>
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Understanding → access (single narrative unit) */}
      <section className="section-y bg-surface border-b border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center pb-8 lg:pb-10">
            <h2 className="type-section-title-lg text-[2rem] sm:text-[2.35rem] lg:text-[2.65rem] max-w-[24ch] mx-auto leading-[1.18] tracking-[-0.03em] text-navy">
              {t("about.independent.title")}
            </h2>
          </div>
          <div className="flex flex-col items-center gap-8 pt-2">
            <div className="flex w-full max-w-md items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-300/80" aria-hidden />
              <IHLLogo className="h-14 sm:h-16 w-auto max-w-[200px] opacity-[0.96] mx-auto" />
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-300/80" aria-hidden />
            </div>
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <p className="type-body text-slate-600 leading-[1.72]">{t("about.independent.body1")}</p>
              <p className="type-body text-navy text-[15px] lg:text-base font-medium leading-[1.72]">{t("about.independent.body2")}</p>
              <p className="type-body text-slate-600 leading-[1.72]">
                {t("about.independent.body3")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y bg-white overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-stretch">
            {CORE_VALUES(t).map((item) => (
              <div
                key={item.title}
                className="relative p-10 lg:p-12 rounded-[4px] bg-white border border-slate-200/90 shadow-[0_14px_40px_rgba(10,25,47,0.05)]"
              >
                <h3 className="mb-5 font-heading font-semibold text-navy text-xl sm:text-2xl tracking-[-0.02em] leading-snug">
                  {item.title}
                </h3>
                <p className="type-body text-slate-600 text-[15px] lg:text-base leading-[1.7]">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-navy relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(197,160,89,0.07),transparent_52%)]"
          aria-hidden
        />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="type-section-title-lg text-white mb-6 text-[2rem] sm:text-4xl lg:text-[3rem] leading-[1.15] tracking-[-0.03em]">
              {t("about.finalCta.title")}
            </h2>
            <p className="font-sans text-lg sm:text-xl text-slate-400 mb-12 max-w-xl mx-auto leading-[1.65]">
              {t("about.finalCta.body")}
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-6 sm:gap-7">
              <Link
                to="/contact"
                className="btn-gold inline-flex items-center justify-center gap-2.5 shadow-[0_10px_40px_rgba(197,160,89,0.28)] hover:shadow-[0_18px_52px_rgba(197,160,89,0.45)] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 transition-all duration-300 relative overflow-hidden group/btn"
              >
                <span className="relative z-10">{t("about.startPreApproval")}</span>
                <ArrowRight
                  size={18}
                  className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-0.5"
                  strokeWidth={2}
                  aria-hidden
                />
              </Link>
              <Link
                to="/contact?topic=loan-strategy"
                className="text-center text-sm font-semibold text-white/85 border-b border-white/25 pb-0.5 hover:text-white hover:border-white/50 transition-colors duration-300 sm:py-[1.125rem]"
              >
                {t("about.finalCta.talkStrategy")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
