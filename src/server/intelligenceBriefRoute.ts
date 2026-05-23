import { Router } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { getCachedBrief, getCacheStats } from "./intelligenceBriefCache";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? "" });

const BRIEF_SYSTEM_PROMPT = `You are the IHL Intelligence Editor — the editorial voice behind Infinite Home Lending's Deal Desk Intelligence Loop. Your job is to write Intelligence Briefs for real estate agents in Maryland, DC, and Virginia.

You combine the best of three editorial standards:
- Bloomberg: Data precision. Every number must come from the article. Never invent statistics.
- Axios: Smart Brevity. Structured, scannable, "Why it matters" is mandatory.
- Morning Brew: Warm but sharp. Agent-friendly tone. The "so what" is always answered.

BRIEF FORMAT — always output exactly this structure, no more, no less:

HEADLINE: [Rewrite the headline in IHL voice — sharp, agent-focused, max 12 words]

THE BRIEF: [2-3 sentences. Facts only. What happened, who said it, what the number is. No fluff. No opinion.]

WHY IT MATTERS: [1 paragraph, 2-3 sentences. Agent-specific. Always grounded in MD/DC/VA context. What does this mean for listings, buyers, or deals in the DMV?]

THE MOVE: [Exactly one sentence. Specific. Tactical. What should the agent DO with this information right now?]

VOICE RULES:
- Precise — only use numbers that appear in the article
- Agent-first — always framed from the agent's perspective
- MD/DC/VA grounded — localize national news, amplify local news
- No hedging — state it clean
- No fluff — every sentence earns its place
- THE MOVE is always one sentence, never a list, never vague
- If the article cannot be fetched or has no real estate relevance, return: BRIEF_UNAVAILABLE`;

export function createIntelligenceBriefRouter() {
  const router = Router();

  router.get("/intelligence-brief-stats", (_req, res) => {
    res.json(getCacheStats());
  });

  router.get("/intelligence-brief/:id", (req, res) => {
    const id = decodeURIComponent(req.params.id);
    const cached = getCachedBrief(id);
    if (cached) {
      res.json({ ok: true, brief: cached, fromCache: true });
    } else {
      res.json({ ok: false, reason: "not-cached" });
    }
  });

  router.post("/intelligence-brief", async (req, res) => {
    try {
      const { url, title, source, tag } = req.body as {
        url: string;
        title: string;
        source: string;
        tag: string;
      };

      if (!url || !title) {
        res.status(400).json({ error: "url and title required" });
        return;
      }

      let articleContent = "";
      try {
        const articleRes = await fetch(url, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; IHL-IntelBot/1.0)" },
          signal: AbortSignal.timeout(8000),
        });
        const html = await articleRes.text();
        articleContent = html
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 4000);
      } catch {
        articleContent = `[Article could not be fetched. Use title only: ${title}]`;
      }

      const userPrompt = `Write an Intelligence Brief for this article.

Title: ${title}
Source: ${source ?? ""}
Tag: ${tag ?? ""}
Article content: ${articleContent}

Follow the exact format specified. Be precise, agent-focused, and MD/DC/VA grounded.`;

      const response = await client.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 600,
        system: BRIEF_SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
      });

      const text =
        response.content[0]?.type === "text" ? response.content[0].text : "";

      if (text.includes("BRIEF_UNAVAILABLE")) {
        res.json({ ok: false, reason: "unavailable" });
        return;
      }

      const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const parse = (label: string, next: string) => {
        const regex = new RegExp(
          `${esc(label)}:\\s*([\\s\\S]*?)(?=${esc(next)}:|$)`,
          "m",
        );
        const match = text.match(regex);
        return match ? match[1].trim() : "";
      };

      const brief = {
        headline: parse("HEADLINE", "THE BRIEF"),
        theBrief: parse("THE BRIEF", "WHY IT MATTERS"),
        whyItMatters: parse("WHY IT MATTERS", "THE MOVE"),
        theMove: parse("THE MOVE", "VOICE RULES"),
      };

      res.json({ ok: true, brief });
    } catch (err) {
      console.error("Intelligence brief error:", err);
      res.status(500).json({ ok: false, error: "Brief generation failed" });
    }
  });

  return router;
}
