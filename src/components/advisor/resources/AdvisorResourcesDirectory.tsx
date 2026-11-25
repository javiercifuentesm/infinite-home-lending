import { Fragment } from "react";
import { useLanguage } from "../../../i18n/LanguageContext";
import { PAGE_CONTENT_RAIL_CLASS } from "../../../constants/layout";
import {
  getAdvisorFeaturedResources,
  getAdvisorResourceDirectoryGroups,
  getAdvisorStartHereResources,
} from "../../../data/advisorResourcesCatalog";
import {
  AdvisorResourceChapterRow,
  AdvisorResourceFeaturedPrimary,
  AdvisorResourceFeaturedRow,
  AdvisorResourceJourneyStep,
} from "./AdvisorResourceCard";

function chapterLabel(n: number): string {
  return String(n).padStart(2, "0");
}

export function AdvisorResourcesDirectory() {
  const { t, lang } = useLanguage();
  const featured = getAdvisorFeaturedResources(lang);
  const [primary, ...secondary] = featured;
  const startHere = getAdvisorStartHereResources(lang);
  const groups = getAdvisorResourceDirectoryGroups(lang);

  const chapterRows = groups.flatMap((group) => group.resources);

  return (
    <div className="advisor-resources-directory">
      {primary ? (
        <section
          className="advisor-resources-featured"
          aria-labelledby="advisor-resources-featured-heading"
        >
          <div className={PAGE_CONTENT_RAIL_CLASS}>
            <header className="advisor-resources-section-header advisor-resources-section-header--left">
              <p className="type-eyebrow text-gold">{t("advisor.resources.featuredEyebrow")}</p>
              <h2
                id="advisor-resources-featured-heading"
                className="advisor-resources-section-header__title"
              >
                {t("advisor.resources.featuredTitle")}
              </h2>
              <div className="advisor-resources-section-header__rule" aria-hidden />
              <p className="advisor-resources-section-header__support">
                {t("advisor.resources.featuredSupport")}
              </p>
            </header>

            <div className="advisor-resources-featured__layout">
              <AdvisorResourceFeaturedPrimary resource={primary} chapter={chapterLabel(1)} />
              {secondary.length > 0 ? (
                <ul className="advisor-resources-featured__secondary">
                  {secondary.map((resource, index) => (
                    <li key={resource.routeId}>
                      <AdvisorResourceFeaturedRow
                        resource={resource}
                        chapter={chapterLabel(index + 2)}
                      />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {startHere.length > 0 ? (
        <section
          className="advisor-resources-journey"
          aria-labelledby="advisor-resources-start-heading"
        >
          <div className={PAGE_CONTENT_RAIL_CLASS}>
            <header className="advisor-resources-section-header advisor-resources-section-header--left advisor-resources-section-header--on-navy">
              <p className="type-eyebrow text-gold">{t("advisor.resources.startEyebrow")}</p>
              <h2
                id="advisor-resources-start-heading"
                className="advisor-resources-section-header__title"
              >
                {t("advisor.resources.startTitle")}
              </h2>
              <div className="advisor-resources-section-header__rule" aria-hidden />
              <p className="advisor-resources-section-header__support">
                {t("advisor.resources.startSupport")}
              </p>
            </header>

            <ol className="advisor-resources-journey__track">
              {startHere.map((resource, index) => (
                // Key on Fragment so list identity stays correct under React 19
                // typings (key is not part of custom component props).
                <Fragment key={resource.routeId}>
                  <AdvisorResourceJourneyStep
                    resource={resource}
                    step={index + 1}
                    showConnector={index < startHere.length - 1}
                  />
                </Fragment>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      <section
        className="advisor-resources-chapters"
        aria-labelledby="advisor-resources-paths-heading"
      >
        <div className={PAGE_CONTENT_RAIL_CLASS}>
          <header className="advisor-resources-section-header advisor-resources-section-header--left">
            <p className="type-eyebrow text-gold">{t("advisor.resources.directoryEyebrow")}</p>
            <h2
              id="advisor-resources-paths-heading"
              className="advisor-resources-section-header__title"
            >
              {t("advisor.resources.directoryTitle")}
            </h2>
            <div className="advisor-resources-section-header__rule" aria-hidden />
            <p className="advisor-resources-section-header__support">
              {t("advisor.resources.directorySupport")}
            </p>
          </header>

          <div className="advisor-resources-chapters__list">
            {chapterRows.map((resource, index) => (
              <Fragment key={resource.routeId}>
                <AdvisorResourceChapterRow
                  resource={resource}
                  chapter={chapterLabel(index + 4)}
                  tone={index % 2 === 0 ? "light" : "warm"}
                />
              </Fragment>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
