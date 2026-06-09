/**
 * Careers navigation is hidden while the page is in active development.
 *
 * The /careers route remains fully accessible via direct URL.
 * Set CAREERS_NAV_ENABLED to true when ready to promote Careers in public navigation.
 */
export const CAREERS_NAV_ENABLED = false;

export type CareersNavLink = {
  label: "Careers";
  path: "/careers";
};

export const CAREERS_NAV_LINK: CareersNavLink = {
  label: "Careers",
  path: "/careers",
};

/** Returns the Careers nav item only when public navigation is enabled. */
export function getCareersNavLink(): CareersNavLink | null {
  return CAREERS_NAV_ENABLED ? CAREERS_NAV_LINK : null;
}
