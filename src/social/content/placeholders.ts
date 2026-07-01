import type { CampaignDayContent } from "./types";

/** Default draft-day content — replace per day as production progresses. */
export const PLACEHOLDER_DAY_CONTENT: CampaignDayContent = {
  captions: {
    facebook: "Caption pending — Facebook post copy will appear here.",
    instagram: "Caption pending — Instagram post copy will appear here.",
    linkedin: "Caption pending — LinkedIn post copy will appear here.",
  },
  hashtags: {
    facebook: "#InfiniteHomeLending #MortgageAdvisor #DMVRealEstate",
    instagram: "#InfiniteHomeLending #HomeBuying #TailoredLending",
    linkedin: "#InfiniteHomeLending #MortgageIndustry #Leadership",
  },
  publishingNotes: {
    bestTime: {
      facebook: "To be determined",
      instagram: "To be determined",
      linkedin: "To be determined",
    },
    cta: "To be determined — link in first comment or end of caption.",
    commentStrategy: "To be determined — pin a founder reply within the first hour.",
    imageAltText:
      "To be determined — describe founder portraits and brand lockup for accessibility.",
  },
};
