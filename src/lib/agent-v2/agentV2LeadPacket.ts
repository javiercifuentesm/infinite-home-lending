import type { AgentV2Answers, AgentV2LeadPacket, Readiness } from "./agentV2Types";
import { inferReadiness } from "./agentV2FlowEngine";
import { buildInternalSummary, buildUserFacingSummary } from "./agentV2Summary";

function scoreReadinessV2(answers: AgentV2Answers): Readiness {
  return inferReadiness(answers, !!answers.appointmentSlot);
}

export function buildAgentV2LeadPacket(
  sessionId: string,
  pageContext: string,
  answers: AgentV2Answers,
): AgentV2LeadPacket {
  const readiness = scoreReadinessV2(answers);
  return {
    leadType: "mortgage_consultation",
    source: "website_agent_v2",
    pageContext,
    sessionId,
    createdAt: new Date().toISOString(),
    readiness,
    answers: { ...answers },
    userFacingSummary: buildUserFacingSummary(answers, sessionId),
    internalLeadSummary: buildInternalSummary(answers),
    complianceNotes: [
      "No rates or approvals quoted in agent flow.",
      "Structured intake only; licensed advisor for specifics.",
    ],
  };
}
