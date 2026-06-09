/**
 * Careers Sarah is currently parked.
 *
 * Reason:
 * Careers page launched without recruiting chatbot.
 *
 * Future initiative:
 * Careers Sarah v2
 * OpenAI-powered recruiting agent
 * Built from first principles.
 */
export const CAREERS_SARAH_ENABLED = false;

/** Internal testing only — direct URL: /careers?sarah=discovery */
export function isCareersSarahDiscoveryMode(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("sarah") === "discovery";
}

/** Show Careers Sarah floating UI when enabled or discovery URL is used. */
export function shouldShowCareersSarahUi(
  searchParams?: URLSearchParams,
): boolean {
  if (CAREERS_SARAH_ENABLED) return true;
  if (searchParams) {
    return searchParams.get("sarah") === "discovery";
  }
  return isCareersSarahDiscoveryMode();
}
