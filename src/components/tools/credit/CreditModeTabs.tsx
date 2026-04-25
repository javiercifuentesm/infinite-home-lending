type Mode = "compare" | "actions";

type Props = {
  mode: Mode;
  onModeChange: (m: Mode) => void;
};

export function CreditModeTabs({ mode, onModeChange }: Props) {
  return (
    <div
      className="inline-flex rounded-md border border-[var(--color-border-tertiary,#e2e8f0)] bg-[var(--color-background-secondary,#f1f5f9)] p-[3px]"
      role="tablist"
      aria-label="Calculator mode"
    >
      <button
        type="button"
        role="tab"
        aria-selected={mode === "compare"}
        className={`rounded-[4px] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] transition-colors ${
          mode === "compare"
            ? "border border-slate-200/90 bg-white text-[#0B2A4A] shadow-sm"
            : "border border-transparent bg-transparent text-slate-500 hover:text-[#0B2A4A]"
        }`}
        onClick={() => onModeChange("compare")}
      >
        Score comparison
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === "actions"}
        className={`rounded-[4px] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] transition-colors ${
          mode === "actions"
            ? "border border-slate-200/90 bg-white text-[#0B2A4A] shadow-sm"
            : "border border-transparent bg-transparent text-slate-500 hover:text-[#0B2A4A]"
        }`}
        onClick={() => onModeChange("actions")}
      >
        Action planner
      </button>
    </div>
  );
}
