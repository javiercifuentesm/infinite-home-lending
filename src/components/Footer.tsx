import { Link, useLocation } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { IHLLogo } from "./IHLLogo";
import { useLanguage } from "../i18n/LanguageContext";
import { en } from "../i18n/en";
import "../components/compliance/complianceLegal.css";

const OFFICE_LINES = ["7272 Wisconsin Avenue, 9th Floor", "Bethesda, MD 20814"] as const;
const PHONE_DISPLAY = "(301) 507-7609";
const PHONE_TEL = "+13015077609";
const EMAIL = "Info@infinitehomelending.com";
const NMLS_ID = "2831765";

const SOCIAL = [
  { label: "LinkedIn", href: "https://www.linkedin.com/", icon: Linkedin },
  { label: "Facebook", href: "https://www.facebook.com/", icon: Facebook },
  { label: "Instagram", href: "https://www.instagram.com/", icon: Instagram },
] as const;

const Footer = () => {
  const year = new Date().getFullYear();
  const { pathname } = useLocation();
  const { t: tGlobal } = useLanguage();
  const t = (key: string) => {
    const dict = pathname === "/careers" ? en : null;
    if (dict) return (dict as Record<string, string>)[key] ?? key;
    return tGlobal(key);
  };

  return (
    <footer className="site-footer relative isolate overflow-x-clip border-t border-slate-200/60 bg-[#F7F7F5] text-navy">

      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent"
        aria-hidden
      />

      <div className="relative z-[3] mx-auto max-w-7xl px-5 pb-0 pt-16 sm:px-6 lg:px-8 lg:pt-20">
        <div className="site-footer-zones grid gap-12 lg:grid-cols-[minmax(0,15rem)_1fr_minmax(0,18rem)] lg:grid-rows-[auto_auto] lg:items-start lg:gap-x-10 lg:gap-y-8 xl:gap-x-14">

          {/* Brand column */}
          <div className="site-footer-brand order-1 lg:col-start-1 lg:row-start-1">
            <Link
              to="/"
              aria-label="Infinite Home Lending"
              className="group inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F7F5] rounded-sm"
            >
              <IHLLogo className="site-footer-logo block w-auto opacity-[0.97] transition-transform duration-300 group-hover:scale-[1.01]" />
            </Link>

            <div className="mt-6 w-8 h-px bg-[#C5A059]" />

            <p className="mt-5 max-w-xs font-sans text-[14px] leading-[1.75] text-slate-500">
              {t("footer.tagline")}
            </p>

            <p className="mt-4 font-heading text-[13px] italic text-[#9a7b3a]">
              {t("footer.slogan")}
            </p>

            <div className="mt-7 flex items-center gap-2.5">
              {SOCIAL.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group/soc relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition-all duration-200 hover:border-[#C5A059]/50 hover:bg-[#C5A059]/[0.06] hover:text-[#8b6f2f] hover:shadow-[0_0_0_3px_rgba(197,160,89,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]/50"
                >
                  <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-200 group-hover/soc:opacity-100 [background:radial-gradient(circle_at_30%_30%,rgba(197,160,89,0.12),transparent_65%)]" aria-hidden />
                  <Icon className="relative z-10 h-[15px] w-[15px]" strokeWidth={1.6} aria-hidden />
                </a>
              ))}
            </div>
          </div>

          <div className="site-footer-eho-mark order-2 lg:col-start-1 lg:row-start-2">
            <Link
              to="/equal-housing"
              aria-label={t("footer.complianceEqualHousing")}
              className="site-footer-eho-link inline-block rounded-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F7F5]"
            >
              <img
                src="/equal-housing.png"
                alt={t("footer.complianceEqualHousing")}
                className="site-footer-eho-logo"
              />
            </Link>
          </div>

          {/* Middle nav group — Company, Resources, Compliance */}
          <div className="site-footer-nav-center order-3 lg:col-start-2 lg:row-start-1 lg:row-span-2">
            <div className="site-footer-nav-group grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 xl:gap-x-12">
              <div>
                <h2 className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C5A059]">
                  {t("footer.company")}
                </h2>
                <ul className="mt-5 flex flex-col gap-3">
                  {[
                    { labelKey: "footer.aboutUs", to: "/about" },
                    { labelKey: "footer.howWeWork", to: "/how-it-works" },
                    { labelKey: "footer.loanSolutions", to: "/solutions" },
                    { labelKey: "footer.knowledgeCenter", to: "/knowledge-center" },
                    { labelKey: "footer.contact", to: "/contact" },
                  ].map(({ labelKey, to }) => (
                    <li key={to}>
                      <Link
                        to={to}
                        className="font-sans text-[13px] text-slate-500 transition-colors duration-150 hover:text-navy"
                      >
                        {t(labelKey)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C5A059]">
                  {t("footer.resources")}
                </h2>
                <ul className="mt-5 flex flex-col gap-3">
                  {[
                    { labelKey: "footer.smartTools", to: "/smart-tools" },
                    { labelKey: "footer.dealDesk", to: "/deal-desk" },
                    { labelKey: "footer.calculators", to: "/calculators" },
                    { labelKey: "footer.askSarah", to: "/" },
                    { labelKey: "footer.startPreApproval", to: "/get-started" },
                  ].map(({ labelKey, to }) => (
                    <li key={to}>
                      <Link
                        to={to}
                        className="font-sans text-[13px] text-slate-500 transition-colors duration-150 hover:text-navy"
                      >
                        {t(labelKey)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="site-footer-compliance-col sm:col-span-2 lg:col-span-1">
                <h2 className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C5A059]">
                  {t("footer.compliance")}
                </h2>
                <ul className="mt-5 flex flex-col gap-3">
                  {[
                    { labelKey: "footer.compliancePrivacy", to: "/privacy-policy" },
                    { labelKey: "footer.complianceTerms", to: "/terms-of-use" },
                    { labelKey: "footer.complianceSms", to: "/sms-terms" },
                    { labelKey: "footer.complianceLicensing", to: "/licensing" },
                    { labelKey: "footer.complianceEqualHousing", to: "/equal-housing" },
                  ].map(({ labelKey, to }) => (
                    <li key={to}>
                      <Link
                        to={to}
                        className="site-footer-compliance-link block font-sans text-[13px] leading-snug text-slate-500 transition-colors duration-150 hover:text-navy"
                      >
                        {t(labelKey)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Contact cards */}
          <div className="site-footer-contact order-4 flex flex-col gap-3 lg:col-start-3 lg:row-start-1 lg:row-span-2 lg:justify-self-end lg:w-full lg:max-w-[18rem]">
            <h2 className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C5A059]">
              {t("footer.getInTouch")}
            </h2>

            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(`${OFFICE_LINES[0]}, ${OFFICE_LINES[1]}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex gap-3.5 rounded-xl border border-slate-200/90 bg-white p-4 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_2px_12px_rgba(10,25,47,0.04)] transition-all duration-200 hover:border-[#C5A059]/30 hover:shadow-[0_4px_20px_rgba(10,25,47,0.07)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]/40"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C5A059]/10 text-[#8b6f2f]">
                <MapPin className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </span>
              <span>
                <span className="block font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">{t("footer.office")}</span>
                <span className="mt-1 block font-sans text-[13px] leading-snug text-slate-700 transition-colors group-hover:text-navy">
                  {OFFICE_LINES[0]}<br />{OFFICE_LINES[1]}
                </span>
              </span>
            </a>

            <a
              href={`mailto:${EMAIL}`}
              className="group flex gap-3.5 rounded-xl border border-slate-200/90 bg-white p-4 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_2px_12px_rgba(10,25,47,0.04)] transition-all duration-200 hover:border-[#C5A059]/30 hover:shadow-[0_4px_20px_rgba(10,25,47,0.07)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]/40"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C5A059]/10 text-[#8b6f2f]">
                <Mail className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </span>
              <span>
                <span className="block font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">{t("footer.email")}</span>
                <span className="mt-1 block font-sans text-[13px] text-slate-700 transition-colors group-hover:text-[#8b6f2f]">
                  {EMAIL}
                </span>
              </span>
            </a>

            <a
              href={`tel:${PHONE_TEL}`}
              className="group flex gap-3.5 rounded-xl border border-slate-200/90 bg-white p-4 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_2px_12px_rgba(10,25,47,0.04)] transition-all duration-200 hover:border-[#C5A059]/30 hover:shadow-[0_4px_20px_rgba(10,25,47,0.07)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]/40"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C5A059]/10 text-[#8b6f2f]">
                <Phone className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </span>
              <span>
                <span className="block font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">{t("footer.phone")}</span>
                <span className="mt-1 block font-sans text-[13px] tabular-nums text-slate-700 transition-colors group-hover:text-[#8b6f2f]">
                  {PHONE_DISPLAY}
                </span>
              </span>
            </a>
          </div>
        </div>

        {/* Legal strip */}
        <div className="mt-14 border-t border-slate-200/80 py-8">
          <div className="flex flex-col items-center gap-3 text-center font-sans text-[11px] text-slate-400">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <span className="text-slate-500">© {year} Infinite Home Lending.</span>
              <a
                href="https://www.nmlsconsumeraccess.org/EntityDetails.aspx/COMPANY/2831765"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold transition-colors hover:text-gold/80"
              >
                NMLS #{NMLS_ID}
              </a>
              <span className="text-slate-300">·</span>
              <span>{t("footer.nmls")}</span>
              <span className="text-slate-300">·</span>
              <Link to="/privacy-policy" className="transition-colors hover:text-navy">
                {t("footer.privacy")}
              </Link>
              <span className="text-slate-300">·</span>
              <Link to="/terms-of-use" className="transition-colors hover:text-navy">
                {t("footer.terms")}
              </Link>
            </div>

            <p className="text-[10px] text-slate-400/80">{t("footer.loanDisclaimer")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
