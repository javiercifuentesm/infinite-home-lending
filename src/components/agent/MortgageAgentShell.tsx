import { ChevronLeft, X } from "lucide-react";
import type { ReactNode } from "react";
import { AgentProgress } from "./AgentProgress";
import { PROGRESS_TOTAL } from "../../lib/agent/mortgageAgentFlow";

export function MortgageAgentShell({
  stepIndex,
  onClose,
  onBack,
  showBack,
  children,
  footer,
}: {
  stepIndex: number;
  onClose: () => void;
  onBack: () => void;
  showBack: boolean;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-[#FAFBFC]">
      <header className="flex shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          {showBack ? (
            <button
              type="button"
              onClick={onBack}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] text-navy transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/45"
              aria-label="Back"
            >
              <ChevronLeft size={22} strokeWidth={1.5} />
            </button>
          ) : (
            <span className="w-10" aria-hidden />
          )}
        </div>
        <p className="truncate text-center font-heading text-[0.9375rem] font-semibold tracking-[-0.02em] text-navy">
          Infinite Home Lending
        </p>
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] text-slate-500 transition-colors hover:bg-slate-100 hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/45"
          aria-label="Close"
        >
          <X size={20} strokeWidth={1.5} />
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <AgentProgress current={stepIndex} total={PROGRESS_TOTAL} />
        {children}
      </div>

      {footer ? (
        <footer className="shrink-0 border-t border-slate-200/80 bg-white px-4 py-4 sm:px-6">{footer}</footer>
      ) : null}
    </div>
  );
}
