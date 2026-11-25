import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { IHLLogo } from "../IHLLogo";
import { useLanguage } from "../../i18n/LanguageContext";
import { LanguageToggle } from "../../i18n/LanguageToggle";
import { useAdvisor } from "../../context/AdvisorContext";
import { advisorPath } from "../../config/advisorChrome";
import { AdvisorApplyNowLink } from "./AdvisorApplyNowLink";

type NavItem = {
  labelKey: string;
  segment: string;
  exact?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { labelKey: "advisor.nav.home", segment: "", exact: true },
  { labelKey: "advisor.nav.about", segment: "about" },
  { labelKey: "advisor.nav.loanSolutions", segment: "loan-solutions" },
  { labelKey: "advisor.nav.smartTools", segment: "tools" },
  { labelKey: "advisor.nav.resources", segment: "resources" },
  { labelKey: "advisor.nav.contact", segment: "contact" },
];

function isNavActive(pathname: string, slug: string, segment: string, exact?: boolean): boolean {
  const href = advisorPath(slug, segment);
  if (exact) return pathname === href || pathname === `${href}/`;
  return pathname === href || pathname.startsWith(`${href}/`);
}

type AdvisorNavbarProps = {
  onMenuOpenChange?: (open: boolean) => void;
};

export function AdvisorNavbar({ onMenuOpenChange }: AdvisorNavbarProps) {
  const { advisor, basePath } = useAdvisor();
  const { t } = useLanguage();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    onMenuOpenChange?.(isOpen);
  }, [isOpen, onMenuOpenChange]);

  const pathname = location.pathname;
  const advisorName = t(advisor.nameKey);

  const baseLink = (active: boolean) =>
    `text-[11px] font-semibold uppercase tracking-[0.14em] font-sans transition-all duration-300 whitespace-nowrap ${
      active ? "text-navy opacity-100" : "text-navy opacity-85 hover:text-gold hover:opacity-100"
    }`;

  const navHref = (segment: string) => advisorPath(advisor.slug, segment);

  return (
    <nav
      className={`site-navbar advisor-navbar transition-shadow duration-300 ${
        scrolled ? "shadow-sm shadow-navy/5" : ""
      }`}
    >
      <div className="container navbar-inner">
        <Link
          to={basePath}
          aria-label={`${advisorName} — Infinite Home Lending`}
          className="flex shrink-0 items-center leading-none group outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 rounded-sm"
        >
          <IHLLogo className="site-navbar-logo opacity-[0.97] transition-transform duration-500 group-hover:scale-[1.01]" />
        </Link>

        <div className="hidden min-w-0 flex-1 justify-center md:flex">
          <div className="nav-menu">
            {NAV_ITEMS.map(({ labelKey, segment, exact }) => {
              const active = isNavActive(pathname, advisor.slug, segment, exact);
              return (
                <Link key={labelKey} to={navHref(segment)} className={baseLink(active)}>
                  {t(labelKey)}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="nav-actions hidden md:flex">
          <LanguageToggle variant="header" />
          <AdvisorApplyNowLink className="btn-gold !px-5 !py-2.5 text-[11px]">
            {t("advisor.nav.applyNow")}
          </AdvisorApplyNowLink>
        </div>

        <button
          type="button"
          className="md:hidden ml-auto text-navy p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsOpen((v) => !v)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 z-[1001] bg-white border-b border-slate-100 py-5 md:hidden shadow-xl max-h-[min(85vh,calc(100vh-5rem))] overflow-y-auto advisor-mobile-nav-panel"
        >
          <div className="container flex flex-col gap-1">
            {NAV_ITEMS.map(({ labelKey, segment, exact }) => {
              const active = isNavActive(pathname, advisor.slug, segment, exact);
              return (
                <Link
                  key={labelKey}
                  to={navHref(segment)}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-medium py-3 border-b border-slate-100/80 ${
                    active ? "text-navy" : "text-slate-900"
                  }`}
                >
                  {t(labelKey)}
                </Link>
              );
            })}
            <div className="flex flex-col gap-3 py-4 border-b border-slate-100/80">
              <LanguageToggle variant="header" />
            </div>
            <AdvisorApplyNowLink
              className="btn-gold w-full justify-center mt-3 text-center"
              onClick={() => setIsOpen(false)}
            >
              {t("advisor.nav.applyNow")}
            </AdvisorApplyNowLink>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
