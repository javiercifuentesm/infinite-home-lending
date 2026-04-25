import type { LeadPacket } from "./mortgageAgentTypes";

/**
 * V1: mock only — swap for CRM / API / Sheets / email routing.
 */
export async function submitMortgageLead(packet: LeadPacket): Promise<void> {
  console.log("[MortgageAgent] lead packet", packet);
  await new Promise((r) => setTimeout(r, 450));
}
