import fs from "node:fs";
import path from "node:path";

/** Local default `data/`; on Railway set `LEADS_DATA_DIR` to a mounted volume path, e.g. `/data` */
const DATA_DIR = process.env.LEADS_DATA_DIR
  ? path.resolve(process.env.LEADS_DATA_DIR)
  : path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.jsonl");

export type LeadStatus = "new" | "in_process" | "funded";

export type StoredLead = {
  id: string;
  timestamp: string;
  source: string;
  grade: string;
  goal: string;
  name: string;
  email: string;
  phone: string;
  bestDay: string;
  bestTime: string;
  preferredContact: string;
  conversationLength: number;
  budget: string;
  firstTimeBuyer: boolean;
  hasAgent: boolean | null;
  creditStatus: string;
  timeline: string;
  transcript?: string;
  status: LeadStatus;
  statusUpdatedAt?: string;
};

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readAllRaw(): StoredLead[] {
  try {
    if (!fs.existsSync(LEADS_FILE)) return [];
    const raw = fs.readFileSync(LEADS_FILE, "utf8");
    return raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const lead = JSON.parse(line) as StoredLead;
        if (!lead.id) lead.id = generateId();
        if (!lead.status) lead.status = "new";
        return lead;
      });
  } catch (err) {
    console.error("leadsStore readAllRaw:", err);
    return [];
  }
}

function writeAll(leads: StoredLead[]): void {
  const lines = leads.map((l) => JSON.stringify(l)).join("\n") + "\n";
  fs.writeFileSync(LEADS_FILE, lines, "utf8");
}

export function appendLead(lead: Omit<StoredLead, "id" | "status">): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const full: StoredLead = { ...lead, id: generateId(), status: "new" };
    fs.appendFileSync(LEADS_FILE, `${JSON.stringify(full)}\n`, "utf8");
  } catch (err) {
    console.error("leadsStore appendLead:", err);
  }
}

export function readLeads(): StoredLead[] {
  return readAllRaw();
}

export function updateLeadStatus(id: string, status: LeadStatus): boolean {
  try {
    const leads = readAllRaw();
    const idx = leads.findIndex((l) => l.id === id);
    if (idx === -1) return false;
    leads[idx].status = status;
    leads[idx].statusUpdatedAt = new Date().toISOString();
    writeAll(leads);
    return true;
  } catch (err) {
    console.error("leadsStore updateLeadStatus:", err);
    return false;
  }
}
