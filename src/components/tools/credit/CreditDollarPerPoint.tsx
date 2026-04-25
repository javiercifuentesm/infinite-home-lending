import type { CreditCalcResult } from "../../../hooks/useCreditMath";
import { fmt, fmtK } from "../../../hooks/useCreditMath";

type Props = { results: CreditCalcResult; curScore: number };

export function CreditDollarPerPoint({ results, curScore }: Props) {
  const { dollarPerPoint, lifetimeSavings, ptsDiff, effectiveTgt, loan } = results;
  return (
    <div className="rounded-lg border border-[rgba(198,161,91,0.3)] bg-[rgba(198,161,91,0.1)] px-5 py-6 sm:px-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#854F0B]">Value per credit score point</p>
          <p className="mt-2 font-[Georgia,serif] text-[36px] font-medium leading-none text-[#0B2A4A]">{fmtK(dollarPerPoint)}</p>
          <p className="mt-2 text-[12px] text-[#854F0B]">per credit score point improved</p>
        </div>
        <div>
          <p className="text-[13px] leading-[1.6] text-slate-600">
            Improving your score from {curScore} to {effectiveTgt} — {ptsDiff} points — is worth {fmtK(lifetimeSavings)} in total interest savings on a $
            {fmt(loan)} loan. That&apos;s not a rounding error. That&apos;s a real financial return on a very specific set of actions.
          </p>
        </div>
      </div>
    </div>
  );
}
