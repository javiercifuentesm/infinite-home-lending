import { useEffect } from "react";
import { Link } from "react-router-dom";
import { InactivityWarning } from "../components/deal-desk/InactivityWarning";
import { DealDeskHeader } from "../components/deal-desk/DealDeskHeader";
import { DealDeskHero } from "../components/deal-desk/DealDeskHero";
import { DealDeskValueProps } from "../components/deal-desk/DealDeskValueProps";
import { DealDeskToolGrid } from "../components/deal-desk/DealDeskToolGrid";
import { IntelligenceLoop } from "../components/deal-desk/IntelligenceLoop";
import Nexio from "../components/Nexio";
import { useDealDeskAuth } from "../hooks/useDealDeskAuth";
import { useDealDeskInactivity } from "../hooks/useDealDeskInactivity";
import { usePageMetadata } from "../hooks/usePageMetadata";
import { PAGE_METADATA } from "../lib/pageMetadata";

const PLAYFAIR_FONT_ID = "deal-desk-playfair-font";
const MESH_STYLE_ID = "deal-desk-mesh-keyframes";

export default function DealDesk() {
  const { isAuthenticated } = useDealDeskAuth();
  const { showWarning, resetTimer, logout } = useDealDeskInactivity();

  usePageMetadata(PAGE_METADATA.dealDesk);

  useEffect(() => {
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
      document.getElementById(MESH_STYLE_ID)?.remove();
      document.getElementById(PLAYFAIR_FONT_ID)?.remove();
    };
  }, []);

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
        <DealDeskHero />
        <IntelligenceLoop />
        <DealDeskValueProps />
        <DealDeskToolGrid />
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
        <Nexio />
      </div>
      {isAuthenticated() ? (
        <InactivityWarning showWarning={showWarning} resetTimer={resetTimer} logout={logout} />
      ) : null}
    </div>
  );
}
