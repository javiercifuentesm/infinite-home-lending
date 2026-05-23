import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IHLLogo } from "../../IHLLogo";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function GateNav() {
  const navigate = useNavigate();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      navRef.current?.classList.toggle("scrolled", window.scrollY > 60);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav ref={navRef} className="gate-nav">
      <Link to="/" className="gate-nav__brand" aria-label="Infinite Home Lending home">
        <IHLLogo
          className="gate-nav-logo"
          alt="Infinite Home Lending"
          fetchPriority="high"
          src="/images/ihl-logo-deal-desk-lockup.png"
        />
      </Link>
      <div className="gate-nav__right">
        <button type="button" className="gate-nav__request" onClick={() => scrollToSection("gate-access")}>
          Request access
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          title="Back to main site"
          aria-label="Back to main site"
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(198,161,91,0.1)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(198,161,91,0.4)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(255,255,255,0.05)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)";
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(198,161,91,0.8)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </button>
        <span className="gate-nav__badge">Partner Portal</span>
      </div>
    </nav>
  );
}
