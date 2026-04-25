import { Link } from "react-router-dom";
import type { ClientQualifierResults } from "../../../hooks/useClientQualifierMath";

type Props = { results: ClientQualifierResults };

export function CQCTA({ results }: Props) {
  return (
    <div className="rounded-xl bg-[#0B2A4A] p-6 sm:p-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#C6A15B]">{results.ctaHead}</h3>
          <p className="mt-2 font-sans text-[11px] leading-relaxed text-white/60">
            We&apos;ll confirm the buyer&apos;s qualification and issue a pre-approval you can reference in your offer package.
          </p>
        </div>
        <Link
          to="/contact?topic=deal-desk-client-qualifier"
          className="inline-flex shrink-0 items-center justify-center rounded-md bg-[#C6A15B] px-6 py-3 font-sans text-[14px] font-semibold text-[#0B2A4A] transition-colors hover:bg-[#b48e48]"
        >
          Refer to IHL ↗
        </Link>
      </div>
    </div>
  );
}
