import type { FHAInputs } from "../../../hooks/useFHAMath";
import { PercentInput } from "../shared/FormattedInput";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = {
  inputs: FHAInputs;
  onChange: (next: FHAInputs) => void;
};

const fieldClass =
  "w-full rounded-lg border border-[var(--color-border-tertiary,#e2e8f0)] bg-white px-3 py-2.5 text-[15px] tabular-nums text-[#0B2A4A] outline-none focus:ring-2 focus:ring-[#C6A15B]/40";

export function FHARateInputs({ inputs, onChange }: Props) {
  const { t } = useLanguage();
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
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-text-tertiary)]">{t("tool.fha.rates.eyebrow")}</p>
          <h2 className="font-[Georgia,serif] text-lg font-semibold text-[#0B2A4A]">{t("tool.fha.rates.heading")}</h2>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">{t("tool.fha.rates.convRate")}</span>
          <PercentInput id="fha-convRate" value={inputs.convRate} min={0} step={0.05} className={fieldClass} onChange={(n) => patch({ convRate: n })} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">{t("tool.fha.rates.fhaRate")}</span>
          <PercentInput id="fha-fhaRate" value={inputs.fhaRate} min={0} step={0.05} className={fieldClass} onChange={(n) => patch({ fhaRate: n })} />
          <span className="mt-1 block text-[11px] text-[var(--color-text-tertiary)]">{t("tool.fha.rates.fhaRateNote")}</span>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">{t("tool.fha.rates.term")}</span>
          <select
            value={inputs.term}
            onChange={(e) => patch({ term: Number(e.target.value) })}
            className="w-full rounded-lg border border-[var(--color-border-tertiary)] bg-white px-3 py-2.5 text-[15px] text-[#0B2A4A]"
          >
            <option value={30}>{t("tool.fha.rates.term30")}</option>
            <option value={15}>{t("tool.fha.rates.term15")}</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">{t("tool.fha.rates.stay")}</span>
          <select
            value={inputs.stay}
            onChange={(e) => patch({ stay: Number(e.target.value) })}
            className="w-full rounded-lg border border-[var(--color-border-tertiary)] bg-white px-3 py-2.5 text-[15px] text-[#0B2A4A]"
          >
            <option value={5}>{t("tool.fha.rates.stay5")}</option>
            <option value={7}>{t("tool.fha.rates.stay7")}</option>
            <option value={15}>{t("tool.fha.rates.stay15")}</option>
            <option value={30}>{t("tool.fha.rates.stay30")}</option>
          </select>
        </label>
      </div>
    </div>
  );
}
