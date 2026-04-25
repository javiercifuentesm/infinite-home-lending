import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { BookOpen, ChevronDown, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { IHLLogo } from "./IHLLogo";
import { getAllSmartToolPaths, getSmartToolsForHub } from "../data/smartToolsCatalog";

const SMART_TOOLS_HUB = "/smart-tools";
const SMART_TOOLS_ROUTES = [SMART_TOOLS_HUB, ...getAllSmartToolPaths()] as const;

const smartToolsLinks = getSmartToolsForHub().map((t) => ({
  name: t.name,
  path: t.path,
  blurb: t.navBlurb,
}));

function isSmartToolsSectionActive(pathname: string): boolean {
  return SMART_TOOLS_ROUTES.some((p) => pathname === p);
}

function isDealDeskActive(pathname: string): boolean {
  return pathname === "/deal-desk" || pathname.startsWith("/deal-desk/");
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [smartToolsOpen, setSmartToolsOpen] = useState(false);
  const [mobileSmartToolsOpen, setMobileSmartToolsOpen] = useState(false);
  const [dealDeskOpen, setDealDeskOpen] = useState(false);
  const [mobileDealDeskOpen, setMobileDealDeskOpen] = useState(false);
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
    setDealDeskOpen(false);
    setMobileDealDeskOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen && isSmartToolsSectionActive(location.pathname)) {
      setMobileSmartToolsOpen(true);
    }
  }, [isOpen, location.pathname]);

  useEffect(() => {
    if (isOpen && isDealDeskActive(location.pathname)) {
      setMobileDealDeskOpen(true);
    }
  }, [isOpen, location.pathname]);

  const pathname = location.pathname;
  const smartActive = isSmartToolsSectionActive(pathname);
  const dealDeskActive = isDealDeskActive(pathname);

  const baseLink = (active: boolean) =>
    `text-[11px] font-semibold uppercase tracking-[0.14em] font-sans transition-all duration-300 whitespace-nowrap ${
      active ? "text-navy opacity-100" : "text-navy opacity-85 hover:text-gold hover:opacity-100"
    }`;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Loan Solutions", path: "/solutions" },
    { name: "How We Work", path: "/how-it-works" },
    { name: "Contact Us", path: "/contact" },
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
              Knowledge
            </Link>

            {/* Deal Desk — hub + dropdown */}
            <div
              className="relative pb-2"
              onMouseEnter={() => setDealDeskOpen(true)}
              onMouseLeave={() => setDealDeskOpen(false)}
              onFocusCapture={() => setDealDeskOpen(true)}
              onBlurCapture={(e) => {
                const next = e.relatedTarget as Node | null;
                if (next && e.currentTarget.contains(next)) return;
                setDealDeskOpen(false);
              }}
            >
              <Link
                to="/deal-desk"
                className={`inline-flex items-center gap-1 ${baseLink(dealDeskActive)}`}
                aria-current={dealDeskActive ? "page" : undefined}
                aria-expanded={dealDeskOpen}
                aria-haspopup="menu"
              >
                <span className="inline-flex items-center gap-1.5">
                  Deal Desk
                  <span
                    className="rounded bg-[#C6A15B]/20 px-1.5 py-0.5 font-sans text-[8px] font-bold uppercase tracking-wider text-[#8b6914]"
                    title="For real estate professionals"
                  >
                    Agent
                  </span>
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${dealDeskOpen ? "rotate-180" : ""}`}
                  strokeWidth={2}
                  aria-hidden
                />
              </Link>

              <div
                className={`absolute left-1/2 top-full z-[1001] w-[min(calc(100vw-3rem),14rem)] -translate-x-1/2 pt-2 ${
                  dealDeskOpen ? "" : "hidden"
                }`}
                role="menu"
                aria-label="Deal Desk"
                aria-hidden={!dealDeskOpen}
              >
                <div className="rounded-[4px] border border-slate-200/90 bg-white py-2 shadow-[0_16px_48px_rgba(10,25,47,0.1)]">
                  <Link
                    role="menuitem"
                    to="/deal-desk"
                    className={`block px-4 py-2.5 font-sans text-[12px] font-semibold uppercase tracking-[0.1em] text-navy transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold/30 ${
                      pathname === "/deal-desk" ? "bg-slate-50" : ""
                    }`}
                    onClick={() => setDealDeskOpen(false)}
                  >
                    All Tools
                  </Link>
                  <Link
                    role="menuitem"
                    to="/deal-desk/playbook"
                    className={`block border-l-[3px] border-[#C6A15B]/70 px-4 py-2.5 pl-[13px] transition-colors hover:bg-[#C6A15B]/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold/30 ${
                      pathname === "/deal-desk/playbook" ? "bg-[#C6A15B]/10" : ""
                    }`}
                    onClick={() => setDealDeskOpen(false)}
                  >
                    <span className="flex items-start gap-2">
                      <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#9a7a2a]" aria-hidden />
                      <span>
                        <span className="block font-sans text-[12px] font-semibold uppercase tracking-[0.1em] text-navy">
                          Agent Playbook
                        </span>
                        <span className="mt-0.5 block font-sans text-[10px] font-normal normal-case leading-snug tracking-normal text-slate-500">
                          How the suite works — start here
                        </span>
                      </span>
                    </span>
                  </Link>
                  <Link
                    role="menuitem"
                    to="/deal-desk/offer-optimizer"
                    className="block px-4 py-2.5 font-sans text-[12px] font-semibold uppercase tracking-[0.1em] text-navy transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold/30"
                    onClick={() => setDealDeskOpen(false)}
                  >
                    Offer Optimizer
                  </Link>
                  <Link
                    role="menuitem"
                    to="/deal-desk/client-qualifier"
                    className="block px-4 py-2.5 font-sans text-[12px] font-semibold uppercase tracking-[0.1em] text-navy transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold/30"
                    onClick={() => setDealDeskOpen(false)}
                  >
                    Client Qualifier
                  </Link>
                  <Link
                    role="menuitem"
                    to="/deal-desk/listing-boost"
                    className="block px-4 py-2.5 font-sans text-[12px] font-semibold uppercase tracking-[0.1em] text-navy transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold/30"
                    onClick={() => setDealDeskOpen(false)}
                  >
                    Listing Boost
                  </Link>
                  <Link
                    role="menuitem"
                    to="/deal-desk/assumable-calculator"
                    className="block px-4 py-2.5 font-sans text-[12px] font-semibold uppercase tracking-[0.1em] text-navy transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold/30"
                    onClick={() => setDealDeskOpen(false)}
                  >
                    Assumable Calculator
                  </Link>
                  <Link
                    role="menuitem"
                    to="/deal-desk/net-sheet"
                    className="block px-4 py-2.5 font-sans text-[12px] font-semibold uppercase tracking-[0.1em] text-navy transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold/30"
                    onClick={() => setDealDeskOpen(false)}
                  >
                    Seller Net Sheet
                  </Link>
                </div>
              </div>
            </div>

            {/* Smart Tools — hub link + dropdown */}
            <div
              className="relative pb-2"
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
                Smart Tools
                <ChevronDown
                  className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${smartToolsOpen ? "rotate-180" : ""}`}
                  strokeWidth={2}
                  aria-hidden
                />
              </Link>

              <div
                className={`absolute left-1/2 top-full z-[1001] w-[min(calc(100vw-3rem),17.5rem)] -translate-x-1/2 pt-2 ${
                  smartToolsOpen ? "" : "hidden"
                }`}
                role="menu"
                aria-label="Smart Tools"
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
                        {item.name}
                      </span>
                      <span className="mt-1 block text-[12px] leading-snug text-slate-500 normal-case tracking-normal font-normal">
                        {item.blurb}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link to="/contact" className={baseLink(pathname === "/contact")}>
              Contact Us
            </Link>
          </div>
        </div>

        <div className="nav-cta hidden md:flex">
          <Link
            to="/contact"
            className="btn-primary !px-10 !py-4 shadow-xl shadow-navy/10 whitespace-nowrap"
          >
            Start Pre-Approval
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
            Knowledge
          </Link>

          <div className="border-b border-slate-100/80 py-1">
            <button
              type="button"
              className="flex w-full items-center justify-between py-3 text-left text-lg font-medium text-slate-900 min-h-[48px]"
              aria-expanded={mobileDealDeskOpen}
              onClick={() => setMobileDealDeskOpen((v) => !v)}
            >
              <span className={`flex items-center gap-2 ${dealDeskActive ? "text-navy" : ""}`}>
                Deal Desk
                <span className="rounded bg-[#C6A15B]/25 px-1.5 py-0.5 text-[10px] font-bold uppercase text-[#8b6914]">Agent</span>
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${mobileDealDeskOpen ? "rotate-180" : ""}`}
              />
            </button>
            {mobileDealDeskOpen && (
              <div className="pb-3 pl-2 space-y-1 border-l-2 border-[#C6A15B]/25 ml-1">
                <Link
                  to="/deal-desk"
                  onClick={() => setIsOpen(false)}
                  className={`block py-3 pl-3 text-base ${
                    pathname === "/deal-desk" ? "font-semibold text-navy" : "text-slate-700"
                  }`}
                >
                  All Tools
                </Link>
                <Link
                  to="/deal-desk/playbook"
                  onClick={() => setIsOpen(false)}
                  className={`block border-l-[3px] border-[#C6A15B]/70 py-3 pl-3 ${pathname === "/deal-desk/playbook" ? "bg-[#C6A15B]/10" : ""}`}
                >
                  <span className="flex items-start gap-2">
                    <BookOpen className="mt-1 h-4 w-4 shrink-0 text-[#9a7a2a]" aria-hidden />
                    <span>
                      <span className={`block ${pathname === "/deal-desk/playbook" ? "font-semibold text-navy" : "text-slate-700"}`}>
                        Agent Playbook
                      </span>
                      <span className="mt-0.5 block text-[12px] font-normal leading-snug text-slate-500">How the suite works</span>
                    </span>
                  </span>
                </Link>
                <Link
                  to="/deal-desk/offer-optimizer"
                  onClick={() => setIsOpen(false)}
                  className={`block py-3 pl-3 text-base ${pathname === "/deal-desk/offer-optimizer" ? "font-semibold text-navy" : "text-slate-700"}`}
                >
                  Offer Optimizer
                </Link>
                <Link
                  to="/deal-desk/client-qualifier"
                  onClick={() => setIsOpen(false)}
                  className={`block py-3 pl-3 text-base ${pathname === "/deal-desk/client-qualifier" ? "font-semibold text-navy" : "text-slate-700"}`}
                >
                  Client Qualifier
                </Link>
                <Link
                  to="/deal-desk/listing-boost"
                  onClick={() => setIsOpen(false)}
                  className={`block py-3 pl-3 text-base ${pathname === "/deal-desk/listing-boost" ? "font-semibold text-navy" : "text-slate-700"}`}
                >
                  Listing Boost
                </Link>
                <Link
                  to="/deal-desk/assumable-calculator"
                  onClick={() => setIsOpen(false)}
                  className={`block py-3 pl-3 text-base ${pathname === "/deal-desk/assumable-calculator" ? "font-semibold text-navy" : "text-slate-700"}`}
                >
                  Assumable Calculator
                </Link>
                <Link
                  to="/deal-desk/net-sheet"
                  onClick={() => setIsOpen(false)}
                  className={`block py-3 pl-3 text-base ${pathname === "/deal-desk/net-sheet" ? "font-semibold text-navy" : "text-slate-700"}`}
                >
                  Seller Net Sheet
                </Link>
              </div>
            )}
          </div>

          <div className="border-b border-slate-100/80 py-1">
            <button
              type="button"
              className="flex w-full items-center justify-between py-3 text-left text-lg font-medium text-slate-900 min-h-[48px]"
              aria-expanded={mobileSmartToolsOpen}
              onClick={() => setMobileSmartToolsOpen((v) => !v)}
            >
              <span className={smartActive ? "text-navy" : ""}>Smart Tools</span>
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
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="text-lg font-medium text-slate-900 py-3"
          >
            Contact Us
          </Link>

          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="mt-2 bg-slate-900 text-white px-5 py-3.5 rounded-sm text-center font-medium min-h-[48px] flex items-center justify-center"
          >
            Start Pre-Approval
          </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
