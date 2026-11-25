import { useEffect } from "react";
import { useLanguage } from "../../i18n/LanguageContext";
import { usePageMetadata } from "../../hooks/usePageMetadata";
import { useAdvisor } from "../../context/AdvisorContext";
import { AdvisorContactIntro } from "../../components/advisor/contact/AdvisorContactIntro";
import { AdvisorContactSchedulingStudio } from "../../components/advisor/contact/AdvisorContactSchedulingStudio";
import { AdvisorContactJourney } from "../../components/advisor/contact/AdvisorContactJourney";
import { AdvisorContactReassurance } from "../../components/advisor/contact/AdvisorContactReassurance";
import { trackAdvisorContactView } from "../../lib/advisorContactAnalytics";
import "../../components/advisor/contact/advisorContact.css";

const SITE_ORIGIN = "https://www.infinitehomelending.com";

export function AdvisorContactPage() {
  const { advisor } = useAdvisor();
  const { t, lang } = useLanguage();
  const { seo } = advisor.contact;

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

  useEffect(() => {
    document.body.classList.add("ihl-advisor-contact");
    trackAdvisorContactView({
      advisorSlug: advisor.slug,
      language: lang,
    });
    return () => {
      document.body.classList.remove("ihl-advisor-contact");
    };
  }, [advisor.slug, lang]);

  return (
    <article className="advisor-contact">
      <AdvisorContactIntro />
      <AdvisorContactSchedulingStudio />
      <AdvisorContactJourney />
      <AdvisorContactReassurance />
    </article>
  );
}
