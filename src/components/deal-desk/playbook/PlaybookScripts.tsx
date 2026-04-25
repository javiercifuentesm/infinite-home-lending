import { useCallback, useState } from "react";

const SCRIPTS = [
  {
    title: "Opening the buydown conversation with a seller",
    context: "Use this when introducing the Offer Optimizer analysis at a listing appointment or price reduction discussion.",
    text: "Before we talk about reducing the price, I want to show you something. I've run the numbers two ways — a straight price cut, and a seller-funded buydown. Same dollar amount. Different impact. Give me two minutes and you'll see why I'm recommending we go this route.",
  },
  {
    title: "Presenting the Year 1 payment to a buyer",
    context: "Use this when showing a buyer the Scenario B panel for the first time.",
    text: "Your payment in Year 1 with this buydown is [Year 1 pmt]. That's [monthly diff] less than you'd pay without it. And that comes from the seller's concession — not from you paying more. After Year 1 it adjusts, but by then you've built some equity and you'll have a better picture of where rates are headed.",
  },
  {
    title: "Overcoming seller resistance to concessions",
    context: "Use when a seller says 'I don't want to give anything away.'",
    text: "I completely understand that. Let me show you what the math actually says. If you give a $15,000 price reduction, you net [net A]. If you use that same $15,000 to fund the buydown, you net [net B]. You're not giving money away — you're moving it from one line item to another. And your buyer gets a lower payment in the process.",
  },
  {
    title: "When the buyer only qualifies with the buydown",
    context: "Use when the qualification delta shows the buyer needs the buydown rate to qualify.",
    text: "Here's something important — at the current market rate, this buyer is right at the edge of qualifying for this price. With the buydown in place, they qualify comfortably. Your seller's concession isn't just sweetening the deal. It's the reason this deal closes.",
  },
  {
    title: "Closing with the IHL pre-approval",
    context: "Use to introduce the pre-approval that references the buydown structure.",
    text: "I want to send an offer package that tells a complete story. So I'm going to get a pre-approval letter from my lender at Infinite Home Lending that specifically references this buydown structure — the qualified loan amount, the Year 1 payment, and the structure we've modeled here. The seller's agent will have everything in one place.",
  },
];

export function PlaybookScripts() {
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
    <section id="scripts" className="scroll-mt-28 border-b border-slate-200/90 bg-[#F4F6F9] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-[Georgia,serif] text-[22px] font-medium text-[#0B2A4A]">Scripts that move deals</h2>
        <p className="mt-3 font-sans text-[15px] leading-relaxed text-slate-600">
          Word-for-word language for the moments that matter. Copy these directly or make them your own.
        </p>
        <div className="mt-8 space-y-5">
          {SCRIPTS.map((s, i) => (
            <figure
              key={s.title}
              className="relative rounded-r-lg border border-[rgba(11,42,74,0.1)] border-l-[3px] border-l-[#C6A15B] bg-[rgba(11,42,74,0.03)] py-4 pl-5 pr-4"
              style={{ borderRadius: "0 8px 8px 0" }}
            >
              <figcaption className="font-sans text-[13px] font-medium text-[#0B2A4A]">{s.title}</figcaption>
              <p className="mb-2 mt-1 font-sans text-[11px] italic text-slate-500">{s.context}</p>
              <blockquote className="font-[Georgia,serif] text-[14px] italic leading-[1.65] text-[#0B2A4A]">{s.text}</blockquote>
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
    </section>
  );
}
