import { useLanguage } from "../../i18n/LanguageContext";

/**
 * Shared compliance disclosure for every Solutions hero slide.
 * Render once in `SolutionsHeroSection` — all current and future program slides inherit it.
 */
export function SolutionsHeroDisclosure() {
  const { t } = useLanguage();

  return (
    <p className="solutions-hero-disclosure" role="note">
      {t("solutions.hero.disclosure")}
    </p>
  );
}
