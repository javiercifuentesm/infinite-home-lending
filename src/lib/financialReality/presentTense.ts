/**
 * Present-tense framing — sharp loss lines, illustrative.
 */

import type { ConsequenceData, DiagnosisNarrative, FinancialRealityNumbers, RealityAnswers } from "./engine";
import type { ConsequenceTracker } from "./consequenceTracker";
import type { IrreversibilityEngine } from "./irreversibility";
import type { SharpBlock } from "./sharpLines";

export type PresentTenseVoice = "renter" | "hesitant" | "analytical";

export type PresentTenseEngine = {
  sharp: SharpBlock;
  /** ${mo} → ${yr} → gone */
  numberWeapon: string;
  personalLossPrimary: string;
  moneyGoneLine: string;
  presentRealityHeadline: string;
  thisMonthLabel: string;
  lineRent: string;
  lineEquity: string;
  linePrice: string;
  totalThisMonth: number;
  totalImpactLine: string;
  lossAccumulation: string;
  irreversibleLossLine: string;
  lossContrast: string;
  presentConsequence: string;
  realityCollision: string;
  voice: PresentTenseVoice;
};

function fmt(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

function voiceFrom(a: RealityAnswers, narrative: DiagnosisNarrative): PresentTenseVoice {
  if (a.timing === 3 || narrative.primaryConstraintLabel === "Timing uncertainty") return "hesitant";
  if ((a.paymentComfort <= 1 && a.income >= 2) || a.credit === 2 || a.credit === 3) return "analytical";
  return "renter";
}

function buildSharp(
  voice: PresentTenseVoice,
  rent: number,
  total: number,
  twelveRent: number,
): SharpBlock {
  if (voice === "hesitant") {
    return {
      hit: `You spent ~${fmt(twelveRent)} on rent — kept none.`,
      reality: `You're losing ~${fmt(total)}/month right now.`,
      interpretation: `That's money building zero ownership.`,
      escalation: `You don't get these months back.`,
      micDrop: `Waiting costs you equity. Every month.`,
    };
  }
  if (voice === "analytical") {
    return {
      hit: `You left ~${fmt(twelveRent)} on the table — $0 equity.`,
      reality: `You're bleeding ~${fmt(total)}/month on the model.`,
      interpretation: `The spreadsheet moved — you paid rent anyway.`,
      escalation: `This doesn't convert later.`,
      micDrop: `You're paying — just not for yourself.`,
    };
  }
  return {
    hit: `You sent ~${fmt(twelveRent)} out — $0 ownership.`,
    reality: `Right now you lose ~${fmt(total)}/month combined.`,
    interpretation: `Rent is gone. No equity back.`,
    escalation: `That money doesn't come back.`,
    micDrop: `Rent is the only payment you never see again.`,
  };
}

export function buildPresentTense(
  a: RealityAnswers,
  narrative: DiagnosisNarrative,
  _n: FinancialRealityNumbers,
  consequence: ConsequenceData,
  tracker: ConsequenceTracker,
  _irrev: IrreversibilityEngine,
): PresentTenseEngine {
  const voice = voiceFrom(a, narrative);
  const rent = Math.round(consequence.monthly_loss_estimate);
  const missed = tracker.monthlyMissedEquity;
  const drift = tracker.monthlyPriceDrift;
  const total = rent + missed + drift;
  const sixStack = tracker.sixMonthCostIllustrative;
  const twelveRent = rent * 12;
  const sharp = buildSharp(voice, rent, total, twelveRent);
  const numberWeapon = `${fmt(rent)}/mo → ~${fmt(twelveRent)}/yr → gone`;

  const personalLossPrimary = `You spent ~${fmt(twelveRent)} on rent — built $0.`;
  const moneyGoneLine = "That money is gone.";

  let presentRealityHeadline: string;
  if (voice === "hesitant") {
    presentRealityHeadline = `You're losing ~${fmt(total)}/month now — rent, drift, missed equity.`;
  } else if (voice === "analytical") {
    presentRealityHeadline = `You're losing ~${fmt(missed + drift)}/month in missed equity and drift.`;
  } else {
    presentRealityHeadline = `You lose ~${fmt(rent)}/mo to rent — plus ~${fmt(missed + drift)}/mo drag.`;
  }

  const thisMonthLabel = "This month:";
  const lineRent = `${fmt(rent)} rent — $0 back`;
  const lineEquity = `${fmt(missed)} missed equity`;
  const linePrice = `${fmt(drift)} standing-still drift`;
  const totalImpactLine = `Total this month: ~${fmt(total)} against you`;

  const lossAccumulation = `Six months: ~${fmt(sixStack)} gone. Every month adds more.`;
  let irreversibleLossLine: string;
  if (voice === "hesitant") {
    irreversibleLossLine = "That equity window already closed on those months.";
  } else if (voice === "analytical") {
    irreversibleLossLine = "Delayed means paid — not saved.";
  } else {
    irreversibleLossLine = "You don't get that time back.";
  }

  let lossContrast: string;
  if (voice === "analytical") {
    lossContrast = `Same ${fmt(rent)}/mo builds zero here — rent took it.`;
  } else {
    lossContrast = `You sent the same cash — equity stayed zero.`;
  }

  let presentConsequence: string;
  let realityCollision: string;
  if (voice === "hesitant") {
    presentConsequence = "You're not waiting — you're paying.";
    realityCollision = "Standing still costs money. Now.";
  } else if (voice === "analytical") {
    presentConsequence = "Pause still shows up on the statement.";
    realityCollision = "The bleed is here — not later.";
  } else {
    presentConsequence = "This bill is due now — not someday.";
    realityCollision = "Loss is in today's cash flow.";
  }

  return {
    sharp,
    numberWeapon,
    personalLossPrimary,
    moneyGoneLine,
    presentRealityHeadline,
    thisMonthLabel,
    lineRent,
    lineEquity,
    linePrice,
    totalThisMonth: total,
    totalImpactLine,
    lossAccumulation,
    irreversibleLossLine,
    lossContrast,
    presentConsequence,
    realityCollision,
    voice,
  };
}
