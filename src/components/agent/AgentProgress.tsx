export function AgentProgress({ current, total }: { current: number; total: number }) {
  if (current <= 0) return null;
  const pct = Math.min(100, (current / total) * 100);
  return (
    <div className="mb-6">
      <div className="h-[2px] w-full overflow-hidden rounded-full bg-slate-200/90">
        <div
          className="h-full bg-gold/55 transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        Step {current} of {total}
      </p>
    </div>
  );
}
