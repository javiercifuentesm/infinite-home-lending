import type { ReactNode } from "react";
import type { RLEResults } from "../../../hooks/useRLEMath";
import { fmt, fmtK } from "../../../hooks/useRLEMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = { results: RLEResults };

export function RLEFloatDownAnalysis({ results }: Props) {
  const { t } = useLanguage();
  const {
    floatCost,
    floatDownCost,
    floatThresh,
    dropScenario,
    floatActivates,
    monthlyUpside,
    lifetimeUpside,
    floatNetSave,
    floatBreakeven,
    floatWorth,
    rate,
  } = results;

  const threshRate = Math.max(0, rate - floatThresh);
  const costStr = fmt(floatDownCost);

  if (floatCost === 0) {
    return (
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">{t("tool.rle.floatAnalysis.title")}</h3>
        <p className="mt-3 text-[13px] leading-relaxed text-slate-600">{t("tool.rle.floatAnalysis.noFloat")}</p>
        <p className="mt-3 text-[13px] font-medium text-slate-700">{t("tool.rle.floatAnalysis.noFloatLabel")}</p>
        <p className="mt-4 text-[12px] leading-relaxed text-slate-500">{t("tool.rle.floatAnalysis.noFloatFooter")}</p>
      </div>
    );
  }

  const netClass = floatNetSave >= 0 ? "text-[#3B6D11]" : "text-[#A32D2D]";

  const verdictBox = (() => {
    if (floatWorth) {
      const body = t("tool.rle.floatAnalysis.verdictWorth")
        .replaceAll("{drop}", String(dropScenario))
        .replaceAll("{net}", fmtK(floatNetSave))
        .replaceAll("{cost}", costStr)
        .replaceAll("{breakeven}", String(floatBreakeven));
      return <p className="text-[12px] leading-relaxed text-slate-600">{body}</p>;
    }
    if (!floatActivates) {
      const body = t("tool.rle.floatAnalysis.verdictNoActivate")
        .replaceAll("{drop}", String(dropScenario))
        .replaceAll("{thresh}", String(floatThresh))
        .replaceAll("{cost}", costStr);
      return <p className="text-[12px] leading-relaxed text-slate-600">{body}</p>;
    }
    const body = t("tool.rle.floatAnalysis.verdictMarginal")
      .replaceAll("{cost}", costStr)
      .replaceAll("{breakeven}", String(floatBreakeven));
    return <p className="text-[12px] leading-relaxed text-slate-600">{body}</p>;
  })();

  const minDropVal = t("tool.rle.floatAnalysis.minDropVal")
    .replace("{thresh}", String(floatThresh))
    .replace("{rate}", threshRate.toFixed(3));
  const activateQ = t("tool.rle.floatAnalysis.activateQuestion").replace("{drop}", String(dropScenario));

  const rows: { key: string; label: string; value: ReactNode; valueClass?: string; borderTop?: boolean }[] = [
    {
      key: "cost",
      label: t("tool.rle.floatAnalysis.cost"),
      value: `${fmt(floatDownCost)} ${t("tool.rle.floatAnalysis.upfront")}`,
      valueClass: "text-[#A32D2D]",
    },
    { key: "min", label: t("tool.rle.floatAnalysis.minDrop"), value: minDropVal },
    {
      key: "act",
      label: activateQ,
      value: floatActivates ? t("tool.rle.floatAnalysis.activatesYes") : t("tool.rle.floatAnalysis.activatesNo"),
      valueClass: floatActivates ? "text-[#3B6D11] font-medium" : "text-[#A32D2D] font-medium",
    },
    {
      key: "mo",
      label: t("tool.rle.floatAnalysis.moSavings"),
      value: floatActivates ? `${fmt(monthlyUpside)}/mo` : t("tool.rle.floatAnalysis.naSolo"),
      valueClass: floatActivates ? "text-[#3B6D11]" : undefined,
    },
    {
      key: "life",
      label: t("tool.rle.floatAnalysis.lifetimeSavings"),
      value: floatActivates ? fmtK(lifetimeUpside) : t("tool.rle.floatAnalysis.naSolo"),
      valueClass: floatActivates ? "text-[#3B6D11]" : undefined,
    },
    {
      key: "net",
      label: t("tool.rle.floatAnalysis.netBenefit"),
      value: floatActivates ? fmtK(floatNetSave) : t("tool.rle.floatAnalysis.na"),
      valueClass: floatActivates ? netClass : undefined,
    },
    {
      key: "be",
      label: t("tool.rle.floatAnalysis.breakeven"),
      value: `${floatBreakeven} ${t("tool.rle.floatAnalysis.moSavingsSub")}`,
      borderTop: true,
    },
  ];

  const intro = t("tool.rle.floatAnalysis.intro").replace("{thresh}", String(floatThresh)).replace("{cost}", fmt(floatDownCost));

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">{t("tool.rle.floatAnalysis.title")}</h3>
      <p className="mt-3 text-[11px] leading-relaxed text-slate-500">{intro}</p>

      <dl className="mt-4">
        {rows.map((row) => (
          <div
            key={row.key}
            className={`flex flex-col justify-between gap-1 border-b border-slate-200/80 py-3 last:border-b-0 sm:flex-row sm:items-center ${row.borderTop ? "border-t border-slate-200/90 pt-4" : ""}`}
          >
            <dt className="text-[12px] text-slate-600">{row.label}</dt>
            <dd className={`text-right text-[13px] tabular-nums ${row.valueClass ?? "text-slate-700"}`}>{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4">
        <p className="text-[12px] font-medium text-slate-700">{t("tool.rle.floatAnalysis.verdictTitle")}</p>
        <div
          className="mt-2 rounded-md border border-slate-200/80 p-3"
          style={{ background: "rgba(248,250,252,0.9)" }}
        >
          {verdictBox}
        </div>
      </div>
    </div>
  );
}
