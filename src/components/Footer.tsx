import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { IHLLogo } from "./IHLLogo";

const OFFICE_LINES = ["7272 Wisconsin Avenue, 9th Floor", "Bethesda, MD 20814"] as const;
const PHONE_DISPLAY = "(301) 555-0123";
const PHONE_TEL = "+13015550123";
const EMAIL = "Info@infinitehomelending.com";
const NMLS_ID = "2831765";

const SOCIAL = [
  { label: "LinkedIn", href: "https://www.linkedin.com/", icon: Linkedin },
  { label: "Facebook", href: "https://www.facebook.com/", icon: Facebook },
  { label: "Instagram", href: "https://www.instagram.com/", icon: Instagram },
] as const;

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer relative isolate overflow-x-clip border-t border-slate-200/60 bg-[#F7F7F5] text-navy">

      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent"
        aria-hidden
      />

      <div className="relative z-[3] mx-auto max-w-7xl px-5 pb-0 pt-16 sm:px-6 lg:px-8 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14">

          {/* Brand column */}
          <div className="lg:col-span-4">
            <Link
              to="/"
              aria-label="Infinite Home Lending"
              className="group inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F7F5] rounded-sm"
            >
              <IHLLogo className="site-footer-logo block w-auto opacity-[0.97] transition-transform duration-300 group-hover:scale-[1.01]" />
            </Link>

            <div className="mt-6 w-8 h-px bg-[#C5A059]" />

            <p className="mt-5 max-w-xs font-sans text-[14px] leading-[1.75] text-slate-500">
              Premium mortgage guidance built around your life — not just your rate. Serving Maryland, Virginia, and Washington, D.C.
            </p>

            <p className="mt-4 font-heading text-[13px] italic text-[#9a7b3a]">
              Tailored Lending. Infinite Possibilities.
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

          {/* Company nav */}
          <div className="lg:col-span-2">
            <h2 className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C5A059]">
              Company
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {[
                { label: "About Us", to: "/about" },
                { label: "How We Work", to: "/how-it-works" },
                { label: "Loan Solutions", to: "/solutions" },
                { label: "Knowledge Center", to: "/knowledge-center" },
                { label: "Contact", to: "/contact" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="font-sans text-[13px] text-slate-500 transition-colors duration-150 hover:text-navy"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources nav */}
          <div className="lg:col-span-2">
            <h2 className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C5A059]">
              Resources
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {[
                { label: "Smart Tools", to: "/smart-tools" },
                { label: "Deal Desk", to: "/deal-desk" },
                { label: "Calculators", to: "/calculators" },
                { label: "Ask Luna", to: "/" },
                { label: "Start Pre-Approval", to: "/get-started" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="font-sans text-[13px] text-slate-500 transition-colors duration-150 hover:text-navy"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact cards */}
          <div className="flex flex-col gap-3 lg:col-span-4">
            <h2 className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C5A059]">
              Get in Touch
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
                <span className="block font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Office</span>
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
                <span className="block font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Email</span>
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
                <span className="block font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Phone</span>
                <span className="mt-1 block font-sans text-[13px] tabular-nums text-slate-700 transition-colors group-hover:text-[#8b6f2f]">
                  {PHONE_DISPLAY}
                </span>
              </span>
            </a>
          </div>
        </div>

        {/* Legal strip */}
        <div className="mt-14 border-t border-slate-200/80 py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1.5 font-sans text-[11px] leading-[1.75] text-slate-400">
              <p className="text-slate-500">© {year} Infinite Home Lending. All rights reserved.</p>
              <p>NMLS #{NMLS_ID} · Licensed in Maryland, Virginia, and Washington DC.</p>
              <p>All loans subject to credit approval. Rates and terms subject to change without notice.</p>
            </div>
            <div className="flex flex-col gap-2 sm:items-end sm:text-right">
              <p className="font-sans text-[11px] text-slate-400">Serving Maryland, Virginia &amp; Washington, D.C.</p>
              <div className="flex gap-6">
                <a href="#" className="font-sans text-[11px] text-slate-400 transition-colors hover:text-navy">Privacy Policy</a>
                <a href="#" className="font-sans text-[11px] text-slate-400 transition-colors hover:text-navy">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Equal Housing strip */}
      <div className="border-t border-slate-200/60 bg-slate-100/80">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6 lg:px-8">
          <div className="housing-logo-footer">
            <img src="/equal-housing.png" alt="Equal Housing Opportunity" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
