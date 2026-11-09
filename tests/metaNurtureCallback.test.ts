import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { once } from "node:events";
import { callbackLinks, callbackToken, contactKey, createMetaCallbackRouter, CallbackWorker, type CallbackState, type CallbackStore, type CallbackProviders } from "../src/server/metaNurtureCallback";

const contact = { id: "123", email: "review@example.com", firstName: "Review" };
const secret = "test-only-link-secret-32-characters-minimum";
const adminSecret = "test-only-admin-secret-32-characters-minimum";
class MemoryStore implements CallbackStore {
  state: CallbackState = { version: 1, contacts: { [contactKey(contact)]: { ...contact, registeredAt: Date.now() } } };
  async read() { return structuredClone(this.state); }
  async mutate<T>(fn: (s: CallbackState) => T) { return fn(this.state); }
}
async function fixture(overrides: Partial<CallbackProviders> = {}, enabled = true, store = new MemoryStore()) {
  const calls: string[] = [];
  const providers: CallbackProviders = {
    contact: async () => contact, prepare: async () => { calls.push("prepare"); },
    pause: async () => { calls.push("pause"); }, task: async () => { calls.push("task"); return "task1"; },
    alert: async () => { calls.push("alert"); return "message1"; }, ...overrides,
  };
  const { router, worker } = createMetaCallbackRouter(store, providers, { enabled, secret, adminSecret, baseUrl: "https://example.com" });
  const app = express(); app.use(express.json()); app.use(express.urlencoded({ extended: false })); app.use("/api", router);
  const server = app.listen(0, "127.0.0.1"); await once(server, "listening");
  const base = `http://127.0.0.1:${(server.address() as any).port}`;
  const path = `/api/meta-es/${contactKey(contact)}/9/contact`;
  const token = callbackToken(secret, contactKey(contact), 9);
  const post = () => fetch(base + path, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ token }) });
  return { store, calls, providers, worker: worker!, base, path, token, post, close: () => new Promise<void>(resolve => server.close(() => resolve())) };
}

test("security scanner GET renders confirmation without writes or notification", async () => {
  const f = await fixture();
  try {
    const before = structuredClone(f.store.state);
    const r = await fetch(`${f.base}${f.path}?token=${f.token}`);
    assert.equal(r.status, 200); assert.match(await r.text(), /Sí, quiero que me contacten/);
    assert.deepEqual(f.store.state, before); assert.deepEqual(f.calls, []);
    assert.equal(r.headers.get("referrer-policy"), "no-referrer");
  } finally { await f.close(); }
});
test("confirmation pauses before task and alert, repeated requests across emails deduplicate", async () => {
  const f = await fixture();
  try {
    assert.equal((await f.post()).status, 202);
    assert.equal((await f.post()).status, 202);
    const otherPath = f.path.replace("/9/", "/50/");
    await fetch(f.base + otherPath, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ token: callbackToken(secret, contactKey(contact), 50) }) });
    assert.deepEqual(f.calls, ["pause", "task", "alert"]);
    assert.equal(f.store.state.contacts[contactKey(contact)].message, 9);
  } finally { await f.close(); }
});
test("invalid, cross-email, malformed, and Unicode tokens fail without side effects", async () => {
  const f = await fixture();
  try {
    for (const token of ["x".repeat(64), "💛".repeat(32), callbackToken(secret, contactKey(contact), 10)]) {
      assert.equal((await fetch(`${f.base}${f.path}?token=${encodeURIComponent(token)}`)).status, 404);
    }
    assert.equal((await fetch(`${f.base}${f.path.replace('/9/', '/51/')}?token=${f.token}`)).status, 404);
    assert.deepEqual(f.calls, []);
  } finally { await f.close(); }
});
test("disabled route fails closed and never provisions", async () => {
  const f = await fixture({}, false);
  try {
    assert.equal((await f.post()).status, 404);
    assert.deepEqual(await (await fetch(f.base + "/api/meta-es/availability")).json(), { available: false });
    assert.equal((await fetch(f.base + "/api/meta-es/prepare", { method: "POST", headers: { Authorization: `Bearer ${adminSecret}`, "Content-Type": "application/json" }, body: JSON.stringify({ contactIds: ["123"] }) })).status, 404);
  } finally { await f.close(); }
});
test("storage failure never displays a false success", async () => {
  const store = new MemoryStore(); store.mutate = async () => { throw new Error("store unavailable"); };
  const f = await fixture({}, true, store);
  try { const r = await f.post(); assert.equal(r.status, 503); assert.match(await r.text(), /no se ha confirmado/); assert.deepEqual(f.calls, []); }
  finally { await f.close(); }
});
test("failed pause blocks downstream actions and retries safely", async () => {
  let fail = true;
  const f = await fixture({ pause: async () => { if (fail) throw new Error("offline"); } });
  try {
    await f.post(); assert.deepEqual(f.calls, []);
    fail = false; await f.worker.tick(); assert.deepEqual(f.calls, ["task", "alert"]);
  } finally { await f.close(); }
});
test("uncertain task is held for review and never blindly recreated", async () => {
  let attempts = 0;
  const f = await fixture({ task: async () => { attempts++; throw new Error("unknown response"); } });
  try {
    await f.post(); await f.worker.tick(); await f.post();
    assert.equal(attempts, 1); assert.equal(f.store.state.contacts[contactKey(contact)].jobs!.task.state, "review");
    assert.deepEqual(f.calls, ["pause", "alert"]);
  } finally { await f.close(); }
});
test("worker resumes pending requests after restart; stale external claims require review", async () => {
  const f = await fixture();
  try {
    const record = f.store.state.contacts[contactKey(contact)]; record.requestedAt = Date.now(); record.message = 9;
    record.jobs = { pause: { state: "pending" }, task: { state: "running", at: Date.now() - 600000 }, alert: { state: "pending" } };
    await new CallbackWorker(f.store, f.providers).tick();
    assert.equal(record.jobs.task.state, "review"); assert.deepEqual(f.calls, ["pause", "alert"]);
  } finally { await f.close(); }
});
test("provisioning requires admin authentication and never enrolls contacts", async () => {
  const f = await fixture();
  try {
    const init = { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminSecret}` }, body: JSON.stringify({ contactIds: ["123", "123"] }) };
    assert.equal((await fetch(f.base + "/api/meta-es/prepare", { ...init, headers: { "Content-Type": "application/json" } })).status, 404);
    const r = await fetch(f.base + "/api/meta-es/prepare", init);
    assert.deepEqual(await r.json(), { results: [{ id: "123", prepared: true }] }); assert.deepEqual(f.calls, ["prepare"]);
    const links = callbackLinks(secret, "https://example.com", contact);
    assert.equal(Object.keys(links).length, 50); assert.ok(Object.values(links).every(url => !url.includes(contact.email)));
    assert.notEqual(links.IHL_META_CTA_01, links.IHL_META_CTA_50);
  } finally { await f.close(); }
});
test("competing workers claim each external action once and completed requests cause no job writes", async () => {
  const f = await fixture();
  try {
    const record = f.store.state.contacts[contactKey(contact)]; record.requestedAt = Date.now(); record.message = 9;
    record.jobs = { pause: { state: "pending" }, task: { state: "pending" }, alert: { state: "pending" } };
    await Promise.all([new CallbackWorker(f.store, f.providers).tick(), new CallbackWorker(f.store, f.providers).tick()]);
    await f.worker.tick();
    assert.deepEqual(f.calls, ["pause", "task", "alert"]);
    let writes = 0; const mutate = f.store.mutate.bind(f.store);
    f.store.mutate = async fn => { writes++; return mutate(fn); };
    await f.worker.tick(); assert.equal(writes, 0);
  } finally { await f.close(); }
});
test("administrator browser form prepares a contact without putting credentials in URLs", async () => {
  const f = await fixture();
  try {
    const page = await fetch(f.base + "/api/meta-es/prepare");
    assert.equal(page.status, 200); const html = await page.text();
    assert.match(html, /type="password"/); assert.match(html, /method="post"/); assert.doesNotMatch(html, new RegExp(adminSecret));
    const result = await fetch(f.base + "/api/meta-es/prepare", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ adminSecret, contactIds: "123, 123" }) });
    assert.deepEqual(await result.json(), { results: [{ id: "123", prepared: true }] });
    assert.deepEqual(f.calls, ["prepare"]);
  } finally { await f.close(); }
});
