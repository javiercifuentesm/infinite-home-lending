import type { FHAInputs } from "../../../hooks/useFHAMath";

type Props = {
  inputs: FHAInputs;
  onChange: (next: FHAInputs) => void;
};

export function FHAPurchaseInputs({ inputs, onChange }: Props) {
  const patch = (p: Partial<FHAInputs>) => onChange({ ...inputs, ...p });
  const warnMinFha = inputs.dp < 3.5;

  return (
    <div className="rounded-xl border border-[var(--color-border-tertiary)] bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#0C447C]"
          style={{ background: "#E6F1FB" }}
          aria-hidden
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" />
          </svg>
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-text-tertiary)]">Your purchase details</p>
          <h2 className="font-[Georgia,serif] text-lg font-semibold text-[#0B2A4A]">Purchase</h2>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">Home price ($)</span>
          <input
            type="number"
            min={50000}
            step={5000}
            value={inputs.hp}
            onChange={(e) => patch({ hp: Number(e.target.value) })}
            className="w-full rounded-lg border border-[var(--color-border-tertiary)] bg-white px-3 py-2.5 text-[15px] text-[#0B2A4A]"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">Down payment (%)</span>
          <input
            type="number"
            min={3}
            max={25}
            step={0.5}
            value={inputs.dp}
            onChange={(e) => patch({ dp: Number(e.target.value) })}
            className="w-full rounded-lg border border-[var(--color-border-tertiary)] bg-white px-3 py-2.5 text-[15px] text-[#0B2A4A]"
          />
          <span className="mt-1 block text-[11px] text-[var(--color-text-tertiary)]">FHA min 3.5% · Conventional min 3%</span>
          {warnMinFha ? (
            <span className="mt-2 block text-[12px] font-medium text-[#854F0B]">
              FHA requires a minimum 3.5% down payment. Showing 3.5% for FHA.
            </span>
          ) : null}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">Credit score</span>
          <select
            value={inputs.cs}
            onChange={(e) => patch({ cs: Number(e.target.value) })}
            className="w-full rounded-lg border border-[var(--color-border-tertiary)] bg-white px-3 py-2.5 text-[15px] text-[#0B2A4A]"
          >
            <option value={760}>760+ — excellent</option>
            <option value={720}>720–759 — very good</option>
            <option value={680}>680–719 — good</option>
            <option value={640}>640–679 — fair</option>
            <option value={600}>600–639 — below average</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">Home appreciation (% /yr)</span>
          <input
            type="number"
            min={0}
            step={0.1}
            value={inputs.appr}
            onChange={(e) => patch({ appr: Number(e.target.value) })}
            className="w-full rounded-lg border border-[var(--color-border-tertiary)] bg-white px-3 py-2.5 text-[15px] text-[#0B2A4A]"
          />
          <span className="mt-1 block text-[11px] text-[var(--color-text-tertiary)]">MD/DC/VA avg ~3–4%</span>
        </label>
      </div>
    </div>
  );
}
