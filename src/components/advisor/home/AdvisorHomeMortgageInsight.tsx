import { Link } from "react-router-dom";
import { useLanguage } from "../../../i18n/LanguageContext";
import { useAdvisor } from "../../../context/AdvisorContext";
import { advisorPath } from "../../../config/advisorChrome";
import { PAGE_CONTENT_RAIL_CLASS } from "../../../constants/layout";
import { trackAdvisorHomeInsightClick } from "../../../lib/advisorHomeAnalytics";

export function AdvisorHomeMortgageInsight() {
  const { advisor } = useAdvisor();
  const { t, lang } = useLanguage();
  const insight = advisor.homepage.mortgageInsight;

  return (
    <section className="advisor-home-insight" aria-labelledby="advisor-home-insight-heading">
      <div className={`${PAGE_CONTENT_RAIL_CLASS} advisor-home-insight__inner`}>
        <p className="type-eyebrow text-gold advisor-home-insight__eyebrow">
          {t(insight.eyebrowKey)}
        </p>
        <blockquote className="advisor-home-insight__quote">
          <h2 id="advisor-home-insight-heading" className="advisor-home-insight__headline">
            {t(insight.headlineKey)}
          </h2>
        </blockquote>
        <p className="advisor-home-insight__body">{t(insight.bodyKey)}</p>
        <p className="advisor-home-insight__disclaimer">{t(insight.disclaimerKey)}</p>
        <Link
          to={advisorPath(advisor.slug, insight.ctaSegment)}
          className="advisor-home-insight__cta"
          onClick={() =>
            trackAdvisorHomeInsightClick({
              advisorSlug: advisor.slug,
              language: lang,
              insightId: insight.id,
            })
          }
        >
          {t(insight.ctaKey)}
        </Link>
      </div>
    </section>
  );
}
