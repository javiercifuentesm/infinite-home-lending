import { Link } from "react-router-dom";
import { useLanguage } from "../../../i18n/LanguageContext";
import { useAdvisor } from "../../../context/AdvisorContext";
import { advisorPath } from "../../../config/advisorChrome";
import { PAGE_CONTENT_RAIL_CLASS } from "../../../constants/layout";
import { AdvisorApplyNowLink } from "../AdvisorApplyNowLink";
import { AdvisorAboutSectionHeader } from "../about/AdvisorAboutSectionHeader";

export function AdvisorLoanSolutionsClosingCta() {
  const { advisor } = useAdvisor();
  const { t } = useLanguage();
  const { closingCta } = advisor.loanSolutions;
  const contactHref = advisorPath(advisor.slug, "contact");

  return (
    <section
      className="advisor-loan-solutions-closing"
      aria-labelledby="advisor-loan-solutions-closing-heading"
    >
      <div className={`${PAGE_CONTENT_RAIL_CLASS} advisor-loan-solutions-closing__inner`}>
        <AdvisorAboutSectionHeader
          align="center"
          eyebrow={t(closingCta.eyebrowKey)}
          headline={t(closingCta.headlineKey)}
          id="advisor-loan-solutions-closing-heading"
          headlineClassName="advisor-loan-solutions-closing__headline text-white"
        />
        <p className="type-body-lg advisor-loan-solutions-closing__body">{t(closingCta.bodyKey)}</p>
        <div className="advisor-loan-solutions-closing__actions">
          <Link to={contactHref} className="btn-gold advisor-loan-solutions-closing__cta-primary">
            {t("advisor.cta.talkWithMe")}
          </Link>
          <AdvisorApplyNowLink className="btn-secondary advisor-loan-solutions-closing__cta-secondary !bg-transparent !text-white !border-white/70 hover:!border-gold hover:!text-gold">
            {t("advisor.cta.applyNow")}
          </AdvisorApplyNowLink>
        </div>
      </div>
    </section>
  );
}
