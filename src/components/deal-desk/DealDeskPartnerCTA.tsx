import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";

export function DealDeskPartnerCTA() {
  const { t } = useLanguage();
  return (
    <section className="relative px-4 py-20 sm:px-6 lg:px-8">
      {/* Glass card CTA */}
      <div
        className="mx-auto max-w-3xl rounded-2xl p-10 text-center"
        style={{
          background: "rgba(198,161,91,0.06)",
          border: "1px solid rgba(198,161,91,0.2)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* Gold icon */}
        <div
          className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full"
          style={{
            background: "rgba(198,161,91,0.12)",
            border: "1px solid rgba(198,161,91,0.3)",
          }}
        >
          <span className="text-xl">🔑</span>
        </div>
        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(1.4rem, 3vw, 2rem)",
            fontWeight: 500,
            color: "#F7F7F5",
            marginBottom: "1rem",
            lineHeight: 1.3,
          }}
        >
          Ready to elevate your practice?
        </h2>
        <p className="mx-auto mb-8 max-w-xl font-sans text-[14px] leading-relaxed" style={{ color: "rgba(247,247,245,0.6)" }}>
          Partner with IHL and get full access to The Deal Desk — 12 tools, Nexio — The Deal Desk Virtual Assistant, and the Intelligence Loop. No referral quotas. Just better deals.
        </p>
        <Link
          to="/contact?topic=deal-desk-partner"
          className="inline-flex min-h-[50px] items-center justify-center rounded-lg px-10 py-3 font-sans text-[13px] font-semibold uppercase tracking-[0.1em] transition-all hover:scale-[1.02] hover:shadow-xl"
          style={{
            background: "linear-gradient(135deg, #C6A15B 0%, #b48e48 100%)",
            color: "#0B2A4A",
            boxShadow: "0 4px 24px rgba(198,161,91,0.3)",
          }}
        >
          Become a Deal Desk Partner →
        </Link>
        <p className="mt-6 font-sans text-[11px]" style={{ color: "rgba(247,247,245,0.3)" }}>
          {t("dealDesk.partnerCTA.serviceArea")}
        </p>
      </div>
    </section>
  );
}
