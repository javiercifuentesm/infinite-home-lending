/**
 * Single closing truth — not explanation, not guidance.
 */

import type { DiagnosisNarrative, IdentityLayer, RealityAnswers } from "./engine";
import type { ConsequenceTracker } from "./consequenceTracker";
import type { IrreversibilityEngine } from "./irreversibility";

export type MicDropPersona = "hesitant" | "analytical" | "emotional" | "confident";

export type MicDropEngine = {
  micDropLine: string;
  supportingSnap: string | null;
  persona: MicDropPersona;
};

function personaFrom(a: RealityAnswers, narrative: DiagnosisNarrative): MicDropPersona {
  if (a.timing <= 1 && a.income >= 2 && a.credit <= 1 && a.savings >= 1) return "confident";
  if (a.timing === 3 || narrative.primaryConstraintLabel === "Timing uncertainty") return "hesitant";
  if ((a.paymentComfort <= 1 && a.income >= 2) || a.credit === 2 || a.credit === 3) return "analytical";
  return "emotional";
}

export function buildMicDrop(
  a: RealityAnswers,
  narrative: DiagnosisNarrative,
  _identity: IdentityLayer,
  _tracker: ConsequenceTracker,
  _irrev: IrreversibilityEngine,
): MicDropEngine {
  const persona = personaFrom(a, narrative);

  let micDropLine: string;
  let supportingSnap: string | null;

  switch (persona) {
    case "hesitant":
      micDropLine = "You aren't waiting — you're paying for the delay.";
      supportingSnap = "Every month on the sideline costs you.";
      break;
    case "analytical":
      micDropLine = "You chase the rate — the price eats you.";
      supportingSnap = "This is where buyers lose the edge.";
      break;
    case "confident":
      micDropLine = "The market isn't blocking you — your timing is.";
      supportingSnap = "Most people misread this moment.";
      break;
    case "emotional":
    default:
      micDropLine = "Waiting feels safe — it raises the bill.";
      supportingSnap = "Most people misread this moment.";
      break;
  }

  return { micDropLine, supportingSnap, persona };
}
