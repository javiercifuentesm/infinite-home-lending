import { createContext, useContext } from "react";
import type { AgentStepId, MortgageAgentAnswers } from "../../lib/agent/mortgageAgentTypes";

export interface MortgageAgentContextValue {
  isOpen: boolean;
  pageContext: string;
  stepId: AgentStepId;
  stepIndex: number;
  answers: MortgageAgentAnswers;
  fieldErrors: Record<string, string>;
  submitting: boolean;
  openAgent: (opts?: {
    pageContext?: string;
    seedAnswers?: Partial<MortgageAgentAnswers>;
    startStepIndex?: number;
  }) => void;
  closeAgent: () => void;
  goBack: () => void;
  goNext: () => Promise<void>;
  resetAgent: () => void;
  setQuickAnswer: <K extends keyof MortgageAgentAnswers>(key: K, value: MortgageAgentAnswers[K]) => void;
  setField: <K extends keyof MortgageAgentAnswers>(key: K, value: MortgageAgentAnswers[K]) => void;
  clearFieldError: (key: string) => void;
}

export const MortgageAgentContext = createContext<MortgageAgentContextValue | null>(null);

export function useMortgageAgent(): MortgageAgentContextValue {
  const ctx = useContext(MortgageAgentContext);
  if (!ctx) {
    throw new Error("useMortgageAgent must be used within MortgageAgentProvider");
  }
  return ctx;
}
