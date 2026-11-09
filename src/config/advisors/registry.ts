import { almaJaramillo } from "./almaJaramillo";
import type { AdvisorProfile } from "./types";

export const ADVISOR_REGISTRY: Record<string, AdvisorProfile> = {
  [almaJaramillo.slug]: almaJaramillo,
};

export function getAdvisorBySlug(slug: string): AdvisorProfile | undefined {
  return ADVISOR_REGISTRY[slug];
}

export function getAdvisorSlugs(): string[] {
  return Object.keys(ADVISOR_REGISTRY);
}

export function isRegisteredAdvisorSlug(slug: string): boolean {
  return slug in ADVISOR_REGISTRY;
}
