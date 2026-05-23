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
  const [selectedItem, setSelectedItem] = useState<FeedItem | null>(null);
  const [brief, setBrief] = useState<{
    headline: string;
    theBrief: string;
    whyItMatters: string;
    theMove: string;
  } | null>(null);
  const [briefLoading, setBriefLoading] = useState(false);
  const [briefError, setBriefError] = useState(false);

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

  const handleCardClick = async (item: FeedItem) => {
    setSelectedItem(item);
    setBrief(null);
    setBriefError(false);
    setBriefLoading(true);

    try {
      const cacheRes = await fetch(apiUrl(`/api/intelligence-brief/${encodeURIComponent(item.id)}`));
      const cacheData = await cacheRes.json();

      if (cacheData.ok && cacheData.brief) {
        setBrief(cacheData.brief);
        setBriefLoading(false);
        return;
      }

      const res = await fetch(apiUrl("/api/intelligence-brief"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: item.url,
          title: item.title,
          source: item.source,
          tag: item.tag.label,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setBrief(data.brief);
      } else {
        setBriefError(true);
      }
    } catch {
      setBriefError(true);
    } finally {
      setBriefLoading(false);
    }
  };

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
              <button
                key={item.id}
                type="button"
                onClick={() => handleCardClick(item)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "1.25rem",
                  borderRadius: "0.75rem",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(198,161,91,0.12)",
                  cursor: "pointer",
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
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedItem && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => {
            setSelectedItem(null);
            setBrief(null);
          }}
        >
          <div
            style={{
              background: "#0B2A4A",
              borderRadius: "1rem",
              width: "100%",
              maxWidth: "620px",
              maxHeight: "90vh",
              overflowY: "auto",
              border: "1px solid rgba(198,161,91,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "20px 24px 16px",
                borderBottom: "1px solid rgba(198,161,91,0.15)",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background:
                        selectedItem.tag.label === "Compliance Alert"
                          ? "#ef4444"
                          : selectedItem.tag.label === "Local Intel"
                            ? "#3b82f6"
                            : selectedItem.tag.label === "Negotiation Leverage"
                              ? "#22c55e"
                              : "#C6A15B",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "sans-serif",
                      fontSize: "9px",
                      fontWeight: 700,
                      color:
                        selectedItem.tag.label === "Compliance Alert"
                          ? "#ef4444"
                          : selectedItem.tag.label === "Local Intel"
                            ? "#3b82f6"
                            : selectedItem.tag.label === "Negotiation Leverage"
                              ? "#22c55e"
                              : "#C6A15B",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                    }}
                  >
                    {selectedItem.tag.label} · {selectedItem.source}
                  </span>
                  <span style={{ fontFamily: "sans-serif", fontSize: "11px", color: "rgba(247,247,245,0.35)" }}>
                    {timeAgo(selectedItem.publishedAt)}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "20px",
                    fontWeight: 500,
                    color: "#F7F7F5",
                    lineHeight: 1.4,
                  }}
                >
                  {brief?.headline || selectedItem.title}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedItem(null);
                  setBrief(null);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(247,247,245,0.4)",
                  cursor: "pointer",
                  fontSize: "20px",
                  flexShrink: 0,
                  padding: "0 0 0 8px",
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "20px 24px" }}>
              {briefLoading && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    fontFamily: "sans-serif",
                    fontSize: "13px",
                    color: "rgba(247,247,245,0.4)",
                  }}
                >
                  Nexio is writing your brief...
                </div>
              )}
              {briefError && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    fontFamily: "sans-serif",
                    fontSize: "13px",
                    color: "rgba(247,247,245,0.4)",
                  }}
                >
                  Brief unavailable for this article.{" "}
                  <a href={selectedItem.url} target="_blank" rel="noopener noreferrer" style={{ color: "#C6A15B" }}>
                    Read the original →
                  </a>
                </div>
              )}
              {brief && !briefLoading && (
                <>
                  {/* THE BRIEF */}
                  <div style={{ marginBottom: "20px" }}>
                    <div
                      style={{
                        fontFamily: "sans-serif",
                        fontSize: "9px",
                        fontWeight: 700,
                        color: "rgba(198,161,91,0.7)",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        marginBottom: "8px",
                      }}
                    >
                      The Brief
                    </div>
                    <div
                      style={{
                        fontFamily: "sans-serif",
                        fontSize: "14px",
                        color: "rgba(247,247,245,0.8)",
                        lineHeight: 1.7,
                      }}
                    >
                      {brief.theBrief}
                    </div>
                  </div>

                  {/* WHY IT MATTERS */}
                  <div
                    style={{
                      background:
                        selectedItem.tag.label === "Compliance Alert"
                          ? "rgba(239,68,68,0.08)"
                          : selectedItem.tag.label === "Local Intel"
                            ? "rgba(59,130,246,0.08)"
                            : selectedItem.tag.label === "Negotiation Leverage"
                              ? "rgba(34,197,94,0.08)"
                              : "rgba(198,161,91,0.08)",
                      border: `1px solid ${
                        selectedItem.tag.label === "Compliance Alert"
                          ? "rgba(239,68,68,0.25)"
                          : selectedItem.tag.label === "Local Intel"
                            ? "rgba(59,130,246,0.2)"
                            : selectedItem.tag.label === "Negotiation Leverage"
                              ? "rgba(34,197,94,0.2)"
                              : "rgba(198,161,91,0.2)"
                      }`,
                      borderRadius: "8px",
                      padding: "14px 16px",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "sans-serif",
                        fontSize: "9px",
                        fontWeight: 700,
                        color:
                          selectedItem.tag.label === "Compliance Alert"
                            ? "#ef4444"
                            : selectedItem.tag.label === "Local Intel"
                              ? "#3b82f6"
                              : selectedItem.tag.label === "Negotiation Leverage"
                                ? "#22c55e"
                                : "#C6A15B",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        marginBottom: "8px",
                      }}
                    >
                      Why it matters
                    </div>
                    <div
                      style={{
                        fontFamily: "sans-serif",
                        fontSize: "14px",
                        color: "rgba(247,247,245,0.8)",
                        lineHeight: 1.7,
                      }}
                    >
                      {brief.whyItMatters}
                    </div>
                  </div>

                  {/* THE MOVE */}
                  <div
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(198,161,91,0.15)",
                      borderRadius: "8px",
                      padding: "14px 16px",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "sans-serif",
                        fontSize: "9px",
                        fontWeight: 700,
                        color: "rgba(198,161,91,0.7)",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        marginBottom: "8px",
                      }}
                    >
                      The Move
                    </div>
                    <div
                      style={{
                        fontFamily: "sans-serif",
                        fontSize: "14px",
                        color: "#F7F7F5",
                        lineHeight: 1.7,
                        fontWeight: 500,
                      }}
                    >
                      {brief.theMove}
                    </div>
                  </div>

                  {/* Footer */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: "12px",
                      borderTop: "1px solid rgba(198,161,91,0.1)",
                    }}
                  >
                    <div style={{ fontFamily: "sans-serif", fontSize: "11px", color: "rgba(247,247,245,0.35)" }}>
                      Source: {selectedItem.source}
                    </div>
                    <a
                      href={selectedItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Opens in a new tab"
                      style={{
                        fontFamily: "sans-serif",
                        fontSize: "11px",
                        color: "#C6A15B",
                        textDecoration: "none",
                        fontWeight: 500,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      Read full article
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ flexShrink: 0 }}
                      >
                        <path
                          d="M2 10L10 2M10 2H5M10 2V7"
                          stroke="#C6A15B"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
