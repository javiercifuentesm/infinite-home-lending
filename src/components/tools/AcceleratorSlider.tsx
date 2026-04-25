import type { PaymentFreq } from "../../hooks/useAcceleratorMath";
import type { AcceleratorFormState } from "./AcceleratorInputs";

const FREQS: { id: PaymentFreq; label: string; badge: string }[] = [
  { id: "monthly", label: "Monthly", badge: "Monthly extra" },
  { id: "biweekly", label: "Bi-weekly", badge: "Bi-weekly extra (→ monthly equivalent)" },
  { id: "annual", label: "Annual lump sum", badge: "Annual lump sum (spread monthly)" },
  { id: "onetime", label: "One-time payment", badge: "One-time principal reduction" },
];

type Props = {
  inputs: AcceleratorFormState;
  onChange: (next: AcceleratorFormState) => void;
};

export function AcceleratorSlider({ inputs, onChange }: Props) {
  const patch = (p: Partial<AcceleratorFormState>) => onChange({ ...inputs, ...p });
  const badge = FREQS.find((f) => f.id === inputs.freq)?.badge ?? "";

  return (
    <div className="rounded-xl border border-[var(--color-border-tertiary)] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">Extra payment toward principal</h3>
        <span className="inline-flex max-w-full rounded-lg bg-[var(--color-background-secondary)] px-2.5 py-1 text-[11px] font-medium text-[#0B2A4A]">
          {badge}
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <input
          type="range"
          min={0}
          max={2000}
          step={25}
          className="h-2 w-full flex-1 cursor-pointer accent-[#0B2A4A] sm:max-w-xl"
          value={inputs.extra}
          onInput={(e) => patch({ extra: Number((e.target as HTMLInputElement).value) })}
          onChange={(e) => patch({ extra: Number(e.target.value) })}
          aria-label="Extra payment amount"
        />
        <p className="shrink-0 text-center font-[Georgia,serif] text-2xl font-semibold tabular-nums text-[#0B2A4A] sm:min-w-[5.5rem] sm:text-right">
          {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
            inputs.extra,
          )}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {FREQS.map(({ id, label }) => {
          const active = inputs.freq === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => patch({ freq: id })}
              className={`min-h-[40px] rounded-lg border px-3 py-2 text-[12px] font-semibold transition-colors sm:px-4 sm:text-[13px] ${
                active
                  ? "border-[#0B2A4A] bg-[#0B2A4A] text-white"
                  : "border-[var(--color-border-tertiary)] bg-[var(--color-background-secondary)] text-[var(--color-text-tertiary)] hover:border-[#0B2A4A]/30"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
