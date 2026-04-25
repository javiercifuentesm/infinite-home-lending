import type { ReactNode } from "react";

export function AgentV2Message({ role, children }: { role: "assistant" | "user"; children: ReactNode }) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[92%] rounded-[4px] border border-slate-200/90 bg-white px-4 py-3 text-[15px] leading-relaxed text-navy shadow-[0_1px_2px_rgba(10,25,47,0.04)]">
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-[95%] text-[15px] leading-relaxed text-slate-700">
      {children}
    </div>
  );
}
