const CARDS = [
  {
    mono: "01",
    dot: "var(--navy)",
    stage: "Pre-listing · Before the appointment",
    tool: "The Seller Net Sheet",
    desc: "Three price scenarios. Real MD-DC-VA transfer taxes. Arrive with the numbers done.",
    delay: "",
  },
  {
    mono: "02",
    dot: "var(--gold)",
    stage: "Buyer Consult · Before the first showing",
    tool: "The Client Qualifier",
    desc: "90-second snapshot. Green, yellow, or red — know who's ready.",
    delay: "gate-d1",
  },
  {
    mono: "03",
    dot: "#1B4D1B",
    stage: "Active Negotiation · Offer table",
    tool: "The Offer Optimizer",
    desc: "Buydown vs. price cut. Same seller dollars — completely different impact on the payment.",
    delay: "gate-d2",
  },
  {
    mono: "04",
    dot: "#854F0B",
    stage: "Stale Listing · When it isn't moving",
    tool: "The Listing Boost",
    desc: "More buyers qualify at the buydown payment. Move the listing without a price cut.",
    delay: "gate-d3",
  },
  {
    mono: "05",
    dot: "#185FA5",
    stage: "Rate Advantage · FHA/VA/USDA",
    tool: "The Assumable Calculator",
    desc: "Blended rate, equity gap, lifetime advantage — in 60 seconds.",
    delay: "gate-d4",
  },
];

export function GateTimeline() {
  return (
    <section className="gate-timeline">
      <div className="gate-timeline__inner">
        <header className="gate-timeline__header gate-fade">
          <h2 className="gate-timeline__title">12 tools. Every moment that moves a deal.</h2>
          <p className="gate-timeline__sub">
            Each tool is built for a specific point in the deal cycle — from listing appointment to closing table.
          </p>
        </header>

        <div className="gate-timeline__cards">
          {CARDS.map((c, i) => (
            <article key={c.mono} className={`gate-tl-card gate-fade ${c.delay}`.trim()}>
              <div className="gate-tl-card__mono">{c.mono}</div>
              <div className="gate-tl-card__dot" style={{ background: c.dot }}>
                {i + 1}
              </div>
              <p className="gate-tl-card__stage">{c.stage}</p>
              <h3 className="gate-tl-card__tool">{c.tool}</h3>
              <p className="gate-tl-card__desc">{c.desc}</p>
              <span className="gate-tl-card__live">Live now</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
