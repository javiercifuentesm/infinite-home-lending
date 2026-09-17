import { calcCostForMonths, type WaitingInputs } from "../hooks/useWaitingMath";

export const CALCULATOR_ID = "true-cost-of-waiting";
export const CALCULATION_VERSION = "waiting-scenarios-v2-2026-09";
export const CONSENT_VERSION = "IHL-CALCULATOR-EMAIL-v1-2026-09";
export const EMAIL_CONSENT = {
  en: "Yes, send me up to two follow-up emails with homebuying guidance related to my scenario. Optional; I can unsubscribe anytime.",
  es: "Sí, deseo recibir hasta dos correos de seguimiento con orientación sobre la compra de vivienda relacionada con mi escenario. Es opcional; puedo cancelar la suscripción en cualquier momento.",
};
export type ReportRequest = {
  submissionId: string;
  firstName: string;
  email: string;
  phone: string;
  state: "MD" | "DC" | "VA";
  lang: "en" | "es";
  timeline: "0-3" | "3-6" | "6-12" | "exploring";
  emailConsent: boolean;
  inputs: WaitingInputs;
  waitMonths: number;
  utm: Partial<Record<"utm_source" | "utm_medium" | "utm_campaign" | "utm_content" | "utm_term", string>>;
};
export const WAITING_LIMITS: Record<keyof WaitingInputs, readonly [number, number]> = {
  hp: [10000, 10000000], rent: [0, 50000], dp: [0, 100], rate: [0, 25],
  appr: [-25, 25], ri: [-25, 25], futureRate: [0, 25], lt: [15, 30],
};

export function parseReportRequest(raw: unknown): ReportRequest {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("Invalid request");
  const body = raw as Record<string, unknown>;
  const text = (key: string, max: number, optional = false) => {
    const value = body[key];
    if (optional && (value === undefined || value === "")) return "";
    if (typeof value !== "string" || !value.trim() || value.length > max || /[\u0000-\u001f\u007f]/.test(value)) throw new Error(`Invalid ${key}`);
    return value.trim();
  };
  const submissionId = text("submissionId", 36);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(submissionId)) throw new Error("Invalid submission ID");
  const firstName = text("firstName", 80);
  const email = text("email", 254).toLowerCase();
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) throw new Error("Invalid email");
  let phone = text("phone", 32, true);
  if (phone) {
    const digits = phone.replace(/\D/g, "");
    if (!/^(1)?\d{10}$/.test(digits)) throw new Error("Invalid phone");
    phone = `+${digits.length === 10 ? "1" : ""}${digits}`;
  }
  if (!["MD", "DC", "VA"].includes(String(body.state))) throw new Error("Select MD, DC, or VA");
  if (!["en", "es"].includes(String(body.lang))) throw new Error("Invalid language");
  if (!["0-3", "3-6", "6-12", "exploring"].includes(String(body.timeline))) throw new Error("Invalid timeline");
  if (typeof body.emailConsent !== "boolean") throw new Error("Invalid email consent");
  if (!body.inputs || typeof body.inputs !== "object" || Array.isArray(body.inputs)) throw new Error("Invalid assumptions");
  const inputs = {} as WaitingInputs;
  for (const [key, [min, max]] of Object.entries(WAITING_LIMITS)) {
    const value = (body.inputs as Record<string, unknown>)[key];
    if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max) throw new Error(`Invalid assumption: ${key}`);
    inputs[key as keyof WaitingInputs] = value;
  }
  if (![15, 20, 30].includes(inputs.lt)) throw new Error("Invalid loan term");
  if (!Number.isInteger(body.waitMonths) || Number(body.waitMonths) < 1 || Number(body.waitMonths) > 36) throw new Error("Invalid waiting period");
  const utm: ReportRequest["utm"] = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const) {
    const value = (body.utm as Record<string, unknown> | undefined)?.[key];
    if (typeof value === "string") utm[key] = value.replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 160);
  }
  return { submissionId, firstName, email, phone, state: body.state as ReportRequest["state"], lang: body.lang as ReportRequest["lang"], timeline: body.timeline as ReportRequest["timeline"], emailConsent: body.emailConsent, inputs, waitMonths: Number(body.waitMonths), utm };
}

export function reportRows(request: ReportRequest): { label: string; value: string }[] {
  const { inputs: i, waitMonths: m, lang } = request;
  const es = lang === "es";
  const d = calcCostForMonths(m, i);
  const money = (n: number) => new Intl.NumberFormat(es ? "es-US" : "en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
  const label = (en: string, spanish: string) => es ? spanish : en;
  return [
    { label: label("Waiting period", "Periodo de espera"), value: `${m} ${es ? "meses" : "months"}` },
    { label: label("Home price now / projected later", "Precio actual / proyectado después"), value: `${money(i.hp)} / ${money(d.futurePrice)}` },
    { label: label("Rate now / assumed later", "Tasa actual / supuesta después"), value: `${i.rate}% / ${i.futureRate}%` },
    { label: label("Annual price change assumption", "Supuesto de cambio anual del precio"), value: `${i.appr}%` },
    { label: label("Monthly rent / assumed annual change", "Arriendo mensual / cambio anual supuesto"), value: `${money(i.rent)} / ${i.ri}%` },
    { label: label("Down payment / loan term", "Cuota inicial / plazo del préstamo"), value: `${i.dp}% / ${i.lt} ${es ? "años" : "years"}` },
    { label: label("Monthly principal & interest now / later", "Capital e interés mensual actual / después"), value: `${money(d.pmtNow)} / ${money(d.pmtThen)}` },
    { label: label("Monthly P&I change (later minus now)", "Cambio mensual de capital e interés (después menos actual)"), value: money(d.monthlyPmtIncrease) },
    { label: label("Rent paid during the waiting period", "Arriendo pagado durante la espera"), value: money(d.rentPaid) },
    { label: label("Projected home price change", "Cambio proyectado del precio"), value: money(d.priceIncrease) },
    { label: label("Down payment now / later", "Cuota inicial actual / después"), value: `${money(i.hp * i.dp / 100)} / ${money(d.futurePrice * i.dp / 100)}` },
    { label: label("Closing-cost assumption", "Supuesto de costos de cierre"), value: "3%" },
    { label: label("Down payment + closing cash now / later", "Cuota inicial + efectivo para cierre actual / después"), value: `${money(i.hp * (i.dp / 100 + .03))} / ${money(d.futurePrice * (i.dp / 100 + .03))}` },
    { label: label("Principal repaid if bought now during this period", "Capital amortizado si compra ahora durante este periodo"), value: money(d.equityMissed) },
  ];
}
