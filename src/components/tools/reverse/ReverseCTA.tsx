import { Link } from "react-router-dom";

export function ReverseCTA() {
  return (
    <div className="flex flex-col gap-6 rounded-xl border border-[var(--color-border-tertiary)] bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-8">
      <div>
        <p className="text-[13px] font-medium text-[#0B2A4A]">Ready to see the exact numbers for your situation?</p>
        <p className="mt-1 text-[11px] text-[var(--color-text-tertiary)]">
          No obligation — just an honest conversation about whether this fits your retirement plan.
        </p>
      </div>
      <Link
        to="/contact"
        className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-lg bg-[#C6A15B] px-6 py-3 text-center text-[12px] font-medium text-white transition-colors hover:bg-[#b48e48] sm:min-h-0"
      >
        Talk to an advisor ↗
      </Link>
    </div>
  );
}
