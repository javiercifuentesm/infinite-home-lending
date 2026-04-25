import type { CreditCalcResult } from "../../../hooks/useCreditMath";
import { fmt, fmtK } from "../../../hooks/useCreditMath";

type Props = { results: CreditCalcResult };

export function CreditRevealHero({ results }: Props) {
  const { lifetimeSavings, monthlySavings, rateDiff, term } = results;
  return (
    <div className="grid grid-cols-1 gap-6 rounded-lg bg-[#0B2A4A] px-5 py-8 text-white sm:grid-cols-3 sm:gap-4 sm:px-8 lg:px-10">
      <div className="text-center sm:text-left">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">Lifetime savings</p>
        <p className="mt-2 font-[Georgia,serif] text-[30px] font-medium leading-none text-[#C6A15B]">{fmtK(lifetimeSavings)}</p>
        <p className="mt-2 text-[11px] text-white/55">total interest saved over {term} years</p>
      </div>
      <div className="text-center sm:text-left">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">Monthly savings</p>
        <p className="mt-2 font-[Georgia,serif] text-[30px] font-medium leading-none text-white">${fmt(monthlySavings)}</p>
        <p className="mt-2 text-[11px] text-white/55">less every month for life</p>
      </div>
      <div className="text-center sm:text-left">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">Rate improvement</p>
        <p className="mt-2 font-[Georgia,serif] text-[30px] font-medium leading-none text-[#9FE1CB]">
          {rateDiff.toFixed(3)}%
        </p>
        <p className="mt-2 text-[11px] text-white/55">lower interest rate</p>
      </div>
    </div>
  );
}
