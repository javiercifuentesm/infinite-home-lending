import { useEffect } from "react";
import Nexio from "../../components/Nexio";
import CQCalculator from "../../components/deal-desk/client-qualifier/CQCalculator";

const CANONICAL = "https://www.infinitehomelending.com/deal-desk/client-qualifier";

export default function ClientQualifier() {
  useEffect(() => {
    document.title = "Client Qualifier | Pre-Showing Buyer Mortgage Snapshot | The Deal Desk | Infinite Home Lending";
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
      "Run a 90-second buyer mortgage snapshot before the first showing. Get a traffic-light readiness score, max qualifying price, loan type recommendation, payment range, and down payment gap analysis. Built for MD, DC, and VA real estate agents.",
    );
    setMeta("property", "og:title", "The Client Qualifier — Pre-Showing Mortgage Snapshot");
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
      <CQCalculator />
      <Nexio />
    </div>
  );
}
