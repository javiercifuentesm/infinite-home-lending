import { Link } from "react-router-dom";
import { useLanguage } from "../../../i18n/LanguageContext";
import { useAdvisor } from "../../../context/AdvisorContext";
import { advisorPath } from "../../../config/advisorChrome";
import { PAGE_CONTENT_RAIL_CLASS } from "../../../constants/layout";
import { getSmartToolById } from "../../../data/smartToolsCatalog";
import { AdvisorSafeLink } from "../AdvisorSafeLink";
import { trackAdvisorHomeFeaturedToolClick } from "../../../lib/advisorHomeAnalytics";

export function AdvisorHomeFeaturedTool() {
  const { advisor } = useAdvisor();
  const { t, lang } = useLanguage();
  const { featuredTool } = advisor.homepage;
  const tool = getSmartToolById(featuredTool.toolId);

  if (!tool) return null;

  const ToolIcon = tool.icon;

  return (
    <section className="advisor-home-tool" aria-labelledby="advisor-home-tool-heading">
      <div className={`${PAGE_CONTENT_RAIL_CLASS} advisor-home-tool__inner`}>
        <div className="advisor-home-tool__visual" aria-hidden="true">
          <div className="advisor-home-tool__visual-ring">
            <ToolIcon className="advisor-home-tool__visual-icon" strokeWidth={1.25} />
          </div>
          <div className="advisor-home-tool__visual-accent" />
        </div>

        <div className="advisor-home-tool__copy">
          <h2 id="advisor-home-tool-heading" className="advisor-home-tool__headline">
            {t(featuredTool.headlineKey)}
          </h2>
          <p className="advisor-home-tool__framing">{t(featuredTool.framingKey)}</p>
          <p className="advisor-home-tool__supporting">{t(featuredTool.supportingKey)}</p>
          <p className="advisor-home-tool__tool-name">{t(tool.nameKey)}</p>

          <div className="advisor-home-tool__actions">
            <AdvisorSafeLink
              to={tool.path}
              className="btn-gold advisor-home-tool__cta-primary"
              onClick={() =>
                trackAdvisorHomeFeaturedToolClick({
                  advisorSlug: advisor.slug,
                  language: lang,
                  toolId: tool.id,
                  ctaId: "try-tool",
                })
              }
            >
              {t(featuredTool.tryToolKey)}
            </AdvisorSafeLink>
            <Link
              to={advisorPath(advisor.slug, "tools")}
              className="advisor-home-tool__cta-secondary"
              onClick={() =>
                trackAdvisorHomeFeaturedToolClick({
                  advisorSlug: advisor.slug,
                  language: lang,
                  toolId: tool.id,
                  ctaId: "explore-all",
                })
              }
            >
              {t(featuredTool.exploreAllKey)}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
