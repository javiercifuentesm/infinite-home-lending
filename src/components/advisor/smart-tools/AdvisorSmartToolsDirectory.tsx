import { useLanguage } from "../../../i18n/LanguageContext";
import { PAGE_CONTENT_RAIL_CLASS } from "../../../constants/layout";
import {
  getAdvisorFeaturedSmartTools,
  getAdvisorSmartToolIntentGroups,
} from "../../../data/smartToolsCatalog";
import { AdvisorSmartToolCard } from "./AdvisorSmartToolCard";

export function AdvisorSmartToolsDirectory() {
  const { t } = useLanguage();
  const featured = getAdvisorFeaturedSmartTools();
  const [primary, ...secondary] = featured;
  const groups = getAdvisorSmartToolIntentGroups({ excludeFeatured: true });

  return (
    <div className="advisor-smart-tools-directory">
      {primary ? (
        <section
          className="advisor-smart-tools-featured"
          aria-labelledby="advisor-smart-tools-featured-heading"
        >
          <div className={PAGE_CONTENT_RAIL_CLASS}>
            <header className="advisor-smart-tools-section-header advisor-smart-tools-section-header--left">
              <p className="type-eyebrow text-gold">{t("advisor.smartTools.featuredEyebrow")}</p>
              <h2
                id="advisor-smart-tools-featured-heading"
                className="advisor-smart-tools-section-header__title"
              >
                {t("advisor.smartTools.featuredTitle")}
              </h2>
              <div className="advisor-smart-tools-section-header__rule" aria-hidden />
              <p className="advisor-smart-tools-section-header__support">
                {t("advisor.smartTools.featuredSupport")}
              </p>
            </header>

            <div className="advisor-smart-tools-featured__layout">
              <div className="advisor-smart-tools-featured__primary">
                <AdvisorSmartToolCard tool={primary} variant="primary" />
              </div>
              {secondary.length > 0 ? (
                <ul className="advisor-smart-tools-featured__secondary">
                  {secondary.map((tool) => (
                    <li key={tool.id}>
                      <AdvisorSmartToolCard tool={tool} variant="secondary" />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <section
        className="advisor-smart-tools-groups"
        aria-labelledby="advisor-smart-tools-directory-heading"
      >
        <div className={PAGE_CONTENT_RAIL_CLASS}>
          <header className="advisor-smart-tools-section-header advisor-smart-tools-section-header--left">
            <p className="type-eyebrow text-gold">{t("advisor.smartTools.directoryEyebrow")}</p>
            <h2
              id="advisor-smart-tools-directory-heading"
              className="advisor-smart-tools-section-header__title"
            >
              {t("advisor.smartTools.directoryTitle")}
            </h2>
            <div className="advisor-smart-tools-section-header__rule" aria-hidden />
            <p className="advisor-smart-tools-section-header__support">
              {t("advisor.smartTools.directorySupport")}
            </p>
          </header>

          <div className="advisor-smart-tools-groups__list">
            {groups.map((group) => (
              <div key={group.intentId} className="advisor-smart-tools-group">
                <div className="advisor-smart-tools-group__label">
                  <h3 className="advisor-smart-tools-group__title">{t(group.titleKey)}</h3>
                  <div className="advisor-smart-tools-group__divider" aria-hidden />
                </div>
                <ul className="advisor-smart-tools-group__grid">
                  {group.tools.map((tool) => (
                    <li key={tool.id}>
                      <AdvisorSmartToolCard tool={tool} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="advisor-smart-tools-bridge" aria-hidden />
    </div>
  );
}
