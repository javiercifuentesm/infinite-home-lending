import { useEffect, useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext";
import { usePageMetadata } from "../../hooks/usePageMetadata";
import { useAdvisor } from "../../context/AdvisorContext";
import { SolutionsPageBody } from "../../components/solutions/SolutionsPageBody";
import { AdvisorLoanSolutionsIntro } from "../../components/advisor/loan-solutions/AdvisorLoanSolutionsIntro";
import { AdvisorLoanSolutionsClosingCta } from "../../components/advisor/loan-solutions/AdvisorLoanSolutionsClosingCta";
import { AdvisorLoanProgramModalProvider } from "../../components/advisor/loan-solutions/AdvisorLoanProgramModalContext";
import { AdvisorLoanProgramModal } from "../../components/advisor/loan-solutions/AdvisorLoanProgramModal";
import { ADVISOR_LOAN_GRID_ROWS } from "../../data/loanProducts";
import "../../components/solutions/solutionsPage.css";
import "../../components/advisor/loan-solutions/advisorLoanSolutions.css";

const SITE_ORIGIN = "https://www.infinitehomelending.com";

export function AdvisorLoanSolutionsPage() {
  const { advisor } = useAdvisor();
  const { t, lang } = useLanguage();
  const { seo } = advisor.loanSolutions;
  const [recentlyViewedId, setRecentlyViewedId] = useState<string | null>(null);

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
    const viewed = sessionStorage.getItem("ihl-recent-program");
    if (viewed) {
      setRecentlyViewedId(viewed);
      sessionStorage.removeItem("ihl-recent-program");
    }
  }, []);

  useEffect(() => {
    if (!recentlyViewedId) return;
    const timer = window.setTimeout(() => setRecentlyViewedId(null), 2800);
    return () => window.clearTimeout(timer);
  }, [recentlyViewedId]);

  return (
    <AdvisorLoanProgramModalProvider>
      <article className="advisor-loan-solutions-page">
        <AdvisorLoanSolutionsIntro />
        <SolutionsPageBody
          recentlyViewedId={recentlyViewedId}
          lang={lang}
          hideAdvisoryIntro
          hideMaClosing
          hideHeroHandoff
          gridRows={ADVISOR_LOAN_GRID_ROWS}
        />
        <AdvisorLoanSolutionsClosingCta />
      </article>
      <AdvisorLoanProgramModal />
    </AdvisorLoanProgramModalProvider>
  );
}
