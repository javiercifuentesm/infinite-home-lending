import type { AssumableResults } from "../../../hooks/useAssumableMath";
import { fmt, fmtK } from "../../../hooks/useAssumableMath";

type Props = { results: AssumableResults };

export function ACSavingsHero({ results }: Props) {
  const { monthlySaving, mktRate, blendedRate, lifetimeSaving } = results;

  return (
    <div className="rounded-[14px] bg-[#0B2A4A] p-6 sm:p-8">
      <div className="text-center">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-wide text-[rgba(255,255,255,0.45)]">
          Monthly saving vs. a new loan at market rate
        </p>
        <p className="mt-3 font-[Georgia,serif] text-[40px] font-medium leading-none text-[#C6A15B] sm:text-[48px]">
          {monthlySaving >= 0 ? "+" : ""}
          {fmt(monthlySaving)}
        </p>
        <p className="mx-auto mt-3 max-w-xl font-sans text-[14px] leading-relaxed text-[rgba(255,255,255,0.7)]">
          per month vs. a new {mktRate.toFixed(3)}% loan — {fmtK(Math.max(0, lifetimeSaving))} saved over the loan life
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-[rgba(255,255,255,0.07)] px-4 py-4 text-center">
          <p className="font-sans text-[11px] font-medium text-[#9FE1CB]">Rate locked in</p>
          <p className="mt-2 font-[Georgia,serif] text-[18px] font-medium text-[#9FE1CB] sm:text-[20px]">
            {blendedRate.toFixed(3)}% blended
          </p>
        </div>
        <div className="rounded-lg bg-[rgba(255,255,255,0.07)] px-4 py-4 text-center">
          <p className="font-sans text-[11px] font-medium text-[rgba(255,120,120,0.95)]">vs. new loan at</p>
          <p className="mt-2 font-[Georgia,serif] text-[18px] font-medium text-[rgba(255,120,120,0.95)] sm:text-[20px]">
            {mktRate.toFixed(3)}%
          </p>
        </div>
        <div className="rounded-lg bg-[rgba(255,255,255,0.07)] px-4 py-4 text-center">
          <p className="font-sans text-[11px] font-medium text-[#9FE1CB]">30-yr interest saved</p>
          <p className="mt-2 font-[Georgia,serif] text-[18px] font-medium text-[#9FE1CB] sm:text-[20px]">
            {fmtK(Math.max(0, lifetimeSaving))}
          </p>
        </div>
      </div>
    </div>
  );
}
