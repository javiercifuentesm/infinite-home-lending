import type { ReverseInputs } from "../../../hooks/useReverseMath";
import { useLanguage } from "../../../i18n/LanguageContext";
import { DollarInput, PercentInput } from "../shared/FormattedInput";

type Props = {
  inputs: ReverseInputs;
  onChange: (next: ReverseInputs) => void;
};

const fieldClass =
  "min-h-[44px] w-full rounded-lg border border-[var(--color-border-tertiary,#e2e8f0)] bg-white px-3 py-2.5 text-[15px] tabular-nums text-[#0B2A4A] outline-none focus:ring-2 focus:ring-[#C6A15B]/40 md:min-h-[40px]";

export function ReverseIncomeInputs({ inputs, onChange }: Props) {
  const { t } = useLanguage();
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
            {t("tool.reverse.income.eyebrow")}
          </p>
          <h2 className="font-[Georgia,serif] text-lg font-semibold text-[#0B2A4A]">{t("tool.reverse.income.heading")}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">
            {t("tool.reverse.income.retIncome")}
          </span>
          <DollarInput id="retIncome" value={inputs.retIncome} min={0} className={fieldClass} onChange={(n) => patch({ retIncome: n })} />
          <p className="mt-1.5 text-[13px] leading-snug text-[var(--color-text-tertiary)]">{t("tool.reverse.income.retIncomeNote")}</p>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">
            {t("tool.reverse.income.retExpenses")}
          </span>
          <DollarInput
            id="retExpenses"
            value={inputs.retExpenses}
            min={0}
            className={fieldClass}
            onChange={(n) => patch({ retExpenses: n })}
          />
          <p className="mt-1.5 text-[13px] leading-snug text-[var(--color-text-tertiary)]">{t("tool.reverse.income.retExpensesNote")}</p>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">
            {t("tool.reverse.income.intRate")}
          </span>
          <PercentInput id="intRate" value={inputs.intRate} step={0.05} min={0} className={fieldClass} onChange={(n) => patch({ intRate: n })} />
          <p className="mt-1.5 text-[13px] leading-snug text-[var(--color-text-tertiary)]">{t("tool.reverse.income.intRateNote")}</p>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">
            {t("tool.reverse.income.appr")}
          </span>
          <PercentInput id="rev-appr-income" value={inputs.appr} step={0.1} className={fieldClass} onChange={(n) => patch({ appr: n })} />
          <p className="mt-1.5 text-[13px] leading-snug text-[var(--color-text-tertiary)]">{t("tool.reverse.income.apprNote")}</p>
        </label>
      </div>
    </div>
  );
}
