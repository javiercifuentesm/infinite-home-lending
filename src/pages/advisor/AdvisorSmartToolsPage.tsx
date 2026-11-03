import { useLanguage } from "../../i18n/LanguageContext";
import { usePageMetadata } from "../../hooks/usePageMetadata";
import { useAdvisor } from "../../context/AdvisorContext";
import { AdvisorSmartToolsIntro } from "../../components/advisor/smart-tools/AdvisorSmartToolsIntro";
import { AdvisorSmartToolsDirectory } from "../../components/advisor/smart-tools/AdvisorSmartToolsDirectory";
import { AdvisorSmartToolsClosingCta } from "../../components/advisor/smart-tools/AdvisorSmartToolsClosingCta";
import "../../components/advisor/smart-tools/advisorSmartTools.css";

const SITE_ORIGIN = "https://www.infinitehomelending.com";

export function AdvisorSmartToolsPage() {
  const { advisor } = useAdvisor();
  const { t } = useLanguage();
  const { seo } = advisor.smartTools;

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
    <article className="advisor-smart-tools-page">
      <AdvisorSmartToolsIntro />
      <AdvisorSmartToolsDirectory />
      <AdvisorSmartToolsClosingCta />
    </article>
  );
}
