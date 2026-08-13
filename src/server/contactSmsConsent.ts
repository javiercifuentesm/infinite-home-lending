/** Contact Us (/contact) — explicit Yes/No SMS preference (three-state on client, strict boolean on server). */

export const CONTACT_SMS_CONSENT_SOURCE = "/contact";
export const CONTACT_SMS_CONSENT_DISCLOSURE_VERSION = "IHL-SMS-v1-2026-08";

export type ContactSubmittedLang = "en" | "es";

export type ContactSmsConsentRecord = {
  smsConsent: "Yes" | "No";
  smsConsentDecision: "Explicit Yes" | "Explicit No";
  smsConsentSource: string;
  smsConsentDisclosureVersion: string;
  smsConsentDisclosureLanguage: "English" | "Spanish";
  smsConsentTimestamp: string;
};

export const CONTACT_SMS_CONSENT_VALIDATION_ERROR =
  "Please select Yes or No for SMS communications.";

export type ParseContactSmsConsentResult =
  | { ok: true; value: boolean }
  | { ok: false; error: string };

const SUPPORTED_SUBMITTED_LANGS = new Set<ContactSubmittedLang>(["en", "es"]);

/** Strictly accept only supported site languages; default to English for missing/invalid values. */
export function parseContactSubmittedLang(body: Record<string, unknown>): ContactSubmittedLang {
  const raw = body.submittedLang;
  return typeof raw === "string" && SUPPORTED_SUBMITTED_LANGS.has(raw as ContactSubmittedLang)
    ? (raw as ContactSubmittedLang)
    : "en";
}

export function contactDisclosureLanguageLabel(lang: ContactSubmittedLang): "English" | "Spanish" {
  return lang === "es" ? "Spanish" : "English";
}

/** Only literal boolean true/false are accepted — never coerce strings, null, or missing values. */
export function parseContactSmsConsent(body: Record<string, unknown>): ParseContactSmsConsentResult {
  const value = body.smsConsent;
  if (value === true) return { ok: true, value: true };
  if (value === false) return { ok: true, value: false };
  return { ok: false, error: CONTACT_SMS_CONSENT_VALIDATION_ERROR };
}

export function buildContactSmsConsentRecord(
  smsConsent: boolean,
  submissionTimestamp: string,
  submittedLang: ContactSubmittedLang,
): ContactSmsConsentRecord {
  return {
    smsConsent: smsConsent ? "Yes" : "No",
    smsConsentDecision: smsConsent ? "Explicit Yes" : "Explicit No",
    smsConsentSource: CONTACT_SMS_CONSENT_SOURCE,
    smsConsentDisclosureVersion: CONTACT_SMS_CONSENT_DISCLOSURE_VERSION,
    smsConsentDisclosureLanguage: contactDisclosureLanguageLabel(submittedLang),
    smsConsentTimestamp: submissionTimestamp,
  };
}

export function contactSmsConsentNoteLines(record: ContactSmsConsentRecord): string[] {
  return [
    `SMS Consent: ${record.smsConsent}`,
    `SMS Consent Decision: ${record.smsConsentDecision}`,
    `SMS Consent Source: ${record.smsConsentSource}`,
    `SMS Consent Disclosure Version: ${record.smsConsentDisclosureVersion}`,
    `SMS Consent Disclosure Language: ${record.smsConsentDisclosureLanguage}`,
    `SMS Consent Timestamp: ${record.smsConsentTimestamp}`,
  ];
}
