const CARDS = [
  {
    icon: "📍",
    title: "Real MD-DC-VA market data",
    body: "Every tool is calibrated for the market you actually work in — not national averages. Real 2026 transfer taxes for Montgomery County, Northern Virginia, Prince George's County, and DC. Real market rate tiers by credit score. Real 2025–2026 median home prices by neighborhood.",
    delay: "",
  },
  {
    icon: "⚡",
    title: "Built for the deal table",
    body: "Calculations update in real time as you type. No page reloads. No submit buttons. Pull it up on your phone at a listing appointment and walk through it with the seller — that's exactly what it's designed for.",
    delay: "gate-d2",
  },
  {
    icon: "📋",
    title: "Scripts for every moment",
    body: "Every tool includes a 5-step guided tour with exact word-for-word language for buyer and seller conversations. You don't need to study the tools. The tools teach you how to use them — and what to say.",
    delay: "gate-d3",
  },
];

export function GateDiff() {
  return (
    <section className="gate-diff">
      <div className="gate-diff__inner">
        <header className="gate-diff__header gate-fade">
          <p className="gate-section-label gate-section-label--dark">What makes it different</p>
          <h2 className="gate-diff__heading">{`Not a calculator.\nA deal partner.`}</h2>
        </header>

        <div className="gate-diff__grid">
          {CARDS.map((c) => (
            <article key={c.title} className={`gate-diff-card gate-fade ${c.delay}`.trim()}>
              <div className="gate-diff-card__icon" aria-hidden>
                {c.icon}
              </div>
              <h3 className="gate-diff-card__title">{c.title}</h3>
              <p className="gate-diff-card__body">{c.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
