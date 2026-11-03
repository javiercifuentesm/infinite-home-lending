import { useLanguage } from "../../i18n/LanguageContext";
import { usePageMetadata } from "../../hooks/usePageMetadata";
import { useAdvisor } from "../../context/AdvisorContext";
import { PageContainer } from "../../components/PageContainer";
import { PAGE_CONTENT_RAIL_CLASS } from "../../constants/layout";

const SITE_ORIGIN = "https://www.infinitehomelending.com";

type AdvisorPlaceholderSection =
  | "about"
  | "loan-solutions"
  | "tools"
  | "resources"
  | "contact";

const SECTION_TITLE_KEYS: Record<AdvisorPlaceholderSection, string> = {
  about: "advisor.placeholder.about",
  "loan-solutions": "advisor.placeholder.loanSolutions",
  tools: "advisor.placeholder.tools",
  resources: "advisor.placeholder.resources",
  contact: "advisor.placeholder.contact",
};

export function AdvisorPlaceholderPage({ section }: { section: AdvisorPlaceholderSection }) {
  const { advisor } = useAdvisor();
  const { t } = useLanguage();
  const advisorName = t(advisor.nameKey);
  const pageTitle = t(SECTION_TITLE_KEYS[section]);
  const canonical = `${SITE_ORIGIN}/${advisor.slug}/${section === "about" ? "about" : section}`;

  usePageMetadata({
    title: `${pageTitle} — ${advisorName}`,
    description: t("advisor.placeholder.metaDescription"),
    canonical,
  });

  return (
    <PageContainer className="bg-surface pb-24 md:pb-16">
      <div className={`${PAGE_CONTENT_RAIL_CLASS} py-16 lg:py-20`}>
        <p className="type-eyebrow text-gold">{advisorName}</p>
        <h1 className="type-section-heading text-navy mt-4">{pageTitle}</h1>
        <div className="mt-5 h-px w-12 bg-gold/60" aria-hidden />
        <p className="type-body-lg text-slate-600 mt-8 max-w-xl">{t("advisor.placeholder.body")}</p>
      </div>
    </PageContainer>
  );
}
