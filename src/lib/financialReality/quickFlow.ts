/**
 * Maps3 low-friction inputs (rent, income band, timeline) into the full diagnosis engine.
 */

import {
  computeFinancialReality,
  type FinancialRealityOutcome,
  type RealityAnswers,
} from "./engine";

const PAYMENT_MID = [1750, 2500, 3750, 5250] as const;

function nearestPaymentBucket(rent: number): number {
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < PAYMENT_MID.length; i++) {
    const d = Math.abs(rent - PAYMENT_MID[i]);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}

function clamp3(n: number): number {
  return Math.max(0, Math.min(3, Math.floor(n)));
}

export function normalizeRentMonthly(rentMonthly: number): number {
  return Math.min(10_000, Math.max(500, Math.round(rentMonthly)));
}

export function buildRealityFromQuickInputs(
  rentMonthly: number,
  incomeIndex: number,
  timingIndex: number,
): RealityAnswers {
  const rent = normalizeRentMonthly(rentMonthly);
  return {
    paymentComfort: nearestPaymentBucket(rent),
    income: clamp3(incomeIndex),
    credit: 1,
    savings: 1,
    timing: clamp3(timingIndex),
  };
}

export function computeFromQuickInputs(
  rentMonthly: number,
  incomeIndex: number,
  timingIndex: number,
): FinancialRealityOutcome {
  const rent = normalizeRentMonthly(rentMonthly);
  const answers = buildRealityFromQuickInputs(rent, incomeIndex, timingIndex);
  return computeFinancialReality(answers, { rentMonthly: rent });
}
