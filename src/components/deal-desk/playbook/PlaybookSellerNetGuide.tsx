import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

const SCRIPT_OPENING = `Before we talk about what to list at, I want to walk you through something I put together last night. This is your seller net sheet — it shows exactly what you walk away with at three different price points, with the actual transfer taxes for [county] already calculated. Most agents don't show this until after you are under contract. I prefer to show it now, so we are making every decision with the real numbers in front of us.`;

const SCRIPT_OFFER = `The buyer is asking us to accept [X] — that is [Y%] below your asking price. Let me show you what that means in your net proceeds. At your asking price, you walk away with [Z]. At their number, you walk away with [W]. The difference is [D] in your pocket. Is this offer worth accepting at that price, or do we counter?`;

export function PlaybookSellerNetGuide() {
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
    <section id="seller-net-sheet-guide" className="scroll-mt-28 border-b border-slate-200/90 bg-[#F4F6F9] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-[Georgia,serif] text-[22px] font-medium text-[#0B2A4A]">How to use The Seller Net Sheet</h2>
        <p className="mt-3 font-sans text-[15px] leading-relaxed text-slate-600">
          The listing appointment tool. Arrive with the numbers already done — and a seller who trusts you from the first conversation.
        </p>

        <div className="mt-10 space-y-10">
          <div>
            <h3 className="font-[Georgia,serif] text-[18px] font-medium text-[#0B2A4A]">When to run it</h3>
            <p className="mt-3 font-sans text-[14px] leading-relaxed text-slate-700">
              The Seller Net Sheet is the only Deal Desk tool you prepare before the client meeting — not during it. Run it the night before the
              listing appointment. Use the price you plan to recommend and the payoff amount the seller gave you. Bring it printed or pulled up on
              your phone. The preparation is the message.
            </p>
            <div className="mt-4 rounded-xl border-2 border-[#0B2A4A]/25 bg-[rgba(11,42,74,0.04)] px-4 py-3 font-sans text-[13px] leading-relaxed text-[#0B2A4A]">
              Run it at three price points: your recommended list price, 3% below, and 5% below. Arrive knowing exactly what number to defend — and
              what it costs the seller in real dollars to concede each percentage point.
            </div>
            <p className="mt-4">
              <Link
                to="/deal-desk/net-sheet"
                className="font-sans text-[14px] font-semibold text-[#0B2A4A] underline decoration-[#C6A15B]/50 underline-offset-2"
              >
                Open The Seller Net Sheet →
              </Link>
            </p>
          </div>

          <div>
            <h3 className="font-[Georgia,serif] text-[18px] font-medium text-[#0B2A4A]">The transfer tax conversation — why jurisdiction matters</h3>
            <p className="mt-3 font-sans text-[14px] leading-relaxed text-slate-700">
              Transfer taxes are the line item most agents under-explain and most sellers underestimate. The variation across MD-DC-VA is not
              subtle — it is thousands of dollars.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border-2 border-[#185FA5]/25 bg-[rgba(24,95,165,0.06)] p-4">
                <p className="font-sans text-[12px] font-semibold text-[#185FA5]">Maryland</p>
                <p className="mt-2 font-sans text-[13px] leading-relaxed text-slate-800">
                  State transfer tax plus county transfer and recordation. Montgomery County: ~1.0–1.5% total seller share. Prince George&apos;s: ~1.2%.
                  On a $600,000 sale in Montgomery County: $6,000–$9,000 from the seller&apos;s proceeds — before commission.
                </p>
              </div>
              <div className="rounded-xl border-2 border-emerald-700/25 bg-[rgba(22,101,52,0.06)] p-4">
                <p className="font-sans text-[12px] font-semibold text-emerald-800">Northern Virginia</p>
                <p className="mt-2 font-sans text-[13px] leading-relaxed text-slate-800">
                  VA grantor tax: 0.25% total (0.10% state + 0.15% regional). On a $600,000 sale: approximately $1,500. Buyers pay recordation
                  separately. Significantly lower than Maryland — worth mentioning explicitly to sellers comparing markets.
                </p>
              </div>
              <div className="rounded-xl border-2 border-[#C6A15B]/40 bg-[rgba(198,161,91,0.08)] p-4">
                <p className="font-sans text-[12px] font-semibold text-[#854F0B]">Washington DC</p>
                <p className="mt-2 font-sans text-[13px] leading-relaxed text-slate-800">
                  DC deed transfer tax: 1.1% under $400,000 — 1.45% at $400,000 and above. On a $600,000 DC sale: approximately $8,700. Buyer pays
                  recordation separately.
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-xl border-2 border-[#C6A15B]/50 bg-[rgba(198,161,91,0.08)] px-4 py-3 font-sans text-[13px] leading-relaxed text-[#0B2A4A]">
              The same $600,000 sale costs a seller approximately $1,500 in transfer taxes in Northern Virginia — and up to $9,000 in Montgomery
              County. That $7,500 difference never appears in a generic calculator. It appears in yours.
            </div>
          </div>

          <div>
            <h3 className="font-[Georgia,serif] text-[18px] font-medium text-[#0B2A4A]">How to use the three scenarios</h3>
            <p className="mt-3 font-sans text-[14px] leading-relaxed text-slate-700">
              Frame the conversation as a decision framework, not a prediction. The three scenarios are not what will happen — they are the ruler
              the seller uses to measure every offer they receive. Left card: their goal. Middle: what a reasonable negotiation costs them. Right:
              the floor. Every buyer offer, every counteroffer, every concession request from an inspector should be evaluated against these three
              numbers.
            </p>
            <div className="mt-4 rounded-xl border border-amber-200/90 bg-amber-50 px-4 py-3 font-sans text-[13px] leading-relaxed text-amber-950">
              When a buyer requests a price reduction, translate it immediately to the seller&apos;s net — not the percentage. &quot;They are asking
              for $15,000 off the price. In your pocket, that is approximately $14,400 less after the commission adjustment.&quot; That specificity is
              what builds seller confidence in your guidance.
            </div>
          </div>

          <div>
            <h3 className="font-[Georgia,serif] text-[18px] font-medium text-[#0B2A4A]">Scripts — two listing appointment moments</h3>
            <div className="mt-4 space-y-5">
              <figure
                className="relative rounded-r-lg border border-[rgba(11,42,74,0.1)] border-l-[3px] border-l-[#C6A15B] bg-[rgba(11,42,74,0.03)] py-4 pl-5 pr-4"
                style={{ borderRadius: "0 8px 8px 0" }}
              >
                <figcaption className="font-sans text-[11px] italic text-slate-500">Opening with the net sheet</figcaption>
                <p className="mt-1 font-sans text-[11px] text-slate-600">Use at the start of the listing appointment before discussing price.</p>
                <blockquote className="mt-2 font-[Georgia,serif] text-[14px] italic leading-[1.65] text-[#0B2A4A]">{SCRIPT_OPENING}</blockquote>
                <p className="mt-2 font-sans text-[11px] text-slate-500">(Replace [county] with your jurisdiction from the tool.)</p>
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
                <figcaption className="font-sans text-[11px] italic text-slate-500">Responding to a buyer&apos;s price reduction request</figcaption>
                <p className="mt-1 font-sans text-[11px] text-slate-600">Use when presenting a lower offer to a seller.</p>
                <blockquote className="mt-2 font-[Georgia,serif] text-[14px] italic leading-[1.65] text-[#0B2A4A]">{SCRIPT_OFFER}</blockquote>
                <p className="mt-2 font-sans text-[11px] text-slate-500">
                  (Replace bracketed values with offer price, percentages, and net proceeds from the Seller Net Sheet for this listing.)
                </p>
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => copy(1, SCRIPT_OFFER)}
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
