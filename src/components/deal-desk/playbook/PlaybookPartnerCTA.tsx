import { Link } from "react-router-dom";

export function PlaybookPartnerCTA() {
  return (
    <section id="partner" className="scroll-mt-28 bg-[#0B2A4A] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-[Georgia,serif] text-[26px] font-medium text-white">Ready to bring The Deal Desk to your listings?</h2>
        <p className="mx-auto mt-4 max-w-2xl font-sans text-[15px] leading-relaxed text-white/70">
          Partner with IHL and you get access to every Deal Desk tool, co-branded outputs with your name and photo, and a dedicated loan officer —
          Javier or Alma — available for your clients from pre-approval through close. No referral quotas. No pressure. Just better deals.
        </p>
        <div className="mt-10 grid gap-6 text-left sm:grid-cols-3">
          <div className="flex gap-3">
            <span className="text-xl" aria-hidden>
              🔧
            </span>
            <p className="font-sans text-[13px] leading-relaxed text-white/85">All 12 Deal Desk tools — free forever for partner agents</p>
          </div>
          <div className="flex gap-3">
            <span className="text-xl" aria-hidden>
              📋
            </span>
            <p className="font-sans text-[13px] leading-relaxed text-white/85">Co-branded outputs with your headshot and contact info</p>
          </div>
          <div className="flex gap-3">
            <span className="text-xl" aria-hidden>
              📞
            </span>
            <p className="font-sans text-[13px] leading-relaxed text-white/85">Direct access to Javier &amp; Alma — not a call center</p>
          </div>
        </div>
        <Link
          to="/contact"
          className="mt-10 inline-flex items-center justify-center rounded-md bg-[#C6A15B] px-8 py-[0.85rem] font-sans text-[16px] font-semibold text-white transition-colors hover:bg-[#b48e48]"
        >
          Become a Deal Desk Partner →
        </Link>
      </div>
    </section>
  );
}
