import { Link } from "react-router-dom";
import { FlagshipCtaPrimary } from "../homebuyer-quiz/FlagshipCta";

export function DecisionCTA() {
  return (
    <section className="rounded-2xl border border-black/[0.06] bg-white px-5 py-8 text-center shadow-sm sm:px-8">
      <h2 className="font-display text-xl font-semibold text-[#0B1F3A] sm:text-2xl">
        See what this looks like for your exact situation
      </h2>
      <div className="mt-8 flex flex-col items-center gap-3">
        <FlagshipCtaPrimary to="/contact?topic=advisory">Get My Numbers</FlagshipCtaPrimary>
        <p className="text-[12px] leading-relaxed text-[#0B1F3A]/55">No credit pull · No obligation · Real advisor</p>
      </div>
      <Link
        to="/smart-tools"
        className="mt-8 inline-block text-[14px] font-semibold text-[#0B1F3A]/70 underline-offset-4 hover:underline"
      >
        Back to tools
      </Link>
    </section>
  );
}
