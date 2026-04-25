import type { MockSlot } from "../../lib/agent/mortgageAgentMockSlots";

export type ScheduleCardData = {
  slots: MockSlot[];
  scheduleNote?: string;
  timezone?: string;
  timezoneLabel?: string;
  preferredContactTime?: string;
};

export function AgentV2ScheduleCard({
  data,
  onSelect,
}: {
  data?: ScheduleCardData | null;
  onSelect: (slot: MockSlot) => void;
}) {
  const slots = data?.slots ?? [];

  if (slots.length === 0) {
    return (
      <div className="rounded-[4px] border border-slate-200/90 bg-white p-4 text-[15px] text-slate-600">
        No times available right now. Please try again in a moment.
      </div>
    );
  }

  return (
    <div className="rounded-[4px] border border-slate-200/90 bg-white p-4">
      {data?.preferredContactTime ? (
        <p className="mb-3 text-[12px] text-slate-500">
          Showing times for: <span className="font-medium text-navy">{data.preferredContactTime}</span>
          {data.timezoneLabel ? (
            <>
              {" "}
              · <span className="text-slate-600">{data.timezoneLabel}</span>
            </>
          ) : null}
        </p>
      ) : null}
      <ul className="space-y-2">
        {slots.map((slot) => (
          <li key={slot.id}>
            <button
              type="button"
              onClick={() => onSelect(slot)}
              className="w-full rounded-[4px] border border-slate-200/90 bg-white px-4 py-3.5 text-left text-[15px] font-medium text-navy transition-colors duration-200 hover:border-slate-300 hover:bg-slate-50/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2"
            >
              {slot.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
