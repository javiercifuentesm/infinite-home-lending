import { useEffect } from "react";
import DealDeskAssistant from "../../components/DealDeskAssistant";
import LoanMatchmakerCalculator from "../../components/deal-desk/loan-matchmaker/LoanMatchmakerCalculator";

const CANONICAL = "https://www.infinitehomelending.com/deal-desk/loan-matchmaker";

export default function LoanMatchmaker() {
  useEffect(() => {
    document.title = "Loan Program Matchmaker | The Deal Desk | Infinite Home Lending";
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
      "Rank the best-fit loan programs for your buyer — Conventional, FHA, VA, USDA, Non-QM — with MD, DC, and VA programs to stack.",
    );
    setMeta("property", "og:title", "The Loan Program Matchmaker | The Deal Desk");
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
      <LoanMatchmakerCalculator />
      <DealDeskAssistant />
    </div>
  );
}
