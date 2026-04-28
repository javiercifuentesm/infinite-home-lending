import { useCallback, useEffect, useState } from "react";
import { apiUrl } from "../../lib/apiBase";

const REFRESH_MS = 5 * 60 * 1000;

type Tag = { emoji: string; label: string };
type FeedItem = {
  id: string;
  source: string;
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  tag: Tag;
};

function tagColor(label: string): string {
  if (label === "Compliance Alert") return "rgba(239,68,68,0.15)";
  if (label === "Negotiation Leverage") return "rgba(34,197,94,0.15)";
  if (label === "Local Intel") return "rgba(198,161,91,0.15)";
  return "rgba(99,179,237,0.15)";
}

function tagBorder(label: string): string {
  if (label === "Compliance Alert") return "rgba(239,68,68,0.35)";
  if (label === "Negotiation Leverage") return "rgba(34,197,94,0.35)";
  if (label === "Local Intel") return "rgba(198,161,91,0.35)";
  return "rgba(99,179,237,0.35)";
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

export function IntelligenceLoop() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchedAt, setFetchedAt] = useState<string>("");
  const [error, setError] = useState(false);

  const fetchFeed = useCallback(async () => {
    try {
      setError(false);
      const res = await fetch(apiUrl("/api/intelligence-loop"));
      const data = (await res.json()) as { ok?: boolean; items?: FeedItem[]; fetchedAt?: string };
      if (data.ok) {
        setItems(data.items ?? []);
        setFetchedAt(data.fetchedAt ?? "");
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
    const interval = setInterval(fetchFeed, REFRESH_MS);
    return () => clearInterval(interval);
  }, [fetchFeed]);

  return (
    <section
      style={{
        borderTop: "1px solid rgba(198,161,91,0.12)",
        borderBottom: "1px solid rgba(198,161,91,0.12)",
        padding: "2.5rem 1.5rem",
      }}
    >
      <style>{`
        @keyframes ihlPing {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
      {/* Header */}
      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto 1.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ position: "relative", display: "flex", width: "8px", height: "8px" }}>
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                backgroundColor: "#C6A15B",
                opacity: 0.75,
                animation: "ihlPing 1.5s cubic-bezier(0,0,0.2,1) infinite",
              }}
            />
            <div
              style={{
                position: "relative",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#C6A15B",
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "sans-serif",
              fontSize: "10px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#C6A15B",
            }}
          >
            Nexio Intelligence Loop
          </span>
          <span
            style={{
              fontFamily: "sans-serif",
              fontSize: "10px",
              color: "rgba(247,247,245,0.3)",
            }}
          >
            · Live · Refreshes every 5 min
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {fetchedAt && (
            <span style={{ fontFamily: "sans-serif", fontSize: "10px", color: "rgba(247,247,245,0.3)" }}>
              Updated {timeAgo(fetchedAt)}
            </span>
          )}
          <button
            type="button"
            onClick={fetchFeed}
            style={{
              fontFamily: "sans-serif",
              fontSize: "10px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#C6A15B",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Tag legend */}
      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto 1.5rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        {[
          { emoji: "🟢", label: "Negotiation Leverage" },
          { emoji: "🔴", label: "Compliance Alert" },
          { emoji: "📊", label: "Market Signal" },
          { emoji: "🏠", label: "Local Intel" },
        ].map((t) => (
          <span
            key={t.label}
            style={{
              fontFamily: "sans-serif",
              fontSize: "10px",
              padding: "0.2rem 0.6rem",
              borderRadius: "9999px",
              background: tagColor(t.label),
              border: `1px solid ${tagBorder(t.label)}`,
              color: "rgba(247,247,245,0.6)",
            }}
          >
            {t.emoji} {t.label}
          </span>
        ))}
      </div>

      {/* Feed */}
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              fontFamily: "sans-serif",
              fontSize: "13px",
              color: "rgba(247,247,245,0.4)",
            }}
          >
            Nexio is pulling live intelligence...
          </div>
        )}
        {error && !loading && (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              fontFamily: "sans-serif",
              fontSize: "13px",
              color: "rgba(247,247,245,0.4)",
            }}
          >
            Unable to fetch live feed. Check back shortly.
          </div>
        )}
        {!loading && !error && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1rem",
            }}
          >
            {items.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  padding: "1.25rem",
                  borderRadius: "0.75rem",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(198,161,91,0.12)",
                  textDecoration: "none",
                  transition: "border-color 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(198,161,91,0.3)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(198,161,91,0.12)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.75rem",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "sans-serif",
                      fontSize: "10px",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "9999px",
                      background: tagColor(item.tag.label),
                      border: `1px solid ${tagBorder(item.tag.label)}`,
                      color: "rgba(247,247,245,0.7)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.tag.emoji} {item.tag.label}
                  </span>
                  <span style={{ fontFamily: "sans-serif", fontSize: "10px", color: "rgba(247,247,245,0.3)" }}>
                    {timeAgo(item.publishedAt)}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "sans-serif",
                    fontSize: "13px",
                    fontWeight: 600,
                    lineHeight: 1.5,
                    color: "#F7F7F5",
                    marginBottom: "0.5rem",
                  }}
                >
                  {item.title}
                </p>
                {item.summary ? (
                  <p
                    style={{
                      fontFamily: "sans-serif",
                      fontSize: "12px",
                      lineHeight: 1.6,
                      color: "rgba(247,247,245,0.5)",
                      marginBottom: "0.75rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.summary}
                  </p>
                ) : null}
                <p
                  style={{
                    fontFamily: "sans-serif",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#C6A15B",
                    opacity: 0.7,
                  }}
                >
                  {item.source} ↗
                </p>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
