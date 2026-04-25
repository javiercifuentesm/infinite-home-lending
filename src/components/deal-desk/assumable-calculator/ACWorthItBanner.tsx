import type { AssumableResults } from "../../../hooks/useAssumableMath";
import { fmt } from "../../../hooks/useAssumableMath";

type Props = { results: AssumableResults };

export function ACWorthItBanner({ results }: Props) {
  const { worthIt, monthlySaving, blendedRate, mktRate } = results;

  const base = "flex items-start gap-3 rounded-[10px] border px-4 py-[0.85rem] font-sans text-[13px] font-medium leading-relaxed";

  if (worthIt === "yes") {
    return (
      <div
        id="ac-worth-it"
        className={`${base} border-[rgba(59,109,17,0.2)] bg-[rgba(59,109,17,0.08)] text-[#27500A]`}
      >
        <span className="shrink-0 text-[18px]" aria-hidden>
          ✅
        </span>
        <p>
          Assumption is worth it — {fmt(monthlySaving)}/mo savings with a blended rate of {blendedRate.toFixed(3)}%, well below today&apos;s{" "}
          {mktRate.toFixed(3)}% market rate.
        </p>
      </div>
    );
  }

  if (worthIt === "marginal") {
    return (
      <div
        id="ac-worth-it"
        className={`${base} border-[rgba(198,161,91,0.25)] bg-[rgba(198,161,91,0.08)] text-[#854F0B]`}
      >
        <span className="shrink-0 text-[18px]" aria-hidden>
          ⚠️
        </span>
        <p>
          Marginal advantage — {fmt(monthlySaving)}/mo savings. The complexity of assumption (45–90 days, dual payments) may outweigh the modest
          benefit. Weigh carefully for this buyer.
        </p>
      </div>
    );
  }

  return (
    <div id="ac-worth-it" className={`${base} border-[rgba(163,45,45,0.15)] bg-[rgba(163,45,45,0.06)] text-[#A32D2D]`}>
      <span className="shrink-0 text-[18px]" aria-hidden>
        ❌
      </span>
      <p>
        Assumption may not be worth it at these numbers. The gap financing cost is eroding the rate advantage. Consider a standard new loan or
        renegotiate the purchase price.
      </p>
    </div>
  );
}
