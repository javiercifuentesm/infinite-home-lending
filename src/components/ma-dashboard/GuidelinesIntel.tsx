import { useEffect, useMemo, useState } from "react";
import { apiUrl } from "../../lib/apiBase";

type GuidelineAgency = "Fannie Mae" | "Freddie Mac" | "FHA" | "VA" | "USDA" | "CFPB";

type GuidelineItem = {
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

type AgencyFilter = "All" | GuidelineAgency;

const AGENCY_FILTERS: AgencyFilter[] = [
  "All",
  "Fannie Mae",
  "Freddie Mac",
  "FHA",
  "VA",
  "CFPB",
];

const AGENCY_BADGE_CLASSES: Record<GuidelineAgency, string> = {
  "Fannie Mae": "bg-[#0B2A4A] text-white",
  "Freddie Mac": "bg-blue-700 text-white",
  FHA: "bg-green-600 text-white",
  VA: "bg-red-600 text-white",
  USDA: "bg-green-700 text-white",
  CFPB: "bg-purple-700 text-white",
};

function timeAgo(dateStr: string): string {
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return "Date unavailable";
  const diff = Date.now() - parsed.getTime();
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000);
  if (days > 0) return `${days} day${days === 1 ? "" : "s"} ago`;
  if (hours > 0) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  return "Just now";
}

function impactBadgeClasses(impact: GuidelineAnalysis["impact"]): string {
  if (impact === "high") return "bg-red-100 text-red-700 border-red-200";
  if (impact === "low") return "bg-green-100 text-green-700 border-green-200";
  return "bg-amber-100 text-amber-800 border-amber-200";
}

function FeedSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 animate-pulse space-y-3">
      <div className="flex gap-2">
        <div className="h-5 w-24 bg-slate-200 rounded-full" />
        <div className="h-5 w-12 bg-slate-100 rounded-full" />
      </div>
      <div className="h-4 w-full bg-slate-200 rounded" />
      <div className="h-3 w-32 bg-slate-100 rounded" />
      <div className="h-9 w-40 bg-[#C6A15B]/20 rounded-lg" />
    </div>
  );
}

function AnalysisSkeleton() {
  return (
    <div className="bg-[#0B2A4A] rounded-2xl p-6 animate-pulse space-y-4">
      <div className="h-4 w-40 bg-white/20 rounded" />
      <p className="font-sans text-[13px] text-[#C6A15B] text-center">
        Alfred is analyzing
        <span className="inline-flex w-6">
          <span className="animate-pulse">...</span>
        </span>
      </p>
      <div className="space-y-2">
        <div className="h-3 bg-white/10 rounded w-full" />
        <div className="h-3 bg-white/10 rounded w-5/6" />
        <div className="h-3 bg-white/10 rounded w-4/6" />
      </div>
    </div>
  );
}

export function GuidelinesIntel() {
  const [items, setItems] = useState<GuidelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedError, setFeedError] = useState(false);
  const [activeFilter, setActiveFilter] = useState<AgencyFilter>("All");
  const [selectedItem, setSelectedItem] = useState<GuidelineItem | null>(null);
  const [analysis, setAnalysis] = useState<GuidelineAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(false);

  useEffect(() => {
    fetch(apiUrl("/api/guidelines-updates"))
      .then((res) => res.json())
      .then((data: { ok?: boolean; items?: GuidelineItem[] }) => {
        if (data.ok) {
          setItems(data.items ?? []);
        } else {
          setFeedError(true);
        }
      })
      .catch(() => setFeedError(true))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = useMemo(() => {
    if (activeFilter === "All") return items;
    return items.filter((item) => item.agency === activeFilter);
  }, [items, activeFilter]);

  const newCount = useMemo(() => items.filter((item) => item.isNew).length, [items]);

  const handleAnalyze = async (item: GuidelineItem) => {
    setSelectedItem(item);
    setAnalysis(null);
    setAnalysisError(false);
    setAnalyzing(true);

    try {
      const res = await fetch(apiUrl("/api/guidelines-analyze"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: item.title,
          url: item.url,
          agency: item.agency,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; analysis?: GuidelineAnalysis };
      if (data.ok && data.analysis) {
        setAnalysis(data.analysis);
      } else {
        setAnalysisError(true);
      }
    } catch {
      setAnalysisError(true);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Section A — Agency filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        {AGENCY_FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`font-sans text-[12px] font-medium px-3 py-1.5 rounded-full border transition-all ${
              activeFilter === filter
                ? "bg-[#0B2A4A] text-white border-[#0B2A4A]"
                : "bg-white text-slate-600 border-slate-200/80 hover:border-[#C6A15B]/50"
            }`}
          >
            {filter}
          </button>
        ))}
        {newCount > 0 && (
          <span className="font-sans text-[11px] font-semibold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
            🔴 {newCount} New
          </span>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Section B — Guidelines feed */}
        <div className="w-full lg:w-[60%] space-y-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <FeedSkeleton key={i} />)
          ) : feedError ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
              <p className="font-sans text-[13px] text-slate-500">
                Guidelines feed temporarily unavailable. Please try again shortly.
              </p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
              <p className="font-sans text-[13px] text-slate-500">No updates match this filter.</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`font-sans text-[10px] font-semibold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full ${AGENCY_BADGE_CLASSES[item.agency]}`}
                  >
                    {item.agency}
                  </span>
                  {item.isNew && (
                    <span className="font-sans text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C6A15B]/15 text-[#C6A15B] border border-[#C6A15B]/30">
                      🆕 NEW
                    </span>
                  )}
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-sans text-[15px] font-semibold text-[#0B2A4A] hover:text-[#C6A15B] transition-colors"
                >
                  {item.title}
                </a>

                <p className="font-sans text-[12px] text-slate-400">
                  Published: {timeAgo(item.publishedAt)}
                </p>

                <button
                  type="button"
                  onClick={() => handleAnalyze(item)}
                  className="font-sans text-[12px] font-semibold px-4 py-2 rounded-lg bg-[#C6A15B] text-[#0B2A4A] hover:bg-[#b8924f] transition-colors"
                >
                  Analyze with Alfred →
                </button>
              </div>
            ))
          )}
        </div>

        {/* Section C — Alfred Analysis Panel */}
        <div className="w-full lg:w-[40%] lg:sticky lg:top-8">
          {!selectedItem && !analyzing && !analysis && (
            <div className="bg-[#0B2A4A] rounded-2xl p-8 text-center min-h-[320px] flex flex-col items-center justify-center">
              <span className="text-4xl mb-4">🦇</span>
              <h3 className="font-heading text-[18px] font-semibold text-[#C6A15B] mb-3">Alfred</h3>
              <p className="font-sans text-[13px] text-white/70 max-w-xs leading-relaxed">
                Select a guideline update and click &quot;Analyze with Alfred&quot; to get a full
                before/after analysis with pros, cons, and your recommended action.
              </p>
            </div>
          )}

          {analyzing && <AnalysisSkeleton />}

          {!analyzing && analysisError && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
              <p className="font-sans text-[13px] text-slate-500">
                Alfred couldn&apos;t complete this analysis. Please try again.
              </p>
            </div>
          )}

          {!analyzing && analysis && selectedItem && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-5">
              <div>
                <h3 className="font-heading text-[16px] font-semibold text-[#0B2A4A] mb-2">
                  🦇 Alfred&apos;s Analysis
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`font-sans text-[10px] font-semibold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full ${AGENCY_BADGE_CLASSES[selectedItem.agency]}`}
                  >
                    {selectedItem.agency}
                  </span>
                  <span
                    className={`font-sans text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${impactBadgeClasses(analysis.impact)}`}
                  >
                    {analysis.impact}
                  </span>
                </div>
              </div>

              <div>
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-2">
                  Summary
                </p>
                <p className="font-sans text-[14px] text-slate-600 leading-relaxed">{analysis.summary}</p>
              </div>

              {analysis.previousGuideline && (
                <div>
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-2">
                    Previous Guideline
                  </p>
                  <p className="font-sans text-[13px] text-slate-600 leading-relaxed border-l-[3px] border-[#C6A15B] pl-4">
                    {analysis.previousGuideline}
                  </p>
                </div>
              )}

              {analysis.newGuideline && (
                <div>
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-2">
                    New Guideline
                  </p>
                  <p className="font-sans text-[13px] text-slate-600 leading-relaxed border-l-[3px] border-[#0B2A4A] pl-4">
                    {analysis.newGuideline}
                  </p>
                </div>
              )}

              {analysis.pros.length > 0 && (
                <div>
                  <p className="font-sans text-[12px] font-semibold text-[#0B2A4A] mb-2">✅ Pros</p>
                  <ul className="space-y-1.5">
                    {analysis.pros.map((pro) => (
                      <li key={pro} className="font-sans text-[13px] text-slate-600 flex gap-2">
                        <span className="text-[#C6A15B]">•</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.cons.length > 0 && (
                <div>
                  <p className="font-sans text-[12px] font-semibold text-[#0B2A4A] mb-2">⚠️ Cons</p>
                  <ul className="space-y-1.5">
                    {analysis.cons.map((con) => (
                      <li key={con} className="font-sans text-[13px] text-slate-600 flex gap-2">
                        <span className="text-amber-500">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.maAction && (
                <div>
                  <p className="font-sans text-[12px] font-semibold text-[#0B2A4A] mb-2">💡 MA Action</p>
                  <p className="font-sans text-[13px] text-[#0B2A4A] leading-relaxed bg-[#C6A15B]/15 border border-[#C6A15B]/30 rounded-xl p-4">
                    {analysis.maAction}
                  </p>
                </div>
              )}

              {(analysis.affectedLoans?.length ?? 0) > 0 && (
                <div>
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-2">
                    Affected Loans
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.affectedLoans!.map((loan) => (
                      <span
                        key={loan}
                        className="font-sans text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200"
                      >
                        {loan}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {analysis.effectiveDate && (
                <p className="font-sans text-[12px] text-slate-500">
                  Effective: <span className="text-[#0B2A4A] font-medium">{analysis.effectiveDate}</span>
                </p>
              )}

              <a
                href={selectedItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex font-sans text-[12px] font-semibold text-[#0B2A4A] hover:text-[#C6A15B] transition-colors"
              >
                View Source Document →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
