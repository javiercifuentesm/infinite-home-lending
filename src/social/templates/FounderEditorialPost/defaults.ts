import type { FounderEditorialPostProps } from "../../types";

export const FOUNDER_EDITORIAL_POST_DEFAULTS: Required<
  Omit<FounderEditorialPostProps, "className">
> = {
  collectionLabel: "From Our Founders",
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
