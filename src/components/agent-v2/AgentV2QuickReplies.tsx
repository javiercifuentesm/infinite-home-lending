import type { QuickReplyTarget } from "../../lib/agent-v2/agentV2Types";

export function AgentV2QuickReplies({
  options,
  targetField,
  onSelect,
  selectedOption,
}: {
  options: string[];
  targetField: QuickReplyTarget;
  onSelect: (option: string, target: QuickReplyTarget) => void;
  /** When set, highlights the matching option (canonical state from parent) */
  selectedOption?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => {
        const selected = selectedOption !== undefined && selectedOption === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(opt, targetField)}
            className={`w-full rounded-[4px] border px-4 py-3.5 text-left text-[15px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 ${
              selected
                ? "border-gold/50 bg-amber-50/80 text-navy ring-1 ring-gold/25"
                : "border-slate-200/90 bg-white text-navy hover:border-slate-300 hover:bg-slate-50/90"
            }`}
            aria-pressed={selected}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
