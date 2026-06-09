import { Link } from "react-router-dom";
import { IHLLogo } from "../IHLLogo";
import { careersColors, careersFonts, careersSectionPad } from "./careersTheme";

export function CareersFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: careersColors.ivory,
        borderTop: `0.5px solid rgba(11,42,74,0.08)`,
        fontFamily: careersFonts.body,
      }}
    >
      <div className={`${careersSectionPad} !py-14`}>
        <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link to="/" aria-label="Infinite Home Lending">
              <IHLLogo style={{ height: "44px", width: "auto" }} />
            </Link>
            <p
              className="mt-5 text-sm leading-relaxed"
              style={{ color: "rgba(46,46,46,0.65)" }}
            >
              Infinite Home Lending is a Washington, DC mortgage brokerage built for disciplined,
              client-centered advisory practice.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 md:gap-16">
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.18em]"
                style={{ color: careersColors.gold }}
              >
                Office
              </p>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: careersColors.charcoal }}>
                7272 Wisconsin Avenue, 9th Floor
                <br />
                Bethesda, MD 20814
              </p>
            </div>
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.18em]"
                style={{ color: careersColors.gold }}
              >
                Contact
              </p>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: careersColors.charcoal }}>
                <a
                  href="mailto:Info@infinitehomelending.com"
                  className="no-underline hover:underline"
                  style={{ color: careersColors.navy }}
                >
                  Info@infinitehomelending.com
                </a>
                <br />
                <a
                  href="tel:+13015077609"
                  className="no-underline hover:underline"
                  style={{ color: careersColors.navy }}
                >
                  (301) 507-7609
                </a>
              </p>
            </div>
          </div>
        </div>

        <div
          className="mx-auto mt-12 max-w-6xl border-t pt-8"
          style={{ borderColor: "rgba(11,42,74,0.08)" }}
        >
          <div className="flex flex-col gap-4 text-[11px] leading-relaxed md:flex-row md:items-center md:justify-between">
            <p style={{ color: "rgba(46,46,46,0.5)" }}>
              © {year} Infinite Home Lending. NMLS #2831765. Licensed in Washington, DC.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link
                to="/"
                className="no-underline hover:underline"
                style={{ color: "rgba(46,46,46,0.55)" }}
              >
                Main Site
              </Link>
              <a
                href="/privacy"
                className="no-underline hover:underline"
                style={{ color: "rgba(46,46,46,0.55)" }}
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="no-underline hover:underline"
                style={{ color: "rgba(46,46,46,0.55)" }}
              >
                Terms of Service
              </a>
            </div>
          </div>
          <p className="mt-4 text-[10px] leading-relaxed" style={{ color: "rgba(46,46,46,0.4)" }}>
            All loans subject to credit approval. Rates and terms subject to change without notice.
            Equal Housing Lender.
          </p>
        </div>
      </div>
    </footer>
  );
}
