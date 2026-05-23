import type { CreditInputs } from "../../../hooks/useCreditMath";
import { SCORE_TIERS } from "../../../hooks/useCreditMath";
import { useLanguage } from "../../../i18n/LanguageContext";
import { DollarInput, PercentInput } from "../shared/FormattedInput";

type Props = {
  inputs: CreditInputs;
  onChange: (next: CreditInputs) => void;
  showInvalidTgtNote: boolean;
};

const labelCls = "mb-1 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0B2A4A]/70";
const fieldCls =
  "w-full rounded-md border border-[var(--color-border-tertiary,#e2e8f0)] bg-white px-3 py-2 text-[14px] text-[#0B2A4A] outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]/30 tabular-nums";

export function CreditSituationInputs({ inputs, onChange, showInvalidTgtNote }: Props) {
  const { t } = useLanguage();
  const set = (patch: Partial<CreditInputs>) => onChange({ ...inputs, ...patch });
  const tierLbl = (value: number) => t(`tool.credit.tierOpt.${value}`);

  const curOptions = SCORE_TIERS.filter(
    (tier) => tier.value < inputs.tgtScore || (tier.value === 760 && inputs.tgtScore === 760),
  );
  const tgtOptions = SCORE_TIERS.filter(
    (tier) => (tier.value > inputs.curScore && tier.value >= 620) || (tier.value === 760 && inputs.curScore === 760),
  );

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div>
        <label htmlFor="hp" className={labelCls}>
          {t("tool.credit.input.hp")}
        </label>
        <DollarInput id="hp" value={inputs.hp} min={0} className={fieldCls} onChange={(n) => set({ hp: Math.max(0, n) })} />
      </div>
      <div>
        <label htmlFor="dp" className={labelCls}>
          {t("tool.credit.input.dp")}
        </label>
        <PercentInput
          id="dp"
          value={inputs.dp}
          step={0.5}
          min={3}
          max={30}
          className={fieldCls}
          onChange={(n) => set({ dp: Math.min(30, Math.max(3, n)) })}
        />
      </div>
      <div>
        <label htmlFor="curScore" className={labelCls}>
          {t("tool.credit.input.curScore")}
        </label>
        <select
          id="curScore"
          className={fieldCls}
          value={inputs.curScore}
          onChange={(e) => set({ curScore: Number(e.target.value) })}
        >
          {curOptions.map((tier) => (
            <option key={tier.value} value={tier.value}>
              {tierLbl(tier.value)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="tgtScore" className={labelCls}>
          {t("tool.credit.input.tgtScore")}
        </label>
        <select
          id="tgtScore"
          className={fieldCls}
          value={inputs.tgtScore}
          onChange={(e) => set({ tgtScore: Number(e.target.value) })}
        >
          {tgtOptions.map((tier) => (
            <option key={tier.value} value={tier.value}>
              {tierLbl(tier.value)}
            </option>
          ))}
        </select>
        {showInvalidTgtNote ? (
          <p className="mt-1.5 text-[11px] text-amber-800">{t("tool.credit.input.tgtScoreWarn")}</p>
        ) : null}
      </div>
      <div>
        <label htmlFor="term" className={labelCls}>
          {t("tool.credit.input.term")}
        </label>
        <select
          id="term"
          className={fieldCls}
          value={inputs.term}
          onChange={(e) => set({ term: Number(e.target.value) })}
        >
          <option value={30}>{t("tool.credit.input.term30")}</option>
          <option value={15}>{t("tool.credit.input.term15")}</option>
        </select>
      </div>
      <div>
        <label htmlFor="timeframe" className={labelCls}>
          {t("tool.credit.input.timeframe")}
        </label>
        <p className="mb-1 text-[10px] text-slate-500">{t("tool.credit.input.timeframeNote")}</p>
        <select
          id="timeframe"
          className={fieldCls}
          value={inputs.timeframe}
          onChange={(e) => set({ timeframe: Number(e.target.value) })}
        >
          <option value={3}>{t("tool.credit.input.mo3")}</option>
          <option value={6}>{t("tool.credit.input.mo6")}</option>
          <option value={9}>{t("tool.credit.input.mo9")}</option>
          <option value={12}>{t("tool.credit.input.mo12")}</option>
        </select>
      </div>
    </div>
  );
}
