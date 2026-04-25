import { fmt, fmtK, scenarioLabel } from "../../hooks/useWaitingMath";

type Props = {
  waitMonths: number;
  scenarioData: { mo: number; totalCost: number; monthlyCostRate: number }[];
  onSelect: (months: number) => void;
};

export function WaitingScenarioStrip({ waitMonths, scenarioData, onSelect }: Props) {
  const active = Math.max(1, Math.floor(waitMonths));

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      {scenarioData.map((row) => {
        const mo = row.mo;
        const isActive = mo === active;
        return (
          <button
            key={mo}
            type="button"
            onClick={() => onSelect(mo)}
            className={`rounded-lg px-3 py-4 text-left transition-shadow ${
              isActive
                ? "border-2 border-[#C6A15B] shadow-md"
                : "border-[0.5px] border-[var(--color-border-tertiary)] shadow-sm"
            } bg-[var(--tcw-surface,#fff)]`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--tcw-text-muted,#64748b)]">
              {scenarioLabel(mo)}
            </p>
            <p className="mt-2 font-[Georgia,serif] text-[17px] font-medium text-[#A32D2D]">{fmtK(row.totalCost)}</p>
            <p className="mt-1 text-[10px] text-[var(--tcw-text-muted,#64748b)]">
              {fmt(row.monthlyCostRate)}/mo
            </p>
          </button>
        );
      })}
    </div>
  );
}
