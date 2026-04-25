import { Fragment, useCallback, useState } from "react";
import { PageContainer } from "../components/PageContainer";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

type LeadRow = {
  id?: string;
  timestamp: string;
  source: string;
  grade: string;
  goal: string;
  name: string;
  email: string;
  phone: string;
  bestDay: string;
  bestTime: string;
  preferredContact: string;
  conversationLength: number;
  budget: string;
  firstTimeBuyer: boolean;
  hasAgent: boolean | null;
  creditStatus: string;
  timeline: string;
  transcript?: string;
  status?: "new" | "in_process" | "funded";
  statusUpdatedAt?: string;
};

const NAVY = "#0B2A4A";
const GOLD = "#C6A15B";
const HOT = "#DC2626";
const WARM = "#D97706";
const NEUTRAL_CLR = "#6B7280";

function gradeColor(g: string) {
  if (/HOT/i.test(g)) return HOT;
  if (/WARM/i.test(g)) return WARM;
  return NEUTRAL_CLR;
}
function gradeBg(g: string) {
  if (/HOT/i.test(g)) return "#FEF2F2";
  if (/WARM/i.test(g)) return "#FFFBEB";
  return "#F9FAFB";
}
function gradeEmoji(g: string) {
  if (/HOT/i.test(g)) return "🔥";
  if (/WARM/i.test(g)) return "🌡️";
  return "🤍";
}
function goalIcon(g: string) {
  const gl = (g ?? "").toLowerCase();
  if (gl.includes("purchase") || gl.includes("buy")) return "🏠";
  if (gl.includes("refi")) return "🔄";
  if (gl.includes("heloc") || gl.includes("equity")) return "📈";
  if (gl.includes("reverse")) return "🔮";
  return "📋";
}
function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
}
function deadlineStr(g: string) {
  if (/HOT/i.test(g)) return "2 hours";
  if (/WARM/i.test(g)) return "24 hours";
  return "48 hours";
}
function urgencyMsg(g: string) {
  if (/HOT/i.test(g)) return "Every minute matters — this lead is actively ready to move.";
  if (/WARM/i.test(g)) return "Strike while the iron is warm — they are engaged and interested.";
  return "Add to nurture sequence — consistent follow-up builds trust.";
}

function exportPdf(leads: LeadRow[], filter = "ALL") {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  doc.setFillColor(11, 42, 74);
  doc.rect(0, 0, W, 28, "F");
  doc.setTextColor(198, 161, 91);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Infinite Home Lending", 14, 11);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Luna AI Concierge — Lead Analytics Report", 14, 18);
  doc.setTextColor(255, 255, 255);
  doc.text(`Generated: ${fmtDate(new Date().toISOString())}`, 14, 24);
  doc.setTextColor(11, 42, 74);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`${filter === "ALL" ? "All Leads" : `${filter} Leads`} — ${leads.length} total`, 14, 38);
  const hot = leads.filter((l) => /HOT/i.test(l.grade)).length;
  const warm = leads.filter((l) => /WARM/i.test(l.grade)).length;
  const neutral = leads.filter((l) => /NEUTRAL/i.test(l.grade)).length;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`Total: ${leads.length}   HOT: ${hot}   WARM: ${warm}   NEUTRAL: ${neutral}`, 14, 45);
  autoTable(doc, {
    startY: 50,
    head: [["Name", "Email", "Phone", "Grade", "Goal", "Budget", "Best Day", "Best Time", "Contact", "Captured"]],
    body: leads.map((l) => [l.name, l.email, l.phone || "—", l.grade, l.goal || "—", l.budget ? `$${l.budget}` : "—", l.bestDay || "—", l.bestTime || "—", l.preferredContact || "—", fmtDate(l.timestamp)]),
    styles: { fontSize: 8, cellPadding: 3, textColor: [30, 41, 59] },
    headStyles: { fillColor: [11, 42, 74], textColor: [198, 161, 91], fontStyle: "bold", fontSize: 8 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 },
  });
  const H = doc.internal.pageSize.getHeight();
  doc.setFillColor(11, 42, 74);
  doc.rect(0, H - 12, W, 12, "F");
  doc.setTextColor(198, 161, 91);
  doc.setFontSize(8);
  doc.text("Infinite Home Lending · Maryland · DC · Virginia · infinitehomelending.com", 14, H - 4);
  doc.setTextColor(255, 255, 255);
  doc.text("NMLS #2831765 · Confidential", W - 14, H - 4, { align: "right" });
  doc.save(`IHL-Leads-${filter}-${Date.now()}.pdf`);
}

function StatCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "20px 24px", borderTop: `3px solid ${accent ?? GOLD}`, boxShadow: "0 1px 4px rgba(11,42,74,0.06)" }}>
      <div style={{ fontFamily: "sans-serif", fontSize: 10, color: GOLD, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: "Georgia,serif", fontSize: 30, color: NAVY, fontWeight: 700, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontFamily: "sans-serif", fontSize: 11, color: "#94A3B8", marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function MiniBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontFamily: "sans-serif", fontSize: 12, color: "#334155" }}>{label}</span>
        <span style={{ fontFamily: "sans-serif", fontSize: 12, fontWeight: 600, color: NAVY }}>{count}</span>
      </div>
      <div style={{ background: "#F1F5F9", borderRadius: 4, height: 8, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, background: color, height: "100%", borderRadius: 4 }} />
      </div>
    </div>
  );
}

function InfoRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div style={{ display: "flex", borderBottom: "1px solid #F1F5F9", padding: "9px 16px" }}>
      <div style={{ fontFamily: "sans-serif", fontSize: 12, color: "#64748B", width: 170, flexShrink: 0 }}>{label}</div>
      <div style={{ fontFamily: "sans-serif", fontSize: 13, color: bold ? NAVY : "#1E293B", fontWeight: bold ? 700 : 400 }}>{value || "—"}</div>
    </div>
  );
}

function LeadDetailPanel({ lead, onClose }: { lead: LeadRow; onClose: () => void }) {
  const gc = gradeColor(lead.grade);
  const gb = gradeBg(lead.grade);
  const ge = gradeEmoji(lead.grade);
  const firstName = lead.name.split(" ")[0] ?? lead.name;

  const reasons: string[] = [];
  if (lead.timeline) reasons.push(`Timeline identified: ${lead.timeline}`);
  if (lead.budget) reasons.push(`Budget discussed: $${lead.budget}`);
  if (lead.firstTimeBuyer) reasons.push("First-time buyer — high motivation");
  if (lead.hasAgent === false) reasons.push("No agent yet — referral opportunity");
  if (lead.creditStatus === "Wants to explore") reasons.push("Wants credit guidance — advisor dependent");
  if (/purchase|buy/i.test(lead.goal)) reasons.push("Clear purchase intent");
  if (/refi/i.test(lead.goal)) reasons.push("Refinance intent confirmed");
  if (/heloc|equity/i.test(lead.goal)) reasons.push("Home equity access intent");
  if (/reverse/i.test(lead.goal)) reasons.push("Reverse mortgage exploration");
  if (lead.conversationLength >= 6) reasons.push("High conversation engagement");
  if (!reasons.length) reasons.push("Lead details captured — see profile below");

  const recAction = /HOT/i.test(lead.grade)
    ? `Contact within 2 hours via ${lead.preferredContact || "phone"}`
    : /WARM/i.test(lead.grade)
      ? `Contact within 24 hours via ${lead.preferredContact || "phone"}`
      : "Add to nurture sequence — follow up within 48 hours";

  const leadTopics: string[] = [];
  if (lead.firstTimeBuyer) { leadTopics.push("First-time buyer programs available in MD/DC/VA"); leadTopics.push("Down payment assistance options — could save thousands"); }
  if (lead.creditStatus === "Wants to explore") leadTopics.push("Soft credit pull — zero impact to their score");
  if (lead.budget) leadTopics.push(`Payment breakdown on a $${lead.budget} home at current rates`);
  if (/purchase|buy/i.test(lead.goal)) leadTopics.push("Pre-approval process — fast and obligation-free with IHL");
  if (/refi/i.test(lead.goal)) leadTopics.push("Refinance options and current rate environment");
  if (/heloc|equity/i.test(lead.goal)) leadTopics.push("HELOC options — flexible access to your equity");
  if (/reverse/i.test(lead.goal)) leadTopics.push("Reverse mortgage eligibility and program overview");
  if (!leadTopics.length) { leadTopics.push("IHL loan options overview"); leadTopics.push("Pre-approval process walkthrough"); }

  const care: string[] = [];
  if (lead.hasAgent === false) care.push("No agent yet — offer to connect with a trusted IHL partner agent in their area");
  if (lead.creditStatus === "Wants to explore") care.push("Credit not yet explored — be reassuring and educational, not clinical");
  if (lead.firstTimeBuyer) care.push("First-time buyer — may feel overwhelmed, go slow and explain each step");
  if (!care.length) care.push("Visitor seems well-informed — match their energy and go deeper on specifics");

  const purposeText = /purchase|buy/i.test(lead.goal)
    ? `buy${lead.firstTimeBuyer ? " your first" : " a"} home${lead.timeline ? ` in the next ${lead.timeline}` : ""}`
    : /refi/i.test(lead.goal) ? "refinance your home"
      : /heloc|equity/i.test(lead.goal) ? "access your home equity with a HELOC"
        : /reverse/i.test(lead.goal) ? "explore a reverse mortgage"
          : "explore your mortgage options";

  const openingLine = `"Hi ${firstName}, this is [your name] from Infinite Home Lending. Luna mentioned you're looking to ${purposeText}${lead.budget ? ` with a budget around $${lead.budget}` : ""} — I'd love to help make that happen!"`;

  const transcriptLines = lead.transcript ? lead.transcript.split("\n").filter((l) => l.trim()) : [];

  const exportSinglePdf = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    doc.setFillColor(11, 42, 74); doc.rect(0, 0, W, 32, "F");
    doc.setTextColor(198, 161, 91); doc.setFontSize(16); doc.setFont("helvetica", "bold");
    doc.text("Infinite Home Lending", 14, 12);
    doc.setFontSize(9); doc.setFont("helvetica", "normal");
    doc.text("IHL Mortgage Concierge · Lead Intelligence Brief", 14, 20);
    doc.setTextColor(255, 255, 255);
    doc.text(`Generated: ${fmtDate(new Date().toISOString())}`, 14, 27);
    const gc3: [number, number, number] = /HOT/i.test(lead.grade) ? [220, 38, 38] : /WARM/i.test(lead.grade) ? [217, 119, 6] : [107, 114, 128];
    doc.setFillColor(...gc3); doc.roundedRect(W - 58, 9, 44, 14, 3, 3, "F");
    doc.setTextColor(255, 255, 255); doc.setFontSize(10); doc.setFont("helvetica", "bold");
    doc.text(`${lead.grade} LEAD`, W - 36, 18, { align: "center" });
    let y = 42;
    const section = (title: string) => {
      if (y > H - 30) { doc.addPage(); y = 20; }
      doc.setTextColor(11, 42, 74); doc.setFontSize(12); doc.setFont("helvetica", "bold");
      doc.text(title, 14, y); y += 8;
    };
    section("Contact Information");
    autoTable(doc, { startY: y, body: [["Full Name", lead.name], ["Email", lead.email], ["Phone", lead.phone || "—"], ["Best Day", lead.bestDay || "—"], ["Best Time", lead.bestTime || "—"], ["Preferred Contact", lead.preferredContact || "—"], ["Captured", fmtDate(lead.timestamp)]], styles: { fontSize: 10, cellPadding: 3 }, columnStyles: { 0: { fontStyle: "bold", textColor: [100, 116, 139], cellWidth: 50 }, 1: { textColor: [15, 23, 42] } }, theme: "plain", margin: { left: 14, right: 14 } });
    y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;
    section("Visitor Profile");
    autoTable(doc, { startY: y, body: [["Goal", lead.goal || "—"], ["Timeline", lead.timeline || "—"], ["Budget", lead.budget ? `$${lead.budget}` : "—"], ["First-time Buyer", lead.firstTimeBuyer ? "Yes" : "No"], ["Has Agent", lead.hasAgent === null ? "Unknown" : lead.hasAgent ? "Yes" : "No"], ["Credit Status", lead.creditStatus || "—"], ["Conversation", `${lead.conversationLength} exchanges`]], styles: { fontSize: 10, cellPadding: 3 }, columnStyles: { 0: { fontStyle: "bold", textColor: [100, 116, 139], cellWidth: 50 }, 1: { textColor: [15, 23, 42] } }, theme: "plain", margin: { left: 14, right: 14 } });
    y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;
    section("Suggested Opening Line");
    doc.setFontSize(10); doc.setFont("helvetica", "italic"); doc.setTextColor(30, 41, 59);
    const openLines = doc.splitTextToSize(openingLine, W - 28);
    if (y + openLines.length * 6 > H - 20) { doc.addPage(); y = 20; }
    doc.text(openLines, 14, y); y += openLines.length * 6 + 8;
    section("Lead With These Topics");
    doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(30, 41, 59);
    leadTopics.forEach((t) => { if (y > H - 20) { doc.addPage(); y = 20; } doc.text(`• ${t}`, 18, y); y += 7; });
    y += 4;
    section("Approach With Care");
    care.forEach((c) => { if (y > H - 20) { doc.addPage(); y = 20; } doc.text(`• ${c}`, 18, y); y += 7; });
    y += 4;
    section("Compliance Reminders");
    ["Express consent provided via IHL Mortgage Concierge widget", "Always identify yourself and Infinite Home Lending", "Honor any Do Not Call requests immediately", "First contact = consultation, not a sales call", "Log in CRM immediately after first outreach"].forEach((c) => { if (y > H - 20) { doc.addPage(); y = 20; } doc.text(`✓ ${c}`, 18, y); y += 7; });
    doc.setFillColor(11, 42, 74); doc.rect(0, H - 12, W, 12, "F");
    doc.setTextColor(198, 161, 91); doc.setFontSize(8);
    doc.text("Infinite Home Lending · Maryland · DC · Virginia · infinitehomelending.com", 14, H - 4);
    doc.setTextColor(255, 255, 255);
    doc.text("NMLS #2831765 · Confidential — Internal Use Only", W - 14, H - 4, { align: "right" });
    doc.save(`IHL-Lead-${lead.name.replace(/\s+/g, "-")}-${Date.now()}.pdf`);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(11,42,74,0.65)", zIndex: 1000, overflowY: "auto", padding: "32px 16px" }} onClick={onClose}>
      <div style={{ maxWidth: 760, margin: "0 auto", background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.35)" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ background: NAVY, padding: "24px 32px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "sans-serif", fontSize: 10, color: "rgba(198,161,91,0.55)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>IHL Mortgage Concierge · Lead Intelligence Brief</div>
            <div style={{ fontFamily: "Georgia,serif", fontSize: 22, color: "#F7F7F5", marginBottom: 4 }}>{lead.name}</div>
            <div style={{ fontFamily: "sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{fmtDate(lead.timestamp)}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
            <div style={{ background: gc, borderRadius: 50, padding: "8px 18px" }}>
              <span style={{ color: "#fff", fontFamily: "sans-serif", fontSize: 13, fontWeight: 700 }}>{ge} {lead.grade} LEAD</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={exportSinglePdf} style={{ background: GOLD, color: NAVY, border: "none", borderRadius: 6, padding: "7px 14px", fontFamily: "sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>↓ PDF</button>
              <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, padding: "7px 14px", fontFamily: "sans-serif", fontSize: 11, cursor: "pointer" }}>✕ Close</button>
            </div>
          </div>
        </div>
        <div style={{ background: gb, borderLeft: `4px solid ${gc}`, padding: "12px 32px" }}>
          <span style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 700, color: gc }}>{/HOT/i.test(lead.grade) ? "🔥 HIGH PRIORITY" : /WARM/i.test(lead.grade) ? "🌡️ WARM LEAD" : "🤍 NURTURE"} — {recAction}</span>
        </div>
        <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ border: `2px solid ${gc}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ background: gc, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: "#fff", fontFamily: "Georgia,serif", fontSize: 20, fontWeight: 700 }}>{ge} {lead.grade} LEAD</div>
                <div style={{ color: "rgba(255,255,255,0.8)", fontFamily: "sans-serif", fontSize: 12, marginTop: 4 }}>{/HOT/i.test(lead.grade) ? "HIGH PRIORITY — Contact within 2 hours" : /WARM/i.test(lead.grade) ? "WARM LEAD — Contact within 24 hours" : "NURTURE — Add to follow-up sequence"}</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "10px 16px", textAlign: "right" }}>
                <div style={{ color: "#fff", fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Recommended Action</div>
                <div style={{ color: "#fff", fontFamily: "sans-serif", fontSize: 12, marginTop: 4 }}>{recAction}</div>
              </div>
            </div>
            <div style={{ background: gb, padding: "16px 20px" }}>
              <div style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Why this lead is graded {lead.grade}:</div>
              {reasons.map((r) => (
                <div key={r} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <span style={{ color: gc, fontWeight: 700 }}>✓</span>
                  <span style={{ fontFamily: "sans-serif", fontSize: 13, color: "#1E293B" }}>{r}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ border: `2px solid ${gc}`, borderRadius: 10, overflow: "hidden" }}>
            <div style={{ background: gc, padding: "10px 16px" }}>
              <span style={{ color: "#fff", fontFamily: "sans-serif", fontSize: 13, fontWeight: 700 }}>⚡ SPEED TO LEAD — CRITICAL</span>
            </div>
            <div style={{ background: gb, padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ borderRight: `1px solid ${gc}44`, paddingRight: 16 }}>
                <div style={{ fontFamily: "sans-serif", fontSize: 10, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Lead Received</div>
                <div style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 700, color: NAVY }}>{fmtDate(lead.timestamp)}</div>
              </div>
              <div>
                <div style={{ fontFamily: "sans-serif", fontSize: 10, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Contact Within</div>
                <div style={{ fontFamily: "sans-serif", fontSize: 24, fontWeight: 700, color: gc }}>{deadlineStr(lead.grade)}</div>
                <div style={{ fontFamily: "sans-serif", fontSize: 11, color: "#64748B" }}>via {lead.preferredContact || "preferred method"}</div>
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${gc}33`, padding: "12px 20px", background: gb }}>
              <span style={{ fontFamily: "sans-serif", fontSize: 13, fontStyle: "italic", color: "#1E293B" }}>{urgencyMsg(lead.grade)}</span>
            </div>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 17 }}>📋</span>
              <span style={{ fontFamily: "Georgia,serif", fontSize: 17, color: NAVY, fontWeight: 700 }}>Contact Information</span>
            </div>
            <div style={{ border: "1px solid #E2E8F0", borderRadius: 10, overflow: "hidden" }}>
              <InfoRow label="Full Name" value={lead.name} bold />
              <InfoRow label="Email" value={lead.email} />
              <InfoRow label="Phone" value={lead.phone} />
              <InfoRow label="Best Day to Reach" value={lead.bestDay} />
              <InfoRow label="Best Time to Reach" value={lead.bestTime} />
              <InfoRow label="Preferred Contact" value={lead.preferredContact} bold />
            </div>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 17 }}>👤</span>
              <span style={{ fontFamily: "Georgia,serif", fontSize: 17, color: NAVY, fontWeight: 700 }}>Visitor Profile</span>
            </div>
            <div style={{ border: "1px solid #E2E8F0", borderRadius: 10, overflow: "hidden" }}>
              <InfoRow label="Goal" value={`${goalIcon(lead.goal)} ${lead.goal || "—"}`} bold />
              <InfoRow label="Timeline" value={lead.timeline || "—"} />
              <InfoRow label="Budget" value={lead.budget ? `$${lead.budget}` : "—"} />
              <InfoRow label="First-time Buyer" value={lead.firstTimeBuyer ? "🌟 Yes — first-time buyer" : "🔄 Has bought before"} />
              <InfoRow label="Has Agent" value={lead.hasAgent === null ? "❓ Unknown" : lead.hasAgent ? "✅ Working with agent" : "⚠️ No agent yet — referral opportunity"} />
              <InfoRow label="Credit Status" value={lead.creditStatus === "Wants to explore" ? "📊 Wants to explore with advisor" : lead.creditStatus === "Has reviewed" ? "✅ Has reviewed credit" : "❓ Not yet discussed"} />
              <InfoRow label="Conversation Length" value={`${lead.conversationLength} exchanges with Luna`} />
            </div>
          </div>
          <div style={{ background: "#EFE6D6", borderRadius: 12, padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <span style={{ fontSize: 17 }}>💡</span>
              <span style={{ fontFamily: "Georgia,serif", fontSize: 17, color: NAVY, fontWeight: 700 }}>First Contact Playbook</span>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>🎯 Suggested Opening Line</div>
              <div style={{ background: "#fff", borderLeft: `3px solid ${GOLD}`, borderRadius: "0 8px 8px 0", padding: "14px 16px" }}>
                <div style={{ fontFamily: "sans-serif", fontSize: 13, lineHeight: 1.7, color: "#1E293B", fontStyle: "italic" }}>{openingLine}</div>
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>✅ Lead With These Topics</div>
              {leadTopics.map((t) => (
                <div key={t} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <span style={{ color: "#22C55E", fontSize: 16, lineHeight: 1.4 }}>•</span>
                  <span style={{ fontFamily: "sans-serif", fontSize: 13, color: "#1E293B" }}>{t}</span>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>⚠️ Approach With Care</div>
              {care.map((c) => (
                <div key={c} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <span style={{ color: "#F59E0B", fontSize: 16, lineHeight: 1.4 }}>•</span>
                  <span style={{ fontFamily: "sans-serif", fontSize: 13, color: "#1E293B" }}>{c}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "#fff", borderRadius: 8, padding: "14px 16px" }}>
              <div style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>📞 Preferred Contact Details</div>
              <InfoRow label="Method" value={lead.preferredContact} />
              <InfoRow label="Best Day" value={lead.bestDay} />
              <InfoRow label="Best Time" value={lead.bestTime} />
            </div>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 17 }}>📅</span>
              <span style={{ fontFamily: "Georgia,serif", fontSize: 17, color: NAVY, fontWeight: 700 }}>Follow-Up Sequence</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { num: 1, color: "#22C55E", bg: "#F0FDF4", border: "#86EFAC", label: `Immediately — ${lead.preferredContact || "Phone"}`, text: `Call and leave a warm voicemail: "Hi ${firstName}, this is [your name] from Infinite Home Lending. I saw you connected with our AI concierge Luna today and wanted to personally reach out. Give me a call back — no pressure, just here to help!"` },
                { num: 2, color: "#EAB308", bg: "#FEFCE8", border: "#FDE047", label: "1 Hour Later — Text Message", text: `Send a short warm text: "Hi ${firstName}! This is [name] from Infinite Home Lending — just following up on your chat with Luna. Happy to answer any questions at your own pace. Feel free to text or call anytime! 😊"` },
                { num: 3, color: "#3B82F6", bg: "#EFF6FF", border: "#93C5FD", label: "Next Day — Email", text: `Send a personal email introducing yourself, referencing their conversation with Luna, and including one helpful resource.${lead.bestDay ? ` Note: They requested contact on ${lead.bestDay}${lead.bestTime ? ` during ${lead.bestTime}` : ""} — prioritize that window.` : ""}` },
              ].map(({ num, color, bg, border, label, text }) => (
                <div key={num} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: 16, display: "flex", gap: 14 }}>
                  <div style={{ width: 28, height: 28, background: color, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: "#fff", fontFamily: "sans-serif", fontSize: 13, fontWeight: 700 }}>{num}</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{label}</div>
                    <div style={{ fontFamily: "sans-serif", fontSize: 13, color: "#1E293B", lineHeight: 1.6 }}>{text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {transcriptLines.length > 0 && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 17 }}>💬</span>
                <span style={{ fontFamily: "Georgia,serif", fontSize: 17, color: NAVY, fontWeight: 700 }}>Conversation with Luna</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {transcriptLines.map((line, i) => {
                  const isSarah = /^(luna|sarah)\b/i.test(line.trim());
                  const msg = line.replace(/^(Luna|Sarah|Visitor)\s*\([^)]+\):\s*/i, "").trim();
                  const speaker = isSarah ? "Luna · IHL Concierge" : "Visitor";
                  return (
                    <div key={i} style={{ display: "flex", justifyContent: isSarah ? "flex-start" : "flex-end" }}>
                      <div style={{ maxWidth: "80%", background: isSarah ? "#EFE6D6" : "#EFF6FF", borderRadius: isSarah ? "4px 16px 16px 16px" : "16px 4px 16px 16px", padding: "10px 14px" }}>
                        <div style={{ fontFamily: "sans-serif", fontSize: 10, fontWeight: 700, color: isSarah ? NAVY : "#1E40AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{speaker}</div>
                        <div style={{ fontFamily: "sans-serif", fontSize: 13, color: "#1E293B", lineHeight: 1.6 }}>{msg}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div style={{ border: "1px solid #E2E8F0", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ background: NAVY, padding: "10px 16px" }}>
              <span style={{ color: GOLD, fontFamily: "sans-serif", fontSize: 12, fontWeight: 700 }}>⚖️ COMPLIANCE REMINDER</span>
            </div>
            <div style={{ padding: "14px 16px", background: "#F8FAFC" }}>
              {["This lead provided express consent via the IHL Mortgage Concierge widget on infinitehomelending.com", "Always identify yourself and Infinite Home Lending at the start of every call or text", "Honor any Do Not Call or opt-out requests immediately and document them", "First contact should feel like a consultation, not a sales call — listen more than you talk", "Log this contact in the IHL CRM immediately after reaching out"].map((c) => (
                <div key={c} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <span style={{ color: "#22C55E", fontWeight: 700 }}>✓</span>
                  <span style={{ fontFamily: "sans-serif", fontSize: 12, color: "#1E293B", lineHeight: 1.5 }}>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function updateStatus(id: string, status: string, password: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/analytics/leads/${id}?pwd=${encodeURIComponent(password)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    return res.ok;
  } catch { return false; }
}

function StatusBadge({ status }: { status?: string }) {
  const s = status ?? "new";
  const cfg = {
    new: { label: "New", bg: "#F1F5F9", color: "#64748B", border: "#CBD5E1" },
    in_process: { label: "In Process", bg: "#EFF6FF", color: "#1D4ED8", border: "#93C5FD" },
    funded: { label: "🏆 Funded", bg: "#F0FDF4", color: "#15803D", border: "#86EFAC" },
  }[s] ?? { label: s, bg: "#F1F5F9", color: "#64748B", border: "#CBD5E1" };
  return (
    <span style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, borderRadius: 20, padding: "3px 10px", fontFamily: "sans-serif", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
      {cfg.label}
    </span>
  );
}

function StatusPicker({ lead, password, onUpdate }: { lead: LeadRow; password: string; onUpdate: (id: string, status: string) => void }) {
  const [saving, setSaving] = useState(false);
  const current = lead.status ?? "new";
  const options: { value: string; label: string }[] = [
    { value: "new", label: "New" },
    { value: "in_process", label: "In Process" },
    { value: "funded", label: "🏆 Funded" },
  ];
  return (
    <div style={{ display: "flex", gap: 4 }} onClick={(e) => e.stopPropagation()}>
      {options.map((o) => (
        <button
          key={o.value}
          disabled={saving || current === o.value}
          onClick={async (e) => {
            e.stopPropagation();
            if (current === o.value) return;
            setSaving(true);
            const ok = await updateStatus(lead.id ?? "", o.value, password);
            if (ok) onUpdate(lead.id ?? "", o.value);
            setSaving(false);
          }}
          style={{
            padding: "4px 10px",
            borderRadius: 20,
            border: `1px solid ${current === o.value ? "#0B2A4A" : "#E2E8F0"}`,
            background: current === o.value ? "#0B2A4A" : "#fff",
            color: current === o.value ? "#C6A15B" : "#64748B",
            fontFamily: "sans-serif",
            fontSize: 11,
            fontWeight: current === o.value ? 700 : 400,
            cursor: current === o.value ? "default" : "pointer",
            opacity: saving ? 0.5 : 1,
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [password, setPassword] = useState("");
  const [leads, setLeads] = useState<LeadRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<LeadRow | null>(null);
  const [gradeFilter, setGradeFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const q = new URLSearchParams({ password });
      const res = await fetch(`/api/analytics/leads?${q}`);
      const data = (await res.json().catch(() => ({}))) as { error?: string; leads?: LeadRow[] };
      if (!res.ok) { setLeads(null); setError(data.error ?? "Failed to load"); return; }
      setLeads(data.leads ?? []);
    } catch { setLeads(null); setError("Network error"); }
    finally { setLoading(false); }
  }, [password]);

  const hot = leads?.filter((l) => /HOT/i.test(l.grade)) ?? [];
  const warm = leads?.filter((l) => /WARM/i.test(l.grade)) ?? [];
  const neutral = leads?.filter((l) => /NEUTRAL/i.test(l.grade)) ?? [];
  const total = leads?.length ?? 0;

  const inProcess = (leads ?? []).filter((l) => l.status === "in_process");
  const funded = (leads ?? []).filter((l) => l.status === "funded");

  const updateLeadStatusLocal = (id: string, status: string) => {
    setLeads((prev) => prev?.map((l) => l.id === id ? { ...l, status: status as LeadRow["status"] } : l) ?? prev);
  };

  const goalCounts = (leads ?? []).reduce<Record<string, number>>((acc, l) => {
    const g = l.goal || "Unknown"; acc[g] = (acc[g] ?? 0) + 1; return acc;
  }, {});

  const displayed = (leads ?? []).filter((l) => {
    if (gradeFilter !== "ALL" && !l.grade.toUpperCase().includes(gradeFilter)) return false;
    if (search) { const q = search.toLowerCase(); if (!l.name.toLowerCase().includes(q) && !l.email.toLowerCase().includes(q) && !(l.phone ?? "").includes(q)) return false; }
    return true;
  });

  return (
    <PageContainer>
      {selected && <LeadDetailPanel lead={selected} onClose={() => setSelected(null)} />}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px", fontFamily: "Georgia,serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: "sans-serif", fontSize: 10, color: GOLD, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>Luna AI · Lead Analytics</div>
            <h1 style={{ fontSize: 28, color: NAVY, margin: "0 0 4px" }}>Lead Dashboard</h1>
            <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#94A3B8", margin: 0 }}>All leads captured by Luna — IHL Mortgage Concierge · Click any row to open the full MA intelligence brief</p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load()} placeholder="Password" style={{ padding: "9px 14px", border: "1px solid #E2E8F0", borderRadius: 8, fontFamily: "sans-serif", fontSize: 13, color: NAVY, outline: "none", width: 140 }} />
            <button onClick={load} disabled={loading} style={{ background: NAVY, color: GOLD, border: "none", borderRadius: 8, padding: "9px 18px", fontFamily: "sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", cursor: loading ? "wait" : "pointer" }}>
              {loading ? "Loading…" : "Load Leads"}
            </button>
            {leads && leads.length > 0 && (
              <button onClick={() => exportPdf(displayed, gradeFilter)} style={{ background: GOLD, color: NAVY, border: "none", borderRadius: 8, padding: "9px 18px", fontFamily: "sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>
                ↓ Export PDF
              </button>
            )}
          </div>
        </div>
        {error && <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 8, padding: "12px 16px", marginBottom: 24, fontFamily: "sans-serif", fontSize: 13, color: HOT }}>{error}</div>}
        {leads && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 16, marginBottom: 28 }}>
              <StatCard label="Total Leads" value={total} sub="All time" accent={NAVY} />
              <StatCard label="🔥 Hot Leads" value={hot.length} sub="Contact within 2hr" accent={HOT} />
              <StatCard label="🌡️ Warm Leads" value={warm.length} sub="Contact within 24hr" accent={WARM} />
              <StatCard label="🤍 Neutral" value={neutral.length} sub="Nurture sequence" accent={NEUTRAL_CLR} />
              <StatCard label="Conversion Rate" value={total > 0 ? `${Math.round(((hot.length + warm.length) / total) * 100)}%` : "—"} sub="HOT + WARM / total" accent={GOLD} />
              <StatCard label="📋 In Process" value={inProcess.length} sub="Active pipeline" accent="#1D4ED8" />
              <StatCard label="🏆 Funded" value={funded.length} sub="Closed deals" accent="#15803D" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24 }}>
                <div style={{ fontFamily: "sans-serif", fontSize: 10, color: GOLD, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Lead Grade Breakdown</div>
                <MiniBar label="🔥 HOT" count={hot.length} total={total} color={HOT} />
                <MiniBar label="🌡️ WARM" count={warm.length} total={total} color={WARM} />
                <MiniBar label="🤍 NEUTRAL" count={neutral.length} total={total} color={NEUTRAL_CLR} />
              </div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24 }}>
                <div style={{ fontFamily: "sans-serif", fontSize: 10, color: GOLD, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Leads by Goal</div>
                {Object.keys(goalCounts).length === 0
                  ? <div style={{ fontFamily: "sans-serif", fontSize: 13, color: "#94A3B8" }}>No data yet</div>
                  : (Object.entries(goalCounts) as [string, number][]).map(([g, c]) => (
                    <Fragment key={g}>
                      <MiniBar label={`${goalIcon(g)} ${g}`} count={c} total={total} color={NAVY} />
                    </Fragment>
                  ))}
              </div>
            </div>
            {(inProcess.length > 0 || funded.length > 0) && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
                <div style={{ background: "#EFF6FF", border: "2px solid #93C5FD", borderRadius: 12, padding: 24 }}>
                  <div style={{ fontFamily: "sans-serif", fontSize: 11, color: "#1D4ED8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>📋 In Process — {inProcess.length} deal{inProcess.length !== 1 ? "s" : ""}</div>
                  {inProcess.length === 0
                    ? <div style={{ fontFamily: "sans-serif", fontSize: 13, color: "#94A3B8" }}>No deals in process yet</div>
                    : inProcess.map((l, i) => (
                      <div key={i} onClick={() => setSelected(l)} style={{ background: "#fff", borderRadius: 8, padding: "10px 14px", marginBottom: 8, cursor: "pointer", border: "1px solid #BFDBFE" }}>
                        <div style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, color: "#0B2A4A", marginBottom: 2 }}>{l.name}</div>
                        <div style={{ fontFamily: "sans-serif", fontSize: 11, color: "#64748B" }}>{l.goal || "—"} {l.budget ? `· $${l.budget}` : ""}</div>
                      </div>
                    ))}
                </div>
                <div style={{ background: "#F0FDF4", border: "2px solid #86EFAC", borderRadius: 12, padding: 24 }}>
                  <div style={{ fontFamily: "sans-serif", fontSize: 11, color: "#15803D", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>🏆 Funded — {funded.length} deal{funded.length !== 1 ? "s" : ""}</div>
                  {funded.length === 0
                    ? <div style={{ fontFamily: "sans-serif", fontSize: 13, color: "#94A3B8" }}>No funded deals yet — go close something! 🚀</div>
                    : funded.map((l, i) => (
                      <div key={i} onClick={() => setSelected(l)} style={{ background: "#fff", borderRadius: 8, padding: "10px 14px", marginBottom: 8, cursor: "pointer", border: "1px solid #86EFAC" }}>
                        <div style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, color: "#0B2A4A", marginBottom: 2 }}>{l.name}</div>
                        <div style={{ fontFamily: "sans-serif", fontSize: 11, color: "#64748B" }}>{l.goal || "—"} {l.budget ? `· $${l.budget}` : ""}</div>
                      </div>
                    ))}
                </div>
              </div>
            )}
            {hot.length > 0 && (
              <div style={{ background: "#FEF2F2", border: "2px solid #DC2626", borderRadius: 12, padding: 24, marginBottom: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontFamily: "sans-serif", fontSize: 11, color: HOT, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>🔥 Hot Leads — Priority Contact</div>
                    <div style={{ fontFamily: "sans-serif", fontSize: 12, color: "#6B7280" }}>Contact within 2 hours · Click any row for full intelligence brief</div>
                  </div>
                  <button onClick={() => exportPdf(hot, "HOT")} style={{ background: HOT, color: "#fff", border: "none", borderRadius: 6, padding: "8px 14px", fontFamily: "sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>↓ Export HOT PDF</button>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "sans-serif", fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: "#DC2626" }}>
                        {["Status", "Name", "Email", "Phone", "Goal", "Budget", "Best Day", "Best Time", "Contact Method", "Captured"].map((h) => (
                          <th key={h} style={{ padding: "10px 14px", color: "#fff", fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {hot.map((l, i) => (
                        <tr key={i} onClick={() => setSelected(l)} style={{ background: i % 2 === 0 ? "#fff" : "#FFF5F5", cursor: "pointer" }}>
                          <td style={{ padding: "10px 14px" }} onClick={(e) => e.stopPropagation()}><StatusBadge status={l.status} /></td>
                          <td style={{ padding: "10px 14px", color: NAVY, fontWeight: 600 }}>{l.name}</td>
                          <td style={{ padding: "10px 14px" }}><a href={`mailto:${l.email}`} onClick={(e) => e.stopPropagation()} style={{ color: HOT, textDecoration: "none" }}>{l.email}</a></td>
                          <td style={{ padding: "10px 14px" }}><a href={`tel:${l.phone}`} onClick={(e) => e.stopPropagation()} style={{ color: HOT, textDecoration: "none" }}>{l.phone || "—"}</a></td>
                          <td style={{ padding: "10px 14px" }}>{goalIcon(l.goal)} {l.goal || "—"}</td>
                          <td style={{ padding: "10px 14px" }}>{l.budget ? `$${l.budget}` : "—"}</td>
                          <td style={{ padding: "10px 14px" }}>{l.bestDay || "—"}</td>
                          <td style={{ padding: "10px 14px" }}>{l.bestTime || "—"}</td>
                          <td style={{ padding: "10px 14px" }}>{l.preferredContact || "—"}</td>
                          <td style={{ padding: "10px 14px", color: "#94A3B8", fontSize: 11 }}>{fmtDate(l.timestamp)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "16px 24px", borderBottom: "1px solid #E2E8F0", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ fontFamily: "sans-serif", fontSize: 10, color: GOLD, letterSpacing: 2, textTransform: "uppercase" }}>All Leads</div>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, phone..." style={{ padding: "7px 12px", border: "1px solid #E2E8F0", borderRadius: 6, fontFamily: "sans-serif", fontSize: 12, color: NAVY, outline: "none", width: 200 }} />
                {(["ALL", "HOT", "WARM", "NEUTRAL"] as const).map((g) => (
                  <button key={g} onClick={() => setGradeFilter(g)} style={{ padding: "6px 14px", border: `1px solid ${gradeFilter === g ? gradeColor(g) : "#E2E8F0"}`, borderRadius: 20, background: gradeFilter === g ? gradeBg(g) : "#fff", color: gradeFilter === g ? gradeColor(g) : "#64748B", fontFamily: "sans-serif", fontSize: 11, fontWeight: gradeFilter === g ? 700 : 400, cursor: "pointer" }}>
                    {g === "ALL" ? "All" : `${gradeEmoji(g)} ${g}`}
                  </button>
                ))}
                <div style={{ marginLeft: "auto", fontFamily: "sans-serif", fontSize: 12, color: "#94A3B8" }}>{displayed.length} lead{displayed.length !== 1 ? "s" : ""}</div>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "sans-serif", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC" }}>
                      {["Grade", "Status", "Name", "Email", "Phone", "Goal", "Budget", "Best Day", "Contact", "Captured"].map((h) => (
                        <th key={h} style={{ padding: "12px 16px", color: "#64748B", fontWeight: 600, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", textAlign: "left", borderBottom: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {displayed.length === 0 && (
                      <tr><td colSpan={10} style={{ padding: 40, textAlign: "center", color: "#94A3B8", fontSize: 14 }}>
                        {total === 0 ? "No leads captured yet. Luna is ready and waiting! 🔮" : "No leads match your filters."}
                      </td></tr>
                    )}
                    {displayed.map((l, i) => (
                      <tr key={i} onClick={() => setSelected(l)} style={{ background: i % 2 === 0 ? "#fff" : "#F8FAFC", cursor: "pointer", borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ background: gradeBg(l.grade), color: gradeColor(l.grade), fontWeight: 700, fontSize: 11, padding: "3px 10px", borderRadius: 20, border: `1px solid ${gradeColor(l.grade)}44`, whiteSpace: "nowrap" }}>
                            {gradeEmoji(l.grade)} {l.grade}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px" }} onClick={(e) => e.stopPropagation()}>
                          <StatusPicker lead={l} password={password} onUpdate={updateLeadStatusLocal} />
                        </td>
                        <td style={{ padding: "12px 16px", color: NAVY, fontWeight: 600 }}>{l.name}</td>
                        <td style={{ padding: "12px 16px" }}><a href={`mailto:${l.email}`} onClick={(e) => e.stopPropagation()} style={{ color: GOLD, textDecoration: "none" }}>{l.email}</a></td>
                        <td style={{ padding: "12px 16px" }}><a href={`tel:${l.phone}`} onClick={(e) => e.stopPropagation()} style={{ color: GOLD, textDecoration: "none" }}>{l.phone || "—"}</a></td>
                        <td style={{ padding: "12px 16px" }}>{goalIcon(l.goal)} {l.goal || "—"}</td>
                        <td style={{ padding: "12px 16px", color: "#64748B" }}>{l.budget ? `$${l.budget}` : "—"}</td>
                        <td style={{ padding: "12px 16px", color: "#64748B" }}>{l.bestDay || "—"}</td>
                        <td style={{ padding: "12px 16px", color: "#64748B" }}>{l.preferredContact || "—"}</td>
                        <td style={{ padding: "12px 16px", color: "#94A3B8", fontSize: 11, whiteSpace: "nowrap" }}>{fmtDate(l.timestamp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
        <div style={{ textAlign: "center", padding: "32px 0 16px", fontFamily: "sans-serif", fontSize: 11, color: "#94A3B8" }}>
          Infinite Home Lending · Luna AI Analytics · Internal Use Only
        </div>
      </div>
    </PageContainer>
  );
}
