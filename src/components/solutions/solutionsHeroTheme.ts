/**
 * Shared spacing and density tokens for Solutions loan hero layout.
 * Master rhythm is calibrated to the Conventional slide at desktop widths.
 * Values are defined once in CSS on `.solutions-hero`.
 */
export const LOAN_HERO_BADGE_SPACING = {
  top: "--loan-hero-badge-top",
  headlineGap: "--loan-hero-badge-headline-gap",
} as const;

export const LOAN_HERO_MASTER_TYPOGRAPHY = {
  headlineSize: "--loan-hero-headline-size",
  headlineLeading: "--loan-hero-headline-leading",
  headlineMinHeight: "--loan-hero-headline-min-height",
  subtextSize: "--loan-hero-subtext-size",
  subtextLeading: "--loan-hero-subtext-leading",
  subtextMinHeight: "--loan-hero-subheadline-min-height",
  disclosureSize: "--loan-hero-disclosure-size",
} as const;

export const LOAN_HERO_FEATURE_CARD_TOKENS = {
  padding: "--loan-hero-card-padding",
  minHeight: "--loan-hero-card-min-height",
  height: "--loan-hero-card-height",
  maxHeight: "--loan-hero-card-max-height",
  titleSize: "--loan-hero-card-title-size",
  bodySize: "--loan-hero-card-body-size",
  bodyLeading: "--loan-hero-card-body-leading",
  iconSize: "--loan-hero-card-icon-size",
  featuresTop: "--loan-hero-features-top",
  gap: "--loan-hero-features-gap",
  slideStackHeight: "--loan-hero-slide-stack-height",
} as const;

export const LOAN_HERO_PROGRAM_PILL_TOKENS = {
  paddingX: "--loan-hero-pill-padding-x",
  height: "--loan-hero-pill-height",
  fontSize: "--loan-hero-pill-font-size",
  gap: "--loan-hero-pill-gap",
} as const;

export const LOAN_HERO_BOTTOM_ZONE_SPACING = {
  contentBottomGap: "--loan-hero-content-bottom-gap",
  /** @deprecated Use contentBottomGap */
  cardsToBestFor: "--loan-hero-content-bottom-gap",
  /** @deprecated Use contentBottomGap */
  featureToBestFor: "--loan-hero-content-bottom-gap",
  tagsToCta: "--loan-hero-tags-cta-gap",
  ctaToDisclosure: "--loan-hero-cta-disclosure-gap",
  disclosureToNav: "--loan-hero-disclosure-nav-gap",
  navBottomPadding: "--loan-hero-nav-bottom-padding",
  bestForHeight: "--loan-hero-bottom-best-for-height",
  ctaHeight: "--loan-hero-bottom-cta-height",
  disclosureHeight: "--loan-hero-bottom-disclosure-height",
} as const;

/** @deprecated Use LOAN_HERO_BOTTOM_ZONE_SPACING */
export const LOAN_HERO_ACTION_STACK_SPACING = {
  tagsToCta: LOAN_HERO_BOTTOM_ZONE_SPACING.tagsToCta,
  ctaToDisclosure: LOAN_HERO_BOTTOM_ZONE_SPACING.ctaToDisclosure,
} as const;

export const loanHeroBadgeTop = `var(${LOAN_HERO_BADGE_SPACING.top})`;
export const loanHeroBadgeHeadlineGap = `var(${LOAN_HERO_BADGE_SPACING.headlineGap})`;
export const loanHeroContentBottomGap = `var(${LOAN_HERO_BOTTOM_ZONE_SPACING.contentBottomGap})`;
/** @deprecated Use loanHeroContentBottomGap */
export const loanHeroCardsToBestForGap = loanHeroContentBottomGap;
/** @deprecated Use loanHeroContentBottomGap */
export const loanHeroFeatureToBestForGap = loanHeroContentBottomGap;
export const loanHeroTagsToCtaGap = `var(${LOAN_HERO_BOTTOM_ZONE_SPACING.tagsToCta})`;
export const loanHeroCtaToDisclosureGap = `var(${LOAN_HERO_BOTTOM_ZONE_SPACING.ctaToDisclosure})`;
export const loanHeroDisclosureToNavGap = `var(${LOAN_HERO_BOTTOM_ZONE_SPACING.disclosureToNav})`;
export const loanHeroNavBottomPadding = `var(${LOAN_HERO_BOTTOM_ZONE_SPACING.navBottomPadding})`;
