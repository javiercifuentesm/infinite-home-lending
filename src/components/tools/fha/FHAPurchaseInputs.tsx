import type { FHAInputs } from "../../../hooks/useFHAMath";
import { DollarInput, PercentInput } from "../shared/FormattedInput";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = {
  inputs: FHAInputs;
  onChange: (next: FHAInputs) => void;
};

const fieldClass =
  "w-full rounded-lg border border-[var(--color-border-tertiary,#e2e8f0)] bg-white px-3 py-2.5 text-[15px] tabular-nums text-[#0B2A4A] outline-none focus:ring-2 focus:ring-[#C6A15B]/40";

export function FHAPurchaseInputs({ inputs, onChange }: Props) {
  const { t } = useLanguage();
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
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-text-tertiary)]">{t("tool.fha.purchase.eyebrow")}</p>
          <h2 className="font-[Georgia,serif] text-lg font-semibold text-[#0B2A4A]">{t("tool.fha.purchase.heading")}</h2>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">{t("tool.fha.purchase.hp")}</span>
          <DollarInput id="fha-hp" value={inputs.hp} min={50000} className={fieldClass} onChange={(n) => patch({ hp: n })} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">{t("tool.fha.purchase.dp")}</span>
          <PercentInput
            id="fha-dp"
            value={inputs.dp}
            min={3}
            max={25}
            step={0.5}
            className={fieldClass}
            onChange={(n) => patch({ dp: n })}
          />
          <span className="mt-1 block text-[11px] text-[var(--color-text-tertiary)]">{t("tool.fha.purchase.dpNote")}</span>
          {warnMinFha ? (
            <span className="mt-2 block text-[12px] font-medium text-[#854F0B]">{t("tool.fha.purchase.dpWarn")}</span>
          ) : null}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">{t("tool.fha.purchase.cs")}</span>
          <select
            value={inputs.cs}
            onChange={(e) => patch({ cs: Number(e.target.value) })}
            className="w-full rounded-lg border border-[var(--color-border-tertiary)] bg-white px-3 py-2.5 text-[15px] text-[#0B2A4A]"
          >
            <option value={760}>{t("tool.fha.purchase.cs760")}</option>
            <option value={720}>{t("tool.fha.purchase.cs720")}</option>
            <option value={680}>{t("tool.fha.purchase.cs680")}</option>
            <option value={640}>{t("tool.fha.purchase.cs640")}</option>
            <option value={600}>{t("tool.fha.purchase.cs600")}</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">{t("tool.fha.purchase.appr")}</span>
          <PercentInput id="fha-appr" value={inputs.appr} min={0} step={0.1} className={fieldClass} onChange={(n) => patch({ appr: n })} />
          <span className="mt-1 block text-[11px] text-[var(--color-text-tertiary)]">{t("tool.fha.purchase.apprNote")}</span>
        </label>
      </div>
    </div>
  );
}
