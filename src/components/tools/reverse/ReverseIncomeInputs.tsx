import type { ReverseInputs } from "../../../hooks/useReverseMath";

type Props = {
  inputs: ReverseInputs;
  onChange: (next: ReverseInputs) => void;
};

function num(v: string, fallback: number): number {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
}

export function ReverseIncomeInputs({ inputs, onChange }: Props) {
  const patch = (p: Partial<ReverseInputs>) => onChange({ ...inputs, ...p });

  return (
    <div className="rounded-xl border border-[var(--color-border-tertiary)] bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#27500A]"
          style={{ background: "#EAF3DE" }}
          aria-hidden
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-text-tertiary)]">
            Your retirement income picture
          </p>
          <h2 className="font-[Georgia,serif] text-lg font-semibold text-[#0B2A4A]">Income &amp; assumptions</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">
            Monthly retirement income ($)
          </span>
          <input
            id="retIncome"
            type="number"
            step={100}
            min={0}
            className="min-h-[44px] w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 text-[15px] tabular-nums text-[#0B2A4A] md:min-h-[40px]"
            value={inputs.retIncome}
            onChange={(e) => patch({ retIncome: num(e.target.value, inputs.retIncome) })}
          />
          <p className="mt-1.5 text-[13px] leading-snug text-[var(--color-text-tertiary)]">Social Security + pension + other</p>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">
            Monthly living expenses ($)
          </span>
          <input
            id="retExpenses"
            type="number"
            step={100}
            min={0}
            className="min-h-[44px] w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 text-[15px] tabular-nums text-[#0B2A4A] md:min-h-[40px]"
            value={inputs.retExpenses}
            onChange={(e) => patch({ retExpenses: num(e.target.value, inputs.retExpenses) })}
          />
          <p className="mt-1.5 text-[13px] leading-snug text-[var(--color-text-tertiary)]">Include housing, healthcare, living</p>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">
            Expected interest rate (%)
          </span>
          <input
            id="intRate"
            type="number"
            step={0.05}
            min={0}
            className="min-h-[44px] w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 text-[15px] tabular-nums text-[#0B2A4A] md:min-h-[40px]"
            value={inputs.intRate}
            onChange={(e) => patch({ intRate: num(e.target.value, inputs.intRate) })}
          />
          <p className="mt-1.5 text-[13px] leading-snug text-[var(--color-text-tertiary)]">Current HECM rates ~6–7%</p>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">
            Home appreciation (% /yr)
          </span>
          <input
            id="appr"
            type="number"
            step={0.1}
            className="min-h-[44px] w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 text-[15px] tabular-nums text-[#0B2A4A] md:min-h-[40px]"
            value={inputs.appr}
            onChange={(e) => patch({ appr: num(e.target.value, inputs.appr) })}
          />
          <p className="mt-1.5 text-[13px] leading-snug text-[var(--color-text-tertiary)]">MD/DC/VA historical ~3–4%</p>
        </label>
      </div>
    </div>
  );
}
