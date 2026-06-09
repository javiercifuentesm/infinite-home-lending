import { careersColors, careersFonts } from "../careersTheme";

const INCOME_ROWS = [
  { label: "Base Salary — Acme Corp", amount: "$6,250/mo" },
  { label: "Annual Bonus (24-mo avg)", amount: "$1,420/mo" },
  { label: "Overtime (excluded)", amount: "$750/mo" },
] as const;

/** Static crop of the live Income Analyzer results view — for careers platform proof. */
export function IncomeAnalyzerShowcase() {
  return (
    <div
      className="h-full w-full"
      style={{ background: "#F8F7F4", fontFamily: careersFonts.body }}
    >
      <div style={{ display: "flex", height: "100%" }}>
        <div
          style={{
            width: "38%",
            padding: "14px 12px",
            background: "#ffffff",
            borderRight: "0.5px solid rgba(11,42,74,0.08)",
          }}
        >
          <p
            style={{
              margin: "0 0 4px",
              fontFamily: careersFonts.heading,
              fontSize: "12px",
              fontWeight: 600,
              color: careersColors.navy,
            }}
          >
            Income Analyzer
          </p>
          <p style={{ margin: "0 0 12px", fontSize: "9px", color: "rgba(46,46,46,0.45)" }}>
            AI-powered · 1003-ready output
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "10px" }}>
            {["W-2", "Paystub", "VOE"].map((doc) => (
              <span
                key={doc}
                style={{
                  padding: "3px 7px",
                  borderRadius: "3px",
                  background: "rgba(11,42,74,0.04)",
                  border: "0.5px solid rgba(11,42,74,0.1)",
                  fontSize: "8px",
                  fontWeight: 500,
                  color: careersColors.navy,
                }}
              >
                {doc}
              </span>
            ))}
          </div>
          <div
            style={{
              border: "1.5px dashed rgba(11,42,74,0.12)",
              borderRadius: "6px",
              padding: "16px 10px",
              textAlign: "center",
              fontSize: "9px",
              color: "rgba(46,46,46,0.4)",
            }}
          >
            3 documents uploaded
          </div>
        </div>

        <div style={{ flex: 1, padding: "14px 12px", background: "#ffffff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
            <span style={{ fontSize: "10px", fontWeight: 600, color: careersColors.navy }}>
              Analysis Complete
            </span>
            <span
              style={{
                fontSize: "8px",
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: "10px",
                background: "rgba(29,158,117,0.12)",
                color: "#1D9E75",
                textTransform: "uppercase",
              }}
            >
              high
            </span>
          </div>
          <p style={{ margin: "0 0 10px", fontSize: "9px", color: "rgba(46,46,46,0.55)" }}>
            Martinez · Conventional
          </p>
          <p
            style={{
              margin: "0 0 2px",
              fontSize: "8px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(46,46,46,0.4)",
            }}
          >
            Qualifying Income
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: careersFonts.heading,
              fontSize: "26px",
              fontWeight: 600,
              color: careersColors.gold,
              lineHeight: 1,
            }}
          >
            $8,420
            <span style={{ fontSize: "11px", color: "rgba(46,46,46,0.5)", fontWeight: 400 }}>
              {" "}
              /month
            </span>
          </p>
          <div style={{ marginTop: "12px", borderTop: "0.5px solid rgba(11,42,74,0.08)", paddingTop: "10px" }}>
            {INCOME_ROWS.map((row) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "9px",
                  marginBottom: "5px",
                  color: "rgba(46,46,46,0.65)",
                }}
              >
                <span>{row.label}</span>
                <span style={{ color: careersColors.navy, fontWeight: 500 }}>{row.amount}</span>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: "10px",
              padding: "6px 8px",
              borderRadius: "3px",
              background: "rgba(198,161,91,0.08)",
              borderLeft: "2px solid rgba(198,161,91,0.5)",
              fontSize: "8px",
              lineHeight: 1.45,
              color: "rgba(46,46,46,0.6)",
            }}
          >
            Base + bonus averaged per guidelines. Overtime excluded pending review.
          </div>
        </div>
      </div>
    </div>
  );
}
