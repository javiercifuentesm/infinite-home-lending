import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { SOLUTION_SLIDES } from "../../config/solutionSlides";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { useLanguage } from "../../i18n/LanguageContext";

const PILL_SCROLL_MS = 350;
const LOOP_COPIES = 3;
/** Default desktop window: Conventional (0) through FHA 203(k) (5). */
const DEFAULT_WINDOW_START_INDEX = 0;
const DEFAULT_WINDOW_END_INDEX = 5;
const DEFAULT_WINDOW_SIZE =
  DEFAULT_WINDOW_END_INDEX - DEFAULT_WINDOW_START_INDEX + 1;
const DESKTOP_CLIP_MQ = "(min-width: 769px)";
const MOBILE_CLIP_MQ = "(max-width: 767px)";
/** English mobile — show two full pills in the clip viewport. */
const MOBILE_WINDOW_SIZE = 2;
/** Chevron click scrolls ~2 pills for a smooth discoverability nudge. */
const HINT_SCROLL_PILLS = 2;
const MOBILE_HINT_SCROLL_PILLS = 1;

type ClipMode = "desktop" | "mobile-en" | "none";

function getClipMode(lang: string): ClipMode {
  if (typeof window === "undefined") return "none";
  if (window.matchMedia(DESKTOP_CLIP_MQ).matches) return "desktop";
  if (lang === "en" && window.matchMedia(MOBILE_CLIP_MQ).matches) return "mobile-en";
  return "none";
}

function getWindowSize(lang: string, total: number): number {
  const mode = getClipMode(lang);
  if (mode === "desktop") return DEFAULT_WINDOW_SIZE;
  if (mode === "mobile-en") return MOBILE_WINDOW_SIZE;
  return total;
}

type PillScrollAlign = "center" | "start" | "end";

type SolutionsHeroProgramNavProps = {
  activeIndex: number;
  onSelect: (index: number) => void;
  onInteractionStart: () => void;
  onInteractionEnd: () => void;
};

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

export function SolutionsHeroProgramNav({
  activeIndex,
  onSelect,
  onInteractionStart,
  onInteractionEnd,
}: SolutionsHeroProgramNavProps) {
  const { t, lang } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scrollAnimRef = useRef<number | null>(null);
  const programmaticScrollRef = useRef(false);
  const normalizeRafRef = useRef<number | null>(null);
  const isFirstScrollRef = useRef(true);
  const prevLangRef = useRef(lang);

  const total = SOLUTION_SLIDES.length;
  const loopLength = total * LOOP_COPIES;

  const loopSlides = useMemo(
    () =>
      Array.from({ length: loopLength }, (_, loopIndex) => ({
        loopIndex,
        slideIndex: loopIndex % total,
        slide: SOLUTION_SLIDES[loopIndex % total],
      })),
    [loopLength, total],
  );

  const middleLoopIndex = (slideIndex: number) => total + slideIndex;

  const cancelScrollAnim = useCallback(() => {
    if (scrollAnimRef.current !== null) {
      cancelAnimationFrame(scrollAnimRef.current);
      scrollAnimRef.current = null;
      programmaticScrollRef.current = false;
    }
  }, []);

  const getPillCenterInTrack = useCallback((pill: HTMLButtonElement) => {
    const track = trackRef.current;
    if (!track) return pill.offsetLeft + pill.offsetWidth / 2;
    return pill.offsetLeft - track.offsetLeft + pill.offsetWidth / 2;
  }, []);

  const getPillLeftInTrack = useCallback(
    (pill: HTMLButtonElement) => getPillCenterInTrack(pill) - pill.offsetWidth / 2,
    [getPillCenterInTrack],
  );

  const getPillRightInTrack = useCallback(
    (pill: HTMLButtonElement) => getPillLeftInTrack(pill) + pill.offsetWidth,
    [getPillLeftInTrack],
  );

  const measureWindowSpan = useCallback(
    (startSlideIndex: number, endSlideIndex: number) => {
      const startPill = pillRefs.current[middleLoopIndex(startSlideIndex)];
      const endPill = pillRefs.current[middleLoopIndex(endSlideIndex)];
      if (!startPill || !endPill) return null;
      const span = getPillRightInTrack(endPill) - getPillLeftInTrack(startPill);
      return span > 0 ? Math.ceil(span) : null;
    },
    [getPillLeftInTrack, getPillRightInTrack, total],
  );

  const applyClipWidth = useCallback((startSlideIndex: number) => {
    const clip = clipRef.current;
    if (!clip) return;

    const mode = getClipMode(lang);
    if (mode === "none") {
      clip.style.removeProperty("width");
      clip.removeAttribute("data-fit-window");
      return;
    }

    const windowSize = mode === "desktop" ? DEFAULT_WINDOW_SIZE : MOBILE_WINDOW_SIZE;
    const endSlideIndex = Math.min(total - 1, startSlideIndex + windowSize - 1);
    const span = measureWindowSpan(startSlideIndex, endSlideIndex);
    if (!span) return;

    const clipBuffer = mode === "mobile-en" ? 4 : 0;
    const maxWidth = clip.parentElement?.clientWidth ?? span;
    clip.style.width = `${Math.min(span + clipBuffer, maxWidth)}px`;
    clip.dataset.fitWindow = mode;
  }, [lang, measureWindowSpan, total]);

  const computeWindowStartSlide = useCallback(
    (slideIndex: number) => {
      const mode = getClipMode(lang);
      const windowSize = getWindowSize(lang, total);
      const maxStart = Math.max(0, total - windowSize);

      if (mode === "mobile-en") {
        return Math.min(Math.max(0, slideIndex - 1), maxStart);
      }

      if (slideIndex <= 2) return 0;
      if (slideIndex >= total - 3) return maxStart;
      return slideIndex - 2;
    },
    [lang, total],
  );

  const getCopySpan = useCallback(() => {
    const first = pillRefs.current[0];
    const middleFirst = pillRefs.current[total];
    if (!first || !middleFirst) return 0;
    return getPillCenterInTrack(middleFirst) - getPillCenterInTrack(first);
  }, [getPillCenterInTrack, total]);

  const setScrollLeftInstant = useCallback((value: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    programmaticScrollRef.current = true;
    viewport.scrollLeft = value;
    requestAnimationFrame(() => {
      programmaticScrollRef.current = false;
    });
  }, []);

  const normalizeScrollPosition = useCallback(() => {
    if (scrollAnimRef.current !== null) return;

    const viewport = viewportRef.current;
    const span = getCopySpan();
    if (!viewport || span <= 0) return;

    const viewCenter = viewport.scrollLeft + viewport.clientWidth / 2;
    let closestLoop = 0;
    let closestDist = Infinity;

    for (let i = 0; i < loopLength; i++) {
      const pill = pillRefs.current[i];
      if (!pill) continue;
      const pillCenter = getPillCenterInTrack(pill);
      const dist = Math.abs(pillCenter - viewCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestLoop = i;
      }
    }

    if (closestLoop < total) {
      setScrollLeftInstant(viewport.scrollLeft + span);
    } else if (closestLoop >= 2 * total) {
      setScrollLeftInstant(viewport.scrollLeft - span);
    }
  }, [getCopySpan, getPillCenterInTrack, loopLength, setScrollLeftInstant, total]);

  const scrollToLoopIndex = useCallback(
    (loopIndex: number, align: PillScrollAlign, instant: boolean) => {
      const viewport = viewportRef.current;
      const pill = pillRefs.current[loopIndex];
      if (!viewport || !pill) return;

      const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      const pillCenter = getPillCenterInTrack(pill);
      const pillLeft = getPillLeftInTrack(pill);
      const pillRight = pillLeft + pill.offsetWidth;
      const rawTarget =
        align === "start"
          ? pillLeft
          : align === "end"
            ? pillRight - viewport.clientWidth
            : pillCenter - viewport.clientWidth / 2;
      const target = Math.max(0, Math.min(maxScroll, rawTarget));

      const finish = () => {
        normalizeScrollPosition();
      };

      if (instant || reducedMotion) {
        cancelScrollAnim();
        setScrollLeftInstant(target);
        finish();
        return;
      }

      cancelScrollAnim();
      const start = viewport.scrollLeft;
      const delta = target - start;
      if (Math.abs(delta) < 1) {
        finish();
        return;
      }

      const startTime = performance.now();
      programmaticScrollRef.current = true;

      const step = (now: number) => {
        const progress = Math.min(1, (now - startTime) / PILL_SCROLL_MS);
        viewport.scrollLeft = start + delta * easeOutCubic(progress);
        if (progress < 1) {
          scrollAnimRef.current = requestAnimationFrame(step);
        } else {
          scrollAnimRef.current = null;
          programmaticScrollRef.current = false;
          finish();
        }
      };

      scrollAnimRef.current = requestAnimationFrame(step);
    },
    [
      cancelScrollAnim,
      getPillCenterInTrack,
      getPillLeftInTrack,
      normalizeScrollPosition,
      reducedMotion,
      setScrollLeftInstant,
    ],
  );

  const scrollToWindow = useCallback(
    (startSlideIndex: number, instant: boolean) => {
      applyClipWidth(startSlideIndex);
      scrollToLoopIndex(middleLoopIndex(startSlideIndex), "start", instant);
    },
    [applyClipWidth, scrollToLoopIndex, total],
  );

  const scrollToDefaultWindow = useCallback(
    (instant: boolean) => {
      scrollToWindow(DEFAULT_WINDOW_START_INDEX, instant);
    },
    [scrollToWindow],
  );

  const scrollToActiveWindow = useCallback(
    (instant: boolean) => {
      scrollToWindow(computeWindowStartSlide(activeIndex), instant);
    },
    [activeIndex, computeWindowStartSlide, scrollToWindow],
  );

  const findAnchorLoopIndex = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return middleLoopIndex(DEFAULT_WINDOW_START_INDEX);

    const viewLeft = viewport.scrollLeft;
    let anchorLoop = middleLoopIndex(DEFAULT_WINDOW_START_INDEX);
    let closestDist = Infinity;

    for (let i = 0; i < loopLength; i++) {
      const pill = pillRefs.current[i];
      if (!pill) continue;
      const pillLeft = getPillLeftInTrack(pill);
      const dist = Math.abs(pillLeft - viewLeft);
      if (dist < closestDist) {
        closestDist = dist;
        anchorLoop = i;
      }
    }

    return anchorLoop;
  }, [getPillLeftInTrack, loopLength, total]);

  const scrollByPills = useCallback(
    (direction: -1 | 1) => {
      const anchorLoop = findAnchorLoopIndex();
      const anchorSlide = anchorLoop % total;
      const windowSize = getWindowSize(lang, total);
      const hintScroll = getClipMode(lang) === "mobile-en" ? MOBILE_HINT_SCROLL_PILLS : HINT_SCROLL_PILLS;
      const nextStart = Math.max(
        0,
        Math.min(
          total - windowSize,
          anchorSlide + direction * hintScroll,
        ),
      );
      scrollToWindow(nextStart, !reducedMotion);
    },
    [findAnchorLoopIndex, lang, reducedMotion, scrollToWindow, total],
  );

  const handleHintClick = useCallback(
    (direction: -1 | 1) => {
      onInteractionStart();
      scrollByPills(direction);
      onInteractionEnd();
    },
    [onInteractionEnd, onInteractionStart, scrollByPills],
  );

  useLayoutEffect(() => {
    const isInitial = isFirstScrollRef.current;
    const langChanged = prevLangRef.current !== lang;
    const instant = isInitial || langChanged;
    const useDefaultWindow =
      activeIndex === DEFAULT_WINDOW_START_INDEX && (isInitial || langChanged);

    if (useDefaultWindow) {
      scrollToDefaultWindow(instant);
    } else {
      scrollToActiveWindow(instant);
    }

    isFirstScrollRef.current = false;
    prevLangRef.current = lang;
  }, [activeIndex, lang, scrollToActiveWindow, scrollToDefaultWindow]);

  useEffect(() => {
    const onResize = () => {
      if (activeIndex === DEFAULT_WINDOW_START_INDEX) {
        scrollToDefaultWindow(true);
      } else {
        scrollToActiveWindow(true);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeIndex, scrollToActiveWindow, scrollToDefaultWindow]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onScroll = () => {
      if (programmaticScrollRef.current || scrollAnimRef.current !== null) return;
      if (normalizeRafRef.current !== null) {
        cancelAnimationFrame(normalizeRafRef.current);
      }
      normalizeRafRef.current = requestAnimationFrame(() => {
        normalizeRafRef.current = null;
        normalizeScrollPosition();
        if (programmaticScrollRef.current || scrollAnimRef.current !== null) return;
        const anchorLoop = findAnchorLoopIndex();
        const anchorSlide = anchorLoop % total;
        const viewport = viewportRef.current;
        const pill = pillRefs.current[middleLoopIndex(anchorSlide)];
        if (!viewport || !pill) return;
        const pillLeft = getPillLeftInTrack(pill);
        if (Math.abs(viewport.scrollLeft - pillLeft) > 2) {
          const windowSize = getWindowSize(lang, total);
          const startSlide = Math.max(
            0,
            Math.min(total - windowSize, anchorSlide),
          );
          scrollToWindow(startSlide, false);
        }
      });
    };

    viewport.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      viewport.removeEventListener("scroll", onScroll);
      if (normalizeRafRef.current !== null) {
        cancelAnimationFrame(normalizeRafRef.current);
      }
    };
  }, [findAnchorLoopIndex, getPillLeftInTrack, lang, normalizeScrollPosition, scrollToWindow, total]);

  useEffect(() => () => cancelScrollAnim(), [cancelScrollAnim]);

  if (total <= 1) return null;

  pillRefs.current.length = loopLength;

  return (
    <nav
      className="solutions-hero-program-nav"
      aria-label={t("solutions.hero.navLabel")}
      onMouseEnter={onInteractionStart}
      onMouseLeave={onInteractionEnd}
      onFocusCapture={onInteractionStart}
      onBlurCapture={(e) => {
        const next = e.relatedTarget as Node | null;
        if (next && e.currentTarget.contains(next)) return;
        onInteractionEnd();
      }}
    >
      <div className="solutions-hero-badges-shell">
        <button
          type="button"
          className={`solutions-hero-pill-hint solutions-hero-pill-hint--prev${reducedMotion ? " solutions-hero-pill-hint--static" : ""}`}
          aria-label={t("solutions.hero.navScrollPrev")}
          onClick={() => handleHintClick(-1)}
        >
          <span className="solutions-hero-pill-hint-glyph" aria-hidden="true">
            ‹
          </span>
        </button>
        <div ref={clipRef} className="solutions-hero-badges-clip">
          <div
            ref={viewportRef}
            className="solutions-hero-badges-viewport"
            onTouchStart={onInteractionStart}
            onTouchEnd={onInteractionEnd}
          >
            <div ref={trackRef} className="solutions-hero-badges" role="tablist">
              {loopSlides.map(({ loopIndex, slideIndex, slide }) => {
                const selected = slideIndex === activeIndex;
                const isCanonical = loopIndex === middleLoopIndex(slideIndex);

                return (
                  <button
                    key={`${slide.id}-${loopIndex}`}
                    ref={(el) => {
                      pillRefs.current[loopIndex] = el;
                    }}
                    type="button"
                    role="tab"
                    id={isCanonical ? `solutions-hero-tab-${slide.id}` : undefined}
                    aria-selected={selected}
                    aria-controls={isCanonical ? "solutions-hero-panel" : undefined}
                    tabIndex={selected && loopIndex === middleLoopIndex(activeIndex) ? 0 : -1}
                    className={`solutions-hero-badge${selected ? " solutions-hero-badge--active" : ""}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => onSelect(slideIndex)}
                  >
                    <span className="solutions-hero-badge-emoji" aria-hidden="true">
                      {slide.badgeEmoji}
                    </span>
                    <span>{t(slide.badgeLabelKey)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <button
          type="button"
          className={`solutions-hero-pill-hint solutions-hero-pill-hint--next${reducedMotion ? " solutions-hero-pill-hint--static" : ""}`}
          aria-label={t("solutions.hero.navScrollNext")}
          onClick={() => handleHintClick(1)}
        >
          <span className="solutions-hero-pill-hint-glyph" aria-hidden="true">
            ›
          </span>
        </button>
      </div>
    </nav>
  );
}
