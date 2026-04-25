/**
 * Recap “edit” flow: clear the edited slot + dependents, then resume discovery.
 * Keeps the flow light — not a full reset.
 */
import type { AgentV2Answers, RecapEditableField } from "./agentV2Types";

export type RecapEditInvalidation = {
  answers: AgentV2Answers;
  /** Keys cleared or overwritten */
  clearedKeys: string[];
};

function clearField<K extends keyof AgentV2Answers>(next: AgentV2Answers, k: K, cleared: string[]) {
  delete next[k];
  cleared.push(k as string);
}

export function applyRecapEditInvalidation(prev: AgentV2Answers, field: RecapEditableField): RecapEditInvalidation {
  const next: AgentV2Answers = { ...prev };
  const clearedKeys: string[] = [];

  switch (field) {
    case "goal":
      clearField(next, "goal", clearedKeys);
      clearField(next, "priceRange", clearedKeys);
      clearField(next, "propertyValueRange", clearedKeys);
      clearField(next, "propertyInMind", clearedKeys);
      clearField(next, "subjectPropertyAddress", clearedKeys);
      clearField(next, "subjectCity", clearedKeys);
      clearField(next, "subjectState", clearedKeys);
      clearField(next, "subjectZip", clearedKeys);
      break;
    case "timeline":
      clearField(next, "timeline", clearedKeys);
      break;
    case "range":
      if (prev.goal === "Refinance") clearField(next, "propertyValueRange", clearedKeys);
      else clearField(next, "priceRange", clearedKeys);
      break;
    case "credit":
      clearField(next, "creditRange", clearedKeys);
      break;
    case "comfort":
      clearField(next, "financialComfort", clearedKeys);
      break;
    case "location":
      clearField(next, "subjectPropertyAddress", clearedKeys);
      clearField(next, "subjectCity", clearedKeys);
      clearField(next, "subjectState", clearedKeys);
      clearField(next, "subjectZip", clearedKeys);
      break;
    default:
      break;
  }

  return { answers: next, clearedKeys };
}
