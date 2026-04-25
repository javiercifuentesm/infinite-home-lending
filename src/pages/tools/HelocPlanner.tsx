import { useEffect } from "react";
import HelocCalculator from "../../components/tools/heloc/HelocCalculator";

const CANONICAL = "https://www.infinitehomelending.com/tools/heloc-planner";

export default function HelocPlanner() {
  useEffect(() => {
    document.title = "HELOC Calculator & Smart Planner | Is a HELOC Right for You? | Infinite Home Lending";

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
      "The most complete HELOC tool available. See your credit limit, model rate scenarios, understand the payment cliff, compare HELOC vs. home equity loan vs. cash-out refinance, and get honest advice on whether a HELOC fits your specific goal. Built for MD, DC, and VA homeowners.",
    );
    setMeta("property", "og:title", "HELOC Smart Planner — Infinite Home Lending");
    setMeta(
      "property",
      "og:description",
      "Not just a credit limit. The full picture — rate scenarios, payment cliff warning, 3-way comparison, and use-case-specific advice in one tool.",
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
      <HelocCalculator />
    </div>
  );
}
