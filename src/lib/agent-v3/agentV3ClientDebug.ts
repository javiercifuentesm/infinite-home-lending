/**
 * Client-only dev flags for Agent V3 instrumentation (no secrets).
 */
export function isAgentV3DebugUiEnabled(): boolean {
  return (
    import.meta.env.VITE_AGENT_V3_DEBUG_UI === "1" || import.meta.env.VITE_AGENT_V3_DEBUG_UI === "true"
  );
}

export type ClientAgentModeOverride = "live" | "deterministic" | null;

/** Dev-only: force deterministic path on the API even when OpenAI is configured. */
export function getClientAgentModeOverride(): ClientAgentModeOverride {
  if (
    import.meta.env.VITE_AGENT_V3_FORCE_DETERMINISTIC === "1" ||
    import.meta.env.VITE_AGENT_V3_FORCE_DETERMINISTIC === "true"
  ) {
    return "deterministic";
  }
  if (typeof window === "undefined") return null;
  const q = new URLSearchParams(window.location.search).get("agentMode");
  if (q === "deterministic" || q === "live") return q;
  return null;
}
