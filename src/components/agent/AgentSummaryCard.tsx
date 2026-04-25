export function AgentSummaryCard({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div className="rounded-[4px] border border-slate-200/90 bg-white px-4 py-4">
      <ul className="space-y-3">
        {rows.map((row) => (
          <li key={row.label} className="flex flex-col gap-0.5 border-b border-slate-100 pb-3 last:border-0 last:pb-0 sm:flex-row sm:justify-between sm:gap-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{row.label}</span>
            <span className="text-[15px] font-medium text-navy sm:text-right">{row.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
