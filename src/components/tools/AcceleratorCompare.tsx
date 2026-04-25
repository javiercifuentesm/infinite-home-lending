import type { PaymentFreq, ScheduleResult } from "../../hooks/useAcceleratorMath";
import { fmt } from "../../hooks/useAcceleratorMath";

type Props = {
  base: ScheduleResult;
  accel: ScheduleResult;
  principal: number;
  extraAmt: number;
  freq: PaymentFreq;
  basePayoff: number;
  accelPayoff: number;
};

function freqLabel(f: PaymentFreq): string {
  switch (f) {
    case "monthly":
      return "monthly";
    case "biweekly":
      return "bi-weekly";
    case "annual":
      return "annual lump sum";
    case "onetime":
      return "one-time";
    default:
      return "";
  }
}

export function AcceleratorCompare({
  base,
  accel,
  principal,
  extraAmt,
  freq,
  basePayoff,
  accelPayoff,
}: Props) {
  const extraDisplay = extraAmt === 0 ? "$0" : `${fmt(extraAmt)} ${freqLabel(freq)}`;

  const totalWithBase = principal + base.totalInterest;
  const totalWithAccel = principal + accel.totalInterest + (freq === "onetime" ? extraAmt : 0);

  const row = (label: string, val: string, tone: "good" | "bad" | "neutral") => {
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
      <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">Side by side</h3>
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border-[0.5px] border-[var(--color-border-tertiary)] bg-white p-5 shadow-sm">
          <h4 className="font-[Georgia,serif] text-[18px] font-semibold text-[#0B2A4A]">Without extra payments</h4>
          <div className="mt-3">
            {row("Monthly payment", fmt(base.payment), "bad")}
            {row("Payoff in", `${basePayoff} years`, "bad")}
            {row("Total interest", fmt(base.totalInterest), "bad")}
            {row("Total cost", fmt(totalWithBase), "neutral")}
          </div>
        </div>
        <div className="rounded-xl border-2 border-[#27500A] bg-white p-5 shadow-sm">
          <h4 className="font-[Georgia,serif] text-[18px] font-semibold text-[#C6A15B]">With extra payments</h4>
          <div className="mt-3">
            {row("Extra payment", extraDisplay, "good")}
            {row("Payoff in", `${accelPayoff} years`, "good")}
            {row("Total interest", fmt(accel.totalInterest), "good")}
            {row("Total cost", fmt(totalWithAccel), "neutral")}
          </div>
        </div>
      </div>
    </div>
  );
}
