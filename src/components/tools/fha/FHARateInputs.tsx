import type { FHAInputs } from "../../../hooks/useFHAMath";

type Props = {
  inputs: FHAInputs;
  onChange: (next: FHAInputs) => void;
};

export function FHARateInputs({ inputs, onChange }: Props) {
  const patch = (p: Partial<FHAInputs>) => onChange({ ...inputs, ...p });

  return (
    <div className="rounded-xl border border-[var(--color-border-tertiary)] bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#27500A]"
          style={{ background: "#EAF3DE" }}
          aria-hidden
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-text-tertiary)]">Loan rates</p>
          <h2 className="font-[Georgia,serif] text-lg font-semibold text-[#0B2A4A]">Rates & timeline</h2>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">Conventional rate (%)</span>
          <input
            type="number"
            min={0}
            step={0.05}
            value={inputs.convRate}
            onChange={(e) => patch({ convRate: Number(e.target.value) })}
            className="w-full rounded-lg border border-[var(--color-border-tertiary)] bg-white px-3 py-2.5 text-[15px] text-[#0B2A4A]"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">FHA rate (%)</span>
          <input
            type="number"
            min={0}
            step={0.05}
            value={inputs.fhaRate}
            onChange={(e) => patch({ fhaRate: Number(e.target.value) })}
            className="w-full rounded-lg border border-[var(--color-border-tertiary)] bg-white px-3 py-2.5 text-[15px] text-[#0B2A4A]"
          />
          <span className="mt-1 block text-[11px] text-[var(--color-text-tertiary)]">FHA often 0.125–0.25% lower</span>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">Loan term (years)</span>
          <select
            value={inputs.term}
            onChange={(e) => patch({ term: Number(e.target.value) })}
            className="w-full rounded-lg border border-[var(--color-border-tertiary)] bg-white px-3 py-2.5 text-[15px] text-[#0B2A4A]"
          >
            <option value={30}>30 years</option>
            <option value={15}>15 years</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">How long you plan to stay</span>
          <select
            value={inputs.stay}
            onChange={(e) => patch({ stay: Number(e.target.value) })}
            className="w-full rounded-lg border border-[var(--color-border-tertiary)] bg-white px-3 py-2.5 text-[15px] text-[#0B2A4A]"
          >
            <option value={5}>Under 5 years</option>
            <option value={7}>5–10 years</option>
            <option value={15}>10–20 years</option>
            <option value={30}>20+ years / forever</option>
          </select>
        </label>
      </div>
    </div>
  );
}
