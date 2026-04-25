import type { ReactNode } from "react";
import { useMortgageAgent } from "./mortgageAgentContext";

type Variant = "primary" | "secondary" | "gold" | "outlineLight";

export function MortgageAgentCTA({
  children,
  className = "",
  variant = "primary",
  pageContext,
}: {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  /** Route or page id for lead packet (e.g. how-we-work) */
  pageContext?: string;
}) {
  const { openAgent } = useMortgageAgent();
  const base =
    variant === "primary"
      ? "btn-primary"
      : variant === "gold"
        ? "btn-gold"
        : variant === "outlineLight"
          ? "bg-transparent border border-white/25 text-white px-10 py-[1.05rem] rounded-[4px] font-sans font-bold uppercase tracking-[0.14em] text-xs hover:bg-white/[0.06] hover:border-white/40 transition-all duration-200 ease-out touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          : "btn-secondary";
  return (
    <button type="button" onClick={() => openAgent({ pageContext })} className={`${base} ${className}`.trim()}>
      {children}
    </button>
  );
}
