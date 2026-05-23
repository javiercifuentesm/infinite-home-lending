import type { PowerMapInputs } from "../../../hooks/usePowerMapMath";
import { useLanguage } from "../../../i18n/LanguageContext";
import { DollarInput } from "../shared/FormattedInput";

type Props = {
  inputs: PowerMapInputs;
  onChange: (next: PowerMapInputs) => void;
};

const labelClass = "mb-1.5 block font-[Lato,system-ui,sans-serif] text-[12px] font-semibold text-[#0B2A4A]";
const fieldClass =
  "w-full rounded-md border border-slate-200/90 bg-white px-3 py-2 font-[Lato,system-ui,sans-serif] text-[14px] text-slate-900 shadow-sm tabular-nums focus:border-[#C6A15B] focus:outline-none focus:ring-1 focus:ring-[#C6A15B]/40";

export function PMFinancialInputs({ inputs, onChange }: Props) {
  const { t } = useLanguage();
  const set = <K extends keyof PowerMapInputs>(key: K, value: PowerMapInputs[K]) =>
    onChange({ ...inputs, [key]: value });

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#185FA5] text-[11px] font-bold text-white">
          1
        </span>
        <h2 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">{t("tool.pm.inputs.heading")}</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="pm-income" className={labelClass}>
            {t("tool.pm.inputs.income")}
          </label>
          <DollarInput id="pm-income" value={inputs.income} min={0} className={fieldClass} onChange={(n) => set("income", Math.max(0, n))} />
        </div>
        <div>
          <label htmlFor="pm-debts" className={labelClass}>
            {t("tool.pm.inputs.debts")}
          </label>
          <DollarInput id="pm-debts" value={inputs.debts} min={0} className={fieldClass} onChange={(n) => set("debts", Math.max(0, n))} />
          <p className="mt-1 text-[11px] text-slate-500">{t("tool.pm.inputs.debtsNote")}</p>
        </div>
        <div>
          <label htmlFor="pm-score" className={labelClass}>
            {t("tool.pm.inputs.score")}
          </label>
          <select
            id="pm-score"
            value={inputs.scoreBase}
            onChange={(e) => set("scoreBase", parseInt(e.target.value, 10))}
            className={fieldClass}
          >
            <option value={580}>{t("tool.pm.inputs.score580")}</option>
            <option value={620}>{t("tool.pm.inputs.score620")}</option>
            <option value={640}>{t("tool.pm.inputs.score640")}</option>
            <option value={660}>{t("tool.pm.inputs.score660")}</option>
            <option value={680}>{t("tool.pm.inputs.score680")}</option>
            <option value={700}>{t("tool.pm.inputs.score700")}</option>
            <option value={720}>{t("tool.pm.inputs.score720")}</option>
            <option value={740}>{t("tool.pm.inputs.score740")}</option>
          </select>
        </div>
        <div>
          <label htmlFor="pm-savings" className={labelClass}>
            {t("tool.pm.inputs.savings")}
          </label>
          <DollarInput id="pm-savings" value={inputs.savings} min={0} className={fieldClass} onChange={(n) => set("savings", Math.max(0, n))} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="pm-savings-rate" className={labelClass}>
            {t("tool.pm.inputs.savingsRate")}
          </label>
          <DollarInput
            id="pm-savings-rate"
            value={inputs.savingsRate}
            min={0}
            className={fieldClass}
            onChange={(n) => set("savingsRate", Math.max(0, n))}
          />
          <p className="mt-1 text-[11px] text-slate-500">{t("tool.pm.inputs.savingsRateNote")}</p>
        </div>
      </div>
    </section>
  );
}
