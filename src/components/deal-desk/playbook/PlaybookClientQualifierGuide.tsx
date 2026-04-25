import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

const SCRIPTS = [
  {
    label: "When the buyer is Green or Yellow",
    text: "I want to get you connected with my lender at Infinite Home Lending — they're who I work with exclusively in this market. Based on what I just ran, you're [qualified at your target / about 30–60 days away]. They'll confirm these numbers with a full pre-approval and answer any questions about the loan process. It's a quick call and it costs nothing. Can I make the introduction?",
  },
  {
    label: "When the buyer is Red",
    text: "I want to be straight with you — based on these numbers, you're not quite there yet. But that's fixable, and I know exactly who can help. Infinite Home Lending does a free buyer improvement consultation — they'll lay out a specific plan with timelines. Most buyers who do this are ready in 60–90 days. Worth a call?",
  },
];

export function PlaybookClientQualifierGuide() {
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
    <section id="client-qualifier-guide" className="scroll-mt-28 border-b border-slate-200/90 bg-[#F4F6F9] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-[Georgia,serif] text-[22px] font-medium text-[#0B2A4A]">How to use The Client Qualifier</h2>
        <p className="mt-3 font-sans text-[15px] leading-relaxed text-slate-600">
          Step-by-step — from the first buyer conversation to the pre-approval referral.
        </p>

        <div className="mt-10 space-y-10">
          <div>
            <h3 className="font-[Georgia,serif] text-[18px] font-medium text-[#0B2A4A]">When to run it (always before the first showing)</h3>
            <p className="mt-3 font-sans text-[14px] leading-relaxed text-slate-700">
              The Client Qualifier is not a pre-approval. It&apos;s a pre-screening tool — something you run before you commit time to a showing
              schedule. Run it at the end of the first buyer consultation call, on the spot if the buyer is sitting across from you, or before you
              confirm any showing appointment. Takes 90 seconds. Saves hours.
            </p>
            <div className="mt-4 rounded-xl border-2 border-amber-200/90 bg-amber-50 px-4 py-3 font-sans text-[13px] leading-relaxed text-amber-950">
              If the traffic light comes back Red, this is a gift — you know before you&apos;ve shown a single home. Make the IHL referral now and stay
              in touch. You&apos;ll be their agent when they&apos;re ready.
            </div>
          </div>

          <div>
            <h3 className="font-[Georgia,serif] text-[18px] font-medium text-[#0B2A4A]">Reading the three traffic light states</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border-2 border-[#27500A]/30 bg-[rgba(39,80,10,0.06)] p-4">
                <p className="font-sans text-[12px] font-semibold text-[#27500A]">🟢 Green — Show now</p>
                <p className="mt-2 font-sans text-[13px] leading-relaxed text-slate-800">
                  Buyer qualifies at or above their target today. Get the pre-approval letter from IHL before the first offer. That&apos;s the only
                  next step — don&apos;t delay it.
                </p>
              </div>
              <div className="rounded-xl border-2 border-[#854F0B]/35 bg-[rgba(133,79,11,0.07)] p-4">
                <p className="font-sans text-[12px] font-semibold text-[#854F0B]">🟡 Yellow — 30–60 day plan</p>
                <p className="mt-2 font-sans text-[13px] leading-relaxed text-slate-800">
                  Buyer is close. The specific gap and the loan type recommendation tell you exactly what to work on. Make the IHL introduction now —
                  they&apos;ll run a detailed improvement plan at no cost. Set a 30-day check-in.
                </p>
              </div>
              <div className="rounded-xl border-2 border-[#A32D2D]/35 bg-[rgba(163,45,45,0.06)] p-4">
                <p className="font-sans text-[12px] font-semibold text-[#A32D2D]">🔴 Red — 90+ day plan</p>
                <p className="mt-2 font-sans text-[13px] leading-relaxed text-slate-800">
                  Buyer needs a structured plan before showings. Be honest, be specific, and be the agent who set realistic expectations instead of
                  wasting everyone&apos;s time. This is how you earn loyalty.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-[Georgia,serif] text-[18px] font-medium text-[#0B2A4A]">The VA conversation most agents miss</h3>
            <p className="mt-3 font-sans text-[14px] leading-relaxed text-slate-700">
              If your buyer has served in the military or is active duty, run the VA scenario before any other loan type. VA loans offer: 0% down
              payment, no monthly mortgage insurance (PMI), competitive rates, and no prepayment penalty. A buyer who would need $22,500 down for a
              conventional loan needs $0 with a VA loan. That changes the entire offer strategy. Always confirm VA eligibility and get the Certificate
              of Eligibility (COE) through IHL before writing.
            </p>
            <p className="mt-4">
              <Link to="/contact" className="font-sans text-[14px] font-semibold text-[#0B2A4A] underline decoration-[#C6A15B]/50 underline-offset-2">
                Refer buyer to IHL to confirm VA eligibility →
              </Link>
            </p>
          </div>

          <div>
            <h3 className="font-[Georgia,serif] text-[18px] font-medium text-[#0B2A4A]">Script: the referral conversation</h3>
            <div className="mt-4 space-y-5">
              {SCRIPTS.map((s, i) => (
                <figure
                  key={s.label}
                  className="relative rounded-r-lg border border-[rgba(11,42,74,0.1)] border-l-[3px] border-l-[#C6A15B] bg-[rgba(11,42,74,0.03)] py-4 pl-5 pr-4"
                  style={{ borderRadius: "0 8px 8px 0" }}
                >
                  <figcaption className="font-sans text-[11px] italic text-slate-500">{s.label}</figcaption>
                  <blockquote className="mt-2 font-[Georgia,serif] text-[14px] italic leading-[1.65] text-[#0B2A4A]">{s.text}</blockquote>
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => copy(i, s.text)}
                      className="font-sans text-[11px] font-semibold uppercase tracking-wide text-[#0B2A4A] underline decoration-[#C6A15B]/40 underline-offset-2"
                    >
                      {copied === i ? "Copied!" : "Copy script"}
                    </button>
                  </div>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
