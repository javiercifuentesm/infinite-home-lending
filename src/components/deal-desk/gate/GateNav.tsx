import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { IHLLogo } from "../../IHLLogo";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function GateNav() {
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
        <span className="gate-nav__badge">Partner Portal</span>
      </div>
    </nav>
  );
}
