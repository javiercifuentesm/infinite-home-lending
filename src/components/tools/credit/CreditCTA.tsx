import { Link } from "react-router-dom";
import type { CreditCalcResult } from "../../../hooks/useCreditMath";
import { fmtK } from "../../../hooks/useCreditMath";

type Props = { results: CreditCalcResult };

export function CreditCTA({ results }: Props) {
  const { lifetimeSavings } = results;
  const high = lifetimeSavings > 30_000;

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-slate-200/90 bg-white px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div className="max-w-xl">
        <h3 className="font-[Georgia,serif] text-[18px] font-medium leading-snug text-[#0B2A4A]">
          {high
            ? `You have ${fmtK(lifetimeSavings)} sitting in your credit score. Want a plan to unlock it?`
            : "Ready to see the fastest path to your target score?"}
        </h3>
        <p className="mt-2 text-[11px] text-slate-500">
          No pressure — just clarity on the fastest path to the best rate for your situation.
        </p>
      </div>
      <Link
        to="/contact"
        className="inline-flex shrink-0 items-center justify-center rounded-md bg-[#C6A15B] px-6 py-3 text-[13px] font-semibold text-[#0B2A4A] transition-colors hover:bg-[#b48e48]"
      >
        Talk to an advisor ↗
      </Link>
    </div>
  );
}
