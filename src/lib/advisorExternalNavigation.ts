/**
 * Advisor external-navigation helpers.
 * Destinations outside `/${advisorSlug}` preserve the advisor tab via the guard modal.
 */

export function isMailtoOrTel(href: string): boolean {
  const lower = href.trim().toLowerCase();
  return (
    lower.startsWith("mailto:") ||
    lower.startsWith("tel:") ||
    lower.startsWith("sms:")
  );
}

/** True when the path stays inside this advisor's site namespace. */
export function isAdvisorInternalPath(pathname: string, advisorSlug: string): boolean {
  const base = `/${advisorSlug}`;
  const normalized = pathname.replace(/\/+$/, "") || "/";
  const baseNorm = base.replace(/\/+$/, "") || "/";
  return normalized === baseNorm || normalized.startsWith(`${baseNorm}/`);
}

/**
 * Resolve whether an href leaves the advisor namespace.
 * Returns the absolute URL to open, or null if navigation should proceed normally.
 */
export function getAdvisorExternalDestination(
  href: string,
  advisorSlug: string,
  origin: string = typeof window !== "undefined" ? window.location.origin : "",
): string | null {
  const trimmed = href.trim();
  if (!trimmed || trimmed === "#" || trimmed.startsWith("#")) return null;
  if (isMailtoOrTel(trimmed)) return null;
  if (/^javascript:/i.test(trimmed)) return null;

  let url: URL;
  try {
    url = new URL(trimmed, origin || "https://www.infinitehomelending.com");
  } catch {
    return null;
  }

  // Same-origin paths under the advisor slug stay in-tab.
  if (url.origin === origin || (origin && url.origin === new URL(origin).origin)) {
    if (isAdvisorInternalPath(url.pathname, advisorSlug)) {
      return null;
    }
    return `${url.pathname}${url.search}${url.hash}`;
  }

  // Cross-origin: always treat as leaving advisor scope.
  return url.href;
}

export function shouldExemptAdvisorNavAnchor(anchor: HTMLAnchorElement): boolean {
  if (anchor.getAttribute("data-advisor-nav-exempt") === "true") return true;
  if (anchor.hasAttribute("download")) return true;
  const target = (anchor.getAttribute("target") || "").toLowerCase();
  if (target === "_blank") return true;
  return false;
}
