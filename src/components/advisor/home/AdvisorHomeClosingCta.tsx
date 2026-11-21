import { Link } from "react-router-dom";
import { useLanguage } from "../../../i18n/LanguageContext";
import { useAdvisor } from "../../../context/AdvisorContext";
import { advisorPath } from "../../../config/advisorChrome";
import { PAGE_CONTENT_RAIL_CLASS } from "../../../constants/layout";
import { AdvisorApplyNowLink } from "../AdvisorApplyNowLink";
import { trackAdvisorHomeCtaClick } from "../../../lib/advisorHomeAnalytics";

export function AdvisorHomeClosingCta() {
  const { advisor } = useAdvisor();
  const { t, lang } = useLanguage();
  const { closingCta } = advisor.homepage;
  const contactHref = advisorPath(advisor.slug, "contact");

  return (
    <section className="advisor-home-closing" aria-labelledby="advisor-home-closing-heading">
      <div className={`${PAGE_CONTENT_RAIL_CLASS} advisor-home-closing__inner`}>
        <h2 id="advisor-home-closing-heading" className="advisor-home-closing__headline">
          {t(closingCta.headlineKey)}
        </h2>
        <p className="advisor-home-closing__body">{t(closingCta.bodyKey)}</p>
        <div className="advisor-home-closing__actions">
          <Link
            to={contactHref}
            className="btn-gold advisor-home-closing__cta-primary"
            onClick={() =>
              trackAdvisorHomeCtaClick({
                advisorSlug: advisor.slug,
                language: lang,
                ctaId: "talk-with-alma",
              })
            }
          >
            {t(closingCta.talkWithKey)}
          </Link>
          <AdvisorApplyNowLink
            className="btn-secondary advisor-home-closing__cta-secondary !bg-transparent !text-white !border-white/70 hover:!border-gold hover:!text-gold"
            onClick={() =>
              trackAdvisorHomeCtaClick({
                advisorSlug: advisor.slug,
                language: lang,
                ctaId: "apply-now",
              })
            }
          >
            {t("advisor.cta.applyNow")}
          </AdvisorApplyNowLink>
        </div>
        <p className="advisor-home-closing__reassurance">{t(closingCta.reassuranceKey)}</p>
      </div>
    </section>
  );
}
