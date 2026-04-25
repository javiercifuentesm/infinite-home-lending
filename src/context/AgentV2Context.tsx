import { createContext, useContext } from "react";
import type { ConversationState, OrchestratorAction, QuickReplyTarget } from "../lib/agent-v2/agentV2Types";
import type { AgentV3ApiDebug } from "../lib/agent-v3/agentV3Types";

export interface AgentV2ContextValue {
  state: ConversationState;
  /** Dev-only: last Agent V3 API debug payload when VITE_AGENT_V3_API is enabled */
  agentV3Debug: AgentV3ApiDebug | null;
  openAgentV2: (opts?: { pageContext?: string }) => void;
  closeAgentV2: () => void;
  sendQuickReply: (option: string, target: QuickReplyTarget) => void;
  sendUserMessage: (text: string) => void;
  dispatchOrchestratorAction: (action: OrchestratorAction) => void;
  openV1Fallback: () => void;
}

export const AgentV2Context = createContext<AgentV2ContextValue | null>(null);

export function useAgentV2(): AgentV2ContextValue {
  const ctx = useContext(AgentV2Context);
  if (!ctx) throw new Error("useAgentV2 must be used within AgentV2Provider");
  return ctx;
}
