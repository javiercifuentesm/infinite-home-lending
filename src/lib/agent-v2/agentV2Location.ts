import type { AgentV2Answers } from "./agentV2Types";

export const PROPERTY_IN_MIND_OPTIONS = ["Yes", "Not yet"] as const;

/** Next location sub-step, or null if location not required or complete */
export function locationMissingKey(answers: AgentV2Answers): string | null {
  const g = answers.goal;
  if (g === "Explore options") return null;

  if (g === "Buy a home") {
    if (!answers.propertyInMind) return "propertyInMind";
    if (answers.propertyInMind === "Yes") {
      if (!answers.subjectPropertyAddress?.trim()) return "subjectPropertyAddress";
      return null;
    }
    if (answers.propertyInMind === "Not yet") {
      if (!areaComplete(answers)) return "subjectArea";
      return null;
    }
    return "propertyInMind";
  }

  if (g === "Refinance") {
    if (!answers.subjectPropertyAddress?.trim()) return "subjectPropertyAddress";
    return null;
  }
  return null;
}

function areaComplete(a: AgentV2Answers): boolean {
  return !!(a.subjectCity?.trim() && a.subjectState?.trim() && a.subjectZip?.trim());
}

/** Parse freeform area line into city/state/zip when possible */
export function parseSubjectArea(text: string): Partial<AgentV2Answers> {
  const t = text.trim();
  if (!t) return {};
  const zipMatch = t.match(/\b(\d{5})(?:-\d{4})?\b/);
  const zip = zipMatch ? zipMatch[1] : undefined;

  const comma = t.match(/^([^,]+),\s*([A-Za-z]{2})\s*(\d{5})?/);
  if (comma) {
    return {
      subjectCity: comma[1]!.trim(),
      subjectState: comma[2]!.toUpperCase(),
      ...(zip ? { subjectZip: zip } : {}),
    };
  }

  const loose = t.match(/^(.+?)\s+([A-Za-z]{2})\s+(\d{5})$/);
  if (loose) {
    return {
      subjectCity: loose[1]!.trim(),
      subjectState: loose[2]!.toUpperCase(),
      subjectZip: loose[3]!,
    };
  }

  const two = t.match(/^([^,]+),\s*([A-Za-z]{2})\s*$/);
  if (two) {
    return { subjectCity: two[1]!.trim(), subjectState: two[2]!.toUpperCase() };
  }

  if (zip && /^\d{5}$/.test(t)) {
    return { subjectZip: zip };
  }

  if (t.length > 2 && !zip) {
    return { subjectCity: t };
  }
  return {
    ...(zip ? { subjectZip: zip } : {}),
  };
}
