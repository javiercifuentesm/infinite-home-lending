import { shortTzLabel } from "../../lib/agent-v2/agentV2Timezone";

export function AgentV2ConfirmationCard({
  slotLabel,
  contactPreference,
  preferredContactTime,
  schedulingTimezoneUsed,
  subjectPropertyAddress,
  subjectCity,
  subjectState,
  subjectZip,
  onDone,
}: {
  slotLabel: string;
  contactPreference?: string;
  preferredContactTime?: string;
  schedulingTimezoneUsed?: string;
  subjectPropertyAddress?: string;
  subjectCity?: string;
  subjectState?: string;
  subjectZip?: string;
  onDone: () => void;
}) {
  const reach =
    [contactPreference, preferredContactTime].filter(Boolean).join(" · ") || "As agreed";
  const area =
    subjectPropertyAddress?.trim() ||
    [subjectCity, subjectState, subjectZip].filter(Boolean).join(", ") ||
    null;

  return (
    <div className="rounded-[4px] border border-slate-200/90 bg-white px-4 py-5">
      <dl className="mb-6 space-y-4">
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Consultation</dt>
          <dd className="mt-1 text-[15px] font-medium text-navy">{slotLabel}</dd>
          {schedulingTimezoneUsed ? (
            <dd className="mt-1 text-[13px] text-slate-600">
              Local time: {shortTzLabel(schedulingTimezoneUsed)} ({schedulingTimezoneUsed})
            </dd>
          ) : null}
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">How we&apos;ll reach you</dt>
          <dd className="mt-1 text-[15px] font-medium text-navy">{reach}</dd>
        </div>
        {area ? (
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Property / area</dt>
            <dd className="mt-1 text-[15px] font-medium text-navy">{area}</dd>
          </div>
        ) : null}
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">What happens next</dt>
          <dd className="mt-1 text-[15px] leading-relaxed text-slate-700">
            A team member will confirm details and send any follow-up so your conversation stays focused.
          </dd>
        </div>
      </dl>
      <button type="button" onClick={onDone} className="btn-primary w-full">
        Done
      </button>
    </div>
  );
}
