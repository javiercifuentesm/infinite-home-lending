/**
 * HubSpot CRM contact sync — Contacts API v3 batch upsert by email.
 * Requires HUBSPOT_API_KEY (private app token with crm.objects.contacts.write).
 */

const HUBSPOT_API = "https://api.hubapi.com";
/** HubSpot-defined association: note → contact */
const NOTE_TO_CONTACT_ASSOCIATION_TYPE_ID = 202;
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
} as const;

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

function buildProperties(input: HubSpotContactInput): Record<string, string> {
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

  const properties = buildProperties(input);
  const requestBody = {
    inputs: [
      {
        id: email.toLowerCase(),
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

  const notes = input.notes?.map((n) => n.trim()).filter(Boolean) ?? [];
  if (!notes.length) return;

  const data = responseData as {
    results?: { id?: string }[];
  };
  const contactId = data.results?.[0]?.id;
  if (!contactId) {
    console.warn("[hubspot] contact upsert succeeded but no contact id returned — skipping notes");
    return;
  }

  await attachHubSpotNotes(contactId, notes, apiKey);
}
