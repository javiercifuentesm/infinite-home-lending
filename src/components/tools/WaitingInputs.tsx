import type { WaitingInputs } from "../../hooks/useWaitingMath";

type Props = {
  inputs: WaitingInputs;
  onChange: (next: WaitingInputs) => void;
};

function num(v: string, fallback: number): number {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
}

export function WaitingInputs({ inputs, onChange }: Props) {
  const patch = (partial: Partial<WaitingInputs>) => onChange({ ...inputs, ...partial });

  const fields: {
    id: keyof WaitingInputs;
    label: string;
    step?: string;
    min?: number;
    max?: number;
    note?: string;
    type?: "number" | "select";
    options?: { value: number; label: string }[];
  }[] = [
    { id: "hp", label: "Target home price ($)", step: "5000" },
    { id: "rent", label: "Your monthly rent ($)", step: "50" },
    { id: "dp", label: "Down payment (%)", step: "0.5", min: 0, max: 50 },
    { id: "rate", label: "Mortgage rate if bought today (%)", step: "0.05" },
    { id: "appr", label: "Home appreciation (% /yr)", step: "0.1", note: "MD/DC/VA historical ~3–4%" },
    { id: "ri", label: "Annual rent increase (% /yr)", step: "0.1" },
    {
      id: "futureRate",
      label: "Rate if you wait (% — your estimate)",
      step: "0.05",
      note: "Rates may rise, fall, or stay flat",
    },
    {
      id: "lt",
      label: "Loan term (years)",
      type: "select",
      options: [
        { value: 30, label: "30 years" },
        { value: 20, label: "20 years" },
        { value: 15, label: "15 years" },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {fields.map((f) => (
        <label key={String(f.id)} className="block">
          <span className="mb-1.5 block text-[12px] font-semibold text-[var(--tcw-text-secondary,#475569)]">
            {f.label}
          </span>
          {f.type === "select" && f.options ? (
            <select
              id={String(f.id)}
              className="w-full rounded-lg border border-[var(--tcw-border,#e2e8f0)] bg-[var(--tcw-surface,#fff)] px-3 py-2.5 text-[15px] text-[var(--tcw-text-primary,#0B2A4A)] outline-none focus:ring-2 focus:ring-[#C6A15B]/40"
              value={inputs[f.id] as number}
              onChange={(e) => patch({ [f.id]: num(e.target.value, inputs[f.id] as number) } as Partial<WaitingInputs>)}
            >
              {f.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={String(f.id)}
              type="number"
              step={f.step}
              min={f.min}
              max={f.max}
              className="w-full rounded-lg border border-[var(--tcw-border,#e2e8f0)] bg-[var(--tcw-surface,#fff)] px-3 py-2.5 text-[15px] tabular-nums text-[var(--tcw-text-primary,#0B2A4A)] outline-none focus:ring-2 focus:ring-[#C6A15B]/40]"
              value={inputs[f.id] as number}
              onChange={(e) => patch({ [f.id]: num(e.target.value, inputs[f.id] as number) } as Partial<WaitingInputs>)}
            />
          )}
          {f.note ? <p className="mt-1 text-[11px] text-[var(--tcw-text-muted,#64748b)]">{f.note}</p> : null}
        </label>
      ))}
    </div>
  );
}
