import { Link } from "react-router-dom";
import {
  getSolutionSlideBestForKeys,
  getSolutionSlideKey,
  type SolutionSlideConfig,
} from "../../config/solutionSlides";
import { useLanguage } from "../../i18n/LanguageContext";
import { SolutionsHeroDisclosure } from "./SolutionsHeroDisclosure";

type SolutionsHeroActionStackProps = {
  slide: SolutionSlideConfig;
};

/**
 * Best For → CTA → Disclaimer rows inside the locked bottom zone.
 * Vertical gaps are governed by CSS tokens on `.solutions-hero-bottom-zone`.
 */
export function SolutionsHeroActionStack({ slide }: SolutionsHeroActionStackProps) {
  const { t } = useLanguage();
  const bestForKeys = getSolutionSlideBestForKeys(slide.id, slide.bestForCount);

  return (
    <>
      <section
        className="solutions-hero-bottom-zone__best-for"
        aria-label={t("solutions.hero.bestForLabel")}
      >
        <div className="solutions-hero-best-for">
          <span className="solutions-hero-best-for-label">{t("solutions.hero.bestForLabel")}</span>
          <ul className="solutions-hero-best-for-pills" aria-label={t("solutions.hero.bestForLabel")}>
            {bestForKeys.map((key) => (
              <li key={key}>
                <span className="solutions-hero-best-for-pill">{t(key)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="solutions-hero-bottom-zone__cta">
        <Link to={slide.ctaTo} className="hero-primary">
          {t(getSolutionSlideKey(slide.id, "cta"))}
        </Link>
      </section>

      <section className="solutions-hero-bottom-zone__disclosure">
        <SolutionsHeroDisclosure />
      </section>
    </>
  );
}
