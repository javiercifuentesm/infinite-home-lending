import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import { useAdvisor } from "../../context/AdvisorContext";
import { advisorPath } from "../../config/advisorChrome";
import { AdvisorApplyNowLink } from "./AdvisorApplyNowLink";

type AdvisorMobileCtaBarProps = {
  hidden?: boolean;
};

export function AdvisorMobileCtaBar({ hidden = false }: AdvisorMobileCtaBarProps) {
  const { advisor } = useAdvisor();
  const { t } = useLanguage();

  if (!advisor.showMobileCtaBar || hidden) return null;

  const contactHref = advisorPath(advisor.slug, "contact");

  return (
    <div
      className="advisor-mobile-cta-bar md:hidden"
      role="region"
      aria-label={t("advisor.mobileCta.ariaLabel")}
    >
      <div className="advisor-mobile-cta-bar__inner">
        <Link to={contactHref} className="advisor-mobile-cta-bar__secondary">
          {t("advisor.cta.talkWithMe")}
        </Link>
        <AdvisorApplyNowLink className="advisor-mobile-cta-bar__primary">
          {t("advisor.cta.applyNow")}
        </AdvisorApplyNowLink>
      </div>
    </div>
  );
}
