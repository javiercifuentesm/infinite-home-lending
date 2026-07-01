import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react";
import {
  SOLUTION_SLIDES,
  getSolutionSlideFeatureKeys,
  getSolutionSlideKey,
  SOLUTION_FEATURE_ICONS,
  type SolutionSlideConfig,
} from "../../config/solutionSlides";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { useLanguage } from "../../i18n/LanguageContext";
import { SolutionsHeroBottomZone } from "./SolutionsHeroBottomZone";
import { LoanHeroBadge } from "./LoanHeroBadge";

/** Matches homepage hero carousel timing (`HeroSection`). */
const SLIDE_MS = 6000;
/** Brief pause after manual pill selection — same feel as home thumbnail taps. */
const NAV_RESUME_AFTER_MS = 2500;
/** Manual pill crossfade — background completes ~250ms; content ~175ms (simultaneous start). */
const PILL_TRANSITION_MS = 280;
const SWIPE_MIN_PX = 50;

type TransitionMode = "auto" | "pill";

function SolutionSlideMain({
  slide,
  slideIndex,
  total,
  isActive,
}: {
  slide: SolutionSlideConfig;
  slideIndex: number;
  total: number;
  isActive: boolean;
}) {
  const { t, lang } = useLanguage();
  const imageAltKey = getSolutionSlideKey(slide.id, "imageAlt");
  const headlineKey = getSolutionSlideKey(slide.id, "headline");
  const headline = t(headlineKey);
  const isSplitHeadline =
    headline.includes("\n") &&
    ((lang === "es" && (slide.id === "bank-statement" || slide.id === "income1099")) ||
      (lang === "en" && slide.id === "income1099"));
  const splitHeadlineLines = isSplitHeadline ? headline.split("\n") : null;
  const splitHeadlineClass =
    lang === "es" && slide.id === "bank-statement"
      ? " solutions-hero-headline--es-bank-statement"
      : lang === "es" && slide.id === "income1099"
        ? " solutions-hero-headline--es-income1099"
        : lang === "en" && slide.id === "income1099"
          ? " solutions-hero-headline--en-income1099"
          : "";

  return (
    <div
      className="solutions-hero-slide-content"
      aria-roledescription="slide"
      aria-label={`${slideIndex + 1} of ${total}`}
    >
      <h1
        id={isActive ? "solutions-hero-heading" : undefined}
        className={`hero-headline solutions-hero-headline${isSplitHeadline ? splitHeadlineClass : ""}`}
      >
        {splitHeadlineLines ? (
          <>
            <span className="solutions-hero-headline__line">{splitHeadlineLines[0]}</span>
            <span className="solutions-hero-headline__line solutions-hero-headline__line--second">
              {splitHeadlineLines[1]}
            </span>
          </>
        ) : (
          headline
        )}
      </h1>

      <p className="hero-subtext solutions-hero-subtext">
        {t(getSolutionSlideKey(slide.id, "subheadline"))}
      </p>

      <ul className="solutions-hero-features" aria-label={t("solutions.hero.featuresLabel")}>
        {slide.features.map((feature, i) => {
          const { titleKey, descKey } = getSolutionSlideFeatureKeys(slide.id, i);
          const Icon = SOLUTION_FEATURE_ICONS[feature.icon];
          return (
            <li key={titleKey} className="solutions-hero-feature-card">
              <div className="solutions-hero-feature-icon" aria-hidden="true">
                <Icon strokeWidth={1.75} />
              </div>
              <div className="solutions-hero-feature-body">
                <p className="solutions-hero-feature-title">{t(titleKey)}</p>
                <p className="solutions-hero-feature-desc">{t(descKey)}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <span className="sr-only">{t(imageAltKey)}</span>
    </div>
  );
}

function SolutionSlidePanel({
  slide,
  slideIndex,
  total,
  isActive,
}: {
  slide: SolutionSlideConfig;
  slideIndex: number;
  total: number;
  isActive: boolean;
}) {
  const { t } = useLanguage();

  return (
    <div
      className={`solutions-hero-slide-panel${isActive ? " is-active" : ""}`}
      role="tabpanel"
      id={isActive ? "solutions-hero-panel" : undefined}
      aria-labelledby={isActive ? "solutions-hero-heading" : undefined}
      aria-hidden={!isActive}
      tabIndex={isActive ? 0 : -1}
      inert={!isActive ? true : undefined}
    >
      <div className="loan-hero-badge-row">
        <LoanHeroBadge label={t(getSolutionSlideKey(slide.id, "eyebrow"))} />
      </div>

      <div className="solutions-hero-slide-main hero-text solutions-hero-text">
        <SolutionSlideMain
          slide={slide}
          slideIndex={slideIndex}
          total={total}
          isActive={isActive}
        />
      </div>
    </div>
  );
}

export function SolutionsHeroSection() {
  const { lang, t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [heroHovered, setHeroHovered] = useState(false);
  const [navPaused, setNavPaused] = useState(false);
  const [transitionMode, setTransitionMode] = useState<TransitionMode>("auto");
  const [cinematicEnter, setCinematicEnter] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);
  const navResumeTimeoutRef = useRef<number | null>(null);
  const pillTransitionResetRef = useRef<number | null>(null);

  const total = SOLUTION_SLIDES.length;
  const safeIndex = total > 0 ? index % total : 0;
  const activeSlide = SOLUTION_SLIDES[safeIndex];

  const clearPillTransitionReset = useCallback(() => {
    if (pillTransitionResetRef.current !== null) {
      window.clearTimeout(pillTransitionResetRef.current);
      pillTransitionResetRef.current = null;
    }
  }, []);

  const beginPillTransition = useCallback(() => {
    clearPillTransitionReset();
    setTransitionMode("pill");
    pillTransitionResetRef.current = window.setTimeout(() => {
      pillTransitionResetRef.current = null;
      setTransitionMode("auto");
    }, PILL_TRANSITION_MS);
  }, [clearPillTransitionReset]);

  const goNext = useCallback(() => {
    if (total <= 0) return;
    setTransitionMode("auto");
    setCinematicEnter(true);
    setIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    if (total <= 0) return;
    setTransitionMode("auto");
    setIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const autoPaused = heroHovered || navPaused || reducedMotion;

  const clearNavResumeTimer = useCallback(() => {
    if (navResumeTimeoutRef.current !== null) {
      window.clearTimeout(navResumeTimeoutRef.current);
      navResumeTimeoutRef.current = null;
    }
  }, []);

  const scheduleNavResume = useCallback(() => {
    clearNavResumeTimer();
    navResumeTimeoutRef.current = window.setTimeout(() => {
      navResumeTimeoutRef.current = null;
      setNavPaused(false);
    }, NAV_RESUME_AFTER_MS);
  }, [clearNavResumeTimer]);

  const handleNavInteractionStart = useCallback(() => {
    clearNavResumeTimer();
    setNavPaused(true);
  }, [clearNavResumeTimer]);

  const handleNavInteractionEnd = useCallback(() => {
    scheduleNavResume();
  }, [scheduleNavResume]);

  const handleSelectProgram = useCallback(
    (nextIndex: number) => {
      if (nextIndex !== safeIndex) beginPillTransition();
      setCinematicEnter(false);
      setIndex(nextIndex);
      handleNavInteractionStart();
      scheduleNavResume();
    },
    [safeIndex, beginPillTransition, handleNavInteractionStart, scheduleNavResume],
  );

  useEffect(() => {
    if (!cinematicEnter) return;
    const id = window.setTimeout(() => setCinematicEnter(false), 600);
    return () => window.clearTimeout(id);
  }, [cinematicEnter, safeIndex]);

  useEffect(() => {
    if (autoPaused || total === 0) return;
    const id = window.setInterval(goNext, SLIDE_MS);
    return () => window.clearInterval(id);
  }, [autoPaused, total, goNext, safeIndex]);

  useEffect(() => () => clearNavResumeTimer(), [clearNavResumeTimer]);

  useEffect(() => () => clearPillTransitionReset(), [clearPillTransitionReset]);

  useEffect(() => {
    SOLUTION_SLIDES.forEach(({ imageSrc }) => {
      const img = new Image();
      img.src = imageSrc;
    });
  }, []);

  useEffect(() => {
    const region = liveRegionRef.current;
    if (!region || !activeSlide) return;
    region.textContent = `${t(activeSlide.badgeLabelKey)} — ${safeIndex + 1} / ${total}`;
  }, [safeIndex, total, activeSlide, t]);

  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length !== 1) return;
    const el = e.target as HTMLElement | null;
    if (el?.closest("a, button")) return;
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (e: TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || e.changedTouches.length !== 1) return;
    const el = e.target as HTMLElement | null;
    if (el?.closest("a, button")) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) < SWIPE_MIN_PX) return;
    if (Math.abs(dx) <= Math.abs(dy)) return;
    if (dx > 0) goPrev();
    else goNext();
  };

  return (
    <section
      lang={lang}
      className={`hero solutions-hero mb-0 pb-0 ${heroHovered || navPaused ? "hero--paused" : ""}`}
      aria-labelledby="solutions-hero-heading"
      aria-roledescription="carousel"
      onMouseEnter={() => setHeroHovered(true)}
      onMouseLeave={() => setHeroHovered(false)}
    >
      <div
        className="hero-framed solutions-hero-framed"
        data-lang={lang}
        data-active-slide={activeSlide?.id}
        data-feature-count={activeSlide?.features.length}
        data-transition={transitionMode}
        data-cinematic-enter={cinematicEnter ? "true" : "false"}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="hero-image-stack" aria-hidden="true">
          {SOLUTION_SLIDES.map((slide, i) => (
            <div
              key={slide.id}
              className={`hero-image ${i === safeIndex ? "active" : "inactive"}`}
            >
              <img
                className={`hero-image-img${
                  slide.id === "reverse"
                    ? " hero-image-img--reverse"
                    : slide.id === "conventional"
                      ? " hero-image-img--conventional"
                      : slide.id === "jumbo"
                        ? " hero-image-img--jumbo"
                        : slide.id === "bank-statement"
                          ? " hero-image-img--bank-statement"
                          : slide.id === "income1099"
                            ? " hero-image-img--income1099"
                            : ""
                }`}
                src={slide.imageSrc}
                alt=""
                loading="eager"
                fetchPriority={i === 0 ? "high" : "low"}
                decoding="async"
                draggable={false}
              />
            </div>
          ))}
        </div>

        <div className="hero-overlay solutions-hero-overlay" aria-hidden="true" />

        <div className="container hero-inner solutions-hero-inner">
          {total > 1 && !reducedMotion ? (
            <div className="hero-progress" aria-hidden="true">
              <div key={safeIndex} className="hero-progress-fill" />
            </div>
          ) : null}

          <div className="hero-content solutions-hero-content">
            <div className="solutions-hero-main-zone">
              <div className="solutions-hero-slide-stack">
                {SOLUTION_SLIDES.map((slide, i) => (
                  <SolutionSlidePanel
                    key={slide.id}
                    slide={slide}
                    slideIndex={i}
                    total={total}
                    isActive={i === safeIndex}
                  />
                ))}
              </div>
            </div>

            <SolutionsHeroBottomZone
              slides={SOLUTION_SLIDES}
              activeIndex={safeIndex}
              onSelect={handleSelectProgram}
              onPrev={goPrev}
              onNext={goNext}
              onNavInteractionStart={handleNavInteractionStart}
              onNavInteractionEnd={handleNavInteractionEnd}
            />
          </div>
        </div>
      </div>

      <div ref={liveRegionRef} className="sr-only" aria-live="polite" aria-atomic="true" />
    </section>
  );
}
