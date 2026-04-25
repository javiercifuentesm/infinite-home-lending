/**
 * Zero-input / pre-input personalization for the diagnosis entry layer.
 * Uses time, device class, and brand-default geography when no user data exists.
 */

export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

export type EntryContext = {
  timeOfDay: TimeOfDay;
  isMobile: boolean;
  /** Default service area from site positioning — not GPS */
  regionLabel: string;
};

const DEFAULT_REGION = "MD, VA & DC";

export function getTimeOfDay(date = new Date()): TimeOfDay {
  const h = date.getHours();
  if (h >= 5 && h < 12) return "morning";
  if (h < 17) return "afternoon";
  if (h < 22) return "evening";
  return "night";
}

export function getIsMobileViewport(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(max-width: 639px)").matches;
}

export function buildEntryContext(): EntryContext {
  return {
    timeOfDay: getTimeOfDay(),
    isMobile: getIsMobileViewport(),
    regionLabel: DEFAULT_REGION,
  };
}

export type AssumptionVariant = {
  headline: string;
  body: string;
  footnote?: string;
};

/** High-probability “mirror” copy — rotates by time + device for freshness without feeling random */
export function getAssumptionCard(ctx: EntryContext): AssumptionVariant {
  const { timeOfDay, isMobile } = ctx;
  const idx = (timeOfDay === "morning" ? 0 : timeOfDay === "afternoon" ? 1 : timeOfDay === "evening" ? 2 : 3) + (isMobile ? 0 : 1);

  const cards: AssumptionVariant[] = [
    {
      headline: "Most people in your position think:",
      body: "Most people earning between $80K–$120K think they need to wait to buy — even when their numbers say otherwise.",
    },
    {
      headline: "Most people in your position think:",
      body: "Most buyers right now believe they’re not ready — even when they might be.",
    },
    {
      headline: "Most people in your position think:",
      body: "Many people assume they need 20% down — which isn’t actually true for every path.",
      footnote: "Only ~37% of Americans correctly understand typical down payment options.",
    },
    {
      headline: "Most people in your position think:",
      body: "Waiting for “perfect” rates or timing feels safer — even when standing still has a cost.",
    },
  ];

  return cards[idx % cards.length];
}

export const BELIEF_TEASER = "But based on what we see, that’s often not the real issue.";

export type ExampleInsightVariant = {
  label: string;
  line: string;
};

export function getExampleInsight(ctx: EntryContext): ExampleInsightVariant {
  const flip = ctx.timeOfDay === "morning" || ctx.timeOfDay === "evening";
  if (flip) {
    return {
      label: "Example insight",
      line: "You may already qualify — but your hesitation could be costing you more than you think.",
    };
  }
  return {
    label: "Example insight",
    line: "Your biggest issue might not be income — it might be how you’re thinking about your payment.",
  };
}

export const MICRO_OPTIONS = [
  "I don’t think I can afford it",
  "I’m waiting for rates",
  "I need more savings",
  "I’m just exploring",
] as const;

export const INSTANT_FEEDBACK =
  "That’s actually one of the most common misconceptions we see.";
