import "./loadEnv";
import cors from "cors";
import express from "express";
import { createAgentV3Router } from "./agent-v3/agentV3Route";
import { createAnalyticsRouter } from "./analyticsRoute";
import { createUploadUrlRouter } from "./uploadUrlRoute";
import { createMortgageConciergeSendLeadRouter } from "./mortgageConciergeSendLeadRoute";
import { createAssignLeadRouter } from "./assignLeadRoute";
import { createSubmitLeadRouter } from "./submitLeadRoute";
import {
  createIntelligenceLoopRouter,
  fetchFredRate,
  fetchGoogleNewsRss,
  fetchHudRss,
} from "./intelligenceLoopRoute";
import { createIntelligenceBriefRouter } from "./intelligenceBriefRoute";
import { runBriefScheduler } from "./intelligenceBriefCache";
import { createSarahChatRouter } from "./sarahChatRoute";
import { createNexioChatRouter } from "./nexioChatRoute";
import { createGuidelinesIntelRouter } from "./guidelinesIntelRoute";
import { createAlfredChatRouter } from "./alfredChatRoute";
import { createIncomeAnalyzerRouter } from "./incomeAnalyzerRoute";
import { createCareersContactRouter } from "./careersContactRoute";
import { createSarahCareersRouter } from "./sarahCareersRoute";
import { createSarahCareersDiscoveryRouter } from "./sarahCareersDiscoveryRoute";
import Anthropic from "@anthropic-ai/sdk";

const anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? "" });

let marketBriefCache: { brief: string; generatedAt: string; cachedAt: number } | null = null;
const MARKET_BRIEF_TTL_MS = 6 * 60 * 60 * 1000;

const ALFRED_CURRENT_MODEL = "claude-sonnet-4-6";
const KNOWN_LATEST_MODELS = ["claude-sonnet-4-6", "claude-opus-4-6"];

type AlfredHealthPayload = {
  ok: true;
  currentModel: string;
  isLatest: boolean;
  latestAvailable: string;
  checkedAt: string;
  updateAvailable?: boolean;
  message?: string;
};

type AlfredHealthFallback = { ok: true; isLatest: true };

let alfredHealthCache: { payload: AlfredHealthPayload; cachedAt: number } | null = null;
const ALFRED_HEALTH_TTL_MS = 24 * 60 * 60 * 1000;

function extractModelDate(modelId: string): number | null {
  const match = modelId.match(/-(\d{8})$/);
  return match ? Number.parseInt(match[1], 10) : null;
}

function getModelFamily(modelId: string): "sonnet" | "opus" | null {
  if (modelId.includes("claude-sonnet")) return "sonnet";
  if (modelId.includes("claude-opus")) return "opus";
  return null;
}

function parseAliasVersion(modelId: string): number | null {
  const match = modelId.match(/claude-(?:sonnet|opus)-(\d+)-(\d+)$/);
  if (!match) return null;
  return Number.parseInt(match[1], 10) * 100 + Number.parseInt(match[2], 10);
}

function isModelNewer(candidate: string, current: string): boolean {
  const candidateDate = extractModelDate(candidate);
  const currentDate = extractModelDate(current);

  if (candidateDate != null && currentDate != null) {
    return candidateDate > currentDate;
  }

  const candidateAlias = parseAliasVersion(candidate);
  const currentAlias = parseAliasVersion(current);
  if (candidateAlias != null && currentAlias != null) {
    return candidateAlias > currentAlias;
  }

  if (candidateDate != null && currentDate == null) {
    if (KNOWN_LATEST_MODELS.includes(current)) return false;
    return true;
  }
  if (candidateDate == null && currentDate != null) {
    if (KNOWN_LATEST_MODELS.includes(candidate)) return false;
    return false;
  }

  if (
    candidate !== current &&
    KNOWN_LATEST_MODELS.includes(current) &&
    !KNOWN_LATEST_MODELS.includes(candidate)
  ) {
    // Dated snapshot IDs from the models API (e.g. claude-sonnet-4-20250514) are not semver upgrades
    if (extractModelDate(candidate) != null) return false;
    return parseAliasVersion(candidate) != null;
  }

  return false;
}

function pickLatestModel(models: string[], family: "sonnet" | "opus"): string {
  const familyModels = models.filter((id) => getModelFamily(id) === family);
  const candidates = [
    ...familyModels,
    ...KNOWN_LATEST_MODELS.filter((id) => getModelFamily(id) === family),
  ];

  if (candidates.length === 0) {
    return ALFRED_CURRENT_MODEL;
  }

  return candidates.reduce((latest, candidate) =>
    isModelNewer(candidate, latest) ? candidate : latest,
  );
}

async function buildAlfredHealthPayload(): Promise<AlfredHealthPayload | AlfredHealthFallback> {
  const checkedAt = new Date().toISOString();
  const fallback: AlfredHealthPayload = {
    ok: true,
    currentModel: ALFRED_CURRENT_MODEL,
    isLatest: true,
    latestAvailable: ALFRED_CURRENT_MODEL,
    checkedAt,
  };

  const apiKey = process.env.ANTHROPIC_API_KEY ?? "";
  if (!apiKey) {
    return { ok: true, isLatest: true };
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/models", {
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
    });

    if (!response.ok) {
      return { ok: true, isLatest: true };
    }

    const data = (await response.json()) as { data?: { id: string }[] };
    const modelIds = (data.data ?? []).map((entry) => entry.id);
    const relevantModels = modelIds.filter(
      (id) => id.includes("claude-sonnet") || id.includes("claude-opus"),
    );

    const alfredFamily = getModelFamily(ALFRED_CURRENT_MODEL) ?? "sonnet";
    const latestAvailable = pickLatestModel(relevantModels, alfredFamily);
    const isLatest =
      latestAvailable === ALFRED_CURRENT_MODEL ||
      !isModelNewer(latestAvailable, ALFRED_CURRENT_MODEL);

    const payload: AlfredHealthPayload = {
      ok: true,
      currentModel: ALFRED_CURRENT_MODEL,
      isLatest,
      latestAvailable,
      checkedAt,
    };

    if (!isLatest) {
      payload.updateAvailable = true;
      payload.message = `Alfred update available — ${latestAvailable} is now available`;
    }

    return payload;
  } catch (err) {
    console.error("[alfred-health] check failed:", err);
    return { ok: true, isLatest: true };
  }
}

console.log("ENV CHECK:", {
  RESEND_API_KEY: process.env.RESEND_API_KEY ? "✅ PRESENT" : "❌ MISSING",
  LEAD_ADVISOR_EMAIL: process.env.LEAD_ADVISOR_EMAIL,
});

const app = express();

const corsOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://www.infinitehomelending.com",
  "https://infinitehomelending.com",
  "https://infinite-home-lending.vercel.app",
  "https://infinite-home-lending-ei3kbs2yb-javiers-projects-9f9861ed.vercel.app",
  ...(process.env.CORS_ORIGINS?.split(",")
    .map((o) => o.trim())
    .filter(Boolean) ?? []),
];
app.use(
  cors({
    origin: corsOrigins,
  }),
);
app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true, service: "ihl-api" });
});
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/agent-v3", createAgentV3Router());
app.use("/api", createUploadUrlRouter());
app.use("/api", createMortgageConciergeSendLeadRouter());
app.use("/api", createAssignLeadRouter());
app.use("/api", createSubmitLeadRouter());
app.use("/api", createAnalyticsRouter());
app.use("/api", createIntelligenceLoopRouter());
app.use("/api", createIntelligenceBriefRouter());
app.use("/api", createSarahChatRouter());
app.use("/api", createNexioChatRouter());
app.use("/api", createGuidelinesIntelRouter());
app.use("/api", createAlfredChatRouter());
app.use("/api", createIncomeAnalyzerRouter());
app.use("/api", createCareersContactRouter());
app.use("/api", createSarahCareersRouter());
app.use("/api", createSarahCareersDiscoveryRouter());

app.get("/api/fred-rate", async (req, res) => {
  const series =
    typeof req.query.series === "string" && req.query.series.trim()
      ? req.query.series.trim()
      : "MORTGAGE30US";
  const FRED_API_KEY = process.env.FRED_API_KEY ?? "";
  if (!FRED_API_KEY) {
    res.status(500).json({ ok: false, error: "FRED_API_KEY not configured" });
    return;
  }

  try {
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${encodeURIComponent(series)}&api_key=${encodeURIComponent(FRED_API_KEY)}&sort_order=desc&limit=2&file_type=json`;
    const fredRes = await fetch(url);
    if (!fredRes.ok) {
      res.status(502).json({ ok: false, error: "FRED API request failed" });
      return;
    }

    const data = (await fredRes.json()) as {
      observations?: { date: string; value: string }[];
    };
    const obs = (data.observations ?? []).filter((o) => o.value && o.value !== ".");
    if (obs.length < 1) {
      res.status(404).json({ ok: false, error: "No rate observations found" });
      return;
    }

    const rate = obs[0].value;
    const prev = obs[1]?.value ?? rate;
    res.json({ ok: true, rate, prev });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

app.get("/api/ma-market-brief", async (_req, res) => {
  const now = Date.now();
  if (marketBriefCache && now - marketBriefCache.cachedAt < MARKET_BRIEF_TTL_MS) {
    res.json({
      ok: true,
      brief: marketBriefCache.brief,
      generatedAt: marketBriefCache.generatedAt,
    });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY ?? "";
  if (!apiKey) {
    res.status(500).json({ ok: false, error: "ANTHROPIC_API_KEY not configured" });
    return;
  }

  try {
    const now2 = new Date();
    const today = now2.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const isWeekend = now2.getDay() === 0 || now2.getDay() === 6;
    const dayContext = isWeekend
      ? `Today is ${today} — a weekend. Bond markets and most lenders are closed. Focus on preparation for the upcoming week.`
      : `Today is ${today} — a business day. Bond markets are open.`;
    const response = await anthropicClient.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      system:
        "You are a senior mortgage market analyst writing a daily brief for mortgage advisors in the DMV market (MD, VA, DC). Be direct, actionable, and specific. No fluff. Always be accurate about the current day of week and whether markets are open or closed.",
      messages: [
        {
          role: "user",
          content: `${dayContext}\n\nWrite a 3-paragraph daily market brief. Cover: 1) Current mortgage rate environment and what's driving it, 2) What this means for buyers and sellers in the DMV market right now, 3) One specific talking point MAs should use with clients this week. Keep each paragraph to 2-3 sentences. Be specific with numbers when possible. Do NOT reference any holidays unless today is actually a federal holiday.`,
        },
      ],
    });

    const brief =
      response.content[0]?.type === "text" ? response.content[0].text.trim() : "";
    if (!brief) {
      res.status(500).json({ ok: false, error: "Empty brief response" });
      return;
    }

    const generatedAt = new Date().toISOString();
    marketBriefCache = { brief, generatedAt, cachedAt: now };
    res.json({ ok: true, brief, generatedAt });
  } catch (err) {
    console.error("[ma-market-brief] generation failed:", err);
    res.status(500).json({ ok: false, error: "Brief generation failed" });
  }
});

app.get("/api/alfred-health", async (_req, res) => {
  const now = Date.now();
  if (alfredHealthCache && now - alfredHealthCache.cachedAt < ALFRED_HEALTH_TTL_MS) {
    res.json(alfredHealthCache.payload);
    return;
  }

  const payload = await buildAlfredHealthPayload();
  if ("checkedAt" in payload) {
    alfredHealthCache = { payload, cachedAt: now };
  }
  res.json(payload);
});

const port = Number(process.env.PORT ?? process.env.AGENT_V3_SERVER_PORT ?? 8787);

const SCHEDULER_INTERVAL_MS = 6 * 60 * 60 * 1000;

async function fetchAllLoopItems() {
  const [fred, localNews, rateNews, hud] = await Promise.allSettled([
    fetchFredRate(),
    fetchGoogleNewsRss(
      "https://news.google.com/rss/search?q=real+estate+Maryland+Virginia+DC+mortgage&hl=en-US&gl=US&ceid=US:en",
      "Google News · DMV Real Estate",
    ),
    fetchGoogleNewsRss(
      "https://news.google.com/rss/search?q=mortgage+rates+federal+reserve+housing+market&hl=en-US&gl=US&ceid=US:en",
      "Google News · Mortgage Rates",
    ),
    fetchHudRss(),
  ]);
  return [
    ...(fred.status === "fulfilled" ? fred.value : []),
    ...(hud.status === "fulfilled" ? hud.value : []),
    ...(localNews.status === "fulfilled" ? localNews.value : []),
    ...(rateNews.status === "fulfilled" ? rateNews.value : []),
  ];
}

async function startBriefScheduler() {
  console.log("[brief-scheduler] Starting initial brief generation run...");
  try {
    const items = await fetchAllLoopItems();
    await runBriefScheduler(items);
  } catch (err) {
    console.error("[brief-scheduler] Initial run failed:", err);
  }

  setInterval(async () => {
    console.log("[brief-scheduler] Running scheduled brief generation...");
    try {
      const items = await fetchAllLoopItems();
      await runBriefScheduler(items);
    } catch (err) {
      console.error("[brief-scheduler] Scheduled run failed:", err);
    }
  }, SCHEDULER_INTERVAL_MS);
}

app.listen(port, "0.0.0.0", () => {
  console.info(
    `[api] listening on 0.0.0.0:${port}/api (agent-v3, upload-url, send-lead, submit-lead, analytics, intelligence-loop) | health GET /api/health`,
  );
});

setTimeout(startBriefScheduler, 30000);
