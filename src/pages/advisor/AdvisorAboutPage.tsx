import { useLanguage } from "../../i18n/LanguageContext";
import { usePageMetadata } from "../../hooks/usePageMetadata";
import { useAdvisor } from "../../context/AdvisorContext";
import { AdvisorAboutIntro } from "../../components/advisor/about/AdvisorAboutIntro";
import { AdvisorAboutMeet } from "../../components/advisor/about/AdvisorAboutMeet";
import { AdvisorAboutWhyIhl } from "../../components/advisor/about/AdvisorAboutWhyIhl";
import { AdvisorAboutPrinciples } from "../../components/advisor/about/AdvisorAboutPrinciples";
import { AdvisorAboutCredibility } from "../../components/advisor/about/AdvisorAboutCredibility";
import { AdvisorAboutAudiences } from "../../components/advisor/about/AdvisorAboutAudiences";
import { AdvisorAboutClosingCta } from "../../components/advisor/about/AdvisorAboutClosingCta";
import "../../components/advisor/about/advisorAbout.css";

const SITE_ORIGIN = "https://www.infinitehomelending.com";

export function AdvisorAboutPage() {
  const { advisor } = useAdvisor();
  const { t } = useLanguage();
  const { seo } = advisor.about;

  const title = t(seo.titleKey);
  const description = t(seo.descriptionKey);
  const canonical = `${SITE_ORIGIN}${seo.canonicalPath}`;

  usePageMetadata({
    title,
    description,
    canonical,
    ogTitle: title,
    ogDescription: description,
    ogUrl: canonical,
    ogImage: advisor.seo.ogImage ? `${SITE_ORIGIN}${advisor.seo.ogImage}` : undefined,
  });

  return (
    <article className="advisor-about">
      <AdvisorAboutIntro />
      <AdvisorAboutMeet />
      <AdvisorAboutWhyIhl />
      <AdvisorAboutPrinciples />
      <AdvisorAboutCredibility />
      <AdvisorAboutAudiences />
      <AdvisorAboutClosingCta />
    </article>
  );
}
