function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export type GateHeroProps = {
  onStartTour?: () => void;
};

export function GateHero({ onStartTour }: GateHeroProps) {
  return (
    <section
      style={{
        position: "relative",
        padding: "6rem 1.5rem 5rem",
        textAlign: "center",
        background: "#0B2A4A",
        overflow: "hidden",
      }}
    >
      {/* Animated gradient mesh orb — gold */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "60%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(198,161,91,0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
          animation: "orbFloat 8s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      {/* Animated gradient mesh orb — navy deep */}
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(11,42,74,0.8) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "orbFloat 10s ease-in-out infinite reverse",
          pointerEvents: "none",
        }}
      />
      {/* Second gold orb */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "10%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(198,161,91,0.10) 0%, transparent 70%)",
          filter: "blur(50px)",
          animation: "orbFloat 12s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* Keyframes injected via style tag */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap');
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>

      {/* Vertical gold line accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "1px",
          height: "64px",
          background: "linear-gradient(to bottom, transparent, rgba(198,161,91,0.4))",
        }}
      />

      <div style={{ position: "relative", maxWidth: "56rem", margin: "0 auto" }}>
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            borderRadius: "9999px",
            padding: "0.375rem 1rem",
            marginBottom: "2rem",
            background: "rgba(198,161,91,0.08)",
            border: "1px solid rgba(198,161,91,0.25)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div style={{ position: "relative", display: "flex", width: "8px", height: "8px" }}>
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                backgroundColor: "#C6A15B",
                opacity: 0.75,
                animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
              }}
            />
            <div
              style={{
                position: "relative",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#C6A15B",
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "sans-serif",
              fontSize: "10px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#C6A15B",
            }}
          >
            Strategic Intelligence Hub · Partner Access Only
          </span>
        </div>

        {/* Main heading */}
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            maxWidth: "20rem",
            margin: "0 auto 2rem",
          }}
        >
          <div style={{ flex: 1, height: "1px", background: "rgba(198,161,91,0.3)" }} />
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#C6A15B" }} />
          <div style={{ flex: 1, height: "1px", background: "rgba(198,161,91,0.3)" }} />
        </div>

        {/* Subheadline */}
        <p
          style={{
            maxWidth: "40rem",
            margin: "0 auto 1rem",
            fontFamily: "sans-serif",
            fontSize: "17px",
            lineHeight: 1.75,
            color: "rgba(247,247,245,0.7)",
          }}
        >
          Not a resource center. A command center. Built for MD·DC·VA agents who win listings, structure complex deals, and close with confidence.
        </p>

        <p
          style={{
            maxWidth: "32rem",
            margin: "0 auto 3rem",
            fontFamily: "sans-serif",
            fontSize: "13px",
            lineHeight: 1.6,
            color: "rgba(247,247,245,0.4)",
          }}
        >
          Powered by Nexio — IHL&apos;s AI Strategic Partner — and 12 live deal execution tools.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
            <button
              type="button"
              onClick={() => scrollToId("gate-access")}
              style={{
                display: "inline-flex",
                minHeight: "50px",
                minWidth: "200px",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "0.5rem",
                padding: "0.75rem 2rem",
                fontFamily: "sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                background: "linear-gradient(135deg, #C6A15B 0%, #b48e48 100%)",
                color: "#0B2A4A",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 24px rgba(198,161,91,0.25)",
              }}
            >
              Enter Partner Code →
            </button>
            <button
              type="button"
              onClick={() => scrollToId("gate-tools")}
              style={{
                display: "inline-flex",
                minHeight: "50px",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "0.5rem",
                padding: "0.75rem 2rem",
                fontFamily: "sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(198,161,91,0.3)",
                color: "#F7F7F5",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
              }}
            >
              Explore the Tools
            </button>
          </div>

          {onStartTour ? (
            <button
              type="button"
              onClick={onStartTour}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "sans-serif",
                fontSize: "12px",
                color: "rgba(247,247,245,0.5)",
                padding: "0.25rem 0",
              }}
            >
              <svg width={10} height={10} viewBox="0 0 10 10" aria-hidden>
                <path d="M0 0 L10 5 L0 10 Z" fill="#C6A15B" />
              </svg>
              Take the guided tour — ask Nexio anything
            </button>
          ) : null}
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "2rem",
            maxWidth: "32rem",
            margin: "4rem auto 0",
          }}
        >
          {[
            { value: "12", label: "Live Tools" },
            { value: "MD·DC·VA", label: "Markets Covered" },
            { value: "Nexio", label: "AI Strategic Partner" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
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
                style={{
                  fontFamily: "sans-serif",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginTop: "0.25rem",
                  color: "rgba(247,247,245,0.4)",
                }}
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
