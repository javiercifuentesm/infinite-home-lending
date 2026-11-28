import type { ContentBlock, MessageCreateParamsNonStreaming } from "@anthropic-ai/sdk/resources/messages";

// Claude Sonnet 5.5 defaults to adaptive thinking. These text-only routes
// previously ran without up-front thinking, so retain that latency and budget
// profile using the provider's documented between_tools setting. SDK 0.91.1
// predates this wire enum; keep the compatibility cast local until the SDK is
// upgraded and cover the actual serialized request in our regression test.
const betweenTools = { type: "between_tools" } as const;

export const SONNET_55_OPTIONS = {
  model: "claude-sonnet-5-5",
  thinking: betweenTools as unknown as NonNullable<MessageCreateParamsNonStreaming["thinking"]>,
  output_config: { effort: "medium" },
} satisfies Pick<MessageCreateParamsNonStreaming, "model" | "thinking" | "output_config">;

export function readTextBlocks(blocks: ContentBlock[]): string {
  return blocks.flatMap((block) => block.type === "text" ? [block.text] : []).join("");
}
