import { useMemo } from "react";
import { useLanguage } from "../../i18n/LanguageContext";
import { usePageMetadata } from "../../hooks/usePageMetadata";
import { useStructuredData, buildAdvisorPersonSchema } from "../../lib/structuredData";
import { useAdvisor } from "../../context/AdvisorContext";
import { AdvisorHero } from "../../components/advisor/AdvisorHero";
import { AdvisorHomeBody } from "../../components/advisor/home/AdvisorHomeBody";
import "../../components/advisor/home/advisorHome.css";

const SITE_ORIGIN = "https://www.infinitehomelending.com";

export function AdvisorHomePage() {
  const { advisor } = useAdvisor();
  const { t, lang } = useLanguage();

  const canonical = `${SITE_ORIGIN}${advisor.seo.canonicalPath}`;
  const title = t(advisor.seo.titleKey);
  const description = t(advisor.seo.descriptionKey);
  const ogImage = advisor.seo.ogImage
    ? `${SITE_ORIGIN}${advisor.seo.ogImage}`
    : undefined;

  usePageMetadata({
    title,
    description,
    canonical,
    ogTitle: title,
    ogDescription: description,
    ogUrl: canonical,
    ogImage,
  });

  const personSchema = useMemo(
    () =>
      buildAdvisorPersonSchema({
        name: t(advisor.nameKey),
        jobTitle: t(advisor.titleKey),
        nmlsId: advisor.nmlsId,
        url: canonical,
        image: ogImage,
        languages: advisor.languages.map((l) => (l === "es" ? "Spanish" : "English")),
        email: advisor.email,
        linkedin: advisor.social?.linkedin,
      }),
    [advisor, t, canonical, ogImage],
  );

  useStructuredData(personSchema);

  return (
    <>
      <AdvisorHero />
      <AdvisorHomeBody />
      <span className="sr-only" lang={lang}>
        {description}
      </span>
    </>
  );
}
