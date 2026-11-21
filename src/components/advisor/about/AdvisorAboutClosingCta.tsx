import { Link } from "react-router-dom";
import { useLanguage } from "../../../i18n/LanguageContext";
import { useAdvisor } from "../../../context/AdvisorContext";
import { advisorPath } from "../../../config/advisorChrome";
import { PAGE_CONTENT_RAIL_CLASS } from "../../../constants/layout";
import { AdvisorApplyNowLink } from "../AdvisorApplyNowLink";

export function AdvisorAboutClosingCta() {
  const { advisor } = useAdvisor();
  const { t } = useLanguage();
  const { closingCta } = advisor.about;
  const contactHref = advisorPath(advisor.slug, "contact");

  return (
    <section className="advisor-about-closing" aria-labelledby="advisor-about-closing-heading">
      <div className={`${PAGE_CONTENT_RAIL_CLASS} advisor-about-closing__inner`}>
        <h2
          id="advisor-about-closing-heading"
          className="type-editorial-section-title text-white advisor-about-closing__headline"
        >
          {t(closingCta.headlineKey)}
        </h2>
        <p className="type-body-lg advisor-about-closing__body">{t(closingCta.bodyKey)}</p>
        <div className="advisor-about-closing__actions">
          <Link to={contactHref} className="btn-gold advisor-about-closing__cta-primary">
            {t("advisor.cta.talkWithMe")}
          </Link>
          <AdvisorApplyNowLink className="btn-secondary advisor-about-closing__cta-secondary !bg-transparent !text-white !border-white/70 hover:!border-gold hover:!text-gold">
            {t("advisor.cta.applyNow")}
          </AdvisorApplyNowLink>
        </div>
      </div>
    </section>
  );
}
