import { Link } from "react-router-dom";
import type { SellerNetResults } from "../../../hooks/useSellerNetMath";
import { fmtK } from "../../../hooks/useSellerNetMath";

type Props = { results: SellerNetResults };

export function SNSCTA({ results }: Props) {
  const { ask } = results;
  const underwater = ask.isUnderwater;

  return (
    <div className="sns-cta rounded-xl bg-[#0B2A4A] px-5 py-6 sm:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p
            className={`font-[Georgia,serif] text-[13px] font-medium ${
              underwater ? "text-[rgba(255,150,150,0.95)]" : "text-[#C6A15B]"
            }`}
          >
            {underwater
              ? "⚠ Seller may be underwater — contact IHL to discuss options."
              : `The seller nets ${fmtK(ask.net)} at ask — let's align the buyer's pre-approval to that number.`}
          </p>
          <p className="mt-2 font-sans text-[11px] leading-relaxed text-[rgba(255,255,255,0.6)]">
            IHL will issue a pre-approval that matches your seller&apos;s target net — so your listing strategy and financing strategy are aligned from
            day one.
          </p>
        </div>
        <Link
          to="/contact"
          className="inline-flex shrink-0 items-center justify-center rounded-md bg-[#C6A15B] px-5 py-2.5 font-sans text-[13px] font-semibold text-white transition-colors hover:bg-[#b48e48]"
        >
          Talk to IHL ↗
        </Link>
      </div>
    </div>
  );
}
