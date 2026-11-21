import { Link } from "react-router-dom";
import { useLanguage } from "../../../i18n/LanguageContext";
import { useAdvisor } from "../../../context/AdvisorContext";
import { advisorPath } from "../../../config/advisorChrome";
import { PAGE_CONTENT_RAIL_CLASS } from "../../../constants/layout";
import { AdvisorApplyNowLink } from "../AdvisorApplyNowLink";
import { AdvisorAboutSectionHeader } from "../about/AdvisorAboutSectionHeader";

export function AdvisorResourcesClosingCta() {
  const { advisor } = useAdvisor();
  const { t } = useLanguage();
  const { closingCta } = advisor.resources;
  const contactHref = advisorPath(advisor.slug, "contact");

  return (
    <section
      className="advisor-resources-closing"
      aria-labelledby="advisor-resources-closing-heading"
    >
      <div className={`${PAGE_CONTENT_RAIL_CLASS} advisor-resources-closing__inner`}>
        <AdvisorAboutSectionHeader
          align="center"
          eyebrow={t(closingCta.eyebrowKey)}
          headline={t(closingCta.headlineKey)}
          id="advisor-resources-closing-heading"
          headlineClassName="advisor-resources-closing__headline text-white"
        />
        <p className="type-body-lg advisor-resources-closing__body">{t(closingCta.bodyKey)}</p>
        <div className="advisor-resources-closing__actions">
          <Link to={contactHref} className="btn-gold advisor-resources-closing__cta-primary">
            {t("advisor.cta.talkWithMe")}
          </Link>
          <AdvisorApplyNowLink className="btn-secondary advisor-resources-closing__cta-secondary !bg-transparent !text-white !border-white/70 hover:!border-gold hover:!text-gold">
            {t("advisor.cta.applyNow")}
          </AdvisorApplyNowLink>
        </div>
      </div>
    </section>
  );
}
