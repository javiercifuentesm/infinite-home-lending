/**
 * PDF summary card for LO handoff — structured document first, then render via jsPDF.
 */
import { jsPDF } from "jspdf";
import type { AgentV3LeadAnswers } from "./agentV3Types";
import { buildAgentWrittenSummary, buildLoConsultationSummary } from "./agentV3SummaryBuilder";

export type PdfSummaryDocument = {
  title: string;
  createdAt: string;
  sessionId: string;
  pageContext: string;
  leadName: string;
  email: string;
  phone: string;
  contactPreference: string;
  preferredContactTime: string;
  appointmentSlot: string;
  timezone: string;
  goal: string;
  timeline: string;
  range: string;
  locationOrArea: string;
  concerns: string[];
  questions: string[];
  agentSummary: string;
  structuredLoBlock: string;
  complianceNotes: string[];
  appendixExcerpt?: string;
};

export function buildPdfSummaryDocument(
  sessionId: string,
  pageContext: string,
  answers: AgentV3LeadAnswers,
  concerns: string[],
  questions: string[],
  complianceNotes: string[],
  appendixExcerpt?: string,
): PdfSummaryDocument {
  const structured = buildLoConsultationSummary(answers, pageContext);
  const agentSummary = buildAgentWrittenSummary(answers, concerns, questions);
  const locationOrArea =
    answers.subjectPropertyAddress?.trim() ||
    [answers.subjectCity, answers.subjectState, answers.subjectZip].filter(Boolean).join(", ") ||
    "—";

  return {
    title: "Consultation summary — Infinite Home Lending",
    createdAt: new Date().toISOString(),
    sessionId,
    pageContext,
    leadName: answers.firstName?.trim() || "—",
    email: answers.email?.trim() || "—",
    phone: answers.phone?.trim() || "—",
    contactPreference: answers.contactPreference ?? "—",
    preferredContactTime: answers.preferredContactTime ?? "—",
    appointmentSlot: answers.appointmentSlot ?? "—",
    timezone: answers.schedulingTimezoneUsed ?? "—",
    goal: answers.goal ?? "—",
    timeline: answers.timeline ?? "—",
    range: answers.priceRange ?? answers.propertyValueRange ?? "—",
    locationOrArea,
    concerns: concerns.slice(0, 12),
    questions: questions.slice(0, 12),
    agentSummary,
    structuredLoBlock: structured,
    complianceNotes,
    appendixExcerpt,
  };
}

export function renderPdfSummaryToBlob(doc: PdfSummaryDocument): Blob {
  const pdf = new jsPDF({ unit: "pt", format: "letter" });
  const margin = 48;
  let y = margin;
  const line = (text: string, size = 10) => {
    const lines = pdf.splitTextToSize(text, 512);
    pdf.setFontSize(size);
    for (const ln of lines) {
      if (y > 720) {
        pdf.addPage();
        y = margin;
      }
      pdf.text(ln, margin, y);
      y += size + 4;
    }
  };

  pdf.setFontSize(14);
  pdf.text(doc.title, margin, y);
  y += 28;
  line(`Generated: ${doc.createdAt}`, 9);
  line(`Session: ${doc.sessionId}`, 9);
  line(`CTA / page: ${doc.pageContext}`, 9);
  y += 8;
  line("Borrower", 11);
  line(`Name: ${doc.leadName}`, 10);
  line(`Email: ${doc.email}`, 10);
  line(`Phone: ${doc.phone}`, 10);
  line(`Contact preference: ${doc.contactPreference}`, 10);
  line(`Preferred time band: ${doc.preferredContactTime}`, 10);
  y += 6;
  line("Appointment", 11);
  line(`Slot: ${doc.appointmentSlot}`, 10);
  line(`Timezone: ${doc.timezone}`, 10);
  y += 6;
  line("Goals & context", 11);
  line(`Goal: ${doc.goal}`, 10);
  line(`Timeline: ${doc.timeline}`, 10);
  line(`Range (ballpark): ${doc.range}`, 10);
  line(`Property / area: ${doc.locationOrArea}`, 10);
  y += 6;
  line("Summary for LO", 11);
  line(doc.agentSummary, 10);
  y += 6;
  if (doc.concerns.length) {
    line("Concerns / themes", 11);
    line(doc.concerns.join(" • "), 10);
    y += 6;
  }
  if (doc.questions.length) {
    line("Questions raised", 11);
    line(doc.questions.join(" • "), 10);
    y += 6;
  }
  if (doc.complianceNotes.length) {
    line("Compliance", 11);
    line(doc.complianceNotes.join(" "), 9);
    y += 6;
  }
  line("Structured block", 11);
  line(doc.structuredLoBlock, 9);
  if (doc.appendixExcerpt?.trim()) {
    y += 10;
    line("Appendix (excerpt)", 11);
    line(doc.appendixExcerpt, 8);
  }

  return pdf.output("blob");
}

export function createPdfObjectUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}
