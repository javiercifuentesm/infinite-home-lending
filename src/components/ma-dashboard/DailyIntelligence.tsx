import { useEffect, useMemo, useState } from "react";
import { apiUrl } from "../../lib/apiBase";

type RateSeriesConfig = {
  label: string;
  series: string;
  fallback?: string;
};

const RATE_SERIES: RateSeriesConfig[] = [
  { label: "30-Yr Fixed", series: "MORTGAGE30US" },
  { label: "15-Yr Fixed", series: "MORTGAGE15US" },
  { label: "FHA 30-Yr", series: "OBMMIFHA30YF" },
  { label: "VA 30-Yr", series: "OBMMIVAFIX30YFEE", fallback: "See lender" },
  { label: "Jumbo 30-Yr", series: "OBMMIC30YF", fallback: "See lender" },
  { label: "10-Yr Treasury", series: "DGS10" },
];

const FED_MEETING_START = new Date("2026-06-17T00:00:00");
const FOMC_CALENDAR_URL =
  "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm";

type RateCardState = RateSeriesConfig & {
  rate: string | null;
  prev: string | null;
  loading: boolean;
  usedFallback: boolean;
};

type FeedItem = {
  id: string;
  source: string;
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  tag: { emoji: string; label: string };
};

type FeedFilter =
  | "All"
  | "Market Signal"
  | "Local Intel"
  | "Compliance Alert"
  | "Negotiation Leverage";

const FEED_FILTERS: { id: FeedFilter; label: string }[] = [
  { id: "All", label: "All" },
  { id: "Market Signal", label: "📊 Market Signal" },
  { id: "Local Intel", label: "🏠 Local Intel" },
  { id: "Compliance Alert", label: "🔴 Compliance Alert" },
  { id: "Negotiation Leverage", label: "🟢 Negotiation Leverage" },
];

function formatRate(value: string | null, usedFallback: boolean, fallback?: string): string {
  if (usedFallback && fallback) return fallback;
  if (!value) return "—";
  const n = parseFloat(value);
  return Number.isFinite(n) ? `${n.toFixed(2)}%` : "—";
}

function formatDelta(rate: string | null, prev: string | null, usedFallback: boolean) {
  if (usedFallback || !rate || !prev) return null;
  const r = parseFloat(rate);
  const p = parseFloat(prev);
  if (!Number.isFinite(r) || !Number.isFinite(p)) return null;
  const delta = r - p;
  if (Math.abs(delta) < 0.005) {
    return { text: "Unchanged vs prior week", up: false, down: false };
  }
  const up = delta > 0;
  return {
    text: `${up ? "▲" : "▼"}${Math.abs(delta).toFixed(2)} vs prior week`,
    up,
    down: !up,
  };
}

function timeAgo(dateStr: string): string {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(h / 24);
    if (d > 0) return `${d}d ago`;
    if (h > 0) return `${h}h ago`;
    return "Just now";
  } catch {
    return "";
  }
}

function tagBadgeClasses(label: string): string {
  if (label === "Compliance Alert") return "bg-red-50 text-red-700 border-red-200";
  if (label === "Negotiation Leverage") return "bg-green-50 text-green-700 border-green-200";
  if (label === "Local Intel") return "bg-amber-50 text-amber-800 border-amber-200";
  return "bg-sky-50 text-sky-700 border-sky-200";
}

function daysUntilFedMeeting(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const meeting = new Date(FED_MEETING_START);
  meeting.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((meeting.getTime() - today.getTime()) / 86400000));
}

function splitBriefParagraphs(brief: string): string[] {
  return brief
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function ExternalLinkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function RateCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 animate-pulse">
      <div className="h-3 w-20 bg-slate-200 rounded mb-3" />
      <div className="h-8 w-24 bg-slate-200 rounded mb-2" />
      <div className="h-3 w-28 bg-slate-100 rounded" />
    </div>
  );
}

function FeedCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 animate-pulse space-y-3">
      <div className="h-5 w-32 bg-slate-200 rounded-full" />
      <div className="h-3 w-40 bg-slate-100 rounded" />
      <div className="h-4 w-full bg-slate-200 rounded" />
      <div className="h-3 w-full bg-slate-100 rounded" />
    </div>
  );
}

export function DailyIntelligence() {
  const [cards, setCards] = useState<RateCardState[]>(() =>
    RATE_SERIES.map((item) => ({
      ...item,
      rate: null,
      prev: null,
      loading: true,
      usedFallback: false,
    })),
  );
  const [brief, setBrief] = useState<string | null>(null);
  const [briefGeneratedAt, setBriefGeneratedAt] = useState<string | null>(null);
  const [briefLoading, setBriefLoading] = useState(true);
  const [briefError, setBriefError] = useState(false);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [feedError, setFeedError] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FeedFilter>("All");

  const fedDays = daysUntilFedMeeting();

  useEffect(() => {
    RATE_SERIES.forEach((item, index) => {
      fetch(apiUrl(`/api/fred-rate?series=${encodeURIComponent(item.series)}`))
        .then((res) => res.json())
        .then((data: { ok?: boolean; rate?: string; prev?: string }) => {
          setCards((prev) => {
            const next = [...prev];
            if (data.ok && data.rate) {
              next[index] = {
                ...next[index],
                rate: data.rate,
                prev: data.prev ?? data.rate,
                loading: false,
                usedFallback: false,
              };
            } else if (item.fallback) {
              next[index] = {
                ...next[index],
                rate: null,
                prev: null,
                loading: false,
                usedFallback: true,
              };
            } else {
              next[index] = { ...next[index], loading: false, usedFallback: false };
            }
            return next;
          });
        })
        .catch(() => {
          setCards((prev) => {
            const next = [...prev];
            next[index] = {
              ...next[index],
              loading: false,
              usedFallback: Boolean(item.fallback),
            };
            return next;
          });
        });
    });
  }, []);

  useEffect(() => {
    fetch(apiUrl("/api/ma-market-brief"))
      .then((res) => res.json())
      .then((data: { ok?: boolean; brief?: string; generatedAt?: string }) => {
        if (data.ok && data.brief) {
          setBrief(data.brief);
          setBriefGeneratedAt(data.generatedAt ?? null);
        } else {
          setBriefError(true);
        }
      })
      .catch(() => setBriefError(true))
      .finally(() => setBriefLoading(false));
  }, []);

  useEffect(() => {
    fetch(apiUrl("/api/intelligence-loop"))
      .then((res) => res.json())
      .then((data: { ok?: boolean; items?: FeedItem[] }) => {
        if (data.ok) {
          setFeedItems(data.items ?? []);
        } else {
          setFeedError(true);
        }
      })
      .catch(() => setFeedError(true))
      .finally(() => setFeedLoading(false));
  }, []);

  const filteredFeed = useMemo(() => {
    const items =
      activeFilter === "All"
        ? feedItems
        : feedItems.filter((item) => item.tag.label === activeFilter);
    return items.slice(0, 10);
  }, [feedItems, activeFilter]);

  const briefParagraphs = brief ? splitBriefParagraphs(brief) : [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Rate cards — 2 rows of 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card) =>
          card.loading ? (
            <RateCardSkeleton key={card.series} />
          ) : (
            <div key={card.series} className="bg-white rounded-2xl border border-slate-200/80 p-5">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-1">
                {card.label}
              </p>
              <p className="font-heading text-[28px] font-semibold text-[#0B2A4A]">
                {formatRate(card.rate, card.usedFallback, card.fallback)}
              </p>
              {(() => {
                const delta = formatDelta(card.rate, card.prev, card.usedFallback);
                return (
                  <>
                    {delta && (
                      <p
                        className={`font-sans text-[11px] mt-1 font-medium ${
                          delta.up ? "text-red-600" : delta.down ? "text-green-600" : "text-slate-500"
                        }`}
                      >
                        {delta.text}
                      </p>
                    )}
                    <p className="font-sans text-[11px] text-slate-400 mt-1">FRED · Freddie Mac</p>
                  </>
                );
              })()}
            </div>
          ),
        )}
      </div>

      {/* Fed meeting countdown */}
      <a
        href={FOMC_CALENDAR_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-[#0B2A4A] rounded-2xl p-6 hover:bg-[#0d3258] transition-colors group"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C6A15B] mb-1">
              FOMC Meeting Countdown
            </p>
            <p className="font-heading text-[22px] font-semibold text-white">
              June 17–18, 2026
            </p>
            <p className="font-sans text-[13px] text-white/60 mt-1 group-hover:text-white/80 transition-colors">
              View full FOMC calendar →
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="font-heading text-[40px] font-semibold text-[#C6A15B] leading-none">
              {fedDays}
            </p>
            <p className="font-sans text-[13px] text-white/80 mt-1">
              {fedDays === 1 ? "day" : "days"} until next rate decision
            </p>
          </div>
        </div>
      </a>

      {/* AI Daily Market Brief */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
        <div className="flex items-center gap-3 mb-5">
          <h3 className="font-heading text-[15px] font-semibold text-[#0B2A4A]">
            Today&apos;s Market Brief
          </h3>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-md tracking-wide bg-[#C6A15B]/15 text-[#C6A15B] border border-[#C6A15B]/30">
            AI
          </span>
        </div>

        {briefLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-l-[3px] border-[#C6A15B]/30 pl-4 space-y-2">
                <div className="h-3 bg-slate-200 rounded w-full" />
                <div className="h-3 bg-slate-100 rounded w-5/6" />
                <div className="h-3 bg-slate-100 rounded w-4/6" />
              </div>
            ))}
          </div>
        ) : briefError || !brief ? (
          <p className="font-sans text-[13px] text-slate-500 border-l-[3px] border-slate-200 pl-4">
            Market brief is temporarily unavailable. Rate cards and intelligence feed are still
            live — check back shortly.
          </p>
        ) : (
          <div className="space-y-4">
            {briefParagraphs.map((paragraph, i) => (
              <p
                key={i}
                className="font-sans text-[14px] text-slate-600 leading-relaxed border-l-[3px] border-[#C6A15B] pl-4"
              >
                {paragraph}
              </p>
            ))}
          </div>
        )}

        <p className="font-sans text-[11px] text-slate-400 mt-5">
          Updated every 6 hours
          {briefGeneratedAt
            ? ` · Last generated ${new Date(briefGeneratedAt).toLocaleString()}`
            : ""}
        </p>
      </div>

      {/* Intelligence Feed */}
      <div>
        <h3 className="font-heading text-[15px] font-semibold text-[#0B2A4A] mb-4">
          Intelligence Feed
        </h3>

        <div className="flex flex-wrap gap-2 mb-4">
          {FEED_FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={`font-sans text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-all ${
                activeFilter === filter.id
                  ? "bg-[#0B2A4A] text-white border-[#0B2A4A]"
                  : "bg-white text-slate-600 border-slate-200/80 hover:border-[#C6A15B]/50"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {feedLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <FeedCardSkeleton key={i} />
            ))}
          </div>
        ) : feedError || filteredFeed.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
            <p className="font-sans text-[13px] text-slate-400">
              {feedError ? "Feed temporarily unavailable." : "No items match this filter."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFeed.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-[#C6A15B]/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tagBadgeClasses(item.tag.label)}`}
                      >
                        {item.tag.emoji} {item.tag.label}
                      </span>
                      <span className="font-sans text-[11px] text-slate-400">
                        {item.source}
                        {item.publishedAt ? ` · ${timeAgo(item.publishedAt)}` : ""}
                      </span>
                    </div>
                    <p className="font-sans text-[14px] font-semibold text-[#0B2A4A] group-hover:text-[#C6A15B] transition-colors line-clamp-2">
                      {item.title}
                    </p>
                    <p className="font-sans text-[13px] text-slate-500 mt-1.5 line-clamp-2">
                      {item.summary}
                    </p>
                  </div>
                  <ExternalLinkIcon />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
