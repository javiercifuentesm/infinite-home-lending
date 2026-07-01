import type { PlatformCopy, PlatformKey, PublishingNote } from "../config/campaignConfig";
import type { CampaignDayContent } from "./types";

const PLATFORM_ORDER: PlatformKey[] = ["facebook", "instagram", "linkedin"];

const PLATFORM_LABELS: Record<PlatformKey, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
};

export function mapDayContentToPostFields(content: CampaignDayContent): {
  copy: Record<PlatformKey, PlatformCopy>;
  publishingNotes: PublishingNote[];
} {
  const copy = PLATFORM_ORDER.reduce(
    (acc, platform) => {
      acc[platform] = {
        caption: content.captions[platform],
        hashtags: content.hashtags[platform],
      };
      return acc;
    },
    {} as Record<PlatformKey, PlatformCopy>,
  );

  const { publishingNotes } = content;
  const bestTimeValue = PLATFORM_ORDER.map(
    (platform) => `${PLATFORM_LABELS[platform]}:\n${publishingNotes.bestTime[platform]}`,
  ).join("\n\n");

  return {
    copy,
    publishingNotes: [
      { label: "Best time to publish", value: bestTimeValue },
      { label: "CTA placement", value: publishingNotes.cta },
      { label: "Comment strategy", value: publishingNotes.commentStrategy },
      { label: "Image ALT text", value: publishingNotes.imageAltText },
    ],
  };
}
