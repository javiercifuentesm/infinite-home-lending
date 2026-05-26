import type { WealthInputs } from "../../../hooks/useWealthMath";
import { useLanguage } from "../../../i18n/LanguageContext";
import { DollarInput, PercentInput } from "../shared/FormattedInput";

type Props = {
  inputs: WealthInputs;
  onChange: (next: WealthInputs) => void;
};

const labelClass = "mb-1.5 block font-[Lato,system-ui,sans-serif] text-[12px] font-semibold text-[#0B2A4A]";
const fieldClass =
  "w-full rounded-md border border-slate-200/90 bg-white px-3 py-2 font-[Lato,system-ui,sans-serif] text-[14px] text-slate-900 shadow-sm tabular-nums focus:border-[#C6A15B] focus:outline-none focus:ring-1 focus:ring-[#C6A15B]/40";

export function WTPurchaseInputs({ inputs, onChange }: Props) {
  const { t } = useLanguage();
  const set = <K extends keyof WealthInputs>(key: K, value: WealthInputs[K]) => onChange({ ...inputs, [key]: value });

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#185FA5] text-[11px] font-bold text-white">
          1
        </span>
        <h2 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">{t("wt.purchase.title")}</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="wt-hp" className={labelClass}>
            {t("wt.purchase.homePrice")}
          </label>
          <DollarInput id="wt-hp" value={inputs.hp} min={0} className={fieldClass} onChange={(n) => set("hp", Math.max(0, n))} />
        </div>
        <div>
          <label htmlFor="wt-dp" className={labelClass}>
            {t("wt.purchase.downPayment")}
          </label>
          <PercentInput
            id="wt-dp"
            value={inputs.dp}
            min={3}
            max={30}
            step={1}
            className={fieldClass}
            onChange={(n) => {
              const v = Math.round(n);
              set("dp", Math.min(30, Math.max(3, v)));
            }}
          />
        </div>
        <div>
          <label htmlFor="wt-rate" className={labelClass}>
            {t("wt.purchase.mortgageRate")}
          </label>
          <PercentInput id="wt-rate" value={inputs.rate} step={0.125} className={fieldClass} onChange={(n) => set("rate", n)} />
        </div>
        <div>
          <label htmlFor="wt-rent" className={labelClass}>
            {t("wt.purchase.monthlyRent")}
          </label>
          <DollarInput id="wt-rent" value={inputs.rent} min={0} className={fieldClass} onChange={(n) => set("rent", Math.max(0, n))} />
        </div>
      </div>
    </section>
  );
}
