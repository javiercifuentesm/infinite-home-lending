import { reportRows } from "../lib/calculatorReport";
import type { CalculatorLead, JobKind } from "./calculatorAutomationStore";

export const escapeHtml = (value: string) => value.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
export class ProviderError extends Error {
  constructor(public status: number, public ambiguous = false) { super(`Provider HTTP ${status}`); }
}
async function jsonRequest(url: string, headers: Record<string, string>, method = "GET", body?: unknown): Promise<any> {
  let response: globalThis.Response;
  try {
    response = await fetch(url, { method, headers: { ...headers, "Content-Type": "application/json" }, ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(20000) });
  } catch { throw new ProviderError(0, method !== "GET"); }
  if (!response.ok) throw new ProviderError(response.status, method !== "GET" && response.status >= 500);
  if (response.status === 204) return {};
  try { return await response.json(); } catch { throw new ProviderError(0, method !== "GET"); }
}

export function renderCalculatorEmail(lead: CalculatorLead, kind: JobKind, links: { unsubscribe: string; conversation: string; booking: string }) {
  const r = lead.request;
  const es = r.lang === "es";
  const pick = (en: string, spanish: string) => es ? spanish : en;
  const advisor = kind === "advisor" || kind === "conversation";
  const rows = reportRows(r);
  const subject = advisor ? `${kind === "conversation" ? "Conversation requested" : "New calculator report request"}: ${r.firstName} (${r.state})` : kind === "report" ? pick("Your homebuying scenario breakdown | IHL", "Su análisis de escenarios para comprar vivienda | IHL") : kind === "day2" ? pick("One detail to check in your homebuying scenario", "Un detalle para revisar en su escenario de compra") : pick("Would a brief scenario conversation help?", "¿Le ayudaría una breve conversación sobre su escenario?");
  const intro = advisor ? `First name: ${r.firstName}\nEmail: ${r.email}\nPhone: ${r.phone || "Not provided"}\nState: ${r.state}\nTimeline: ${r.timeline}\nLanguage: ${r.lang}\nOptional follow-up email consent: ${r.emailConsent ? "Yes" : "No"}\nConsent version: ${lead.consentVersion}\nDisclosure: ${lead.consentDisclosure}\nReceived: ${new Date(lead.createdAt).toISOString()}\nSource: ${JSON.stringify(r.utm)}\nSubmission: ${r.submissionId}\n${lead.contactId ? `HubSpot: https://app.hubspot.com/contacts/246447376/record/0-1/${lead.contactId}?utm_source=ihl_calculator&utm_medium=email` : "HubSpot sync is queued separately."}` : kind === "report" ? pick("Here is the breakdown you requested, using the assumptions you entered. The figures are illustrations, not predictions or a loan offer.", "Aquí está el análisis que solicitó, con los supuestos que ingresó. Las cifras son ilustraciones, no predicciones ni una oferta de préstamo.") : kind === "day2" ? pick("Your calculator compares principal and interest. Before choosing a payment target, also account for property taxes, homeowners insurance, mortgage insurance if applicable, HOA fees, maintenance, and reserves. A lower interest rate alone does not tell you whether buying later is better for your household.", "La calculadora compara capital e interés. Antes de elegir un pago objetivo, considere también impuestos, seguro de vivienda, seguro hipotecario si aplica, cuotas de HOA, mantenimiento y reservas. Una tasa más baja por sí sola no determina si comprar después es mejor para su hogar.") : pick("Buying now and waiting can both make sense. If you would like help reviewing the assumptions in your scenario, request a free, no-pressure conversation. We can help identify the next questions to explore. This is the last email in this short calculator follow-up.", "Comprar ahora o esperar pueden ser opciones razonables. Si desea ayuda para revisar los supuestos de su escenario, solicite una conversación gratuita y sin presión. Podemos ayudarle a identificar las próximas preguntas a evaluar. Este es el último correo de este breve seguimiento de la calculadora.");
  const disclaimer = pick("Educational scenario only. Rates and home-price or rent changes are assumptions and may rise or fall. P&I excludes taxes, insurance, mortgage insurance, HOA fees, maintenance, and other ownership costs. Closing costs use a 3% illustration, not a quote. Rent pays for housing. Price changes and cash requirements are separate measures and must not be added into a net cost of waiting. This is not a full rent-versus-buy analysis, pre-approval, or commitment to lend. Eligibility requires an authorized advisor and lender review.", "Escenario educativo únicamente. Las tasas y los cambios del precio o del arriendo son supuestos y pueden subir o bajar. Capital e interés no incluyen impuestos, seguros, seguro hipotecario, HOA, mantenimiento ni otros costos de propiedad. Los costos de cierre usan una ilustración del 3%, no una cotización. El arriendo paga por vivienda. Los cambios de precio y el efectivo necesario son medidas separadas y no deben sumarse como un costo neto de esperar. No es un análisis completo de arrendar frente a comprar, una preaprobación ni un compromiso de préstamo. La elegibilidad requiere revisión de un asesor autorizado y del prestamista.");
  const showRows = kind === "report" || advisor;
  const footer = "Infinite Home Lending, L.L.C. | NMLS #2831765 | Equal Housing Opportunity\n7272 Wisconsin Avenue, 9th Floor, Bethesda, MD 20814";
  const heading = advisor ? "IHL calculator lead" : pick("Your scenario. Your next step.", "Su escenario. Su próximo paso.");
  const textContent = `${advisor ? "" : `${pick("Hi", "Hola")} ${r.firstName},\n\n`}${intro}\n\n${showRows ? rows.map(x => `${x.label}: ${x.value}`).join("\n") + "\n\n" : ""}${advisor ? "" : `${pick("Request a FREE, no-pressure conversation", "Solicite una conversación GRATUITA y sin presión")}: ${links.conversation}\n\n`}${disclaimer}\n\n${footer}${advisor ? "" : `\n\n${pick("Stop calculator follow-up emails", "Cancelar los correos de seguimiento de la calculadora")}: ${links.unsubscribe}`}`;
  const htmlContent = `<!doctype html><html lang="${r.lang}"><body style="margin:0;background:#f4f5f7;color:#0B2A4A;font-family:Arial,sans-serif"><div style="max-width:660px;margin:24px auto;background:white;border-radius:16px;overflow:hidden"><div style="background:#0B2A4A;padding:28px;color:white"><p style="color:#C6A15B;font-size:12px;letter-spacing:2px">INFINITE HOME LENDING</p><h1 style="font-family:Georgia,serif;font-weight:400;font-size:28px">${heading}</h1></div><div style="padding:28px">${advisor ? "" : `<p>${pick("Hi", "Hola")} ${escapeHtml(r.firstName)},</p>`}<p style="white-space:pre-line;line-height:1.6">${escapeHtml(intro)}</p>${showRows ? `<table style="border-collapse:collapse;width:100%;font-size:13px">${rows.map(x => `<tr><th style="padding:11px 8px;border-bottom:1px solid #e2e8f0;text-align:left;font-weight:400;width:55%">${escapeHtml(x.label)}</th><td style="padding:11px 8px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:600">${escapeHtml(x.value)}</td></tr>`).join("")}</table>` : ""}${advisor ? "" : `<p style="margin:28px 0"><a href="${escapeHtml(links.conversation)}" style="display:inline-block;background:#C6A15B;padding:14px 20px;color:#0B2A4A;border-radius:8px;text-decoration:none">${pick("Request a FREE, no-pressure conversation", "Solicite una conversación GRATUITA y sin presión")}</a></p>`}<p style="font-size:11px;line-height:1.6;color:#64748b">${escapeHtml(disclaimer)}</p><p style="font-size:11px;line-height:1.6;white-space:pre-line">${footer}</p>${advisor ? "" : `<p style="font-size:12px"><a href="${escapeHtml(links.unsubscribe)}">${pick("Stop calculator follow-up emails", "Cancelar los correos de seguimiento de la calculadora")}</a></p>`}</div></div></body></html>`;
  return { subject, htmlContent, textContent };
}

export interface CalculatorProviders {
  notifyQueue?(jobs: { submissionId: string; kind: string; error?: string }[]): Promise<void>;
  syncContact(lead: CalculatorLead): Promise<string>;
  syncNote(lead: CalculatorLead): Promise<string>;
  send(lead: CalculatorLead, kind: JobKind, links: { unsubscribe: string; conversation: string; booking: string }): Promise<string>;
  delivery(messageId: string): Promise<{ deliveredAt?: number; stop?: string }>;
  stopReason(lead: CalculatorLead): Promise<string | undefined>;
}

export function createCalculatorProviders(): CalculatorProviders {
  const hsHeaders = () => ({ Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}` });
  const brevoHeaders = () => ({ "api-key": process.env.BREVO_API_KEY! });
  const hs = (path: string, method = "GET", body?: unknown) => jsonRequest(`https://api.hubapi.com${path}`, hsHeaders(), method, body);
  const brevo = (path: string, method = "GET", body?: unknown) => jsonRequest(`https://api.brevo.com/v3${path}`, brevoHeaders(), method, body);
  const contactByEmail = (email: string) => hs(`/crm/v3/objects/contacts/${encodeURIComponent(email)}?idProperty=email&properties=hs_email_optout,hs_sales_email_last_replied,notes_last_contacted,engagements_last_meeting_booked,ihl_lead_status`);
  return {
    async notifyQueue(jobs) {
      const summary = jobs.map(j => `${j.submissionId} / ${j.kind}: ${j.error || "Review required"}`).join("\n");
      await brevo("/smtp/email", "POST", { sender: { name: "IHL Automation", email: process.env.CALCULATOR_SENDER_EMAIL || "info@infinitehomelending.com" }, to: [{ email: "Javier.Cifuentes@infinitehomelending.com" }], subject: `Calculator automation: ${jobs.length} jobs need review`, textContent: `These persisted calculator jobs need review. Check the queue and provider logs before retrying an uncertain send.\n\n${summary}`, tags: ["ihl-calculator", "ihl-queue-review"] });
    },
    async syncContact(lead) {
      const r = lead.request;
      try { return (await contactByEmail(r.email)).id; } catch (error) { if (!(error instanceof ProviderError) || error.status !== 404) throw error; }
      try {
        const created = await hs("/crm/v3/objects/contacts", "POST", { properties: { email: r.email, firstname: r.firstName, ...(r.phone ? { phone: r.phone } : {}), hubspot_owner_id: "93679106", ihl_lead_status: "New / Unworked", ihl_lead_source: "Calculator Report", ihl_market: r.state, ihl_purchase_timeline: r.timeline, ihl_budget: String(r.inputs.hp), ihl_down_payment: `${r.inputs.dp}%` } });
        return created.id;
      } catch (error) {
        if (error instanceof ProviderError && (error.status === 409 || error.ambiguous)) return (await contactByEmail(r.email)).id;
        throw error;
      }
    },
    async syncNote(lead) {
      const marker = `IHL calculator submission: ${lead.request.submissionId}`;
      const contact = await hs(`/crm/v3/objects/contacts/${lead.contactId}?associations=notes`);
      const association = contact.associations?.notes;
      const noteIds = association?.results?.map((x: { id: string }) => x.id) ?? [];
      if (noteIds.length) {
        const notes = await hs("/crm/v3/objects/notes/batch/read", "POST", { properties: ["hs_note_body"], inputs: noteIds.map((id: string) => ({ id })) });
        const existing = notes.results?.find((x: any) => x.properties?.hs_note_body?.includes(marker));
        if (existing) return existing.id;
      }
      if (association?.paging?.next) throw new Error("Review required: note history exceeds first page");
      const r = lead.request;
      const detail = [marker, `Calculation version: ${lead.calculationVersion}`, `Name: ${r.firstName}`, `Email: ${r.email}`, `Phone: ${r.phone || "Not provided"}`, `State: ${r.state}`, `Timeline: ${r.timeline}`, `Language: ${r.lang}`, `Optional email nurture: ${r.emailConsent ? "Yes" : "No"}`, `SMS consent: not requested; no texting`, `Disclosure (${lead.consentVersion}): ${lead.consentDisclosure}`, `Requested: ${new Date(lead.createdAt).toISOString()}`, `UTM: ${JSON.stringify(r.utm)}`, ...reportRows(r).map(x => `${x.label}: ${x.value}`)].map(escapeHtml).join("<br>");
      return (await hs("/crm/v3/objects/notes", "POST", { properties: { hs_timestamp: new Date(lead.createdAt).toISOString(), hs_note_body: detail }, associations: [{ to: { id: lead.contactId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 202 }] }] })).id;
    },
    async send(lead, kind, links) {
      const advisor = kind === "advisor" || kind === "conversation";
      const result = await brevo("/smtp/email", "POST", {
        sender: { name: "Infinite Home Lending", email: process.env.CALCULATOR_SENDER_EMAIL || "info@infinitehomelending.com" },
        replyTo: { name: "Javier Cifuentes", email: "Javier.Cifuentes@infinitehomelending.com" },
        to: [{ email: advisor ? "Javier.Cifuentes@infinitehomelending.com" : lead.request.email, name: advisor ? "Javier Cifuentes" : lead.request.firstName }],
        ...renderCalculatorEmail(lead, kind, links),
        tags: ["ihl-calculator", `ihl-${kind}`, `ihl-${lead.request.submissionId}`],
      });
      if (!result.messageId) throw new ProviderError(0, true);
      return result.messageId;
    },
    async delivery(messageId) {
      const result = await brevo(`/smtp/statistics/events?messageId=${encodeURIComponent(messageId)}&limit=100`);
      const events: any[] = result.events ?? [];
      const stopped = events.find(x => ["hardBounces", "hard_bounce", "blocked", "invalid", "spam", "unsubscribed", "error"].includes(x.event));
      if (stopped) return { stop: String(stopped.event) };
      const delivered = events.find(x => x.event === "delivered");
      return delivered ? { deliveredAt: Date.parse(delivered.date) || Date.now() } : {};
    },
    async stopReason(lead) {
      const contact = await contactByEmail(lead.request.email);
      if (contact.archived) return "contact archived";
      const p = contact.properties ?? {};
      if (p.hs_email_optout === "true") return "HubSpot email opt-out";
      for (const key of ["hs_sales_email_last_replied", "notes_last_contacted", "engagements_last_meeting_booked"]) {
        if (Date.parse(p[key] || "") >= lead.createdAt) return `HubSpot ${key}`;
      }
      if (p.ihl_lead_status && p.ihl_lead_status !== "New / Unworked") return "advisor has updated lead status";
      try {
        const contact = await brevo(`/contacts/${encodeURIComponent(lead.request.email)}`);
        if (contact.emailBlacklisted) return "Brevo email opt-out";
      } catch (error) { if (!(error instanceof ProviderError) || error.status !== 404) throw error; }
      return undefined;
    },
  };
}
