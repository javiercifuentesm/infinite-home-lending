import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Navigate } from "react-router-dom";
import { useDealDeskAuth } from "../../../hooks/useDealDeskAuth";
import "./dealDeskGate.css";
import { GateAccess } from "./GateAccess";
import { GateDiff } from "./GateDiff";
import { GateFooter } from "./GateFooter";
import { GateNav } from "./GateNav";
import { GateToolsGrid } from "./GateToolsGrid";
import { GateTour } from "./GateTour";
import { GateWhy } from "./GateWhy";
import { DealDeskPartnerCTA } from "../DealDeskPartnerCTA";
import Nexio from "../../../components/Nexio";
import { usePageMetadata } from "../../../hooks/usePageMetadata";
import { PAGE_METADATA } from "../../../lib/pageMetadata";

type DealDeskGateProps = {
  onAuth?: () => void;
};

function calcNetProceeds(salePrice: number, mortgageBalance: number, county: string, commission: number) {
  const transferTaxRates: Record<string, number> = {
    "Montgomery, MD": 0.01,
    "Prince George's, MD": 0.01,
    "Frederick, MD": 0.01,
    "Howard, MD": 0.01,
    "Anne Arundel, MD": 0.01,
    "Washington, DC": 0.01375,
    "Fairfax, VA": 0.0025,
    "Arlington, VA": 0.0025,
    "Alexandria, VA": 0.0025,
  };
  const taxRate = transferTaxRates[county] ?? 0.01;
  const transferTax = Math.round(salePrice * taxRate);
  const commissionAmt = Math.round(salePrice * (commission / 100));
  const titleEscrow = Math.round(salePrice * 0.005);
  const netProceeds = salePrice - transferTax - commissionAmt - titleEscrow - mortgageBalance;
  return { transferTax, commissionAmt, titleEscrow, netProceeds };
}

const GATE_PREVIEW_INPUT_STYLE: CSSProperties = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
  padding: "7px 11px",
  fontFamily: "sans-serif",
  fontSize: "13px",
  color: "#0B2A4A",
  fontWeight: 500,
  width: "100%",
  boxSizing: "border-box",
  outline: "none",
};

function GateDollarPreviewInput({
  label,
  value,
  onCommit,
}: {
  label: string;
  value: number;
  onCommit: (n: number) => void;
}) {
  const [localStr, setLocalStr] = useState(() =>
    value.toLocaleString("en-US", { maximumFractionDigits: 0 }),
  );

  useEffect(() => {
    setLocalStr((prev) => {
      const stripped = prev.replace(/,/g, "");
      if (stripped === "" || stripped === "-") return prev;
      const parsed = parseFloat(stripped);
      if (!Number.isFinite(parsed)) return prev;
      if (Math.round(parsed) === Math.round(value)) return prev;
      return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
    });
  }, [value]);

  const commitIfValid = (rawStripped: string): number | null => {
    if (rawStripped === "" || rawStripped === "-" || /\.$/.test(rawStripped)) return null;
    const n = parseFloat(rawStripped);
    if (!Number.isFinite(n)) return null;
    return n;
  };

  const inputStyle: CSSProperties = {
    ...GATE_PREVIEW_INPUT_STYLE,
    paddingLeft: "22px",
  };

  return (
    <div>
      <div
        style={{
          fontFamily: "sans-serif",
          fontSize: "9px",
          color: "#9ca3af",
          marginBottom: "3px",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </div>
      <div style={{ position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: "11px",
            top: "50%",
            transform: "translateY(-50%)",
            fontFamily: "sans-serif",
            fontSize: "12px",
            color: "#9ca3af",
            pointerEvents: "none",
          }}
        >
          $
        </span>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={localStr}
          style={inputStyle}
          onChange={(e) => {
            const raw = e.target.value.replace(/,/g, "");
            if (raw === "" || raw === "-") {
              setLocalStr(raw);
              return;
            }
            const n = commitIfValid(raw);
            if (n !== null) {
              setLocalStr(n.toLocaleString("en-US", { maximumFractionDigits: 0 }));
              onCommit(n);
            }
          }}
          onBlur={() => {
            const stripped = localStr.replace(/,/g, "");
            const n = commitIfValid(stripped);
            if (n === null) {
              setLocalStr(value.toLocaleString("en-US", { maximumFractionDigits: 0 }));
            }
          }}
        />
      </div>
    </div>
  );
}

/** Partner code gate — route: /deal-desk/partner-access */
export function DealDeskGate({ onAuth }: DealDeskGateProps) {
  const { isAuthenticated } = useDealDeskAuth();
  const authed = isAuthenticated();
  const rootRef = useRef<HTMLDivElement>(null);
  const [tourActive, setTourActive] = useState(false);
  const [previewInputs, setPreviewInputs] = useState({
    salePrice: 650000,
    mortgageBalance: 320000,
    county: "Montgomery, MD",
    commission: 3,
  });

  const scenario1 = calcNetProceeds(
    previewInputs.salePrice,
    previewInputs.mortgageBalance,
    previewInputs.county,
    previewInputs.commission,
  );
  const scenario2 = calcNetProceeds(
    previewInputs.salePrice * 0.96,
    previewInputs.mortgageBalance,
    previewInputs.county,
    previewInputs.commission,
  );
  const scenario3 = calcNetProceeds(
    previewInputs.salePrice * 0.92,
    previewInputs.mortgageBalance,
    previewInputs.county,
    previewInputs.commission,
  );

  const fmtUsd = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  usePageMetadata(PAGE_METADATA.dealDeskPartnerAccess);

  useEffect(() => {
    if (authed) return;
    const el = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const created = !el;
    const prevContent = el?.getAttribute("content") ?? null;
    let meta = el;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "noindex, nofollow");

    return () => {
      if (created && meta?.parentNode) {
        meta.parentNode.removeChild(meta);
      } else if (meta && !created) {
        if (prevContent !== null) meta.setAttribute("content", prevContent);
        else meta.removeAttribute("content");
      }
    };
  }, [authed]);

  useEffect(() => {
    if (authed) return;
    document.body.classList.add("deal-desk-gate-active");
    return () => {
      document.body.classList.remove("deal-desk-gate-active");
    };
  }, [authed]);

  useEffect(() => {
    if (authed) return;
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("gate-in");
        });
      },
      { threshold: 0 },
    );

    root.querySelectorAll(".gate-fade").forEach((el) => observer.observe(el));

    const t = window.setTimeout(() => {
      root.querySelectorAll(".gate-fade").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("gate-in");
      });
    }, 50);

    const fallbackTimer = window.setTimeout(() => {
      document.querySelectorAll(".gate-fade").forEach((el) => {
        el.classList.add("gate-in");
      });
    }, 300);

    return () => {
      window.clearTimeout(t);
      window.clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, [authed]);

  if (authed) {
    return <Navigate to="/deal-desk" replace />;
  }

  return (
    <div ref={rootRef} className="deal-desk-gate min-h-screen bg-white">
      <GateNav />
      <main>
        {/* ── HERO TILE ── */}
        <section
          id="gate-hero"
          style={{
            padding: "calc(3rem + var(--site-header-height, 80px)) clamp(1.5rem, 5vw, 4rem) 2rem",
            background: "#F7F7F5",
          }}
        >
          <div
            className="gate-hero-tile"
            style={{
              maxWidth: "1100px",
              margin: "0 auto",
              borderRadius: "20px",
              overflow: "hidden",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              background: "#0B2A4A",
              boxShadow: "0 24px 64px rgba(11,42,74,0.18)",
            }}
          >
            {/* LEFT — Story */}
            <div
              style={{
                padding: "2.5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-60px",
                  right: "-60px",
                  width: "240px",
                  height: "240px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(198,161,91,0.1) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              <div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 12px",
                    borderRadius: "999px",
                    border: "1px solid rgba(198,161,91,0.3)",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#C6A15B" }} />
                  <span style={{ fontSize: "10px", color: "#C6A15B", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "sans-serif" }}>
                    Strategic Intelligence Hub · Partner Access Only
                  </span>
                </div>

                <h1
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)",
                    fontWeight: 500,
                    color: "#F7F7F5",
                    lineHeight: 1.2,
                    marginBottom: "1rem",
                  }}
                >
                  Win listings before the offer goes in.
                </h1>

                <p
                  style={{
                    fontFamily: "sans-serif",
                    fontSize: "14px",
                    color: "rgba(247,247,245,0.58)",
                    lineHeight: 1.75,
                    marginBottom: "1.5rem",
                    maxWidth: "380px",
                  }}
                >
                  Real math, real data, real scripts — at the moment that matters. 12 tools built for MD·DC·VA agents who close.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "1.75rem" }}>
                  {[
                    { title: "12 live deal execution tools", sub: "From listing appointment to closing table" },
                    { title: "Nexio — The Deal Desk Virtual Assistant", sub: "Your market. Your tools. Your deals — worked in your favor" },
                    { title: "Intelligence Loop", sub: "Daily signals, compliance alerts & negotiation leverage" },
                    { title: "Real MD·DC·VA market data", sub: "Transfer taxes, rate tiers, median prices by neighborhood" },
                  ].map((f) => (
                    <div key={f.title} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          flexShrink: 0,
                          marginTop: "2px",
                          background: "rgba(198,161,91,0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#C6A15B" }} />
                      </div>
                      <div>
                        <div style={{ fontFamily: "sans-serif", fontSize: "12px", fontWeight: 600, color: "#F7F7F5", marginBottom: "1px" }}>{f.title}</div>
                        <div style={{ fontFamily: "sans-serif", fontSize: "11px", color: "rgba(247,247,245,0.4)", lineHeight: 1.5 }}>{f.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "1rem" }}>
                  <button
                    type="button"
                    onClick={() => document.getElementById("gate-access")?.scrollIntoView({ behavior: "smooth" })}
                    style={{
                      fontFamily: "sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                      padding: "9px 20px",
                      borderRadius: "7px",
                      border: "1px solid rgba(198,161,91,0.4)",
                      color: "#C6A15B",
                      background: "transparent",
                      cursor: "pointer",
                    }}
                  >
                    I have a partner code →
                  </button>
                  <button
                    type="button"
                    onClick={() => document.getElementById("gate-access")?.scrollIntoView({ behavior: "smooth" })}
                    style={{
                      fontFamily: "sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                      padding: "9px 20px",
                      borderRadius: "7px",
                      background: "#C6A15B",
                      color: "#0B2A4A",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 4px 20px rgba(198,161,91,0.3)",
                    }}
                  >
                    Become a partner →
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setTourActive(true)}
                  style={{
                    marginBottom: "1.5rem",
                    fontFamily: "sans-serif",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "rgba(247,247,245,0.45)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                  }}
                >
                  Watch the guided tour →
                </button>

                <div
                  style={{
                    display: "flex",
                    gap: "1.5rem",
                    paddingTop: "1.25rem",
                    borderTop: "1px solid rgba(198,161,91,0.12)",
                    flexWrap: "wrap",
                  }}
                >
                  {[
                    { value: "12", label: "Live tools" },
                    { value: "$430k", label: "Median owner net worth" },
                    { value: "Nexio", label: "AI Virtual Assistant" },
                    { value: "MD·DC·VA", label: "Markets" },
                  ].map((s) => (
                    <div key={s.label}>
                      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.1rem", fontWeight: 500, color: "#C6A15B" }}>{s.value}</div>
                      <div
                        style={{
                          fontFamily: "sans-serif",
                          fontSize: "9px",
                          color: "rgba(247,247,245,0.3)",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          marginTop: "2px",
                        }}
                      >
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — Live Seller Net Sheet Demo */}
            <div
              className="gate-hero-tile-right"
              style={{
                background: "rgba(255,255,255,0.97)",
                padding: "2.5rem",
                borderLeft: "1px solid rgba(198,161,91,0.15)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                borderRadius: "0 20px 20px 0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#C6A15B" }} />
                <span
                  style={{
                    fontFamily: "sans-serif",
                    fontSize: "9px",
                    fontWeight: 700,
                    color: "#C6A15B",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  Live preview — Seller Net Sheet
                </span>
              </div>

              <div>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.1rem", fontWeight: 500, color: "#0B2A4A", marginBottom: "4px" }}>
                  The tool you bring to every listing appointment.
                </div>
                <div style={{ fontFamily: "sans-serif", fontSize: "12px", color: "#9ca3af", lineHeight: 1.6 }}>
                  Three price scenarios. Real MD-DC-VA transfer taxes. Already done before you knock.
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <GateDollarPreviewInput
                  label="Sale price"
                  value={previewInputs.salePrice}
                  onCommit={(n) => setPreviewInputs((p) => ({ ...p, salePrice: n }))}
                />
                <GateDollarPreviewInput
                  label="Mortgage balance"
                  value={previewInputs.mortgageBalance}
                  onCommit={(n) => setPreviewInputs((p) => ({ ...p, mortgageBalance: n }))}
                />
                <div>
                  <div
                    style={{
                      fontFamily: "sans-serif",
                      fontSize: "9px",
                      color: "#9ca3af",
                      marginBottom: "3px",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    County
                  </div>
                  <select
                    value={previewInputs.county}
                    onChange={(e) => setPreviewInputs((p) => ({ ...p, county: e.target.value }))}
                    style={{ ...GATE_PREVIEW_INPUT_STYLE, cursor: "pointer" }}
                  >
                    <option value="Montgomery, MD">Montgomery, MD</option>
                    <option value="Prince George's, MD">Prince George&apos;s, MD</option>
                    <option value="Frederick, MD">Frederick, MD</option>
                    <option value="Howard, MD">Howard, MD</option>
                    <option value="Anne Arundel, MD">Anne Arundel, MD</option>
                    <option value="Washington, DC">Washington, DC</option>
                    <option value="Fairfax, VA">Fairfax, VA</option>
                    <option value="Arlington, VA">Arlington, VA</option>
                    <option value="Alexandria, VA">Alexandria, VA</option>
                  </select>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "sans-serif",
                      fontSize: "9px",
                      color: "#9ca3af",
                      marginBottom: "3px",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Agent commission
                  </div>
                  <div style={{ position: "relative" }}>
                    <input
                      type="number"
                      step={0.5}
                      min={0}
                      max={10}
                      value={previewInputs.commission}
                      onChange={(e) =>
                        setPreviewInputs((p) => ({
                          ...p,
                          commission: Math.min(10, Math.max(0, parseFloat(e.target.value) || 0)),
                        }))
                      }
                      style={{
                        ...GATE_PREVIEW_INPUT_STYLE,
                        paddingRight: "26px",
                        MozAppearance: "textfield",
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        right: "11px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontFamily: "sans-serif",
                        fontSize: "12px",
                        color: "#9ca3af",
                        pointerEvents: "none",
                      }}
                    >
                      %
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ background: "#0B2A4A", borderRadius: "10px", padding: "1rem 1.25rem" }}>
                <div style={{ fontFamily: "sans-serif", fontSize: "9px", color: "rgba(198,161,91,0.7)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "6px" }}>
                  Scenario 1 — Net proceeds
                </div>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.75rem", fontWeight: 500, color: "#C6A15B", marginBottom: "10px" }}>
                  {fmtUsd(scenario1.netProceeds)}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", paddingTop: "10px", borderTop: "1px solid rgba(198,161,91,0.15)" }}>
                  {[
                    { label: "Transfer tax", value: fmtUsd(scenario1.transferTax) },
                    { label: "Commission", value: fmtUsd(scenario1.commissionAmt) },
                    { label: "Title & escrow", value: fmtUsd(scenario1.titleEscrow) },
                    { label: "Mortgage payoff", value: fmtUsd(previewInputs.mortgageBalance) },
                  ].map((item) => (
                    <div key={item.label}>
                      <div style={{ fontFamily: "sans-serif", fontSize: "9px", color: "rgba(247,247,245,0.35)" }}>{item.label}</div>
                      <div style={{ fontFamily: "sans-serif", fontSize: "12px", color: "#F7F7F5", fontWeight: 500 }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                <div
                  style={{
                    background: "#0B2A4A",
                    borderRadius: "8px",
                    padding: "10px 12px",
                  }}
                >
                  <div style={{ fontFamily: "sans-serif", fontSize: "9px", color: "rgba(198,161,91,0.6)", marginBottom: "3px" }}>
                    {`Scenario 2 — $${(previewInputs.salePrice * 0.96 / 1000).toFixed(0)}k`}
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.1rem", color: "#C6A15B" }}>{fmtUsd(scenario2.netProceeds)}</div>
                </div>
                <div
                  style={{
                    background: "#0B2A4A",
                    borderRadius: "8px",
                    padding: "10px 12px",
                  }}
                >
                  <div style={{ fontFamily: "sans-serif", fontSize: "9px", color: "rgba(198,161,91,0.6)", marginBottom: "3px" }}>
                    {`Scenario 3 — $${(previewInputs.salePrice * 0.92 / 1000).toFixed(0)}k`}
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.1rem", color: "#C6A15B" }}>{fmtUsd(scenario3.netProceeds)}</div>
                </div>
              </div>

              <div
                style={{
                  background: "rgba(198,161,91,0.07)",
                  border: "1px solid rgba(198,161,91,0.2)",
                  borderRadius: "7px",
                  padding: "10px 14px",
                  textAlign: "center",
                }}
              >
                <span style={{ fontFamily: "sans-serif", fontSize: "11px", color: "#C6A15B", fontWeight: 500 }}>
                  Enter your partner code above to save, export, and access all 12 tools
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: NEXIO SHOWCASE ── */}
        <section
          style={{
            background: "#0B2A4A",
            padding: "4rem clamp(1.5rem, 5vw, 4rem)",
            borderTop: "1px solid rgba(198,161,91,0.15)",
          }}
        >
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div
                style={{
                  fontFamily: "sans-serif",
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#C6A15B",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: "1rem",
                }}
              >
                Meet your AI Virtual Assistant
              </div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                  fontWeight: 500,
                  color: "#F7F7F5",
                  marginBottom: "1rem",
                }}
              >
                Nexio — The Deal Desk Virtual Assistant
              </h2>
              <p
                style={{
                  fontFamily: "sans-serif",
                  fontSize: "15px",
                  color: "rgba(247,247,245,0.6)",
                  maxWidth: "540px",
                  margin: "0 auto",
                  lineHeight: 1.75,
                }}
              >
                Your market. Your tools. Your deals. Nexio knows them all — and works every one of them in your favor.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              {[
                {
                  emoji: "⚖️",
                  title: "Stress-test any deal",
                  desc: "Run scenarios before the offer. Know the risks before your client does.",
                },
                {
                  emoji: "📋",
                  title: "Interpret guidelines",
                  desc: "FHA, VA, USDA, Non-QM — ask Nexio in plain English. Get broker-grade answers.",
                },
                {
                  emoji: "🌐",
                  title: "Bilingual communication",
                  desc: "Draft client emails and scripts in English and Spanish instantly.",
                },
                {
                  emoji: "📡",
                  title: "Live intelligence",
                  desc: "Nexio tags every market signal, compliance alert, and negotiation lever — daily.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(198,161,91,0.15)",
                    borderRadius: "12px",
                    padding: "1.25rem",
                  }}
                >
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>{f.emoji}</div>
                  <div
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "1rem",
                      fontWeight: 500,
                      color: "#F7F7F5",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {f.title}
                  </div>
                  <div style={{ fontFamily: "sans-serif", fontSize: "12px", color: "rgba(247,247,245,0.5)", lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 3: 12-TOOL CAROUSEL ── */}
        <GateToolsGrid />

        {/* ── SECTION 4: WHY + DIFF ── */}
        <div id="gate-why">
          <GateWhy />
        </div>
        <div id="gate-diff">
          <GateDiff />
        </div>

        {/* ── SECTION 5: INTELLIGENCE LOOP FOMO ── */}
        <section
          style={{
            background: "#0B2A4A",
            padding: "3rem clamp(1.5rem, 5vw, 4rem)",
            borderTop: "1px solid rgba(198,161,91,0.12)",
          }}
        >
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ marginBottom: "1.5rem" }}>
              <div
                style={{
                  fontFamily: "sans-serif",
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#C6A15B",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: "0.5rem",
                }}
              >
                Nexio Intelligence Loop
              </div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1.5rem",
                  fontWeight: 500,
                  color: "#F7F7F5",
                  marginBottom: "0.5rem",
                }}
              >
                Walk into every conversation already informed.
              </h2>
              <p style={{ fontFamily: "sans-serif", fontSize: "13px", color: "rgba(247,247,245,0.5)", lineHeight: 1.7 }}>
                Live market signals, compliance alerts, and negotiation leverage — curated daily by Nexio. Partner access required.
              </p>
            </div>
            <div
              className="gate-intel-preview-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "10px",
                filter: "blur(3px)",
                opacity: 0.5,
                pointerEvents: "none",
                marginBottom: "1rem",
              }}
            >
              {[
                { tag: "📊 Market Signal", title: "30-Year Fixed Rate: 6.23% ▼0.07", source: "FRED · St. Louis Fed" },
                { tag: "🔴 Compliance Alert", title: "HUD updates FHA policy on seller concessions", source: "HUD · Press Release" },
                {
                  tag: "🟢 Negotiation Leverage",
                  title: "Greater DC market starting to rebalance — buyers gaining ground",
                  source: "Google News · DMV",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(198,161,91,0.12)",
                    borderRadius: "8px",
                    padding: "1rem",
                  }}
                >
                  <div style={{ fontFamily: "sans-serif", fontSize: "10px", color: "#C6A15B", marginBottom: "6px" }}>{item.tag}</div>
                  <div style={{ fontFamily: "sans-serif", fontSize: "12px", color: "#F7F7F5", lineHeight: 1.5, marginBottom: "6px" }}>{item.title}</div>
                  <div style={{ fontFamily: "sans-serif", fontSize: "10px", color: "rgba(247,247,245,0.3)" }}>{item.source}</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontFamily: "sans-serif", fontSize: "12px", color: "rgba(247,247,245,0.4)" }}>
                🔒 Unlock live intelligence with partner access
              </span>
            </div>
          </div>
        </section>

        {/* ── SECTION 6: DUAL CTA + PARTNER ACCESS FORM ── */}
        <div id="gate-access">
          <div className="bg-[#0B2A4A]">
            <DealDeskPartnerCTA />
          </div>
          <GateAccess onAuth={onAuth} />
        </div>
      </main>
      <GateTour isActive={tourActive} onClose={() => setTourActive(false)} />
      <GateFooter />
      <Nexio />
    </div>
  );
}
