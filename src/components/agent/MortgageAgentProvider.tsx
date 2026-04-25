import { useCallback, useMemo, useState, type ReactNode } from "react";
import { MortgageAgentModal } from "./MortgageAgentModal";
import { MortgageAgentContext, type MortgageAgentContextValue } from "./mortgageAgentContext";
import type { MortgageAgentAnswers } from "../../lib/agent/mortgageAgentTypes";
import { AGENT_STEP_ORDER } from "../../lib/agent/mortgageAgentTypes";
import { buildLeadPacket } from "../../lib/agent/mortgageAgentLeadPacket";
import { submitMortgageLead } from "../../lib/agent/mortgageAgentSubmission";
import { isValidEmail, isValidPhone } from "../../lib/agent/mortgageAgentUtils";

const initialAnswers = (): MortgageAgentAnswers => ({
  goal: null,
  timeline: null,
  priceRange: null,
  creditRange: null,
  financialComfort: null,
  contactPreference: null,
  firstName: "",
  email: "",
  phone: "",
  preferredContactTime: null,
  appointmentSlot: null,
});

function validateContact(answers: MortgageAgentAnswers): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!answers.firstName.trim()) {
    errors.firstName = "Please add your first name.";
  }
  if (!isValidEmail(answers.email)) {
    errors.email = "Please enter a valid email so we can send your next steps.";
  }
  const needsPhone = answers.contactPreference === "Call" || answers.contactPreference === "Text";
  if (needsPhone && !isValidPhone(answers.phone)) {
    errors.phone = "Please add a phone number so we can reach you.";
  }
  if (!answers.preferredContactTime) {
    errors.preferredContactTime = "Choose a preferred contact window.";
  }
  return errors;
}

export function MortgageAgentProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pageContext, setPageContext] = useState("site");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<MortgageAgentAnswers>(initialAnswers);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const stepId = AGENT_STEP_ORDER[stepIndex] ?? "intro";

  const resetAgent = useCallback(() => {
    setStepIndex(0);
    setAnswers(initialAnswers());
    setFieldErrors({});
    setSubmitting(false);
  }, []);

  const closeAgent = useCallback(() => {
    setIsOpen(false);
    resetAgent();
  }, [resetAgent]);

  const openAgent = useCallback((opts?: { pageContext?: string; seedAnswers?: Partial<MortgageAgentAnswers>; startStepIndex?: number }) => {
    setPageContext(opts?.pageContext ?? "site");
    const merged = { ...initialAnswers(), ...opts?.seedAnswers };
    setAnswers(merged);
    setStepIndex(opts?.startStepIndex ?? 0);
    setFieldErrors({});
    setIsOpen(true);
  }, []);

  const clearFieldError = useCallback((key: string) => {
    setFieldErrors((e) => {
      const next = { ...e };
      delete next[key];
      return next;
    });
  }, []);

  const setField = useCallback(
    <K extends keyof MortgageAgentAnswers>(key: K, value: MortgageAgentAnswers[K]) => {
      setAnswers((a) => ({ ...a, [key]: value }));
      clearFieldError(key as string);
    },
    [clearFieldError],
  );

  const setQuickAnswer = useCallback(
    <K extends keyof MortgageAgentAnswers>(key: K, value: MortgageAgentAnswers[K]) => {
      setAnswers((a) => ({ ...a, [key]: value }));
      setStepIndex((i) => Math.min(i + 1, AGENT_STEP_ORDER.length - 1));
    },
    [],
  );

  const submitLead = useCallback(async () => {
    const packet = buildLeadPacket(answers, pageContext);
    setSubmitting(true);
    try {
      await submitMortgageLead(packet);
    } finally {
      setSubmitting(false);
    }
  }, [answers, pageContext]);

  const goNext = useCallback(async () => {
    const id = AGENT_STEP_ORDER[stepIndex];
    if (id === "contact") {
      const err = validateContact(answers);
      if (Object.keys(err).length) {
        setFieldErrors(err);
        return;
      }
    }
    if (id === "schedule") {
      if (!answers.appointmentSlot) {
        setFieldErrors({ appointmentSlot: "Please choose a time to continue." });
        return;
      }
      await submitLead();
      setFieldErrors({});
    }
    setStepIndex((i) => Math.min(i + 1, AGENT_STEP_ORDER.length - 1));
  }, [stepIndex, answers, submitLead]);

  const goBack = useCallback(() => {
    setFieldErrors({});
    setStepIndex((i) => Math.max(0, i - 1));
  }, []);

  const value = useMemo(
    (): MortgageAgentContextValue => ({
      isOpen,
      pageContext,
      stepId,
      stepIndex,
      answers,
      fieldErrors,
      submitting,
      openAgent,
      closeAgent,
      goBack,
      goNext,
      resetAgent,
      setQuickAnswer,
      setField,
      clearFieldError,
    }),
    [
      isOpen,
      pageContext,
      stepId,
      stepIndex,
      answers,
      fieldErrors,
      submitting,
      openAgent,
      closeAgent,
      goBack,
      goNext,
      resetAgent,
      setQuickAnswer,
      setField,
      clearFieldError,
    ],
  );

  return (
    <MortgageAgentContext.Provider value={value}>
      {children}
      <MortgageAgentModal />
    </MortgageAgentContext.Provider>
  );
}
