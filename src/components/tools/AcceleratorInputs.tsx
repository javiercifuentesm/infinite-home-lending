import type { PaymentFreq } from "../../hooks/useAcceleratorMath";

export type AcceleratorFormState = {
  bal: number;
  rate: number;
  term: number;
  paid: number;
  extra: number;
  freq: PaymentFreq;
};

type Props = {
  inputs: AcceleratorFormState;
  onChange: (next: AcceleratorFormState) => void;
};

function num(v: string, fallback: number): number {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
}

export function AcceleratorInputs({ inputs, onChange }: Props) {
  const patch = (p: Partial<AcceleratorFormState>) => onChange({ ...inputs, ...p });

  const paidMax = Math.max(0, inputs.term - 1);

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <label className="block">
        <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">
          Loan balance ($)
        </span>
        <input
          id="bal"
          type="number"
          step={5000}
          className="w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 text-[15px] tabular-nums text-[#0B2A4A]"
          value={inputs.bal}
          onChange={(e) => patch({ bal: num(e.target.value, inputs.bal) })}
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">
          Interest rate (%)
        </span>
        <input
          id="rate"
          type="number"
          step={0.05}
          className="w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 text-[15px] tabular-nums text-[#0B2A4A]"
          value={inputs.rate}
          onChange={(e) => patch({ rate: num(e.target.value, inputs.rate) })}
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">
          Loan term (years)
        </span>
        <input
          id="term"
          type="number"
          min={10}
          max={30}
          step={1}
          className="w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 text-[15px] tabular-nums text-[#0B2A4A]"
          value={inputs.term}
          onChange={(e) => {
            const t = Math.round(num(e.target.value, inputs.term));
            const term = Math.min(30, Math.max(10, t));
            const paid = Math.min(inputs.paid, term - 1);
            patch({ term, paid });
          }}
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">
          Years already paid
        </span>
        <input
          id="paid"
          type="number"
          min={0}
          max={paidMax}
          step={1}
          className="w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 text-[15px] tabular-nums text-[#0B2A4A]"
          value={inputs.paid}
          onChange={(e) => {
            const p = Math.round(num(e.target.value, inputs.paid));
            patch({ paid: Math.max(0, Math.min(paidMax, p)) });
          }}
        />
        <p className="mt-1 text-[11px] text-[var(--color-text-tertiary)]">0 if starting fresh</p>
      </label>
    </div>
  );
}
