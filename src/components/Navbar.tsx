import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronDown, Menu, Users, X } from "lucide-react";
import { useState, useEffect } from "react";
import { IHLLogo } from "./IHLLogo";
import { getAllSmartToolPaths, getSmartToolsForHub } from "../data/smartToolsCatalog";
import { useLanguage } from "../i18n/LanguageContext";
import { LanguageToggle } from "../i18n/LanguageToggle";
import { getCareersNavLink } from "../config/careersNav";

const SMART_TOOLS_HUB = "/smart-tools";
const SMART_TOOLS_ROUTES = [SMART_TOOLS_HUB, ...getAllSmartToolPaths()] as const;

function isSmartToolsSectionActive(pathname: string): boolean {
  return SMART_TOOLS_ROUTES.some((p) => pathname === p);
}

function isDealDeskActive(pathname: string): boolean {
  return pathname === "/deal-desk" || pathname.startsWith("/deal-desk/");
}

const Navbar = () => {
  const { t } = useLanguage();
  const smartToolsLinks = getSmartToolsForHub().map((tool) => ({
    nameKey: tool.nameKey,
    path: tool.path,
    blurbKey: tool.navBlurbKey,
  }));
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [smartToolsOpen, setSmartToolsOpen] = useState(false);
  const [mobileSmartToolsOpen, setMobileSmartToolsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setMobileSmartToolsOpen(false);
    setSmartToolsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen && isSmartToolsSectionActive(location.pathname)) {
      setMobileSmartToolsOpen(true);
    }
  }, [isOpen, location.pathname]);

  const pathname = location.pathname;
  const smartActive = isSmartToolsSectionActive(pathname);
  const dealDeskActive = isDealDeskActive(pathname);
  const careersNavLink = getCareersNavLink();

  const baseLink = (active: boolean) =>
    `text-[11px] font-semibold uppercase tracking-[0.14em] font-sans transition-all duration-300 whitespace-nowrap ${
      active ? "text-navy opacity-100" : "text-navy opacity-85 hover:text-gold hover:opacity-100"
    }`;

  const navLinks = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.about"), path: "/about" },
    { name: t("nav.solutions"), path: "/solutions" },
    { name: t("nav.howItWorks"), path: "/how-it-works" },
    { name: t("nav.contact"), path: "/contact" },
  ];

  return (
    <nav
      className={`site-navbar transition-shadow duration-300 ${
        scrolled ? "shadow-sm shadow-navy/5" : ""
      }`}
    >
      <div className="container navbar-inner">
        <div className="flex shrink-0 items-center">
          <Link
            to="/"
            aria-label="Infinite Home Lending"
            className="flex items-center leading-none group outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 rounded-sm"
          >
            <IHLLogo className="site-navbar-logo opacity-[0.97] transition-transform duration-500 group-hover:scale-[1.01]" />
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden min-w-0 flex-1 justify-center md:flex">
          <div className="nav-menu">
            {navLinks.slice(0, 4).map((link) => (
              <Link key={link.path} to={link.path} className={baseLink(pathname === link.path)}>
                {link.name}
              </Link>
            ))}

            <Link
              to="/knowledge-center"
              className={baseLink(pathname === "/knowledge-center")}
            >
              {t("nav.knowledge")}
            </Link>

            {/* Smart Tools — hub link + dropdown */}
            <div
              className="relative inline-flex items-center"
              onMouseEnter={() => setSmartToolsOpen(true)}
              onMouseLeave={() => setSmartToolsOpen(false)}
              onFocusCapture={() => setSmartToolsOpen(true)}
              onBlurCapture={(e) => {
                const next = e.relatedTarget as Node | null;
                if (next && e.currentTarget.contains(next)) return;
                setSmartToolsOpen(false);
              }}
            >
              <Link
                to={SMART_TOOLS_HUB}
                className={`inline-flex items-center gap-1 ${baseLink(smartActive)}`}
                aria-current={smartActive ? "page" : undefined}
                aria-expanded={smartToolsOpen}
                aria-haspopup="menu"
              >
                {t("nav.smartTools")}
                <ChevronDown
                  className={`h-3.5 w-3.5 shrink-0 self-center transition-transform duration-200 ${smartToolsOpen ? "rotate-180" : ""}`}
                  strokeWidth={2}
                  aria-hidden
                />
              </Link>

              <div
                className={`absolute left-1/2 top-full z-[1001] w-[min(calc(100vw-3rem),17.5rem)] -translate-x-1/2 pt-2 ${
                  smartToolsOpen ? "" : "hidden"
                }`}
                role="menu"
                aria-label={t("nav.smartTools")}
                aria-hidden={!smartToolsOpen}
              >
                <div className="rounded-[4px] border border-slate-200/90 bg-white py-2 shadow-[0_16px_48px_rgba(10,25,47,0.1)]">
                  {smartToolsLinks.map((item) => (
                    <Link
                      key={item.path}
                      role="menuitem"
                      to={item.path}
                      className="block px-4 py-3 transition-colors hover:bg-surface/90 focus:bg-surface/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold/30"
                      onClick={() => setSmartToolsOpen(false)}
                    >
                      <span className="block font-sans text-[12px] font-semibold uppercase tracking-[0.1em] text-navy">
                        {t(item.nameKey)}
                      </span>
                      <span className="mt-1 block text-[12px] leading-snug text-slate-500 normal-case tracking-normal font-normal">
                        {t(item.blurbKey)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {careersNavLink && (
              <Link to={careersNavLink.path} className={baseLink(pathname === careersNavLink.path)}>
                {careersNavLink.label}
              </Link>
            )}

            <Link to="/contact" className={baseLink(pathname === "/contact")}>
              {t("nav.contact")}
            </Link>
          </div>
        </div>

        <div className="nav-actions hidden md:flex">
          <LanguageToggle variant="header" />
          <Link
            to="/deal-desk"
            className="nav-btn-realtors"
            aria-current={dealDeskActive ? "page" : undefined}
          >
            <Users className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
            {t("nav.forRealtors")}
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden ml-auto text-navy p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 py-5 md:hidden shadow-xl max-h-[min(85vh,calc(100vh-5rem))] overflow-y-auto"
        >
          <div className="container flex flex-col gap-1">
          {navLinks.slice(0, 4).map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-slate-900 py-3 border-b border-slate-100/80"
            >
              {link.name}
            </Link>
          ))}

          <Link
            to="/knowledge-center"
            onClick={() => setIsOpen(false)}
            className="text-lg font-medium text-slate-900 py-3 border-b border-slate-100/80"
          >
            {t("nav.knowledge")}
          </Link>

          <div className="border-b border-slate-100/80 py-1">
            <button
              type="button"
              className="flex w-full items-center justify-between py-3 text-left text-lg font-medium text-slate-900 min-h-[48px]"
              aria-expanded={mobileSmartToolsOpen}
              onClick={() => setMobileSmartToolsOpen((v) => !v)}
            >
              <span className={smartActive ? "text-navy" : ""}>{t("nav.smartTools")}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${mobileSmartToolsOpen ? "rotate-180" : ""}`}
              />
            </button>
            {mobileSmartToolsOpen && (
              <div className="pb-3 pl-2 space-y-1 border-l-2 border-gold/25 ml-1">
                <Link
                  to={SMART_TOOLS_HUB}
                  onClick={() => setIsOpen(false)}
                  className={`block py-3 pl-3 text-base ${pathname === SMART_TOOLS_HUB ? "font-semibold text-navy" : "text-slate-700"}`}
                >
                  Overview
                </Link>
                {smartToolsLinks.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block py-3 pl-3 text-base ${pathname === item.path ? "font-semibold text-navy" : "text-slate-700"}`}
                  >
                    {t(item.nameKey)}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {careersNavLink && (
            <Link
              to={careersNavLink.path}
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-slate-900 py-3 border-b border-slate-100/80"
            >
              {careersNavLink.label}
            </Link>
          )}

          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="text-lg font-medium text-slate-900 py-3 border-b border-slate-100/80"
          >
            {t("nav.contact")}
          </Link>

          <div className="flex flex-col gap-3 py-4 border-b border-slate-100/80">
            <LanguageToggle variant="header" />
          </div>

          <Link
            to="/deal-desk"
            onClick={() => setIsOpen(false)}
            className="nav-btn-realtors w-full justify-center mt-2"
            aria-current={dealDeskActive ? "page" : undefined}
          >
            <Users className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
            {t("nav.forRealtors")}
          </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
