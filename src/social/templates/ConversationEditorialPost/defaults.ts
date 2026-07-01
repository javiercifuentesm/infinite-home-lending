import type { ConversationEditorialPostProps } from "../../types";

export const CONVERSATION_EDITORIAL_DEFAULTS: Required<
  Omit<ConversationEditorialPostProps, "className" | "founderByline">
> = {
  headline: "Why Infinite\nHome Lending\nExists",
  supportingText:
    "Because every family deserves guidance before making one of life's biggest financial decisions.\n\nA mortgage should begin with a conversation—not a product.",
  footerTagline: "Tailored Lending. Infinite Possibilities.",
  logoSrc: "/ihl-logo.png",
  logoAlt: "Infinite Home Lending",
  heroImageSrc: "/social/week1/day2-the-why-hero.png",
  heroImageAlt:
    "Joyful young couple taking a selfie together in their new home surrounded by moving boxes, celebrating a new chapter",
};
