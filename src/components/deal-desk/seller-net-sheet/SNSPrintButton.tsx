import { jsPDF } from "jspdf";
import type { SellerNetResults } from "../../../hooks/useSellerNetMath";
import { fmt, fmtK } from "../../../hooks/useSellerNetMath";
import type { AgentBranding } from "./SNSAgentBranding";

type Props = { results: SellerNetResults; branding: AgentBranding };

export function SNSPrintButton({ results, branding }: Props) {
  const handleExport = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });

    const NAVY = [11, 42, 74] as const;
    const GOLD = [198, 161, 91] as const;
    const WHITE = [255, 255, 255] as const;
    const LIGHT_GRAY = [244, 246, 249] as const;
    const MID_GRAY = [100, 116, 139] as const;
    const RED = [163, 45, 45] as const;
    const GREEN = [39, 80, 10] as const;
    const pageW = 215.9;
    const pageH = 279.4;
    const margin = 16;
    const contentW = pageW - margin * 2;
    const hasAgent = branding.name.trim().length > 0;

    // ── HEADER BLOCK ──────────────────────────────────────────────
    doc.setFillColor(...NAVY);
    doc.rect(0, 0, pageW, 38, "F");

    // Gold accent line at bottom of header
    doc.setFillColor(...GOLD);
    doc.rect(0, 36.5, pageW, 1.2, "F");

    if (hasAgent) {
      // Agent logo (if uploaded)
      if (branding.logoDataUrl) {
        try {
          const logoFormat = branding.logoDataUrl.startsWith("data:image/png") ? "PNG"
            : branding.logoDataUrl.startsWith("data:image/jpeg") || branding.logoDataUrl.startsWith("data:image/jpg") ? "JPEG"
              : branding.logoDataUrl.startsWith("data:image/webp") ? "WEBP"
                : "PNG";
          // Fit logo in a 28x14mm box preserving aspect ratio
          const logoImg = new Image();
          logoImg.src = branding.logoDataUrl;
          const logoW = 28;
          const logoH = 14;
          const base64Data = branding.logoDataUrl.split(",")[1];
          doc.addImage(base64Data, logoFormat, margin, 3, logoW, logoH, "", "FAST");
        } catch (_) {
          // logo failed silently
        }
      }

      const textX = branding.logoDataUrl ? margin + 32 : margin;

      // Agent name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(...WHITE);
      doc.text(branding.name, textX, 11);

      // Brokerage
      if (branding.brokerage) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(...GOLD);
        doc.text(branding.brokerage, textX, 17);
      }

      // Phone + email
      const contactParts = [branding.phone, branding.email].filter(Boolean).join("  ·  ");
      if (contactParts) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(200, 210, 220);
        doc.text(contactParts, textX, 23);
      }
    } else {
      // Fallback — no agent info entered, show generic header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...GOLD);
      doc.text("YOUR REAL ESTATE AGENT", margin, 14);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(180, 190, 200);
      doc.text("Add your name and brokerage in the branding section above", margin, 20);
    }

    // Document title — right side
    doc.setFont("times", "bold");
    doc.setFontSize(17);
    doc.setTextColor(...GOLD);
    doc.text("Seller Net Sheet", pageW - margin, 13, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(200, 210, 220);
    const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    doc.text(`Prepared ${today}`, pageW - margin, 20, { align: "right" });

    // ── SCENARIO HERO CARDS ───────────────────────────────────────
    let y = 44;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...MID_GRAY);
    doc.text("NET PROCEEDS AT THREE PRICE SCENARIOS", margin, y);
    y += 5;

    const cardW = (contentW - 8) / 3;
    const cardH = 28;
    const { ask, below3, below5, diff3, diff5 } = results;

    // Card 1 — Full ask (navy header)
    const c1x = margin;
    doc.setFillColor(...NAVY);
    doc.roundedRect(c1x, y, cardW, cardH, 2, 2, "F");
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(c1x, y + 8, cardW, cardH - 8, 2, 2, "F");
    doc.setFillColor(255, 255, 255);
    doc.rect(c1x, y + 8, cardW, 4, "F"); // fill top overlap

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...GOLD);
    doc.text("FULL ASKING PRICE", c1x + cardW / 2, y + 5.5, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MID_GRAY);
    doc.text(fmtK(ask.price), c1x + cardW / 2, y + 14, { align: "center" });

    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...NAVY);
    doc.text(fmtK(ask.net), c1x + cardW / 2, y + 22, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...MID_GRAY);
    doc.text("Your baseline", c1x + cardW / 2, y + 27, { align: "center" });

    // Card 2 — 3% below
    const c2x = margin + cardW + 4;
    doc.setFillColor(240, 243, 248);
    doc.roundedRect(c2x, y, cardW, cardH, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...NAVY);
    doc.text("3% BELOW ASK", c2x + cardW / 2, y + 5.5, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MID_GRAY);
    doc.text(fmtK(below3.price), c2x + cardW / 2, y + 14, { align: "center" });

    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...GREEN);
    doc.text(fmtK(below3.net), c2x + cardW / 2, y + 22, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...RED);
    doc.text(`-${fmtK(diff3)} vs. ask`, c2x + cardW / 2, y + 27, { align: "center" });

    // Card 3 — 5% below
    const c3x = margin + (cardW + 4) * 2;
    doc.setFillColor(248, 249, 250);
    doc.roundedRect(c3x, y, cardW, cardH, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...MID_GRAY);
    doc.text("5% BELOW ASK", c3x + cardW / 2, y + 5.5, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MID_GRAY);
    doc.text(fmtK(below5.price), c3x + cardW / 2, y + 14, { align: "center" });

    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.setTextColor(90, 100, 110);
    doc.text(fmtK(below5.net), c3x + cardW / 2, y + 22, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...RED);
    doc.text(`-${fmtK(diff5)} vs. ask`, c3x + cardW / 2, y + 27, { align: "center" });

    y += cardH + 10;

    // ── NET SHEET TABLE ───────────────────────────────────────────
    doc.setFont("times", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...NAVY);
    doc.text("Detailed Net Sheet", margin, y);
    y += 2;

    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin + 52, y);
    y += 5;

    // Table column layout
    const col0 = margin;           // label
    const col1 = margin + 100;     // at ask
    const col2 = margin + 133;     // 3% below
    const col3 = margin + 166;     // 5% below
    const rowH = 6.5;

    // Table header row
    doc.setFillColor(...NAVY);
    doc.rect(col0, y, contentW, rowH, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...WHITE);
    doc.text("Line Item", col0 + 2, y + 4.5);
    doc.setFont("courier", "bold");
    doc.text("At Ask", col1 - 16, y + 4.5, { align: "center" });
    doc.text("3% Below", col2 - 16, y + 4.5, { align: "center" });
    doc.text("5% Below", col3 - 16, y + 4.5, { align: "center" });
    doc.setFont("helvetica", "bold");
    y += rowH;

    // Helper: section subheader
    const sectionRow = (label: string) => {
      doc.setFillColor(240, 243, 248);
      doc.rect(col0, y, contentW, rowH - 1, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(...NAVY);
      doc.text(label.toUpperCase(), col0 + 2, y + 4);
      y += rowH - 1;
    };

    // Helper: data row
    const negatize = (s: string) => {
      // Convert "-$285,000" → "($285,000)" for clean jsPDF rendering
      if (s.startsWith("-$")) return `(${s.slice(1)})`;
      return s;
    };
    const dataRow = (
      label: string,
      v1: string,
      v2: string,
      v3: string,
      color: readonly [number, number, number] = NAVY,
      indent = false,
      shade = false
    ) => {
      v1 = negatize(v1); v2 = negatize(v2); v3 = negatize(v3);
      if (shade) {
        doc.setFillColor(252, 252, 253);
        doc.rect(col0, y, contentW, rowH - 0.5, "F");
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...color);
      doc.text((indent ? "    " : "") + label, col0 + 2, y + 4.5);
      doc.setFont("courier", "normal");
      doc.setFontSize(7.5);
      doc.text(v1, col1 - 16, y + 4.5, { align: "center" });
      doc.text(v2, col2 - 16, y + 4.5, { align: "center" });
      doc.text(v3, col3 - 16, y + 4.5, { align: "center" });
      doc.setFont("helvetica", "normal");
      // subtle row divider
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.line(col0, y + rowH - 0.5, col0 + contentW, y + rowH - 0.5);
      y += rowH;
    };

    const { payoff, comm, concession, hoa, warranty, titleFee, taxPro, other, jurisdictionName } = results;
    const rec = ask.recordingFee;

    // Sale proceeds section
    sectionRow("Sale Proceeds");
    dataRow("Gross sale price", fmt(ask.price), fmt(below3.price), fmt(below5.price), GREEN, false, false);

    // Deductions section
    sectionRow("Deductions");
    dataRow("Mortgage payoff", `-${fmt(payoff)}`, `-${fmt(payoff)}`, `-${fmt(payoff)}`, RED, true, false);
    dataRow(`Commission (${comm}%)`, `-${fmt(ask.commAmt)}`, `-${fmt(below3.commAmt)}`, `-${fmt(below5.commAmt)}`, RED, true, true);
    dataRow(`Transfer/grantor tax — ${jurisdictionName}`, `-${fmt(ask.transferTax)}`, `-${fmt(below3.transferTax)}`, `-${fmt(below5.transferTax)}`, RED, true, false);
    dataRow("Recording fee (est.)", `-${fmt(rec)}`, `-${fmt(rec)}`, `-${fmt(rec)}`, RED, true, true);
    dataRow("Title / settlement fee", `-${fmt(titleFee)}`, `-${fmt(titleFee)}`, `-${fmt(titleFee)}`, RED, true, false);
    dataRow("Property tax proration", `-${fmt(taxPro)}`, `-${fmt(taxPro)}`, `-${fmt(taxPro)}`, RED, true, true);

    if (concession > 0) dataRow("Seller concession / credit", `-${fmt(concession)}`, `-${fmt(concession)}`, `-${fmt(concession)}`, RED, true, false);
    if (hoa > 0) dataRow("HOA transfer fee", `-${fmt(hoa)}`, `-${fmt(hoa)}`, `-${fmt(hoa)}`, RED, true, true);
    if (warranty > 0) dataRow("Home warranty", `-${fmt(warranty)}`, `-${fmt(warranty)}`, `-${fmt(warranty)}`, RED, true, false);
    if (other > 0) dataRow("Other costs", `-${fmt(other)}`, `-${fmt(other)}`, `-${fmt(other)}`, RED, true, true);

    // Net proceeds footer row
    doc.setFillColor(...NAVY);
    doc.rect(col0, y, contentW, rowH + 1, "F");
    doc.setFont("times", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...GOLD);
    doc.text("Estimated Net Proceeds", col0 + 2, y + 5.5);
    doc.setFont("courier", "bold");
    doc.setFontSize(9);
    doc.setTextColor(159, 225, 203);
    doc.text(fmtK(ask.net), col1 - 16, y + 5.5, { align: "center" });
    doc.setTextColor(...WHITE);
    doc.text(fmtK(below3.net), col2 - 16, y + 5.5, { align: "center" });
    doc.text(fmtK(below5.net), col3 - 16, y + 5.5, { align: "center" });
    y += rowH + 1;

    y += 8;

    // ── TAX NOTE ─────────────────────────────────────────────────
    doc.setFillColor(240, 243, 248);
    doc.roundedRect(margin, y, contentW, 16, 2, 2, "F");
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.6);
    doc.line(margin, y, margin, y + 16);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...NAVY);
    doc.text(`Transfer Tax Note — ${jurisdictionName}`, margin + 4, y + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...MID_GRAY);
    const noteLines = doc.splitTextToSize(results.jurisdictionNote, contentW - 8);
    doc.text(noteLines.slice(0, 2), margin + 4, y + 10);
    y += 20;

    // ── FOOTER ───────────────────────────────────────────────────
    doc.setFillColor(...NAVY);
    doc.rect(0, pageH - 18, pageW, 18, "F");

    doc.setFillColor(...GOLD);
    doc.rect(0, pageH - 18, pageW, 0.6, "F");

    // Left — agent info in footer
    if (hasAgent) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(...GOLD);
      doc.text(branding.name, margin, pageH - 11);
      if (branding.brokerage) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(6.5);
        doc.setTextColor(180, 190, 205);
        doc.text(branding.brokerage, margin, pageH - 6.5);
      }
    }

    // Center — powered by IHL (subtle)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(100, 120, 145);
    doc.text("Powered by The Deal Desk", pageW / 2, pageH - 11, { align: "center" });

    // Disclaimer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.5);
    doc.setTextColor(90, 105, 125);
    const disclaimer = "All figures are estimates for planning purposes only. Transfer tax rates reflect 2026 data but may vary. This does not constitute legal, tax, or financial advice.";
    doc.text(disclaimer, pageW / 2, pageH - 6, { align: "center" });

    // Page number
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(150, 165, 185);
    doc.text("Page 1", pageW - margin, pageH - 9, { align: "right" });

    // ── SAVE ─────────────────────────────────────────────────────
    const filename = `IHL-Seller-Net-Sheet-${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);
  };

  return (
    <div className="sns-print-row flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
      <button
        type="button"
        onClick={handleExport}
        className="run-btn inline-flex items-center justify-center gap-2 rounded-md bg-[#0B2A4A] px-5 py-2.5 font-sans text-[13px] font-semibold text-white transition-colors hover:bg-[#0a2340]"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
        </svg>
        Export PDF
      </button>
      <p className="font-sans text-[11px] text-slate-500">
        {branding.name ? `PDF will show ${branding.name}'s branding` : "Add your info above to brand this PDF"}
      </p>
    </div>
  );
}
