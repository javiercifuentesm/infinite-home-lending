import { useEffect } from "react";
import FHACalculator from "../../components/tools/fha/FHACalculator";

const CANONICAL = "https://www.infinitehomelending.com/tools/conventional-vs-fha";

export default function ConventionalVsFHA() {
  useEffect(() => {
    document.title = "FHA vs. Conventional Loan Calculator 2026 | Full Cost Comparison | Infinite Home Lending";

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
      "The most complete FHA vs. conventional loan comparison. See the mortgage insurance crossover year, the FHA upgrade strategy, how your credit score changes the verdict, and a personalized recommendation. Built for MD, DC, and VA homebuyers.",
    );
    setMeta("property", "og:title", "Conventional vs. FHA: The Full Cost Comparison — Infinite Home Lending");
    setMeta(
      "property",
      "og:description",
      "Not just two monthly payments. The crossover year, PMI vs. MIP story, credit score sensitivity, and honest advice for your situation.",
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
      <FHACalculator />
    </div>
  );
}
