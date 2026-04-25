import type { ReactNode } from "react";
import { X } from "lucide-react";

export function AgentV2Header({
  onClose,
  title,
  subtitle,
  devBadge,
}: {
  onClose: () => void;
  title: string;
  subtitle?: string;
  /** Dev-only instrumentation (e.g. Live LLM / Deterministic) */
  devBadge?: ReactNode;
}) {
  return (
    <header className="shrink-0 border-b border-slate-200/80 bg-white/95 px-5 py-4 sm:px-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Infinite Home Lending</p>
          <h2 id="agent-v2-title" className="mt-1 font-heading text-lg font-semibold tracking-[-0.02em] text-navy sm:text-xl">
            {title}
          </h2>
          {subtitle ? <p className="mt-1 text-[13px] leading-relaxed text-slate-600">{subtitle}</p> : null}
          {devBadge ? <div className="mt-2 flex flex-wrap items-center gap-2">{devBadge}</div> : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-[4px] border border-slate-200/90 p-2.5 text-slate-600 transition-colors hover:bg-slate-50 hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2"
          aria-label="Close conversation"
        >
          <X className="h-5 w-5" strokeWidth={1.5} aria-hidden />
        </button>
      </div>
    </header>
  );
}
