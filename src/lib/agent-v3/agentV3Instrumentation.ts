/**
 * Server-only: when to attach debug JSON on Agent V3 API responses (no secrets).
 */
export function shouldAttachAgentV3DebugResponses(): boolean {
  if (process.env.AGENT_V3_DEBUG_RESPONSES === "1" || process.env.AGENT_V3_DEBUG_RESPONSES === "true") return true;
  if (process.env.OPENAI_AGENT_V3_DEBUG === "true" || process.env.OPENAI_AGENT_V3_DEBUG === "1") return true;
  if (process.env.NODE_ENV !== "production") return true;
  return false;
}
