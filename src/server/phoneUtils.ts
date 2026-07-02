/**
 * Normalize US phone numbers for HubSpot matching (ihl_phone_normalized).
 * Strips non-digits and a leading country code "1" on 11-digit numbers.
 */
export function normalizePhone(rawPhone: string | undefined | null): string {
  if (!rawPhone) return "";
  const digits = rawPhone.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 11 && digits.startsWith("1")) {
    return digits.slice(1);
  }
  return digits;
}
