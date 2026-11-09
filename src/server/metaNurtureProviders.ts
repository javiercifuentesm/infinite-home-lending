import type { CallbackContact, CallbackProviders, CallbackRecord } from "./metaNurtureCallback";
import { getHubSpotContactRecordUrl } from "./hubspotClient";

class RemoteError extends Error { constructor(public status: number) { super(`Provider HTTP ${status}`); } }
export function createMetaCallbackProviders(config: { brevoKey: string; hubspotKey: string; eligibleListId: number; advisorEmail: string; ownerId: string; senderEmail: string }): CallbackProviders {
  async function request(base: string, key: string, path: string, method = "GET", body?: unknown) {
    const r = await fetch(base + path, { method, headers: { "Content-Type": "application/json", ...(base.includes("brevo") ? { "api-key": key } : { Authorization: `Bearer ${key}` }) }, ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(20000) });
    if (!r.ok) throw new RemoteError(r.status);
    return r.status === 204 ? {} : r.json();
  }
  const brevo = (path: string, method?: string, body?: unknown) => request("https://api.brevo.com/v3", config.brevoKey, path, method, body);
  const hs = (path: string, method?: string, body?: unknown) => request("https://api.hubapi.com", config.hubspotKey, path, method, body);
  const getHsContact = (email: string) => hs(`/crm/v3/objects/contacts/${encodeURIComponent(email)}?idProperty=email&properties=hubspot_owner_id`);
  async function resolveContact(c: CallbackContact) {
    try { return await getHsContact(c.email); }
    catch (e) { if (!(e instanceof RemoteError) || e.status !== 404) throw e; }
    try {
      return await hs("/crm/v3/objects/contacts", "POST", { properties: { email: c.email, firstname: c.firstName, ...(c.phone ? { phone: c.phone } : {}), hubspot_owner_id: config.ownerId } });
    } catch (e) {
      if (!(e instanceof RemoteError) || e.status !== 409) throw e;
      return getHsContact(c.email);
    }
  }
  let fieldsReady = false;
  async function ensureFields() {
    if (fieldsReady) return;
    const { attributes } = await brevo("/contacts/attributes");
    const desired = [...Array.from({ length: 50 }, (_, i) => ({ name: `IHL_META_CTA_${String(i + 1).padStart(2, "0")}`, type: "text" })), { name: "IHL_META_READY", type: "boolean" }];
    for (const field of desired) {
      const existing = attributes?.find((a: any) => a.name === field.name);
      if (existing && (existing.category !== "normal" || existing.type !== field.type)) throw new Error("Attribute type conflict");
      if (!existing) await brevo(`/contacts/attributes/normal/${field.name}`, "POST", { type: field.type });
    }
    fieldsReady = true;
  }
  const attribution = (c: CallbackRecord) => `Campaign: meta_es_nurture_v1\nTrigger email: ${String(c.message).padStart(2, "0")} of 50\nRequested: ${new Date(c.requestedAt!).toISOString()}\nName: ${c.firstName}\nEmail: ${c.email}\nPhone: ${c.phone || "Not provided"}\nBrevo contact: ${c.id}\nNurture removed from eligible list ${config.eligibleListId}.\nSMS consent was not requested or granted by this action.`;
  return {
    async contact(id) {
      const c = await brevo(`/contacts/${id}`);
      if (c.emailBlacklisted) throw new Error("Contact unsubscribed");
      return { id: String(c.id), email: String(c.email || "").toLowerCase(), firstName: String(c.attributes?.FIRSTNAME || ""), phone: String(c.attributes?.SMS || "") };
    },
    async prepare(c, links) {
      await ensureFields();
      // Never change marketing permission, re-subscribe, or add to a list here.
      await brevo(`/contacts/${c.id}`, "PUT", { attributes: { IHL_META_READY: false } });
      await brevo(`/contacts/${c.id}`, "PUT", { attributes: links });
      const saved = await brevo(`/contacts/${c.id}`);
      if (saved.email?.toLowerCase() !== c.email || Object.entries(links).some(([key, value]) => saved.attributes?.[key] !== value)) throw new Error("Link readback failed");
      await brevo(`/contacts/${c.id}`, "PUT", { attributes: { IHL_META_READY: true } });
      if ((await brevo(`/contacts/${c.id}`)).attributes?.IHL_META_READY !== true) throw new Error("Ready flag readback failed");
    },
    async pause(c) {
      // Removing list membership fires the already-saved immediate exit rule in automation 11.
      // Use email-bound verification so a changed email/contact identity is never acted on.
      const current = await brevo(`/contacts/${c.id}`);
      if (current.email?.toLowerCase() !== c.email) throw new Error("Contact identity changed");
      if (current.listIds?.includes(config.eligibleListId)) await brevo(`/contacts/${c.id}`, "PUT", { unlinkListIds: [config.eligibleListId] });
      const saved = await brevo(`/contacts/${c.id}`);
      if (saved.listIds?.includes(config.eligibleListId)) throw new Error("Nurture removal not confirmed");
    },
    async task(c) {
      const contact = await resolveContact(c);
      const task = await hs("/crm/v3/objects/tasks", "POST", {
        properties: { hs_timestamp: new Date(c.requestedAt!).toISOString(), hs_task_subject: `META ES: contact requested — email ${String(c.message).padStart(2, "0")}`,
          hs_task_body: attribution(c).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]!)).replace(/\n/g, "<br>"), hs_task_status: "NOT_STARTED", hs_task_priority: "HIGH", hs_task_type: c.phone ? "CALL" : "EMAIL",
          hubspot_owner_id: contact.properties?.hubspot_owner_id || config.ownerId },
        associations: [{ to: { id: contact.id }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 204 }] }],
      });
      if (!task.id) throw new Error("Task result unknown");
      return String(task.id);
    },
    async alert(c) {
      const contact = await getHsContact(c.email);
      const sent = await brevo("/smtp/email", "POST", {
        sender: { email: config.senderEmail, name: "Infinite Home Lending" }, to: [{ email: config.advisorEmail }],
        replyTo: { email: c.email, name: c.firstName }, subject: `META ES: ${c.firstName} requests contact (email ${String(c.message).padStart(2, "0")})`,
        textContent: `${attribution(c)}\nHubSpot: ${getHubSpotContactRecordUrl(contact.id)}\nTask: ${c.jobs?.task.result || c.jobs?.task.state || "review required"}`,
        tags: ["ihl-meta-es-callback", `ihl-meta-email-${c.message}`],
      });
      if (!sent.messageId) throw new Error("Alert result unknown");
      return String(sent.messageId);
    },
  };
}
