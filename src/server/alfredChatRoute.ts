import { Router } from "express";
import Anthropic from "@anthropic-ai/sdk";
import type { MessageParam } from "@anthropic-ai/sdk/resources/messages";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? "" });

const ALFRED_BASE_SYSTEM_PROMPT = `You are Alfred, the AI intelligence assistant for Infinite Home Lending's MA Command Center. You serve as a trusted senior mortgage colleague to our Mortgage Advisors (MAs) in the DMV market (Maryland, Virginia, DC).

YOUR IDENTITY:
- You are Alfred — knowledgeable, precise, and always on the MA's side
- Think of yourself as a brilliant mortgage compliance officer, market analyst, and deal strategist combined
- You communicate like a trusted senior colleague, not a customer service bot
- Concise, direct, actionable — no fluff

YOUR EXPERTISE:
- Fannie Mae, Freddie Mac, FHA, VA, USDA, Jumbo, Non-QM guidelines (current)
- DMV market intelligence (MD, VA, DC specific programs, transfer taxes, local nuances)
- Income calculation (salaried, self-employed, rental, Social Security, retirement)
- Asset analysis and deposit documentation requirements
- Rate strategy, lock timing, buydown structures
- Deal rescue and creative structuring
- Client conversation scripts and objection handling

DMV-SPECIFIC KNOWLEDGE:
- Maryland: State-specific programs (DHCD MMP), recordation taxes, ground rents
- Virginia: VHDA programs, grantor tax, Northern VA high-balance limits
- DC: HPAP, deed recordation taxes, rent control implications for investment

CURRENT CONTEXT (injected dynamically):
__CONTEXT__

RULES:
- Always be specific with numbers and guidelines
- Cite specific guideline references when relevant (e.g., "per Fannie Mae SEL-2024-07")
- If you don't know something, say so and suggest where to find it
- Never give advice that could be construed as legal or tax advice
- Keep responses under 300 words unless a detailed breakdown is requested
- Format responses with clear sections when explaining complex topics
- End action-oriented responses with a clear "Next step:" recommendation`;

function formatContext(context?: { currentModule?: string; rates?: object }): string {
  const lines = [`Today is ${new Date().toLocaleDateString()}.`];
  if (context?.currentModule) {
    lines.push(`The MA is currently viewing: ${context.currentModule}.`);
  }
  if (context?.rates) {
    const ratesText =
      typeof context.rates === "string"
        ? context.rates
        : Object.values(context.rates).join(", ");
    if (ratesText) {
      lines.push(`Current market context: ${ratesText}`);
    }
  }
  return lines.join("\n");
}

function buildSystemPrompt(context?: { currentModule?: string; rates?: object }): string {
  return ALFRED_BASE_SYSTEM_PROMPT.replace("__CONTEXT__", formatContext(context));
}

export function createAlfredChatRouter() {
  const router = Router();

  router.post("/alfred-chat", async (req, res) => {
    try {
      const { messages, context } = req.body as {
        messages?: { role: "user" | "assistant"; content: string }[];
        context?: { currentModule?: string; rates?: object };
      };

      if (!Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({
          ok: false,
          message: "Alfred is temporarily unavailable. Please try again.",
        });
        return;
      }

      const apiKey = process.env.ANTHROPIC_API_KEY ?? "";
      if (!apiKey) {
        res.status(500).json({
          ok: false,
          message: "Alfred is temporarily unavailable. Please try again.",
        });
        return;
      }

      const trimmedMessages = messages
        .slice(-10)
        .filter(
          (msg) =>
            (msg.role === "user" || msg.role === "assistant") &&
            typeof msg.content === "string" &&
            msg.content.trim(),
        )
        .map(
          (msg): MessageParam => ({
            role: msg.role,
            content: msg.content.trim(),
          }),
        );

      if (trimmedMessages.length === 0) {
        res.status(400).json({
          ok: false,
          message: "Alfred is temporarily unavailable. Please try again.",
        });
        return;
      }

      const response = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        stream: false,
        system: buildSystemPrompt(context),
        messages: trimmedMessages,
      });

      const message =
        response.content[0]?.type === "text" ? response.content[0].text.trim() : "";

      if (!message) {
        res.status(500).json({
          ok: false,
          message: "Alfred is temporarily unavailable. Please try again.",
        });
        return;
      }

      res.json({ ok: true, message, role: "assistant" as const });
    } catch (err) {
      console.error("[alfred-chat] error:", err);
      res.status(500).json({
        ok: false,
        message: "Alfred is temporarily unavailable. Please try again.",
      });
    }
  });

  return router;
}
