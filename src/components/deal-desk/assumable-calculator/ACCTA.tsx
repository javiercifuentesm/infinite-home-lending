import { Link } from "react-router-dom";
import type { AssumableResults } from "../../../hooks/useAssumableMath";
import { fmt } from "../../../hooks/useAssumableMath";

type Props = { results: AssumableResults };

export function ACCTA({ results }: Props) {
  const { monthlySaving } = results;
  const heading =
    monthlySaving >= 300
      ? `${fmt(monthlySaving)}/mo in savings — let's confirm assumability and get the buyer qualified.`
      : "Ready to verify the loan terms and explore gap financing options?";

  return (
    <div className="rounded-xl bg-[#0B2A4A] px-5 py-6 sm:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-[Georgia,serif] text-[13px] font-medium text-[#C6A15B]">{heading}</p>
          <p className="mt-2 font-sans text-[11px] leading-relaxed text-[rgba(255,255,255,0.6)]">
            IHL can verify the existing loan terms with the servicer, help structure the gap financing, and issue a pre-approval — making this a
            complete offer package.
          </p>
        </div>
        <Link
          to="/contact"
          className="inline-flex shrink-0 items-center justify-center rounded-md bg-[#C6A15B] px-5 py-2.5 font-sans text-[13px] font-semibold text-[#0B2A4A] transition-colors hover:bg-[#b48e48]"
        >
          Talk to IHL ↗
        </Link>
      </div>
    </div>
  );
}
