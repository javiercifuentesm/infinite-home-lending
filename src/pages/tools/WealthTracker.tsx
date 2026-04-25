import { useEffect } from "react";
import WTCalculator from "../../components/tools/wealth/WTCalculator";

const CANONICAL = "https://www.infinitehomelending.com/tools/wealth-tracker";

export default function WealthTracker() {
  useEffect(() => {
    document.title =
      "Mortgage Wealth Tracker | 30-Year Net Worth: Renting vs. Owning | Infinite Home Lending";

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
      "The most complete rent vs. own wealth comparison. Model six parallel wealth streams — equity, appreciation, PMI elimination, rent inflation protection, tax benefit, and the honest opportunity cost of your down payment. See your 30-year net worth advantage at years 5, 10, 20, and 30. Built for MD, DC, and VA homebuyers.",
    );
    setMeta(
      "property",
      "og:title",
      "The Mortgage Wealth Tracker — 30-Year Net Worth Builder | Infinite Home Lending",
    );
    setMeta(
      "property",
      "og:description",
      "Six wealth streams. Four milestones. The honest opportunity cost. See exactly how homeownership builds your net worth over 30 years — and what it takes for a renter to match it.",
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
      <WTCalculator />
    </div>
  );
}
