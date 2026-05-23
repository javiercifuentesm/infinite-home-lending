import Anthropic from "@anthropic-ai/sdk";

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

export type CachedBrief = {
  headline: string;
  theBrief: string;
  whyItMatters: string;
  theMove: string;
  generatedAt: string;
};

const briefCache = new Map<string, CachedBrief>();
let lastSchedulerRun = "";
let schedulerRunning = false;

function parseBrief(text: string): CachedBrief | null {
  if (text.includes("BRIEF_UNAVAILABLE")) return null;

  const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parse = (label: string, next: string) => {
    const regex = new RegExp(`${esc(label)}:\\s*([\\s\\S]*?)(?=${esc(next)}:|$)`, "m");
    const match = text.match(regex);
    return match ? match[1].trim() : "";
  };

  const headline = parse("HEADLINE", "THE BRIEF");
  const theBrief = parse("THE BRIEF", "WHY IT MATTERS");
  const whyItMatters = parse("WHY IT MATTERS", "THE MOVE");
  const theMove = parse("THE MOVE", "VOICE RULES");

  if (!headline || !theBrief || !whyItMatters || !theMove) return null;

  return {
    headline,
    theBrief,
    whyItMatters,
    theMove,
    generatedAt: new Date().toISOString(),
  };
}

async function fetchArticleContent(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; IHL-IntelBot/1.0)" },
      signal: AbortSignal.timeout(8000),
    });
    const html = await res.text();
    return html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 4000);
  } catch {
    return "";
  }
}

async function generateBrief(item: {
  id: string;
  title: string;
  url: string;
  source: string;
  tag: { label: string };
}): Promise<CachedBrief | null> {
  try {
    const articleContent = await fetchArticleContent(item.url);
    const hasContent = articleContent.length > 100;
    const userPrompt = `Write an Intelligence Brief for this article.

Title: ${item.title}
Source: ${item.source}
Tag: ${item.tag.label}
${hasContent ? `Article content: ${articleContent}` : `Note: Full article not available. Write the brief based on the headline and your knowledge of this topic. Do NOT return BRIEF_UNAVAILABLE — always generate a brief from the title.`}

Follow the exact format specified. Be precise, agent-focused, and MD/DC/VA grounded.`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 600,
      system: BRIEF_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = response.content[0]?.type === "text" ? response.content[0].text : "";
    return parseBrief(text);
  } catch (err) {
    console.error(`[brief-cache] Failed to generate brief for ${item.id}:`, err);
    return null;
  }
}

export function getCachedBrief(itemId: string): CachedBrief | null {
  return briefCache.get(itemId) ?? null;
}

export function getCacheStats(): { size: number; lastRun: string; running: boolean } {
  return { size: briefCache.size, lastRun: lastSchedulerRun, running: schedulerRunning };
}

export async function runBriefScheduler(
  items: Array<{
    id: string;
    title: string;
    url: string;
    source: string;
    tag: { label: string };
  }>,
): Promise<void> {
  if (schedulerRunning) {
    console.log("[brief-cache] Scheduler already running, skipping");
    return;
  }

  schedulerRunning = true;
  lastSchedulerRun = new Date().toISOString();
  console.log(`[brief-cache] Starting brief generation for ${items.length} items`);

  for (const item of items) {
    const existing = briefCache.get(item.id);
    if (existing) {
      const age = Date.now() - new Date(existing.generatedAt).getTime();
      if (age < 6 * 60 * 60 * 1000) {
        console.log(`[brief-cache] Skipping ${item.id} — cached ${Math.round(age / 60000)}min ago`);
        continue;
      }
    }

    const brief = await generateBrief(item);
    if (brief) {
      briefCache.set(item.id, brief);
      console.log(`[brief-cache] ✅ Cached brief for: ${item.title.slice(0, 50)}`);
    } else {
      console.log(`[brief-cache] ⚠️ Brief unavailable for: ${item.title.slice(0, 50)}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  schedulerRunning = false;
  console.log(`[brief-cache] Scheduler complete. Cache size: ${briefCache.size}`);
}
