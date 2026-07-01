import type { SolutionSlideConfig } from "../../config/solutionSlides";
import { useMobileViewport } from "../../hooks/useMobileViewport";
import { SolutionsHeroActionStack } from "./SolutionsHeroActionStack";
import { SolutionsHeroMobileNav } from "./SolutionsHeroMobileNav";
import { SolutionsHeroProgramNav } from "./SolutionsHeroProgramNav";

type SolutionsHeroBottomZoneProps = {
  slides: readonly SolutionSlideConfig[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onNavInteractionStart: () => void;
  onNavInteractionEnd: () => void;
};

/**
 * Bottom zone — Best For, CTA, disclaimer; mobile arrow nav or desktop program pills.
 */
export function SolutionsHeroBottomZone({
  slides,
  activeIndex,
  onSelect,
  onPrev,
  onNext,
  onNavInteractionStart,
  onNavInteractionEnd,
}: SolutionsHeroBottomZoneProps) {
  const isMobile = useMobileViewport();

  return (
    <div className="solutions-hero-bottom-zone">
      <div className="solutions-hero-bottom-stack">
        {slides.map((slide, i) => {
          const isActive = i === activeIndex;
          return (
            <div
              key={slide.id}
              className={`solutions-hero-bottom-panel${isActive ? " is-active" : ""}`}
              aria-hidden={!isActive}
              inert={!isActive ? true : undefined}
            >
              <SolutionsHeroActionStack slide={slide} />
            </div>
          );
        })}
      </div>

      <div
        className={`solutions-hero-bottom-zone__nav${
          isMobile ? " solutions-hero-bottom-zone__nav--mobile" : ""
        }`}
      >
        {isMobile ? (
          <SolutionsHeroMobileNav
            onPrev={onPrev}
            onNext={onNext}
            onInteractionStart={onNavInteractionStart}
            onInteractionEnd={onNavInteractionEnd}
          />
        ) : (
          <SolutionsHeroProgramNav
            activeIndex={activeIndex}
            onSelect={onSelect}
            onInteractionStart={onNavInteractionStart}
            onInteractionEnd={onNavInteractionEnd}
          />
        )}
      </div>
    </div>
  );
}
