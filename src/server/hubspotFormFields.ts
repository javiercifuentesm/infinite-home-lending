/**
 * Maps contact-form answers (PurchasePathFlow / StrategicContactExperience) to HubSpot fields.
 */

const PURCHASE_TIMELINE_LABELS: Record<string, string> = {
  "30_days": "In the next 30 days",
  "1_3_months": "1–3 months",
  "3_6_months": "3–6 months",
  "6_12_months": "6–12 months",
  exploring: "Just exploring for now",
};

const REFINANCE_TIMELINE_LABELS: Record<string, string> = {
  lt1: "Less than 1 year ago",
  y1_3: "1–3 years ago",
  y3_5: "3–5 years ago",
  y5p: "5+ years ago",
  unsure: "Not sure",
};

const HELOC_TIMELINE_LABELS: Record<string, string> = {
  exploring: "Exploring options",
  few_months: "Within the next few months",
  ready_soon: "Ready soon",
  quick: "Need access quickly",
};

const REVERSE_TIMELINE_LABELS: Record<string, string> = {
  learning: "Just learning for now",
  few_months: "In the next few months",
  soon: "Soon",
  talk: "I'd like to talk with someone",
};

const LOAN_PURPOSE_BY_PATH: Record<string, string> = {
  purchase: "Purchase",
  refinance: "Refinance",
  heloc: "HELOC",
  reverse: "Reverse Mortgage",
  plan: "Planning",
  explore: "General Inquiry",
};

const STRUCTURED_ANSWER_KEYS: Record<string, string> = {
  purchase: "Purchase path (structured)",
  refinance: "Refinance path (structured)",
  heloc: "HELOC path (structured)",
  reverse: "Reverse path (structured)",
};

function scalarFromUnknown(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v.trim();
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return "";
}

/** Maps structured rate fields (number or "6.25%") to HubSpot string values with a trailing %. */
export function rateFromStructured(value: unknown): string | null {
  if (value != null && typeof value === "number" && Number.isFinite(value)) {
    return `${String(value)}%`;
  }
  const s = scalarFromUnknown(value);
  if (!s) return null;
  const n = parseFloat(s.replace(/%/g, "").trim());
  return Number.isFinite(n) ? `${String(n)}%` : null;
}

function parseStructuredAnswer(raw: unknown): Record<string, unknown> | null {
  if (raw == null) return null;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      return null;
    }
    return null;
  }
  if (typeof raw === "object" && !Array.isArray(raw)) {
    return raw as Record<string, unknown>;
  }
  return null;
}

function formatTimelineValue(path: string, raw: unknown): string {
  const id = scalarFromUnknown(raw);
  if (!id) return "";
  const labels =
    path === "purchase"
      ? PURCHASE_TIMELINE_LABELS
      : path === "refinance"
      ? REFINANCE_TIMELINE_LABELS
      : path === "heloc"
        ? HELOC_TIMELINE_LABELS
        : path === "reverse"
          ? REVERSE_TIMELINE_LABELS
          : null;
  return labels?.[id] ?? id;
}

function extractPurchaseTimeline(path: string, answers: Record<string, unknown>): string {
  const structuredKey = STRUCTURED_ANSWER_KEYS[path];
  if (!structuredKey) return "";

  const structured = parseStructuredAnswer(answers[structuredKey]);
  if (!structured) return "";

  if (path === "refinance") {
    return formatTimelineValue(path, structured.purchaseTimeline);
  }
  if (path === "purchase") {
    return formatTimelineValue(path, structured.purchaseTimeline);
  }
  if (path === "heloc" || path === "reverse") {
    return formatTimelineValue(path, structured.timeline);
  }
  return "";
}

function formatStructuredAnswerForNote(key: string, raw: unknown): string | null {
  const structured = parseStructuredAnswer(raw);
  if (!structured) {
    const scalar = scalarFromUnknown(raw);
    return scalar ? `${key}: ${scalar}` : null;
  }
  const parts = Object.entries(structured)
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : String(v)}`);
  if (!parts.length) return null;
  return `${key}:\n${parts.map((p) => `  ${p}`).join("\n")}`;
}

function formatPurchaseDownPayment(raw: unknown): string | null {
  if (raw == null || typeof raw !== "object" || Array.isArray(raw)) return null;
  const obj = raw as { type?: unknown; value?: unknown };
  if (obj.type !== "dollar" && obj.type !== "percent") return null;
  if (typeof obj.value !== "number" || !Number.isFinite(obj.value)) return null;
  if (obj.type === "percent") return `${obj.value}% down`;
  return `$${obj.value.toLocaleString("en-US")} down`;
}

function extractPurchasePathExtraProperties(
  answers: Record<string, unknown>,
): Record<string, string | number | boolean> {
  const structured = parseStructuredAnswer(answers["Purchase path (structured)"]);
  if (!structured) return {};

  const extra: Record<string, string | number | boolean> = {};

  if (typeof structured.hasProperty === "boolean") {
    extra.ihl_has_property = structured.hasProperty ? "true" : "false";
  }

  const address = scalarFromUnknown(structured.address);
  if (address) extra.ihl_property_address = address;

  if (
    structured.purchasePrice != null &&
    typeof structured.purchasePrice === "number" &&
    Number.isFinite(structured.purchasePrice)
  ) {
    extra.ihl_purchase_price = String(structured.purchasePrice);
  }

  const downPayment = formatPurchaseDownPayment(structured.downPayment);
  if (downPayment) extra.ihl_down_payment = downPayment;

  const creditRange = scalarFromUnknown(structured.creditRange);
  if (creditRange) extra.ihl_credit_range = creditRange;

  return extra;
}

function extractRefinancePathExtraProperties(
  answers: Record<string, unknown>,
): Record<string, string | number | boolean> {
  const structured = parseStructuredAnswer(answers["Refinance path (structured)"]);
  if (!structured) return {};

  const extra: Record<string, string | number | boolean> = {};

  const goal = scalarFromUnknown(structured.goal);
  if (goal) extra.ihl_refinance_goal = goal;

  const address = scalarFromUnknown(structured.address);
  if (address) extra.ihl_property_address = address;

  if (
    structured.balance != null &&
    typeof structured.balance === "number" &&
    Number.isFinite(structured.balance)
  ) {
    extra.ihl_current_balance = String(structured.balance);
  }

  const rate = rateFromStructured(structured.rate);
  if (rate) extra.ihl_current_rate = rate;

  if (
    structured.estimatedValue != null &&
    typeof structured.estimatedValue === "number" &&
    Number.isFinite(structured.estimatedValue)
  ) {
    extra.ihl_estimated_value = String(structured.estimatedValue);
  }

  if (typeof structured.cashOut === "boolean") {
    extra.ihl_cash_out = structured.cashOut ? "true" : "false";
  }

  if (typeof structured.debtConsolidation === "boolean") {
    extra.ihl_debt_consolidation = structured.debtConsolidation ? "true" : "false";
  }

  return extra;
}

function extractHelocPathExtraProperties(
  answers: Record<string, unknown>,
): Record<string, string | number | boolean> {
  const structured = parseStructuredAnswer(answers[STRUCTURED_ANSWER_KEYS.heloc]);
  if (!structured) return {};

  const extra: Record<string, string | number | boolean> = {};

  const helocPurpose = scalarFromUnknown(structured.helocPurpose);
  if (helocPurpose) extra.ihl_heloc_purpose = helocPurpose;

  const address = scalarFromUnknown(structured.address);
  if (address) extra.ihl_property_address = address;

  if (
    structured.propertyValue != null &&
    typeof structured.propertyValue === "number" &&
    Number.isFinite(structured.propertyValue)
  ) {
    extra.ihl_estimated_value = String(structured.propertyValue);
  }

  if (
    structured.mortgageBalance != null &&
    typeof structured.mortgageBalance === "number" &&
    Number.isFinite(structured.mortgageBalance)
  ) {
    extra.ihl_current_balance = String(structured.mortgageBalance);
  }

  const desiredAccess = scalarFromUnknown(structured.desiredAccess);
  if (desiredAccess) extra.ihl_desired_access = desiredAccess;

  const creditProfile = scalarFromUnknown(structured.creditProfile);
  if (creditProfile) extra.ihl_credit_range = creditProfile;

  return extra;
}

function extractReversePathExtraProperties(
  answers: Record<string, unknown>,
): Record<string, string | number | boolean> {
  const structured = parseStructuredAnswer(answers[STRUCTURED_ANSWER_KEYS.reverse]);
  if (!structured) return {};

  const extra: Record<string, string | number | boolean> = {};

  const residence = scalarFromUnknown(structured.residence);
  if (residence) extra.ihl_residence_type = residence;

  const ageRange = scalarFromUnknown(structured.ageRange);
  if (ageRange) extra.ihl_age_range = ageRange;

  const goal = scalarFromUnknown(structured.goal);
  if (goal) extra.ihl_reverse_goal = goal;

  const address = scalarFromUnknown(structured.address);
  if (address) extra.ihl_property_address = address;

  if (
    structured.propertyValue != null &&
    typeof structured.propertyValue === "number" &&
    Number.isFinite(structured.propertyValue)
  ) {
    extra.ihl_estimated_value = String(structured.propertyValue);
  }

  if (
    structured.mortgageBalance != null &&
    typeof structured.mortgageBalance === "number" &&
    Number.isFinite(structured.mortgageBalance)
  ) {
    extra.ihl_current_balance = String(structured.mortgageBalance);
  }

  const currentRate = rateFromStructured(structured.currentRate);
  if (currentRate) extra.ihl_current_rate = currentRate;

  const obligations = scalarFromUnknown(structured.obligations);
  if (obligations) extra.ihl_monthly_obligations = obligations;

  return extra;
}

function extractContactNameFields(fields: {
  firstName?: string;
  lastName?: string;
}): { firstName: string; lastName: string } {
  return {
    firstName: fields.firstName?.trim() ?? "",
    lastName: fields.lastName?.trim() ?? "",
  };
}

export type ContactFormHubSpotFields = {
  firstName: string;
  lastName: string;
  purchaseTimeline: string;
  loanPurpose: string;
  leadStatus: string;
  notes: string[];
  extraProperties: Record<string, string | number | boolean>;
};

export function extractContactFormHubSpotFields(
  path: string,
  answers: Record<string, unknown>,
  fields: { firstName?: string; lastName?: string } = {},
): ContactFormHubSpotFields {
  const { firstName, lastName } = extractContactNameFields(fields);
  const leadStatus = scalarFromUnknown(answers["Where things stand"]);
  const priority = scalarFromUnknown(answers["What matters most"]);
  const preferredContact = scalarFromUnknown(answers["Preferred contact"]);
  const bestDay = scalarFromUnknown(answers["Best day to call"]);
  const bestTime = scalarFromUnknown(answers["Best time to call"]);
  const purchaseExtraProperties =
    path === "purchase"
      ? extractPurchasePathExtraProperties(answers)
      : path === "refinance"
        ? extractRefinancePathExtraProperties(answers)
        : path === "heloc"
          ? extractHelocPathExtraProperties(answers)
          : path === "reverse"
            ? extractReversePathExtraProperties(answers)
            : {};

  const notes: string[] = [];
  if (priority) notes.push(`What matters most: ${priority}`);
  if (preferredContact) notes.push(`Preferred contact method: ${preferredContact}`);
  if (bestDay || bestTime) {
    notes.push(`Best day/time to call: ${[bestDay, bestTime].filter(Boolean).join(" — ")}`);
  }

  const mappedKeys = new Set([
    "Where things stand",
    "What matters most",
    "Preferred contact",
    "Best day to call",
    "Best time to call",
  ]);

  for (const [key, value] of Object.entries(answers)) {
    if (mappedKeys.has(key)) continue;
    const line = formatStructuredAnswerForNote(key, value);
    if (line) notes.push(line);
  }

  return {
    firstName,
    lastName,
    purchaseTimeline: extractPurchaseTimeline(path, answers),
    loanPurpose: LOAN_PURPOSE_BY_PATH[path] ?? path,
    leadStatus,
    notes,
    extraProperties: purchaseExtraProperties,
  };
}

export function buildSarahLeadHubSpotNotes(params: {
  preferredContact?: string;
  bestDay?: string;
  bestTime?: string;
}): string[] {
  const notes: string[] = [];
  const preferred = params.preferredContact?.trim();
  const day = params.bestDay?.trim();
  const time = params.bestTime?.trim();

  if (preferred) notes.push(`Preferred contact method: ${preferred}`);
  if (day || time) {
    notes.push(`Best day/time to call: ${[day, time].filter(Boolean).join(" — ")}`);
  }
  return notes;
}
