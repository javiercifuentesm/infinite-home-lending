/**
 * OpenAI Responses API brain — server-only.
 */
import type OpenAI from "openai";
import type { ResponseOutputItem } from "openai/resources/responses/responses";
import { agentV3DebugLog, type AgentV3OpenAIConfig } from "./agentV3OpenAIClient";
import { AGENT_V3_SYSTEM_PROMPT, AGENT_V3_TOOL_USE_INSTRUCTIONS } from "./agentV3SystemPrompt";
import { buildOpenAITools } from "./agentV3ToolRouter";
import type { AgentV3BrainResult, AgentV3BrainTurnInput } from "./agentV3BrainAdapter";
import { parseTurnIntentFromAssistantText } from "./agentV3IntentContract";
import type { ToolCall, ToolName } from "./agentV3Types";

function extractAssistantText(output: ResponseOutputItem[]): string {
  const parts: string[] = [];
  for (const item of output) {
    if (item.type === "message" && "content" in item) {
      const msg = item as { content?: Array<{ type?: string; text?: string }> };
      for (const c of msg.content ?? []) {
        if (c.type === "output_text" && c.text) parts.push(c.text);
      }
    }
  }
  return parts.join("\n").trim();
}

function extractFunctionCalls(output: ResponseOutputItem[]): Array<{
  call_id: string;
  name: string;
  arguments: string;
}> {
  const out: Array<{ call_id: string; name: string; arguments: string }> = [];
  for (const item of output) {
    if (item.type === "function_call") {
      const fc = item as { call_id: string; name: string; arguments: string };
      out.push({ call_id: fc.call_id, name: fc.name, arguments: fc.arguments });
    }
  }
  return out;
}

function parseArgs(raw: string): Record<string, unknown> {
  try {
    const o = JSON.parse(raw || "{}") as Record<string, unknown>;
    return o && typeof o === "object" ? o : {};
  } catch {
    return {};
  }
}

function toToolCalls(
  calls: Array<{ call_id: string; name: string; arguments: string }>,
): ToolCall[] {
  return calls.map((c) => ({
    id: c.call_id,
    name: c.name as ToolName,
    arguments: parseArgs(c.arguments),
  }));
}

function applyIntentParse(fullText: string): Pick<AgentV3BrainResult, "assistantDisplayText" | "intent"> {
  const { displayText, intent } = parseTurnIntentFromAssistantText(fullText);
  return { assistantDisplayText: displayText, intent };
}

export class OpenAIAgentV3BrainAdapter {
  constructor(
    private readonly client: OpenAI,
    private readonly config: AgentV3OpenAIConfig,
  ) {}

  async completeTurn(input: AgentV3BrainTurnInput): Promise<AgentV3BrainResult> {
    const instructions = [
      input.systemPrompt ?? AGENT_V3_SYSTEM_PROMPT,
      AGENT_V3_TOOL_USE_INSTRUCTIONS,
      input.memoryBlock,
    ]
      .filter(Boolean)
      .join("\n\n");

    const userBlock = [
      input.transcriptWindow,
      "",
      "---",
      `Current user turn (${input.userTurnLabel}):`,
      input.userTurnText,
    ].join("\n");

    const tools = buildOpenAITools(input.availableTools);
    const useChain = !!input.chainConversation && !!input.previousResponseId;
    const modelInput = useChain ? input.userTurnText : userBlock;

    agentV3DebugLog(this.config, "responses.create", {
      model: this.config.model,
      toolCount: tools.length,
      chain: useChain,
    });

    const response = await this.client.responses.create({
      model: this.config.model,
      instructions,
      input: modelInput,
      tools,
      tool_choice: "auto",
      max_output_tokens: 1024,
      temperature: 0.6,
      ...(useChain && input.previousResponseId ? { previous_response_id: input.previousResponseId } : {}),
    });

    if (response.error) {
      return {
        assistantMessages: [],
        requestedToolCalls: [],
        modelUsed: String(response.model ?? this.config.model),
        finishState: "error",
        error: response.error.message ?? "response_error",
        rawResponseId: response.id,
      };
    }

    const requestedToolCalls = toToolCalls(extractFunctionCalls(response.output));
    const assistantText = (response.output_text ?? "").trim() || extractAssistantText(response.output);
    const parsed = applyIntentParse(assistantText);

    agentV3DebugLog(this.config, "responses.output", {
      responseId: response.id,
      toolCalls: requestedToolCalls.map((t) => t.name),
      textLen: assistantText.length,
    });

    return {
      assistantMessages: assistantText ? [{ role: "assistant", text: assistantText }] : [],
      assistantDisplayText: parsed.assistantDisplayText,
      intent: parsed.intent,
      requestedToolCalls,
      modelUsed: String(response.model ?? this.config.model),
      finishState: requestedToolCalls.length ? "tool_calls" : "completed",
      rawResponseId: response.id,
      reasoningMetadata: this.config.debug ? { outputTypes: response.output.map((o) => o.type) } : undefined,
    };
  }

  async continueAfterToolOutputs(
    instructions: string,
    previousResponseId: string,
    toolOutputs: Array<{ call_id: string; outputJson: unknown }>,
  ): Promise<AgentV3BrainResult> {
    const outputs = toolOutputs.map((t) => ({
      type: "function_call_output" as const,
      call_id: t.call_id,
      output: JSON.stringify(t.outputJson),
    }));

    const response = await this.client.responses.create({
      model: this.config.model,
      instructions: [instructions, AGENT_V3_TOOL_USE_INSTRUCTIONS].filter(Boolean).join("\n\n"),
      previous_response_id: previousResponseId,
      input: outputs,
      tools: buildOpenAITools(),
      tool_choice: "auto",
      max_output_tokens: 1024,
      temperature: 0.5,
    });

    if (response.error) {
      return {
        assistantMessages: [],
        requestedToolCalls: [],
        modelUsed: String(response.model ?? this.config.model),
        finishState: "error",
        error: response.error.message ?? "response_error",
        rawResponseId: response.id,
      };
    }

    const requestedToolCalls = toToolCalls(extractFunctionCalls(response.output));
    const assistantText = (response.output_text ?? "").trim() || extractAssistantText(response.output);
    const parsed = applyIntentParse(assistantText);

    return {
      assistantMessages: assistantText ? [{ role: "assistant", text: assistantText }] : [],
      assistantDisplayText: parsed.assistantDisplayText,
      intent: parsed.intent,
      requestedToolCalls,
      modelUsed: String(response.model ?? this.config.model),
      finishState: requestedToolCalls.length ? "tool_calls" : "completed",
      rawResponseId: response.id,
    };
  }
}
