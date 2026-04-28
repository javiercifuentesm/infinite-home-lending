import { useEffect } from "react";
import Nexio from "../../components/Nexio";
import OOCalculator from "../../components/deal-desk/offer-optimizer/OOCalculator";

const CANONICAL = "https://www.infinitehomelending.com/deal-desk/offer-optimizer";

export default function OfferOptimizer() {
  useEffect(() => {
    document.title = "Offer Optimizer: Seller Concession vs. Buydown Calculator | The Deal Desk | Infinite Home Lending";
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
      "Model a price reduction vs. a seller-funded rate buydown side by side. See which concession delivers more monthly payment relief for the buyer, more net proceeds for the seller, and whether the buyer qualifies. Built for MD, DC, and VA real estate agents.",
    );
    setMeta("property", "og:title", "The Offer Optimizer — Seller Concession & Buydown Calculator");
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
      <OOCalculator />
      <Nexio />
    </div>
  );
}
