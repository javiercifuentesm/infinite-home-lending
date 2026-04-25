import { Router, type Request, type Response } from "express";
import { readLeads, updateLeadStatus, type LeadStatus } from "./leadsStore";

const ANALYTICS_PASSWORD = process.env.ANALYTICS_PASSWORD ?? "ihl2026";

function auth(req: Request, res: Response): boolean {
  const pwd = (req.query.pwd ?? req.query.password) as string | undefined;
  if (!pwd || pwd !== ANALYTICS_PASSWORD) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

export function createAnalyticsRouter(): Router {
  const router = Router();

  router.get("/analytics/leads", (req: Request, res: Response) => {
    if (!auth(req, res)) return;
    const leads = readLeads();
    res.status(200).json({ leads });
  });

  router.patch("/analytics/leads/:id", (req: Request, res: Response) => {
    if (!auth(req, res)) return;
    const { id } = req.params;
    const { status } = req.body as { status?: LeadStatus };
    if (!status || !["new", "in_process", "funded"].includes(status)) {
      res.status(400).json({ error: "Invalid status" });
      return;
    }
    const ok = updateLeadStatus(id, status);
    if (!ok) { res.status(404).json({ error: "Lead not found" }); return; }
    res.status(200).json({ ok: true });
  });

  return router;
}
