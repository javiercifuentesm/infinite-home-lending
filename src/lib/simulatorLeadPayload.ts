import type { ComparisonStrength, HorizonInterpretation } from "./simulatorInterpretation";
import type { HorizonSlice, PositionSnapshot, SimulatorHorizonYears } from "./mortgage";

export type SimulatorLeadPayload = {
  version: 1;
  capturedAt: string;
  mode: "payment" | "affordability";
  horizon: { key: SimulatorHorizonYears; label: string; months: number };
  scenarioA: Record<string, number>;
  scenarioB: Record<string, number>;
  resultA: {
    total: number;
    principalAndInterest: number;
    loanAmount: number;
    impliedPrice?: number;
  };
  resultB: {
    total: number;
    principalAndInterest: number;
    loanAmount: number;
    impliedPrice?: number;
  };
  horizonWindow: {
    interestPaidA: number;
    interestPaidB: number;
    principalPaidA: number;
    principalPaidB: number;
    remainingBalanceA: number;
    remainingBalanceB: number;
    interestGap: number;
    interestWinner: "A" | "B" | "tie";
    strength: ComparisonStrength;
    primaryHeadline: string;
    deltaDisplay: string;
  };
};

export function buildSimulatorLeadPayload(input: {
  mode: "payment" | "affordability";
  a: Record<string, number>;
  b: Record<string, number>;
  resultA: {
    total: number;
    principalAndInterest: number;
    loanAmount: number;
    impliedPrice?: number;
  };
  resultB: {
    total: number;
    principalAndInterest: number;
    loanAmount: number;
    impliedPrice?: number;
  };
  selectedHorizon: SimulatorHorizonYears;
  horizonLabel: string;
  horizonMonths: number;
  sliceA: HorizonSlice;
  sliceB: HorizonSlice;
  posA: PositionSnapshot;
  posB: PositionSnapshot;
  interpretation: HorizonInterpretation;
}): SimulatorLeadPayload {
  const { sliceA, sliceB, posA, posB, interpretation } = input;
  return {
    version: 1,
    capturedAt: new Date().toISOString(),
    mode: input.mode,
    horizon: {
      key: input.selectedHorizon,
      label: input.horizonLabel,
      months: input.horizonMonths,
    },
    scenarioA: { ...input.a },
    scenarioB: { ...input.b },
    resultA: { ...input.resultA },
    resultB: { ...input.resultB },
    horizonWindow: {
      interestPaidA: sliceA.interestPaid,
      interestPaidB: sliceB.interestPaid,
      principalPaidA: sliceA.principalPaid,
      principalPaidB: sliceB.principalPaid,
      remainingBalanceA: posA.remainingBalance,
      remainingBalanceB: posB.remainingBalance,
      interestGap: interpretation.interestGap,
      interestWinner: interpretation.interestWinner,
      strength: interpretation.strength,
      primaryHeadline: interpretation.primaryHeadline,
      deltaDisplay: interpretation.deltaDisplay,
    },
  };
}

/** Purchase intent — CRM/LOS-friendly labels. */
export type SimulatorPurchaseTimeline =
  | "exploring"
  | "3-6-months"
  | "buying-soon";

export type SimulatorLeadSubmission = {
  source: "simulator_scenario_review";
  firstName: string;
  email: string;
  phone?: string;
  timeline: SimulatorPurchaseTimeline;
  payload: SimulatorLeadPayload;
  submittedAt: string;
};

/**
 * Sends lead + scenario snapshot. Set `VITE_SIMULATOR_LEAD_ENDPOINT` to POST JSON.
 * Without an endpoint, stores JSON in sessionStorage (and logs in dev).
 */
export async function submitSimulatorLead(
  submission: Omit<SimulatorLeadSubmission, "submittedAt" | "source"> & { source?: SimulatorLeadSubmission["source"] }
): Promise<void> {
  const body: SimulatorLeadSubmission = {
    ...submission,
    source: submission.source ?? "simulator_scenario_review",
    submittedAt: new Date().toISOString(),
  };
  const endpoint = import.meta.env.VITE_SIMULATOR_LEAD_ENDPOINT as string | undefined;
  if (endpoint?.trim()) {
    const res = await fetch(endpoint.trim(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`Submit failed (${res.status})`);
    }
    return;
  }
  try {
    sessionStorage.setItem("simulator_lead_last", JSON.stringify(body));
  } catch {
    /* quota / private mode */
  }
  if (import.meta.env.DEV) {
    console.info("[SimulatorLead]", body);
  }
}
