import { CREDIT_ACTIONS } from "../../../data/creditActions";
import { calcActionROI } from "../../../hooks/useCreditMath";
import type { CreditCalcResult } from "../../../hooks/useCreditMath";
import { fmt, fmtK } from "../../../hooks/useCreditMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = {
  selectedIds: Set<string>;
  results: CreditCalcResult;
};

export function CreditActionResults({ selectedIds, results }: Props) {
  const { t } = useLanguage();
  const { loan, curRate, rateDiff, ptsDiff, term } = results;
  const termMos = term * 12;

  const rows = CREDIT_ACTIONS.filter((a) => selectedIds.has(a.id))
    .map((action) => ({
      action,
      roi: calcActionROI(action, loan, termMos, curRate, rateDiff, ptsDiff),
    }))
    .sort((a, b) => b.roi.lifetimeSavings - a.roi.lifetimeSavings);

  if (rows.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">{t("tool.credit.actionResults.title")}</h3>
      <div className="space-y-3">
        {rows.map(({ action, roi }) => {
          const name = t(`tool.credit.action.${action.id}.name` as never);
          const timeline = t(`tool.credit.action.${action.id}.timeline` as never);
          const detail = t(`tool.credit.action.${action.id}.detail` as never);
          const perMo = t("tool.credit.actionResults.perMo").replace("{amt}", fmt(roi.monthlySavings));
          return (
            <div
              key={action.id}
              className="flex flex-col gap-3 rounded-lg border border-slate-200/90 bg-white px-4 py-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0">
                <p className="text-[12px] font-medium text-[#0B2A4A]">{name}</p>
                <p className="mt-1 text-[11px] text-slate-500">{timeline}</p>
                <p className="mt-1 text-[11px] text-slate-500">{detail}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1 text-right sm:pl-4">
                <p className="text-[14px] font-medium text-[#3B6D11]">{t("tool.credit.actionResults.ptsAvg").replace("{n}", String(roi.midPts))}</p>
                <p className="text-[11px] text-slate-500">{t("tool.credit.actionResults.saved").replace("{amt}", fmtK(roi.lifetimeSavings))}</p>
                <p className="text-[10px] font-medium text-[#C6A15B]">{perMo}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
