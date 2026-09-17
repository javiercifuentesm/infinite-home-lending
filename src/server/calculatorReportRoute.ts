import { Router } from "express";
import { createHash, timingSafeEqual } from "node:crypto";
import { parseReportRequest, CONSENT_VERSION, CALCULATION_VERSION, EMAIL_CONSENT } from "../lib/calculatorReport";
import type { CalculatorStore } from "./calculatorAutomationStore";
import { actionToken } from "./calculatorAutomationWorker";

export function createCalculatorReportRouter(store: CalculatorStore | null, secret: string, enabled = false) {
  const router = Router();
  router.get("/calculator-reports/availability", (_req, res) => res.json({ available: enabled && Boolean(store && secret) }));
  router.post("/calculator-reports", async (req, res) => {
    if (!enabled || !store || !secret) { res.status(503).json({ error: "Report requests are temporarily unavailable." }); return; }
    if (req.body?.website) { res.status(400).json({ error: "Invalid request" }); return; }
    let request;
    try { request = parseReportRequest(req.body); } catch (error) { res.status(400).json({ error: (error as Error).message }); return; }
    const fingerprint = createHash("sha256").update(JSON.stringify(request)).digest("hex");
    try {
      const result = await store.mutate(s => {
        const existing = s.leads[request.submissionId];
        if (existing) return existing.fingerprint === fingerprint ? "accepted" : "conflict";
        const now = Date.now(), leads = Object.values(s.leads);
        if (leads.length >= 500 || leads.filter(l => l.createdAt > now - 86400000).length >= 100 || leads.filter(l => l.request.email === request.email && l.createdAt > now - 3600000).length >= 3) return "limit";
        s.leads[request.submissionId] = { request, fingerprint, createdAt: now, consentDisclosure: EMAIL_CONSENT[request.lang], consentVersion: CONSENT_VERSION, calculationVersion: CALCULATION_VERSION, jobs: { crm: { status: "pending", dueAt: now, attempts: 0 }, report: { status: "pending", dueAt: now, attempts: 0 }, advisor: { status: "pending", dueAt: now, attempts: 0 } } };
        return "accepted";
      });
      if (result === "conflict") { res.status(409).json({ error: "Submission ID already used for a different request." }); return; }
      if (result === "limit") { res.status(429).json({ error: "Request limit reached. Please contact IHL directly." }); return; }
      res.status(202).json({ status: "queued", submissionId: request.submissionId });
    } catch { res.status(503).json({ error: "We could not save your request. Please try again later." }); }
  });
  const valid = (id: string, action: string, token: unknown) => {
    if (typeof token !== "string" || !/^[0-9a-f]{64}$/.test(token) || !secret) return false;
    return timingSafeEqual(Buffer.from(token, "hex"), Buffer.from(actionToken(secret, id, action), "hex"));
  };
  for (const action of ["unsubscribe", "conversation"]) {
    router.get(`/calculator-reports/:id/${action}`, async (req, res) => {
      if (!store || !valid(req.params.id, action, req.query.token)) { res.status(404).send("Link unavailable"); return; }
      try {
        const lead = (await store.read()).leads[req.params.id];
        if (!lead) { res.status(404).send("Link unavailable"); return; }
        const es = lead.request.lang === "es";
        const label = action === "unsubscribe" ? (es ? "Cancelar seguimiento por correo" : "Stop calculator follow-up emails") : (es ? "Solicitar una conversación gratuita" : "Request a free conversation");
        res.set("Cache-Control", "no-store").set("Referrer-Policy", "no-referrer").type("html").send(`<!doctype html><html lang="${lead.request.lang}"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Infinite Home Lending</title><body style="font:18px system-ui;background:#f5f7fa;color:#0b2a4a;padding:32px"><main style="max-width:600px;margin:auto"><h1>${label}</h1><form method="post"><input type="hidden" name="token" value="${String(req.query.token)}"><button style="font:inherit;padding:16px;background:#c6a15b;border:0;border-radius:8px">${label}</button></form></main></body></html>`);
      } catch { res.status(503).send("Please try again later"); }
    });
    router.post(`/calculator-reports/:id/${action}`, async (req, res) => {
      if (!store || !valid(req.params.id, action, req.body?.token)) { res.status(404).send("Link unavailable"); return; }
      try {
        const lang = await store.mutate(s => {
          const lead = s.leads[req.params.id]; if (!lead) return null;
          const now = Date.now();
          lead.stopReason = action === "unsubscribe" ? "calculator-specific email opt-out" : "conversation requested";
          if (action === "unsubscribe") s.suppressedEmails[lead.request.email] = { at: now, reason: lead.stopReason };
          else { lead.conversationAt = now; lead.jobs.conversation ??= { status: "pending", dueAt: now, attempts: 0 }; }
          for (const l of Object.values(s.leads)) if (l.request.email === lead.request.email) for (const kind of ["day2", "day5"] as const) if (l.jobs[kind]?.status === "pending") l.jobs[kind]!.status = "cancelled";
          return lead.request.lang;
        });
        if (!lang) { res.status(404).send("Link unavailable"); return; }
        res.set("Cache-Control", "no-store").type("text").send(action === "unsubscribe" ? (lang === "es" ? "Se cancelaron los correos de seguimiento de la calculadora." : "Calculator follow-up emails have been stopped.") : (lang === "es" ? "Recibimos su solicitud. Un asesor se pondrá en contacto por correo." : "Your request is saved. An advisor will contact you by email."));
      } catch { res.status(503).send("Please try again later"); }
    });
  }
  return router;
}
