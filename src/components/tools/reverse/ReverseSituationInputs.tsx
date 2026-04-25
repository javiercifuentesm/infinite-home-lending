import type { ReverseInputs } from "../../../hooks/useReverseMath";

type Props = {
  inputs: ReverseInputs;
  onChange: (next: ReverseInputs) => void;
};

function num(v: string, fallback: number): number {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
}

export function ReverseSituationInputs({ inputs, onChange }: Props) {
  const patch = (p: Partial<ReverseInputs>) => onChange({ ...inputs, ...p });

  const coWarn =
    inputs.coAge != null && inputs.coAge > 0 && inputs.coAge < 62;

  return (
    <div className="rounded-xl border border-[var(--color-border-tertiary)] bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#0B2A4A]"
          style={{ background: "#E6F1FB" }}
          aria-hidden
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" />
          </svg>
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-text-tertiary)]">Your situation</p>
          <h2 className="font-[Georgia,serif] text-lg font-semibold text-[#0B2A4A]">Home &amp; borrower</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">
            Home value ($)
          </span>
          <input
            id="homeVal"
            type="number"
            step={5000}
            min={0}
            className="min-h-[44px] w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 text-[15px] tabular-nums text-[#0B2A4A] md:min-h-[40px]"
            value={inputs.homeVal}
            onChange={(e) => patch({ homeVal: num(e.target.value, inputs.homeVal) })}
          />
          <p className="mt-1.5 text-[13px] leading-snug text-[var(--color-text-tertiary)]">Current estimated market value</p>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">
            Mortgage balance ($)
          </span>
          <input
            id="mortBal"
            type="number"
            step={1000}
            min={0}
            className="min-h-[44px] w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 text-[15px] tabular-nums text-[#0B2A4A] md:min-h-[40px]"
            value={inputs.mortBal}
            onChange={(e) => patch({ mortBal: num(e.target.value, inputs.mortBal) })}
          />
          <p className="mt-1.5 text-[13px] leading-snug text-[var(--color-text-tertiary)]">0 if home is paid off</p>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">
            Age of youngest borrower
          </span>
          <input
            id="age"
            type="number"
            min={62}
            max={95}
            step={1}
            className="min-h-[44px] w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 text-[15px] tabular-nums text-[#0B2A4A] md:min-h-[40px]"
            value={inputs.age}
            onChange={(e) => patch({ age: Math.round(num(e.target.value, inputs.age)) })}
          />
          <p className="mt-1.5 text-[13px] leading-snug text-[var(--color-text-tertiary)]">Must be 62+ for HECM</p>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">
            Co-borrower age (optional)
          </span>
          <input
            id="coAge"
            type="number"
            min={62}
            max={95}
            step={1}
            placeholder="Leave blank if none"
            className="min-h-[44px] w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 text-[15px] tabular-nums text-[#0B2A4A] md:min-h-[40px]"
            value={inputs.coAge ?? ""}
            onChange={(e) => {
              const raw = e.target.value.trim();
              if (raw === "") patch({ coAge: null });
              else patch({ coAge: Math.round(num(raw, 70)) });
            }}
          />
          <p className="mt-1.5 text-[13px] leading-snug text-[var(--color-text-tertiary)]">Used to determine effective qualifying age</p>
          {coWarn ? (
            <p className="mt-2 text-[13px] font-medium text-[#854F0B]">Co-borrower must also be 62+ for HECM eligibility.</p>
          ) : null}
        </label>
      </div>
    </div>
  );
}
