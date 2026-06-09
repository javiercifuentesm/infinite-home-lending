import { Link } from "react-router-dom";
import { IHLLogo } from "../IHLLogo";
import { getCareersNavLink } from "../../config/careersNav";
import { careersColors, careersFonts } from "./careersTheme";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Solutions", path: "/solutions" },
  { label: "How We Work", path: "/how-it-works" },
  { label: "Knowledge", path: "/knowledge-center" },
  { label: "Smart Tools", path: "/smart-tools" },
  { label: "Contact", path: "/contact" },
] as const;

export function CareersNav() {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(24px, 4vw, 48px)",
        height: "80px",
        background: careersColors.ivory,
        borderBottom: `0.5px solid rgba(11,42,74,0.08)`,
        flexShrink: 0,
      }}
    >
      <Link to="/" aria-label="Infinite Home Lending">
        <IHLLogo style={{ height: "48px", width: "auto", objectFit: "contain" }} />
      </Link>

      <div className="hidden items-center gap-7 xl:flex">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            to={link.path}
            style={{
              fontFamily: careersFonts.body,
              fontSize: "11px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(46,46,46,0.55)",
              textDecoration: "none",
              fontWeight: 400,
            }}
          >
            {link.label}
          </Link>
        ))}
        {careersNavLink && (
          <Link
            to={careersNavLink.path}
            style={{
              fontFamily: careersFonts.body,
              fontSize: "11px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: careersColors.gold,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            {careersNavLink.label}
          </Link>
        )}
      </div>

      <span
        className="hidden shrink-0 sm:inline"
        style={{
          fontFamily: careersFonts.body,
          fontSize: "10px",
          color: "rgba(46,46,46,0.4)",
          letterSpacing: "0.06em",
        }}
      >
        NMLS #2831765
      </span>
    </nav>
  );
}
