import { CREDIT_ACTIONS } from "../../../data/creditActions";
import { calcActionROI } from "../../../hooks/useCreditMath";
import type { CreditCalcResult } from "../../../hooks/useCreditMath";
import { fmt, fmtK } from "../../../hooks/useCreditMath";

type Props = {
  selectedIds: Set<string>;
  results: CreditCalcResult;
};

export function CreditActionResults({ selectedIds, results }: Props) {
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
      <h3 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">Your action plan — ROI ranked by mortgage impact</h3>
      <div className="space-y-3">
        {rows.map(({ action, roi }) => (
          <div
            key={action.id}
            className="flex flex-col gap-3 rounded-lg border border-slate-200/90 bg-white px-4 py-4 sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="min-w-0">
              <p className="text-[12px] font-medium text-[#0B2A4A]">{action.name}</p>
              <p className="mt-1 text-[11px] text-slate-500">{action.timeline}</p>
              <p className="mt-1 text-[11px] text-slate-500">{action.detail}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1 text-right sm:pl-4">
              <p className="text-[14px] font-medium text-[#3B6D11]">+{roi.midPts} pts avg</p>
              <p className="text-[11px] text-slate-500">{fmtK(roi.lifetimeSavings)} saved</p>
              <p className="text-[10px] font-medium text-[#C6A15B]">${fmt(roi.monthlySavings)}/mo</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
