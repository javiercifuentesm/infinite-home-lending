import { useRef, useState } from "react";
import { apiUrl } from "../../lib/apiBase";

type LoanProgram = "conventional" | "fha" | "va" | "usda" | "jumbo" | "nonqm";

type IncomeAnalysis = {
  loanProgram: string;
  borrowerName: string;
  documentsSummary: string;
  incomeTypes: Array<{
    type: string;
    employer?: string;
    annualAmount: number;
    monthlyAmount: number;
    notes?: string;
  }>;
  totalAnnualIncome: number;
  totalMonthlyIncome: number;
  qualifyingIncome: number;
  qualifyingMonthlyIncome: number;
  guidelineApplied: string;
  adjustments: Array<{ description: string; impact: number }>;
  flags: Array<{ severity: "high" | "medium" | "low"; issue: string; recommendation: string }>;
  readyFor1003: boolean;
  confidence: "high" | "medium" | "low";
  maActionItems: string[];
  disclaimer: string;
  rawAnalysis?: string;
};

const LOAN_PROGRAMS: { id: LoanProgram; label: string }[] = [
  { id: "conventional", label: "Conventional" },
  { id: "fha", label: "FHA" },
  { id: "va", label: "VA" },
  { id: "usda", label: "USDA" },
  { id: "jumbo", label: "Jumbo" },
  { id: "nonqm", label: "Non-QM" },
];

const ACCEPTED_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"]);
const MAX_FILES = 5;
const MAX_BYTES = 10 * 1024 * 1024;

function fmtMoney(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function fmtSignedMoney(value: number): string {
  const formatted = fmtMoney(Math.abs(value));
  if (value > 0) return `+${formatted}`;
  if (value < 0) return `-${formatted}`;
  return formatted;
}

function programLabel(id: string): string {
  return LOAN_PROGRAMS.find((p) => p.id === id)?.label ?? id.toUpperCase();
}

function confidenceClasses(confidence: IncomeAnalysis["confidence"]): string {
  if (confidence === "high") return "bg-green-100 text-green-700 border-green-200";
  if (confidence === "low") return "bg-red-100 text-red-700 border-red-200";
  return "bg-amber-100 text-amber-800 border-amber-200";
}

function flagEmoji(severity: IncomeAnalysis["flags"][0]["severity"]): string {
  if (severity === "high") return "🔴";
  if (severity === "low") return "🟢";
  return "🟡";
}

function buildCopySummary(analysis: IncomeAnalysis): string {
  const lines = [
    `Income Analysis — ${analysis.borrowerName}`,
    `Loan Program: ${programLabel(analysis.loanProgram)}`,
    `Qualifying Income: ${fmtMoney(analysis.qualifyingMonthlyIncome)}/month (${fmtMoney(analysis.qualifyingIncome)} annually)`,
    `Guideline: ${analysis.guidelineApplied}`,
    "",
    "Income Breakdown:",
    ...analysis.incomeTypes.map(
      (item) =>
        `- ${item.type}${item.employer ? ` — ${item.employer}` : ""}: ${fmtMoney(item.monthlyAmount)}/mo`,
    ),
    "",
    ...(analysis.flags.length
      ? ["Flags:", ...analysis.flags.map((f) => `- [${f.severity.toUpperCase()}] ${f.issue}`)]
      : []),
    "",
    ...(analysis.maActionItems.length
      ? ["Action Items:", ...analysis.maActionItems.map((a) => `- ${a}`)]
      : []),
    "",
    analysis.disclaimer,
  ];
  return lines.join("\n");
}

function AnalysisSkeleton() {
  return (
    <div className="bg-[#0B2A4A] rounded-2xl p-8 min-h-[480px] animate-pulse space-y-4">
      <p className="font-sans text-[13px] text-[#C6A15B] text-center">
        Alfred is reading your documents...
      </p>
      <div className="space-y-3 pt-4">
        <div className="h-4 bg-white/10 rounded w-3/4 mx-auto" />
        <div className="h-4 bg-white/10 rounded w-full" />
        <div className="h-4 bg-white/10 rounded w-5/6 mx-auto" />
        <div className="h-20 bg-white/10 rounded w-full mt-6" />
        <div className="h-4 bg-white/10 rounded w-2/3 mx-auto" />
      </div>
    </div>
  );
}

export function IncomeAnalyzer() {
  const [selectedProgram, setSelectedProgram] = useState<LoanProgram | null>(null);
  const [borrowerName, setBorrowerName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<IncomeAnalysis | null>(null);
  const [analyzedAt, setAnalyzedAt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canAnalyze = Boolean(selectedProgram) && files.length > 0 && !loading;

  const addFiles = (incoming: FileList | File[]) => {
    const next = [...files];
    for (const file of Array.from(incoming)) {
      if (next.length >= MAX_FILES) break;
      if (!ACCEPTED_TYPES.has(file.type)) continue;
      if (file.size > MAX_BYTES) continue;
      if (next.some((f) => f.name === file.name && f.size === file.size)) continue;
      next.push(file);
    }
    setFiles(next);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (!selectedProgram || files.length === 0) return;

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const formData = new FormData();
      formData.append("loanProgram", selectedProgram);
      formData.append("borrowerName", borrowerName);
      files.forEach((file) => formData.append("files", file));

      const res = await fetch(apiUrl("/api/analyze-income"), {
        method: "POST",
        body: formData,
      });

      const data = (await res.json()) as {
        ok?: boolean;
        analysis?: IncomeAnalysis;
        analyzedAt?: string;
        error?: string;
      };

      if (data.ok && data.analysis) {
        setAnalysis(data.analysis);
        setAnalyzedAt(data.analyzedAt ?? new Date().toISOString());
      } else {
        setError(data.error ?? "Analysis failed. Please try again.");
      }
    } catch {
      setError("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setSelectedProgram(null);
    setBorrowerName("");
    setFiles([]);
    setAnalysis(null);
    setAnalyzedAt(null);
    setError(null);
    setCopied(false);
  };

  const handleCopySummary = async () => {
    if (!analysis) return;
    try {
      await navigator.clipboard.writeText(buildCopySummary(analysis));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy to clipboard.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto" data-ihl-capture="income-analyzer">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left panel — Upload & Configure */}
        <div className="w-full lg:w-[40%] bg-white rounded-2xl border border-slate-200/80 p-6 space-y-6">
          <div>
            <h2 className="font-heading text-[18px] font-semibold text-[#0B2A4A]">📄 Income Analyzer</h2>
            <p className="font-sans text-[12px] text-slate-500 mt-1">AI-powered · 1003-ready output</p>
          </div>

          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-3">
              Step 1 — Loan Program
            </p>
            <div className="flex flex-wrap gap-2">
              {LOAN_PROGRAMS.map((program) => (
                <button
                  key={program.id}
                  type="button"
                  onClick={() => setSelectedProgram(program.id)}
                  className={`font-sans text-[12px] font-medium px-3 py-1.5 rounded-full border transition-all ${
                    selectedProgram === program.id
                      ? "bg-[#C6A15B] text-[#0B2A4A] border-[#C6A15B]"
                      : "bg-white text-slate-600 border-slate-200/80 hover:border-[#C6A15B]/50"
                  }`}
                >
                  {program.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-2">
              Step 2 — Borrower Name (optional)
            </p>
            <input
              type="text"
              value={borrowerName}
              onChange={(e) => setBorrowerName(e.target.value)}
              placeholder="Borrower name"
              className="w-full font-sans text-[13px] px-3 py-2.5 rounded-xl border border-slate-200/80 focus:outline-none focus:border-[#0B2A4A]/30"
            />
          </div>

          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-2">
              Step 3 — Upload Documents
            </p>
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                addFiles(e.dataTransfer.files);
              }}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                dragOver
                  ? "border-[#C6A15B] bg-[#C6A15B]/5"
                  : "border-slate-200/80 hover:border-[#C6A15B]/50"
              }`}
            >
              <p className="font-sans text-[13px] text-[#0B2A4A] font-medium">
                Drop PDFs, W2s, paystubs here
              </p>
              <p className="font-sans text-[12px] text-slate-500 mt-1">or click to browse</p>
              <p className="font-sans text-[11px] text-slate-400 mt-2">PDF · JPG · PNG · Max 10MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) addFiles(e.target.files);
                e.target.value = "";
              }}
            />

            {files.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {files.map((file, index) => (
                  <span
                    key={`${file.name}-${index}`}
                    className="inline-flex items-center gap-2 font-sans text-[11px] px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {file.name}
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                      aria-label={`Remove ${file.name}`}
                    >
                      ✕
                    </button>
                  </span>
                ))}
                {files.length < MAX_FILES && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="font-sans text-[11px] px-3 py-1.5 rounded-full border border-dashed border-slate-300 text-slate-500 hover:border-[#C6A15B] hover:text-[#0B2A4A] transition-colors"
                  >
                    + add
                  </button>
                )}
              </div>
            )}
          </div>

          {error && (
            <p className="font-sans text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={() => void handleAnalyze()}
            disabled={!canAnalyze}
            className="w-full font-sans text-[13px] font-semibold px-4 py-3 rounded-xl bg-[#0B2A4A] text-white hover:bg-[#0d3258] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Alfred is analyzing...
              </>
            ) : (
              "🔍 Analyze Income with Alfred"
            )}
          </button>
        </div>

        {/* Right panel — Alfred's Analysis */}
        <div className="w-full lg:w-[60%]">
          {!loading && !analysis && (
            <div className="bg-[#0B2A4A] rounded-2xl p-10 min-h-[480px] flex flex-col items-center justify-center text-center">
              <img
                src="/alfred-icon.png"
                alt="Alfred"
                className="w-20 h-20 rounded-full object-cover mb-5"
              />
              <h3 className="font-heading text-[18px] font-semibold text-[#C6A15B] mb-3">
                Alfred is ready to analyze
              </h3>
              <p className="font-sans text-[13px] text-white/70 max-w-sm leading-relaxed">
                Select a loan program, upload documents, and click Analyze to get a 1003-ready
                qualifying income figure.
              </p>
            </div>
          )}

          {loading && <AnalysisSkeleton />}

          {!loading && analysis && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-sans text-[13px] font-semibold text-[#0B2A4A]">
                  ✅ Analysis Complete
                </span>
                <span
                  className={`font-sans text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${confidenceClasses(analysis.confidence)}`}
                >
                  {analysis.confidence}
                </span>
                {analyzedAt && (
                  <span className="font-sans text-[11px] text-slate-400 ml-auto">
                    {new Date(analyzedAt).toLocaleString()}
                  </span>
                )}
              </div>

              <p className="font-sans text-[13px] text-slate-600">
                {analysis.borrowerName} · {programLabel(analysis.loanProgram)}
              </p>

              {analysis.rawAnalysis ? (
                <div className="font-sans text-[13px] text-slate-600 whitespace-pre-wrap border border-slate-200 rounded-xl p-4 bg-slate-50">
                  {analysis.rawAnalysis}
                </div>
              ) : (
                <>
                  <div className="border-t border-slate-200/80 pt-4">
                    <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-2">
                      Qualifying Income
                    </p>
                    <p className="font-heading text-[36px] font-semibold text-[#C6A15B] leading-none">
                      {fmtMoney(analysis.qualifyingMonthlyIncome)}
                      <span className="font-sans text-[16px] text-slate-500 font-normal"> /month</span>
                    </p>
                    <p className="font-sans text-[14px] text-slate-600 mt-1">
                      {fmtMoney(analysis.qualifyingIncome)} annually
                    </p>
                  </div>

                  <div>
                    <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-3">
                      Income Breakdown
                    </p>
                    <div className="space-y-2">
                      {analysis.incomeTypes.map((item, i) => (
                        <div
                          key={`${item.type}-${i}`}
                          className="flex items-start justify-between gap-4 font-sans text-[13px]"
                        >
                          <span className="text-slate-600">
                            {item.type}
                            {item.employer ? ` — ${item.employer}` : ""}
                          </span>
                          <span className="text-[#0B2A4A] font-medium whitespace-nowrap">
                            {fmtMoney(item.monthlyAmount)}/mo
                          </span>
                        </div>
                      ))}
                      <div className="border-t border-slate-200/80 pt-2 mt-2 space-y-1">
                        <div className="flex justify-between font-sans text-[13px] text-slate-600">
                          <span>Total Income</span>
                          <span>{fmtMoney(analysis.totalMonthlyIncome)}/mo</span>
                        </div>
                        <div className="flex justify-between font-sans text-[13px] font-semibold text-[#0B2A4A]">
                          <span>After adjustments</span>
                          <span>{fmtMoney(analysis.qualifyingMonthlyIncome)}/mo</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {analysis.guidelineApplied && (
                    <div>
                      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-2">
                        Guideline Applied
                      </p>
                      <p className="font-sans text-[13px] text-slate-700 border-l-[3px] border-[#C6A15B] pl-4 py-2 bg-[#C6A15B]/5 rounded-r-xl">
                        {analysis.guidelineApplied}
                      </p>
                    </div>
                  )}

                  {analysis.adjustments.length > 0 && (
                    <div>
                      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-2">
                        Adjustments
                      </p>
                      <div className="space-y-2">
                        {analysis.adjustments.map((adj, i) => (
                          <p key={i} className="font-sans text-[13px] text-slate-600">
                            ⚠️ {adj.description}{" "}
                            <span className="font-medium text-[#0B2A4A]">
                              {fmtSignedMoney(adj.impact)}
                            </span>
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.flags.length > 0 && (
                    <div>
                      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-2">
                        Flags
                      </p>
                      <div className="space-y-2">
                        {analysis.flags.map((flag, i) => (
                          <p key={i} className="font-sans text-[13px] text-slate-600">
                            {flagEmoji(flag.severity)} {flag.severity.toUpperCase()}: {flag.issue} →{" "}
                            {flag.recommendation}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.maActionItems.length > 0 && (
                    <div>
                      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-2">
                        MA Action Items
                      </p>
                      <ul className="space-y-1.5">
                        {analysis.maActionItems.map((item) => (
                          <li key={item} className="font-sans text-[13px] text-slate-600 flex gap-2">
                            <span className="text-[#C6A15B]">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div
                    className={`font-sans text-[13px] font-semibold px-4 py-3 rounded-xl border ${
                      analysis.readyFor1003
                        ? "bg-green-50 text-green-800 border-green-200"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}
                  >
                    {analysis.readyFor1003 ? "✅ Ready for 1003" : "⚠️ Review needed"}
                  </div>
                </>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => void handleCopySummary()}
                  className="font-sans text-[12px] font-semibold px-4 py-2 rounded-xl bg-[#0B2A4A] text-white hover:bg-[#0d3258] transition-colors"
                >
                  {copied ? "Copied!" : "📋 Copy Summary"}
                </button>
                <button
                  type="button"
                  onClick={handleNewAnalysis}
                  className="font-sans text-[12px] font-semibold px-4 py-2 rounded-xl border border-slate-200/80 text-slate-600 hover:border-[#C6A15B]/50 transition-colors"
                >
                  🔄 New Analysis
                </button>
              </div>

              <p className="font-sans text-[11px] text-slate-400 pt-2 border-t border-slate-200/80">
                {analysis.disclaimer}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
