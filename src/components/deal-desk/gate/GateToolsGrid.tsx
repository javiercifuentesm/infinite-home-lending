const LIVE = (
  <span className="gate-live-badge">
    Live now
  </span>
);

export function GateToolsGrid() {
  return (
    <section id="gate-tools" className="gate-tools">
      <div className="gate-tools__inner">
        <p className="gate-section-label gate-fade">Inside The Deal Desk</p>

        <div className="gate-tools__grid">
          <article className="gate-tool-card gate-tool-card--featured gate-fade">
            <span className="gate-tool-card__num">01 — Featured</span>
            <div className="gate-tool-card__accent" style={{ background: "var(--gold)" }} />
            <p className="gate-tool-card__stage">Pre-listing · Before the appointment</p>
            <h3 className="gate-tool-card__name">{`The Seller\nNet Sheet`}</h3>
            <p className="gate-tool-card__desc">
              Three price scenarios. Real MD-DC-VA jurisdiction-specific transfer taxes. The tool you bring to every listing appointment — already done.
            </p>
            {LIVE}
          </article>

          <article className="gate-tool-card gate-tool-card--small gate-fade gate-d1">
            <span className="gate-tool-card__num">02</span>
            <div className="gate-tool-card__accent" style={{ background: "#9FE1CB" }} />
            <p className="gate-tool-card__stage">Buyer Consult · Before the first showing</p>
            <h3 className="gate-tool-card__name">The Client Qualifier</h3>
            <p className="gate-tool-card__desc">
              90-second buyer mortgage snapshot. Green, yellow, or red — know who&apos;s ready before you unlock a door.
            </p>
            {LIVE}
          </article>

          <article className="gate-tool-card gate-tool-card--small gate-fade gate-d2">
            <span className="gate-tool-card__num">03</span>
            <div className="gate-tool-card__accent" style={{ background: "var(--gold)" }} />
            <p className="gate-tool-card__stage">Offer Table · At the offer table</p>
            <h3 className="gate-tool-card__name">The Offer Optimizer</h3>
            <p className="gate-tool-card__desc">
              Buydown vs. price cut — same seller dollars, completely different buyer payment.
            </p>
            {LIVE}
          </article>

          <article className="gate-tool-card gate-tool-card--small gate-fade gate-d3">
            <span className="gate-tool-card__num">04</span>
            <div className="gate-tool-card__accent" style={{ background: "#C6A15B" }} />
            <p className="gate-tool-card__stage">Stale Listing · When it isn&apos;t moving</p>
            <h3 className="gate-tool-card__name">The Listing Boost</h3>
            <p className="gate-tool-card__desc">
              Show sellers how many more buyers qualify at the buydown payment. No price cut required.
            </p>
            {LIVE}
          </article>

          <article className="gate-tool-card gate-tool-card--small gate-fade gate-d4">
            <span className="gate-tool-card__num">05</span>
            <div className="gate-tool-card__accent" style={{ background: "#185FA5" }} />
            <p className="gate-tool-card__stage">Rate Advantage · FHA/VA/USDA</p>
            <h3 className="gate-tool-card__name">The Assumable Calculator</h3>
            <p className="gate-tool-card__desc">
              Blended rate, equity gap, lifetime savings. Is this loan worth assuming? Answer in 60 seconds.
            </p>
            {LIVE}
          </article>
        </div>
      </div>
    </section>
  );
}
