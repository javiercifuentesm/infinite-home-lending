import type { ReactNode } from "react";
import type { WealthResults } from "../../../hooks/useWealthMath";
import { fmt, fmtK } from "../../../hooks/useWealthMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = { results: WealthResults };

export function WTBreakevenBox({ results }: Props) {
  const { t } = useLanguage();
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
        {t("wt.breakeven.moreToOwn").replace("{amount}", fmt(monthlyCostDiff))}
      </span>
    ) : (
      <span className="font-medium text-[#27500A]">
        {t("wt.breakeven.cheaperToOwn").replace("{amount}", fmt(Math.abs(monthlyCostDiff)))}
      </span>
    );

  const row2 = beYear ? (
    <span className="font-medium text-[#27500A]">{t("wt.breakeven.beYearValue").replace("{year}", String(beYear))}</span>
  ) : (
    <span className="font-medium text-[#854F0B]">
      {t("wt.breakeven.renterWins").replace("{rate}", invReturn.toFixed(1))}
    </span>
  );

  const rows: { label: string; value: ReactNode }[] = [
    { label: t("wt.breakeven.monthly"), value: row1 },
    { label: t("wt.breakeven.beYear"), value: row2 },
    {
      label: t("wt.breakeven.dpInvested").replace("{dp}", String(dp)).replace("{rate}", invReturn.toFixed(1)),
      value: fmtK(dpFv),
    },
    { label: t("wt.breakeven.homeValue"), value: <span className="font-medium text-[#27500A]">{fmtK(m30.homeVal)}</span> },
    { label: t("wt.breakeven.totalRent"), value: <span className="font-medium text-[#A32D2D]">{fmtK(totalRentPaid)}</span> },
    { label: t("wt.breakeven.totalMortgage"), value: <span className="font-medium">{fmtK(totalMortgagePaid)}</span> },
    {
      label: t("wt.breakeven.propTaxMaint"),
      value: (
        <span className="font-medium text-[#A32D2D]">{fmtK(totalPropTaxPaid + totalMaintenancePaid)}</span>
      ),
    },
  ];

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">{t("wt.breakeven.title")}</h3>
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
