const COLS = [
  {
    title: "Deal math, instantly",
    body: "Run buydown scenarios, net sheets, and offer structures in real time — at the listing appointment, in the car, before the offer goes in.",
  },
  {
    title: "Co-branded results",
    body: "Every tool output carries both your name and IHL's — so your clients see a unified team, not two separate vendors.",
  },
  {
    title: "Built for MD-DC-VA",
    body: "Market data, tax rates, and loan limits calibrated for the region you actually work in. Not national averages.",
  },
] as const;

export function DealDeskValueProps() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <div className="grid gap-10 md:grid-cols-3 md:gap-8">
        {COLS.map((c) => (
          <div
            key={c.title}
            className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_24px_rgba(11,42,74,0.04)]"
          >
            <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">{c.title}</h3>
            <p className="mt-3 font-sans text-[14px] leading-relaxed text-slate-600">{c.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
