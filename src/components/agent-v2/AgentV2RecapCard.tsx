import type { RecapEditableField } from "../../lib/agent-v2/agentV2Types";

export function AgentV2RecapCard({
  lines,
  onContinue,
  onEditField,
}: {
  lines: { label: string; value: string; field?: RecapEditableField }[];
  onContinue: () => void;
  onEditField?: (field: RecapEditableField) => void;
}) {
  return (
    <div className="rounded-[4px] border border-slate-200/90 bg-white px-4 py-4">
      <ul className="mb-5 space-y-2.5">
        {lines.map((row) => (
          <li
            key={row.label}
            className="border-b border-slate-100 pb-2.5 last:border-0 last:pb-0"
          >
            <div className="flex flex-row items-start justify-between gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                {row.label}
              </span>
              {row.field && onEditField ? (
                <button
                  type="button"
                  onClick={() => onEditField(row.field!)}
                  aria-label={`Edit ${row.label}`}
                  className="shrink-0 text-[12px] font-medium text-slate-600 underline decoration-slate-300 underline-offset-2 hover:text-navy hover:decoration-navy/40"
                >
                  Edit
                </button>
              ) : null}
            </div>
            <span className="mt-1 block text-[15px] font-medium text-navy">{row.value}</span>
          </li>
        ))}
      </ul>
      <button type="button" onClick={onContinue} className="btn-primary w-full sm:w-auto">
        Continue
      </button>
    </div>
  );
}
