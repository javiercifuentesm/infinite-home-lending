import { careersColors, careersFonts } from "../careersTheme";

const NAV_ITEMS = [
  { label: "Market Pulse", active: true },
  { label: "DMV Intelligence", active: false },
  { label: "Guidelines Intel", active: false, badge: "LIVE" },
  { label: "Income Analyzer", active: false, badge: "AI" },
] as const;

const RATE_CARDS = [
  { label: "30-Yr Fixed", value: "6.82%" },
  { label: "15-Yr Fixed", value: "6.14%" },
  { label: "FHA 30-Yr", value: "6.45%" },
] as const;

const FEED = [
  "Fed minutes signal patience on next move",
  "DC inventory up 8% — negotiation window widening",
  "Fannie DU update: rental income calc change",
] as const;

/** Static crop of the live MA Command Center — for careers platform proof. */
export function MACommandCenterShowcase() {
  return (
    <div
      className="flex h-full w-full"
      style={{ background: "#F8F7F4", fontFamily: careersFonts.body }}
    >
      <aside
        style={{
          width: "34%",
          background: careersColors.navy,
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        <div style={{ padding: "12px 10px", borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}>
          <p
            style={{
              margin: 0,
              fontSize: "8px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: careersColors.gold,
              fontWeight: 600,
            }}
          >
            MA Command Center
          </p>
        </div>
        <nav style={{ padding: "8px 6px", flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 8px",
                borderRadius: "6px",
                marginBottom: "3px",
                fontSize: "9px",
                fontWeight: 500,
                background: item.active ? careersColors.gold : "transparent",
                color: item.active ? careersColors.navy : "rgba(255,255,255,0.65)",
              }}
            >
              <span style={{ flex: 1 }}>{item.label}</span>
              {"badge" in item && item.badge && (
                <span
                  style={{
                    fontSize: "7px",
                    fontWeight: 700,
                    padding: "2px 4px",
                    borderRadius: "3px",
                    background: item.active ? "rgba(11,42,74,0.15)" : "rgba(198,161,91,0.15)",
                    color: item.active ? careersColors.navy : careersColors.gold,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </nav>
      </aside>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header
          style={{
            padding: "10px 12px",
            background: "#ffffff",
            borderBottom: "0.5px solid rgba(11,42,74,0.08)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: careersFonts.heading,
              fontSize: "12px",
              fontWeight: 600,
              color: careersColors.navy,
            }}
          >
            Market Pulse
          </p>
          <p style={{ margin: "2px 0 0", fontSize: "8px", color: "rgba(46,46,46,0.4)" }}>
            Saturday, May 23, 2026
          </p>
        </header>

        <div style={{ padding: "10px 12px", flex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "5px", marginBottom: "10px" }}>
            {RATE_CARDS.map((card) => (
              <div
                key={card.label}
                style={{
                  padding: "6px",
                  background: "#ffffff",
                  border: "0.5px solid rgba(11,42,74,0.08)",
                  borderRadius: "4px",
                }}
              >
                <p style={{ margin: 0, fontSize: "7px", color: "rgba(46,46,46,0.45)" }}>{card.label}</p>
                <p
                  style={{
                    margin: "2px 0 0",
                    fontFamily: careersFonts.heading,
                    fontSize: "13px",
                    fontWeight: 600,
                    color: careersColors.navy,
                  }}
                >
                  {card.value}
                </p>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {FEED.map((line) => (
              <div
                key={line}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "6px",
                  fontSize: "8px",
                  lineHeight: 1.4,
                  color: "rgba(46,46,46,0.6)",
                  padding: "5px 6px",
                  background: "#ffffff",
                  border: "0.5px solid rgba(11,42,74,0.06)",
                  borderRadius: "3px",
                }}
              >
                <span
                  style={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: careersColors.gold,
                    flexShrink: 0,
                    marginTop: "4px",
                  }}
                />
                {line}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
