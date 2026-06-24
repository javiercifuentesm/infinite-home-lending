import type { SolutionSlideConfig } from "../../config/solutionSlides";
import { SolutionsHeroActionStack } from "./SolutionsHeroActionStack";
import { SolutionsHeroProgramNav } from "./SolutionsHeroProgramNav";

type SolutionsHeroBottomZoneProps = {
  slides: readonly SolutionSlideConfig[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onNavInteractionStart: () => void;
  onNavInteractionEnd: () => void;
};

/**
 * Fixed bottom zone — Best For, CTA, disclaimer, and program pills.
 * Pinned to the hero frame bottom; spacing uses shared CSS tokens only.
 */
export function SolutionsHeroBottomZone({
  slides,
  activeIndex,
  onSelect,
  onNavInteractionStart,
  onNavInteractionEnd,
}: SolutionsHeroBottomZoneProps) {
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

      <div className="solutions-hero-bottom-zone__nav">
        <SolutionsHeroProgramNav
          activeIndex={activeIndex}
          onSelect={onSelect}
          onInteractionStart={onNavInteractionStart}
          onInteractionEnd={onNavInteractionEnd}
        />
      </div>
    </div>
  );
}
