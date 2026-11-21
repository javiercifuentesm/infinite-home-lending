import { Link } from "react-router-dom";
import { useLanguage } from "../../../i18n/LanguageContext";
import { useAdvisor } from "../../../context/AdvisorContext";
import { advisorPath } from "../../../config/advisorChrome";
import { PAGE_CONTENT_RAIL_CLASS } from "../../../constants/layout";
import { AdvisorApplyNowLink } from "../AdvisorApplyNowLink";
import { AdvisorAboutSectionHeader } from "../about/AdvisorAboutSectionHeader";

export function AdvisorSmartToolsClosingCta() {
  const { advisor } = useAdvisor();
  const { t } = useLanguage();
  const { closingCta } = advisor.smartTools;
  const contactHref = advisorPath(advisor.slug, "contact");

  return (
    <section
      className="advisor-smart-tools-closing"
      aria-labelledby="advisor-smart-tools-closing-heading"
    >
      <div className={`${PAGE_CONTENT_RAIL_CLASS} advisor-smart-tools-closing__inner`}>
        <AdvisorAboutSectionHeader
          align="center"
          eyebrow={t(closingCta.eyebrowKey)}
          headline={t(closingCta.headlineKey)}
          id="advisor-smart-tools-closing-heading"
          headlineClassName="advisor-smart-tools-closing__headline text-white"
        />
        <p className="type-body-lg advisor-smart-tools-closing__body">{t(closingCta.bodyKey)}</p>
        <div className="advisor-smart-tools-closing__actions">
          <Link to={contactHref} className="btn-gold advisor-smart-tools-closing__cta-primary">
            {t("advisor.cta.talkWithMe")}
          </Link>
          <AdvisorApplyNowLink className="btn-secondary advisor-smart-tools-closing__cta-secondary !bg-transparent !text-white !border-white/70 hover:!border-gold hover:!text-gold">
            {t("advisor.cta.applyNow")}
          </AdvisorApplyNowLink>
        </div>
      </div>
    </section>
  );
}
