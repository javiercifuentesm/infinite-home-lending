export function DealDeskHero() {
  return (
    <section className="relative px-4 py-24 sm:px-6 lg:py-32">
      {/* Animated gold line accent */}
      <div className="absolute left-1/2 top-0 h-16 w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-[#C6A15B]/40" />

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div
          className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5"
          style={{
            background: "rgba(198,161,91,0.08)",
            border: "1px solid rgba(198,161,91,0.25)",
          }}
        >
          {/* Animated pulse dot */}
          <div className="relative flex h-2 w-2">
            <div
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: "#C6A15B" }}
            />
            <div
              className="relative inline-flex h-2 w-2 rounded-full"
              style={{ backgroundColor: "#C6A15B" }}
            />
          </div>
          <span
            className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: "#C6A15B" }}
          >
            Strategic Intelligence Hub · Partner Access Only
          </span>
        </div>

        {/* Main heading - Playfair Display */}
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 500,
            lineHeight: 1.15,
            color: "#F7F7F5",
            letterSpacing: "-0.01em",
            marginBottom: "1.5rem",
          }}
        >
          The IHL Deal Desk
        </h1>

        {/* Gold divider */}
        <div className="mx-auto mb-8 flex max-w-xs items-center gap-4">
          <div className="h-px flex-1" style={{ background: "rgba(198,161,91,0.3)" }} />
          <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#C6A15B" }} />
          <div className="h-px flex-1" style={{ background: "rgba(198,161,91,0.3)" }} />
        </div>

        {/* Subheadline */}
        <p
          className="mx-auto mb-4 max-w-2xl font-sans text-[17px] leading-[1.75]"
          style={{ color: "rgba(247,247,245,0.7)" }}
        >
          Not a resource center. A command center. Built for Washington, DC agents who win listings, structure complex deals, and close with confidence.
        </p>

        <p
          className="mx-auto mb-12 max-w-xl font-sans text-[13px] leading-relaxed"
          style={{ color: "rgba(247,247,245,0.4)" }}
        >
          Powered by Nexio — IHL&apos;s AI Strategic Partner — and 12 live deal execution tools.
        </p>

        {/* Stats row */}
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-3 gap-8">
          {[
            { value: "12", label: "Live Tools" },
            { value: "MD·DC·VA", label: "Markets Covered" },
            { value: "Nexio", label: "AI Strategic Partner" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1.5rem",
                  fontWeight: 500,
                  color: "#C6A15B",
                }}
              >
                {s.value}
              </div>
              <div
                className="mt-1 font-sans text-[10px] uppercase tracking-wider"
                style={{ color: "rgba(247,247,245,0.4)" }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
