import type { ReactNode } from "react";
import type { RLEResults } from "../../../hooks/useRLEMath";
import { fmt, fmtK } from "../../../hooks/useRLEMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = { results: RLEResults };

export function RLEExtensionAnalysis({ results }: Props) {
  const { t } = useLanguage();
  const { extFee, ext15Cost, ext30Cost, ext45Cost, monthlyRisk, lifetimeRisk, riseScenario, extBreakeven } = results;

  const riseLabel = t("tool.rle.extAnalysis.riseInstead").replace("{rise}", String(riseScenario));
  const riseValue = (
    <>
      +{fmt(monthlyRisk)}
      {t("tool.rle.extAnalysis.moForever")} ({fmtK(lifetimeRisk)} {t("tool.rle.extAnalysis.total")})
    </>
  );

  const rows: { key: string; label: string; value: ReactNode; valueClass?: string }[] = [
    { key: "fee", label: t("tool.rle.extAnalysis.feeRate"), value: `${extFee}${t("tool.rle.extAnalysis.per15")}` },
    { key: "c15", label: t("tool.rle.extAnalysis.cost15"), value: fmt(ext15Cost), valueClass: "text-[#A32D2D]" },
    { key: "c30", label: t("tool.rle.extAnalysis.cost30"), value: fmt(ext30Cost), valueClass: "text-[#A32D2D]" },
    { key: "c45", label: t("tool.rle.extAnalysis.cost45"), value: fmt(ext45Cost), valueClass: "text-[#A32D2D]" },
    { key: "rise", label: riseLabel, value: riseValue, valueClass: "text-[#A32D2D]" },
    {
      key: "verdict",
      label: t("tool.rle.extAnalysis.verdict"),
      value: t("tool.rle.extAnalysis.verdictVal"),
      valueClass: "font-medium text-[#3B6D11]",
    },
    {
      key: "be",
      label: t("tool.rle.extAnalysis.breakeven"),
      value: `${extBreakeven.toFixed(1)} ${t("tool.rle.extAnalysis.breakevenSub")}`,
    },
  ];

  const footer = t("tool.rle.extAnalysis.footer")
    .replaceAll("{ext15}", fmt(ext15Cost))
    .replace("{lifetime}", fmtK(lifetimeRisk));

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">{t("tool.rle.extAnalysis.title")}</h3>
      <dl className="mt-4 divide-y divide-slate-200/80">
        {rows.map((row) => (
          <div key={row.key} className="flex flex-col justify-between gap-1 py-3 sm:flex-row sm:items-center">
            <dt className="text-[12px] text-slate-600">{row.label}</dt>
            <dd className={`text-right text-[13px] tabular-nums ${row.valueClass ?? "text-slate-700"}`}>{row.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-[11px] leading-relaxed text-slate-500">{footer}</p>
    </div>
  );
}
