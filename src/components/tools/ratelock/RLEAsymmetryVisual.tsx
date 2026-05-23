import type { RLEResults } from "../../../hooks/useRLEMath";
import { fmt } from "../../../hooks/useRLEMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = { results: RLEResults };

export function RLEAsymmetryVisual({ results }: Props) {
  const { t } = useLanguage();
  const {
    monthlyRisk,
    monthlyUpside,
    downBarPct,
    upBarPct,
    asymRatio,
    dropScenario,
    riseScenario,
    daysToClose,
    term,
  } = results;

  const asymNum = parseFloat(asymRatio);

  const downAmt = t("tool.rle.asym.downAmt").replace("{amt}", fmt(monthlyRisk)).replace("{rise}", String(riseScenario));
  const upAmt = t("tool.rle.asym.upAmt").replace("{amt}", fmt(monthlyUpside)).replace("{drop}", String(dropScenario));
  const foot = t("tool.rle.asym.foot")
    .replace("{drop}", String(dropScenario))
    .replace("{days}", String(daysToClose))
    .replace("{risk}", fmt(monthlyRisk))
    .replace("{term}", String(term))
    .replace("{ratio}", asymRatio)
    .replace("{save}", fmt(monthlyUpside));

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">{t("tool.rle.asym.title")}</h3>

      <div className="mt-6 space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <span className="min-w-[100px] text-[11px] font-medium" style={{ color: "#A32D2D" }}>
            {t("tool.rle.asym.downLbl")}
          </span>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="h-7 flex-1 overflow-hidden rounded bg-slate-100">
              <div
                className="h-full rounded transition-[width] duration-500 ease-out"
                style={{ width: `${downBarPct}%`, background: "#A32D2D" }}
              />
            </div>
            <span className="shrink-0 text-right text-[11px] font-medium tabular-nums" style={{ color: "#A32D2D" }}>
              {downAmt}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <span className="min-w-[100px] text-[11px] font-medium" style={{ color: "#27500A" }}>
            {t("tool.rle.asym.upLbl")}
          </span>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="h-7 flex-1 overflow-hidden rounded bg-slate-100">
              <div
                className="h-full rounded transition-[width] duration-500 ease-out"
                style={{ width: `${upBarPct}%`, background: "#3B6D11" }}
              />
            </div>
            <span className="shrink-0 text-right text-[11px] font-medium tabular-nums" style={{ color: "#27500A" }}>
              {upAmt}
            </span>
          </div>
        </div>
      </div>

      <p className="mt-6 text-[11px] leading-[1.5] text-slate-500">{foot}</p>

      {asymNum >= 2.0 ? (
        <p className="mt-3 text-[11px] font-medium" style={{ color: "#A32D2D" }}>
          {t("tool.rle.asym.warn")}
        </p>
      ) : null}
    </div>
  );
}
