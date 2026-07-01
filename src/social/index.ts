export type {
  FounderEditorialPostProps,
  FounderEditorialPostV2Props,
  FounderEditorialPostV3Props,
  FoundersFeaturePostProps,
  PeopleEditorialPostProps,
  FounderFeatureCard,
  SocialPortrait,
} from "./types";
export {
  FounderEditorialPost,
  FOUNDER_EDITORIAL_POST_DEFAULTS,
} from "./templates/FounderEditorialPost";
export {
  FounderEditorialPostV2,
  FOUNDER_EDITORIAL_POST_V2_DEFAULTS,
} from "./templates/FounderEditorialPostV2";
export {
  FounderEditorialPostV3,
  FOUNDER_COLLECTION_V1,
  FOUNDER_EDITORIAL_POST_V3_DEFAULTS,
} from "./templates/FounderEditorialPostV3";
export { FounderEditorialPostV3Instagram } from "./templates/FounderEditorialPostV3Instagram";
export { ConversationEditorialPost, CONVERSATION_EDITORIAL_DEFAULTS } from "./templates/ConversationEditorialPost";
export { ConversationEditorialPostInstagram } from "./templates/ConversationEditorialPostInstagram";
export { FoundersFeaturePost, FOUNDERS_FEATURE_DEFAULTS } from "./templates/FoundersFeaturePost";
export { FoundersFeaturePostInstagram } from "./templates/FoundersFeaturePostInstagram";
export { PeopleEditorialPost, PEOPLE_EDITORIAL_DEFAULTS } from "./templates/PeopleEditorialPost";
export { PeopleEditorialPostInstagram } from "./templates/PeopleEditorialPostInstagram";
export {
  SOCIAL_EXPORT_DEFAULTS,
  SOCIAL_PLATFORM_FORMATS,
} from "./config/platformFormats";
export {
  PLATFORM_LAYOUT_PROFILES,
  facebookSquare,
  instagramPortrait,
  linkedinSquare,
  getLayoutProfileKeyForPlatform,
} from "./config/platformLayoutProfiles";
export type {
  PlatformLayoutProfile,
  PlatformLayoutProfileKey,
} from "./config/platformLayoutProfiles";
export { applyPlatformLayoutProfile } from "./config/applyPlatformLayoutProfile";
export type { SocialPlatformFormat, SocialPlatformTemplate } from "./config/platformFormats";
export {
  LAUNCH_CAMPAIGN_WEEKS,
  PRODUCTION_STATUS_ORDER,
  PLATFORM_LABELS,
  getCampaignPostLabel,
  getCampaignWeekHeading,
} from "./config/campaignConfig";
export type {
  CampaignPost,
  CampaignPostDesign,
  CampaignWeek,
  PlatformCopy,
  PlatformKey,
  ProductionStatus,
  PublishingNote,
} from "./config/campaignConfig";
export { mapDayContentToPostFields } from "./content/mapDayContent";
export { PLACEHOLDER_DAY_CONTENT } from "./content/placeholders";
export type {
  CampaignDayContent,
  CampaignDayDesignContent,
  CampaignDayPublishingNotes,
  CampaignDesignTemplate,
} from "./content/types";
export { week1Day1Content } from "./content/week1/day1";
export { week1Day2Content } from "./content/week1/day2";
export { week1Day3Content } from "./content/week1/day3";
export { week1Day4Content } from "./content/week1/day4";
export { week1Day5Content } from "./content/week1/day5";
export {
  EDITORIAL_PHOTOGRAPHY_STYLE,
  EDITORIAL_HERO_IMAGE_AVOID,
  EDITORIAL_HERO_IMAGE_CSS,
  EDITORIAL_HERO_IMAGE_POST_PROCESS,
  EDITORIAL_PHOTOGRAPHY_STYLE_SUMMARY,
  buildEditorialHeroImagePrompt,
} from "./config/editorialPhotographyStyle";
