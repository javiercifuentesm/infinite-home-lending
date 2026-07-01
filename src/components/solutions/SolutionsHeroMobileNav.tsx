import { ChevronLeft, ChevronRight } from "lucide-react";
import { SOLUTION_SLIDES } from "../../config/solutionSlides";
import { useLanguage } from "../../i18n/LanguageContext";

type SolutionsHeroMobileNavProps = {
  onPrev: () => void;
  onNext: () => void;
  onInteractionStart: () => void;
  onInteractionEnd: () => void;
};

export function SolutionsHeroMobileNav({
  onPrev,
  onNext,
  onInteractionStart,
  onInteractionEnd,
}: SolutionsHeroMobileNavProps) {
  const { t } = useLanguage();
  const total = SOLUTION_SLIDES.length;

  if (total <= 1) return null;

  const handlePrev = () => {
    onInteractionStart();
    onPrev();
    onInteractionEnd();
  };

  const handleNext = () => {
    onInteractionStart();
    onNext();
    onInteractionEnd();
  };

  return (
    <nav
      className="solutions-hero-mobile-nav"
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
      <button
        type="button"
        className="solutions-hero-mobile-nav__btn"
        aria-label={t("solutions.hero.navProgramPrev")}
        onClick={handlePrev}
      >
        <ChevronLeft strokeWidth={1.75} aria-hidden="true" />
      </button>
      <button
        type="button"
        className="solutions-hero-mobile-nav__btn"
        aria-label={t("solutions.hero.navProgramNext")}
        onClick={handleNext}
      >
        <ChevronRight strokeWidth={1.75} aria-hidden="true" />
      </button>
    </nav>
  );
}
