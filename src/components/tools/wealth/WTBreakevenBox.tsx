import type { ReactNode } from "react";
import type { WealthResults } from "../../../hooks/useWealthMath";
import { fmt, fmtK } from "../../../hooks/useWealthMath";

type Props = { results: WealthResults };

export function WTBreakevenBox({ results }: Props) {
  const {
    monthlyCostDiff,
    beYear,
    invReturn,
    dp,
    milestoneData,
    totalRentPaid,
    totalMortgagePaid,
    totalPropTaxPaid,
    totalMaintenancePaid,
  } = results;

  const m30 = milestoneData[30]!;
  const dpFv = Math.round(results.dpDollars * Math.pow(1 + invReturn / 100, 30));

  const row1 =
    monthlyCostDiff > 0 ? (
      <span className="font-medium text-[#A32D2D]">
        +{fmt(monthlyCostDiff)}/mo to own today
      </span>
    ) : (
      <span className="font-medium text-[#27500A]">
        −{fmt(Math.abs(monthlyCostDiff))}/mo — owning is cheaper
      </span>
    );

  const row2 = beYear ? (
    <span className="font-medium text-[#27500A]">Year {beYear}</span>
  ) : (
    <span className="font-medium text-[#854F0B]">Renter wins at {invReturn.toFixed(1)}% returns</span>
  );

  const rows: { label: string; value: ReactNode }[] = [
    { label: "Monthly cost: owning vs. renting today", value: row1 },
    { label: "Break-even year (when owner NW surpasses renter)", value: row2 },
    { label: `Your ${dp}% down payment invested at ${invReturn.toFixed(1)}%/yr`, value: fmtK(dpFv) },
    { label: "Your home value at year 30", value: <span className="font-medium text-[#27500A]">{fmtK(m30.homeVal)}</span> },
    { label: "Total rent paid over 30 years", value: <span className="font-medium text-[#A32D2D]">{fmtK(totalRentPaid)}</span> },
    { label: "Total mortgage P&I paid", value: <span className="font-medium">{fmtK(totalMortgagePaid)}</span> },
    {
      label: "Property tax + maintenance (cumulative)",
      value: (
        <span className="font-medium text-[#A32D2D]">{fmtK(totalPropTaxPaid + totalMaintenancePaid)}</span>
      ),
    },
  ];

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">
        Break-even analysis — when does owning win?
      </h3>
      <dl className="mt-4 divide-y divide-slate-200/80">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col justify-between gap-1 py-3 sm:flex-row sm:items-center">
            <dt className="text-[12px] text-slate-500">{row.label}</dt>
            <dd className="text-right text-[12px]">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
