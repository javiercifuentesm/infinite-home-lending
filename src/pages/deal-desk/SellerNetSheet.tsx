import { useEffect } from "react";
import Nexio from "../../components/Nexio";
import SNSCalculator from "../../components/deal-desk/seller-net-sheet/SNSCalculator";

const CANONICAL = "https://www.infinitehomelending.com/deal-desk/net-sheet";

export default function SellerNetSheet() {
  useEffect(() => {
    document.title = "Seller Net Sheet Calculator | MD DC VA Closing Costs | The Deal Desk | Infinite Home Lending";
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
      "Generate a professional seller net sheet with three price scenarios — full ask, 3% below, and 5% below — using jurisdiction-specific transfer tax rates for Montgomery County, Prince George's County, Northern Virginia, and Washington DC. Print-ready for listing appointments. Built for MD, DC, and VA real estate agents.",
    );
    setMeta("property", "og:title", "The Seller Net Sheet — MD DC VA Closing Costs");
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
      <SNSCalculator />
      <Nexio />
    </div>
  );
}
