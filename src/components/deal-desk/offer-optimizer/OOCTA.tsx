import { Link } from "react-router-dom";

export function OOCTA() {
  return (
    <div id="oo-partnership-cta" className="rounded-xl bg-[#0B2A4A] p-6 sm:p-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="font-sans text-[13px] font-medium text-[#C6A15B]">Want to run this analysis with a live pre-approval?</h3>
          <p className="mt-2 font-sans text-[11px] leading-relaxed text-white/60">
            We&apos;ll confirm the buyer&apos;s qualification and issue a pre-approval letter that references the specific buydown structure — so your offer package tells a complete story.
          </p>
        </div>
        <Link
          to="/contact?topic=deal-desk-offer-optimizer"
          className="inline-flex shrink-0 items-center justify-center rounded-md bg-[#C6A15B] px-6 py-3 font-sans text-[14px] font-semibold text-[#0B2A4A] transition-colors hover:bg-[#b48e48]"
        >
          Get the pre-approval ↗
        </Link>
      </div>
      <p className="mt-6 border-t border-white/10 pt-6 text-center font-sans text-[11px] text-white/55 lg:text-left">
        New to The Deal Desk?{" "}
        <Link to="/deal-desk" className="font-semibold text-[#C6A15B] underline decoration-white/20 underline-offset-2 hover:text-white">
          Learn about partnering with IHL →
        </Link>
      </p>
    </div>
  );
}
