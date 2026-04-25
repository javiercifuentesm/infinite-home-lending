import { useEffect } from "react";
import BuyVsRentCalculator from "../../components/tools/BuyVsRentCalculator";

const CANONICAL = "https://www.infinitehomelending.com/tools/buy-vs-rent";

export default function BuyVsRent() {
  useEffect(() => {
    document.title = "Rent vs Buy Calculator | Buy vs. Rent: The Full Picture | Infinite Home Lending";

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
      "The most honest rent vs buy calculator available. See the exact year when buying beats renting, what drives the crossover, and what both paths do to your net wealth over 30 years. Built for MD, DC, and VA homebuyers.",
    );
    setMeta("property", "og:title", "Buy vs. Rent: The Full Picture — Infinite Home Lending");
    setMeta(
      "property",
      "og:description",
      "Not just a winner — the full 30-year picture. See the crossover moment, the monthly cost gap, and the honest answer for your situation.",
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
      <BuyVsRentCalculator />
    </div>
  );
}
