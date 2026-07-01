import type { FoundersFeaturePostProps } from "../../types";

export const FOUNDERS_FEATURE_DEFAULTS: Required<
  Omit<FoundersFeaturePostProps, "className">
> = {
  headline: "Meet the Founders",
  supportingText:
    "Two professionals.\n\nOne shared vision.\n\nHelping families navigate homeownership with clarity, guidance, and confidence.",
  founderCards: [
    {
      name: "Javier Cifuentes",
      mission:
        "Helping clients make confident mortgage decisions through strategy, education, and personalized guidance.",
      portrait: {
        src: "/about/javier-cifuentes-founder.jpg",
        alt: "Javier Cifuentes, Co-Founder",
        fallbackInitials: "JC",
      },
    },
    {
      name: "Alma Jaramillo",
      mission:
        "Building trusted relationships through personalized guidance, clear communication, and a commitment to client success.",
      portrait: {
        src: "/about/alma-jaramillo-portrait.jpg",
        alt: "Alma Jaramillo, Co-Founder",
        fallbackInitials: "AJ",
      },
    },
  ],
  footerTagline: "Tailored Lending. Infinite Possibilities.",
  logoSrc: "/ihl-logo.png",
  logoAlt: "Infinite Home Lending",
};
