import { Link } from "react-router-dom";

export function WaitingCTA() {
  return (
    <div className="flex flex-col gap-6 rounded-xl border border-[var(--tcw-border,#e2e8f0)] bg-[var(--tcw-surface,#fff)] p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-8">
      <div>
        <p className="text-[13px] font-medium text-[var(--tcw-text-primary,#0B2A4A)]">
          Ready to find out what you actually qualify for today?
        </p>
        <p className="mt-1 text-[11px] text-[var(--tcw-text-muted,#64748b)]">
          No pressure — just an honest look at your options right now.
        </p>
      </div>
      <Link
        to="/contact"
        className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#C6A15B] px-6 py-3 text-center text-[12px] font-medium text-white transition-colors hover:bg-[#b48e48]"
      >
        See what I qualify for
      </Link>
    </div>
  );
}
