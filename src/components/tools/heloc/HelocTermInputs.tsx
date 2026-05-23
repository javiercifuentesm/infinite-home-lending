import type { HelocInputs } from "../../../hooks/useHelocMath";
import { useLanguage } from "../../../i18n/LanguageContext";
import { DollarInput, PercentInput } from "../shared/FormattedInput";

type Props = { inputs: HelocInputs; onChange: (next: HelocInputs) => void };

const fieldClass =
  "min-h-[44px] w-full rounded-lg border border-[var(--color-border-tertiary,#e2e8f0)] bg-white px-3 py-2.5 text-[15px] tabular-nums text-[#0B2A4A] outline-none focus:ring-2 focus:ring-[#C6A15B]/40 md:min-h-[40px]";

export function HelocTermInputs({ inputs, onChange }: Props) {
  const { t } = useLanguage();
  const patch = (p: Partial<HelocInputs>) => onChange({ ...inputs, ...p });

  return (
    <div className="rounded-xl border border-[var(--color-border-tertiary)] bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#27500A]" style={{ background: "#EAF3DE" }} aria-hidden>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M4 6h16M4 12h10M4 18h16" strokeLinecap="round" />
          </svg>
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-text-tertiary)]">{t("tool.heloc.terms.eyebrow")}</p>
          <h2 className="font-[Georgia,serif] text-lg font-semibold text-[#0B2A4A]">{t("tool.heloc.terms.heading")}</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">{t("tool.heloc.terms.draw")}</span>
          <DollarInput id="draw" value={inputs.draw} min={0} className={fieldClass} onChange={(n) => patch({ draw: n })} />
          <p className="mt-1.5 text-[13px] text-[var(--color-text-tertiary)]">{t("tool.heloc.terms.drawNote")}</p>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">{t("tool.heloc.terms.rate")}</span>
          <PercentInput id="rate" value={inputs.rate} step={0.05} min={0} className={fieldClass} onChange={(n) => patch({ rate: n })} />
          <p className="mt-1.5 text-[13px] text-[var(--color-text-tertiary)]">{t("tool.heloc.terms.rateNote")}</p>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">{t("tool.heloc.terms.drawYrs")}</span>
          <select
            id="drawYrs"
            className="min-h-[44px] w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 text-[15px] text-[#0B2A4A] md:min-h-[40px]"
            value={inputs.drawYrs}
            onChange={(e) => patch({ drawYrs: Number(e.target.value) })}
          >
            <option value={5}>{t("tool.heloc.terms.yr5")}</option>
            <option value={10}>{t("tool.heloc.terms.yr10")}</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">{t("tool.heloc.terms.repayYrs")}</span>
          <select
            id="repayYrs"
            className="min-h-[44px] w-full rounded-lg border border-[var(--color-border-tertiary)] px-3 py-2.5 text-[15px] text-[#0B2A4A] md:min-h-[40px]"
            value={inputs.repayYrs}
            onChange={(e) => patch({ repayYrs: Number(e.target.value) })}
          >
            <option value={10}>{t("tool.heloc.terms.yr10")}</option>
            <option value={15}>{t("tool.heloc.terms.yr15")}</option>
            <option value={20}>{t("tool.heloc.terms.yr20")}</option>
          </select>
        </label>
      </div>
    </div>
  );
}
