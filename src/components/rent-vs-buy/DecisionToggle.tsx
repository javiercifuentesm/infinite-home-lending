type View = "buyNow" | "wait";

type Props = {
  waitYearsLabel: number;
  view: View;
  onViewChange: (v: View) => void;
};

export function DecisionToggle({ waitYearsLabel, view, onViewChange }: Props) {
  const base =
    "flex-1 rounded-xl px-4 py-3 text-center text-[14px] font-bold transition-all duration-200 sm:text-[15px]";
  const active = "bg-[#0B1F3A] text-white shadow-md";
  const idle = "bg-white text-[#0B1F3A]/70 ring-1 ring-black/[0.08] hover:bg-[#0B1F3A]/[0.04]";

  return (
    <div className="rounded-2xl bg-[#0B1F3A]/[0.04] p-1.5 ring-1 ring-black/[0.06]">
      <div className="flex gap-1.5" role="tablist" aria-label="Compare outcomes">
        <button
          type="button"
          role="tab"
          aria-selected={view === "buyNow"}
          className={`${base} ${view === "buyNow" ? active : idle}`}
          onClick={() => onViewChange("buyNow")}
        >
          Buy now
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === "wait"}
          className={`${base} ${view === "wait" ? active : idle}`}
          onClick={() => onViewChange("wait")}
        >
          Wait {waitYearsLabel} {waitYearsLabel === 1 ? "year" : "years"}
        </button>
      </div>
      <p className="mt-2 px-1 text-center text-[12px] text-[#0B1F3A]/50">
        Flip to see both sides — the numbers stay tied to your inputs.
      </p>
    </div>
  );
}
