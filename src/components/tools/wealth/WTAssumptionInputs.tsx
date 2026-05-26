import type { WealthInputs } from "../../../hooks/useWealthMath";
import { useLanguage } from "../../../i18n/LanguageContext";
import { PercentInput } from "../shared/FormattedInput";

type Props = {
  inputs: WealthInputs;
  onChange: (next: WealthInputs) => void;
};

const labelClass = "mb-1.5 block font-[Lato,system-ui,sans-serif] text-[12px] font-semibold text-[#0B2A4A]";
const fieldClass =
  "w-full rounded-md border border-slate-200/90 bg-white px-3 py-2 font-[Lato,system-ui,sans-serif] text-[14px] text-slate-900 shadow-sm tabular-nums focus:border-[#C6A15B] focus:outline-none focus:ring-1 focus:ring-[#C6A15B]/40";

export function WTAssumptionInputs({ inputs, onChange }: Props) {
  const { t } = useLanguage();
  const set = <K extends keyof WealthInputs>(key: K, value: WealthInputs[K]) => onChange({ ...inputs, [key]: value });

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3B6D11] text-[11px] font-bold text-white">
          2
        </span>
        <h2 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">{t("wt.assumptions.title")}</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label htmlFor="wt-appr" className={labelClass}>
            {t("wt.assumptions.appreciation")}
          </label>
          <PercentInput id="wt-appr" value={inputs.appr} step={0.1} className={fieldClass} onChange={(n) => set("appr", n)} />
          <p className="mt-1 text-[11px] text-slate-500">{t("wt.assumptions.appreciationHint")}</p>
        </div>
        <div>
          <label htmlFor="wt-rent-inc" className={labelClass}>
            {t("wt.assumptions.rentIncrease")}
          </label>
          <PercentInput id="wt-rent-inc" value={inputs.rentInc} step={0.1} className={fieldClass} onChange={(n) => set("rentInc", n)} />
          <p className="mt-1 text-[11px] text-slate-500">{t("wt.assumptions.rentIncreaseHint")}</p>
        </div>
        <div>
          <label htmlFor="wt-inv" className={labelClass}>
            {t("wt.assumptions.investReturn")}
          </label>
          <PercentInput id="wt-inv" value={inputs.invReturn} step={0.5} className={fieldClass} onChange={(n) => set("invReturn", n)} />
          <p className="mt-1 text-[11px] text-slate-500">{t("wt.assumptions.investReturnHint")}</p>
        </div>
        <div>
          <label htmlFor="wt-proptax" className={labelClass}>
            {t("wt.assumptions.propTax")}
          </label>
          <PercentInput id="wt-proptax" value={inputs.propTax} step={0.1} className={fieldClass} onChange={(n) => set("propTax", n)} />
          <p className="mt-1 text-[11px] text-slate-500">{t("wt.assumptions.propTaxHint")}</p>
        </div>
        <div>
          <label htmlFor="wt-maint" className={labelClass}>
            {t("wt.assumptions.maintenance")}
          </label>
          <PercentInput id="wt-maint" value={inputs.maint} step={0.1} className={fieldClass} onChange={(n) => set("maint", n)} />
          <p className="mt-1 text-[11px] text-slate-500">{t("wt.assumptions.maintenanceHint")}</p>
        </div>
        <div>
          <label htmlFor="wt-taxrate" className={labelClass}>
            {t("wt.assumptions.taxRate")}
          </label>
          <PercentInput
            id="wt-taxrate"
            value={inputs.taxRate}
            min={0}
            max={50}
            step={1}
            className={fieldClass}
            onChange={(n) => set("taxRate", Math.min(50, Math.max(0, n)))}
          />
          <p className="mt-1 text-[11px] text-slate-500">{t("wt.assumptions.taxRateHint")}</p>
        </div>
      </div>
    </section>
  );
}
