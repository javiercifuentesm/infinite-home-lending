export type SEQPath = "taxreturn" | "bankstatement" | "compare";

type Props = {
  path: SEQPath;
  onPathChange: (p: SEQPath) => void;
};

const tabs: { key: SEQPath; label: string }[] = [
  { key: "taxreturn", label: "📋 Tax return path (Schedule C)" },
  { key: "bankstatement", label: "🏦 Bank statement path" },
  { key: "compare", label: "⚖️ Side-by-side comparison" },
];

export function SEQPathTabs({ path, onPathChange }: Props) {
  return (
    <div className="mb-8 mt-10 w-full rounded-lg border border-slate-200/90 bg-slate-50/50 p-1 sm:p-1.5">
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
        {tabs.map((t) => {
          const active = path === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onPathChange(t.key)}
              className={`min-h-[44px] rounded-md px-3 py-2.5 text-center text-[13px] font-semibold transition-colors sm:text-[12px] md:text-[13px] ${
                active
                  ? "border border-slate-200 bg-white text-[#0B2A4A] shadow-sm"
                  : "border border-transparent bg-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
