import { Link } from "react-router-dom";

export function PlaybookToolGuides() {
  return (
    <section id="offer-optimizer-guide" className="scroll-mt-28 border-b border-slate-200/90 bg-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-[Georgia,serif] text-[22px] font-medium text-[#0B2A4A]">How to use The Offer Optimizer</h2>
        <p className="mt-3 font-sans text-[15px] leading-relaxed text-slate-600">
          Step-by-step — from opening the tool to presenting the results to a seller who&apos;s skeptical about concessions.
        </p>

        <div className="mt-10 space-y-10">
          <div>
            <h3 className="font-[Georgia,serif] text-[18px] font-medium text-[#0B2A4A]">Setting it up (60 seconds)</h3>
            <ol className="mt-4 list-decimal space-y-3 pl-5 font-sans text-[14px] leading-relaxed text-slate-700">
              <li>Enter the sale price and your seller&apos;s total concession budget</li>
              <li>Add the mortgage payoff and expected commission rate</li>
              <li>Enter what you know about the buyer: down payment %, income, debts</li>
              <li>Select the buydown structure (start with 2-1 for most scenarios)</li>
            </ol>
            <div className="mt-4 rounded-lg border border-amber-200/80 bg-amber-50 px-4 py-3 font-sans text-[13px] leading-relaxed text-amber-950">
              Don&apos;t know the buyer&apos;s exact numbers? Use estimates — the tool is built for negotiations, not underwriting.
            </div>
          </div>

          <div>
            <h3 className="font-[Georgia,serif] text-[18px] font-medium text-[#0B2A4A]">Reading the two panels</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200/90 bg-[#F4F6F9] p-4">
                <p className="font-sans text-[12px] font-semibold uppercase text-[#185FA5]">Scenario A — Price Reduction</p>
                <p className="mt-2 font-sans text-[13px] leading-relaxed text-slate-700">
                  The buyer&apos;s monthly payment at the reduced price, at market rate. This is the baseline — what they get if the seller just cuts.
                </p>
              </div>
              <div className="rounded-xl border border-[#0B2A4A]/20 bg-[#0B2A4A] p-4">
                <p className="font-sans text-[12px] font-semibold uppercase text-[#C6A15B]">Scenario B — Seller Buydown</p>
                <p className="mt-2 font-sans text-[13px] leading-relaxed text-white/90">
                  The buyer&apos;s Year 1 payment at the buydown rate. Lead with this number in every buyer conversation. It&apos;s always lower.
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-xl border-2 border-[#C6A15B] bg-[#C6A15B]/10 px-4 py-3 font-sans text-[13px] leading-relaxed text-[#0B2A4A]">
              The buydown almost always wins on payment. And because the seller is contributing to closing costs rather than cutting the price, the
              seller&apos;s commission and transfer tax are calculated on the full asking price — so they net more too.
            </div>
          </div>

          <div>
            <h3 className="font-[Georgia,serif] text-[18px] font-medium text-[#0B2A4A]">The two numbers that close deals</h3>
            <div className="mt-4 space-y-3 rounded-xl border border-slate-200/90 bg-[#F4F6F9] p-5">
              <div>
                <p className="font-sans text-[12px] font-semibold text-[#0B2A4A]">1 · Year 1 monthly payment (Panel B)</p>
                <p className="mt-1 font-sans text-[13px] text-slate-600">Show to buyers — this is the payment you present. Not the rate. Not the APR. The monthly number.</p>
              </div>
              <div className="border-t border-slate-200/80 pt-3">
                <p className="font-sans text-[12px] font-semibold text-[#0B2A4A]">2 · Seller net proceeds difference</p>
                <p className="mt-1 font-sans text-[13px] text-slate-600">
                  Show to sellers — this is the number that overcomes seller resistance to concessions. They net more with the buydown than a price cut.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-[Georgia,serif] text-[18px] font-medium text-[#0B2A4A]">When the tool flags a qualification issue</h3>
            <p className="mt-3 font-sans text-[14px] leading-relaxed text-slate-600">
              If the tool shows &quot;Buyer only qualifies WITH the buydown rate,&quot; that&apos;s not a problem — it&apos;s a talking point. The
              seller&apos;s concession isn&apos;t just making the deal attractive; it&apos;s making the deal possible. That&apos;s the most
              compelling reason to fund the buydown.
            </p>
            <p className="mt-4">
              <Link to="/contact" className="font-sans text-[14px] font-semibold text-[#0B2A4A] underline decoration-[#C6A15B]/50 underline-offset-2">
                Get the pre-approval letter that confirms this →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
