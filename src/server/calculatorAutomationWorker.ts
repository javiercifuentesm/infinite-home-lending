import { createHmac } from "node:crypto";
import type { CalculatorStore, CalculatorLead, JobKind } from "./calculatorAutomationStore";
import { ProviderError, type CalculatorProviders } from "./calculatorAutomationProviders";

export function actionToken(secret: string, id: string, action: string) {
  return createHmac("sha256", secret).update(`calculator-v1:${action}:${id}`).digest("hex");
}
export class CalculatorWorker {
  private busy = false;
  constructor(private store: CalculatorStore, private providers: CalculatorProviders, private options: { secret: string; baseUrl: string; nurtureEnabled: boolean; now?: () => number }) {}
  private now() { return this.options.now?.() ?? Date.now(); }
  private links(lead: CalculatorLead) {
    const link = (action: string) => `${this.options.baseUrl}/api/calculator-reports/${lead.request.submissionId}/${action}?token=${actionToken(this.options.secret, lead.request.submissionId, action)}`;
    return { unsubscribe: link("unsubscribe"), conversation: link("conversation"), booking: "https://www.infinitehomelending.com/request-a-call" };
  }
  async tick() {
    if (this.busy) return;
    this.busy = true;
    try {
      const snapshot = await this.store.read();
      const reviews = Object.entries(snapshot.leads).flatMap(([submissionId, lead]) => Object.entries(lead.jobs).filter(([, job]) => job?.status === "review").map(([kind, job]) => ({ submissionId, kind, error: job?.error })));
      if (reviews.length && this.providers.notifyQueue && this.now() - (snapshot.lastHealthAttemptAt ?? 0) >= 86400000) {
        const claimed = await this.store.mutate(s => {
          if (this.now() - (s.lastHealthAttemptAt ?? 0) < 86400000) return false;
          s.lastHealthAttemptAt = this.now(); return true;
        });
        if (claimed) {
          try { await this.providers.notifyQueue(reviews); }
          catch { console.error("[calculator-automation] Internal review alert failed; inspect queue"); }
        }
      }
      for (const [id, initial] of Object.entries(snapshot.leads)) {
        for (const kind of ["crm", "report", "advisor", "conversation", "day2", "day5"] as JobKind[]) {
          const initialJob = initial.jobs[kind];
          if (!initialJob || ["done", "cancelled", "review"].includes(initialJob.status) || (initialJob.status === "pending" && initialJob.dueAt > this.now())) continue;
          const current = (await this.store.read()).leads[id];
          const job = current?.jobs[kind];
          if (!job) continue;
          const now = this.now();
          if (job.status === "running" && now - (job.claimedAt ?? now) > 120000) {
            await this.store.mutate(s => { const j = s.leads[id].jobs[kind]!; if (j.status === "running" && now - (j.claimedAt ?? now) > 120000) { j.status = kind === "crm" ? "pending" : "review"; j.error = "Interrupted operation; reconcile before resending"; } });
            continue;
          }
          if (["report", "day2", "day5"].includes(kind) && job.status === "accepted" && now - (job.lastDeliveryCheck ?? 0) > 300000) {
            await this.store.mutate(s => { s.leads[id].jobs[kind]!.lastDeliveryCheck = now; });
            try {
              const event = await this.providers.delivery(job.messageId!);
              await this.store.mutate(s => {
                const l = s.leads[id];
                if (event.stop) { l.stopReason = event.stop; l.jobs[kind]!.status = "review"; l.jobs[kind]!.error = event.stop; s.suppressedEmails[l.request.email] = { at: now, reason: event.stop }; }
                else if (event.deliveredAt) {
                  l.jobs[kind]!.status = "done";
                  if (kind === "report") l.deliveredAt = event.deliveredAt;
                  if (kind === "report" && l.request.emailConsent && !l.stopReason && !s.suppressedEmails[l.request.email] && this.options.nurtureEnabled) {
                    l.jobs.day2 ??= { status: "pending", dueAt: event.deliveredAt + 2 * 86400000, attempts: 0 };
                    l.jobs.day5 ??= { status: "pending", dueAt: event.deliveredAt + 5 * 86400000, attempts: 0 };
                  }
                } else if (now - (job.claimedAt ?? now) > 86400000) { l.jobs[kind]!.status = "review"; l.jobs[kind]!.error = "Delivery not confirmed within 24 hours"; }
              });
            } catch { /* Read-only delivery checks can safely retry next tick. */ }
            continue;
          }
          if (job.status !== "pending" || job.dueAt > now) continue;
          if (kind !== "crm" && current.jobs.crm?.status !== "done") continue;
          const nurture = kind === "day2" || kind === "day5";
          if (kind === "day5" && current.jobs.day2 && !["done", "cancelled"].includes(current.jobs.day2.status) && !current.stopReason) continue;
          if (nurture) {
            if (!this.options.nurtureEnabled) continue;
            let reason: string | undefined;
            try {
              reason = await this.providers.stopReason(current);
              for (const priorKind of ["report", "day2"] as const) {
                const prior = current.jobs[priorKind];
                if (!reason && prior?.messageId) reason = (await this.providers.delivery(prior.messageId)).stop;
              }
            } catch { continue; } // fail closed
            if (reason) await this.store.mutate(s => { s.leads[id].stopReason = reason; });
          }
          const claimed = await this.store.mutate(s => {
            const l = s.leads[id], j = l.jobs[kind]!;
            if (j.status !== "pending" || j.dueAt > now) return false;
            if (nurture && (!l.request.emailConsent || l.stopReason || s.suppressedEmails[l.request.email] || !l.deliveredAt)) { j.status = "cancelled"; return false; }
            j.status = "running"; j.claimedAt = now; j.attempts++; return true;
          });
          if (!claimed) continue;
          try {
            let lead = (await this.store.read()).leads[id];
            if (kind === "crm") {
              if (!lead.contactId) {
                const contactId = await this.providers.syncContact(lead);
                await this.store.mutate(s => { s.leads[id].contactId = contactId; });
                lead = (await this.store.read()).leads[id];
              }
              const noteId = lead.noteId || await this.providers.syncNote(lead);
              await this.store.mutate(s => { s.leads[id].noteId = noteId; s.leads[id].jobs.crm!.status = "done"; });
            } else {
              // Check scoped suppression again immediately before the provider call.
              const fresh = await this.store.read(); lead = fresh.leads[id];
              if (nurture && (lead.stopReason || fresh.suppressedEmails[lead.request.email])) { await this.store.mutate(s => { s.leads[id].jobs[kind]!.status = "cancelled"; }); continue; }
              const messageId = await this.providers.send(lead, kind, this.links(lead));
              await this.store.mutate(s => { const j = s.leads[id].jobs[kind]!; j.messageId = messageId; j.status = ["report", "day2", "day5"].includes(kind) ? "accepted" : "done"; });
            }
          } catch (error) {
            await this.store.mutate(s => {
              const j = s.leads[id].jobs[kind]!;
              const retry = error instanceof ProviderError && !error.ambiguous && (error.status === 429 || error.status === 0 || error.status >= 500);
              j.status = retry && j.attempts < 8 ? "pending" : "review";
              j.dueAt = now + Math.min(3600000, 30000 * 2 ** j.attempts);
              j.error = error instanceof ProviderError ? error.message : "Operation failed; review required";
            });
          }
        }
      }
    } finally { this.busy = false; }
  }
}
