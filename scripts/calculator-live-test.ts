import express from "express";
import { S3CalculatorStore, type CalculatorStore } from "../src/server/calculatorAutomationStore";
import { getS3Client } from "../src/server/lib/s3Upload";
import { createCalculatorProviders } from "../src/server/calculatorAutomationProviders";
import { createCalculatorReportRouter } from "../src/server/calculatorReportRoute";
import { CalculatorWorker, actionToken } from "../src/server/calculatorAutomationWorker";

// Operator-only: run in the configured backend environment, never from a public endpoint.
// Sends only the designated report/internal notification; never enrolls in nurture.
const recipient = process.argv[2]?.trim().toLowerCase();
const language = process.argv[3] || "en";
const submissionId = language === "es" ? "4c1aa229-b909-4f5c-b060-19d2f8502f80" : "73d10f05-f530-40a4-85e2-4de2433dd901";
let phase = "configuration";
async function main() {
  if (!["en", "es"].includes(language)) throw new Error("Invalid test language");
  if (recipient !== "javier.cifuentes@infinitehomelending.com") throw new Error("Unauthorized test recipient");
  for (const key of ["AWS_REGION", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "S3_BUCKET", "HUBSPOT_API_KEY", "BREVO_API_KEY"]) if (!process.env[key]) throw new Error(`Missing configuration: ${key}`);
  const secret = process.env.CALCULATOR_LINK_SECRET || process.env.BREVO_API_KEY!;
  const durable = new S3CalculatorStore(getS3Client(), process.env.S3_BUCKET!);
  // Scope worker reads to this single test submission. Mutations retain the full durable state.
  const store: CalculatorStore = {
    async read() { const s = await durable.read(); return { ...s, leads: s.leads[submissionId] ? { [submissionId]: s.leads[submissionId] } : {} }; },
    mutate: change => durable.mutate(change),
  };
  phase = "private storage access";
  await durable.read();
  await durable.mutate(() => undefined);
  const request = { submissionId, firstName: "Javier — IHL AUTOMATION TEST", email: recipient, phone: "", state: "MD", lang: language, timeline: "exploring", emailConsent: false, inputs: { hp: 480000, rent: 2400, dp: 10, rate: 6.75, appr: -3, ri: 0, futureRate: 5, lt: 30 }, waitMonths: 6, utm: { utm_source: "automation_test", utm_medium: "controlled_inbox", utm_campaign: "calculator_acceptance_20260917" } };
  const app = express(); app.use(express.json()); app.use(express.urlencoded({ extended: false })); app.use("/api", createCalculatorReportRouter(durable, secret, true));
  const server = app.listen(0, "127.0.0.1"); await new Promise<void>(resolve => server.once("listening", resolve));
  const base = `http://127.0.0.1:${(server.address() as { port: number }).port}/api/calculator-reports`;
  const assertStatus = async (response: Response, expected: number) => { if (response.status !== expected) throw new Error(`Unexpected HTTP ${response.status}`); };
  try {
    phase = "durable intake";
    const submit = () => fetch(base, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(request) });
    await assertStatus(await submit(), 202); await assertStatus(await submit(), 202);
    console.log(JSON.stringify({ phase, submissionId, duplicateIntake: "passed", financialData: "illustrative fixture only", nurtureEnabled: false }));
    phase = "provider processing";
    const providers = createCalculatorProviders();
    const send = providers.send.bind(providers);
    providers.send = async (lead, kind, links) => {
      if (lead.request.submissionId !== submissionId || lead.request.email !== recipient || ["day2", "day5"].includes(kind)) throw new Error("Test send blocked");
      return send(lead, kind, links);
    };
    // Queue alerts are verified by mocks; this test does not generate extra alert emails.
    providers.notifyQueue = undefined;
    let offset = 0;
    const worker = new CalculatorWorker(store, providers, { secret, baseUrl: "https://infinite-home-lending-production.up.railway.app", nurtureEnabled: false, now: () => Date.now() + offset });
    await worker.tick();
    phase = "delivery confirmation";
    for (let i = 0; i < 6; i++) {
      offset += 300001; await worker.tick();
      const l = (await store.read()).leads[submissionId];
      console.log(JSON.stringify({ phase, submissionId, contactId: l.contactId, noteId: l.noteId, jobs: l.jobs, deliveredAt: l.deliveredAt ? new Date(l.deliveredAt).toISOString() : null }));
      if (l.deliveredAt || Object.values(l.jobs).some(j => j?.status === "review")) break;
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    if (!(await store.read()).leads[submissionId].deliveredAt) throw new Error("Report delivery not yet confirmed; inspect receipt without resending");
    phase = "signed actions";
    const scopedBefore = (await durable.read()).suppressedEmails[recipient];
    const token = actionToken(secret, submissionId, "unsubscribe");
    await assertStatus(await fetch(`${base}/${submissionId}/unsubscribe?token=${token}`), 200);
    const before = (await store.read()).leads[submissionId];
    if (before.stopReason) console.log(JSON.stringify({ phase, scannerCheck: "previous action already recorded" }));
    await assertStatus(await fetch(`${base}/${submissionId}/unsubscribe`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) }), 200);
    if (!(await durable.read()).suppressedEmails[recipient]) throw new Error("Suppression not persisted");
    await assertStatus(await fetch(`${base}/${submissionId}/conversation?token=${actionToken(secret, submissionId, "conversation")}`), 200);
    await assertStatus(await fetch(`${base}/${submissionId}/conversation`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: actionToken(secret, submissionId, "conversation") }) }), 200);
    await worker.tick();
    console.log(JSON.stringify({ phase, unsubscribe: "passed", conversationGet: "passed", conversationNotification: (await store.read()).leads[submissionId].jobs.conversation?.status, noMarketingJobs: !before.jobs.day2 && !before.jobs.day5 }));
    // Preserve any existing opt-out; remove only the one created by this acceptance check.
    await durable.mutate(s => {
      if (scopedBefore) s.suppressedEmails[recipient] = scopedBefore;
      else if (s.suppressedEmails[recipient]?.reason === "calculator-specific email opt-out") delete s.suppressedEmails[recipient];
    });
    const result = (await store.read()).leads[submissionId];
    console.log(JSON.stringify({ phase: "complete", submissionId, crmSynced: result.jobs.crm?.status === "done", reportDelivered: Boolean(result.deliveredAt), advisorAccepted: result.jobs.advisor?.status === "done", nurtureOff: true, actualInboxReview: "requires recipient confirmation", replyLogging: "not yet verified" }));
  } finally { server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve())); }
}
main().catch(error => { console.error(JSON.stringify({ phase, errorName: error.name, httpStatus: error.$metadata?.httpStatusCode, result: "acceptance blocked; inspect queue" })); process.exitCode = 1; });
