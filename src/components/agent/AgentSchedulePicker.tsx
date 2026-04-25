import { getMockAppointmentSlots } from "../../lib/agent/mortgageAgentMockSlots";

export function AgentSchedulePicker({
  selected,
  onSelect,
  error,
}: {
  selected: string | null;
  onSelect: (label: string) => void;
  error?: string;
}) {
  const slots = getMockAppointmentSlots();
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {slots.map((s) => {
          const active = selected === s.label;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.label)}
              className={`rounded-[4px] border px-3 py-3 text-left text-[14px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/45 focus-visible:ring-offset-2 ${
                active
                  ? "border-navy bg-navy/[0.04] text-navy"
                  : "border-slate-200/90 bg-white text-navy hover:border-slate-300"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>
      {error ? <p className="text-[13px] text-slate-600">{error}</p> : null}
    </div>
  );
}
