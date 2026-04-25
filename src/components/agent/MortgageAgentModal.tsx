import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useMortgageAgent } from "./mortgageAgentContext";
import { MortgageAgentShell } from "./MortgageAgentShell";
import { AgentMessage } from "./AgentMessage";
import { AgentOptionButtons } from "./AgentOptionButtons";
import { AgentInputField } from "./AgentInputField";
import { AgentSummaryCard } from "./AgentSummaryCard";
import { AgentSchedulePicker } from "./AgentSchedulePicker";
import { AgentConfirmation } from "./AgentConfirmation";
import {
  CONTACT_PREF_OPTIONS,
  CREDIT_OPTIONS,
  FINANCIAL_COMFORT_OPTIONS,
  GOAL_OPTIONS,
  PREFERRED_TIME_OPTIONS,
  PRICE_OPTIONS,
  TIMELINE_OPTIONS,
} from "../../lib/agent/mortgageAgentFlow";
import { buildAdvisorSummary, buildShortRecapLines } from "../../lib/agent/mortgageAgentSummary";
import type {
  ContactPreference,
  CreditRange,
  FinancialComfort,
  MortgageGoal,
  MortgageTimeline,
  PriceRangeBucket,
} from "../../lib/agent/mortgageAgentTypes";
import type { PreferredContactTime } from "../../lib/agent/mortgageAgentTypes";

export function MortgageAgentModal() {
  const {
    isOpen,
    stepId,
    stepIndex,
    answers,
    fieldErrors,
    submitting,
    closeAgent,
    goBack,
    goNext,
    setQuickAnswer,
    setField,
  } = useMortgageAgent();

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAgent();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeAgent]);

  useEffect(() => {
    if (!isOpen) return;
    const t = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("button, input, [href], select")?.focus();
    }, 50);
    return () => window.clearTimeout(t);
  }, [isOpen, stepId]);

  if (!isOpen) return null;

  const showBack = stepIndex > 0;

  const priceTitle =
    answers.goal === "Refinance"
      ? "What loan size or property value range are you working with?"
      : "What price range are you considering?";

  let body: ReactNode = null;
  let footer: ReactNode = null;

  switch (stepId) {
    case "intro":
      body = (
        <>
          <AgentMessage title="Let's walk through this together.">
            <p className="text-[15px] leading-relaxed text-slate-600">
              I'll ask a few quick questions to understand your situation and help guide the right next step.
            </p>
          </AgentMessage>
          <p className="mb-8 text-[13px] leading-relaxed text-slate-500">
            This takes about 2 minutes. No pressure — just clarity.
          </p>
        </>
      );
      footer = (
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={closeAgent} className="btn-secondary order-2 sm:order-1">
            Not Now
          </button>
          <button type="button" onClick={() => goNext()} className="btn-primary order-1 sm:order-2">
            Get Started
          </button>
        </div>
      );
      break;

    case "goal":
      body = (
        <AgentMessage title="What are you looking to do?" />
      );
      footer = (
        <AgentOptionButtons
          options={GOAL_OPTIONS}
          selected={answers.goal}
          onSelect={(v) => setQuickAnswer("goal", v as MortgageGoal)}
        />
      );
      break;

    case "timeline":
      body = <AgentMessage title="When are you planning to move forward?" />;
      footer = (
        <AgentOptionButtons
          options={TIMELINE_OPTIONS}
          selected={answers.timeline}
          onSelect={(v) => setQuickAnswer("timeline", v as MortgageTimeline)}
        />
      );
      break;

    case "priceRange":
      body = <AgentMessage title={priceTitle} />;
      footer = (
        <AgentOptionButtons
          options={PRICE_OPTIONS}
          selected={answers.priceRange}
          onSelect={(v) => setQuickAnswer("priceRange", v as PriceRangeBucket)}
        />
      );
      break;

    case "creditRange":
      body = <AgentMessage title="How would you describe your credit?" />;
      footer = (
        <AgentOptionButtons
          options={CREDIT_OPTIONS}
          selected={answers.creditRange}
          onSelect={(v) => setQuickAnswer("creditRange", v as CreditRange)}
        />
      );
      break;

    case "financialComfort":
      body = (
        <AgentMessage title="How do you feel about your current financial position for this step?" />
      );
      footer = (
        <AgentOptionButtons
          options={FINANCIAL_COMFORT_OPTIONS}
          selected={answers.financialComfort}
          onSelect={(v) => setQuickAnswer("financialComfort", v as FinancialComfort)}
        />
      );
      break;

    case "contactPreference":
      body = <AgentMessage title="What's the best way to reach you?" />;
      footer = (
        <AgentOptionButtons
          options={CONTACT_PREF_OPTIONS}
          selected={answers.contactPreference}
          onSelect={(v) => setQuickAnswer("contactPreference", v as ContactPreference)}
        />
      );
      break;

    case "contact":
      body = (
        <>
          <AgentMessage title="Where should we send your next steps?" />
          <div className="space-y-4">
            <AgentInputField
              id="ma-first"
              label="First name"
              value={answers.firstName}
              onChange={(v) => setField("firstName", v)}
              error={fieldErrors.firstName}
              autoComplete="given-name"
            />
            <AgentInputField
              id="ma-email"
              label="Email"
              type="email"
              value={answers.email}
              onChange={(v) => setField("email", v)}
              error={fieldErrors.email}
              autoComplete="email"
            />
            <AgentInputField
              id="ma-phone"
              label={answers.contactPreference === "Email" ? "Phone (optional)" : "Phone"}
              type="tel"
              value={answers.phone}
              onChange={(v) => setField("phone", v)}
              error={fieldErrors.phone}
              autoComplete="tel"
              inputMode="tel"
            />
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Preferred contact time
              </p>
              <AgentOptionButtons
                options={[...PREFERRED_TIME_OPTIONS]}
                selected={answers.preferredContactTime}
                onSelect={(v) => setField("preferredContactTime", v as PreferredContactTime)}
              />
              {fieldErrors.preferredContactTime ? (
                <p className="mt-2 text-[13px] text-slate-600">{fieldErrors.preferredContactTime}</p>
              ) : null}
            </div>
          </div>
        </>
      );
      footer = (
        <button type="button" onClick={() => void goNext()} className="btn-primary w-full sm:w-auto sm:min-w-[200px]">
          Continue
        </button>
      );
      break;

    case "summary": {
      const summaryText = buildAdvisorSummary(answers);
      const recap = buildShortRecapLines(answers);
      body = (
        <>
          <AgentMessage title="Here's how I'm understanding your situation">
            <p className="text-[15px] leading-relaxed text-slate-600">{summaryText}</p>
          </AgentMessage>
          <AgentSummaryCard rows={recap} />
        </>
      );
      footer = (
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button type="button" onClick={goBack} className="btn-secondary w-full sm:w-auto">
            Go Back
          </button>
          <button type="button" onClick={() => void goNext()} className="btn-primary w-full sm:w-auto">
            Continue
          </button>
        </div>
      );
      break;
    }

    case "schedule":
      body = (
        <>
          <AgentMessage
            title="Pick a time that works best for you"
            sub="A quick conversation can help clarify your options and next steps."
          />
          <AgentSchedulePicker
            selected={answers.appointmentSlot}
            onSelect={(label) => {
              setField("appointmentSlot", label);
            }}
            error={fieldErrors.appointmentSlot}
          />
        </>
      );
      footer = (
        <button
          type="button"
          disabled={submitting}
          onClick={() => void goNext()}
          className="btn-primary w-full sm:w-auto disabled:cursor-wait disabled:opacity-70"
        >
          {submitting ? "Scheduling…" : "Continue"}
        </button>
      );
      break;

    case "confirmation":
      body = (
        <>
          <AgentMessage title="You're all set.">
            <p className="text-[15px] leading-relaxed text-slate-600">
              We'll come prepared with options based on what you shared, so the conversation is focused and useful from
              the start.
            </p>
          </AgentMessage>
          <AgentConfirmation
            name={answers.firstName}
            appointment={answers.appointmentSlot ?? "—"}
            contactMethod={answers.contactPreference ?? "—"}
            email={answers.email}
            phone={answers.phone}
          />
          <p className="mt-5 text-[14px] leading-relaxed text-slate-600">
            We'll follow up with confirmation details shortly.
          </p>
        </>
      );
      footer = (
        <button type="button" onClick={closeAgent} className="btn-primary w-full sm:w-auto">
          Done
        </button>
      );
      break;

    default:
      body = null;
  }

  const modal = (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-navy/35 backdrop-blur-[2px] transition-opacity"
        aria-label="Dismiss"
        onClick={closeAgent}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mortgage-agent-title"
        className="relative flex max-h-[100dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-[6px] border border-slate-200/90 bg-[#FAFBFC] shadow-[0_-12px_60px_rgba(10,25,47,0.12)] sm:max-h-[min(92dvh,880px)] sm:rounded-[4px] sm:shadow-[0_24px_80px_rgba(10,25,47,0.14)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="mortgage-agent-title" className="sr-only">
          Mortgage consultation intake
        </h2>
        <MortgageAgentShell
          stepIndex={stepIndex}
          onClose={closeAgent}
          onBack={goBack}
          showBack={showBack}
          footer={footer}
        >
          {body}
        </MortgageAgentShell>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
