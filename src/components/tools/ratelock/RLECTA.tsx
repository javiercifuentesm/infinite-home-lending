import { Link } from "react-router-dom";
import type { RLEResults } from "../../../hooks/useRLEMath";

type Props = { results: RLEResults };

export function RLECTA({ results }: Props) {
  const { daysToClose } = results;
  const heading =
    daysToClose <= 15
      ? `You have ${daysToClose} days. This decision cannot wait.`
      : "Ready to make this decision with a real advisor?";

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-slate-200/90 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0 flex-1">
        <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">{heading}</h3>
        <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
          This is not a rate prediction tool — nobody can tell you where rates are going. This is a risk quantification tool. We&apos;ll
          walk you through the rate environment, your specific lock options, and the float-down provisions available — no
          obligation.
        </p>
      </div>
      <Link
        to="/contact?topic=rate-lock-engine"
        className="inline-flex shrink-0 items-center justify-center rounded-md bg-[#C6A15B] px-6 py-3 text-[14px] font-semibold text-[#0B2A4A] transition-colors hover:bg-[#b48e48]"
      >
        Talk to an advisor ↗
      </Link>
    </div>
  );
}
