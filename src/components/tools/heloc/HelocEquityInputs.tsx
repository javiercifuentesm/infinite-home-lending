import type { HelocInputs } from "../../../hooks/useHelocMath";
import { useLanguage } from "../../../i18n/LanguageContext";
import { DollarInput } from "../shared/FormattedInput";

type Props = { inputs: HelocInputs; onChange: (next: HelocInputs) => void };

const fieldClass =
  "min-h-[44px] w-full rounded-lg border border-[var(--color-border-tertiary,#e2e8f0)] bg-white px-3 py-2.5 text-[15px] tabular-nums text-[#0B2A4A] outline-none focus:ring-2 focus:ring-[#C6A15B]/40 md:min-h-[40px]";

export function HelocEquityInputs({ inputs, onChange }: Props) {
  const { t } = useLanguage();
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
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-text-tertiary)]">{t("tool.heloc.equity.eyebrow")}</p>
          <h2 className="font-[Georgia,serif] text-lg font-semibold text-[#0B2A4A]">{t("tool.heloc.equity.heading")}</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">{t("tool.heloc.equity.hv")}</span>
          <DollarInput id="hv" value={inputs.hv} min={0} className={fieldClass} onChange={(n) => patch({ hv: n })} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">{t("tool.heloc.equity.mb")}</span>
          <DollarInput id="mb" value={inputs.mb} min={0} className={fieldClass} onChange={(n) => patch({ mb: n })} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">{t("tool.heloc.equity.cltv")}</span>
          <select
            id="cltv"
            className="min-h-[44px] w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 text-[15px] text-[#0B2A4A] md:min-h-[40px]"
            value={inputs.cltv}
            onChange={(e) => patch({ cltv: Number(e.target.value) })}
          >
            <option value={85}>{t("tool.heloc.equity.cltv85")}</option>
            <option value={90}>{t("tool.heloc.equity.cltv90")}</option>
            <option value={80}>{t("tool.heloc.equity.cltv80")}</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">{t("tool.heloc.equity.credit")}</span>
          <select
            id="credit"
            className="min-h-[44px] w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 text-[15px] text-[#0B2A4A] md:min-h-[40px]"
            value={inputs.credit}
            onChange={(e) => patch({ credit: Number(e.target.value) })}
          >
            <option value={760}>{t("tool.heloc.equity.credit760")}</option>
            <option value={720}>{t("tool.heloc.equity.credit720")}</option>
            <option value={680}>{t("tool.heloc.equity.credit680")}</option>
            <option value={640}>{t("tool.heloc.equity.credit640")}</option>
          </select>
        </label>
      </div>
    </div>
  );
}
