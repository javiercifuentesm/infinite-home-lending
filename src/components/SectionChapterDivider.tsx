import type { ReactNode } from "react";

type SectionChapterDividerProps = {
  /** Short label, e.g. "Guidance" — optional */
  label?: ReactNode;
  className?: string;
};

/**
 * Quiet chapter break between major sections — line rhythm + optional label.
 */
export function SectionChapterDivider({ label, className = "" }: SectionChapterDividerProps) {
  return (
    <div
      className={`relative flex items-center gap-4 py-5 lg:py-6 ${className}`}
      aria-hidden={!label}
    >
      <div className="h-px flex-1 bg-slate-200/80" />
      {label && (
        <span className="type-label text-navy/28 tracking-[0.22em] shrink-0 max-w-[min(100%,12rem)] text-center">
          {label}
        </span>
      )}
      <div className="h-px flex-1 bg-slate-200/80" />
    </div>
  );
}
