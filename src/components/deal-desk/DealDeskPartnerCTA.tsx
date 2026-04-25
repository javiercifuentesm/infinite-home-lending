import { Link } from "react-router-dom";

export function DealDeskPartnerCTA() {
  return (
    <section className="bg-[#0B2A4A] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-[Georgia,serif] text-xl font-medium leading-snug text-white sm:text-2xl">
          Want these tools in your listing presentations?
        </h2>
        <p className="mx-auto mt-5 max-w-2xl font-sans text-[14px] leading-relaxed text-white/70">
          Partner with IHL and we&apos;ll walk you through every tool, co-brand the outputs with your info, and be available for your clients from
          pre-approval through close. No referral quotas. Just better deals.
        </p>
        <Link
          to="/contact?topic=deal-desk-partner"
          className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-md bg-[#C6A15B] px-8 py-3 font-sans text-[13px] font-semibold text-[#0B2A4A] transition-colors hover:bg-[#b48e48]"
        >
          Become a Deal Desk Partner →
        </Link>
      </div>
    </section>
  );
}
