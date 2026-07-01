import type { FounderEditorialPostV3Props } from "../../types";

/** Founder Collection™ v1.0 — production lock */
export const FOUNDER_COLLECTION_V1 = {
  name: "Founder Collection™ v1.0",
  status: "Brand Approved" as const,
  templateId: "founder-editorial-v3",
  canvasSize: "1200x1200" as const,
};

export const FOUNDER_EDITORIAL_POST_V3_DEFAULTS: Required<
  Omit<FounderEditorialPostV3Props, "className">
> = {
  eyebrow: "From Our Founders",
  headline: "A Letter From Our Founders",
  founderByline: ["Javier Cifuentes", "Alma Jaramillo"],
  supportingText:
    "We built Infinite Home Lending on a simple belief:\n\nPeople deserve mortgage guidance that brings clarity, confidence, and peace of mind.",
  footerTagline: "Tailored Lending. Infinite Possibilities.",
  websiteUrl: "InfiniteHomeLending.com",
  logoSrc: "/ihl-logo.png",
  logoAlt: "Infinite Home Lending",
  founderPortraits: [
    {
      src: "/about/javier-cifuentes-founder.jpg",
      alt: "Javier Cifuentes, Co-Founder",
      fallbackInitials: "JC",
    },
    {
      src: "/about/alma-jaramillo-portrait.jpg",
      alt: "Alma Jaramillo, Co-Founder",
      fallbackInitials: "AJ",
    },
  ],
};
