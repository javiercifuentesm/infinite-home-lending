import { useEffect } from "react";
import WaitingCalculator from "../../components/tools/WaitingCalculator";

const CANONICAL = "https://www.infinitehomelending.com/tools/true-cost-of-waiting";

export default function TrueCostOfWaiting() {
  useEffect(() => {
    document.title = "True Cost of Waiting to Buy a Home | Infinite Home Lending";

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
      "Find out exactly what waiting to buy a home is costing you — every month. Rent paid, home price appreciation, higher down payments, and equity missed. The honest calculator for MD, DC, and VA homebuyers.",
    );
    setMeta("property", "og:title", "The True Cost of Waiting — Infinite Home Lending");
    setMeta(
      "property",
      "og:description",
      "Every month of waiting has a real price. See it itemized, charted, and totaled — so you can make the decision with the full picture.",
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
      <WaitingCalculator />
    </div>
  );
}
