import { useEffect } from "react";
import Nexio from "../../components/Nexio";
import LBCalculator from "../../components/deal-desk/listing-boost/LBCalculator";

const CANONICAL = "https://www.infinitehomelending.com/deal-desk/listing-boost";

export default function ListingBoost() {
  useEffect(() => {
    document.title = "Listing Boost | Buyer Pool Expansion Calculator | The Deal Desk | Infinite Home Lending";
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
      "Show sellers how many more buyers qualify with a buydown vs. a price cut. Model three concession scenarios — price reduction, 2-1 buydown, and 1-0 buydown — with buyer pool percentages, qualifying income thresholds, and seller net proceeds. Built for MD, DC, and VA real estate agents.",
    );
    setMeta("property", "og:title", "The Listing Boost — Buyer Pool Expansion Calculator");
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
      <LBCalculator />
      <Nexio />
    </div>
  );
}
