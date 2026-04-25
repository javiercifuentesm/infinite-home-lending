/**
 * Human advisor voice — contextual, soft questions, no marketing or filler.
 * Logic lives in the response engine; this file is phrasing only.
 */
import type { ConversationPersona } from "./agentV2UserInference";
import type { AgentV2Answers } from "./agentV2Types";
import { pickUniqueFromPool } from "./agentV2Variation";

/** Before the recap card — human, not “system output” */
const RECAP_LINE_ONE = [
  "Okay — that gives me a better read on where things stand.",
  "From what you’ve shared so far, here’s how this is lining up.",
  "Alright — that helps me see where you are in the process.",
] as const;

const RECAP_LINE_TWO = [
  "Let me make sure I’ve got this right…",
  "Here’s how this is coming together from my side…",
  "Quick pass to make sure I’m not off…",
] as const;

const CONTACT_BRIDGES = [
  "If you want, I can line up the next step here so the follow-up is actually useful.",
  "If you’re good with it, we can grab how to reach you.",
  "Next step — where should we send follow-up?",
] as const;

const SCHEDULE_BRIDGES = [
  "Want to grab a quick time to talk it through?",
  "If a short call would help, pick a time that works.",
  "We can put something on the calendar whenever you’re ready.",
] as const;

const EXPERTISE_SPARKS: Record<ConversationPersona, readonly string[]> = {
  exploratory: [
    "That’s actually a pretty common spot to be in.",
    "A lot of people land here before things get concrete — that’s normal.",
  ],
  uncertain: [
    "Totally fair — you don’t need every answer nailed down yet.",
    "That gives you some room to figure out what actually matters to you.",
  ],
  decisive: [
    "That timeline can move fast — good you’re already thinking it through.",
    "Sounds like you’re ready to get specific; that helps.",
  ],
  neutral: [
    "That’s actually a pretty common spot to be in.",
    "That gives you a bit of room to plan things out.",
  ],
};

function poolPick(
  poolId: string,
  pool: readonly string[],
  sessionId: string,
  turn: number,
  used: string[] | undefined,
): { text: string; phraseId: string; nextUsedIds: string[] } {
  return pickUniqueFromPool(poolId, pool, sessionId, turn, used);
}

/** Join interpretation + next question so it reads like one voice */
export function flowJoinInterpToQuestion(interp: string, question: string): string {
  const i = interp.trimEnd();
  const q = question.trim();
  if (!q) return i;
  if (i.endsWith("?")) return `${i} ${q}`;
  const first = q.charAt(0);
  const rest = q.slice(1);
  const qStart = first === "I" ? "I" : first.toLowerCase();
  const trimmed = i.replace(/\.$/, "");
  const joiner = trimmed.endsWith("…") || trimmed.endsWith("—") ? " " : " — ";
  return `${trimmed}${joiner}${qStart}${rest}`;
}

/** Quick reply: reference what they tapped, light judgment, no filler ack */
export function interpretQuickReply(
  target: string,
  selected: string,
  answers: AgentV2Answers,
  persona: ConversationPersona,
): string {
  if (target === "goal") {
    if (selected.includes("Buy")) {
      return "Buying — that usually means we’ll nail down timing and what you’re shopping in next.";
    }
    if (selected.includes("Refinance")) {
      return "Refinancing — got it. Usually it’s less about a headline rate and more about whether the structure fits.";
    }
    return "Exploring first is common — it helps you avoid locking into a structure that doesn’t fit yet.";
  }
  if (target === "timeline") {
    if (selected.includes("As soon")) {
      return "Soon — things can move fast, so it’s worth being intentional about what you optimize for.";
    }
    if (selected.includes("exploring") || selected.includes("Just")) {
      return "Still exploring — that actually gives you flexibility before anything hardens.";
    }
    if (selected.includes("6–12")) {
      return "That’s a longer runway — you can plan structure without rushing the small stuff.";
    }
    return `${selected} — that window’s workable; next is how concrete you want numbers to get.`;
  }
  if (target === "priceRange" || target === "propertyValueRange") {
    return `${selected} — that band’s workable in a lot of scenarios; how it lands depends on structure, not a sticker price.`;
  }
  if (target === "creditRange") {
    return "Credit’s one piece; the full file is what tells the story.";
  }
  if (target === "financialComfort") {
    if (persona === "uncertain") {
      return `Mixed feelings are normal — we can keep the next step small.`;
    }
    return `That read on how you’re feeling helps me know what to prioritize.`;
  }
  if (target === "contactPreference") {
    return `${selected} — I’ll match follow-up to that.`;
  }
  if (target === "propertyInMind") {
    if (selected === "Yes") {
      return "Okay — if you’ve got a place in mind, drop the address in whenever you’re ready.";
    }
    return "No problem — we’ll anchor on the area you’re focused on.";
  }
  return "Good — that tells me what to focus on next.";
}

/** Optional sparse human line (~every 3rd turn on quick-reply path) */
export function maybeExpertiseSpark(
  dialogueTurn: number,
  persona: ConversationPersona,
  sessionId: string,
  used: string[] | undefined,
): { text: string | null; nextUsedIds: string[] } {
  if (dialogueTurn % 3 !== 1) return { text: null, nextUsedIds: used ?? [] };
  const pool = EXPERTISE_SPARKS[persona] ?? EXPERTISE_SPARKS.neutral;
  const { text, nextUsedIds } = pickUniqueFromPool(`spark:${persona}`, pool, sessionId, dialogueTurn, used);
  return { text, nextUsedIds };
}

export function buildRecapSynthesisBlock(
  sessionId: string,
  turn: number,
  used: string[] | undefined,
): { lines: string[]; phraseIds: string[]; nextUsedIds: string[] } {
  const a = poolPick("recap_1", RECAP_LINE_ONE, sessionId, turn, used);
  const b = poolPick("recap_2", RECAP_LINE_TWO, sessionId, turn + 1, a.nextUsedIds);
  return {
    lines: [a.text, b.text],
    phraseIds: [a.phraseId, b.phraseId],
    nextUsedIds: b.nextUsedIds,
  };
}

export function buildContactBridge(
  sessionId: string,
  turn: number,
  used: string[] | undefined,
): { text: string; nextUsedIds: string[] } {
  const { text, nextUsedIds } = poolPick("contact_br", CONTACT_BRIDGES, sessionId, turn, used);
  return { text, nextUsedIds };
}

export function buildScheduleBridge(
  sessionId: string,
  turn: number,
  used: string[] | undefined,
): { text: string; nextUsedIds: string[] } {
  const { text, nextUsedIds } = poolPick("sched_br", SCHEDULE_BRIDGES, sessionId, turn, used);
  return { text, nextUsedIds };
}

export function buildBriefSafeAnswer(topic: "down_payment" | "refi_timing" | "credit" | "rates" | "general"): string {
  switch (topic) {
    case "down_payment":
      return "Down payment isn’t one number for everyone — it depends on loan type, the place, and what you’re holding back. Someone licensed can walk through what’s realistic for you.";
    case "refi_timing":
      return "Whether refi makes sense is usually about goals, break-even, and how long you’ll keep the loan — happy to stay high-level until someone reviews your specifics.";
    case "credit":
      return "A lot of people aren’t in a ‘perfect’ bucket and still have real options — it’s the whole file, not just the score.";
    case "rates":
      return "I can’t quote rates or promise outcomes here — but we can still get you to the right conversation where real numbers show up.";
    default:
      return "Usually it depends on the full picture — I’ll keep this directional, not definitive.";
  }
}

function topicFromUserText(text: string): "down_payment" | "refi_timing" | "credit" | "rates" | "general" {
  const t = text.toLowerCase();
  if (/down payment|10%|5%|percent down/i.test(t)) return "down_payment";
  if (/refinance|refi|should i refi/i.test(t)) return "refi_timing";
  if (/credit|score|fico|perfect/i.test(t)) return "credit";
  if (/rate|apr|interest|quote/i.test(t)) return "rates";
  return "general";
}

export function buildBriefSafeAnswerForText(userText: string): string {
  return buildBriefSafeAnswer(topicFromUserText(userText));
}

const INTERRUPT_CONNECTORS = [
  "Anyway —",
  "So —",
  "Okay —",
] as const;

function pickInterruptConnector(sessionId: string, turn: number): string {
  let h = 0;
  const k = `${sessionId}:int:${turn}`;
  for (let i = 0; i < k.length; i++) h = (h + k.charCodeAt(i) * (i + 2)) % 997;
  return INTERRUPT_CONNECTORS[h % INTERRUPT_CONNECTORS.length]!;
}

/** Safe answer + natural turn back to the flow */
export function buildInterruptionReply(userText: string, redirect: string, sessionId: string, turn: number): string {
  const safe = buildBriefSafeAnswerForText(userText);
  const c = pickInterruptConnector(sessionId, turn);
  return `${safe} ${c} ${redirect}`;
}

export function buildRedirectQuestion(
  missingKey: string,
  answers: AgentV2Answers,
  persona: ConversationPersona,
): string {
  if (missingKey === "goal") {
    return "What are you looking into right now — buying, refinancing, or still exploring?";
  }
  if (missingKey === "timeline") {
    if (answers.goal === "Refinance") {
      return "When are you hoping to move on this — soon, a few months out, or still figuring it out?";
    }
    if (persona === "exploratory") {
      return "If you’re still early — are you mostly exploring, or already thinking about when you’d want to move?";
    }
    return "Rough timeline in your head — weeks, months, or still wide open?";
  }
  if (missingKey === "priceRange" || missingKey === "propertyValueRange") {
    if (answers.goal === "Refinance") {
      return "Roughly what loan size or property value are you working within? Ballpark is fine.";
    }
    return "Do you already have a rough price range in mind, or still figuring that part out?";
  }
  if (missingKey === "creditRange") {
    return "How’s your credit looking these days — pretty solid, or still improving?";
  }
  if (missingKey === "financialComfort") {
    if (persona === "uncertain") {
      return "How are you feeling about taking this step — ready, mixed, or still sizing it up?";
    }
    return "Where’s your head at on readiness for this — mostly there, or still working through it?";
  }
  if (missingKey === "contactPreference") {
    return "What’s usually easiest for you — call, text, or email?";
  }
  if (missingKey === "propertyInMind") {
    return "Do you already have a property in mind?";
  }
  if (missingKey === "subjectPropertyAddress") {
    if (answers.goal === "Refinance") {
      return "What’s the property address you’d be refinancing? Just type it the way you normally would — one line is fine.";
    }
    return "If you already have a place in mind, just type the address the way you normally would — street, city, state, ZIP in one line works.";
  }
  if (missingKey === "subjectArea") {
    return "No problem — city, state, and ZIP is enough for now if you don’t have a full address yet.";
  }
  return "What’s the next thing that would actually change your options?";
}

export function buildCompositeTimelineRangeQuestion(answers: AgentV2Answers, persona: ConversationPersona): string {
  const g = answers.goal === "Refinance" ? "loan size or value" : "price";
  if (persona === "exploratory") {
    return `Are you thinking of moving soon, or still poking around? And do you have a rough ${g} range in mind yet — even a wide bucket helps.`;
  }
  return `Timing and ${g} usually move together — are you aiming to move soon, or still weighing timing? And what range feels realistic, ballpark?`;
}

export function buildCompositeCreditComfortQuestion(_answers: AgentV2Answers, persona: ConversationPersona): string {
  if (persona === "uncertain") {
    return "How’s credit on your side these days, and how are you feeling about moving forward if the structure looks right — answer however’s easiest.";
  }
  return "How would you describe your credit in plain terms, and how comfortable are you financially if the numbers line up — you can hit both in one reply.";
}

export function buildCompressedGoalTimelineLead(_answers: AgentV2Answers): string {
  return "Buy, refinance, or still deciding — and near-term or still early? Tap what’s closest.";
}

export function buildFallbackTransition(): string {
  return "Want to switch to a simpler step-by-step instead? You can anytime.";
}

/** Hesitation / “not sure” — short reassurance before the next ask */
export function reassuranceForHesitation(userText: string): string | null {
  const t = userText.toLowerCase().trim();
  if (/\bjust exploring\b/i.test(t) || /\bstill exploring\b/i.test(t)) {
    return "That’s a normal place to start — usually the next useful thing is narrowing timing or range.";
  }
  if (/\bnot sure yet\b/i.test(t) && !/\b(credit|score|fico)\b/i.test(t)) {
    return "That’s okay — most people don’t start with everything figured out.";
  }
  if (/not sure|unsure|idk|don'?t know|no idea|maybe|confused/i.test(t)) {
    return "Fair — we can keep this straightforward from here; you don’t need every detail nailed down yet.";
  }
  return null;
}

const WELCOME_OPENERS = [
  "What are you looking into right now — buying, refinancing, or still exploring?",
  "First thing — are you buying, refinancing, or still figuring it out?",
  "What brought you here — buy, refi, or mostly exploring?",
] as const;

const WELCOME_MIDDLES = [
  "Type it however you’d say it, or tap the closest match.",
  "If things are still taking shape, that’s fine.",
  "If you’re still sorting through the details, we can keep this simple.",
  "You don’t need everything figured out to get started.",
] as const;

const WELCOME_CLOSERS = [
  "I’ll keep it plain and short on my side.",
  "We’ll go at whatever pace fits.",
  "Ask whatever’s on your mind as we go.",
] as const;

export function buildWelcomeAssistantLines(
  sessionId: string,
  used: string[] | undefined,
): { lines: string[]; nextUsedIds: string[] } {
  const a = pickUniqueFromPool("wel_a", WELCOME_OPENERS, sessionId, 0, used);
  const b = pickUniqueFromPool("wel_b", WELCOME_MIDDLES, sessionId, 1, a.nextUsedIds);
  const c = pickUniqueFromPool("wel_c", WELCOME_CLOSERS, sessionId, 2, b.nextUsedIds);
  return {
    lines: [a.text, b.text, c.text],
    nextUsedIds: c.nextUsedIds,
  };
}
