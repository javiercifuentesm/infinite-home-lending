import { SarahKeyframes } from "../../sarah/SarahKeyframes";
import { SarahOrb } from "../../sarah/SarahOrb";
import { careersColors, careersFonts } from "../careersTheme";

const MESSAGES = [
  {
    role: "user" as const,
    text: "What's the difference between FHA and conventional for a first-time buyer?",
  },
  {
    role: "assistant" as const,
    text: "FHA often allows lower down payments and more flexible credit guidelines. Conventional may offer lower monthly MI over time. An advisor can structure the right comparison for your situation.",
  },
];

/** Static crop of the live Sarah concierge widget — for careers platform proof. */
export function SarahShowcase() {
  return (
    <div
      className="h-full w-full"
      style={{
        background: "linear-gradient(165deg, #0a1628 0%, #080F1A 55%, #050d18 100%)",
        fontFamily: careersFonts.body,
      }}
    >
      <SarahKeyframes />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "14px 16px",
          borderBottom: "0.5px solid rgba(198,161,91,0.15)",
        }}
      >
        <SarahOrb size="md" showOnlineDot static />
        <div>
          <p
            style={{
              margin: 0,
              fontFamily: careersFonts.heading,
              fontSize: "14px",
              fontWeight: 600,
              color: "#fff",
            }}
          >
            Sarah
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "9px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            IHL Mortgage Concierge
          </p>
        </div>
      </div>

      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {MESSAGES.map((msg, i) =>
          msg.role === "user" ? (
            <div key={i} style={{ display: "flex", justifyContent: "flex-end" }}>
              <div
                style={{
                  maxWidth: "78%",
                  background: "linear-gradient(135deg, #C6A15B 0%, #d4b06a 100%)",
                  borderRadius: "14px 4px 14px 14px",
                  padding: "10px 12px",
                  fontSize: "11px",
                  lineHeight: 1.55,
                  color: careersColors.navy,
                  fontWeight: 500,
                }}
              >
                {msg.text}
              </div>
            </div>
          ) : (
            <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
              <div style={{ flexShrink: 0, marginTop: "2px", transform: "scale(0.79)", transformOrigin: "top left" }}>
                <SarahOrb size="sm" static />
              </div>
              <div style={{ flex: 1, maxWidth: "82%" }}>
                <div
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(198,161,91,0.12)",
                    borderRadius: "4px 14px 14px 14px",
                    borderLeft: "3px solid rgba(198,161,91,0.4)",
                    padding: "10px 12px",
                    fontSize: "11px",
                    lineHeight: 1.55,
                    color: "rgba(247,247,245,0.9)",
                  }}
                >
                  {msg.text}
                </div>
                <p style={{ margin: "4px 0 0", fontSize: "8px", color: "rgba(255,255,255,0.25)" }}>
                  Sarah · Educational only
                </p>
              </div>
            </div>
          ),
        )}
      </div>

      <div
        style={{
          margin: "0 16px 14px",
          padding: "10px 12px",
          borderRadius: "3px",
          border: "0.5px solid rgba(198,161,91,0.2)",
          background: "rgba(255,255,255,0.04)",
          fontSize: "10px",
          color: "rgba(255,255,255,0.3)",
        }}
      >
        Ask Sarah anything…
      </div>
    </div>
  );
}
