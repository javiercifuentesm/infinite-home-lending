import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { CircleHelp, X } from "lucide-react";

const POPOVER_W = 300;

export function BuyVsWaitExplainerTriggerButton(
  props: ButtonHTMLAttributes<HTMLButtonElement> & { buttonRef?: RefObject<HTMLButtonElement | null> },
) {
  const { buttonRef, className = "", onClick, ...rest } = props;
  return (
    <button
      ref={buttonRef}
      type="button"
      className={`inline-flex items-center justify-center gap-1.5 rounded-[4px] border border-slate-200/85 bg-white px-3 py-1.5 type-body-xs font-medium text-navy/70 shadow-sm transition-colors hover:border-slate-300/90 hover:bg-white hover:text-navy/85 ${className}`}
      {...rest}
      onClick={onClick}
    >
      <CircleHelp size={14} className="shrink-0 text-navy/45" strokeWidth={1.75} aria-hidden />
      How this works
    </button>
  );
}

type DialogProps = {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLButtonElement | null>;
};

type PanelLayout =
  | { kind: "mobile" }
  | { kind: "desktop"; top: number; left: number }
  | { kind: "desktopFallback"; top: number; right: number };

/**
 * Floating popover (desktop) or centered overlay (mobile). Portaled to body — no layout shift.
 */
export function BuyVsWaitExplainerDialog({ open, onClose, anchorRef }: DialogProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<PanelLayout>({ kind: "mobile" });

  useLayoutEffect(() => {
    if (!open) {
      setLayout({ kind: "mobile" });
      return;
    }

    const compute = () => {
      const vw = window.innerWidth;
      if (vw < 768) {
        setLayout({ kind: "mobile" });
        return;
      }
      const el = anchorRef.current;
      if (!el) {
        setLayout({ kind: "desktopFallback", top: 96, right: 24 });
        return;
      }
      const r = el.getBoundingClientRect();
      const left = Math.min(Math.max(16, r.right - POPOVER_W), vw - POPOVER_W - 16);
      setLayout({ kind: "desktop", top: r.bottom + 8, left });
    };

    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [open, anchorRef]);

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
    if (typeof window !== "undefined" && window.innerWidth >= 768) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const desktopStyle: CSSProperties =
    layout.kind === "desktop"
      ? { top: layout.top, left: layout.left }
      : layout.kind === "desktopFallback"
        ? { top: layout.top, right: layout.right }
        : {};

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[1000] bg-navy/25 md:bg-navy/[0.08]"
        aria-hidden
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        className={`pointer-events-auto fixed z-[1010] max-h-[min(85vh,26rem)] overflow-y-auto rounded-[4px] border border-slate-200/90 bg-white p-4 shadow-[0_16px_48px_rgba(10,25,47,0.14)] ${
          layout.kind === "mobile"
            ? "left-1/2 top-1/2 w-[min(calc(100vw-2rem),28rem)] max-w-md -translate-x-1/2 -translate-y-1/2"
            : "w-[min(100vw-2rem,300px)]"
        }`}
        style={layout.kind === "mobile" ? undefined : desktopStyle}
      >
        <div className="flex items-start justify-between gap-2">
          <h3 id={titleId} className="type-body-sm font-semibold text-navy pr-2">
            What this analysis shows
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
          This tool compares the financial impact of buying now versus waiting, based on your inputs.
        </p>

        <ul className="type-body-xs mt-3 list-disc space-y-1 pl-4 leading-relaxed text-slate-600">
          <li>Rent paid while waiting</li>
          <li>Home equity gained by buying</li>
          <li>Estimated future purchase price</li>
        </ul>

        <p className="type-body-xs mt-3 leading-relaxed text-slate-600">
          The top result shows which path looks financially stronger over your timeframe.
        </p>
      </div>
    </>,
    document.body
  );
}
