import type { RLEInputs, RiskTol } from "../../../hooks/useRLEMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = {
  inputs: RLEInputs;
  onChange: (next: RLEInputs) => void;
};

const labelClass = "mb-1.5 block font-[Lato,system-ui,sans-serif] text-[12px] font-semibold text-[#0B2A4A]";
const inputClass =
  "w-full rounded-md border border-slate-200/90 bg-white px-3 py-2 font-[Lato,system-ui,sans-serif] text-[14px] text-slate-900 shadow-sm focus:border-[#C6A15B] focus:outline-none focus:ring-1 focus:ring-[#C6A15B]/40";

export function RLEExtensionInputs({ inputs, onChange }: Props) {
  const { t } = useLanguage();
  const set = <K extends keyof RLEInputs>(key: K, value: RLEInputs[K]) => onChange({ ...inputs, [key]: value });

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3B6D11] text-[11px] font-bold text-white">
          3
        </span>
        <h2 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">{t("tool.rle.ext.heading")}</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="rle-ext" className={labelClass}>
            {t("tool.rle.ext.fee")}
          </label>
          <select
            id="rle-ext"
            value={String(inputs.extFee)}
            onChange={(e) => set("extFee", parseFloat(e.target.value))}
            className={inputClass}
          >
            <option value="0.0625">{t("tool.rle.ext.fee0625")}</option>
            <option value="0.125">{t("tool.rle.ext.fee125")}</option>
            <option value="0.25">{t("tool.rle.ext.fee25")}</option>
          </select>
        </div>
        <div>
          <label htmlFor="rle-float-cost" className={labelClass}>
            {t("tool.rle.ext.floatCost")}
          </label>
          <select
            id="rle-float-cost"
            value={String(inputs.floatCost)}
            onChange={(e) => set("floatCost", parseFloat(e.target.value))}
            className={inputClass}
          >
            <option value="0">{t("tool.rle.ext.floatNone")}</option>
            <option value="0.125">{t("tool.rle.ext.float125")}</option>
            <option value="0.25">{t("tool.rle.ext.float25")}</option>
            <option value="0.5">{t("tool.rle.ext.float50")}</option>
          </select>
        </div>
        <div>
          <label htmlFor="rle-float-thresh" className={labelClass}>
            {t("tool.rle.ext.floatThresh")}
          </label>
          <select
            id="rle-float-thresh"
            value={String(inputs.floatThresh)}
            onChange={(e) => set("floatThresh", parseFloat(e.target.value))}
            className={inputClass}
          >
            <option value="0.25">{t("tool.rle.ext.thresh25")}</option>
            <option value="0.375">{t("tool.rle.ext.thresh375")}</option>
            <option value="0.5">{t("tool.rle.ext.thresh50")}</option>
          </select>
          <p className="mt-1 text-[11px] text-slate-500">{t("tool.rle.ext.threshNote")}</p>
        </div>
        <div>
          <label htmlFor="rle-risk" className={labelClass}>
            {t("tool.rle.ext.riskTol")}
          </label>
          <select
            id="rle-risk"
            value={inputs.riskTol}
            onChange={(e) => set("riskTol", e.target.value as RiskTol)}
            className={inputClass}
          >
            <option value="low">{t("tool.rle.ext.riskLow")}</option>
            <option value="medium">{t("tool.rle.ext.riskMedium")}</option>
            <option value="high">{t("tool.rle.ext.riskHigh")}</option>
          </select>
        </div>
      </div>
    </section>
  );
}
