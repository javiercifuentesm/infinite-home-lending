import type { WaitingCalcResult } from "../../hooks/useWaitingMath";
import { fmt, fmtK, formatWaitPeriodLabel } from "../../hooks/useWaitingMath";

type Props = {
  data: WaitingCalcResult;
  waitMonths: number;
};

export function WaitingCostHero({ data, waitMonths }: Props) {
  const up = Math.max(1, Math.floor(waitMonths));
  const upfront = data.extraDown + data.extraClosing;

  return (
    <div className="w-full rounded-xl bg-[#0B2A4A] px-5 py-10 text-center shadow-lg sm:px-8 sm:py-12">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[rgba(255,255,255,0.55)]">
        Total cost of waiting {formatWaitPeriodLabel(up)}
      </p>
      <p
        className="mt-4 font-[Georgia,serif] text-[44px] font-medium leading-none text-[#C6A15B]"
        style={{ fontWeight: 500 }}
      >
        {fmtK(data.totalCost)}
      </p>
      <p className="mx-auto mt-5 max-w-xl text-[13px] leading-relaxed text-[rgba(255,255,255,0.7)]">
        Rent paid ({fmt(data.rentPaid)}) + home price increase ({fmt(data.appreciationMissed)}) + higher upfront costs (
        {fmt(upfront)})
      </p>
      <p className="mt-4 text-[11px] leading-relaxed text-[rgba(255,255,255,0.4)]">
        That&apos;s {fmt(data.monthlyCostRate)} every month you wait — money that doesn&apos;t come back.
      </p>
    </div>
  );
}
