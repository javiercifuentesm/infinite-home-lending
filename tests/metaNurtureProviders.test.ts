import test from "node:test";
import assert from "node:assert/strict";
import { createMetaCallbackProviders } from "../src/server/metaNurtureProviders";
import { callbackLinks, type CallbackRecord } from "../src/server/metaNurtureCallback";

const config = { brevoKey: "fake-brevo-key", hubspotKey: "fake-hubspot-key", eligibleListId: 6, advisorEmail: "advisor@example.com", ownerId: "93679106", senderEmail: "sender@example.com" };
const contact = { id: "123", email: "review@example.com", firstName: "Review" };
const ok = (data: unknown, status = 200) => new Response(status === 204 ? null : JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

test("provisioning creates 51 typed attributes and verifies every saved personalized link without enrollment", async () => {
  const original = globalThis.fetch; const created: any[] = []; let saved: any = { attributes: {} }; const writes: any[] = [];
  globalThis.fetch = (async (url: string, init: any = {}) => {
    if (url.endsWith("/contacts/attributes")) return ok({ attributes: [] });
    if (url.includes("/contacts/attributes/normal/")) { created.push({ name: url.split("/").at(-1), ...JSON.parse(init.body) }); return ok({}, 201); }
    if (init.method === "PUT") { const update = JSON.parse(init.body); writes.push(update); Object.assign(saved.attributes, update.attributes); return ok({}, 204); }
    return ok({ ...contact, attributes: saved.attributes });
  }) as any;
  try {
    const links = callbackLinks("test-secret", "https://example.com", contact);
    await createMetaCallbackProviders(config).prepare(contact, links);
    assert.equal(created.length, 51); assert.equal(created.filter(x => x.type === "text").length, 50);
    assert.deepEqual(created.at(-1), { name: "IHL_META_READY", type: "boolean" });
    assert.deepEqual(Object.keys(saved), ["attributes"]); assert.equal(saved.attributes.IHL_META_READY, true);
    assert.deepEqual(writes[0], { attributes: { IHL_META_READY: false } });
    assert.deepEqual(writes.at(-1), { attributes: { IHL_META_READY: true } });
  } finally { globalThis.fetch = original; }
});
test("pause removes only the nurture list, preserves all consent fields, and reads back removal", async () => {
  const original = globalThis.fetch; const writes: any[] = []; let listIds = [4, 6];
  globalThis.fetch = (async (_url: string, init: any = {}) => {
    if (init.method === "PUT") { writes.push(JSON.parse(init.body)); listIds = [4]; return ok({}, 204); }
    return ok({ ...contact, listIds, emailBlacklisted: false });
  }) as any;
  try {
    const p = createMetaCallbackProviders(config); await p.pause({ ...contact, registeredAt: 1 }); await p.pause({ ...contact, registeredAt: 1 });
    assert.deepEqual(writes, [{ unlinkListIds: [6] }]);
  } finally { globalThis.fetch = original; }
});
test("changed contact identity prevents removal of another person's nurture", async () => {
  const original = globalThis.fetch; let writes = 0;
  globalThis.fetch = (async (_url: string, init: any = {}) => { if (init.method === "PUT") writes++; return ok({ email: "another@example.com", listIds: [6] }); }) as any;
  try { await assert.rejects(() => createMetaCallbackProviders(config).pause({ ...contact, registeredAt: 1 }), /identity changed/); assert.equal(writes, 0); }
  finally { globalThis.fetch = original; }
});
test("HubSpot task preserves existing ownership, records the triggering email, and escapes visitor text", async () => {
  const original = globalThis.fetch; let payload: any;
  globalThis.fetch = (async (url: string, init: any = {}) => {
    if (url.includes("/contacts/")) return ok({ id: "hs123", properties: { hubspot_owner_id: "another-advisor" } });
    payload = JSON.parse(init.body); return ok({ id: "task123" });
  }) as any;
  try {
    await createMetaCallbackProviders(config).task({ ...contact, firstName: "<img src=x>", registeredAt: 1, requestedAt: Date.now(), message: 47 });
    assert.equal(payload.properties.hubspot_owner_id, "another-advisor"); assert.equal(payload.properties.hs_task_status, "NOT_STARTED");
    assert.match(payload.properties.hs_task_body, /Trigger email: 47 of 50/); assert.doesNotMatch(payload.properties.hs_task_body, /<img/);
    assert.equal(payload.associations[0].to.id, "hs123"); assert.equal(payload.associations[0].types[0].associationTypeId, 204);
  } finally { globalThis.fetch = original; }
});
test("internal alert is sent only to configured advisor with campaign, email, and CRM attribution", async () => {
  const original = globalThis.fetch; let payload: any;
  globalThis.fetch = (async (url: string, init: any = {}) => {
    if (url.includes("hubapi")) return ok({ id: "hs123" });
    payload = JSON.parse(init.body); return ok({ messageId: "accepted123" });
  }) as any;
  try {
    const record: CallbackRecord = { ...contact, registeredAt: 1, requestedAt: Date.now(), message: 5, jobs: { pause: { state: "done" }, task: { state: "done", result: "task123" }, alert: { state: "running" } } };
    assert.equal(await createMetaCallbackProviders(config).alert(record), "accepted123");
    assert.deepEqual(payload.to, [{ email: "advisor@example.com" }]); assert.match(payload.textContent, /meta_es_nurture_v1/);
    assert.match(payload.textContent, /Trigger email: 05 of 50/); assert.match(payload.textContent, /Task: task123/);
  } finally { globalThis.fetch = original; }
});
