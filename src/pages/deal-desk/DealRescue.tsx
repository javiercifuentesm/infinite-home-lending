import { useEffect } from "react";
import DealDeskAssistant from "../../components/DealDeskAssistant";
import DealRescueCalculator from "../../components/deal-desk/deal-rescue/DealRescueCalculator";

const CANONICAL = "https://www.infinitehomelending.com/deal-desk/deal-rescue";

export default function DealRescue() {
  useEffect(() => {
    document.title = "The Deal Rescue Tool | The Deal Desk | Infinite Home Lending";
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
      "When financing stalls, map alternative loan paths and action steps — credit, appraisal, job change, DTI, and more.",
    );
    setMeta("property", "og:title", "The Deal Rescue Tool | The Deal Desk");
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
      <DealRescueCalculator />
      <DealDeskAssistant />
    </div>
  );
}
