/**
 * Irreversibility — sharp loss lines, illustrative only.
 */

import type { DiagnosisNarrative, FinancialRealityNumbers, RealityAnswers } from "./engine";
import type { ConsequenceTracker } from "./consequenceTracker";
import type { SharpBlock } from "./sharpLines";

export type IrreversibilityMode = "cautious" | "analytical" | "emotional";

export type IrreversibilityEngine = {
  sharp: SharpBlock;
  irreversibleHeadline: string;
  lockInScenario: string;
  lockInSecondary: string;
  opportunityLossSnapshot: {
    line1: string;
    line2: string;
    line3: string;
  };
  pointOfNoReturn: string;
  identityTrigger: string;
  finalPressureLine: string;
  /** Emotional close under final insight headline */
  finalInsightSubline: string;
  mode: IrreversibilityMode;
};

function fmt(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

function modeFrom(a: RealityAnswers, narrative: DiagnosisNarrative): IrreversibilityMode {
  if (a.timing === 3 || narrative.primaryConstraintLabel === "Timing uncertainty") return "cautious";
  if (a.paymentComfort <= 1 && a.income >= 2) return "analytical";
  if (a.credit === 2 || a.credit === 3) return "analytical";
  return "emotional";
}

export function buildIrreversibility(
  a: RealityAnswers,
  narrative: DiagnosisNarrative,
  tracker: ConsequenceTracker,
  _n: FinancialRealityNumbers,
  ctx: { midPrice: number; priceBumpAnnual: number },
): IrreversibilityEngine {
  const mode = modeFrom(a, narrative);
  const now = tracker.scenarios.find((s) => s.id === "now");
  const w12 = tracker.scenarios.find((s) => s.id === "12m");
  const priceNow = now?.purchasePrice ?? ctx.midPrice;
  const price12 = w12?.purchasePrice ?? Math.round(ctx.midPrice * (1 + ctx.priceBumpAnnual));
  const payNow = now?.monthlyPayment ?? 0;
  const pay12 = w12?.monthlyPayment ?? payNow;
  const payDiff = Math.max(0, pay12 - payNow);
  const priceDiff = Math.max(0, price12 - priceNow);

  const priceAt5 = Math.round(ctx.midPrice * 1.05);

  let sharp: SharpBlock;
  if (mode === "cautious") {
    sharp = {
      hit: `The gap is ${fmt(priceDiff)} — you don't get it back.`,
      reality: `Twelve months out costs more — now.`,
      interpretation: `You paid opportunity — not a deposit.`,
      escalation: `This doesn't rewind.`,
      micDrop: `This isn't delayed — it's lost.`,
    };
  } else if (mode === "analytical") {
    sharp = {
      hit: `Sideline adds ~${fmt(payDiff)}/mo payment — locked.`,
      reality: `You don't un-pay that spread.`,
      interpretation: `Cash left — equity didn't.`,
      escalation: `No redo on those months.`,
      micDrop: `The cost isn't coming — it's here.`,
    };
  } else {
    sharp = {
      hit:
        priceAt5 > priceNow * 1.04
          ? `${fmt(priceNow)} slid toward ${fmt(priceAt5)} — gone.`
          : `Today's ${fmt(priceNow)} entry — you don't repeat it.`,
      reality: `Price moved — you paid rent through it.`,
      interpretation: `That's gone — not parked.`,
      escalation: `You don't get this time back.`,
      micDrop: `Waiting isn't neutral — it's active.`,
    };
  }

  let irreversibleHeadline: string;
  if (mode === "cautious") {
    irreversibleHeadline = `Gap: ${fmt(priceDiff)} — slimmer entry is gone.`;
  } else if (mode === "analytical") {
    irreversibleHeadline = `+${fmt(payDiff)}/mo after a year on the sideline — you paid it.`;
  } else {
    irreversibleHeadline =
      priceAt5 > priceNow * 1.04
        ? `${fmt(priceNow)} → ${fmt(priceAt5)} — sticker moved.`
        : `Different entry than ${fmt(priceNow)} — now.`;
  }

  const lockInScenario = "Prices up — you buy today's ask — not yesterday's.";
  const lockInSecondary = "Rates ease — competition bites — prices jump anyway.";

  const opportunityLossSnapshot = {
    line1: `Today ~${fmt(priceNow)} — year out ~${fmt(price12)} — ${fmt(priceDiff)} gone.`,
    line2: `Payment +~${fmt(payDiff)}/mo — out the door.`,
    line3: `Year-one equity you skipped — never hit your balance.`,
  };

  if (mode === "analytical") {
    opportunityLossSnapshot.line2 = `Payment +${fmt(payDiff)}/mo after drift — no undo.`;
  }

  let pointOfNoReturn: string;
  if (mode === "cautious") {
    pointOfNoReturn = "No rewind on price — or equity you didn't build.";
  } else if (mode === "analytical") {
    pointOfNoReturn = "Cost is baked — higher price or payment — now.";
  } else {
    pointOfNoReturn = "No rewind — only the next number.";
  }

  let identityTrigger: string;
  if (mode === "cautious") {
    identityTrigger = "Rent receipts don't lie — you already paid.";
  } else if (mode === "analytical") {
    identityTrigger = "Numbers moved — you stayed — cash left.";
  } else {
    identityTrigger = "Abstract delay — real payment.";
  }

  const finalInsightSubline = "Every month you wait, the number grows.";

  let finalPressureLine: string;
  if (mode === "cautious") {
    finalPressureLine = "This moment is already costing you money.";
  } else if (mode === "analytical") {
    finalPressureLine = "This moment is already costing you money.";
  } else {
    finalPressureLine = "This moment is already costing you money.";
  }

  return {
    sharp,
    irreversibleHeadline,
    lockInScenario,
    lockInSecondary,
    opportunityLossSnapshot,
    pointOfNoReturn,
    identityTrigger,
    finalPressureLine,
    finalInsightSubline,
    mode,
  };
}
