import type { ReactNode } from "react";

export function AgentMessage({
  title,
  children,
  sub,
}: {
  title: string;
  children?: ReactNode;
  sub?: string;
}) {
  return (
    <div className="mb-6 space-y-3">
      <h2 className="font-heading text-[1.35rem] sm:text-[1.5rem] font-semibold leading-snug tracking-[-0.03em] text-navy">
        {title}
      </h2>
      {sub ? <p className="text-[15px] leading-relaxed text-slate-600">{sub}</p> : null}
      {children}
    </div>
  );
}
