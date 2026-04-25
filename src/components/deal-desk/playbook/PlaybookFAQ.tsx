import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ = [
  {
    q: "What if I don't know the buyer's exact income and debts?",
    a: "Use estimates — round numbers work fine for negotiation planning. The tool is designed for deal strategy, not underwriting. A buyer earning roughly $100,000 and carrying $700/month in debts is accurate enough to model the conversation. Get the exact numbers when you're ready to write the offer.",
  },
  {
    q: "Do all lenders offer the 2-1 buydown structure?",
    a: "Most do, but the cost calculation can vary slightly by lender. The numbers in this tool use standard GSE methodology. IHL will quote the exact buydown cost for any specific transaction — ask us before you present the analysis to your seller.",
  },
  {
    q: "Can I share the Offer Optimizer output with my client?",
    a: "Yes — the results section is designed to be shown directly to a seller or buyer on your laptop or phone. For a formal leave-behind, use the Quick Reference Card or take a screenshot of the two panels side by side.",
  },
  {
    q: "What's the difference between the 2-1 and the permanent buydown?",
    a: "The 2-1 buydown gives the buyer maximum Year 1 relief at the lowest cost to the seller — ideal when the buyer is rate-sensitive and may refinance in 2-3 years. The permanent buydown costs more upfront but delivers savings for the full loan term — ideal for buyers planning to stay long-term who want a lower rate forever.",
  },
  {
    q: "Why does the seller net more with a buydown than a price cut?",
    a: "Because commission and transfer tax are calculated on the sale price. A price cut reduces the sale price — which reduces what commission is calculated on. A seller concession to fund a buydown is paid from proceeds but doesn't reduce the sale price itself. The math consistently favors the buydown for the seller's net by several thousand dollars.",
  },
  {
    q: "How do I get a pre-approval letter that references the buydown?",
    a: "Call or text Javier or Alma at IHL directly. They'll confirm the buyer's qualification at the buydown rate and issue a letter that references the specific structure. Most agents get this turned around within a few hours during business hours.",
  },
];

export function PlaybookFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="scroll-mt-28 border-b border-slate-200/90 bg-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-[Georgia,serif] text-[22px] font-medium text-[#0B2A4A]">Questions agents ask</h2>
        <p className="mt-3 font-sans text-[15px] text-slate-600">Straight answers on using The Deal Desk in live deals.</p>
        <ul className="mt-8 divide-y divide-slate-200/90 border-y border-slate-200/90">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} className={`relative ${isOpen ? "before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:bg-[#0B2A4A] before:content-['']" : ""}`}>
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-3 py-4 pl-3 pr-2 text-left"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="font-sans text-[14px] font-medium text-[#0B2A4A]">{item.q}</span>
                  <ChevronDown className={`mt-0.5 h-5 w-5 shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden />
                </button>
                {isOpen && (
                  <div className="pb-4 pl-3 pr-2 pt-0">
                    <p className="font-sans text-[13px] leading-[1.65] text-slate-600">{item.a}</p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
