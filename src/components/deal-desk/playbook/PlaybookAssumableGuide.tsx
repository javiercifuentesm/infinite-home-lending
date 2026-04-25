import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

const SCRIPT_LISTING = `Before we schedule a showing, can you tell me if the seller has an FHA or VA loan? My buyer may be interested in assuming it if the rate is below market — and I want to run the numbers before we waste anyone's time. Do you know the approximate rate and remaining balance?`;

const SCRIPT_BUYER = `I know that equity gap looks big. But here is what the math actually says — even after financing that gap at a second mortgage rate, the blended rate across both loans is [X]%. You cannot touch that on a new loan today. That means [Y] less per month and [Z] in interest savings over the life of the loan. The gap is the price of admission to a rate that no longer exists for new borrowers.`;

const SCRIPT_SELLER = `Your [FHA/VA] loan at [X]% is a feature — not just a footnote. In a market where new loans are at [Y]%, the right buyer will pay a premium to assume your rate. I want to put this in the listing description, the flyer, and the social posts: 'Assumable [X]% [FHA/VA] loan — save [Z]/month vs. today's rates.' That is how we generate showings from buyers who are specifically looking for this.`;

export function PlaybookAssumableGuide() {
  const [copied, setCopied] = useState<number | null>(null);

  const copy = useCallback(async (index: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(index);
      window.setTimeout(() => setCopied((c) => (c === index ? null : c)), 2000);
    } catch {
      setCopied(null);
    }
  }, []);

  return (
    <section id="assumable-calculator-guide" className="scroll-mt-28 border-b border-slate-200/90 bg-[#F4F6F9] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-[Georgia,serif] text-[22px] font-medium text-[#0B2A4A]">How to use The Assumable Calculator</h2>
        <p className="mt-3 font-sans text-[15px] leading-relaxed text-slate-600">
          The math most agents can&apos;t do — and the conversation that wins listings with below-market rates as a feature.
        </p>

        <div className="mt-10 space-y-10">
          <div>
            <h3 className="font-[Georgia,serif] text-[18px] font-medium text-[#0B2A4A]">When assumability is a real advantage</h3>
            <p className="mt-3 font-sans text-[14px] leading-relaxed text-slate-700">
              Assumable loans matter most when the rate gap between the existing loan and today&apos;s market is 2% or more. A seller who locked in
              3.25% in 2021 is sitting on a financial asset worth thousands to the right buyer. The challenge: most MLS listings don&apos;t flag
              assumability, most sellers don&apos;t know they have it, and most agents don&apos;t know how to calculate whether the gap financing
              makes it worthwhile. The Assumable Calculator solves all three — in 60 seconds.
            </p>
            <div className="mt-4 rounded-xl border-2 border-[#0B2A4A]/25 bg-[rgba(11,42,74,0.04)] px-4 py-3 font-sans text-[13px] leading-relaxed text-[#0B2A4A]">
              74% of VA homeowners have a mortgage rate below 5% as of March 2025 (Veterans United / Ginnie Mae analysis). On average, assuming one of
              these loans saves buyers $1,187/month vs. today&apos;s rates — $14,244 per year.
            </div>
            <p className="mt-2 font-sans text-[11px] text-slate-500">
              Source: Veterans United analysis of Ginnie Mae data (March 2025) and Assumable.io analysis of 312,367 assumable listings.
            </p>
            <p className="mt-4">
              <Link
                to="/deal-desk/assumable-calculator"
                className="font-sans text-[14px] font-semibold text-[#0B2A4A] underline decoration-[#C6A15B]/50 underline-offset-2"
              >
                Open The Assumable Calculator →
              </Link>
            </p>
          </div>

          <div>
            <h3 className="font-[Georgia,serif] text-[18px] font-medium text-[#0B2A4A]">
              The equity gap — why buyers get stuck and how to unstick them
            </h3>
            <p className="mt-3 font-sans text-[14px] leading-relaxed text-slate-700">
              The number one objection to loan assumptions is the equity gap — the difference between the purchase price and the remaining loan
              balance. On a home listed at $475,000 with a $310,000 loan balance, the buyer needs to finance $165,000 through cash or a second
              mortgage. That number feels like a dealbreaker. The Assumable Calculator shows why it often isn&apos;t — because even at 8–9% on the
              gap financing, the blended rate across both loans is frequently below what a new 30-year mortgage would cost today.
            </p>
            <div className="mt-4 space-y-2 rounded-lg border border-slate-200/90 bg-white px-4 py-3 font-sans text-[13px] text-slate-800">
              <p>
                <span className="font-semibold text-[#0B2A4A]">Example 1:</span> $310k assumed at 3.25% + $165k at 8.5% = 5.12% blended
              </p>
              <p>
                <span className="font-semibold text-[#0B2A4A]">Example 2:</span> vs. $475k new loan at 6.875% = 6.875%
              </p>
              <p>
                <span className="font-semibold text-[#0B2A4A]">Example 3:</span> Difference: 1.76% — $387/month — $139k over loan life
              </p>
            </div>
            <div className="mt-4 rounded-xl border-2 border-[#C6A15B]/50 bg-[rgba(198,161,91,0.08)] px-4 py-3 font-sans text-[13px] leading-relaxed text-[#0B2A4A]">
              The blended rate is the number that closes buyer objections. Show it — not the gap amount, not the dual payment complexity. The blended
              rate vs. the new loan rate is the entire argument.
            </div>
          </div>

          <div>
            <h3 className="font-[Georgia,serif] text-[18px] font-medium text-[#0B2A4A]">VA vs. FHA vs. USDA — what changes</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border-2 border-[#0B2A4A]/25 bg-[rgba(11,42,74,0.06)] p-4">
                <p className="font-sans text-[12px] font-semibold text-[#C6A15B]">VA Loan</p>
                <ul className="mt-2 list-disc space-y-1.5 pl-4 font-sans text-[12px] leading-relaxed text-slate-800">
                  <li>Anyone can assume — no military service required</li>
                  <li>0.5% funding fee on assumed balance (non-veterans)</li>
                  <li>Seller&apos;s entitlement stays tied if buyer is not a veteran</li>
                  <li>Substitution of entitlement restores seller&apos;s benefit</li>
                  <li>45–75 day timeline (mandated by VA Circular 26-23-27)</li>
                </ul>
              </div>
              <div className="rounded-xl border-2 border-[#185FA5]/25 bg-[rgba(24,95,165,0.06)] p-4">
                <p className="font-sans text-[12px] font-semibold text-[#185FA5]">FHA Loan</p>
                <ul className="mt-2 list-disc space-y-1.5 pl-4 font-sans text-[12px] leading-relaxed text-slate-800">
                  <li>All FHA loans assumable by law (post-Dec 1986)</li>
                  <li>Buyer must meet current FHA standards: 580+ credit, 43–50% DTI</li>
                  <li>MIP terms carry over — can be an advantage on older loans</li>
                  <li>No new appraisal required — removes appraisal risk</li>
                  <li>Assumption fee: up to $1,800</li>
                </ul>
              </div>
              <div className="rounded-xl border-2 border-emerald-700/25 bg-[rgba(22,101,52,0.06)] p-4">
                <p className="font-sans text-[12px] font-semibold text-emerald-800">USDA Loan</p>
                <ul className="mt-2 list-disc space-y-1.5 pl-4 font-sans text-[12px] leading-relaxed text-slate-800">
                  <li>Assumable with lender/servicer approval</li>
                  <li>Buyer must meet USDA income limits and rural eligibility</li>
                  <li>Property must remain USDA-eligible at time of assumption</li>
                  <li>No USDA guarantee fee on assumption (already paid)</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-[Georgia,serif] text-[18px] font-medium text-[#0B2A4A]">Scripts: the three conversations</h3>
            <div className="mt-4 space-y-5">
              <figure
                className="relative rounded-r-lg border border-[rgba(11,42,74,0.1)] border-l-[3px] border-l-[#C6A15B] bg-[rgba(11,42,74,0.03)] py-4 pl-5 pr-4"
                style={{ borderRadius: "0 8px 8px 0" }}
              >
                <figcaption className="font-sans text-[11px] italic text-slate-500">Identifying assumability with a listing agent</figcaption>
                <p className="mt-1 font-sans text-[11px] text-slate-600">
                  Use when you have a buyer interested in a listing and want to find out if the loan is assumable before showing.
                </p>
                <blockquote className="mt-2 font-[Georgia,serif] text-[14px] italic leading-[1.65] text-[#0B2A4A]">{SCRIPT_LISTING}</blockquote>
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => copy(0, SCRIPT_LISTING)}
                    className="font-sans text-[11px] font-semibold uppercase tracking-wide text-[#0B2A4A] underline decoration-[#C6A15B]/40 underline-offset-2"
                  >
                    {copied === 0 ? "Copied!" : "Copy script"}
                  </button>
                </div>
              </figure>

              <figure
                className="relative rounded-r-lg border border-[rgba(11,42,74,0.1)] border-l-[3px] border-l-[#C6A15B] bg-[rgba(11,42,74,0.03)] py-4 pl-5 pr-4"
                style={{ borderRadius: "0 8px 8px 0" }}
              >
                <figcaption className="font-sans text-[11px] italic text-slate-500">Presenting the assumption to a skeptical buyer</figcaption>
                <p className="mt-1 font-sans text-[11px] text-slate-600">Use when a buyer sees the equity gap and thinks it kills the deal.</p>
                <blockquote className="mt-2 font-[Georgia,serif] text-[14px] italic leading-[1.65] text-[#0B2A4A]">{SCRIPT_BUYER}</blockquote>
                <p className="mt-2 font-sans text-[11px] text-slate-500">
                  (Replace bracketed values with the blended rate, monthly saving, and lifetime interest from the Assumable Calculator for this
                  listing.)
                </p>
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => copy(1, SCRIPT_BUYER)}
                    className="font-sans text-[11px] font-semibold uppercase tracking-wide text-[#0B2A4A] underline decoration-[#C6A15B]/40 underline-offset-2"
                  >
                    {copied === 1 ? "Copied!" : "Copy script"}
                  </button>
                </div>
              </figure>

              <figure
                className="relative rounded-r-lg border border-[rgba(11,42,74,0.1)] border-l-[3px] border-l-[#C6A15B] bg-[rgba(11,42,74,0.03)] py-4 pl-5 pr-4"
                style={{ borderRadius: "0 8px 8px 0" }}
              >
                <figcaption className="font-sans text-[11px] italic text-slate-500">Presenting assumability as a listing feature</figcaption>
                <p className="mt-1 font-sans text-[11px] text-slate-600">Use with a seller to position the assumable loan as a marketing advantage.</p>
                <blockquote className="mt-2 font-[Georgia,serif] text-[14px] italic leading-[1.65] text-[#0B2A4A]">{SCRIPT_SELLER}</blockquote>
                <p className="mt-2 font-sans text-[11px] text-slate-500">
                  (Replace bracketed loan type, rates, and monthly savings with the calculator output for this listing.)
                </p>
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => copy(2, SCRIPT_SELLER)}
                    className="font-sans text-[11px] font-semibold uppercase tracking-wide text-[#0B2A4A] underline decoration-[#C6A15B]/40 underline-offset-2"
                  >
                    {copied === 2 ? "Copied!" : "Copy script"}
                  </button>
                </div>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
