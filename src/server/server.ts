import "./loadEnv";
import cors from "cors";
import express from "express";
import { createAgentV3Router } from "./agent-v3/agentV3Route";
import { createAnalyticsRouter } from "./analyticsRoute";
import { createUploadUrlRouter } from "./uploadUrlRoute";
import { createMortgageConciergeSendLeadRouter } from "./mortgageConciergeSendLeadRoute";
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

app.use("/api/agent-v3", createAgentV3Router());
app.use("/api", createUploadUrlRouter());
app.use("/api", createMortgageConciergeSendLeadRouter());
app.use("/api", createSubmitLeadRouter());
app.use("/api", createAnalyticsRouter());
app.use("/api", createIntelligenceLoopRouter());
app.use("/api", createIntelligenceBriefRouter());
app.use("/api", createSarahChatRouter());
app.use("/api", createNexioChatRouter());

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
