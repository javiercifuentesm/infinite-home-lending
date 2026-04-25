import { useEffect } from "react";
import { Link } from "react-router-dom";
import { DealDeskHeader } from "../components/deal-desk/DealDeskHeader";
import { DealDeskHero } from "../components/deal-desk/DealDeskHero";
import { DealDeskValueProps } from "../components/deal-desk/DealDeskValueProps";
import { DealDeskToolGrid } from "../components/deal-desk/DealDeskToolGrid";
import { DealDeskPartnerCTA } from "../components/deal-desk/DealDeskPartnerCTA";

const CANONICAL = "https://www.infinitehomelending.com/deal-desk";

export default function DealDesk() {
  useEffect(() => {
    document.title = "The Deal Desk | Realtor Partner Tools | Infinite Home Lending";
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
      "Five deal-math tools built for MD, DC, and VA real estate agents. Model buydowns, qualify buyers, build net sheets, and structure smarter offers — in real time, at the deal table. Partner with Infinite Home Lending.",
    );
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

  const scrollToTools = () => {
    document.getElementById("deal-desk-tools")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] pt-[calc(var(--site-header-height)+0.25rem)]">
      <DealDeskHeader hubOnly />
      <DealDeskHero onExploreClick={scrollToTools} />
      <DealDeskValueProps />
      <DealDeskToolGrid />
      <DealDeskPartnerCTA />
      <div className="border-t border-slate-200/80 bg-white px-4 py-8 sm:px-6">
        <p className="mx-auto max-w-4xl text-center font-sans text-[10px] leading-relaxed text-slate-500">
          The Deal Desk tools are for licensed real estate professionals. All calculator outputs are educational estimates and do not constitute loan
          commitments. IHL is a licensed mortgage broker in MD, DC, and VA.{" "}
          <Link to="/deal-desk/playbook" className="font-semibold text-[#0B2A4A] underline decoration-[#C6A15B]/40">
            Agent Playbook
          </Link>
          {" · "}
          <Link to="/smart-tools" className="font-semibold text-[#0B2A4A] underline decoration-[#C6A15B]/40">
            Smart Tools
          </Link>{" "}
          for consumers remain available separately.
        </p>
      </div>
    </div>
  );
}
