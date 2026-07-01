import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Check,
  Compass,
  Ear,
  Globe,
  GraduationCap,
  HandHeart,
  Home,
  Languages,
  Search,
  Shield,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageContainer } from "../components/PageContainer";
import { LeadershipPortrait } from "../components/about/LeadershipPortrait";
import { FounderStoryModal } from "../components/about/FounderStoryModal";
import { FounderLinkedInIcon } from "../components/about/FounderLinkedInIcon";
import {
  FOUNDER_LINKEDIN_URLS,
  type FounderId,
  type FounderStorySelection,
  type FounderStoryType,
} from "../components/about/founderStoryConfig";
import { useLanguage } from "../i18n/LanguageContext";
import { usePageMetadata } from "../hooks/usePageMetadata";
import "../components/about/aboutPage.css";

const IMG_HERO = "/about/about-hero-consultation.png";
const FOUNDER_SRC = "/about/javier-cifuentes-founder.jpg";
const COFOUNDER_SRC = "/about/alma-jaramillo-portrait.jpg";

const CREDIBILITY_KEYS = [
  { statKey: "about.credibility.1.stat", labelKey: "about.credibility.1.label", Icon: Briefcase },
  { statKey: "about.credibility.2.stat", labelKey: "about.credibility.2.label", Icon: Languages },
  { statKey: "about.credibility.3.stat", labelKey: "about.credibility.3.label", Icon: Shield },
  { statKey: "about.credibility.4.stat", labelKey: "about.credibility.4.label", Icon: GraduationCap },
] as const;

const PHILOSOPHY_KEYS = [
  "about.philosophy.principle1",
  "about.philosophy.principle2",
  "about.philosophy.principle3",
  "about.philosophy.principle4",
  "about.philosophy.principle5",
] as const;

const PROCESS_STEPS = [
  { titleKey: "about.process.step1.title", descKey: "about.process.step1.desc", Icon: Ear },
  { titleKey: "about.process.step2.title", descKey: "about.process.step2.desc", Icon: Search },
  { titleKey: "about.process.step3.title", descKey: "about.process.step3.desc", Icon: BookOpen },
  { titleKey: "about.process.step4.title", descKey: "about.process.step4.desc", Icon: Compass },
  { titleKey: "about.process.step5.title", descKey: "about.process.step5.desc", Icon: HandHeart },
] as const;

const AUDIENCE_KEYS = [
  "about.audience.firstTime",
  "about.audience.moveUp",
  "about.audience.veterans",
  "about.audience.selfEmployed",
  "about.audience.investors",
  "about.audience.retirees",
] as const;

const JAVIER_HIGHLIGHT_KEYS = [
  "about.founders.javier.highlight1",
  "about.founders.javier.highlight2",
  "about.founders.javier.highlight3",
  "about.founders.javier.highlight4",
  "about.founders.javier.highlight5",
] as const;

const ALMA_HIGHLIGHT_KEYS = [
  "about.founders.alma.highlight1",
  "about.founders.alma.highlight2",
  "about.founders.alma.highlight3",
  "about.founders.alma.highlight4",
  "about.founders.alma.highlight5",
] as const;

const sectionMotion = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.18 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

function FounderCard(props: {
  founderId: FounderId;
  name: string;
  role: string;
  statement: string;
  nmls: string;
  highlightKeys: readonly string[];
  src: string;
  alt: string;
  placeholderInitials: string;
  placeholderFilename: string;
  onOpenStory: (founder: FounderId, type: FounderStoryType) => void;
  t: (key: string) => string;
}) {
  const {
    founderId, name, role, statement, nmls, highlightKeys, src, alt,
    placeholderInitials, placeholderFilename, onOpenStory, t,
  } = props;
  const prefix = `about.founders.${founderId}`;

  return (
    <article className="about-founder-card flex h-full flex-col rounded-[4px] border border-slate-200/90 bg-white p-7 lg:p-8 shadow-[0_14px_42px_rgba(10,25,47,0.06)]">
      <LeadershipPortrait
        className="about-founder-portrait"
        src={src}
        alt={alt}
        placeholderInitials={placeholderInitials}
        placeholderFilename={placeholderFilename}
      />
      <div className="about-founder-meta flex flex-1 flex-col">
        <h3 className="about-founder-name font-heading font-semibold text-navy tracking-[-0.025em]">{name}</h3>
        <p className="about-founder-role font-sans font-semibold uppercase text-gold">{role}</p>
        <p className="about-founder-statement font-heading text-slate-600">{statement}</p>
        <p className="about-founder-nmls font-sans text-slate-400">NMLS #{nmls}</p>
        <ul className="about-founder-highlights">
          {highlightKeys.map((key) => (
            <li key={key} className="flex text-slate-600">
              <Check className="h-4 w-4 shrink-0 text-gold" strokeWidth={2.25} aria-hidden />
              <span>{t(key)}</span>
            </li>
          ))}
        </ul>
        <div className="about-founder-actions">
          <div className="about-founder-linkedin-row">
            <a
              href={FOUNDER_LINKEDIN_URLS[founderId]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t(`${prefix}.linkLinkedInAria`)}
              className="about-founder-linkedin-link"
            >
              <FounderLinkedInIcon className="about-founder-linkedin-icon shrink-0" />
              <span>{t(`${prefix}.linkLinkedIn`)}</span>
            </a>
          </div>
          <div className="about-founder-primary-actions">
            <button
              type="button"
              className="about-founder-action-link about-founder-action-link--letter"
              onClick={() => onOpenStory(founderId, "bio")}
            >
              {t(`${prefix}.linkBio`)}
            </button>
            <button
              type="button"
              className="about-founder-action-link about-founder-action-link--meet"
              onClick={() => onOpenStory(founderId, "letter")}
            >
              {t(`${prefix}.linkLetter`)}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function PhilosophyCard({ principleKey, t }: { principleKey: string; t: (key: string) => string }) {
  return (
    <div className="about-philosophy-card flex h-full flex-col rounded-[4px] border border-slate-200/90 bg-white p-7 lg:p-8 shadow-[0_10px_32px_rgba(10,25,47,0.05)]">
      <div className="about-philosophy-accent mb-4 h-px w-10 bg-gold/50" aria-hidden />
      <h3 className="font-heading text-lg sm:text-xl text-navy font-semibold tracking-[-0.02em] mb-3">
        {t(`${principleKey}.title`)}
      </h3>
      <p className="type-body text-[14px] lg:text-[15px] text-slate-600 leading-[1.68]">{t(`${principleKey}.body`)}</p>
    </div>
  );
}

function AudienceCard({ titleKey, bodyKey, Icon, t }: { titleKey: string; bodyKey: string; Icon: LucideIcon; t: (k: string) => string }) {
  return (
    <div className="about-audience-card flex h-full min-h-[11.5rem] flex-col gap-4 rounded-[4px] border border-slate-200/90 bg-white p-6 lg:p-7 shadow-[0_8px_28px_rgba(10,25,47,0.04)]">
      <div className="about-audience-icon-wrap flex h-10 w-10 items-center justify-center rounded-[4px] border border-gold/20 bg-gold/[0.06] text-gold shrink-0">
        <Icon className="about-audience-icon h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} aria-hidden />
      </div>
      <div className="flex flex-1 flex-col">
        <h3 className="font-heading text-lg text-navy font-semibold tracking-[-0.02em] mb-2 leading-snug">{t(titleKey)}</h3>
        <p className="type-body mt-auto text-[14px] lg:text-[15px] leading-[1.65] text-slate-600">{t(bodyKey)}</p>
      </div>
    </div>
  );
}

const AUDIENCE_ICONS: LucideIcon[] = [Home, Users, Shield, Briefcase, Globe, GraduationCap];

export default function About() {
  const reduceMotion = useReducedMotion();
  const { t } = useLanguage();
  const [founderStory, setFounderStory] = useState<FounderStorySelection | null>(null);

  const openFounderStory = (founder: FounderId, type: FounderStoryType) => {
    setFounderStory({ founder, type });
  };

  const closeFounderStory = () => {
    setFounderStory(null);
  };

  usePageMetadata({
    title: t("about.meta.title"),
    description: t("about.meta.description"),
    canonical: "https://www.infinitehomelending.com/about",
  });

  const motionProps = reduceMotion ? {} : sectionMotion;

  return (
    <PageContainer className="about-page">
      {/* 1. Hero */}
      <section className="about-hero relative pt-[100px] lg:pt-[120px] overflow-hidden bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
            <div className="lg:col-span-6">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="type-eyebrow inline-block px-5 py-2 bg-surface text-gold rounded-[4px] mb-7 border border-slate-100">
                  {t("about.eyebrow")}
                </span>
                <h1 className="type-display mt-3 mb-7 max-w-[22ch] text-[2.5rem] sm:text-5xl md:text-[3.25rem] lg:text-[3.75rem] xl:text-[4rem] leading-[1.06]">
                  {t("about.hero.title")}
                </h1>
                <p className="type-body-lg text-slate-600 mb-10 max-w-2xl leading-[1.68]">{t("about.hero.body")}</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
                  <Link to="/contact" className="btn-primary inline-flex items-center justify-center gap-3 group">
                    {t("about.hero.ctaPrimary")}
                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" aria-hidden />
                  </Link>
                  <Link
                    to="/contact?topic=loan-strategy"
                    className="btn-secondary inline-flex items-center justify-center text-center"
                  >
                    {t("about.hero.ctaSecondary")}
                  </Link>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 1.04, x: 16 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
              className="lg:col-span-6 hidden lg:block relative w-full"
            >
              <div className="about-hero-image relative aspect-[5/4] w-full rounded-sm overflow-hidden shadow-[0_80px_120px_-20px_rgba(10,25,47,0.3)]">
                <img
                  src={IMG_HERO}
                  alt={t("about.hero.imageAlt")}
                  className="h-full w-full object-cover object-center"
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/[0.12] via-white/[0.03] to-transparent pointer-events-none" aria-hidden />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/15 via-transparent to-transparent pointer-events-none" aria-hidden />
                <div className="absolute inset-0 bg-gradient-to-tr from-gold/[0.03] via-transparent to-transparent pointer-events-none" aria-hidden />
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-surface -z-10 skew-x-12 translate-x-1/4 opacity-50 pointer-events-none" aria-hidden />
      </section>

      {/* 2. Credibility Band */}
      <section
        className="about-section about-section--hero-bridge about-anchor-section relative bg-navy border-b border-white/[0.08]"
        aria-labelledby="about-credibility-heading"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(197,160,89,0.08),transparent_55%)]"
          aria-hidden
        />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h2 id="about-credibility-heading" className="sr-only">
            {t("about.credibility.heading")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 items-stretch">
            {CREDIBILITY_KEYS.map(({ statKey, labelKey, Icon }) => (
              <div
                key={statKey}
                className="about-credibility-card flex flex-col items-center justify-center text-center rounded-[4px] border border-white/[0.1] bg-white/[0.04] px-6 py-8 lg:py-9 backdrop-blur-sm"
              >
                <Icon className="about-credibility-icon h-5 w-5 text-gold mb-5" strokeWidth={1.75} aria-hidden />
                <p className="about-credibility-stat font-heading font-semibold text-white mb-3">
                  {t(statKey)}
                </p>
                <p className="about-credibility-label font-sans font-medium uppercase text-white/78">
                  {t(labelKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Why Infinite Home Lending Exists */}
      <section id="why" className="about-section about-section--story-open about-anchor-section border-b border-slate-100 bg-surface">
        <motion.div {...motionProps} className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-10 lg:mb-12">
            <h2 className="type-editorial-section-title text-[1.85rem] sm:text-3xl lg:text-[2.35rem] mb-6 leading-[1.08]">
              {t("about.why.title")}
            </h2>
            <p className="type-body-lg text-navy font-medium leading-[1.65]">{t("about.why.lead")}</p>
          </div>
          <div className="max-w-2xl mx-auto space-y-5 text-center sm:text-left">
            <p className="type-body text-slate-600 leading-[1.72]">{t("about.why.p1")}</p>
            <p className="type-body text-slate-600 leading-[1.72]">{t("about.why.p2")}</p>
            <p className="type-body text-navy font-medium leading-[1.72]">{t("about.why.mission")}</p>
          </div>
        </motion.div>
      </section>

      {/* 4. Our Philosophy */}
      <section id="philosophy" className="about-section about-anchor-section border-b border-slate-100 bg-white">
        <motion.div {...motionProps} className="max-w-7xl mx-auto px-6">
          <header className="max-w-2xl mx-auto text-center mb-12 lg:mb-16">
            <h2 className="type-editorial-section-title text-[1.85rem] sm:text-3xl lg:text-[2.35rem] leading-[1.08]">
              {t("about.philosophy.title")}
            </h2>
          </header>
          <div className="about-philosophy">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
              {PHILOSOPHY_KEYS.slice(0, 3).map((key) => (
                <PhilosophyCard key={key} principleKey={key} t={t} />
              ))}
            </div>
            <div className="about-philosophy-row-two">
              {PHILOSOPHY_KEYS.slice(3).map((key) => (
                <PhilosophyCard key={key} principleKey={key} t={t} />
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* 5. Meet the Founders */}
      <section id="founders" className="about-section about-anchor-section border-b border-slate-200/90 bg-surface">
        <motion.div {...motionProps} className="max-w-7xl mx-auto px-6">
          <header className="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
            <h2 className="type-editorial-section-title text-[1.85rem] sm:text-3xl lg:text-[2.35rem] mb-5 leading-[1.08]">
              {t("about.founders.title")}
            </h2>
            <p className="type-body text-slate-600 text-[1.0625rem] leading-[1.72]">{t("about.founders.intro1")}</p>
            <p className="type-body text-slate-600 text-[1.0625rem] leading-[1.72] mt-4">{t("about.founders.intro2")}</p>
          </header>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto items-stretch">
            <FounderCard
              founderId="javier"
              name={t("about.founders.javier.name")}
              role={t("about.founders.javier.role")}
              statement={t("about.founders.javier.statement")}
              nmls="210090"
              highlightKeys={JAVIER_HIGHLIGHT_KEYS}
              src={FOUNDER_SRC}
              alt={t("about.founders.javier.imageAlt")}
              placeholderInitials="JC"
              placeholderFilename="javier-cifuentes-founder.jpg"
              onOpenStory={openFounderStory}
              t={t}
            />
            <FounderCard
              founderId="alma"
              name={t("about.founders.alma.name")}
              role={t("about.founders.alma.role")}
              statement={t("about.founders.alma.statement")}
              nmls="1376746"
              highlightKeys={ALMA_HIGHLIGHT_KEYS}
              src={COFOUNDER_SRC}
              alt={t("about.founders.alma.imageAlt")}
              placeholderInitials="AJ"
              placeholderFilename="alma-jaramillo-portrait.jpg"
              onOpenStory={openFounderStory}
              t={t}
            />
          </div>
        </motion.div>
      </section>

      {/* 6. Signature Pull Quote */}
      <section className="about-section about-section--quote about-pull-quote border-b border-slate-100 bg-white">
        <motion.figure {...motionProps} className="relative z-[1] max-w-4xl mx-auto px-6 text-center">
          <blockquote className="m-0">
            <div className="mx-auto mb-10 h-px w-16 bg-gold/45" aria-hidden />
            <p className="about-pull-quote-text font-heading italic text-navy font-medium tracking-[-0.025em] text-pretty mx-auto">
              &ldquo;{t("about.quote.text")}&rdquo;
            </p>
            <footer className="mt-10 font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              — {t("about.quote.attribution")}
            </footer>
          </blockquote>
        </motion.figure>
      </section>

      {/* 7. How We Work */}
      <section id="process" className="about-section about-anchor-section border-b border-slate-100 bg-navy relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(197,160,89,0.07),transparent_52%)]"
          aria-hidden
        />
        <motion.div {...motionProps} className="max-w-7xl mx-auto px-6 relative z-10">
          <header className="max-w-2xl mx-auto text-center mb-12 lg:mb-16">
            <h2 className="type-editorial-section-title text-[1.85rem] sm:text-3xl lg:text-[2.35rem] text-white leading-[1.08]">
              {t("about.process.title")}
            </h2>
            <p className="mt-4 type-body text-white/65 max-w-xl mx-auto">{t("about.process.subtitle")}</p>
          </header>
          <ol className="about-process-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4 max-w-6xl mx-auto items-stretch">
            {PROCESS_STEPS.map(({ titleKey, descKey, Icon }, index) => (
              <li key={titleKey} className="about-process-step rounded-[4px] border border-white/[0.1] bg-white/[0.04] p-6 backdrop-blur-sm">
                <span className="about-process-step-num font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-gold/80 mb-4">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Icon className="about-process-step-icon h-5 w-5 text-gold mb-4" strokeWidth={1.75} aria-hidden />
                <h3 className="font-heading text-lg text-white font-semibold tracking-[-0.02em] mb-2 leading-snug">{t(titleKey)}</h3>
                <p className="font-sans text-[13px] leading-[1.65] text-white/70 mt-auto">{t(descKey)}</p>
              </li>
            ))}
          </ol>
        </motion.div>
      </section>

      {/* 8. Who We Serve */}
      <section id="audience" className="about-section about-anchor-section border-b border-slate-100 bg-surface">
        <motion.div {...motionProps} className="max-w-7xl mx-auto px-6">
          <header className="max-w-2xl mx-auto text-center mb-12 lg:mb-14">
            <h2 className="type-editorial-section-title text-[1.85rem] sm:text-3xl lg:text-[2.35rem] leading-[1.08]">
              {t("about.audience.title")}
            </h2>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 max-w-5xl mx-auto items-stretch">
            {AUDIENCE_KEYS.map((key, index) => (
              <AudienceCard
                key={key}
                titleKey={`${key}.title`}
                bodyKey={`${key}.body`}
                Icon={AUDIENCE_ICONS[index] ?? Users}
                t={t}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* 9. Start the Conversation CTA */}
      <section className="about-section about-section--cta relative overflow-hidden bg-navy">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(197,160,89,0.07),transparent_52%)]"
          aria-hidden
        />
        <motion.div {...motionProps} className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="type-section-title-lg text-white mb-6 text-[2rem] sm:text-4xl lg:text-[3rem] leading-[1.15] tracking-[-0.03em]">
              {t("about.finalCta.title")}
            </h2>
            <p className="font-sans text-lg sm:text-xl text-slate-400 mb-10 sm:mb-12 max-w-[40rem] mx-auto leading-[1.65]">
              {t("about.finalCta.body")}
            </p>
            <div className="about-cta-actions">
              <Link
                to="/contact?topic=loan-strategy"
                className="btn-gold inline-flex items-center justify-center gap-2.5 shadow-[0_10px_40px_rgba(197,160,89,0.28)] hover:shadow-[0_18px_52px_rgba(197,160,89,0.45)] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 transition-all duration-300 group/btn"
              >
                <span className="relative z-10">{t("about.finalCta.cta")}</span>
                <ArrowRight
                  size={18}
                  className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-0.5"
                  strokeWidth={2}
                  aria-hidden
                />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
      <FounderStoryModal
        selection={founderStory}
        onClose={closeFounderStory}
        onSwitchStory={setFounderStory}
        t={t}
      />
    </PageContainer>
  );
}
