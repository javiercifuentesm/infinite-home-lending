import type { ReactNode } from "react";
import { careersColors, careersFonts } from "./careersTheme";

const mockShell = {
  borderRadius: "4px",
  overflow: "hidden" as const,
  border: "0.5px solid rgba(11,42,74,0.1)",
  background: careersColors.ivory,
};

function MockChrome({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="careers-mockup mt-6 min-w-0" style={mockShell} aria-hidden>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          background: "#ffffff",
          borderBottom: "0.5px solid rgba(11,42,74,0.08)",
        }}
      >
        <span
          style={{
            fontFamily: careersFonts.body,
            fontSize: "9px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: careersColors.navy,
            fontWeight: 500,
          }}
        >
          {title}
        </span>
        <span style={{ display: "flex", gap: "4px" }}>
          {["#C6A15B", "rgba(11,42,74,0.15)", "rgba(11,42,74,0.15)"].map((c, i) => (
            <span
              key={i}
              style={{ width: "6px", height: "6px", borderRadius: "50%", background: c }}
            />
          ))}
        </span>
      </div>
      <div style={{ padding: "12px" }}>{children}</div>
    </div>
  );
}

export function SarahPlatformMockup() {
  return (
    <MockChrome title="Sarah · Client Assistant">
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ alignSelf: "flex-end", maxWidth: "78%" }}>
          <div
            style={{
              padding: "8px 10px",
              borderRadius: "4px 4px 0 4px",
              background: careersColors.navy,
              fontSize: "9px",
              lineHeight: 1.45,
              color: "rgba(255,255,255,0.88)",
            }}
          >
            What&apos;s the difference between FHA and conventional for a first-time buyer?
          </div>
        </div>
        <div style={{ alignSelf: "flex-start", maxWidth: "82%" }}>
          <div
            style={{
              padding: "8px 10px",
              borderRadius: "4px 4px 4px 0",
              background: "#ffffff",
              border: "0.5px solid rgba(11,42,74,0.08)",
              fontSize: "9px",
              lineHeight: 1.5,
              color: "rgba(46,46,46,0.75)",
            }}
          >
            FHA often allows lower down payments and more flexible credit guidelines. Conventional
            may offer lower monthly MI over time. An advisor can structure the right comparison for
            your situation.
          </div>
          <p style={{ margin: "4px 0 0", fontSize: "7px", color: "rgba(46,46,46,0.35)" }}>
            Sarah · Educational only
          </p>
        </div>
        <div
          style={{
            marginTop: "4px",
            padding: "7px 10px",
            borderRadius: "3px",
            border: "0.5px solid rgba(11,42,74,0.1)",
            background: "#ffffff",
            fontSize: "8px",
            color: "rgba(46,46,46,0.3)",
          }}
        >
          Ask Sarah a question…
        </div>
      </div>
    </MockChrome>
  );
}

export function IncomeAnalyzerPlatformMockup() {
  const docs = ["W-2", "Paystub", "VOE"] as const;

  return (
    <MockChrome title="Income Analyzer · Document Review">
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "10px" }}>
        {docs.map((doc) => (
          <span
            key={doc}
            style={{
              padding: "4px 8px",
              borderRadius: "3px",
              background: "#ffffff",
              border: "0.5px solid rgba(11,42,74,0.1)",
              fontSize: "8px",
              color: careersColors.navy,
              fontWeight: 500,
            }}
          >
            {doc}
          </span>
        ))}
      </div>
      <div
        style={{
          padding: "8px",
          borderRadius: "3px",
          background: "#ffffff",
          border: "0.5px solid rgba(11,42,74,0.08)",
        }}
      >
        <p style={{ margin: 0, fontSize: "7px", color: "rgba(46,46,46,0.45)" }}>
          Monthly qualifying income
        </p>
        <p
          style={{
            margin: "4px 0 0",
            fontSize: "14px",
            fontFamily: careersFonts.heading,
            color: careersColors.navy,
          }}
        >
          $8,420
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "8px",
            paddingTop: "6px",
            borderTop: "0.5px solid rgba(11,42,74,0.06)",
            fontSize: "8px",
          }}
        >
          <span style={{ color: "rgba(46,46,46,0.5)" }}>Trend</span>
          <span style={{ color: careersColors.gold, fontWeight: 500 }}>Stable · 24 mo</span>
        </div>
      </div>
      <div
        style={{
          marginTop: "8px",
          padding: "6px 8px",
          borderRadius: "3px",
          background: "rgba(11,42,74,0.04)",
          fontSize: "8px",
          color: "rgba(46,46,46,0.55)",
          lineHeight: 1.45,
        }}
      >
        Advisor notes: Base + bonus averaged per guidelines. Overtime excluded pending review.
      </div>
      <div
        style={{
          marginTop: "6px",
          padding: "5px 8px",
          borderRadius: "3px",
          background: "rgba(198,161,91,0.1)",
          border: "0.5px solid rgba(198,161,91,0.25)",
          fontSize: "8px",
          color: careersColors.navy,
          fontWeight: 500,
        }}
      >
        Structured analysis ready · Review required
      </div>
    </MockChrome>
  );
}

export function MACommandCenterMockup() {
  const stages = [
    { label: "Pre-App", count: 4, width: "28%" },
    { label: "Processing", count: 7, width: "48%" },
    { label: "CTC", count: 3, width: "24%" },
  ] as const;

  return (
    <MockChrome title="MA Command Center · Pipeline">
      <div style={{ display: "flex", gap: "4px", marginBottom: "10px", height: "6px" }}>
        {stages.map((s) => (
          <div
            key={s.label}
            style={{
              width: s.width,
              background:
                s.label === "Processing" ? careersColors.gold : "rgba(11,42,74,0.12)",
              borderRadius: "2px",
            }}
          />
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
        {stages.map((s) => (
          <div
            key={s.label}
            style={{
              padding: "6px",
              background: "#ffffff",
              border: "0.5px solid rgba(11,42,74,0.08)",
              borderRadius: "3px",
            }}
          >
            <p style={{ margin: 0, fontSize: "7px", color: "rgba(46,46,46,0.45)" }}>{s.label}</p>
            <p
              style={{
                margin: "2px 0 0",
                fontSize: "12px",
                fontFamily: careersFonts.heading,
                color: careersColors.navy,
              }}
            >
              {s.count}
            </p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "5px" }}>
        {[
          "Martinez file — income docs received",
          "Chen pre-approval — rate lock exp. 4 days",
          "Williams purchase — appraisal scheduled",
        ].map((line) => (
          <div
            key={line}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "8px",
              color: "rgba(46,46,46,0.6)",
            }}
          >
            <span
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: careersColors.gold,
                flexShrink: 0,
              }}
            />
            {line}
          </div>
        ))}
      </div>
    </MockChrome>
  );
}

export function PlatformMockup({
  platform,
}: {
  platform: "Sarah" | "Income Analyzer" | "MA Command Center";
}) {
  if (platform === "Sarah") return <SarahPlatformMockup />;
  if (platform === "Income Analyzer") return <IncomeAnalyzerPlatformMockup />;
  return <MACommandCenterMockup />;
}
