import type { Dispatch, SetStateAction } from "react";
import type { SEQInputs } from "../../../hooks/useSEQMath";
import { useLanguage } from "../../../i18n/LanguageContext";
import { DollarInput, PercentInput } from "../shared/FormattedInput";

type Props = {
  inputs: SEQInputs;
  setInputs: Dispatch<SetStateAction<SEQInputs>>;
};

const fieldClass =
  "mt-1.5 w-full rounded border border-slate-200 bg-white px-2 py-2 text-[13px] tabular-nums text-slate-900 outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]/40";

export function SEQPlanningInputs({ inputs, setInputs }: Props) {
  const { t } = useLanguage();
  const patch = (field: keyof SEQInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section className="mb-8 rounded-lg border border-[#C6A15B]/40 bg-amber-50/20 p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#C6A15B] text-[10px] text-white">
          ●
        </span>
        <h2 className="font-serif text-base font-semibold text-[#0B2A4A]">{t("tool.seq.planning.heading")}</h2>
      </div>
      <p className="mb-4 text-[12px] leading-relaxed text-slate-600">{t("tool.seq.planning.body")}</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block text-[12px] font-medium text-slate-700">
          {t("tool.seq.planning.reduction")}
          <DollarInput id="planReduction" value={inputs.planReduction} className={fieldClass} onChange={(n) => patch("planReduction", n)} />
          <span className="mt-1 block text-[11px] text-slate-500">{t("tool.seq.planning.reductionNote")}</span>
        </label>
        <label className="block text-[12px] font-medium text-slate-700">
          {t("tool.seq.planning.taxRate")}
          <PercentInput id="taxRate" value={inputs.taxRate} min={10} max={45} step={1} className={fieldClass} onChange={(n) => patch("taxRate", n)} />
          <span className="mt-1 block text-[11px] text-slate-500">{t("tool.seq.planning.taxRateNote")}</span>
        </label>
      </div>
    </section>
  );
}
