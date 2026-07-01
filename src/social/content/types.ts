import type { PlatformKey } from "../config/campaignConfig";

export type CampaignDayPublishingNotes = {
  bestTime: Record<PlatformKey, string>;
  cta: string;
  commentStrategy: string;
  imageAltText: string;
};

export type CampaignDesignTemplate =
  | "founder-letter-v3"
  | "conversation-v1"
  | "founders-feature-v1"
  | "people-editorial-v1";

export type CampaignFounderCardContent = {
  name: string;
  mission: string;
  portraitSrc: string;
  portraitAlt: string;
  fallbackInitials?: string;
};

export type CampaignDayDesignContent = {
  template: CampaignDesignTemplate;
  headline: string;
  /** Body copy on artwork; use `\n\n` for paragraph breaks. */
  supportingText: string;
  /** Large editorial quote; use `\n` for line breaks. */
  editorialQuote?: string;
  founderCards?: [CampaignFounderCardContent, CampaignFounderCardContent];
  /**
   * Hero lifestyle image path under `/public`.
   * Must follow `EDITORIAL_PHOTOGRAPHY_STYLE` in `config/editorialPhotographyStyle.ts`.
   * Use `buildEditorialHeroImagePrompt()` when generating new assets.
   */
  heroImageSrc?: string;
  heroImageAlt?: string;
  /** Tighter Instagram spacing when supporting copy runs longer than standard posts */
  layoutVariant?: "extended-copy";
};

/** Standard content shape for every campaign day — keep copy in content files, not components. */
export type CampaignDayContent = {
  captions: Record<PlatformKey, string>;
  hashtags: Record<PlatformKey, string>;
  publishingNotes: CampaignDayPublishingNotes;
  design?: CampaignDayDesignContent;
};
