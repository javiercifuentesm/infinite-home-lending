const COLS = [
  {
    emoji: "⚡",
    title: "Deal Intelligence, Instantly",
    body: "Run buydown scenarios, net sheets, and offer structures in real time — at the listing appointment, in the car, before the offer goes in.",
  },
  {
    emoji: "🤝",
    title: "Co-Branded Execution",
    body: "Every tool output carries both your name and IHL's — so your clients see a unified team, not two separate vendors.",
  },
  {
    emoji: "📍",
    title: "Built for Washington, DC",
    body: "Market data, tax rates, and loan limits calibrated for the region you actually work in. Not national averages.",
  },
  {
    emoji: "🧠",
    title: "Nexio Strategic Partner",
    body: "Ask Nexio to stress-test a deal, interpret guidelines, or draft bilingual client communication. Broker-grade intelligence on demand.",
  },
  {
    emoji: "📡",
    title: "Daily Intelligence Loop",
    body: "Market signals, compliance alerts, and negotiation leverage — curated every morning so you walk into every conversation informed.",
  },
  {
    emoji: "🔒",
    title: "Partner Access Only",
    body: "The Deal Desk is not public. It's an operational extension of your business — exclusively for agents who partner with IHL.",
  },
] as const;

export function DealDeskValueProps() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Section label */}
      <div className="mb-12 text-center">
        <span
          className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: "rgba(198,161,91,0.6)" }}
        >
          Why The Deal Desk
        </span>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {COLS.map((c) => (
          <div
            key={c.title}
            className="rounded-xl p-6 transition-all hover:scale-[1.01]"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(198,161,91,0.12)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="mb-4 text-2xl">{c.emoji}</div>
            <h3
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "1.05rem",
                fontWeight: 500,
                color: "#F7F7F5",
                marginBottom: "0.75rem",
              }}
            >
              {c.title}
            </h3>
            <p className="font-sans text-[13px] leading-relaxed" style={{ color: "rgba(247,247,245,0.55)" }}>
              {c.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
