import type { Dispatch, SetStateAction } from "react";
import type { SEQInputs } from "../../../hooks/useSEQMath";
import { useLanguage } from "../../../i18n/LanguageContext";
import { DollarInput } from "../shared/FormattedInput";

type Props = {
  inputs: SEQInputs;
  setInputs: Dispatch<SetStateAction<SEQInputs>>;
};

const mainFieldClass =
  "mt-1.5 w-full rounded border border-slate-200 bg-white px-2 py-2 text-[13px] tabular-nums text-slate-900 outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]/40";

const rowFieldClass =
  "h-[30px] w-[120px] shrink-0 rounded border border-slate-200 bg-white px-2 text-[12px] tabular-nums text-slate-900 outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]/40";

export function SEQTaxReturnInputs({ inputs, setInputs }: Props) {
  const { t } = useLanguage();
  const patch = (field: keyof SEQInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const addRows: { field: keyof SEQInputs; label: string; tag: string }[] = [
    { field: "ab_dep", label: t("tool.seq.tax.ab.dep"), tag: t("tool.seq.tax.tagAdds") },
    { field: "ab_dep2", label: t("tool.seq.tax.ab.dep2"), tag: t("tool.seq.tax.tagAdds") },
    { field: "ab_home", label: t("tool.seq.tax.ab.home"), tag: t("tool.seq.tax.tagAdds") },
    { field: "ab_loss", label: t("tool.seq.tax.ab.loss"), tag: t("tool.seq.tax.tagAdds") },
    { field: "ab_meals", label: t("tool.seq.tax.ab.meals"), tag: t("tool.seq.tax.tag50") },
  ];

  return (
    <section className="mb-8 rounded-lg border border-amber-200/60 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/90 text-[10px] text-white">
          ●
        </span>
        <h2 className="font-serif text-base font-semibold text-[#0B2A4A]">{t("tool.seq.tax.heading")}</h2>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block text-[12px] font-medium text-slate-700">
          {t("tool.seq.tax.netY1")}
          <DollarInput id="netY1" value={inputs.netY1} className={mainFieldClass} onChange={(n) => patch("netY1", n)} />
          <span className="mt-1 block text-[11px] text-slate-500">{t("tool.seq.tax.netY1Note")}</span>
        </label>
        <label className="block text-[12px] font-medium text-slate-700">
          {t("tool.seq.tax.netY2")}
          <DollarInput id="netY2" value={inputs.netY2} className={mainFieldClass} onChange={(n) => patch("netY2", n)} />
          <span className="mt-1 block text-[11px] text-slate-500">{t("tool.seq.tax.netY2Note")}</span>
        </label>
      </div>

      <p className="mb-2 text-[12px] font-semibold text-slate-800">{t("tool.seq.tax.addbacks")}</p>
      <div className="divide-y divide-slate-200/80 rounded border border-slate-100">
        {addRows.map((row, i) => (
          <div key={row.field} className={`flex flex-wrap items-center gap-2 px-2 py-2 sm:flex-nowrap ${i === addRows.length - 1 ? "" : ""}`}>
            <span className="min-w-0 flex-1 text-[12px] leading-snug text-slate-700">{row.label}</span>
            <DollarInput
              id={`seq-ab-${String(row.field)}`}
              value={inputs[row.field] as number}
              className={rowFieldClass}
              onChange={(n) => patch(row.field, n)}
            />
            <span className="w-full text-right text-[11px] font-medium text-green-700 sm:w-auto sm:min-w-[4.5rem]">
              {row.tag}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
