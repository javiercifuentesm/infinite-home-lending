import type { CSSProperties } from "react";
import type { PlatformLayoutProfile } from "./platformLayoutProfiles";

/** Maps layout profile tokens to CSS custom properties on the canvas root. */
export function applyPlatformLayoutProfile(
  profile: PlatformLayoutProfile,
): CSSProperties {
  return {
    "--conv-hero-height": `${profile.heroHeight}px`,
    "--conv-hero-padding-top": `${profile.heroPaddingTop}px`,
    "--conv-hero-padding-x": `${profile.heroPaddingX}px`,
    "--conv-editorial-padding-top": `${profile.editorialPaddingTop}px`,
    "--conv-editorial-padding-x": `${profile.editorialPaddingX}px`,
    "--conv-bottom-padding": `${profile.bottomPadding}px`,
    "--conv-headline-margin-bottom": `${profile.headlineMarginBottom}px`,
    "--conv-body-statement-gap": `${profile.bodyStatementGap}px`,
    "--conv-logo-margin-top": `${profile.logoMarginTop}px`,
    "--conv-tagline-margin-top": `${profile.taglineMarginTop}px`,
  } as CSSProperties;
}
