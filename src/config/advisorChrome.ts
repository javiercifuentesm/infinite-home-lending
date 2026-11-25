import { getAdvisorBySlug } from "./advisors";

/** First path segment when it matches a registered advisor slug. */
export function getAdvisorSlugFromPathname(pathname: string): string | null {
  const segment = pathname.split("/").filter(Boolean)[0];
  if (!segment) return null;
  return getAdvisorBySlug(segment) ? segment : null;
}

export function isAdvisorRoute(pathname: string): boolean {
  return getAdvisorSlugFromPathname(pathname) !== null;
}

/** Build an advisor-scoped path, e.g. `/alma-jaramillo/contact`. */
export function advisorPath(slug: string, segment = ""): string {
  const base = `/${slug}`;
  return segment ? `${base}/${segment.replace(/^\//, "")}` : base;
}

function isStandaloneChromeHidden(pathname: string): boolean {
  return (
    pathname === "/careers" ||
    pathname.startsWith("/careers-asset-capture") ||
    pathname === "/free-consultation" ||
    pathname === "/free-consultation/es"
  );
}

export function shouldShowSarah(pathname: string): boolean {
  if (isStandaloneChromeHidden(pathname)) return false;
  if (pathname === "/analytics") return false;
  if (pathname.startsWith("/ma-dashboard")) return false;
  if (isAdvisorRoute(pathname)) return false;
  return true;
}

export function shouldShowGlobalNavbar(pathname: string): boolean {
  if (isStandaloneChromeHidden(pathname)) return false;
  if (isAdvisorRoute(pathname)) return false;
  return true;
}

export function shouldShowGlobalFooter(pathname: string): boolean {
  if (pathname === "/analytics" || pathname.startsWith("/ma-dashboard")) return false;
  if (isStandaloneChromeHidden(pathname)) return false;
  if (isAdvisorRoute(pathname)) return false;
  return true;
}
