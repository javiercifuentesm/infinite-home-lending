import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { randomUUID } from "node:crypto";
import { parseReportRequest, reportRows } from "../src/lib/calculatorReport";
import { emptyCalculatorState, type CalculatorStore, type CalculatorState, type CalculatorLead } from "../src/server/calculatorAutomationStore";
import { CalculatorWorker, actionToken } from "../src/server/calculatorAutomationWorker";
import { createCalculatorProviders, ProviderError, renderCalculatorEmail, type CalculatorProviders } from "../src/server/calculatorAutomationProviders";
import { createCalculatorReportRouter } from "../src/server/calculatorReportRoute";

class MemoryStore implements CalculatorStore {
  state = emptyCalculatorState();
  async read() { return structuredClone(this.state); }
  async mutate<T>(fn: (s: CalculatorState) => T) { return fn(this.state); }
}
const request = (consent = false) => parseReportRequest({ submissionId: randomUUID(), firstName: "Test <visitor>", email: "test@example.com", state: "MD", lang: "en", timeline: "exploring", emailConsent: consent, inputs: { hp: 480000, rent: 2400, dp: 10, rate: 6.75, appr: -3, ri: 0, futureRate: 5, lt: 30 }, waitMonths: 6 });
const now = 1900000000000;
function seed(store: MemoryStore, consent = false) {
  const r = request(consent);
  store.state.leads[r.submissionId] = { request: r, createdAt: now, fingerprint: "test", calculationVersion: "test", consentVersion: "test", consentDisclosure: "test", jobs: { crm: { status: "pending", dueAt: now, attempts: 0 }, report: { status: "pending", dueAt: now, attempts: 0 }, advisor: { status: "pending", dueAt: now, attempts: 0 } } };
  return r.submissionId;
}
function fixture(consent = false) {
  const store = new MemoryStore(), id = seed(store, consent), sent: string[] = [];
  const providers: CalculatorProviders = { syncContact: async () => "123", syncNote: async () => "456", send: async (_l, kind) => { sent.push(kind); return `<${kind}@brevo>`; }, delivery: async () => ({ deliveredAt: now }), stopReason: async () => undefined };
  let clock = now;
  const worker = () => new CalculatorWorker(store, providers, { secret: "test", baseUrl: "https://example.com", nurtureEnabled: true, now: () => clock });
  return { store, id, providers, sent, worker, advance: (n: number) => { clock += n; } };
}
test("strict consent, server recomputation and negative scenario values", () => {
  assert.throws(() => parseReportRequest({ ...request(), emailConsent: "true" }));
  assert.throws(() => parseReportRequest({ ...request(), inputs: { ...request().inputs, rate: Infinity } }));
  const rows = reportRows(request());
  assert.ok(rows.find(r => r.label === "Projected home price change")!.value.includes("-"));
  assert.ok(rows.find(r => r.label.startsWith("Monthly P&I change"))!.value.includes("-"));
  assert.ok(!rows.some(r => /total cost/i.test(r.label)));
});
test("report is accepted then delivery confirmed; no consent means no nurture", async () => {
  const f = fixture(); const worker = f.worker();
  await worker.tick(); await worker.tick();
  assert.equal(f.store.state.leads[f.id].jobs.report!.status, "done");
  assert.deepEqual(f.sent, ["report", "advisor"]);
  f.advance(6 * 86400000); await f.worker().tick();
  assert.deepEqual(f.sent, ["report", "advisor"]);
});
test("restart keeps receipts and schedules two emails only after actual delivery", async () => {
  const f = fixture(true); f.providers.delivery = async () => ({});
  await f.worker().tick(); await f.worker().tick();
  assert.equal(f.store.state.leads[f.id].jobs.day2, undefined);
  f.providers.delivery = async () => ({ deliveredAt: now }); f.advance(300001);
  await f.worker().tick();
  assert.equal(f.store.state.leads[f.id].jobs.day2!.dueAt, now + 2 * 86400000);
  f.advance(6 * 86400000); await f.worker().tick(); await f.worker().tick();
  assert.deepEqual(f.sent, ["report", "advisor", "day2", "day5"]);
});
test("uncertain send is flagged and never automatically duplicated", async () => {
  const f = fixture(); f.providers.send = async (_l, kind) => { f.sent.push(kind); throw new ProviderError(0, true); };
  await f.worker().tick(); f.advance(7 * 86400000); await f.worker().tick();
  assert.equal(f.store.state.leads[f.id].jobs.report!.status, "review");
  assert.equal(f.sent.filter(x => x === "report").length, 1);
});
test("rate limit safely retries; CRM note retry preserves contact", async () => {
  const f = fixture(); let creates = 0, notes = 0;
  f.providers.syncContact = async () => { creates++; return "123"; };
  f.providers.syncNote = async () => { if (++notes === 1) throw new ProviderError(429); return "456"; };
  await f.worker().tick(); assert.equal(f.sent.length, 0);
  f.advance(120000); await f.worker().tick();
  assert.equal(creates, 1); assert.equal(notes, 2); assert.deepEqual(f.sent, ["report", "advisor"]);
});
test("opt out, advisor activity and failed preflight suppress nurture", async () => {
  for (const reason of ["optout", "replied", "unavailable"]) {
    const f = fixture(true); await f.worker().tick(); await f.worker().tick();
    if (reason === "optout") f.store.state.suppressedEmails["test@example.com"] = { at: now, reason };
    if (reason === "replied") f.providers.stopReason = async () => "HubSpot reply";
    if (reason === "unavailable") f.providers.stopReason = async () => { throw new ProviderError(503); };
    f.advance(6 * 86400000); await f.worker().tick(); assert.deepEqual(f.sent, ["report", "advisor"]);
  }
});
test("HubSpot incoming email activity from the lead stops nurture", async () => {
  const f = fixture(true);
  const lead = f.store.state.leads[f.id];
  const originalFetch = globalThis.fetch;
  const requests: Array<{ url: string; body?: any }> = [];
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    const body = init?.body ? JSON.parse(String(init.body)) : undefined;
    requests.push({ url, body });
    if (url.includes("/crm/v3/objects/contacts/")) return Response.json({ id: "123", properties: {} });
    if (url.endsWith("/crm/v3/objects/emails/search")) return Response.json({ total: 1, results: [{ id: "email-1" }] });
    throw new Error(`Unexpected request: ${url}`);
  };
  try {
    assert.equal(await createCalculatorProviders().stopReason(lead), "HubSpot incoming email from lead");
    const search = requests.find(x => x.url.endsWith("/crm/v3/objects/emails/search"))!;
    assert.deepEqual(search.body.filterGroups[0].filters, [
      { propertyName: "associations.contact", operator: "EQ", value: "123" },
      { propertyName: "hs_email_direction", operator: "EQ", value: "INCOMING_EMAIL" },
      { propertyName: "hs_email_from_email", operator: "EQ", value: "test@example.com" },
      { propertyName: "hs_createdate", operator: "GTE", value: String(now) },
    ]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
test("expired sending lease requires review after restart", async () => {
  const f = fixture(); const l = f.store.state.leads[f.id];
  l.jobs.crm!.status = "done"; l.jobs.report = { status: "running", dueAt: now, claimedAt: now - 180000, attempts: 1 };
  await f.worker().tick(); assert.equal(l.jobs.report.status, "review"); assert.ok(!f.sent.includes("report"));
});
test("email escapes visitor data and includes scoped unsubscribe and assumptions", () => {
  const f = fixture(), email = renderCalculatorEmail(f.store.state.leads[f.id], "report", { unsubscribe: "https://example.com/unsub", conversation: "https://example.com/request", booking: "https://example.com" });
  assert.ok(email.htmlContent.includes("https://example.com/unsub"));
  assert.ok(email.htmlContent.includes("not a"));
  assert.ok(!email.htmlContent.includes("<visitor>"));
});
test("HTTP intake deduplicates; scanner GET never opts out; signed POST does", async () => {
  const store = new MemoryStore(), app = express();
  app.use(express.json()); app.use(express.urlencoded({ extended: false })); app.use("/api", createCalculatorReportRouter(store, "secret", true));
  const server = app.listen(0, "127.0.0.1"); await new Promise<void>(r => server.once("listening", r));
  const base = `http://127.0.0.1:${(server.address() as { port: number }).port}/api/calculator-reports`;
  try {
    const body = request(true), post = (b: unknown) => fetch(base, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) });
    assert.equal((await post(body)).status, 202); assert.equal((await post(body)).status, 202);
    assert.equal(Object.keys(store.state.leads).length, 1);
    assert.equal((await post({ ...body, firstName: "Other" })).status, 409);
    const link = `${base}/${body.submissionId}/unsubscribe?token=${actionToken("secret", body.submissionId, "unsubscribe")}`;
    assert.equal((await fetch(link)).status, 200); assert.equal(store.state.suppressedEmails[body.email], undefined);
    assert.equal((await fetch(link, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: "bad" }) })).status, 404);
    assert.equal((await fetch(link, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: actionToken("secret", body.submissionId, "unsubscribe") }) })).status, 200);
    assert.ok(store.state.suppressedEmails[body.email]);
  } finally { server.closeAllConnections(); await new Promise<void>(r => server.close(() => r())); }
});
test("delivery failure on first followup prevents the second", async () => {
  const f = fixture(true); await f.worker().tick(); await f.worker().tick();
  f.advance(2 * 86400000); await f.worker().tick();
  f.providers.delivery = async () => ({ stop: "hardBounces" });
  f.advance(4 * 86400000); await f.worker().tick();
  assert.ok(f.store.state.suppressedEmails["test@example.com"]);
  assert.ok(!f.sent.includes("day5"));
});
test("competing workers claim each send only once", async () => {
  const f = fixture(); f.store.state.leads[f.id].jobs.crm!.status = "done";
  await Promise.all([f.worker().tick(), f.worker().tick()]);
  assert.equal(f.sent.filter(k => k === "report").length, 1);
  assert.equal(f.sent.filter(k => k === "advisor").length, 1);
});
test("all-cash and zero-interest inputs produce finite illustrated payments", () => {
  const r = request(); r.inputs.dp = 100; r.inputs.rate = 0; r.inputs.futureRate = 0;
  const rows = reportRows(parseReportRequest(r));
  assert.equal(rows.find(x => x.label === "Monthly principal & interest now / later")!.value, "$0 / $0");
});
test("review alerts are bounded across restarts", async () => {
  const f = fixture(); let alerts = 0;
  f.store.state.leads[f.id].jobs.report!.status = "review";
  f.providers.notifyQueue = async () => { alerts++; };
  await f.worker().tick(); await f.worker().tick(); assert.equal(alerts, 1);
  f.advance(86400000); await f.worker().tick(); assert.equal(alerts, 2);
});
