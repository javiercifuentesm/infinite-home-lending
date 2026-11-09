import { Router } from "express";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { GetObjectCommand, PutObjectCommand, type S3Client } from "@aws-sdk/client-s3";

export type CallbackContact = { id: string; email: string; firstName: string; phone?: string };
type Job = { state: "pending" | "running" | "done" | "review"; at?: number; result?: string };
export type CallbackRecord = CallbackContact & {
  registeredAt: number; requestedAt?: number; message?: number;
  jobs?: { pause: Job; task: Job; alert: Job };
};
export type CallbackState = { version: 1; contacts: Record<string, CallbackRecord> };
export interface CallbackStore {
  read(): Promise<CallbackState>;
  mutate<T>(fn: (state: CallbackState) => T): Promise<T>;
}
export class S3CallbackStore implements CallbackStore {
  constructor(private client: S3Client, private bucket: string) {}
  private key = "uploads/automation/meta-es-callback-v1.json";
  private async snapshot() {
    try {
      const r = await this.client.send(new GetObjectCommand({ Bucket: this.bucket, Key: this.key }));
      const state = JSON.parse(await r.Body!.transformToString()) as CallbackState;
      if (state.version !== 1 || !state.contacts) throw new Error("Invalid callback state");
      return { state, etag: r.ETag };
    } catch (e) {
      if ((e as Error).name === "NoSuchKey") return { state: { version: 1, contacts: {} } as CallbackState, etag: undefined };
      throw e;
    }
  }
  async read() { return (await this.snapshot()).state; }
  async mutate<T>(fn: (state: CallbackState) => T): Promise<T> {
    for (let i = 0; i < 8; i++) {
      const { state, etag } = await this.snapshot();
      const before = JSON.stringify(state);
      const result = fn(state);
      if (JSON.stringify(state) === before) return result;
      try {
        await this.client.send(new PutObjectCommand({ Bucket: this.bucket, Key: this.key,
          Body: JSON.stringify(state), ContentType: "application/json", ServerSideEncryption: "AES256",
          ...(etag ? { IfMatch: etag } : { IfNoneMatch: "*" }) }));
        return result;
      } catch (e) {
        if (![409, 412].includes((e as any).$metadata?.httpStatusCode)) throw e;
      }
    }
    throw new Error("Callback storage contention");
  }
}

export const contactKey = (contact: CallbackContact) => createHash("sha256").update(`${contact.id}:${contact.email.toLowerCase()}`).digest("hex");
export const callbackToken = (secret: string, key: string, message: number) => createHmac("sha256", secret).update(`ihl-meta-es-v1:${key}:${message}`).digest("hex");
const safeEqual = (a: unknown, b: string) => {
  if (typeof a !== "string") return false;
  const left = Buffer.from(a), right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
};
export const callbackLinks = (secret: string, base: string, contact: CallbackContact) => Object.fromEntries(Array.from({ length: 50 }, (_, n) => {
  const message = n + 1, key = contactKey(contact);
  return [`IHL_META_CTA_${String(message).padStart(2, "0")}`, `${base}/api/meta-es/${key}/${message}/contact?token=${callbackToken(secret, key, message)}`];
}));

export interface CallbackProviders {
  contact(id: string): Promise<CallbackContact>;
  prepare(contact: CallbackContact, links: Record<string, string>): Promise<void>;
  pause(contact: CallbackRecord): Promise<void>;
  task(contact: CallbackRecord): Promise<string>;
  alert(contact: CallbackRecord): Promise<string>;
}

/** Persist a job claim before its external side effect. Uncertain tasks/emails require review, never a blind retry. */
export class CallbackWorker {
  private busy = false;
  constructor(private store: CallbackStore, private providers: CallbackProviders) {}
  async tick() {
    if (this.busy) return;
    this.busy = true;
    try {
      for (const [key, record] of Object.entries((await this.store.read()).contacts)) {
        if (!record.requestedAt || !record.jobs) continue;
        if (Object.values(record.jobs).every(job => ["done", "review"].includes(job.state))) continue;
        for (const kind of ["pause", "task", "alert"] as const) {
          const claim = await this.store.mutate(s => {
            const r = s.contacts[key], job = r.jobs![kind];
            if (job.state === "running" && (job.at ?? 0) < Date.now() - 300000) {
              job.state = kind === "pause" ? "pending" : "review";
            }
            if (job.state !== "pending") return null;
            if (kind === "task" && r.jobs!.pause.state !== "done") return null;
            if (kind === "alert" && (r.jobs!.pause.state !== "done" || !["done", "review"].includes(r.jobs!.task.state))) return null;
            job.state = "running"; job.at = Date.now();
            return structuredClone(r);
          });
          if (!claim) continue;
          try {
            const result = await this.providers[kind](claim);
            await this.store.mutate(s => { s.contacts[key].jobs![kind] = { state: "done", result: result || undefined }; });
          } catch {
            await this.store.mutate(s => { s.contacts[key].jobs![kind] = { state: kind === "pause" ? "pending" : "review" }; });
            console.error(`[meta-callback] ${kind} ${kind === "pause" ? "retry queued" : "requires review"}`);
          }
        }
      }
    } finally { this.busy = false; }
  }
}

const page = (title: string, content: string) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | Infinite Home Lending</title><style>body{margin:0;background:#eef1f4;color:#0b2a4a;font:18px/1.6 Arial,sans-serif}main{max-width:580px;margin:8vh auto;padding:36px;background:white;border-top:4px solid #c6a15b;border-radius:10px}h1{font:34px/1.15 Georgia,serif}button{font:700 17px Arial;background:#0b2a4a;color:white;padding:18px 24px;border:0;border-radius:6px;cursor:pointer}small{display:block;margin-top:28px;font-size:12px;color:#596575}@media(max-width:640px){main{margin:24px 16px;padding:25px}}</style></head><body><main><p>INFINITE HOME LENDING</p><h1>${title}</h1>${content}<small>Infinite Home Lending, LLC · NMLS #2831765<br>7272 Wisconsin Avenue, Bethesda, MD 20814<br>Igualdad de oportunidades de vivienda</small></main></body></html>`;

export function createMetaCallbackRouter(store: CallbackStore | null, providers: CallbackProviders, options: { enabled: boolean; secret: string; adminSecret: string; baseUrl: string }) {
  const router = Router();
  const worker = store ? new CallbackWorker(store, providers) : null;
  const available = () => options.enabled && Boolean(store && options.secret);
  router.get("/meta-es/availability", (_req, res) => res.json({ available: available() }));
  router.get("/meta-es/prepare", (_req, res) => {
    if (!available()) { res.sendStatus(404); return; }
    res.set({ "Cache-Control": "no-store", "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex, nofollow", "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'" });
    res.type("html").send(page("Preparar enlaces de revisión", '<p>Acceso exclusivo para el administrador. Esta acción prepara enlaces; no suscribe ni inscribe contactos en una campaña.</p><form method="post"><label>Credencial del administrador<br><input type="password" name="adminSecret" required autocomplete="off" style="font:inherit;width:100%;box-sizing:border-box"></label><br><label>IDs de contactos existentes en Brevo (máximo 20, separados por comas)<br><input name="contactIds" required style="font:inherit;width:100%;box-sizing:border-box"></label><p><button type="submit">Preparar y verificar enlaces</button></p></form>'));
  });
  // Deliberate, authenticated provisioning only. Does not subscribe, enroll, or change consent.
  router.post("/meta-es/prepare", async (req, res) => {
    res.set("Cache-Control", "no-store");
    const authorized = safeEqual(req.headers.authorization, `Bearer ${options.adminSecret}`) || safeEqual(req.body?.adminSecret, options.adminSecret);
    if (!available() || options.adminSecret.length < 32 || !authorized) { res.sendStatus(404); return; }
    const ids = typeof req.body?.contactIds === "string" ? req.body.contactIds.split(",").map((id: string) => id.trim()) : req.body?.contactIds;
    if (!Array.isArray(ids) || ids.length < 1 || ids.length > 20 || ids.some(id => typeof id !== "string" || !/^\d{1,16}$/.test(id))) { res.status(400).json({ error: "Supply 1–20 existing Brevo contact IDs" }); return; }
    const results: { id: string; prepared: boolean }[] = [];
    for (const id of [...new Set(ids)] as string[]) {
      try {
        const c = await providers.contact(id);
        if (c.id !== id || !c.firstName.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) throw new Error("Contact incomplete");
        const key = contactKey(c);
        await store!.mutate(s => {
          if (!s.contacts[key]) {
            if (Object.keys(s.contacts).length >= 10000) throw new Error("Capacity review required");
            s.contacts[key] = { ...c, registeredAt: Date.now() };
          }
        });
        await providers.prepare(c, callbackLinks(options.secret, options.baseUrl, c));
        results.push({ id, prepared: true });
      } catch { results.push({ id, prepared: false }); }
    }
    res.json({ results });
  });
  router.use("/meta-es/:key/:message/contact", (_req, res, next) => {
    res.set({ "Cache-Control": "no-store", "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex, nofollow", "X-Content-Type-Options": "nosniff", "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'" }); next();
  });
  const validate = async (key: string, rawMessage: string, token: unknown) => {
    if (!available() || !/^[a-f0-9]{64}$/.test(key) || !/^(?:[1-9]|[1-4]\d|50)$/.test(rawMessage)) return null;
    const message = Number(rawMessage);
    if (!safeEqual(token, callbackToken(options.secret, key, message))) return null;
    return (await store!.read()).contacts[key] ?? null;
  };
  router.get("/meta-es/:key/:message/contact", async (req, res) => {
    try {
      if (!await validate(req.params.key, req.params.message, req.query.token)) { res.status(404).send(page("Este enlace no está disponible", '<p>Puedes escribirnos a Javier.Cifuentes@infinitehomelending.com.</p>')); return; }
      // GET is read-only: email security scanners cannot create requests or pause the journey.
      const token = callbackToken(options.secret, req.params.key, Number(req.params.message));
      res.type("html").send(page("Conversemos sobre tu próximo paso.", `<p>Confirma que quieres que nuestro equipo se comunique contigo usando los datos que ya compartiste. Sin presión y sin compromiso.</p><form method="post"><input type="hidden" name="token" value="${token}"><button type="submit">Sí, quiero que me contacten</button></form><p>No necesitas volver a ingresar tus datos.</p>`));
    } catch { res.status(503).send(page("Inténtalo de nuevo", "<p>No pudimos abrir la solicitud. Vuelve a intentarlo en unos minutos.</p>")); }
  });
  router.post("/meta-es/:key/:message/contact", async (req, res) => {
    try {
      if (!await validate(req.params.key, req.params.message, req.body?.token)) { res.sendStatus(404); return; }
      await store!.mutate(s => {
        const r = s.contacts[req.params.key];
        if (!r.requestedAt) {
          r.requestedAt = Date.now(); r.message = Number(req.params.message);
          r.jobs = { pause: { state: "pending" }, task: { state: "pending" }, alert: { state: "pending" } };
        }
      });
      // Save first, then pause. If a provider is unavailable, the durable worker retries the pause.
      await worker!.tick();
      res.status(202).type("html").send(page("Recibimos tu solicitud.", "<p>Gracias por dar este paso. Nuestro equipo revisará tu solicitud y se comunicará contigo durante el horario de atención.</p><p>Esta solicitud no autoriza mensajes de texto.</p>"));
    } catch { res.status(503).send(page("Tu solicitud no se ha confirmado", "<p>No pudimos guardar la solicitud. Inténtalo de nuevo o escríbenos a Javier.Cifuentes@infinitehomelending.com.</p>")); }
  });
  return { router, worker };
}
