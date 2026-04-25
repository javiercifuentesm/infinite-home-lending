import { useCallback, useEffect, useMemo, useRef, useState, type TouchEvent } from "react";
import { Link } from "react-router-dom";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { buildHeroRotationOrder, type HeroAsset } from "../lib/heroRotation";

/**
 * All hero frames (`/images/hero-v16/*.png`) with explicit type for sequencing.
 * Run `buildHeroRotationOrder` — do not hand-shuffle; types drive house ↔ human.
 */
const HERO_ASSETS_TAGGED: readonly HeroAsset[] = [
  { src: "/images/hero-v16/02.png", type: "house" },
  { src: "/images/hero-v16/03.png", type: "human" },
  { src: "/images/hero-v16/04.png", type: "house" },
  { src: "/images/hero-v16/07.png", type: "human" },
  { src: "/images/hero-v16/08.png", type: "house" },
  { src: "/images/hero-v16/09.png", type: "human" },
  { src: "/images/hero-v16/13.png", type: "human" },
  { src: "/images/hero-v16/20.png", type: "house" },
  { src: "/images/hero-v16/21.png", type: "human" },
  { src: "/images/hero-v16/22.png", type: "human" },
  { src: "/images/hero-v16/30.png", type: "house" },
  { src: "/images/hero-v16/31.png", type: "human" },
  { src: "/images/hero-v16/34.png", type: "human" },
  { src: "/images/hero-v16/62.png", type: "human" },
  { src: "/images/hero-v16/64.png", type: "house" },
];

const HERO_ROTATION = buildHeroRotationOrder(HERO_ASSETS_TAGGED);

/** Auto-advance — pauses on hero hover; resets when slide changes (incl. thumbnail tap / swipe). */
const SLIDE_MS = 6000;
const SWIPE_MIN_PX = 50;

/**
 * Homepage hero — image stack + crossfade; thumbnail strip is primary navigation (no arrows).
 */
const THUMB_RESUME_AFTER_MS = 2500;
/** Above this count, strip uses first 8 assets ×2 to limit DOM (seamless loop still holds). */
const THUMB_STRIP_PERF_CAP = 24;

export function HeroSection() {
  const [index, setIndex] = useState(0);
  const [heroHovered, setHeroHovered] = useState(false);
  /** When true, CSS animation on the track is paused (interaction + post-interaction cooldown). */
  const [motionPaused, setMotionPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const resumeTimeoutRef = useRef<number | null>(null);
  const wheelIdleTimeoutRef = useRef<number | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  /** Ignore scroll events from programmatic scrollLeft resets (avoids pause/resume loops). */
  const programmaticScrollRef = useRef(false);

  const total = HERO_ROTATION.length;
  const safeIndex = total > 0 ? index % total : 0;

  const thumbStripSource = useMemo((): readonly HeroAsset[] => {
    if (total === 0) return [];
    if (total > THUMB_STRIP_PERF_CAP) return HERO_ROTATION.slice(0, 8);
    return HERO_ROTATION;
  }, [total]);

  const loopThumbs = useMemo(
    () => [...thumbStripSource, ...thumbStripSource],
    [thumbStripSource],
  );

  const thumbStripLen = thumbStripSource.length;

  const goNext = useCallback(() => {
    if (total <= 0) return;
    setIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    if (total <= 0) return;
    setIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const autoPaused = heroHovered || reducedMotion;

  useEffect(() => {
    if (autoPaused || total === 0) return;
    const id = window.setInterval(goNext, SLIDE_MS);
    return () => window.clearInterval(id);
  }, [autoPaused, total, goNext, safeIndex]);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimeoutRef.current !== null) {
      window.clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  }, []);

  /** After idle, clear scroll offset + restart keyframes so transform and scrollLeft never compound. */
  const scheduleResumeAfterIdle = useCallback(() => {
    clearResumeTimer();
    resumeTimeoutRef.current = window.setTimeout(() => {
      resumeTimeoutRef.current = null;
      const vp = viewportRef.current;
      const tr = trackRef.current;
      if (vp) {
        programmaticScrollRef.current = true;
        vp.scrollLeft = 0;
        window.requestAnimationFrame(() => {
          programmaticScrollRef.current = false;
        });
      }
      if (tr && !reducedMotion) {
        tr.style.animation = "none";
        void tr.offsetHeight;
        tr.style.animation = "";
      }
      setMotionPaused(false);
    }, THUMB_RESUME_AFTER_MS);
  }, [clearResumeTimer, reducedMotion]);

  const handleInteractionStart = useCallback(() => {
    clearResumeTimer();
    setMotionPaused(true);
  }, [clearResumeTimer]);

  const handleInteractionEnd = useCallback(() => {
    scheduleResumeAfterIdle();
  }, [scheduleResumeAfterIdle]);

  const handleUserScroll = useCallback(() => {
    if (programmaticScrollRef.current) return;
    setMotionPaused(true);
    scheduleResumeAfterIdle();
  }, [scheduleResumeAfterIdle]);

  const handleThumbWheel = useCallback(() => {
    handleInteractionStart();
    if (wheelIdleTimeoutRef.current !== null) {
      window.clearTimeout(wheelIdleTimeoutRef.current);
    }
    wheelIdleTimeoutRef.current = window.setTimeout(() => {
      wheelIdleTimeoutRef.current = null;
      handleInteractionEnd();
    }, 400);
  }, [handleInteractionStart, handleInteractionEnd]);

  useEffect(() => {
    return () => {
      if (wheelIdleTimeoutRef.current !== null) {
        window.clearTimeout(wheelIdleTimeoutRef.current);
      }
      clearResumeTimer();
    };
  }, [clearResumeTimer]);

  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length !== 1) return;
    const el = e.target as HTMLElement | null;
    if (el?.closest("a, button")) return;
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e: TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || e.changedTouches.length !== 1) return;
    const el = e.target as HTMLElement | null;
    if (el?.closest("a, button")) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < SWIPE_MIN_PX) return;
    if (Math.abs(dx) <= Math.abs(dy)) return;
    if (dx > 0) goPrev();
    else goNext();
  };

  const showThumbs = total > 1;

  return (
    <section
      className={`hero ${heroHovered ? "hero--paused" : ""}`}
      aria-labelledby="hero-heading"
      onMouseEnter={() => setHeroHovered(true)}
      onMouseLeave={() => setHeroHovered(false)}
    >
      <div className="hero-framed" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="hero-image-stack" aria-hidden="true">
          {HERO_ROTATION.map((asset, i) => (
            <div
              key={asset.src}
              className={`hero-image ${i === safeIndex ? "active" : "inactive"}`}
            >
              <img
                className="hero-image-img"
                src={asset.src}
                alt=""
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
              />
            </div>
          ))}
        </div>

        <div className="hero-overlay" aria-hidden="true" />

        <div className="container hero-inner">
          {total > 1 && !reducedMotion ? (
            <div className="hero-progress" aria-hidden="true">
              <div key={safeIndex} className="hero-progress-fill" />
            </div>
          ) : null}

          {showThumbs ? (
            <>
              <div className="hero-thumbnails-clip hidden md:block">
                <div
                  ref={viewportRef}
                  className="hero-thumbnail-viewport"
                  role="tablist"
                  aria-label="Hero image thumbnails"
                  onScroll={handleUserScroll}
                  onMouseDown={handleInteractionStart}
                  onMouseUp={handleInteractionEnd}
                  onMouseLeave={handleInteractionEnd}
                  onTouchStart={handleInteractionStart}
                  onTouchEnd={handleInteractionEnd}
                  onWheel={handleThumbWheel}
                  onFocusCapture={handleInteractionStart}
                  onBlurCapture={(e) => {
                    const next = e.relatedTarget as Node | null;
                    if (next && e.currentTarget.contains(next)) return;
                    handleInteractionEnd();
                  }}
                >
                  <div
                    ref={trackRef}
                    className={`hero-thumbnail-track${motionPaused ? " hero-thumbnail-track--paused" : ""}`}
                  >
                    {loopThumbs.map((asset, loopIndex) => {
                      const slideIndex = thumbStripLen > 0 ? loopIndex % thumbStripLen : 0;
                      return (
                        <button
                          key={`${asset.src}-${loopIndex}`}
                          type="button"
                          role="tab"
                          aria-selected={slideIndex === safeIndex}
                          aria-label={`Show image ${slideIndex + 1} of ${total}`}
                          onClick={() => setIndex(slideIndex)}
                        >
                          <img
                            className={slideIndex === safeIndex ? "active" : undefined}
                            src={asset.src}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            draggable={false}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          ) : null}

          <div className="hero-content">
            <div className="hero-text">
              <h1 id="hero-heading" className="hero-headline">
                Know exactly what you can afford — before you fall in love with a home.
              </h1>

              <p className="hero-subtext">A smarter, calmer way to explore your mortgage options — built around you.</p>

              <div className="hero-cta">
                <Link to="/contact" className="hero-primary">
                  Start My Pre-Approval
                </Link>
                <Link to="/solutions" className="hero-secondary">
                  Explore Loan Options
                </Link>
              </div>

              <p className="micro-trust">No obligation. No credit impact to start.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
