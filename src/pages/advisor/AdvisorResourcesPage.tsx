import { useLanguage } from "../../i18n/LanguageContext";
import { usePageMetadata } from "../../hooks/usePageMetadata";
import { useAdvisor } from "../../context/AdvisorContext";
import { AdvisorResourcesIntro } from "../../components/advisor/resources/AdvisorResourcesIntro";
import { AdvisorResourcesDirectory } from "../../components/advisor/resources/AdvisorResourcesDirectory";
import { AdvisorResourcesClosingCta } from "../../components/advisor/resources/AdvisorResourcesClosingCta";
import { AdvisorResourceModalProvider } from "../../components/advisor/resources/AdvisorResourceModalContext";
import { AdvisorResourceModal } from "../../components/advisor/resources/AdvisorResourceModal";
import "../../components/advisor/resources/advisorResources.css";

const SITE_ORIGIN = "https://www.infinitehomelending.com";

export function AdvisorResourcesPage() {
  const { advisor } = useAdvisor();
  const { t } = useLanguage();
  const { seo } = advisor.resources;

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
    <AdvisorResourceModalProvider>
      <article className="advisor-resources-page">
        <AdvisorResourcesIntro />
        <AdvisorResourcesDirectory />
        <AdvisorResourcesClosingCta />
      </article>
      <AdvisorResourceModal />
    </AdvisorResourceModalProvider>
  );
}
