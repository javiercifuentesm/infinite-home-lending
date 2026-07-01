import type { PeopleEditorialPostProps } from "../../types";

export const PEOPLE_EDITORIAL_DEFAULTS: Required<
  Omit<PeopleEditorialPostProps, "className">
> = {
  editorialQuote:
    "Great lending begins with genuine conversations.\nBecause the best guidance starts with understanding your story.",
  headline: "The People Behind\nInfinite Home Lending",
  supportingText:
    "Helping families navigate homeownership with clarity, guidance, and confidence.",
  heroImageSrc: "/social/week1/day3-people-hero.png",
  heroImageAlt:
    "Three professionals seated together at a table in a warm, bright setting, reviewing documents in a collaborative consultation",
  footerTagline: "Tailored Lending. Infinite Possibilities.",
  logoSrc: "/ihl-logo.png",
  logoAlt: "Infinite Home Lending",
};
