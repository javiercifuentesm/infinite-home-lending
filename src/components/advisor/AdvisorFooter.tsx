import { Link } from "react-router-dom";
import { Instagram, Linkedin, Mail, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { IHLLogo } from "../IHLLogo";
import { useLanguage } from "../../i18n/LanguageContext";
import { useAdvisor } from "../../context/AdvisorContext";
import { advisorPath } from "../../config/advisorChrome";
import { COMPANY_NMLS_ID, getLicensedInFooterText } from "../../config/licenses";
import { APPLY_NOW_REL } from "./AdvisorApplyNowLink";
import "../compliance/complianceLegal.css";

const NMLS_CONSUMER_ACCESS_URL = "https://www.nmlsconsumeraccess.org";

const SOCIAL_ICON_CLASS =
  "group/soc relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition-all duration-200 hover:border-[#C5A059]/50 hover:bg-[#C5A059]/[0.06] hover:text-[#8b6f2f] hover:shadow-[0_0_0_3px_rgba(197,160,89,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]/50";

const CONTACT_CARD_CLASS =
  "group flex gap-3.5 rounded-xl border border-slate-200/90 bg-white p-4 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_2px_12px_rgba(10,25,47,0.04)] transition-all duration-200 hover:border-[#C5A059]/30 hover:shadow-[0_4px_20px_rgba(10,25,47,0.07)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]/40";

const NAV_LINK_CLASS =
  "font-sans text-[13px] text-slate-500 transition-colors duration-150 hover:text-navy";

type AdvisorSocialLink = {
  href: string;
  icon: LucideIcon;
  label: string;
};

function getAdvisorSocialLinks(
  social: { linkedin?: string; instagram?: string } | undefined,
  advisorName: string,
): AdvisorSocialLink[] {
  if (!social) return [];

  const links: AdvisorSocialLink[] = [];
  if (social.linkedin) {
    links.push({
      href: social.linkedin,
      icon: Linkedin,
      label: `${advisorName} on LinkedIn`,
    });
  }
  if (social.instagram) {
    links.push({
      href: social.instagram,
      icon: Instagram,
      label: `${advisorName} on Instagram`,
    });
  }
  return links;
}

export function AdvisorFooter() {
  const year = new Date().getFullYear();
  const { advisor, basePath } = useAdvisor();
  const { t, lang } = useLanguage();
  const advisorName = t(advisor.nameKey);
  const socialLinks = getAdvisorSocialLinks(advisor.social, advisorName);

  const companyLinks = [
    { labelKey: "footer.howWeWork", to: "/how-it-works" },
    { labelKey: "footer.loanSolutions", to: advisorPath(advisor.slug, "loan-solutions") },
    { labelKey: "footer.knowledgeCenter", to: "/knowledge-center" },
    { labelKey: "footer.contact", to: advisorPath(advisor.slug, "contact") },
  ] as const;

  const complianceLinks = [
    { labelKey: "footer.compliancePrivacy", to: "/privacy-policy" },
    { labelKey: "footer.complianceTerms", to: "/terms-of-use" },
    { labelKey: "footer.complianceSms", to: "/sms-terms" },
    { labelKey: "footer.complianceLicensing", to: "/licensing" },
    { labelKey: "footer.complianceEqualHousing", to: "/equal-housing" },
  ] as const;

  return (
    <footer className="site-footer advisor-footer relative isolate overflow-x-clip border-t border-slate-200/60 bg-[#F7F7F5] text-navy">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent"
        aria-hidden
      />

      <div className="relative z-[3] mx-auto max-w-7xl px-5 pb-0 pt-16 sm:px-6 lg:px-8 lg:pt-20">
        <div className="site-footer-zones grid gap-12 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_minmax(0,24rem)] lg:grid-rows-[auto_auto] lg:items-start lg:gap-x-10 lg:gap-y-8 xl:gap-x-14">
          {/* Brand column */}
          <div className="site-footer-brand order-1 lg:col-start-1 lg:row-start-1">
            <Link
              to={basePath}
              aria-label={`${advisorName} — Infinite Home Lending`}
              className="group inline-block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F7F5]"
            >
              <IHLLogo className="site-footer-logo block w-auto opacity-[0.97] transition-transform duration-300 group-hover:scale-[1.01]" />
            </Link>

            <div className="mt-6 w-8 h-px bg-[#C5A059]" />

            <p className="mt-5 max-w-xs font-sans text-[14px] leading-[1.75] text-slate-500">
              {t("footer.tagline")}
            </p>

            <p className="mt-4 font-heading text-[13px] italic text-[#9a7b3a]">{t("footer.slogan")}</p>

            <p className="mt-5 font-heading text-[15px] font-semibold tracking-[-0.02em] text-navy">
              {advisorName}
            </p>
            <p className="mt-1 font-sans text-[13px] text-slate-500">{t(advisor.titleKey)}</p>
            <p className="mt-2 font-sans text-[12px] text-slate-400">NMLS #{advisor.nmlsId}</p>

            {socialLinks.length > 0 ? (
              <div className="mt-7 flex items-center gap-2.5">
                {socialLinks.map(({ href, icon: Icon, label }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={SOCIAL_ICON_CLASS}
                  >
                    <span
                      className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-200 group-hover/soc:opacity-100 [background:radial-gradient(circle_at_30%_30%,rgba(197,160,89,0.12),transparent_65%)]"
                      aria-hidden
                    />
                    <Icon className="relative z-10 h-[15px] w-[15px]" strokeWidth={1.6} aria-hidden />
                  </a>
                ))}
              </div>
            ) : null}
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
                  {companyLinks.map(({ labelKey, to }) => (
                    <li key={to}>
                      <Link to={to} className={NAV_LINK_CLASS}>
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
                  <li>
                    <Link to={advisorPath(advisor.slug, "tools")} className={NAV_LINK_CLASS}>
                      {t("footer.smartTools")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/deal-desk" className={NAV_LINK_CLASS}>
                      {t("footer.dealDesk")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/calculators" className={NAV_LINK_CLASS}>
                      {t("footer.calculators")}
                    </Link>
                  </li>
                  <li>
                    <a
                      href={advisor.applyNowUrl}
                      target="_blank"
                      rel={APPLY_NOW_REL}
                      className={NAV_LINK_CLASS}
                    >
                      {t("advisor.footer.applyNow")}
                    </a>
                  </li>
                </ul>
              </div>

              <div className="site-footer-compliance-col sm:col-span-2 lg:col-span-1">
                <h2 className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C5A059]">
                  {t("footer.compliance")}
                </h2>
                <ul className="mt-5 flex flex-col gap-3">
                  {complianceLinks.map(({ labelKey, to }) => (
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
          <div className="site-footer-contact order-4 flex flex-col gap-3 lg:col-start-3 lg:row-start-1 lg:row-span-2 lg:justify-self-stretch lg:w-full lg:max-w-[24rem] lg:min-w-0">
            <h2 className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C5A059]">
              {t("footer.getInTouch")}
            </h2>

            {advisor.email ? (
              <a href={`mailto:${advisor.email}`} className={CONTACT_CARD_CLASS}>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C5A059]/10 text-[#8b6f2f]">
                  <Mail className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </span>
                <span>
                  <span className="block font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {t("footer.email")}
                  </span>
                  <span className="mt-1 block font-sans text-[13px] text-slate-700 transition-colors group-hover:text-[#8b6f2f]">
                    {advisor.email}
                  </span>
                </span>
              </a>
            ) : null}

            {advisor.phone ? (
              <a href={`tel:${advisor.phone.tel}`} className={CONTACT_CARD_CLASS}>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C5A059]/10 text-[#8b6f2f]">
                  <Phone className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </span>
                <span>
                  <span className="block font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {t("footer.phone")}
                  </span>
                  <span className="mt-1 block font-sans text-[13px] tabular-nums text-slate-700 transition-colors group-hover:text-[#8b6f2f]">
                    {advisor.phone.display}
                  </span>
                </span>
              </a>
            ) : null}
          </div>
        </div>

        {/* Legal strip */}
        <div className="mt-14 border-t border-slate-200/80 py-8">
          <div className="flex flex-col items-center gap-3 text-center font-sans text-[11px] text-slate-400">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <span className="text-slate-500">© {year} Infinite Home Lending.</span>
              <span className="text-gold">NMLS #{COMPANY_NMLS_ID}</span>
              <span className="text-slate-300">·</span>
              <span>{getLicensedInFooterText(lang)}</span>
              <span className="text-slate-300">·</span>
              <Link to="/privacy-policy" className="transition-colors hover:text-navy">
                {t("footer.privacy")}
              </Link>
              <span className="text-slate-300">·</span>
              <Link to="/terms-of-use" className="transition-colors hover:text-navy">
                {t("footer.terms")}
              </Link>
            </div>

            <p className="text-[10px] text-slate-400/80">
              {t("footer.nmlsConsumerAccessPrefix")}
              <a
                href={NMLS_CONSUMER_ACCESS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold transition-colors hover:text-gold/80"
              >
                {t("footer.nmlsConsumerAccessLink")}
              </a>
            </p>

            <p className="text-[10px] text-slate-400/80">{t("footer.loanDisclaimer")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
