import { Router } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { fetchHudRss } from "./intelligenceLoopRoute";

export type GuidelineAgency =
  | "Fannie Mae"
  | "Freddie Mac"
  | "FHA"
  | "VA"
  | "USDA"
  | "CFPB";

export type GuidelineItem = {
  id: string;
  agency: GuidelineAgency;
  agencyColor: string;
  title: string;
  url: string;
  publishedAt: string;
  isNew: boolean;
};

type GuidelineAnalysis = {
  summary: string;
  previousGuideline?: string;
  newGuideline?: string;
  impact: "high" | "medium" | "low";
  pros: string[];
  cons: string[];
  maAction: string;
  affectedLoans?: string[];
  effectiveDate?: string;
};

const AGENCY_COLORS: Record<GuidelineAgency, string> = {
  "Fannie Mae": "#0B2A4A",
  "Freddie Mac": "#0B2A4A",
  FHA: "#16a34a",
  VA: "#dc2626",
  USDA: "#15803d",
  CFPB: "#2563eb",
};

const UPDATES_CACHE_TTL_MS = 2 * 60 * 60 * 1000;
const ANALYSIS_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

let updatesCache: { items: GuidelineItem[]; fetchedAt: string; cachedAt: number } | null = null;
const analysisCache = new Map<string, { analysis: GuidelineAnalysis; cachedAt: number }>();

const anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? "" });

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function parsePublishedDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const parsed = new Date(dateStr);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isNewItem(publishedAt: string): boolean {
  const parsed = parsePublishedDate(publishedAt);
  if (!parsed) return false;
  return Date.now() - parsed.getTime() < 7 * 24 * 60 * 60 * 1000;
}

function toGuidelineItem(
  agency: GuidelineAgency,
  title: string,
  url: string,
  publishedAt: string,
  index: number,
): GuidelineItem {
  const cleanTitle = decodeHtmlEntities(title);
  return {
    id: `${slugify(agency)}-${slugify(cleanTitle)}-${index}`,
    agency,
    agencyColor: AGENCY_COLORS[agency],
    title: cleanTitle,
    url,
    publishedAt,
    isNew: isNewItem(publishedAt),
  };
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; IHL-GuidelinesBot/1.0)" },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function parseRssItems(xml: string, limit = 3): Array<{ title: string; url: string; publishedAt: string }> {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
    .slice(0, limit)
    .map((match) => {
      const itemXml = match[1];
      const titleRaw = itemXml.match(/<title>(.*?)<\/title>/)?.[1] ?? "Update";
      const title = titleRaw.replace(/<!\[CDATA\[(.*?)\]\]>/s, "$1").trim();
      const link = itemXml.match(/<link>(.*?)<\/link>/)?.[1]?.trim() ?? "#";
      const pubDate = itemXml.match(/<pubDate>(.*?)<\/pubDate>/)?.[1]?.trim() ?? "";
      return { title, url: link, publishedAt: pubDate };
    });
}

function absolutizeUrl(base: string, href: string): string {
  if (href.startsWith("http")) return href;
  if (href.startsWith("//")) return `https:${href}`;
  try {
    return new URL(href, base).toString();
  } catch {
    return href;
  }
}

function extractHtmlLinks(
  html: string,
  baseUrl: string,
  limit = 3,
  filter?: (href: string, title: string) => boolean,
): Array<{ title: string; url: string; publishedAt: string }> {
  const results: Array<{ title: string; url: string; publishedAt: string }> = [];
  const seen = new Set<string>();

  for (const match of html.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)) {
    const href = match[1]?.trim();
    const rawTitle = decodeHtmlEntities(match[2] ?? "");
    if (!href || !rawTitle || rawTitle.length < 12) continue;
    if (filter && !filter(href, rawTitle)) continue;

    const url = absolutizeUrl(baseUrl, href);
    if (seen.has(url)) continue;
    seen.add(url);

    const nearby = html.slice(Math.max(0, match.index! - 200), (match.index ?? 0) + 400);
    const dateMatch =
      nearby.match(/datetime="([^"]+)"/)?.[1] ??
      nearby.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})/)?.[1] ??
      nearby.match(/([A-Za-z]+ \d{1,2}, \d{4})/)?.[1] ??
      "";

    results.push({ title: rawTitle, url, publishedAt: dateMatch });
    if (results.length >= limit) break;
  }

  return results;
}

async function fetchFannieMaeUpdates(): Promise<GuidelineItem[]> {
  try {
    const html = await fetchHtml("https://www.fanniemae.com/news-announcements");
    const items = extractHtmlLinks(
      html,
      "https://www.fanniemae.com",
      3,
      (href, title) =>
        /news|announcement|selling|guide|update|bulletin/i.test(href) &&
        !/mailto:|javascript:/i.test(href) &&
        title.length > 15,
    );
    return items.map((item, index) =>
      toGuidelineItem("Fannie Mae", item.title, item.url, item.publishedAt, index),
    );
  } catch {
    return [];
  }
}

async function fetchFreddieMacUpdates(): Promise<GuidelineItem[]> {
  try {
    const html = await fetchHtml(
      "https://sf.freddiemac.com/tools-learning/guide-bulletins/home",
    );
    const items = extractHtmlLinks(
      html,
      "https://sf.freddiemac.com",
      3,
      (href, title) =>
        /guide|bulletin|announcement|selling|update/i.test(href) &&
        !/mailto:|javascript:/i.test(href) &&
        title.length > 12,
    );
    return items.map((item, index) =>
      toGuidelineItem("Freddie Mac", item.title, item.url, item.publishedAt, index),
    );
  } catch {
    return [];
  }
}

async function fetchFhaUpdates(): Promise<GuidelineItem[]> {
  try {
    const hudItems = await fetchHudRss();
    return hudItems.slice(0, 3).map((item, index) =>
      toGuidelineItem("FHA", item.title, item.url, item.publishedAt, index),
    );
  } catch {
    return [];
  }
}

async function fetchVaUpdates(): Promise<GuidelineItem[]> {
  try {
    const html = await fetchHtml("https://www.benefits.va.gov/homeloans/lenders.asp");
    const items = extractHtmlLinks(
      html,
      "https://www.benefits.va.gov",
      3,
      (href, title) =>
        /circular|notice|announcement|loan|lender|handbook|update/i.test(`${href} ${title}`) &&
        !/mailto:|javascript:/i.test(href) &&
        title.length > 10,
    );
    return items.map((item, index) =>
      toGuidelineItem("VA", item.title, item.url, item.publishedAt, index),
    );
  } catch {
    return [];
  }
}

async function fetchCfpbUpdates(): Promise<GuidelineItem[]> {
  try {
    const res = await fetch("https://www.consumerfinance.gov/about-us/newsroom/feed/", {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; IHL-GuidelinesBot/1.0)" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const items = parseRssItems(xml, 3).filter((item) =>
      /mortgage|loan|lending|housing|servic|borrower|credit/i.test(item.title),
    );
    const fallbackItems = items.length > 0 ? items : parseRssItems(xml, 3);
    return fallbackItems.map((item, index) =>
      toGuidelineItem("CFPB", item.title, item.url, item.publishedAt, index),
    );
  } catch {
    return [];
  }
}

async function fetchAllGuidelineUpdates(): Promise<GuidelineItem[]> {
  const [fannie, freddie, fha, va, cfpb] = await Promise.allSettled([
    fetchFannieMaeUpdates(),
    fetchFreddieMacUpdates(),
    fetchFhaUpdates(),
    fetchVaUpdates(),
    fetchCfpbUpdates(),
  ]);

  const items = [
    ...(fannie.status === "fulfilled" ? fannie.value : []),
    ...(freddie.status === "fulfilled" ? freddie.value : []),
    ...(fha.status === "fulfilled" ? fha.value : []),
    ...(va.status === "fulfilled" ? va.value : []),
    ...(cfpb.status === "fulfilled" ? cfpb.value : []),
  ];

  return items.sort((a, b) => {
    const aTime = parsePublishedDate(a.publishedAt)?.getTime() ?? 0;
    const bTime = parsePublishedDate(b.publishedAt)?.getTime() ?? 0;
    return bTime - aTime;
  });
}

function stripJsonFence(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function parseAnalysis(rawText: string): GuidelineAnalysis {
  const cleaned = stripJsonFence(rawText);
  try {
    const parsed = JSON.parse(cleaned) as GuidelineAnalysis;
    return {
      summary: parsed.summary ?? rawText,
      previousGuideline: parsed.previousGuideline,
      newGuideline: parsed.newGuideline,
      impact: parsed.impact ?? "medium",
      pros: Array.isArray(parsed.pros) ? parsed.pros : [],
      cons: Array.isArray(parsed.cons) ? parsed.cons : [],
      maAction: parsed.maAction ?? "",
      affectedLoans: Array.isArray(parsed.affectedLoans) ? parsed.affectedLoans : [],
      effectiveDate: parsed.effectiveDate,
    };
  } catch {
    return {
      summary: rawText,
      pros: [],
      cons: [],
      maAction: "",
      impact: "medium",
    };
  }
}

export function createGuidelinesIntelRouter() {
  const router = Router();

  router.get("/guidelines-updates", async (_req, res) => {
    const now = Date.now();
    if (updatesCache && now - updatesCache.cachedAt < UPDATES_CACHE_TTL_MS) {
      res.json({ ok: true, items: updatesCache.items, fetchedAt: updatesCache.fetchedAt });
      return;
    }

    try {
      const items = await fetchAllGuidelineUpdates();
      const fetchedAt = new Date().toISOString();
      updatesCache = { items, fetchedAt, cachedAt: now };
      res.json({ ok: true, items, fetchedAt });
    } catch (err) {
      console.error("[guidelines-updates] failed:", err);
      res.status(500).json({ ok: false, items: [], error: String(err) });
    }
  });

  router.post("/guidelines-analyze", async (req, res) => {
    try {
      const { title, url, agency } = req.body as {
        title?: string;
        url?: string;
        agency?: string;
      };

      if (!title || !url || !agency) {
        res.status(400).json({ ok: false, error: "title, url, and agency are required" });
        return;
      }

      const cacheKey = title.trim();
      const cached = analysisCache.get(cacheKey);
      if (cached && Date.now() - cached.cachedAt < ANALYSIS_CACHE_TTL_MS) {
        res.json({ ok: true, analysis: cached.analysis });
        return;
      }

      const apiKey = process.env.ANTHROPIC_API_KEY ?? "";
      if (!apiKey) {
        res.status(500).json({ ok: false, error: "ANTHROPIC_API_KEY not configured" });
        return;
      }

      const userPrompt = `Analyze this mortgage guideline update for our Mortgage Advisors:
Agency: ${agency}
Title: ${title}
URL: ${url}

Provide your analysis in this EXACT JSON format (no markdown, no backticks, raw JSON only):
{
  "summary": "2-3 sentence plain English summary of what changed",
  "previousGuideline": "What the old guideline was (if inferable from title, otherwise state 'Review source document for prior guideline')",
  "newGuideline": "What the new guideline is based on the title",
  "impact": "high" | "medium" | "low",
  "pros": ["pro 1", "pro 2", "pro 3"],
  "cons": ["con 1", "con 2"],
  "maAction": "Specific action the MA should take today based on this update",
  "affectedLoans": ["loan type 1", "loan type 2"],
  "effectiveDate": "If mentioned in title, otherwise 'See source document'"
}`;

      const response = await anthropicClient.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1200,
        system:
          "You are Alfred, an expert mortgage compliance analyst for Infinite Home Lending, a DMV-area mortgage brokerage. You analyze mortgage guideline updates and explain them clearly to Mortgage Advisors. Be specific, practical, and actionable. Always cite the agency and update type.",
        messages: [{ role: "user", content: userPrompt }],
      });

      const rawText =
        response.content[0]?.type === "text" ? response.content[0].text.trim() : "";
      const analysis = parseAnalysis(rawText);

      analysisCache.set(cacheKey, { analysis, cachedAt: Date.now() });
      res.json({ ok: true, analysis });
    } catch (err) {
      console.error("[guidelines-analyze] failed:", err);
      res.status(500).json({ ok: false, error: "Analysis failed" });
    }
  });

  return router;
}
