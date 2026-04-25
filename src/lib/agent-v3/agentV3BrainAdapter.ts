/**
 * Brain seam: mock for eval/offline; OpenAI implementation lives in agentV3BrainAdapterOpenAI.ts (server).
 */
import type { ToolDefinition } from "./agentV3Types";
import { TOOL_DEFINITIONS } from "./agentV3ToolRouter";
import { AGENT_V3_SYSTEM_PROMPT } from "./agentV3SystemPrompt";
import type { AgentV3NextBestAction, AgentV3SessionState, ToolCall } from "./agentV3Types";

export type AgentV3FinishState = "completed" | "tool_calls" | "error";

export type AgentV3BrainResult = {
  assistantMessages: { role: "assistant"; text: string }[];
  /** User-visible text with intent JSON stripped (when present). */
  assistantDisplayText?: string;
  /** Parsed next-best-action contract; orchestrator validates confidence and merges signals. */
  intent?: AgentV3NextBestAction | null;
  requestedToolCalls: ToolCall[];
  reasoningMetadata?: unknown;
  rawResponseId?: string;
  modelUsed: string;
  finishState: AgentV3FinishState;
  error?: string;
};

export type AgentV3BrainTurnInput = {
  systemPrompt: string;
  transcriptWindow: string;
  memoryBlock: string;
  userTurnText: string;
  userTurnLabel: string;
  availableTools: ToolDefinition[];
  /** When true, first request uses previousResponseId + short user text only */
  chainConversation?: boolean;
  previousResponseId?: string | null;
};

export type AgentV3BrainPort = {
  completeTurn(req: AgentV3BrainTurnInput): Promise<AgentV3BrainResult>;
  continueAfterToolOutputs(
    instructions: string,
    previousResponseId: string,
    toolOutputs: Array<{ call_id: string; outputJson: unknown }>,
  ): Promise<AgentV3BrainResult>;
};

export function defaultBrainRequest(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  extraSystem?: string,
): { systemPrompt?: string; messages: typeof messages; tools: ToolDefinition[] } {
  return {
    systemPrompt: [AGENT_V3_SYSTEM_PROMPT, extraSystem].filter(Boolean).join("\n\n"),
    messages,
    tools: TOOL_DEFINITIONS,
  };
}

/** Offline / tests — returns empty so orchestrator can fall back to deterministic copy. */
export class MockAgentV3BrainAdapter implements AgentV3BrainPort {
  async completeTurn(_req: AgentV3BrainTurnInput): Promise<AgentV3BrainResult> {
    return {
      assistantMessages: [],
      requestedToolCalls: [],
      modelUsed: "mock",
      finishState: "completed",
    };
  }

  async continueAfterToolOutputs(): Promise<AgentV3BrainResult> {
    return {
      assistantMessages: [],
      requestedToolCalls: [],
      modelUsed: "mock",
      finishState: "completed",
    };
  }
}

export function transcriptWindowFromState(state: AgentV3SessionState, maxMessages = 24): string {
  const lines: string[] = [];
  for (const item of state.transcript.slice(-maxMessages)) {
    if (item.kind === "message") {
      lines.push(`${item.role}: ${item.text}`);
    } else if (item.kind === "widget") {
      lines.push(`[widget ${item.widgetType}]`);
    }
  }
  return lines.join("\n");
}
