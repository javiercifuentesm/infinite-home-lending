const stages = [
  {
    key: "playbook",
    stage: "Stage 1 — AGENT PLAYBOOK",
    accent: "bg-[#C6A15B]",
    label: "Read this first",
    tool: "The Agent Playbook",
    action:
      "See how The Deal Desk fits together: scripts, timelines, FAQs, and when to reach for each tool. Download the Quick Reference Card for your listing bag.",
    status: "live" as const,
  },
  {
    key: "pre-listing",
    stage: "Stage 2 — PRE-LISTING",
    accent: "bg-[#0B2A4A]",
    label: "Before you take the listing",
    tool: "The Seller Net Sheet",
    action: "Run three price scenarios. Show the seller what they walk away with at ask, 3% below, and 5% below. Win the listing.",
    status: "live" as const,
  },
  {
    key: "buyer",
    stage: "Stage 3 — BUYER CONSULTATION",
    accent: "bg-[#C6A15B]",
    label: "Before the first showing",
    tool: "The Client Qualifier",
    action:
      "Run a 90-second mortgage snapshot. Know who's ready to buy and who needs 30–60 more days before you tour a single home.",
    status: "live" as const,
  },
  {
    key: "negotiation",
    stage: "Stage 4 — ACTIVE NEGOTIATION",
    accent: "bg-emerald-700",
    label: "At the offer table",
    tool: "The Offer Optimizer",
    action: "Model the buydown vs. price cut. Show the seller they net more and the buyer pays less. Structure the offer before you send it.",
    status: "live" as const,
  },
  {
    key: "stale",
    stage: "Stage 5 — STALE LISTING",
    accent: "bg-amber-600",
    label: "When the listing isn't moving",
    tool: "The Listing Boost",
    action: "Show the seller what their concession budget does to the buyer pool. More qualified buyers without a price cut.",
    status: "live" as const,
  },
  {
    key: "assumable",
    stage: "Stage 6 — RATE-ADVANTAGED LISTINGS",
    accent: "bg-[#185FA5]",
    label: "FHA/VA properties with sub-5% loans",
    tool: "The Assumable Calculator",
    action: "Calculate the payment advantage of an assumable loan. Market it as a feature — not a footnote.",
    status: "live" as const,
  },
] as const;

export function PlaybookTimeline() {
  return (
    <section id="when-to-use" className="scroll-mt-28 border-b border-slate-200/90 bg-[#F4F6F9] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-[Georgia,serif] text-[22px] font-medium text-[#0B2A4A]">Match the right tool to the right moment</h2>
        <p className="mt-3 max-w-3xl font-sans text-[15px] leading-relaxed text-slate-600">
          Start with the Agent Playbook for the full picture, then reach for each tool at the right point in the deal cycle.
        </p>

        <div className="mt-10 flex gap-3 overflow-x-auto pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:thin] lg:grid lg:max-w-none lg:grid-cols-6 lg:gap-3 lg:overflow-visible">
          {stages.map((s, i) => {
            const next = stages[i + 1];
            const lineSolidAfter =
              s.status === "live" || (next ? next.status === "live" : false);
            return (
              <div key={s.key} className="flex min-w-[240px] max-w-[280px] shrink-0 flex-col lg:min-w-0 lg:max-w-none">
                <article
                  className={`flex h-full flex-col rounded-xl border bg-white p-4 shadow-sm ${
                    s.status === "live" ? "border-2 border-[#C6A15B] ring-1 ring-[#C6A15B]/25" : "border-slate-200/90"
                  }`}
                >
                  <div className={`h-1 w-10 rounded-full ${s.accent}`} aria-hidden />
                  <p className="mt-3 font-sans text-[10px] font-semibold uppercase tracking-wide text-slate-500">{s.stage}</p>
                  <p className="mt-1 font-sans text-[12px] font-medium text-[#0B2A4A]">{s.label}</p>
                  <p className="mt-2 font-[Georgia,serif] text-[14px] font-medium text-[#0B2A4A]">{s.tool}</p>
                  <div className="mt-2">
                    {s.status === "live" ? (
                      <span className="inline-block rounded-full bg-[#C6A15B] px-2 py-0.5 font-sans text-[10px] font-bold uppercase text-[#0B2A4A]">
                        Live now
                      </span>
                    ) : (
                      <span className="inline-block rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-sans text-[10px] font-semibold uppercase text-slate-500">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="mt-3 flex-1 font-sans text-[12px] leading-relaxed text-slate-600">{s.action}</p>
                </article>
                {i < stages.length - 1 && (
                  <div className="flex justify-center py-2 lg:hidden" aria-hidden>
                    <div
                      className={`h-6 w-0 border-l-2 ${lineSolidAfter ? "border-solid border-[#C6A15B]" : "border-dashed border-slate-300"}`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
