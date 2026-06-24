import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  SOLUTIONS_ADVISORY_FRAMEWORK,
  SOLUTIONS_PATHWAYS,
  SOLUTIONS_SCENARIOS,
  SOLUTIONS_SMART_TOOLS_SHOWCASE,
  type SolutionsScenarioId,
} from "../../config/solutionsFlagshipConfig";
import { getLoanProductById, LOAN_GRID_ROWS } from "../../data/loanProducts";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { useLanguage } from "../../i18n/LanguageContext";
import { LoanProductGridCard } from "../LoanProductGridCard";
import "./solutionsPage.css";

const HIGHLIGHT_DURATION_MS = 4200;

type SolutionsPageBodyProps = {
  recentlyViewedId: string | null;
  lang: string;
};

export function SolutionsPageBody({ recentlyViewedId, lang }: SolutionsPageBodyProps) {
  const { t } = useLanguage();
  const reduceMotion = usePrefersReducedMotion();
  const gridRef = useRef<HTMLElement>(null);
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [activeScenario, setActiveScenario] = useState<SolutionsScenarioId | null>(null);
  const [highlightedIds, setHighlightedIds] = useState<Set<string>>(() => new Set());

  const clearHighlightTimer = useCallback(() => {
    if (highlightTimerRef.current) {
      clearTimeout(highlightTimerRef.current);
      highlightTimerRef.current = null;
    }
  }, []);

  const scrollAndHighlight = useCallback(
    (programIds: string[], scenarioId?: SolutionsScenarioId) => {
      if (scenarioId) setActiveScenario(scenarioId);
      else setActiveScenario(null);

      setHighlightedIds(new Set(programIds));
      clearHighlightTimer();

      highlightTimerRef.current = setTimeout(() => {
        setHighlightedIds(new Set());
        highlightTimerRef.current = null;
      }, HIGHLIGHT_DURATION_MS);

      requestAnimationFrame(() => {
        gridRef.current?.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
      });
    },
    [clearHighlightTimer, reduceMotion],
  );

  useEffect(() => () => clearHighlightTimer(), [clearHighlightTimer]);

  const motionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 } as const,
        whileInView: { opacity: 1, y: 0 } as const,
        viewport: { once: true, margin: "-48px" } as const,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
      };

  const hasHighlight = highlightedIds.size > 0;

  return (
    <div className="solutions-page">
      {/* 1 — Advisory intro + pathway cards */}
      <section className="sp-section sp-section--intro" aria-labelledby="solutions-advisory-heading">
        <div className="sp-hero-handoff" aria-hidden />
        <div className="sp-intro-glow" aria-hidden />
        <motion.div {...motionProps} className="max-w-6xl mx-auto px-6 relative z-[1]">
          <div className="max-w-4xl mx-auto text-center">
            <div className="sp-intro-accent mx-auto mb-8" aria-hidden />
            <h2 id="solutions-advisory-heading" className="sp-advisory-headline">
              {t("solutions.body.intro.headline")}
            </h2>
            <p className="sp-advisory-subline">{t("solutions.body.intro.body")}</p>
          </div>

          <div className="sp-pathways mt-14 lg:mt-20">
            <h3 className="sp-pathways-title">{t("solutions.flagship.pathwaysTitle")}</h3>
            <ul className="sp-pathway-grid">
              {SOLUTIONS_PATHWAYS.map(({ id, titleKey, bodyKey, programsKey, ctaKey, programIds, emoji }) => (
                <li key={id}>
                  <article className="sp-pathway-card">
                    <span className="sp-pathway-emoji" aria-hidden>
                      {emoji}
                    </span>
                    <h4 className="sp-pathway-card-title">{t(titleKey)}</h4>
                    <p className="sp-pathway-card-body">{t(bodyKey)}</p>
                    <p className="sp-pathway-programs">
                      <span className="sr-only">{t("solutions.flagship.scenario.suggested")}: </span>
                      {t(programsKey)}
                    </p>
                    <button
                      type="button"
                      className="sp-pathway-cta"
                      onClick={() => scrollAndHighlight(programIds)}
                    >
                      {t(ctaKey)}
                    </button>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </section>

      {/* 2 — Scenario self-identification */}
      <section
        className="sp-section sp-section--scenario"
        aria-labelledby="solutions-scenario-heading"
      >
        <motion.div {...motionProps} className="max-w-6xl mx-auto px-6">
          <header className="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
            <div className="sp-scenario-accent mx-auto mb-8" aria-hidden />
            <h2
              id="solutions-scenario-heading"
              className="type-editorial-section-title text-[1.85rem] sm:text-3xl lg:text-[2.5rem] text-navy leading-[1.08] mb-5"
            >
              {t("solutions.flagship.scenario.title")}
            </h2>
            <p className="type-body text-slate-500 text-[1.0625rem] leading-[1.72] font-light">
              {t("solutions.flagship.scenario.subtitle")}
            </p>
          </header>

          <ul className="sp-scenario-grid">
            {SOLUTIONS_SCENARIOS.map(
              ({ id, titleKey, programsKey, toolCtaKey, toolPath, programIds, emoji }) => {
                const isActive = activeScenario === id;
                return (
                  <li key={id}>
                    <article
                      className={`sp-scenario-tile${isActive ? " sp-scenario-tile--active" : ""}`}
                    >
                      <button
                        type="button"
                        className="sp-scenario-tile-select"
                        aria-pressed={isActive}
                        onClick={() => scrollAndHighlight(programIds, id)}
                      >
                        <span className="sp-scenario-emoji" aria-hidden>
                          {emoji}
                        </span>
                        <span className="sp-scenario-tile-title">{t(titleKey)}</span>
                        <span className="sp-scenario-tile-programs">
                          <span className="sp-scenario-suggested-label">
                            {t("solutions.flagship.scenario.suggested")}
                          </span>
                          {t(programsKey)}
                        </span>
                      </button>
                      <Link to={toolPath} className="sp-scenario-tool-link">
                        {t(toolCtaKey)}
                      </Link>
                    </article>
                  </li>
                );
              },
            )}
          </ul>
        </motion.div>
      </section>

      {/* 3 — Mortgage Strategy Framework */}
      <section
        className="sp-section sp-section--framework"
        aria-labelledby="solutions-framework-heading"
      >
        <motion.div {...motionProps} className="max-w-7xl mx-auto px-6">
          <header className="max-w-3xl mx-auto text-center mb-14 lg:mb-24">
            <div className="sp-framework-accent mx-auto mb-8" aria-hidden />
            <p className="sp-framework-eyebrow">{t("solutions.flagship.framework.eyebrow")}</p>
            <h2
              id="solutions-framework-heading"
              className="sp-framework-headline"
            >
              {t("solutions.flagship.framework.headline")}
            </h2>
            <p className="sp-framework-subline">{t("solutions.flagship.framework.body")}</p>
          </header>

          <ol className="sp-framework" aria-label={t("solutions.flagship.framework.headline")}>
            {SOLUTIONS_ADVISORY_FRAMEWORK.map(({ titleKey, bodyKey, Icon }, index) => (
              <li key={titleKey} className="sp-framework-group">
                <article className="sp-framework-card">
                  <span className="sp-framework-icon-wrap" aria-hidden>
                    <Icon className="h-7 w-7 md:h-8 md:w-8" strokeWidth={1.45} />
                  </span>
                  <div className="sp-framework-card-accent" aria-hidden />
                  <h3 className="sp-framework-title">{t(titleKey)}</h3>
                  <p className="sp-framework-body">{t(bodyKey)}</p>
                </article>
                {index < SOLUTIONS_ADVISORY_FRAMEWORK.length - 1 ? (
                  <div className="sp-framework-connector" aria-hidden>
                    <span className="sp-framework-connector-line" />
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
        </motion.div>
      </section>

      {/* 4 — Explore loan solutions */}
      <section
        ref={gridRef}
        id="solutions-program-grid"
        className="sp-section sp-section--grid scroll-mt-28"
        aria-labelledby="solutions-grid-heading"
      >
        <motion.div {...motionProps} className="max-w-7xl mx-auto px-6">
          <header className="max-w-3xl mx-auto text-center mb-12 lg:mb-20">
            <div className="sp-grid-accent mx-auto mb-8" aria-hidden />
            <h2
              id="solutions-grid-heading"
              className="type-editorial-section-title text-[1.85rem] sm:text-3xl lg:text-[2.5rem] text-navy leading-[1.08] mb-5"
            >
              {t("solutions.body.exploreTitle")}
            </h2>
            <p className="type-body text-slate-500 text-[1.0625rem] leading-[1.72] font-light">
              {t("solutions.disclaimer")}
            </p>
          </header>

          <div className="sp-grid-stage max-w-6xl mx-auto">
            <div className="space-y-8 md:space-y-10">
              {LOAN_GRID_ROWS.map((row) => (
                <div
                  key={row.join("-")}
                  className="grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-8 lg:gap-9 items-stretch"
                >
                  {row.map((id) => {
                    const product = getLoanProductById(id, lang);
                    if (!product) return null;
                    const isHighlighted = highlightedIds.has(id);
                    return (
                      <div key={id} className="flex h-full min-h-0 w-full solutions-program-card">
                        <LoanProductGridCard
                          product={product}
                          recentlyViewed={recentlyViewedId === id}
                          scenarioHighlighted={isHighlighted}
                          scenarioDimmed={hasHighlight && !isHighlighted}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* 5 — Smart Tools showcase */}
      <section
        className="sp-section sp-section--tools"
        aria-labelledby="solutions-tools-heading"
      >
        <motion.div {...motionProps} className="max-w-6xl mx-auto px-6">
          <header className="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
            <div className="sp-tools-accent mx-auto mb-8" aria-hidden />
            <h2
              id="solutions-tools-heading"
              className="type-editorial-section-title text-[1.85rem] sm:text-3xl lg:text-[2.5rem] text-navy leading-[1.08] mb-5"
            >
              {t("solutions.flagship.tools.title")}
            </h2>
            <p className="type-body text-slate-500 text-[1.0625rem] leading-[1.72] font-light">
              {t("solutions.flagship.tools.subtitle")}
            </p>
          </header>

          <ul className="sp-tools-grid">
            {SOLUTIONS_SMART_TOOLS_SHOWCASE.map(({ id, titleKey, bodyKey, ctaKey, path, Icon }) => (
              <li key={id}>
                <Link to={path} className="sp-tool-card group">
                  <span className="sp-tool-card-accent" aria-hidden />
                  <span className="sp-tool-icon-wrap" aria-hidden>
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  </span>
                  <h3 className="sp-tool-title">{t(titleKey)}</h3>
                  <p className="sp-tool-body">{t(bodyKey)}</p>
                  <span className="sp-tool-cta">
                    {t(ctaKey)}
                    <ArrowRight size={16} strokeWidth={2} aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* 6 — Connect with a Mortgage Advisor */}
      <section className="sp-section sp-section--ma relative overflow-hidden bg-navy" aria-labelledby="solutions-ma-heading">
        <div className="sp-ma-glow pointer-events-none absolute inset-0" aria-hidden />
        <motion.div {...motionProps} className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="sp-ma-accent mx-auto mb-8" aria-hidden />
          <h2 id="solutions-ma-heading" className="sp-ma-headline">
            {t("solutions.body.ma.headline")}
          </h2>
          <p className="sp-ma-lead">{t("solutions.body.ma.lead")}</p>
          <p className="sp-ma-subline">{t("solutions.body.ma.body")}</p>
          <div className="sp-ma-actions">
            <Link
              to="/contact?topic=loan-strategy"
              className="sp-ma-cta btn-gold inline-flex items-center justify-center gap-2.5 min-h-[52px] shadow-[0_10px_40px_rgba(197,160,89,0.28)] hover:shadow-[0_18px_52px_rgba(197,160,89,0.45)] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 transition-all duration-300"
            >
              {t("solutions.body.maCta.primary")}
              <ArrowRight size={18} strokeWidth={2} aria-hidden />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 7 — Footer transition */}
      <div className="sp-footer-bridge" aria-hidden />
    </div>
  );
}
