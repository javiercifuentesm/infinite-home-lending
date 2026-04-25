/**
 * Conversational voice — advisory tone, deterministic variation (session + turn + salt).
 * Reactions should interpret, reassure, narrow, or add momentum — not decorate.
 */
import type { AgentV2Answers } from "./agentV2Types";
import type { InterpretationResult, InterpretableField } from "./agentV2Interpretation";

export function pickDeterministicIndex(sessionId: string, turn: number, salt: string, mod: number): number {
  if (mod <= 0) return 0;
  let h = 2166136261;
  const s = `${sessionId}\0${salt}\0${turn}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h >>> 0) % mod;
}

function shouldMicroReact(interpreted: InterpretationResult): boolean {
  if (interpreted.interpretationStrength === "strong") return true;
  if (interpreted.interpretationStrength !== "weak") return false;
  return Object.values(interpreted.fieldConfidence).some((c) => c === "high" || c === "medium");
}

/** User sounds exploratory or hesitant — anchor before narrowing */
export function detectUncertainty(userText: string, interpreted: InterpretationResult): boolean {
  const t = userText.toLowerCase();
  if (/\b(maybe|not sure|probably|just looking|i guess|idk|dunno|unsure|sort of|kind of|we'll see|we will see)\b/i.test(t))
    return true;
  if (/\b(exploring|figure out|still deciding|tbd)\b/i.test(t)) return true;
  if (interpreted.committed.timeline === "Just exploring") return true;
  if (interpreted.committed.financialComfort === "Not sure yet") return true;
  return false;
}

function pickUncertaintyAnchor(sessionId: string, turn: number, userText: string): string {
  const t = userText.toLowerCase();
  if (/\bjust exploring\b/i.test(t) || /\bstill exploring\b/i.test(t)) {
    return "That’s a normal place to start — usually the next useful thing is narrowing timing or range.";
  }
  if (/\bnot sure yet\b/i.test(t) && !/\b(credit|score|fico)\b/i.test(t)) {
    return "That’s okay — most people don’t start with everything figured out.";
  }
  const lines = [
    "That’s fine — most people aren’t starting with perfect clarity.",
    "Usually the first useful move is narrowing timing or range so the rest doesn’t stay fuzzy.",
    "We can keep this straightforward from here — you don’t need every detail locked in yet.",
  ];
  return lines[pickDeterministicIndex(sessionId, turn, "unc_anchor", lines.length)]!;
}

/**
 * Short answer but parse succeeded — deepen slightly before the next ask (sparse).
 */
export function maybeThinParseRecovery(
  userText: string,
  interpreted: InterpretationResult,
  sessionId: string,
  turn: number,
): string | null {
  const t = userText.trim();
  if (t.length > 18) return null;
  if (interpreted.signalsUpdated < 1) return null;
  if (detectUncertainty(userText, interpreted)) return null;
  if (pickDeterministicIndex(sessionId, turn, "thin_rec", 3) !== 0) return null;
  const lines = [
    "Okay — that gives us a useful starting point to work from.",
    "Good — that’s enough to aim the next question in the right direction.",
    "Got it — we can build from there without overfitting details yet.",
  ];
  return lines[pickDeterministicIndex(sessionId, turn, "thin_line", lines.length)]!;
}

/** Advisory observation — interprets significance or momentum (not flavor-only) */
export function pickMicroReaction(userText: string, interpreted: InterpretationResult): string | null {
  if (!shouldMicroReact(interpreted)) return null;
  if (detectUncertainty(userText, interpreted)) return null;
  const t = userText.toLowerCase();
  const a = interpreted.committed;

  if (/\bjust looking\b/i.test(t) || /\bjust exploring\b/i.test(t) || a.timeline === "Just exploring") {
    return "That’s a normal place to start — usually the next useful thing is narrowing timing or range.";
  }
  if (/\bnot sure yet\b/i.test(t) && (/\b(comfort|ready|feel)\b/i.test(t) || a.financialComfort === "Not sure yet")) {
    return "Uncertainty on readiness is normal — it’s still workable if we sequence the next questions cleanly.";
  }
  if (/\b(in a few months|a few months|few months|next couple months)\b/i.test(t) || /\b1[\s–-]3\s*mo/i.test(t)) {
    return "That timing is useful — not urgent, but not so far out that planning is abstract.";
  }
  if (/\b(around|about|in)\s+(?:a\s+)?year\b/i.test(t) || /\b(?:a\s+)?year\s+out\b/i.test(t) || /\b10\s*(?:to|-|–)\s*12\s+months\b/i.test(t)) {
    return "Got it — sounds like you’re further out, which gives you room to plan this carefully.";
  }
  if (
    /\b(in around|around|maybe in|probably in)\s*(six|6|\d{1,2})\s*months?\b/i.test(t) ||
    /\b(probably|maybe)\s+later\s+this\s+year\b/i.test(t) ||
    /\bsometime\s+next\s+year\b/i.test(t)
  ) {
    return "That actually gives you some room to plan things out well.";
  }
  if (a.timeline === "6–12 months") {
    return "Got it — sounds like you’re further out, which gives you room to plan this carefully.";
  }
  if (a.timeline === "1–3 months" || a.timeline === "3–6 months") {
    return "That window usually leaves room to structure things without rushing the details.";
  }
  if (/\b(around|about)\s*\$?\s*\d{2,4}/i.test(t) || /\b\d{2,4}\s*k\b/i.test(t) || a.priceRange || a.propertyValueRange) {
    return "That range gives you workable room in most cases, depending on how you want to structure the file.";
  }
  if (a.goal === "Explore options" || /\bexplore|exploring\b/i.test(t)) {
    return "Starting broad is fine — the point is to narrow what actually matters before you lock choices.";
  }
  if (a.creditRange && (a.creditRange.includes("Good") || a.creditRange.includes("Fair"))) {
    return "That credit band is often workable — the rest is how the story and documentation line up.";
  }
  if (a.priceRange === "$300K–$500K" || a.priceRange === "$500K–$800K") {
    return "That band tends to keep options realistic without forcing you into a corner early.";
  }
  return null;
}

/** Rare second beat when micro didn’t fire; must add interpretive value */
export function pickLightInsight(
  interpreted: InterpretationResult,
  sessionId: string,
  turn: number,
): string | null {
  if (pickDeterministicIndex(sessionId, turn, "insight", 6) !== 0) return null;
  const fc = interpreted.fieldConfidence;
  const a = interpreted.committed;
  const ok = (k: keyof typeof fc) => fc[k] === "high" || fc[k] === "medium";

  if (a.timeline === "1–3 months" && ok("timeline")) return "Enough runway to line things up without dragging.";
  if (a.timeline === "3–6 months" && ok("timeline") && fc.timeline === "medium")
    return "Got it — sounds like you’re a bit further out, which gives you time to plan this well.";
  if (a.timeline === "6–12 months" && ok("timeline"))
    return "Got it — sounds like you’re further out, which gives you room to plan this carefully.";
  if (a.timeline === "Just exploring" && ok("timeline")) return "Exploring first usually prevents locking into a structure that doesn’t fit yet.";
  if (a.goal === "Explore options" && ok("goal")) return "Good — options-first keeps the conversation honest about tradeoffs.";
  if (a.creditRange?.includes("Good") && ok("creditRange")) return "That tier often clears if income and history are consistent.";
  if ((a.priceRange === "$300K–$500K" || a.priceRange === "$500K–$800K") && ok("priceRange"))
    return "Useful band — most markets still give you real choices there.";
  return null;
}

const ADVISORY_BRIDGES = [
  "That’s enough to aim the next question usefully.",
  "From here, the next piece worth tightening is straightforward.",
  "Let’s make the next step concrete so you’re not guessing.",
];

export function buildClarificationForMissingKey(
  key: string,
  _answers: AgentV2Answers,
  sessionId: string,
  turn: number,
): string {
  const pools: Record<string, string[]> = {
    timeline: [
      "I want to line this up — are you thinking sooner (weeks), a few months out, or still pretty open on timing?",
      "Roughly where does timing sit for you — pretty soon, a few months out, or still feeling it out?",
      "On timing, is it more near-term, a few months out, or still wide open?",
    ],
    priceRange: [
      "Just to make sure I’m following — are you closer to the $300–500K range, or higher than that?",
      "Is it closer to that $300–500K pocket for you, or should I picture something higher?",
      "Would you say the $300–500K neighborhood feels about right, or are you thinking above that?",
    ],
    propertyValueRange: [
      "Just to make sure I’m following — are you closer to the $300–500K range, or higher than that?",
      "Is it closer to that $300–500K pocket for you, or should I picture something higher?",
      "Would you say the $300–500K neighborhood feels about right, or are you thinking above that?",
    ],
    goal: [
      "Just to make sure I’m following — are you mainly looking to buy, refinance, or explore options first?",
      "Would you say buy is the main move, or refi / a wider look is more where your head is?",
      "Sounds like we might be starting from a few directions — buy, refi, or explore first?",
    ],
    creditRange: [
      "Just to make sure I’m following — do you already have a sense of your credit range, or is that still TBD?",
      "Credit-wise, do you have a rough band in mind, or still figuring that out?",
      "Would you say you know your credit ballpark, or not really yet?",
    ],
    financialComfort: [
      "Just to make sure I’m following — are you feeling pretty ready numbers-wise, or still sorting that out?",
      "On readiness, are you mostly set, or still piecing the comfort piece together?",
      "Sounds like you might be somewhere in the middle — more ready, or still fuzzy on that?",
    ],
    contactPreference: [
      "Just to make sure I’m following — would you rather connect by call, text, or email?",
      "What’s easiest — call, text, or email?",
      "Would you say call fits best, or text / email is more your speed?",
    ],
    propertyInMind: [
      "Just to make sure I’m following — do you already have a specific property in mind, or not yet?",
      "Are you further along on a particular place, or still deciding the area?",
      "Would you say you’re already looking at an address, or still narrowing the market?",
    ],
    subjectPropertyAddress: [
      "If you paste the address in one line — street, city, state, ZIP — that’s perfect.",
      "Type the address however you normally would; one line is fine.",
      "Street, city, state, ZIP in one line works great if you have it.",
    ],
    subjectArea: [
      "City, state, and ZIP is enough if that’s all you have for now.",
      "Which city and state — and ZIP if you know it?",
      "What area should we anchor on? Metro, neighborhood, or ZIP all work.",
    ],
    default: [
      "Just to make sure I’m following — could you say a bit more so I line up with what you need?",
      "Would you mind adding one more detail so I match this to you?",
      "Sounds like there’s a little more nuance — want to share a touch more?",
    ],
  };
  const k = pools[key] ? key : "default";
  const options = pools[k]!;
  const bi = pickDeterministicIndex(sessionId, turn, `clar_${k}`, options.length);
  return options[bi]!;
}

export function buildClarificationForFocus(focus: InterpretableField, sessionId: string, turn: number): string {
  return buildClarificationForMissingKey(focus, {}, sessionId, turn);
}

export type DiscoveryVoiceMode = "question_only" | "reaction_then_question" | "transition_then_question";

export function pickDiscoveryStructure(sessionId: string, turn: number, uncertain: boolean): DiscoveryVoiceMode {
  if (uncertain) return "reaction_then_question";
  const m = pickDeterministicIndex(sessionId, turn, "disc_struct", 3);
  if (m === 0) return "question_only";
  if (m === 1) return "reaction_then_question";
  return "transition_then_question";
}

export function buildDiscoveryReplyText(args: {
  sessionId: string;
  turn: number;
  interpreted: InterpretationResult;
  userText: string;
  redirect: string;
  lead?: string;
  offPathAck?: string;
  echoLine?: string;
}): string {
  const { sessionId, turn, interpreted, userText, redirect, lead, offPathAck, echoLine } = args;

  const uncertain = detectUncertainty(userText, interpreted);
  const thin = maybeThinParseRecovery(userText, interpreted, sessionId, turn);
  const anchor = uncertain ? pickUncertaintyAnchor(sessionId, turn, userText) : null;

  const micro = pickMicroReaction(userText, interpreted);
  const insight =
    !micro && interpreted.interpretationStrength !== "none" ? pickLightInsight(interpreted, sessionId, turn) : null;

  const struct = pickDiscoveryStructure(sessionId, turn, uncertain);
  const useLead = lead && pickDeterministicIndex(sessionId, turn, "lead_use", 3) !== 0;

  let core: string;

  if (struct === "question_only") {
    core = useLead && lead ? `${lead} ${redirect}` : redirect;
  } else if (struct === "reaction_then_question") {
    const hook = anchor ?? thin ?? micro ?? insight ?? (useLead && lead ? lead : null);
    if (hook) core = `${hook}\n\n${redirect}`;
    else core = useLead && lead ? `${lead} ${redirect}` : redirect;
  } else {
    const bridge = ADVISORY_BRIDGES[pickDeterministicIndex(sessionId, turn, "bridge", ADVISORY_BRIDGES.length)]!;
    const hook = anchor ?? thin ?? micro ?? insight;
    if (hook) core = `${hook}\n\n${bridge}\n\n${redirect}`;
    else core = `${bridge}\n\n${redirect}`;
  }

  if (offPathAck) core = `${offPathAck}\n\n${core}`;
  if (echoLine) core = `${core}\n\n${echoLine}`;
  return core;
}

/** Softer ambiguous turn — keep reassurance, drop empty interjections */
export function softenAmbiguousLead(
  _userText: string,
  sessionId: string,
  turn: number,
  baseLead: string | undefined,
): string | undefined {
  if (!baseLead?.trim()) return undefined;
  if (pickDeterministicIndex(sessionId, turn, "soft_amb", 2) === 0) return baseLead;
  const soft = ["Fair — ", "Understood — ", "All right — "];
  return `${soft[pickDeterministicIndex(sessionId, turn, "soft_pick", soft.length)]!}${baseLead.charAt(0).toLowerCase()}${baseLead.slice(1)}`;
}
