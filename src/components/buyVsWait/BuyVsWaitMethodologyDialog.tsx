import { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

/**
 * Centered modal — methodology transparency panel (no trigger anchoring; always viewport-safe).
 */
export function BuyVsWaitMethodologyDialog({ open, onClose }: Props) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1010] flex items-center justify-center overflow-y-auto bg-navy/40 p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        className="relative my-auto w-[90%] max-w-[520px] max-h-[85vh] overflow-y-auto rounded-[4px] border border-slate-200/90 bg-white p-4 shadow-[0_16px_48px_rgba(10,25,47,0.14)] sm:p-5"
      >
        <div className="flex items-start justify-between gap-2">
          <h3 id={titleId} className="type-body-sm font-semibold text-navy pr-2">
            How these estimates are modeled
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-[3px] p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>

        <p className="type-body-xs mt-2 leading-relaxed text-slate-600">
          These estimates are based on simplified, real-world assumptions designed to reflect typical market conditions — not exact predictions.
        </p>

        <p className="type-label mt-3 text-navy/55">What we include</p>
        <ul className="type-body-xs mt-1.5 list-disc space-y-1 pl-4 leading-relaxed text-slate-600">
          <li>Rent paid during the waiting period</li>
          <li>Estimated home value growth over time</li>
          <li>Monthly mortgage costs (principal, interest, taxes, insurance)</li>
          <li>Equity gained from owning vs. waiting</li>
        </ul>

        <p className="type-label mt-3 text-navy/55">What we do NOT assume</p>
        <ul className="type-body-xs mt-1.5 list-disc space-y-1 pl-4 leading-relaxed text-slate-600">
          <li>No attempt to predict exact market timing</li>
          <li>No scenario optimized to favor buying or waiting</li>
          <li>No hidden fees or aggressive projections</li>
        </ul>

        <p className="type-body-xs mt-3 border-t border-slate-100 pt-3 leading-relaxed text-slate-600">
          This tool is designed to help you understand tradeoffs — not to replace personalized financial advice.
        </p>
      </div>
    </div>,
    document.body
  );
}
