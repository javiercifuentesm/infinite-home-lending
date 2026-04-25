import type { HelocInputs } from "../../../hooks/useHelocMath";

type Props = { inputs: HelocInputs; onChange: (next: HelocInputs) => void };

function num(v: string, fallback: number): number {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
}

export function HelocTermInputs({ inputs, onChange }: Props) {
  const patch = (p: Partial<HelocInputs>) => onChange({ ...inputs, ...p });

  return (
    <div className="rounded-xl border border-[var(--color-border-tertiary)] bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#27500A]" style={{ background: "#EAF3DE" }} aria-hidden>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M4 6h16M4 12h10M4 18h16" strokeLinecap="round" />
          </svg>
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-text-tertiary)]">HELOC terms</p>
          <h2 className="font-[Georgia,serif] text-lg font-semibold text-[#0B2A4A]">Draw &amp; repayment</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">Draw amount ($)</span>
          <input
            id="draw"
            type="number"
            step={1000}
            min={0}
            className="min-h-[44px] w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 text-[15px] tabular-nums text-[#0B2A4A] md:min-h-[40px]"
            value={inputs.draw}
            onChange={(e) => patch({ draw: num(e.target.value, inputs.draw) })}
          />
          <p className="mt-1.5 text-[13px] text-[var(--color-text-tertiary)]">How much you plan to use</p>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">Current HELOC rate (%)</span>
          <input
            id="rate"
            type="number"
            step={0.05}
            min={0}
            className="min-h-[44px] w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 text-[15px] tabular-nums text-[#0B2A4A] md:min-h-[40px]"
            value={inputs.rate}
            onChange={(e) => patch({ rate: num(e.target.value, inputs.rate) })}
          />
          <p className="mt-1.5 text-[13px] text-[var(--color-text-tertiary)]">Variable — tied to prime rate</p>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">Draw period (years)</span>
          <select
            id="drawYrs"
            className="min-h-[44px] w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 text-[15px] text-[#0B2A4A] md:min-h-[40px]"
            value={inputs.drawYrs}
            onChange={(e) => patch({ drawYrs: Number(e.target.value) })}
          >
            <option value={5}>5 years</option>
            <option value={10}>10 years</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">Repayment period (years)</span>
          <select
            id="repayYrs"
            className="min-h-[44px] w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 text-[15px] text-[#0B2A4A] md:min-h-[40px]"
            value={inputs.repayYrs}
            onChange={(e) => patch({ repayYrs: Number(e.target.value) })}
          >
            <option value={10}>10 years</option>
            <option value={15}>15 years</option>
            <option value={20}>20 years</option>
          </select>
        </label>
      </div>
    </div>
  );
}
