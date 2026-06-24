import { useEffect, useState } from "react";
import { SolutionsHeroSection } from "../components/solutions/SolutionsHeroSection";
import { SolutionsPageBody } from "../components/solutions/SolutionsPageBody";
import { PageContainer } from "../components/PageContainer";
import { useLanguage } from "../i18n/LanguageContext";
import { usePageMetadata } from "../hooks/usePageMetadata";

const Solutions = () => {
  const { t, lang } = useLanguage();
  usePageMetadata({
    title: t("solutions.meta.title"),
    description: t("solutions.meta.description"),
    canonical: "https://www.infinitehomelending.com/solutions",
  });
  const [recentlyViewedId, setRecentlyViewedId] = useState<string | null>(null);

  useEffect(() => {
    document.body.classList.add("ihl-solutions-page");
    return () => document.body.classList.remove("ihl-solutions-page");
  }, []);

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
    <>
      <SolutionsHeroSection />

      <PageContainer className="!pt-0">
        <SolutionsPageBody recentlyViewedId={recentlyViewedId} lang={lang} />
      </PageContainer>
    </>
  );
};

export default Solutions;
