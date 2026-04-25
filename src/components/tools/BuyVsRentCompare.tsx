import type { ReactNode } from "react";
import type { BuyVsRentInputs, YearlySnapshot } from "../../hooks/useBuyVsRentMath";
import { fmt, fmtK } from "../../hooks/useBuyVsRentMath";

type Props = {
  snapshot: YearlySnapshot;
  inputs: BuyVsRentInputs;
  viewYear: number;
};

export function BuyVsRentCompare({ snapshot, inputs, viewYear }: Props) {
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
        At year {viewYear} — side by side
      </h3>
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className={`${cardBase} ${buyWins ? winBorder : loseBorder}`} aria-label="Buying column">
          <h4 className="font-[Georgia,serif] text-[18px] font-semibold text-[#0B2A4A]">Buying</h4>
          <div className="mt-3">
            {row("Net wealth", fmtK(buy), buy > rent ? "good" : "bad")}
            {row("Home value", fmt(snapshot.homeVal), "neutral")}
            {row("Remaining balance", fmt(snapshot.loanBal), "neutral")}
            {row("Equity built", fmt(snapshot.equity), "good")}
            {row("Total paid so far", fmt(snapshot.buyTotalPaid), "neutral")}
            {row("Monthly cost now", fmt(snapshot.monthlyBuyCost), "neutral")}
          </div>
        </div>
        <div className={`${cardBase} ${rentWins ? winBorder : loseBorder}`} aria-label="Renting column">
          <h4 className="font-[Georgia,serif] text-[18px] font-semibold text-[#C6A15B]">Renting + investing</h4>
          <div className="mt-3">
            {row("Portfolio value", fmtK(rent), rent > buy ? "good" : "bad")}
            {row("Down pmt invested", fmt(downInvested), "neutral")}
            {row("Monthly diff invested", fmt(diffMo) + "/mo", "neutral")}
            {row("Equity built", "$0", "bad")}
            {row("Total paid so far", fmt(snapshot.rentTotalPaid), "neutral")}
            {row("Monthly cost now", fmt(snapshot.monthlyRent), "neutral")}
          </div>
        </div>
      </div>
    </div>
  );
}
