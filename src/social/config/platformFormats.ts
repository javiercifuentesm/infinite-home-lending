export type SocialPlatformTemplate = "square-v3" | "instagram-portrait";

export type SocialPlatformFormat = {
  id: string;
  label: string;
  width: number;
  height: number;
  platformSuffix: string;
  template: SocialPlatformTemplate;
  canvasSelector: string;
};

export const SOCIAL_EXPORT_DEFAULTS = {
  collection: "Founder",
  postId: "001",
} as const;

export const SOCIAL_PLATFORM_FORMATS: SocialPlatformFormat[] = [
  {
    id: "facebook",
    label: "Facebook Square",
    width: 1200,
    height: 1200,
    platformSuffix: "Facebook",
    template: "square-v3",
    canvasSelector: ".fe-v3",
  },
  {
    id: "instagram",
    label: "Instagram Feed Portrait",
    width: 1080,
    height: 1350,
    platformSuffix: "Instagram",
    template: "instagram-portrait",
    canvasSelector: ".fe-v3-ig",
  },
  {
    id: "linkedin",
    label: "LinkedIn Square",
    width: 1200,
    height: 1200,
    platformSuffix: "LinkedIn",
    template: "square-v3",
    canvasSelector: ".fe-v3",
  },
];
