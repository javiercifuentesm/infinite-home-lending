import { useState } from "react";
import { validateContactCard } from "../../lib/agent-v2/agentV2Actions";
import type { AgentV2Answers } from "../../lib/agent-v2/agentV2Types";
import { AgentV2QuickReplies } from "./AgentV2QuickReplies";
import { PREFERRED_TIME_OPTIONS } from "../../lib/agent/mortgageAgentFlow";

/**
 * Fully controlled from canonical `initial` (conversation state).
 * Patches merge upstream immediately so selections survive rerenders and submit.
 */
export function AgentV2ContactCard({
  initial,
  onSubmit,
  onPatch,
}: {
  initial: AgentV2Answers;
  onSubmit: (payload: Partial<AgentV2Answers>) => void;
  onPatch: (payload: Partial<AgentV2Answers>) => void;
}) {
  const firstName = initial.firstName ?? "";
  const email = initial.email ?? "";
  const phone = initial.phone ?? "";
  const preferredContactTime = initial.preferredContactTime ?? "";
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = () => {
    const v = validateContactCard(initial as AgentV2Answers);
    if (!v.ok) {
      setErrors(v.errors);
      return;
    }
    onSubmit({
      firstName: initial.firstName,
      email: initial.email,
      phone: initial.phone,
      preferredContactTime: initial.preferredContactTime,
    });
  };

  return (
    <div className="space-y-4 rounded-[4px] border border-slate-200/90 bg-white p-4">
      <div className="space-y-1.5">
        <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">First name</label>
        <input
          className="type-input text-[15px]"
          value={firstName}
          onChange={(e) => {
            onPatch({ firstName: e.target.value });
            setErrors((er) => {
              const n = { ...er };
              delete n.firstName;
              return n;
            });
          }}
          autoComplete="given-name"
        />
        {errors.firstName ? <p className="text-[13px] text-slate-600">{errors.firstName}</p> : null}
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Email</label>
        <input
          type="email"
          className="type-input text-[15px]"
          value={email}
          onChange={(e) => {
            onPatch({ email: e.target.value });
            setErrors((er) => {
              const n = { ...er };
              delete n.email;
              return n;
            });
          }}
          autoComplete="email"
        />
        {errors.email ? <p className="text-[13px] text-slate-600">{errors.email}</p> : null}
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          {initial.contactPreference === "Email" ? "Phone (optional)" : "Phone"}
        </label>
        <input
          type="tel"
          className="type-input text-[15px]"
          value={phone}
          onChange={(e) => {
            onPatch({ phone: e.target.value });
            setErrors((er) => {
              const n = { ...er };
              delete n.phone;
              return n;
            });
          }}
          autoComplete="tel"
        />
        {errors.phone ? <p className="text-[13px] text-slate-600">{errors.phone}</p> : null}
      </div>
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Preferred contact time</p>
        <AgentV2QuickReplies
          options={[...PREFERRED_TIME_OPTIONS]}
          targetField="preferredContactTime"
          selectedOption={preferredContactTime || undefined}
          onSelect={(opt, _target) => {
            onPatch({ preferredContactTime: opt });
            setErrors((e) => {
              const n = { ...e };
              delete n.preferredContactTime;
              return n;
            });
          }}
        />
        {errors.preferredContactTime ? (
          <p className="mt-2 text-[13px] text-slate-600">{errors.preferredContactTime}</p>
        ) : null}
      </div>
      <button type="button" onClick={submit} className="btn-primary w-full">
        Continue
      </button>
    </div>
  );
}
