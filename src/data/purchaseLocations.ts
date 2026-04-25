/**
 * Phase 1 service area — structured for scalable UI (no hardcoded option lists in components).
 * Add states/counties/cities here as coverage expands.
 */
export const LOCATIONS = {
  MD: {
    counties: {
      "Montgomery County": ["Bethesda", "Rockville", "Silver Spring", "Gaithersburg", "Germantown"],
      "Prince George's County": ["Bowie", "College Park", "Upper Marlboro", "Laurel"],
      "Frederick County": ["Frederick", "Urbana", "New Market", "Walkersville"],
      "Howard County": ["Columbia", "Ellicott City", "Savage", "Jessup"],
      "Anne Arundel County": ["Annapolis", "Glen Burnie", "Odenton", "Severna Park"],
      "Baltimore County": ["Towson", "Catonsville", "Dundalk", "Pikesville"],
    },
  },
} as const;

/** Stable dropdown order (do not rely on object key order). */
export const MARYLAND_COUNTY_KEYS = [
  "Montgomery County",
  "Prince George's County",
  "Frederick County",
  "Howard County",
  "Anne Arundel County",
  "Baltimore County",
] as const;

export type MarylandCountyKey = (typeof MARYLAND_COUNTY_KEYS)[number];

export const PURCHASE_STATE_OPTIONS = [
  { id: "MD" as const, label: "Maryland", available: true },
  { id: "VA" as const, label: "Virginia", available: false, comingSoon: true },
  { id: "DC" as const, label: "District of Columbia", available: false, comingSoon: true },
] as const;

/** Payload shape for CRM / advisors — county without redundant "County" suffix when present. */
export function normalizeCountyForPayload(countyKey: string): string {
  return countyKey.replace(/\s+County$/i, "").trim();
}

export function getCitiesForMarylandCounty(countyKey: string): readonly string[] {
  const map = LOCATIONS.MD.counties as Record<string, readonly string[]>;
  return map[countyKey] ?? [];
}
