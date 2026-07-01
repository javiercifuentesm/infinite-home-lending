import type { PlatformLayoutProfileKey } from "./config/platformLayoutProfiles";

export type { PlatformLayoutProfileKey } from "./config/platformLayoutProfiles";

export type SocialPortrait = {
  src: string;
  alt: string;
  /** Shown when image fails to load */
  fallbackInitials?: string;
};

export type FounderFeatureCard = {
  name: string;
  mission: string;
  portrait: SocialPortrait;
};

export type FounderEditorialPostProps = {
  collectionLabel?: string;
  headline?: string;
  /** Names shown beneath the headline */
  founderByline?: [string, string];
  /** Body copy below byline; use `\n\n` for paragraph breaks */
  supportingText?: string;
  footerTagline?: string;
  /** Footer website line, e.g. InfiniteHomeLending.com */
  websiteUrl?: string;
  logoSrc?: string;
  logoAlt?: string;
  founderPortraits?: [SocialPortrait, SocialPortrait];
  className?: string;
};

export type FounderEditorialPostV2Props = {
  /** Masthead series label, e.g. Founder Letter */
  seriesLabel?: string;
  /** Optional edition marker, e.g. 2026 */
  editionLabel?: string;
  eyebrow?: string;
  headline?: string;
  founderByline?: [string, string];
  /** Body copy; use `\n\n` for paragraph breaks */
  supportingText?: string;
  footerTagline?: string;
  websiteUrl?: string;
  logoSrc?: string;
  logoAlt?: string;
  founderPortraits?: [SocialPortrait, SocialPortrait];
  className?: string;
};

export type FounderEditorialPostV3Props = {
  eyebrow?: string;
  headline?: string;
  founderByline?: [string, string];
  /** Body copy; use `\n\n` for paragraph breaks */
  supportingText?: string;
  footerTagline?: string;
  websiteUrl?: string;
  logoSrc?: string;
  logoAlt?: string;
  founderPortraits?: [SocialPortrait, SocialPortrait];
  className?: string;
};

export type FoundersFeaturePostProps = {
  headline?: string;
  /** Lead lines + supporting copy; use `\n\n` for paragraph breaks */
  supportingText?: string;
  founderCards?: [FounderFeatureCard, FounderFeatureCard];
  footerTagline?: string;
  logoSrc?: string;
  logoAlt?: string;
  className?: string;
};

export type PeopleEditorialPostProps = {
  /** Editorial quote; use `\n` for line breaks */
  editorialQuote?: string;
  headline?: string;
  supportingText?: string;
  heroImageSrc?: string;
  heroImageAlt?: string;
  footerTagline?: string;
  logoSrc?: string;
  logoAlt?: string;
  className?: string;
};

export type ConversationEditorialPostProps = {
  headline?: string;
  founderByline?: [string, string];
  /** Body copy; use `\n\n` for paragraph breaks */
  supportingText?: string;
  footerTagline?: string;
  logoSrc?: string;
  logoAlt?: string;
  heroImageSrc?: string;
  heroImageAlt?: string;
  /** Platform-specific spacing profile for square canvases */
  layoutProfileKey?: PlatformLayoutProfileKey;
  className?: string;
};
