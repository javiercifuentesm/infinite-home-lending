import { FALLBACK_WIDGET_COPY } from "../../lib/agent-v2/agentV2Fallback";

export function AgentV2FallbackCard({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="rounded-[4px] border border-slate-200/90 bg-white px-4 py-5">
      <h3 className="font-heading text-[1.0625rem] font-semibold text-navy">{FALLBACK_WIDGET_COPY.title}</h3>
      <p className="mt-3 text-[15px] leading-relaxed text-slate-700">{FALLBACK_WIDGET_COPY.body}</p>
      <button type="button" onClick={onContinue} className="btn-primary mt-6 w-full">
        {FALLBACK_WIDGET_COPY.cta}
      </button>
    </div>
  );
}
