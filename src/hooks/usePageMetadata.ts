import { useEffect } from "react";

const DEFAULT_TITLE = "Infinite Home Lending";
const BRAND_SUFFIX = " | Infinite Home Lending";
const MANAGED_ATTR = "data-ihl-page-meta";

export type PageMetadataOptions = {
  /** Page name, or a full title that already includes the brand suffix */
  title: string;
  description: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
};

function formatTitle(title: string): string {
  if (title.includes("Infinite Home Lending")) return title;
  return `${title}${BRAND_SUFFIX}`;
}

function setManagedMeta(attr: "name" | "property", key: string, content: string): void {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    el.setAttribute(MANAGED_ATTR, "true");
    document.head.appendChild(el);
  } else {
    el.setAttribute(MANAGED_ATTR, "true");
  }
  el.setAttribute("content", content);
}

function setManagedCanonical(href: string): void {
  let link = document.querySelector(`link[rel="canonical"][${MANAGED_ATTR}="true"]`) as HTMLLinkElement | null;
  if (!link) {
    link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.setAttribute(MANAGED_ATTR, "true");
  }
  link.href = href;
}

function clearManagedPageMetadata(): void {
  document.title = DEFAULT_TITLE;
  document.querySelectorAll(`meta[${MANAGED_ATTR}="true"]`).forEach((el) => el.remove());
  document.querySelectorAll(`link[rel="canonical"][${MANAGED_ATTR}="true"]`).forEach((el) => el.remove());
}

/** Sets document title + meta description (and optional OG/canonical), with cleanup on unmount. */
export function usePageMetadata(options: PageMetadataOptions): void {
  const { title, description, canonical, ogTitle, ogDescription, ogUrl } = options;

  useEffect(() => {
    document.title = formatTitle(title);
    setManagedMeta("name", "description", description);
    if (ogTitle) setManagedMeta("property", "og:title", ogTitle);
    if (ogDescription) setManagedMeta("property", "og:description", ogDescription);
    if (ogUrl) setManagedMeta("property", "og:url", ogUrl);
    if (canonical) setManagedCanonical(canonical);

    return clearManagedPageMetadata;
  }, [title, description, canonical, ogTitle, ogDescription, ogUrl]);
}
