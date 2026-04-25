import { Link } from "react-router-dom";

export function AcceleratorCTA() {
  return (
    <div className="flex flex-col gap-6 rounded-xl border border-[var(--color-border-tertiary)] bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-8">
      <div>
        <p className="text-[14px] font-medium text-[#0B2A4A]">Want to see how this applies to your actual mortgage?</p>
        <p className="mt-1 text-[12px] text-[var(--color-text-tertiary)]">
          We&apos;ll model the exact numbers for your situation — no obligation, just clarity.
        </p>
      </div>
      <Link
        to="/contact"
        className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#C6A15B] px-6 py-3 text-center text-[13px] font-medium text-white transition-colors hover:bg-[#b48e48]"
      >
        Talk to an advisor
      </Link>
    </div>
  );
}
