import { useEffect } from "react";
import CreditCalculator from "../../components/tools/credit/CreditCalculator";

const CANONICAL = "https://www.infinitehomelending.com/tools/credit-score-roi";

export default function CreditScoreROI() {
  useEffect(() => {
    document.title = "Credit Score Mortgage Calculator — How Much Is Your Score Worth? | Infinite Home Lending";

    const setMeta = (attr: "name" | "property", key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta(
      "name",
      "description",
      "Find out exactly what improving your credit score is worth before you apply for a mortgage. Calculate your dollar-per-point value, monthly savings, lifetime interest savings, and get a personalized action plan. Built for MD, DC, and VA homebuyers.",
    );
    setMeta("property", "og:title", "The Credit Score ROI Calculator — Infinite Home Lending");
    setMeta(
      "property",
      "og:description",
      "Every credit score point has a dollar value. Find out yours — with a personalized savings calculation and ranked action plan.",
    );
    setMeta("property", "og:url", CANONICAL);

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = CANONICAL;

    return () => {
      document.title = "Infinite Home Lending";
    };
  }, []);

  return (
    <div
      className="
        min-h-screen border-b border-slate-200/80 bg-[#F7F7F5] font-sans
        pb-12
        pt-[calc(var(--site-header-height)+0.375rem)]
      "
    >
      <CreditCalculator />
    </div>
  );
}
