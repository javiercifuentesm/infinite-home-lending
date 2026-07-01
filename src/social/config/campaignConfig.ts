import { mapDayContentToPostFields } from "../content/mapDayContent";
import { PLACEHOLDER_DAY_CONTENT } from "../content/placeholders";
import { week1Day1Content } from "../content/week1/day1";
import { week1Day2Content } from "../content/week1/day2";
import { week1Day3Content } from "../content/week1/day3";
import { week1Day4Content } from "../content/week1/day4";
import { week1Day5Content } from "../content/week1/day5";
import type { CampaignFounderCardContent } from "../content/types";

export type ProductionStatus =
  | "draft"
  | "content-ready"
  | "brand-approved"
  | "scheduled"
  | "published";

export type PlatformKey = "facebook" | "instagram" | "linkedin";

export type PlatformCopy = {
  caption: string;
  hashtags: string;
};

export type PublishingNote = {
  label: string;
  value: string;
};

export type CampaignPostTemplate =
  | "founder-letter-v3"
  | "conversation-v1"
  | "founders-feature-v1"
  | "people-editorial-v1";

export type CampaignPostDesign = {
  template: CampaignPostTemplate;
  postId: string;
  headline?: string;
  supportingText?: string;
  editorialQuote?: string;
  founderCards?: [CampaignFounderCardContent, CampaignFounderCardContent];
  heroImageSrc?: string;
  heroImageAlt?: string;
  layoutVariant?: "extended-copy";
};

export type CampaignPost = {
  id: string;
  dayNumber: number;
  title: string;
  productionStatus: ProductionStatus;
  defaultExpanded: boolean;
  design?: CampaignPostDesign;
  copy: Record<PlatformKey, PlatformCopy>;
  publishingNotes: PublishingNote[];
};

export type CampaignWeek = {
  id: string;
  weekNumber: number;
  title: string;
  posts: CampaignPost[];
};

function createPlaceholderPost(
  dayNumber: number,
  title: string,
): CampaignPost {
  return {
    id: `day-${dayNumber}`,
    dayNumber,
    title,
    productionStatus: "draft",
    defaultExpanded: false,
    ...mapDayContentToPostFields(PLACEHOLDER_DAY_CONTENT),
  };
}

const week1Day1Fields = mapDayContentToPostFields(week1Day1Content);
const week1Day2Fields = mapDayContentToPostFields(week1Day2Content);
const week1Day3Fields = mapDayContentToPostFields(week1Day3Content);
const week1Day4Fields = mapDayContentToPostFields(week1Day4Content);
const week1Day5Fields = mapDayContentToPostFields(week1Day5Content);

function designFromContent(
  postId: string,
  content: typeof week1Day1Content,
): CampaignPostDesign {
  const design = content.design;
  return {
    template: design?.template ?? "founder-letter-v3",
    postId,
    headline: design?.headline,
    supportingText: design?.supportingText,
    editorialQuote: design?.editorialQuote,
    founderCards: design?.founderCards,
    heroImageSrc: design?.heroImageSrc,
    heroImageAlt: design?.heroImageAlt,
    layoutVariant: design?.layoutVariant,
  };
}

/** 30-day launch campaign — Week 1
 *  Hero images must follow EDITORIAL_PHOTOGRAPHY_STYLE (config/editorialPhotographyStyle.ts).
 */
export const LAUNCH_CAMPAIGN_WEEKS: CampaignWeek[] = [
  {
    id: "week-1",
    weekNumber: 1,
    title: "Our Story",
    posts: [
      {
        id: "day-1",
        dayNumber: 1,
        title: "A Letter From Our Founders",
        productionStatus: "brand-approved",
        defaultExpanded: true,
        design: designFromContent("001", week1Day1Content),
        ...week1Day1Fields,
      },
      {
        id: "day-2",
        dayNumber: 2,
        title: "Why Infinite Home Lending Exists",
        productionStatus: "content-ready",
        defaultExpanded: false,
        design: designFromContent("002", week1Day2Content),
        ...week1Day2Fields,
      },
      {
        id: "day-3",
        dayNumber: 3,
        title: "The People Behind Infinite Home Lending",
        productionStatus: "content-ready",
        defaultExpanded: false,
        design: designFromContent("003", week1Day3Content),
        ...week1Day3Fields,
      },
      {
        id: "day-4",
        dayNumber: 4,
        title: "What You Can Expect Working With Us",
        productionStatus: "content-ready",
        defaultExpanded: false,
        design: designFromContent("004", week1Day4Content),
        ...week1Day4Fields,
      },
      {
        id: "day-5",
        dayNumber: 5,
        title: "Our Promise to Every Client",
        productionStatus: "content-ready",
        defaultExpanded: false,
        design: designFromContent("005", week1Day5Content),
        ...week1Day5Fields,
      },
      createPlaceholderPost(6, "Behind the Name"),
      createPlaceholderPost(7, "Building Something Different"),
    ],
  },
];

export function getCampaignPostLabel(post: CampaignPost): string {
  return `Day ${post.dayNumber} — ${post.title}`;
}

export function getCampaignWeekHeading(week: CampaignWeek): string {
  return `Week ${week.weekNumber} — ${week.title}`;
}

export const PRODUCTION_STATUS_ORDER: {
  id: ProductionStatus;
  label: string;
  tone: "grey" | "blue" | "gold" | "green";
}[] = [
  { id: "draft", label: "Draft", tone: "grey" },
  { id: "content-ready", label: "Content Ready", tone: "blue" },
  { id: "brand-approved", label: "Brand Approved", tone: "gold" },
  { id: "scheduled", label: "Scheduled", tone: "blue" },
  { id: "published", label: "Published", tone: "green" },
];

export const PLATFORM_LABELS: Record<PlatformKey, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
};
