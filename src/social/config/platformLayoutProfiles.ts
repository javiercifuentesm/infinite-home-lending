/** Per-platform spacing tokens — same visual language, canvas-optimized rhythm. */
export type PlatformLayoutProfile = {
  heroHeight: number;
  heroPaddingTop: number;
  heroPaddingX: number;
  editorialPaddingTop: number;
  editorialPaddingX: number;
  bottomPadding: number;
  headlineMarginBottom: number;
  bodyStatementGap: number;
  logoMarginTop: number;
  taglineMarginTop: number;
};

export type PlatformLayoutProfileKey =
  | "facebookSquare"
  | "linkedinSquare"
  | "instagramPortrait";

/** Square export profile — tuned for 1200×1200 PNG safe area. */
export const facebookSquare: PlatformLayoutProfile = {
  /** ~48% canvas — immersive hero; editorial band sized to fit grouped copy + signature */
  heroHeight: 581,
  heroPaddingTop: 40,
  heroPaddingX: 40,
  editorialPaddingTop: 40,
  editorialPaddingX: 56,
  bottomPadding: 54,
  headlineMarginBottom: 18,
  bodyStatementGap: 14,
  logoMarginTop: 44,
  taglineMarginTop: 18,
};

/** LinkedIn square — shares Facebook rhythm until platform-specific tuning is needed. */
export const linkedinSquare = facebookSquare;

/**
 * Instagram portrait reference — used by the dedicated IG template CSS.
 * Documented here for campaign-level spacing; do not apply to square renderer.
 */
export const instagramPortrait: PlatformLayoutProfile = {
  heroHeight: 500,
  heroPaddingTop: 36,
  heroPaddingX: 36,
  editorialPaddingTop: 48,
  editorialPaddingX: 48,
  bottomPadding: 56,
  headlineMarginBottom: 34,
  bodyStatementGap: 28,
  logoMarginTop: 52,
  taglineMarginTop: 18,
};

export const PLATFORM_LAYOUT_PROFILES: Record<
  PlatformLayoutProfileKey,
  PlatformLayoutProfile
> = {
  facebookSquare,
  linkedinSquare,
  instagramPortrait,
};

export function getLayoutProfileKeyForPlatform(
  platformId: string,
): PlatformLayoutProfileKey {
  switch (platformId) {
    case "linkedin":
      return "linkedinSquare";
    case "instagram":
      return "instagramPortrait";
    case "facebook":
    default:
      return "facebookSquare";
  }
}
