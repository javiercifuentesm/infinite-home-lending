/**
 * HubSpot CRM contact sync — Contacts API v3 batch upsert by email.
 * Requires HUBSPOT_API_KEY (private app token with crm.objects.contacts.write).
 */

const HUBSPOT_API = "https://api.hubapi.com";
/** HubSpot-defined association: note → contact */
const NOTE_TO_CONTACT_ASSOCIATION_TYPE_ID = 202;
/** HubSpot-defined association: deal → contact (when creating a deal linked to a contact) */
const DEAL_TO_CONTACT_ASSOCIATION_TYPE_ID = 3;
/** Javier Cifuentes — default contact owner for all IHL leads */
const IHL_DEFAULT_HUBSPOT_OWNER_ID = "93679106";

/** IHL custom contact property internal names (must match HubSpot CRM setup). */
const IHL_HUBSPOT_PROPERTIES = {
  nmls: "ihl_nmls",
  market: "ihl_market",
  leadSource: "ihl_lead_source",
  loanPurpose: "ihl_loan_purpose",
  purchaseTimeline: "ihl_purchase_timeline",
  pipeline: "ihl_pipeline",
  aiSourcedLead: "ai_sourced_lead",
  /** IHL Lead Status dropdown — set on create only; never overwrite on update. */
  ihlLeadStatus: "ihl_lead_status",
} as const;

/** Cached internal enum value for the "New / Unworked" ihl_lead_status option (from HubSpot property API). */
let cachedNewUnworkedIhlLeadStatus: string | null = null;

/** Cached Client Pipeline → New Lead stage IDs (from GET /crm/v3/pipelines/deals). */
let cachedClientPipelineNewLead: { pipelineId: string; stageId: string } | null = null;

/**
 * Contact property used as HubSpot Deal `amount` per ihl_loan_purpose.
 * Keys match normalized loanPurpose labels from hubspotFormFields / Sarah sync.
 */
const DEAL_AMOUNT_CONTACT_PROPERTY_BY_LOAN_PURPOSE: Record<string, string> = {
  purchase: "ihl_purchase_price",
  refinance: "ihl_current_balance",
  heloc: "ihl_desired_access",
  "reverse mortgage": "ihl_estimated_value",
};

export type HubSpotContactInput = {
  name: string;
  email: string;
  /** When set, maps only to HubSpot `firstname` — never derived from lastName. */
  firstName?: string;
  /** When set, maps only to HubSpot `lastname` — never derived from firstName. */
  lastName?: string;
  phone?: string;
  leadSource?: string;
  /** Maps to HubSpot custom property ihl_loan_purpose */
  loanPurpose?: string;
  aiSourced?: boolean;
  /** Maps to HubSpot custom property ihl_purchase_timeline */
  purchaseTimeline?: string;
  /** Maps to HubSpot property hs_lead_status */
  leadStatus?: string;
  extraProperties?: Record<string, string | number | boolean>;
  /** Appended as HubSpot engagement notes on the contact */
  notes?: string[];
};

function splitName(fullName: string): { firstname: string; lastname: string } {
  const trimmed = fullName.trim();
  if (!trimmed) return { firstname: "Unknown", lastname: "" };
  const space = trimmed.indexOf(" ");
  if (space === -1) return { firstname: trimmed, lastname: "" };
  return {
    firstname: trimmed.slice(0, space).trim(),
    lastname: trimmed.slice(space + 1).trim(),
  };
}

function resolveHubSpotContactName(input: HubSpotContactInput): { firstname: string; lastname: string } {
  if (input.firstName !== undefined || input.lastName !== undefined) {
    return {
      firstname: input.firstName?.trim() || "Unknown",
      lastname: input.lastName?.trim() ?? "",
    };
  }
  return splitName(input.name);
}

function toHubSpotValue(value: string | number | boolean): string {
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
}

/** Map contact-form "Where things stand" labels to HubSpot hs_lead_status enum values. */
function mapHubSpotLeadStatus(raw: string): string {
  const normalized = raw.trim().toLowerCase();
  if (normalized === "already in the process") return "IN_PROGRESS";
  if (normalized === "actively looking") return "OPEN";
  return "NEW";
}

type HubSpotPropertyOption = { label?: string; value?: string };

function resolveNewUnworkedIhlLeadStatus(options: HubSpotPropertyOption[]): string | null {
  for (const option of options) {
    const value = option.value?.trim();
    const label = option.label?.trim() ?? "";
    if (!value) continue;
    if (/^new\s*\/?\s*unworked$/i.test(label)) return value;
    if (value.toLowerCase() === "new_unworked") return value;
  }
  return null;
}

/** Fetch the internal enum value for ihl_lead_status "New / Unworked" from HubSpot property definition. */
async function fetchNewUnworkedIhlLeadStatus(apiKey: string): Promise<string | null> {
  if (cachedNewUnworkedIhlLeadStatus) return cachedNewUnworkedIhlLeadStatus;

  const response = await fetch(
    `${HUBSPOT_API}/crm/v3/properties/contacts/${IHL_HUBSPOT_PROPERTIES.ihlLeadStatus}`,
    { headers: { Authorization: `Bearer ${apiKey}` } },
  );

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    console.warn(
      "[hubspot] failed to fetch ihl_lead_status property definition — skipping create-only default:",
      response.status,
      errText,
    );
    return null;
  }

  const data = (await response.json()) as { options?: HubSpotPropertyOption[] };
  const resolved = resolveNewUnworkedIhlLeadStatus(data.options ?? []);
  if (!resolved) {
    console.warn(
      '[hubspot] ihl_lead_status "New / Unworked" option not found in property definition — skipping create-only default',
    );
    return null;
  }

  cachedNewUnworkedIhlLeadStatus = resolved;
  return resolved;
}

/** Returns true when a contact with this email already exists in HubSpot CRM. */
async function hubSpotContactExistsByEmail(email: string, apiKey: string): Promise<boolean> {
  const response = await fetch(
    `${HUBSPOT_API}/crm/v3/objects/contacts/${encodeURIComponent(email)}?idProperty=email`,
    { headers: { Authorization: `Bearer ${apiKey}` } },
  );

  if (response.status === 404) return false;
  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    console.warn(
      "[hubspot] contact lookup by email failed — treating as existing so ihl_lead_status is not overwritten:",
      response.status,
      errText,
    );
    return true;
  }
  return true;
}

type HubSpotDealPipeline = {
  id: string;
  label: string;
  stages: { id: string; label: string; displayOrder: number }[];
};

function resolveClientPipelineNewLeadStage(
  pipelines: HubSpotDealPipeline[],
): { pipelineId: string; stageId: string } | null {
  for (const pipeline of pipelines) {
    if (!/client\s*pipeline/i.test(pipeline.label.trim())) continue;

    const stages = [...(pipeline.stages ?? [])].sort(
      (a, b) => a.displayOrder - b.displayOrder,
    );
    const newLeadStage =
      stages.find((stage) => /^new\s*lead$/i.test(stage.label.trim())) ?? stages[0];
    if (newLeadStage?.id) {
      return { pipelineId: pipeline.id, stageId: newLeadStage.id };
    }
  }
  return null;
}

/** Resolve Client Pipeline → New Lead from HubSpot deal pipelines API. */
async function fetchClientPipelineNewLeadStage(
  apiKey: string,
): Promise<{ pipelineId: string; stageId: string } | null> {
  if (cachedClientPipelineNewLead) return cachedClientPipelineNewLead;

  const response = await fetch(`${HUBSPOT_API}/crm/v3/pipelines/deals`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    console.warn(
      "[hubspot-deal] failed to fetch deal pipelines:",
      response.status,
      errText,
    );
    return null;
  }

  const data = (await response.json()) as { results?: HubSpotDealPipeline[] };
  const resolved = resolveClientPipelineNewLeadStage(data.results ?? []);
  if (!resolved) {
    console.warn('[hubspot-deal] "Client Pipeline" / "New Lead" stage not found in pipelines API');
    return null;
  }

  cachedClientPipelineNewLead = resolved;
  return resolved;
}

function normalizeLoanPurposeKey(raw: string | undefined): string {
  return raw?.trim().toLowerCase() ?? "";
}

/**
 * Map ihl_loan_purpose → contact property for Deal amount (see DEAL_AMOUNT_CONTACT_PROPERTY_BY_LOAN_PURPOSE).
 * Returns undefined when no numeric value is available — Deal amount is omitted, not zeroed.
 */
function resolveDealAmountFromContactProperties(
  contactProperties: Record<string, string>,
  loanPurpose: string | undefined,
): string | undefined {
  const propertyKey = DEAL_AMOUNT_CONTACT_PROPERTY_BY_LOAN_PURPOSE[normalizeLoanPurposeKey(loanPurpose)];
  if (!propertyKey) return undefined;

  const raw = contactProperties[propertyKey]?.trim();
  if (!raw) return undefined;

  const normalized = raw.replace(/[$,\s]/g, "");
  if (!normalized) return undefined;

  const amount = Number(normalized);
  if (!Number.isFinite(amount) || amount <= 0) return undefined;

  return String(amount);
}

function buildDealName(
  input: HubSpotContactInput,
  contactProperties: Record<string, string>,
): string {
  const { firstname, lastname } = resolveHubSpotContactName(input);
  const loanPurpose =
    contactProperties[IHL_HUBSPOT_PROPERTIES.loanPurpose]?.trim() ||
    input.loanPurpose?.trim() ||
    "General Inquiry";

  const fullName = [firstname, lastname]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ")
    .trim();

  const nameBase =
    fullName && fullName !== "Unknown" ? fullName : input.email.trim().toLowerCase();

  return `${nameBase} — ${loanPurpose}`;
}

/**
 * Create-only: open a Deal in Client Pipeline → New Lead for brand-new contacts.
 * Skipped on contact updates so existing pipeline stages are never reset by automation.
 */
async function createHubSpotDealForNewContact(params: {
  contactId: string;
  input: HubSpotContactInput;
  contactProperties: Record<string, string>;
  apiKey: string;
}): Promise<void> {
  const { contactId, input, contactProperties, apiKey } = params;

  const pipelineStage = await fetchClientPipelineNewLeadStage(apiKey);
  if (!pipelineStage) return;

  const dealProperties: Record<string, string> = {
    dealname: buildDealName(input, contactProperties),
    pipeline: pipelineStage.pipelineId,
    dealstage: pipelineStage.stageId,
    hubspot_owner_id: IHL_DEFAULT_HUBSPOT_OWNER_ID,
  };

  const amount = resolveDealAmountFromContactProperties(
    contactProperties,
    contactProperties[IHL_HUBSPOT_PROPERTIES.loanPurpose] ?? input.loanPurpose,
  );
  if (amount) dealProperties.amount = amount;

  const response = await fetch(`${HUBSPOT_API}/crm/v3/objects/deals`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: dealProperties,
      associations: [
        {
          to: { id: contactId },
          types: [
            {
              associationCategory: "HUBSPOT_DEFINED",
              associationTypeId: DEAL_TO_CONTACT_ASSOCIATION_TYPE_ID,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`HubSpot deal API error ${response.status}: ${errText}`);
  }
}

type BuildPropertiesOptions = {
  /** When true, apply the default ihl_lead_status for brand-new contacts only. */
  isNewContact?: boolean;
  newUnworkedIhlLeadStatus?: string;
};

function buildProperties(
  input: HubSpotContactInput,
  options: BuildPropertiesOptions = {},
): Record<string, string> {
  const { firstname, lastname } = resolveHubSpotContactName(input);
  const properties: Record<string, string> = {
    email: input.email.trim().toLowerCase(),
    firstname,
    lastname,
    city: "Washington",
    state: "DC",
    hubspot_owner_id: IHL_DEFAULT_HUBSPOT_OWNER_ID,
    [IHL_HUBSPOT_PROPERTIES.nmls]: "2831765",
    [IHL_HUBSPOT_PROPERTIES.market]: "Washington, DC",
  };

  if (input.phone?.trim()) properties.phone = input.phone.trim();
  if (input.leadSource) properties[IHL_HUBSPOT_PROPERTIES.leadSource] = input.leadSource;
  if (input.loanPurpose) properties[IHL_HUBSPOT_PROPERTIES.loanPurpose] = input.loanPurpose;
  if (input.purchaseTimeline) {
    properties[IHL_HUBSPOT_PROPERTIES.purchaseTimeline] = input.purchaseTimeline;
  }
  if (input.leadStatus) properties.hs_lead_status = mapHubSpotLeadStatus(input.leadStatus);
  if (input.aiSourced !== undefined) {
    properties[IHL_HUBSPOT_PROPERTIES.aiSourcedLead] = toHubSpotValue(input.aiSourced);
  }

  // Create-only: default IHL Lead Status for new contacts. Omit on updates so manual
  // status changes by Javier/Alma are never overwritten by subsequent form submissions.
  if (options.isNewContact && options.newUnworkedIhlLeadStatus) {
    properties[IHL_HUBSPOT_PROPERTIES.ihlLeadStatus] = options.newUnworkedIhlLeadStatus;
  }

  if (input.extraProperties) {
    for (const [key, value] of Object.entries(input.extraProperties)) {
      if (key === "firstname" || key === "lastname") continue;
      if (value !== undefined && value !== null && value !== "") {
        properties[key] = toHubSpotValue(value);
      }
    }
  }

  return properties;
}

async function attachHubSpotNotes(
  contactId: string,
  notes: string[],
  apiKey: string,
): Promise<void> {
  const body = notes.map((n) => n.trim()).filter(Boolean).join("\n\n");
  if (!body) return;

  const response = await fetch(`${HUBSPOT_API}/crm/v3/objects/notes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        hs_timestamp: new Date().toISOString(),
        hs_note_body: body,
      },
      associations: [
        {
          to: { id: contactId },
          types: [
            {
              associationCategory: "HUBSPOT_DEFINED",
              associationTypeId: NOTE_TO_CONTACT_ASSOCIATION_TYPE_ID,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`HubSpot note API error ${response.status}: ${errText}`);
  }
}

export async function createOrUpdateHubSpotContact(input: HubSpotContactInput): Promise<void> {
  const apiKey = process.env.HUBSPOT_API_KEY;
  if (!apiKey) {
    console.warn("[hubspot] HUBSPOT_API_KEY not configured — skipping contact sync");
    return;
  }

  const email = input.email?.trim();
  if (!email) {
    console.warn("[hubspot] email required — skipping contact sync");
    return;
  }

  const normalizedEmail = email.toLowerCase();
  const isNewContact = !(await hubSpotContactExistsByEmail(normalizedEmail, apiKey));
  let newUnworkedIhlLeadStatus: string | undefined;
  if (isNewContact) {
    const resolved = await fetchNewUnworkedIhlLeadStatus(apiKey);
    if (resolved) newUnworkedIhlLeadStatus = resolved;
  }

  const properties = buildProperties(input, { isNewContact, newUnworkedIhlLeadStatus });
  const requestBody = {
    inputs: [
      {
        id: normalizedEmail,
        idProperty: "email",
        properties,
      },
    ],
  };

  const response = await fetch(`${HUBSPOT_API}/crm/v3/objects/contacts/batch/upsert`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const responseText = await response.text().catch(() => "");
  let responseData: unknown = responseText;
  try {
    responseData = responseText ? JSON.parse(responseText) : null;
  } catch {
    // keep raw text in responseData
  }

  if (!response.ok) {
    console.error("[hubspot] contact upsert — API error response:", {
      status: response.status,
      statusText: response.statusText,
      body: responseData,
    });
    throw new Error(`HubSpot API error ${response.status}: ${responseText}`);
  }

  const data = responseData as {
    results?: { id?: string }[];
  };
  const contactId = data.results?.[0]?.id;

  // Create-only: open a Deal for new contacts; never on updates (same guard as ihl_lead_status).
  if (isNewContact && contactId) {
    try {
      await createHubSpotDealForNewContact({
        contactId,
        input,
        contactProperties: properties,
        apiKey,
      });
    } catch (err) {
      console.warn("[hubspot-deal] deal creation failed — contact sync continues:", err);
    }
  } else if (isNewContact && !contactId) {
    console.warn("[hubspot-deal] contact upsert succeeded but no contact id — skipping deal creation");
  }

  const notes = input.notes?.map((n) => n.trim()).filter(Boolean) ?? [];
  if (!notes.length) return;

  if (!contactId) {
    console.warn("[hubspot] contact upsert succeeded but no contact id returned — skipping notes");
    return;
  }

  await attachHubSpotNotes(contactId, notes, apiKey);
}
