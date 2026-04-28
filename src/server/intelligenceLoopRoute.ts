import { Router } from "express";

const FRED_API_KEY = process.env.FRED_API_KEY ?? "";

function nexioTag(title: string): { emoji: string; label: string } {
  const t = title.toLowerCase();
  if (
    t.includes("fha") ||
    t.includes("hud") ||
    t.includes("policy") ||
    t.includes("regulation") ||
    t.includes("compliance") ||
    t.includes("rule")
  ) {
    return { emoji: "🔴", label: "Compliance Alert" };
  }
  if (
    t.includes("rate") ||
    t.includes("fed") ||
    t.includes("inflation") ||
    t.includes("treasury") ||
    t.includes("mortgage rate")
  ) {
    return { emoji: "📊", label: "Market Signal" };
  }
  if (
    t.includes("maryland") ||
    t.includes("virginia") ||
    t.includes("dc") ||
    t.includes("dmv") ||
    t.includes("montgomery") ||
    t.includes("fairfax") ||
    t.includes("arlington") ||
    t.includes("prince george")
  ) {
    return { emoji: "🏠", label: "Local Intel" };
  }
  if (
    t.includes("negotiat") ||
    t.includes("inventory") ||
    t.includes("seller") ||
    t.includes("buyer") ||
    t.includes("offer") ||
    t.includes("days on market")
  ) {
    return { emoji: "🟢", label: "Negotiation Leverage" };
  }
  return { emoji: "📊", label: "Market Signal" };
}

async function fetchFredRate(): Promise<
  Array<{
    id: string;
    source: string;
    title: string;
    summary: string;
    url: string;
    publishedAt: string;
    tag: { emoji: string; label: string };
  }>
> {
  try {
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=MORTGAGE30US&api_key=${FRED_API_KEY}&sort_order=desc&limit=2&file_type=json`;
    const res = await fetch(url);
    const data = (await res.json()) as { observations?: { date: string; value: string }[] };
    const obs = data.observations ?? [];
    if (obs.length < 1) return [];
    const latest = obs[0];
    const prev = obs[1];
    const rate = parseFloat(latest.value);
    const prevRate = prev ? parseFloat(prev.value) : null;
    const delta = prevRate != null ? (rate - prevRate).toFixed(2) : null;
    const direction = delta ? (parseFloat(delta) > 0 ? "▲" : "▼") : "";
    const item = {
      id: "fred-mortgage30",
      source: "FRED · St. Louis Fed",
      title: `30-Year Fixed Mortgage Rate: ${rate}% ${direction}${delta ? Math.abs(parseFloat(delta)) : ""}`,
      summary: `Current national average per Freddie Mac's weekly survey. ${prevRate != null ? `Previous week: ${prevRate}%.` : ""} Use this to frame rate conversations with buyers and sellers.`,
      url: "https://fred.stlouisfed.org/series/MORTGAGE30US",
      publishedAt: latest.date,
    };
    return [{ ...item, tag: nexioTag(item.title) }];
  } catch {
    return [];
  }
}

async function fetchGoogleNewsRss(feedUrl: string, sourceLabel: string): Promise<
  Array<{
    id: string;
    source: string;
    title: string;
    summary: string;
    url: string;
    publishedAt: string;
    tag: { emoji: string; label: string };
  }>
> {
  try {
    const res = await fetch(feedUrl);
    const text = await res.text();
    const items = [...text.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 4);
    return items.map((match, i) => {
      const xml = match[1];
      const titleRaw = xml.match(/<title>(.*?)<\/title>/)?.[1] ?? "News Update";
      const title = titleRaw.replace(/<!\[CDATA\[(.*?)\]\]>/s, "$1");
      const link = xml.match(/<link>(.*?)<\/link>/)?.[1] ?? "#";
      const pubDate = xml.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] ?? "";
      const descRaw = xml.match(/<description>(.*?)<\/description>/)?.[1] ?? "";
      const desc = descRaw
        .replace(/<!\[CDATA\[(.*?)\]\]>/s, "$1")
        .replace(/<[^>]+>/g, "")
        .slice(0, 200);
      const item = {
        id: `${sourceLabel}-${i}`,
        source: sourceLabel,
        title: title.trim(),
        summary: desc.trim(),
        url: link.trim(),
        publishedAt: pubDate,
      };
      return { ...item, tag: nexioTag(item.title) };
    });
  } catch {
    return [];
  }
}

async function fetchHudRss(): Promise<
  Array<{
    id: string;
    source: string;
    title: string;
    summary: string;
    url: string;
    publishedAt: string;
    tag: { emoji: string; label: string };
  }>
> {
  try {
    const res = await fetch("https://www.hud.gov/rss/news_feeds/press_releases_rss.xml");
    const text = await res.text();
    const items = [...text.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 3);
    return items.map((match, i) => {
      const xml = match[1];
      const title =
        xml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] ??
        xml.match(/<title>(.*?)<\/title>/)?.[1] ??
        "HUD Update";
      const link = xml.match(/<link>(.*?)<\/link>/)?.[1] ?? "https://www.hud.gov";
      const pubDate = xml.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] ?? "";
      const descRaw =
        xml.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] ??
        xml.match(/<description>(.*?)<\/description>/)?.[1] ??
        "";
      const item = {
        id: `hud-${i}`,
        source: "HUD · Press Release",
        title: title.trim(),
        summary: descRaw.replace(/<[^>]+>/g, "").slice(0, 200).trim(),
        url: link.trim(),
        publishedAt: pubDate,
      };
      return { ...item, tag: nexioTag(item.title) };
    });
  } catch {
    return [];
  }
}

export function createIntelligenceLoopRouter() {
  const router = Router();

  router.get("/intelligence-loop", async (_req, res) => {
    try {
      const [fredItems, localNewsItems, rateNewsItems, hudItems] = await Promise.allSettled([
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

      const all = [
        ...(fredItems.status === "fulfilled" ? fredItems.value : []),
        ...(hudItems.status === "fulfilled" ? hudItems.value : []),
        ...(localNewsItems.status === "fulfilled" ? localNewsItems.value : []),
        ...(rateNewsItems.status === "fulfilled" ? rateNewsItems.value : []),
      ];

      res.json({ ok: true, items: all, fetchedAt: new Date().toISOString() });
    } catch (err) {
      res.status(500).json({ ok: false, items: [], error: String(err) });
    }
  });

  return router;
}
