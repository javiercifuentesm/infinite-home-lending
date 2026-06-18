/**
 * Brevo transactional email — welcome templates after HubSpot lead sync.
 */

const BREVO_SMTP_EMAIL_URL = "https://api.brevo.com/v3/smtp/email";

const LOAN_PURPOSE_TEMPLATE_IDS: Record<string, number> = {
  Purchase: 1,
  Refinance: 2,
  HELOC: 3,
  "Reverse Mortgage": 4,
};

export type BrevoWelcomeContact = {
  firstName: string;
  lastName: string;
  email: string;
  loanPurpose: string;
};

export async function sendBrevoWelcomeEmail(contact: BrevoWelcomeContact): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return;

  const templateId = LOAN_PURPOSE_TEMPLATE_IDS[contact.loanPurpose];
  if (!templateId) return;

  const email = contact.email.trim();
  if (!email) return;

  const res = await fetch(BREVO_SMTP_EMAIL_URL, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      templateId,
      params: { FIRSTNAME: contact.firstName },
      sender: { name: "Infinite Home Lending, LLC", email: "info@infinitehomelending.com" },
      to: [{ email, name: `${contact.firstName} ${contact.lastName}`.trim() }],
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Brevo API ${res.status}: ${text}`);
  }
}
