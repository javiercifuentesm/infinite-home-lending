import type { ReactNode } from "react";
import { useAgentV2 } from "../../context/AgentV2Context";

type Variant = "primary" | "secondary" | "gold" | "outlineLight";

/**
 * Opens Agent V2 with a page/analytics context. Prefer this over V1 CTAs where the conversational shell is desired.
 */
export function AgentV2Launcher({
  children,
  className = "",
  variant = "primary",
  pageContext = "site",
}: {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  /** e.g. how-we-work, hero, mid-path, final-cta */
  pageContext?: string;
}) {
  const { openAgentV2 } = useAgentV2();
  const base =
    variant === "primary"
      ? "btn-primary"
      : variant === "gold"
        ? "btn-gold"
        : variant === "outlineLight"
          ? "bg-transparent border border-white/25 text-white px-10 py-[1.05rem] rounded-[4px] font-sans font-bold uppercase tracking-[0.14em] text-xs hover:bg-white/[0.06] hover:border-white/40 transition-all duration-200 ease-out touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          : "btn-secondary";
  return (
    <button type="button" onClick={() => openAgentV2({ pageContext })} className={`${base} ${className}`.trim()}>
      {children}
    </button>
  );
}
