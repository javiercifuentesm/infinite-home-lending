import { useEffect } from "react";
import { Link } from "react-router-dom";
import { DealDeskHeader } from "../components/deal-desk/DealDeskHeader";
import { DealDeskHero } from "../components/deal-desk/DealDeskHero";
import { DealDeskValueProps } from "../components/deal-desk/DealDeskValueProps";
import { DealDeskToolGrid } from "../components/deal-desk/DealDeskToolGrid";
import { DealDeskPartnerCTA } from "../components/deal-desk/DealDeskPartnerCTA";

const CANONICAL = "https://www.infinitehomelending.com/deal-desk";

const PLAYFAIR_FONT_ID = "deal-desk-playfair-font";
const MESH_STYLE_ID = "deal-desk-mesh-keyframes";

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
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = CANONICAL;

    if (!document.getElementById(PLAYFAIR_FONT_ID)) {
      const fontLink = document.createElement("link");
      fontLink.id = PLAYFAIR_FONT_ID;
      fontLink.rel = "stylesheet";
      fontLink.href =
        "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap";
      document.head.appendChild(fontLink);
    }

    if (!document.getElementById(MESH_STYLE_ID)) {
      const meshStyle = document.createElement("style");
      meshStyle.id = MESH_STYLE_ID;
      meshStyle.textContent = `
@keyframes meshDrift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -20px) scale(1.05); }
  66% { transform: translate(-20px, 15px) scale(0.98); }
}
`;
      document.head.appendChild(meshStyle);
    }

    return () => {
      document.title = "Infinite Home Lending";
      document.getElementById(MESH_STYLE_ID)?.remove();
      document.getElementById(PLAYFAIR_FONT_ID)?.remove();
    };
  }, []);

  const scrollToTools = () => {
    document.getElementById("deal-desk-tools")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B2A4A] pt-[calc(var(--site-header-height)+0.25rem)]">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <div
          className="absolute rounded-full"
          style={{
            width: "600px",
            height: "600px",
            top: "-8%",
            left: "-10%",
            background: "radial-gradient(circle closest-side, rgba(198,161,91,0.12) 0%, transparent 72%)",
            animation: "meshDrift 20s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "800px",
            height: "800px",
            bottom: "-12%",
            right: "-14%",
            background: "radial-gradient(circle closest-side, rgba(11,42,74,0.5) 0%, transparent 70%)",
            animation: "meshDrift 25s ease-in-out infinite reverse",
          }}
        />
      </div>

      <div className="relative z-10">
        <DealDeskHeader hubOnly />
        <DealDeskHero onExploreClick={scrollToTools} />
        <DealDeskValueProps />
        <DealDeskToolGrid />
        <DealDeskPartnerCTA />
        <div
          className="border-t px-4 py-8 sm:px-6"
          style={{ borderColor: "rgba(198,161,91,0.1)", backgroundColor: "transparent" }}
        >
          <p
            className="mx-auto max-w-4xl text-center font-sans text-[10px] leading-relaxed"
            style={{ color: "rgba(247,247,245,0.4)" }}
          >
            The Deal Desk tools are for licensed real estate professionals. All calculator outputs are educational estimates and do not constitute loan
            commitments. IHL is a licensed mortgage broker in MD, DC, and VA.{" "}
            <Link
              to="/deal-desk/playbook"
              className="font-semibold underline decoration-[#C6A15B]/50"
              style={{ color: "#C6A15B" }}
            >
              Agent Playbook
            </Link>
            {" · "}
            <Link
              to="/smart-tools"
              className="font-semibold underline decoration-[#C6A15B]/50"
              style={{ color: "#C6A15B" }}
            >
              Smart Tools
            </Link>{" "}
            for consumers remain available separately.
          </p>
        </div>
      </div>
    </div>
  );
}
