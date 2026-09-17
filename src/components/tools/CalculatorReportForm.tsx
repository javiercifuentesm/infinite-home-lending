import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext";
import { apiUrl } from "../../lib/apiBase";
import { EMAIL_CONSENT, type ReportRequest } from "../../lib/calculatorReport";
import type { WaitingInputs } from "../../hooks/useWaitingMath";

export function CalculatorReportForm({ inputs, waitMonths }: { inputs: WaitingInputs; waitMonths: number }) {
  const { lang } = useLanguage();
  const es = lang === "es", pick = (en: string, spanish: string) => es ? spanish : en;
  const [available, setAvailable] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "queued" | "error">("idle");
  const draft = useRef<ReportRequest | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch(apiUrl("/api/calculator-reports/availability"), { signal: controller.signal }).then(r => r.ok ? r.json() : null).then(r => setAvailable(Boolean(r?.available))).catch(() => {});
    return () => controller.abort();
  }, []);
  if (!available) return null;
  return <section className="rounded-2xl border border-[#C6A15B] bg-white p-6 sm:p-8" aria-labelledby="report-title">
    <h2 id="report-title" className="text-2xl font-bold text-[#0B2A4A]">{pick("Email me this scenario breakdown", "Envíeme este análisis por correo")}</h2>
    <p className="my-3 text-sm text-slate-600">{pick("Your results above are free to view. Get a copy of your assumptions and estimates by email.", "Los resultados de arriba se pueden ver gratis. Reciba una copia de sus supuestos y estimaciones por correo.")}</p>
    {status === "queued" ? <p role="status" className="rounded-lg bg-green-50 p-4 text-green-900">{pick("Your request is saved and queued. Look for an email from Infinite Home Lending; please check your spam folder too.", "Su solicitud está guardada y en cola. Busque un correo de Infinite Home Lending; revise también la carpeta de spam.")}</p> : <form className="space-y-4" onSubmit={async event => {
      event.preventDefault(); if (status === "saving") return;
      const form = new FormData(event.currentTarget);
      const values = { firstName: String(form.get("firstName")), email: String(form.get("email")), phone: String(form.get("phone")), state: String(form.get("state")) as ReportRequest["state"], timeline: String(form.get("timeline")) as ReportRequest["timeline"], emailConsent: form.get("emailConsent") === "on", lang: es ? "es" as const : "en" as const, inputs, waitMonths, utm: Object.fromEntries(["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].map(k => [k, new URLSearchParams(window.location.search).get(k) ?? ""])) };
      if (!draft.current || JSON.stringify({ ...draft.current, submissionId: "" }) !== JSON.stringify({ ...values, submissionId: "" })) draft.current = { ...values, submissionId: crypto.randomUUID() };
      setStatus("saving");
      try {
        const result = await fetch(apiUrl("/api/calculator-reports"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...draft.current, website: form.get("website") }), signal: AbortSignal.timeout(20000) });
        if (result.status !== 202) throw new Error("Not saved");
        setStatus("queued");
      } catch { setStatus("error"); }
    }}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">{pick("First name", "Nombre")}<input className="mt-1 w-full rounded-lg border p-3 font-normal" name="firstName" required maxLength={80} autoComplete="given-name" /></label>
        <label className="text-sm font-semibold">Email<input className="mt-1 w-full rounded-lg border p-3 font-normal" type="email" name="email" required maxLength={254} autoComplete="email" /></label>
        <label className="text-sm font-semibold">{pick("Phone (optional; no texts)", "Teléfono (opcional; sin mensajes)")}<input className="mt-1 w-full rounded-lg border p-3 font-normal" type="tel" name="phone" maxLength={32} autoComplete="tel" /></label>
        <label className="text-sm font-semibold">{pick("Where are you buying?", "¿Dónde comprará?")}<select className="mt-1 w-full rounded-lg border p-3 font-normal" name="state" required defaultValue=""><option value="" disabled>{pick("Select state", "Seleccione estado")}</option><option value="MD">Maryland</option><option value="DC">Washington, DC</option><option value="VA">Virginia</option></select></label>
        <label className="text-sm font-semibold">{pick("Purchase timeline", "Plazo de compra")}<select className="mt-1 w-full rounded-lg border p-3 font-normal" name="timeline" defaultValue="exploring"><option value="exploring">{pick("Just exploring", "Solo explorando")}</option><option value="0-3">0–3 {pick("months", "meses")}</option><option value="3-6">3–6 {pick("months", "meses")}</option><option value="6-12">6–12 {pick("months", "meses")}</option></select></label>
      </div>
      <div hidden aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <label className="flex items-start gap-3 text-sm text-slate-600"><input className="mt-1" name="emailConsent" type="checkbox" />{EMAIL_CONSENT[es ? "es" : "en"]}</label>
      <p className="text-xs text-slate-500">{pick("Requesting this report lets IHL email the copy you asked for. Follow-up emails are optional.", "Solicitar este informe permite a IHL enviarle la copia solicitada por correo. El seguimiento por correo es opcional.")} <a className="underline" href="/privacy-policy">{pick("Privacy policy", "Política de privacidad")}</a></p>
      {status === "error" && <p role="alert" className="text-sm text-red-700">{pick("We could not confirm your request. Please check your information and try again, or contact IHL directly.", "No pudimos confirmar su solicitud. Revise sus datos e intente de nuevo, o contacte a IHL directamente.")}</p>}
      <button disabled={status === "saving"} className="rounded-xl bg-[#0B2A4A] px-6 py-3 font-bold text-white disabled:opacity-60">{status === "saving" ? pick("Saving…", "Guardando…") : pick("Email my breakdown", "Enviar mi análisis")}</button>
    </form>}
  </section>;
}
