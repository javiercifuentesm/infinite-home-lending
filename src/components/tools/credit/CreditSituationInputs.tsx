import type { CreditInputs } from "../../../hooks/useCreditMath";
import { SCORE_TIERS } from "../../../hooks/useCreditMath";

type Props = {
  inputs: CreditInputs;
  onChange: (next: CreditInputs) => void;
  showInvalidTgtNote: boolean;
};

const labelCls = "mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0B2A4A]/70";
const inputCls =
  "w-full rounded-md border border-[var(--color-border-tertiary,#e2e8f0)] bg-white px-3 py-2 text-[14px] text-[#0B2A4A] outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]/30";

export function CreditSituationInputs({ inputs, onChange, showInvalidTgtNote }: Props) {
  const set = (patch: Partial<CreditInputs>) => onChange({ ...inputs, ...patch });

  const curOptions = SCORE_TIERS.filter(
    (t) => t.value < inputs.tgtScore || (t.value === 760 && inputs.tgtScore === 760),
  );
  const tgtOptions = SCORE_TIERS.filter(
    (t) => (t.value > inputs.curScore && t.value >= 620) || (t.value === 760 && inputs.curScore === 760),
  );

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div>
        <label htmlFor="hp" className={labelCls}>
          Home price ($)
        </label>
        <input
          id="hp"
          type="number"
          step={5000}
          className={inputCls}
          value={inputs.hp}
          onChange={(e) => set({ hp: Math.max(0, Number(e.target.value) || 0) })}
        />
      </div>
      <div>
        <label htmlFor="dp" className={labelCls}>
          Down payment (%)
        </label>
        <input
          id="dp"
          type="number"
          step={0.5}
          min={3}
          max={30}
          className={inputCls}
          value={inputs.dp}
          onChange={(e) => {
            const v = Number(e.target.value);
            set({ dp: Math.min(30, Math.max(3, v || 0)) });
          }}
        />
      </div>
      <div>
        <label htmlFor="curScore" className={labelCls}>
          Current credit score
        </label>
        <select
          id="curScore"
          className={inputCls}
          value={inputs.curScore}
          onChange={(e) => set({ curScore: Number(e.target.value) })}
        >
          {curOptions.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="tgtScore" className={labelCls}>
          Target credit score
        </label>
        <select
          id="tgtScore"
          className={inputCls}
          value={inputs.tgtScore}
          onChange={(e) => set({ tgtScore: Number(e.target.value) })}
        >
          {tgtOptions.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        {showInvalidTgtNote ? (
          <p className="mt-1.5 text-[11px] text-amber-800">Target score must be higher than your current score.</p>
        ) : null}
      </div>
      <div>
        <label htmlFor="term" className={labelCls}>
          Loan term (years)
        </label>
        <select
          id="term"
          className={inputCls}
          value={inputs.term}
          onChange={(e) => set({ term: Number(e.target.value) })}
        >
          <option value={30}>30 years</option>
          <option value={15}>15 years</option>
        </select>
      </div>
      <div>
        <label htmlFor="timeframe" className={labelCls}>
          Time to improve score (months)
        </label>
        <p className="mb-1 text-[10px] text-slate-500">How long improvement typically takes</p>
        <select
          id="timeframe"
          className={inputCls}
          value={inputs.timeframe}
          onChange={(e) => set({ timeframe: Number(e.target.value) })}
        >
          <option value={3}>3 months</option>
          <option value={6}>6 months</option>
          <option value={9}>9 months</option>
          <option value={12}>12 months</option>
        </select>
      </div>
    </div>
  );
}
