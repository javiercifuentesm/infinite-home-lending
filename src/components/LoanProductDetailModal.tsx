import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { LoanProductData } from "./LoanProductCard";
import { LoanProductModalContent } from "./LoanProductModalContent";

type LoanProductDetailModalProps = {
  product: LoanProductData | null;
  onClose: () => void;
};

/**
 * Centered overlay — same detail structure for every loan; backdrop dims the grid.
 */
export function LoanProductDetailModal({ product, onClose }: LoanProductDetailModalProps) {
  const titleId = useId();
  const reduceMotion = useReducedMotion();
  const open = Boolean(product);

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
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [open]);

  if (typeof document === "undefined") return null;

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.22, ease: [0.4, 0, 0.2, 1] as const };

  return createPortal(
    <AnimatePresence>
      {product ? (
        <motion.div
          key={product.id}
          role="presentation"
          className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
        >
          <div
            className="absolute inset-0 bg-navy/45 backdrop-blur-[2px] motion-reduce:backdrop-blur-none"
            aria-hidden
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-[1] flex w-full max-w-5xl flex-col rounded-t-[6px] border border-slate-200/90 bg-white shadow-[0_24px_80px_rgba(10,25,47,0.16)] sm:rounded-[4px] sm:shadow-[0_24px_80px_rgba(10,25,47,0.14)] max-h-[100dvh] sm:max-h-[min(94dvh,920px)] min-h-0"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.98, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 8 }}
            transition={transition}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex shrink-0 justify-end rounded-t-[inherit] border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur-sm sm:rounded-t-[4px] sm:px-6 sm:py-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-[3px] p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2"
                aria-label="Close"
              >
                <X size={20} strokeWidth={1.75} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 pt-2 sm:px-8 sm:pb-8 sm:pt-0">
              <LoanProductModalContent product={product} titleId={titleId} />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
