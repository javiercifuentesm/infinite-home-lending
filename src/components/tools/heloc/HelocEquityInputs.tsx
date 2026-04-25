import type { HelocInputs } from "../../../hooks/useHelocMath";

type Props = { inputs: HelocInputs; onChange: (next: HelocInputs) => void };

function num(v: string, fallback: number): number {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
}

export function HelocEquityInputs({ inputs, onChange }: Props) {
  const patch = (p: Partial<HelocInputs>) => onChange({ ...inputs, ...p });

  return (
    <div className="rounded-xl border border-[var(--color-border-tertiary)] bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#0B2A4A]" style={{ background: "#E6F1FB" }} aria-hidden>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" />
          </svg>
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-text-tertiary)]">Your home equity</p>
          <h2 className="font-[Georgia,serif] text-lg font-semibold text-[#0B2A4A]">Property &amp; limits</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">Home value ($)</span>
          <input
            id="hv"
            type="number"
            step={5000}
            min={0}
            className="min-h-[44px] w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 text-[15px] tabular-nums text-[#0B2A4A] md:min-h-[40px]"
            value={inputs.hv}
            onChange={(e) => patch({ hv: num(e.target.value, inputs.hv) })}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">Mortgage balance ($)</span>
          <input
            id="mb"
            type="number"
            step={1000}
            min={0}
            className="min-h-[44px] w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 text-[15px] tabular-nums text-[#0B2A4A] md:min-h-[40px]"
            value={inputs.mb}
            onChange={(e) => patch({ mb: num(e.target.value, inputs.mb) })}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">Max CLTV lender allows (%)</span>
          <select
            id="cltv"
            className="min-h-[44px] w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 text-[15px] text-[#0B2A4A] md:min-h-[40px]"
            value={inputs.cltv}
            onChange={(e) => patch({ cltv: Number(e.target.value) })}
          >
            <option value={85}>85% — most lenders</option>
            <option value={90}>90% — some lenders</option>
            <option value={80}>80% — conservative</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">Credit score tier</span>
          <select
            id="credit"
            className="min-h-[44px] w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 text-[15px] text-[#0B2A4A] md:min-h-[40px]"
            value={inputs.credit}
            onChange={(e) => patch({ credit: Number(e.target.value) })}
          >
            <option value={760}>760+ — excellent</option>
            <option value={720}>720–759 — very good</option>
            <option value={680}>680–719 — good</option>
            <option value={640}>640–679 — fair</option>
          </select>
        </label>
      </div>
    </div>
  );
}
