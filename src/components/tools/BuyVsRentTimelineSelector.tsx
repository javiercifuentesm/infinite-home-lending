import { TIMELINE_YEARS } from "../../hooks/useBuyVsRentMath";

type Props = {
  viewYear: number;
  onChange: (y: number) => void;
};

export function BuyVsRentTimelineSelector({ viewYear, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {TIMELINE_YEARS.map((y) => {
        const active = viewYear === y;
        return (
          <button
            key={y}
            type="button"
            onClick={() => onChange(y)}
            className={`min-h-[40px] min-w-[3rem] rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors ${
              active
                ? "border-2 border-[#0B2A4A] bg-[#0B2A4A] text-white"
                : "border border-[var(--color-border-tertiary)] bg-[var(--color-background-secondary)] text-[var(--color-text-tertiary)] hover:border-[#0B2A4A]/30"
            }`}
          >
            {y} yr{y === 1 ? "" : "s"}
          </button>
        );
      })}
    </div>
  );
}
