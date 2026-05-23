import type { ReactNode } from "react";
import type { BuyVsRentInputs, YearlySnapshot } from "../../hooks/useBuyVsRentMath";
import { fmt, fmtK } from "../../hooks/useBuyVsRentMath";
import { useLanguage } from "../../i18n/LanguageContext";

type Props = {
  snapshot: YearlySnapshot;
  inputs: BuyVsRentInputs;
  viewYear: number;
};

export function BuyVsRentCompare({ snapshot, inputs, viewYear }: Props) {
  const { t } = useLanguage();
  const buy = snapshot.buyNetWealth;
  const rent = snapshot.rentPortfolio;
  const buyWins = buy > rent;
  const rentWins = rent > buy;

  const downInvested = inputs.hp * (inputs.dp / 100) + inputs.hp * (inputs.cc / 100);
  const diffMo = Math.max(0, snapshot.monthlyBuyCost - snapshot.monthlyRent);

  const cardBase = "rounded-xl border bg-white p-5 shadow-sm";
  const winBorder = "border-2 border-[#27500A]";
  const loseBorder = "border-[0.5px] border-[var(--color-border-tertiary)]";

  const row = (label: string, val: ReactNode, tone: "good" | "bad" | "neutral") => {
    const cls =
      tone === "good" ? "text-[#27500A]" : tone === "bad" ? "text-[#A32D2D]" : "text-[#0B2A4A]";
    return (
      <div className="flex justify-between gap-3 border-b border-[var(--color-border-tertiary)] py-2.5 text-[14px] last:border-0">
        <span className="text-[var(--color-text-tertiary)]">{label}</span>
        <span className={`tabular-nums font-semibold ${cls}`}>{val}</span>
      </div>
    );
  };

  return (
    <div>
      <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">
        {t("tool.bvr.compare.titlePre")} {viewYear} {t("tool.bvr.compare.titlePost")}
      </h3>
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className={`${cardBase} ${buyWins ? winBorder : loseBorder}`} aria-label={t("tool.bvr.compare.buying")}>
          <h4 className="font-[Georgia,serif] text-[18px] font-semibold text-[#0B2A4A]">{t("tool.bvr.compare.buying")}</h4>
          <div className="mt-3">
            {row(t("tool.bvr.compare.netWealth"), fmtK(buy), buy > rent ? "good" : "bad")}
            {row(t("tool.bvr.compare.homeValue"), fmt(snapshot.homeVal), "neutral")}
            {row(t("tool.bvr.compare.remainingBal"), fmt(snapshot.loanBal), "neutral")}
            {row(t("tool.bvr.compare.equityBuilt"), fmt(snapshot.equity), "good")}
            {row(t("tool.bvr.compare.totalPaid"), fmt(snapshot.buyTotalPaid), "neutral")}
            {row(t("tool.bvr.compare.monthlyCost"), fmt(snapshot.monthlyBuyCost), "neutral")}
          </div>
        </div>
        <div className={`${cardBase} ${rentWins ? winBorder : loseBorder}`} aria-label={t("tool.bvr.compare.renting")}>
          <h4 className="font-[Georgia,serif] text-[18px] font-semibold text-[#C6A15B]">{t("tool.bvr.compare.renting")}</h4>
          <div className="mt-3">
            {row(t("tool.bvr.compare.portfolioValue"), fmtK(rent), rent > buy ? "good" : "bad")}
            {row(t("tool.bvr.compare.downInvested"), fmt(downInvested), "neutral")}
            {row(t("tool.bvr.compare.monthlyDiff"), fmt(diffMo) + t("tool.bvr.compare.perMo"), "neutral")}
            {row(t("tool.bvr.compare.equityBuilt"), "$0", "bad")}
            {row(t("tool.bvr.compare.totalPaid"), fmt(snapshot.rentTotalPaid), "neutral")}
            {row(t("tool.bvr.compare.monthlyCost"), fmt(snapshot.monthlyRent), "neutral")}
          </div>
        </div>
      </div>
    </div>
  );
}
