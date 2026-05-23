import type { RLEInputs } from "../../../hooks/useRLEMath";
import { useLanguage } from "../../../i18n/LanguageContext";
import { DollarInput, PercentInput } from "../shared/FormattedInput";

type Props = {
  inputs: RLEInputs;
  onChange: (next: RLEInputs) => void;
};

const labelClass = "mb-1.5 block font-[Lato,system-ui,sans-serif] text-[12px] font-semibold text-[#0B2A4A]";
const fieldClass =
  "w-full rounded-md border border-slate-200/90 bg-white px-3 py-2 font-[Lato,system-ui,sans-serif] text-[14px] text-slate-900 shadow-sm tabular-nums focus:border-[#C6A15B] focus:outline-none focus:ring-1 focus:ring-[#C6A15B]/40";

export function RLELoanInputs({ inputs, onChange }: Props) {
  const { t } = useLanguage();
  const set = <K extends keyof RLEInputs>(key: K, value: RLEInputs[K]) => onChange({ ...inputs, [key]: value });

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#185FA5] text-[11px] font-bold text-white">
          1
        </span>
        <h2 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">{t("tool.rle.loan.heading")}</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="rle-loan" className={labelClass}>
            {t("tool.rle.loan.amount")}
          </label>
          <DollarInput id="rle-loan" value={inputs.loan} min={0} className={fieldClass} onChange={(n) => set("loan", Math.max(0, n))} />
        </div>
        <div>
          <label htmlFor="rle-rate" className={labelClass}>
            {t("tool.rle.loan.rate")}
          </label>
          <PercentInput id="rle-rate" value={inputs.rate} step={0.125} className={fieldClass} onChange={(n) => set("rate", n)} />
        </div>
        <div>
          <label htmlFor="rle-term" className={labelClass}>
            {t("tool.rle.loan.term")}
          </label>
          <select
            id="rle-term"
            value={inputs.term}
            onChange={(e) => set("term", parseInt(e.target.value, 10) as 15 | 30)}
            className={fieldClass}
          >
            <option value={30}>{t("tool.rle.loan.term30")}</option>
            <option value={15}>{t("tool.rle.loan.term15")}</option>
          </select>
        </div>
        <div>
          <label htmlFor="rle-days" className={labelClass}>
            {t("tool.rle.loan.days")}
          </label>
          <input
            id="rle-days"
            type="number"
            min={7}
            max={120}
            step={1}
            value={inputs.daysToClose}
            onChange={(e) => {
              const v = Math.round(parseFloat(e.target.value) || 7);
              set("daysToClose", Math.min(120, Math.max(7, v)));
            }}
            className={fieldClass}
          />
          <p className="mt-1 text-[11px] text-slate-500">{t("tool.rle.loan.daysNote")}</p>
        </div>
      </div>
    </section>
  );
}
