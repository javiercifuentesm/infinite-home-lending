import type { AgentV2Answers } from "./agentV2Types";
import { inferReadiness } from "./agentV2FlowEngine";
import { pickDeterministicIndex } from "./agentV2Voice";

function hasUncertainty(answers: AgentV2Answers): boolean {
  return (
    answers.timeline === "Just exploring" ||
    answers.financialComfort === "Not sure yet" ||
    answers.creditRange === "Not sure"
  );
}

function goalNarrative(g?: string): string {
  if (!g) return "what you’re trying to do next";
  if (g === "Buy a home") return "buying";
  if (g === "Refinance") return "refinancing";
  return "exploring options before committing";
}

function timelineNarrative(t?: string): string {
  if (!t) return "timing we’ll pin down together";
  const x = t.toLowerCase();
  if (x.includes("as soon")) return "on a tight timeline";
  if (x.includes("1–3") || x.includes("1-3")) return "within the next few months";
  if (x.includes("3–6") || x.includes("3-6")) return "a few months out";
  if (x.includes("6–12") || x.includes("6-12")) return "a longer runway — roughly the next half-year to a year";
  if (x.includes("exploring")) return "still getting a feel for timing";
  return t.toLowerCase();
}

function rangeNarrative(answers: AgentV2Answers): string {
  const r = answers.priceRange ?? answers.propertyValueRange;
  if (!r) return "a price range we can still anchor on";
  if (r === "Under $300K") return "something under roughly $300K";
  if (r === "$300K–$500K") return "roughly the $300–500K range";
  if (r === "$500K–$800K") return "roughly the $500–800K range";
  if (r === "$800K+") return "a higher price tier (around $800K+)";
  return r.toLowerCase();
}

function locationSentence(answers: AgentV2Answers): string {
  if (answers.goal === "Explore options") return "";
  if (answers.subjectPropertyAddress?.trim()) {
    return " You’ve shared a property address for context so follow-up can be routed sensibly.";
  }
  const bit = [answers.subjectCity, answers.subjectState, answers.subjectZip].filter(Boolean).join(", ");
  if (bit) return ` You’re focused around ${bit} geographically.`;
  return "";
}

function creditComfortBlock(answers: AgentV2Answers): string {
  const c = answers.creditRange;
  const f = answers.financialComfort;
  if (!c && !f) return "the personal side of this is still open, which is fine at this stage.";
  const parts: string[] = [];
  if (c === "Not sure" || !c) parts.push("credit is still TBD");
  else if (c.includes("Excellent")) parts.push("credit looks strong");
  else if (c.includes("Good")) parts.push("credit looks workable");
  else if (c.includes("Fair")) parts.push("credit is in a range that’s often workable with structure");
  else parts.push("credit is still taking shape");

  if (f === "Not sure yet" || !f) parts.push("readiness on numbers is still settling");
  else if (f.includes("Strong")) parts.push("you feel ready to move");
  else if (f.includes("Mostly")) parts.push("you’re mostly comfortable with a few details left to tighten");
  else if (f.includes("questions")) parts.push("you’ve got questions before you’re ready to lock in");
  else parts.push("you’re taking it at a sensible pace");

  return `On the personal side, ${parts.join(", and ")}.`;
}

const SUMMARY_OPENERS = [
  "From what you’ve shared, ",
  "Here’s the picture so far: ",
  "What I’m taking from this: ",
];

/**
 * 2–3 sentences: reflective, specific, acknowledges uncertainty when present; ends with why the next step matters.
 */
export function buildUserFacingSummary(answers: AgentV2Answers, sessionId?: string): string {
  const g = goalNarrative(answers.goal);
  const t = timelineNarrative(answers.timeline);
  const r = rangeNarrative(answers);
  const uncertain = hasUncertainty(answers);
  const oi = sessionId
    ? pickDeterministicIndex(sessionId, 0, "summary_open", SUMMARY_OPENERS.length)
    : 0;
  const opener = SUMMARY_OPENERS[oi]!;

  const s1 = `${opener}you’re looking at ${g}, on ${t}, with ${r} as the working ballpark.${locationSentence(answers)}`;
  const s2 = `${creditComfortBlock(answers)}${
    uncertain
      ? " That’s a normal place to be — clarity usually firms up once timing and numbers stop floating in parallel."
      : " You’re in a solid planning window to line up structure before things accelerate."
  }`;
  const forward =
    sessionId && pickDeterministicIndex(sessionId, 1, "summary_fwd", 2) === 0
      ? "The next step is a focused conversation so we can structure options around what actually matters to you — not just check boxes."
      : "The best next step is a short, focused conversation to align options with what you care about most — not to lock you into anything yet.";

  return `${s1} ${s2} ${forward}`;
}

export function buildInternalSummary(answers: AgentV2Answers): string {
  const hasAppt = !!answers.appointmentSlot;
  const r = inferReadiness(answers, hasAppt);
  const time = answers.preferredContactTime ? ` preferredTime=${answers.preferredContactTime}` : "";
  const tz = answers.schedulingTimezoneUsed ? ` schedulingTZ=${answers.schedulingTimezoneUsed}` : "";
  const prop =
    answers.subjectPropertyAddress?.trim() ||
    [answers.subjectCity, answers.subjectState, answers.subjectZip].filter(Boolean).join(" / ") ||
    "";
  const market = prop ? ` propertyContext=${prop}` : "";
  const appt = answers.appointmentSlot ? ` appointment=${answers.appointmentSlot}` : "";
  return `Readiness: ${r}. Goal: ${answers.goal ?? "?"}. Timeline: ${answers.timeline ?? "?"}. Range: ${answers.priceRange ?? answers.propertyValueRange ?? "?"}. Contact: ${answers.contactPreference ?? "?"}.${time}${tz}${market}${appt}`;
}
