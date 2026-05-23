import type { RLEInputs, RateEnv } from "../../../hooks/useRLEMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = {
  inputs: RLEInputs;
  onChange: (next: RLEInputs) => void;
};

const labelClass = "mb-1.5 block font-[Lato,system-ui,sans-serif] text-[12px] font-semibold text-[#0B2A4A]";
const inputClass =
  "w-full rounded-md border border-slate-200/90 bg-white px-3 py-2 font-[Lato,system-ui,sans-serif] text-[14px] text-slate-900 shadow-sm focus:border-[#C6A15B] focus:outline-none focus:ring-1 focus:ring-[#C6A15B]/40";

export function RLEScenarioInputs({ inputs, onChange }: Props) {
  const { t } = useLanguage();
  const set = <K extends keyof RLEInputs>(key: K, value: RLEInputs[K]) => onChange({ ...inputs, [key]: value });

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C6A15B] text-[11px] font-bold text-[#633806]">
          2
        </span>
        <h2 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">{t("tool.rle.scenario.heading")}</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="rle-rise" className={labelClass}>
            {t("tool.rle.scenario.rise")}
          </label>
          <select
            id="rle-rise"
            value={String(inputs.riseScenario)}
            onChange={(e) => set("riseScenario", parseFloat(e.target.value))}
            className={inputClass}
          >
            <option value="0.125">{t("tool.rle.scenario.rise125")}</option>
            <option value="0.25">{t("tool.rle.scenario.rise25")}</option>
            <option value="0.375">{t("tool.rle.scenario.rise375")}</option>
            <option value="0.5">{t("tool.rle.scenario.rise50")}</option>
            <option value="0.75">{t("tool.rle.scenario.rise75")}</option>
          </select>
          <p className="mt-1 text-[11px] text-slate-500">{t("tool.rle.scenario.riseNote")}</p>
        </div>
        <div>
          <label htmlFor="rle-drop" className={labelClass}>
            {t("tool.rle.scenario.drop")}
          </label>
          <select
            id="rle-drop"
            value={String(inputs.dropScenario)}
            onChange={(e) => set("dropScenario", parseFloat(e.target.value))}
            className={inputClass}
          >
            <option value="0.125">{t("tool.rle.scenario.drop125")}</option>
            <option value="0.25">{t("tool.rle.scenario.drop25")}</option>
            <option value="0.375">{t("tool.rle.scenario.drop375")}</option>
            <option value="0.5">{t("tool.rle.scenario.drop50")}</option>
          </select>
          <p className="mt-1 text-[11px] text-slate-500">{t("tool.rle.scenario.dropNote")}</p>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="rle-env" className={labelClass}>
            {t("tool.rle.scenario.env")}
          </label>
          <select
            id="rle-env"
            value={inputs.rateEnv}
            onChange={(e) => set("rateEnv", e.target.value as RateEnv)}
            className={inputClass}
          >
            <option value="volatile">{t("tool.rle.scenario.envVolatile")}</option>
            <option value="rising">{t("tool.rle.scenario.envRising")}</option>
            <option value="falling">{t("tool.rle.scenario.envFalling")}</option>
            <option value="stable">{t("tool.rle.scenario.envStable")}</option>
          </select>
        </div>
      </div>
    </section>
  );
}
