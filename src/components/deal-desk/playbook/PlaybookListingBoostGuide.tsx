import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

const SCRIPT_OPENING = `I want to show you something before we talk numbers. I ran your listing through an analysis tool that models what happens to your buyer pool under three different scenarios — a price cut, and two types of rate buydowns. The results are specific to your listing, your price point, and the local buyer income distribution. Can I walk you through it?`;

const SCRIPT_BUYDOWN = `Here's what I want you to focus on. The price cut gives you [pool A]% of the buyer pool. The 2-1 Buydown gives you [pool B]%. That's [poolGainVsCut]% more qualified buyers — and it nets you [fmtK(netDiff)] more than the price cut. The reason is that your commission and transfer tax are calculated on the full asking price when we fund a buydown instead of cutting. Same budget. More buyers. More money. That's the recommendation.`;

export function PlaybookListingBoostGuide() {
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
    <section id="listing-boost-guide" className="scroll-mt-28 border-b border-slate-200/90 bg-[#F4F6F9] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-[Georgia,serif] text-[22px] font-medium text-[#0B2A4A]">How to use The Listing Boost</h2>
        <p className="mt-3 font-sans text-[15px] leading-relaxed text-slate-600">
          The conversation that turns seller resistance into seller buy-in — with specific numbers, not generalities.
        </p>

        <div className="mt-10 space-y-10">
          <div>
            <h3 className="font-[Georgia,serif] text-[18px] font-medium text-[#0B2A4A]">When to reach for this tool</h3>
            <p className="mt-3 font-sans text-[14px] leading-relaxed text-slate-700">
              The Listing Boost is your stale listing rescue tool. Reach for it when: a listing has been on the market 14+ days without an offer, the
              seller is asking about a price cut, a showing feedback pattern suggests payment sensitivity, or you&apos;re preparing a price strategy
              conversation. Run it before the meeting, not during — so you arrive with the numbers already done.
            </p>
            <div className="mt-4 rounded-xl border-2 border-[#0B2A4A]/25 bg-[rgba(11,42,74,0.04)] px-4 py-3 font-sans text-[13px] leading-relaxed text-[#0B2A4A]">
              The most powerful use: run it before a price reduction conversation. Instead of &apos;we need to cut the price,&apos; walk in with
              &apos;here are three options — and two of them net you more than a price cut while reaching more buyers.&apos;
            </div>
            <p className="mt-4">
              <Link
                to="/deal-desk/listing-boost"
                className="font-sans text-[14px] font-semibold text-[#0B2A4A] underline decoration-[#C6A15B]/50 underline-offset-2"
              >
                Open The Listing Boost →
              </Link>
            </p>
          </div>

          <div>
            <h3 className="font-[Georgia,serif] text-[18px] font-medium text-[#0B2A4A]">The number that changes seller conversations</h3>
            <p className="mt-3 font-sans text-[14px] leading-relaxed text-slate-700">
              Most sellers think about concessions in terms of what they give up. The Listing Boost reframes it as what they gain — specifically, how
              many more qualified buyers walk through the door. The qualifying income threshold is the key number: it&apos;s the minimum annual
              household income a buyer needs to qualify at a given payment level. When you show a seller that a $15,000 buydown drops the qualifying
              threshold by $18,000 in required annual income — opening the home to 12% more of the buyer pool — the conversation shifts from
              &apos;what does this cost me&apos; to &apos;how soon can we do this.&apos;
            </p>
            <div className="mt-4 rounded-xl border-2 border-[#C6A15B]/50 bg-[rgba(198,161,91,0.08)] px-4 py-3 font-sans text-[13px] leading-relaxed text-[#0B2A4A]">
              A price cut reduces the loan amount. A buydown reduces the rate. The buydown almost always has a larger impact on the qualifying income
              threshold — which is what actually determines how many buyers can afford the home.
            </div>
          </div>

          <div>
            <h3 className="font-[Georgia,serif] text-[18px] font-medium text-[#0B2A4A]">Reading the three scenarios with a seller</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border-2 border-[#185FA5]/25 bg-[rgba(24,95,165,0.06)] p-4">
                <p className="font-sans text-[12px] font-semibold text-[#185FA5]">Scenario A — Price cut</p>
                <p className="mt-2 font-sans text-[13px] leading-relaxed text-slate-800">
                  Show this first. It&apos;s the seller&apos;s default instinct. Make sure they see the monthly payment savings AND the net proceeds
                  before you move on.
                </p>
              </div>
              <div className="rounded-xl border-2 border-[#0B2A4A]/35 bg-[rgba(11,42,74,0.06)] p-4">
                <p className="font-sans text-[12px] font-semibold text-[#C6A15B]">Scenario B — 2-1 Buydown</p>
                <p className="mt-2 font-sans text-[13px] leading-relaxed text-slate-800">
                  This is the recommendation. Walk them through the Year 1 payment, the pool expansion percentage, and the net proceeds comparison.
                  In most scenarios, they net more AND reach more buyers.
                </p>
              </div>
              <div className="rounded-xl border-2 border-[#1E4D8C]/30 bg-[rgba(30,77,140,0.08)] p-4">
                <p className="font-sans text-[12px] font-semibold text-[#0B2A4A]">Scenario C — 1-0 Buydown</p>
                <p className="mt-2 font-sans text-[13px] leading-relaxed text-slate-800">
                  The lower-cost option. Useful when the budget is tight or when the seller wants to use leftover concession dollars for closing
                  costs.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-[Georgia,serif] text-[18px] font-medium text-[#0B2A4A]">Script: presenting the analysis</h3>
            <div className="mt-4 space-y-5">
              <figure
                className="relative rounded-r-lg border border-[rgba(11,42,74,0.1)] border-l-[3px] border-l-[#C6A15B] bg-[rgba(11,42,74,0.03)] py-4 pl-5 pr-4"
                style={{ borderRadius: "0 8px 8px 0" }}
              >
                <figcaption className="font-sans text-[11px] italic text-slate-500">Opening the conversation</figcaption>
                <p className="mt-1 font-sans text-[11px] text-slate-600">Use when a seller brings up a price cut or asks why the listing isn&apos;t moving.</p>
                <blockquote className="mt-2 font-[Georgia,serif] text-[14px] italic leading-[1.65] text-[#0B2A4A]">{SCRIPT_OPENING}</blockquote>
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => copy(0, SCRIPT_OPENING)}
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
                <figcaption className="font-sans text-[11px] italic text-slate-500">Presenting the buydown recommendation</figcaption>
                <p className="mt-1 font-sans text-[11px] text-slate-600">After showing the three-scenario comparison.</p>
                <blockquote className="mt-2 font-[Georgia,serif] text-[14px] italic leading-[1.65] text-[#0B2A4A]">{SCRIPT_BUYDOWN}</blockquote>
                <p className="mt-3 font-sans text-[11px] text-slate-500">
                  (Replace bracketed values with the actual numbers from the Listing Boost tool for this specific listing.)
                </p>
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => copy(1, SCRIPT_BUYDOWN)}
                    className="font-sans text-[11px] font-semibold uppercase tracking-wide text-[#0B2A4A] underline decoration-[#C6A15B]/40 underline-offset-2"
                  >
                    {copied === 1 ? "Copied!" : "Copy script"}
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
