import { useEffect } from "react";
import DealDeskAssistant from "../../components/DealDeskAssistant";
import ACCalculator from "../../components/deal-desk/assumable-calculator/ACCalculator";

const CANONICAL = "https://www.infinitehomelending.com/deal-desk/assumable-calculator";

export default function AssumableCalculator() {
  useEffect(() => {
    document.title = "Assumable Calculator | FHA VA USDA Loan Assumption | The Deal Desk | Infinite Home Lending";
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
      "Calculate whether assuming an FHA, VA, or USDA loan is worth it. Model the equity gap financing, blended rate across both loans, monthly saving vs. a new loan, and lifetime interest savings. Built for MD, DC, and VA real estate agents.",
    );
    setMeta("property", "og:title", "The Assumable Calculator — FHA VA USDA Loan Assumption");
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
    <div className="pt-[calc(var(--site-header-height)+0.25rem)]">
      <ACCalculator />
      <DealDeskAssistant />
    </div>
  );
}
