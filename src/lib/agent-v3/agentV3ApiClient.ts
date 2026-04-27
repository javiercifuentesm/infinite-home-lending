/**
 * Browser-safe fetch helpers for Agent V3 API (no secrets).
 */
import type { AgentV3ApiDebug } from "./agentV3Types";
import { getClientAgentModeOverride } from "./agentV3ClientDebug";
import type { AgentV3OrchestratorInput, AgentV3OrchestratorOutput } from "./agentV3Types";

function apiBase(): string {
  const env = import.meta.env as { VITE_API_BASE_URL?: string; VITE_AGENT_V3_API_URL?: string };
  return (env.VITE_API_BASE_URL || env.VITE_AGENT_V3_API_URL || "").trim().replace(/\/$/, "");
}

function buildJsonHeaders(): HeadersInit {
  const mode = getClientAgentModeOverride();
  return {
    "Content-Type": "application/json",
    "X-Agent-V3-Client": "1",
    ...(mode ? { "X-Agent-V3-Mode": mode } : {}),
  };
}

export type AgentV3ApiResponse = AgentV3OrchestratorOutput & { debug?: AgentV3ApiDebug; fullState?: unknown };

export async function fetchAgentV3Welcome(sessionId: string, pageContext: string): Promise<AgentV3ApiResponse> {
  const res = await fetch(`${apiBase()}/api/agent-v3/welcome`, {
    method: "POST",
    headers: buildJsonHeaders(),
    body: JSON.stringify({ sessionId, pageContext }),
  });
  if (!res.ok) throw new Error(`welcome_failed:${res.status}`);
  return res.json() as Promise<AgentV3ApiResponse>;
}

export async function fetchAgentV3Turn(input: AgentV3OrchestratorInput): Promise<AgentV3ApiResponse> {
  const res = await fetch(`${apiBase()}/api/agent-v3/turn`, {
    method: "POST",
    headers: buildJsonHeaders(),
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`turn_failed:${res.status}`);
  return res.json() as Promise<AgentV3ApiResponse>;
}
