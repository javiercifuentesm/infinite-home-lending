import "./loadEnv";
import cors from "cors";
import express from "express";
import { createAgentV3Router } from "./agent-v3/agentV3Route";
import { createAnalyticsRouter } from "./analyticsRoute";
import { createUploadUrlRouter } from "./uploadUrlRoute";
import { createMortgageConciergeSendLeadRouter } from "./mortgageConciergeSendLeadRoute";
import { createSubmitLeadRouter } from "./submitLeadRoute";
import { createIntelligenceLoopRouter } from "./intelligenceLoopRoute";

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

const port = Number(process.env.PORT ?? process.env.AGENT_V3_SERVER_PORT ?? 8787);
app.listen(port, "0.0.0.0", () => {
  console.info(
    `[api] listening on 0.0.0.0:${port}/api (agent-v3, upload-url, send-lead, submit-lead, analytics, intelligence-loop) | health GET /api/health`,
  );
});
