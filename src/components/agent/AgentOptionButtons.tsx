export function AgentOptionButtons<T extends string>({
  options,
  selected,
  onSelect,
}: {
  options: readonly T[];
  selected: T | null;
  onSelect: (value: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {options.map((opt) => {
        const active = selected === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(opt)}
            className={`w-full rounded-[4px] border px-4 py-3.5 text-left text-[15px] font-medium transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/45 focus-visible:ring-offset-2 ${
              active
                ? "border-navy bg-navy/[0.04] text-navy"
                : "border-slate-200/90 bg-white text-navy hover:border-slate-300 hover:bg-slate-50/80"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
