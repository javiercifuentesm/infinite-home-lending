import { useState } from "react";

type Phase = "all" | "listing" | "offer" | "buyer";

const PHASES = [
  { id: "all" as Phase, label: "Show All" },
  { id: "listing" as Phase, label: "Listing Appointment" },
  { id: "offer" as Phase, label: "At the Offer Table" },
  { id: "buyer" as Phase, label: "Buyer Intake" },
];

type Tool = {
  num: string;
  accent: string;
  phase: Phase;
  stage: string;
  name: string;
  desc: string;
  comingSoon?: boolean;
};

const TOOLS: Tool[] = [
  {
    num: "01", accent: "#C6A15B", phase: "listing",
    stage: "Phase 1 · Listing Win",
    name: "The Seller Net Sheet",
    desc: "Three price scenarios. Real MD-DC-VA transfer taxes. The tool you bring to every listing appointment — already done.",
  },
  {
    num: "02", accent: "#C6A15B", phase: "listing",
    stage: "Phase 1 · Listing Win",
    name: "The Listing Boost",
    desc: "Show sellers how many more buyers qualify at the buydown payment. Move stale listings without a price cut.",
  },
  {
    num: "03", accent: "#C6A15B", phase: "listing",
    stage: "Phase 1 · Listing Win",
    name: "Market Snapshot Generator",
    desc: "11 MD/DC/VA regions, buyer/seller modes, price range modifier. Talking points and leave-behind output in seconds.",
  },
  {
    num: "04", accent: "#C6A15B", phase: "listing",
    stage: "Phase 1 · Listing Win — Coming Soon",
    name: "Hyperlocal Absorption Rate",
    desc: "Real-time data on how fast homes are selling in specific MD/VA neighborhoods vs. the 5-year average. Walk in with data no other agent has.",
    comingSoon: true,
  },
  {
    num: "05", accent: "#185FA5", phase: "offer",
    stage: "Phase 2 · Offer Table",
    name: "The Offer Optimizer",
    desc: "Buydown vs. price cut — same seller dollars, completely different buyer payment. Show the math before the offer goes in.",
  },
  {
    num: "06", accent: "#185FA5", phase: "offer",
    stage: "Phase 2 · Offer Table",
    name: "The Assumable Calculator",
    desc: "Blended rate, equity gap, lifetime savings. Is this loan worth assuming? Answer in 60 seconds.",
  },
  {
    num: "07", accent: "#185FA5", phase: "offer",
    stage: "Phase 2 · Offer Table",
    name: "Creative Financing Playbook",
    desc: "11 tools across 6 categories, 10 scenario filters. Navigate assumables, buydowns, bridge loans, and more.",
  },
  {
    num: "08", accent: "#185FA5", phase: "offer",
    stage: "Phase 2 · Offer Table — Coming Soon",
    name: "Escalation Stress-Test",
    desc: "Show a buyer exactly how much their payment increases for every $5,000 they escalate their bid. Know your ceiling before the multiple-offer situation.",
    comingSoon: true,
  },
  {
    num: "09", accent: "#9FE1CB", phase: "buyer",
    stage: "Phase 3 · Buyer Intake",
    name: "The Client Qualifier",
    desc: "90-second buyer mortgage snapshot. Green, yellow, or red — know who's ready before you spend a weekend showing homes.",
  },
  {
    num: "10", accent: "#9FE1CB", phase: "buyer",
    stage: "Phase 3 · Buyer Intake",
    name: "The Loan Program Matchmaker",
    desc: "Input your buyer's profile and get the best-fit loan program ranked — Conventional, FHA, VA, USDA, Non-QM — with MD/DC/VA-specific programs to stack.",
  },
  {
    num: "11", accent: "#9FE1CB", phase: "buyer",
    stage: "Phase 3 · Buyer Intake",
    name: "Client Education Generator",
    desc: "16 topics × buyer/seller/refi contexts. Generate personalized education content and email drafts instantly.",
  },
  {
    num: "12", accent: "#9FE1CB", phase: "buyer",
    stage: "Phase 3 · Buyer Intake — Coming Soon",
    name: "Rent vs. Strategy Report",
    desc: "A professional printout showing the wealth-building gap over 5, 7, and 10 years — tailored to DC-metro appreciation rates. Change the conversation from 'monthly payment' to 'net worth.'",
    comingSoon: true,
  },
];

const PHASE_COLORS: Record<Phase, string> = {
  all: "#C6A15B",
  listing: "#C6A15B",
  offer: "#185FA5",
  buyer: "#9FE1CB",
};

const PHASE_LABELS: Record<Phase, string> = {
  all: "All Tools",
  listing: "Phase 1 · Listing Win",
  offer: "Phase 2 · Offer Table",
  buyer: "Phase 3 · Buyer Intake",
};

const PHASE_DESCRIPTIONS: Record<Phase, string> = {
  all: "12 tools across every moment that moves a deal — from listing appointment to closing table.",
  listing: "Win the listing before you walk in the door. These tools make you the most prepared agent in the room.",
  offer: "Structure smarter offers. Show the math. Win at the table without leaving money on the floor.",
  buyer: "Know your buyer before the first showing. Qualify, educate, and match — in 90 seconds.",
};

export function GateToolsGrid() {
  const [activePhase, setActivePhase] = useState<Phase>("all");
  const [nexioTool, setNexioTool] = useState<string | null>(null);

  const filtered = activePhase === "all" ? TOOLS : TOOLS.filter((t) => t.phase === activePhase);
  const phaseColor = PHASE_COLORS[activePhase];

  return (
    <section
      id="gate-tools"
      style={{
        background: "#F7F7F5",
        padding: "5rem clamp(1.5rem, 5vw, 4rem) 4rem",
        borderTop: "1px solid rgba(198,161,91,0.12)",
        borderBottom: "1px solid rgba(198,161,91,0.12)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ fontFamily: "sans-serif", fontSize: "10px", fontWeight: 700, color: "#C6A15B", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Inside The Deal Desk
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "end" }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 500, color: "#0B2A4A", lineHeight: 1.15, margin: 0 }}>
              A Decision-Support System for every moment that moves a deal.
            </h2>
            <p style={{ fontFamily: "sans-serif", fontSize: "14px", color: "#6b7280", lineHeight: 1.75, margin: 0 }}>
              {PHASE_DESCRIPTIONS[activePhase]}
            </p>
          </div>
        </div>

        {/* Phase filter toggle */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "2rem" }}>
          {PHASES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActivePhase(p.id)}
              style={{
                fontFamily: "sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                padding: "8px 18px",
                borderRadius: "999px",
                border: activePhase === p.id ? "none" : "1px solid rgba(198,161,91,0.25)",
                background: activePhase === p.id ? PHASE_COLORS[p.id] : "white",
                color: activePhase === p.id ? (p.id === "buyer" ? "#0B2A4A" : p.id === "offer" ? "#F7F7F5" : "#0B2A4A") : "#6b7280",
                cursor: "pointer",
                transition: "all 0.2s",
                letterSpacing: "0.02em",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Phase label strip */}
        {activePhase !== "all" && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "6px 14px", borderRadius: "8px",
            background: `${phaseColor}15`,
            border: `1px solid ${phaseColor}40`,
            marginBottom: "1.5rem",
          }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: phaseColor }} />
            <span style={{ fontFamily: "sans-serif", fontSize: "11px", fontWeight: 600, color: phaseColor, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {PHASE_LABELS[activePhase]}
            </span>
          </div>
        )}

        {/* Tool grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}>
          {filtered.map((tool) => (
            <article
              key={tool.num}
              style={{
                background: tool.comingSoon ? "rgba(247,247,245,0.5)" : "white",
                border: tool.comingSoon ? "1px dashed rgba(198,161,91,0.25)" : `1px solid ${tool.accent}25`,
                borderRadius: "12px",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                opacity: tool.comingSoon ? 0.75 : 1,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Top row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "sans-serif", fontSize: "10px", color: "#9ca3af", fontWeight: 600, letterSpacing: "0.1em" }}>{tool.num}</span>
                {tool.comingSoon ? (
                  <span style={{ fontFamily: "sans-serif", fontSize: "9px", fontWeight: 700, padding: "3px 8px", borderRadius: "999px", background: "rgba(198,161,91,0.1)", color: "#C6A15B", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Coming Soon
                  </span>
                ) : (
                  <span style={{ fontFamily: "sans-serif", fontSize: "9px", fontWeight: 700, padding: "3px 8px", borderRadius: "999px", background: "rgba(34,197,94,0.1)", color: "#16a34a", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Live Now
                  </span>
                )}
              </div>

              {/* Accent bar */}
              <div style={{ width: "28px", height: "3px", borderRadius: "2px", background: tool.accent }} />

              {/* Stage */}
              <p style={{ fontFamily: "sans-serif", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af", margin: 0 }}>
                {tool.stage}
              </p>

              {/* Name */}
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.05rem", fontWeight: 500, color: "#0B2A4A", lineHeight: 1.3, margin: 0 }}>
                {tool.name}
              </h3>

              {/* Desc */}
              <p style={{ fontFamily: "sans-serif", fontSize: "12px", lineHeight: 1.65, color: "#6b7280", margin: 0, flex: 1 }}>
                {tool.desc}
              </p>

              {/* Footer actions */}
              <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: `1px solid ${tool.accent}20`, display: "flex", gap: "8px", alignItems: "center" }}>
                {tool.comingSoon ? (
                  <button
                    type="button"
                    style={{
                      fontFamily: "sans-serif", fontSize: "11px", fontWeight: 600,
                      padding: "6px 14px", borderRadius: "6px",
                      background: "rgba(198,161,91,0.08)",
                      border: "1px solid rgba(198,161,91,0.25)",
                      color: "#C6A15B", cursor: "pointer",
                    }}
                  >
                    Notify me when live →
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setNexioTool(nexioTool === tool.name ? null : tool.name)}
                      style={{
                        fontFamily: "sans-serif", fontSize: "11px", fontWeight: 600,
                        padding: "6px 14px", borderRadius: "6px",
                        background: nexioTool === tool.name ? "#0B2A4A" : "rgba(11,42,74,0.06)",
                        border: "none",
                        color: nexioTool === tool.name ? "#C6A15B" : "#0B2A4A",
                        cursor: "pointer",
                        display: "flex", alignItems: "center", gap: "5px",
                      }}
                    >
                      <span style={{ fontSize: "10px" }}>✦</span>
                      Ask Nexio for a script
                    </button>
                  </>
                )}
              </div>

              {/* Nexio script panel */}
              {nexioTool === tool.name && (
                <div style={{
                  marginTop: "0.75rem",
                  background: "#0B2A4A",
                  borderRadius: "8px",
                  padding: "1rem",
                }}>
                  <div style={{ fontFamily: "sans-serif", fontSize: "10px", color: "#C6A15B", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px" }}>
                    ✦ Nexio — The Deal Desk Virtual Assistant
                  </div>
                  <p style={{ fontFamily: "sans-serif", fontSize: "12px", color: "rgba(247,247,245,0.7)", lineHeight: 1.65, margin: "0 0 10px" }}>
                    "Here's how I'd explain {tool.name} to your client — in plain English or Spanish. Unlock with partner access to get the full bilingual script, plus a personalized version for your next appointment."
                  </p>
                  <button
                    type="button"
                    onClick={() => document.getElementById("gate-access")?.scrollIntoView({ behavior: "smooth" })}
                    style={{
                      fontFamily: "sans-serif", fontSize: "11px", fontWeight: 600,
                      padding: "6px 14px", borderRadius: "6px",
                      background: "#C6A15B", color: "#0B2A4A",
                      border: "none", cursor: "pointer",
                    }}
                  >
                    Unlock full Nexio scripts →
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>

        {/* Scroll hint */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginTop: "0.5rem" }}>
          <div style={{ height: "1px", width: "60px", background: "rgba(198,161,91,0.3)" }} />
          <p style={{ fontFamily: "sans-serif", fontSize: "11px", color: "#9ca3af", margin: 0 }}>
            {activePhase === "all" ? "12 tools · 3 phases · Every moment that moves a deal" : `${filtered.length} tools in this phase · Switch phases above`}
          </p>
          <div style={{ height: "1px", width: "60px", background: "rgba(198,161,91,0.3)" }} />
        </div>
      </div>
    </section>
  );
}
