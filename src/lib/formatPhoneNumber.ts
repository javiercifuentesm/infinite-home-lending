/** Live US phone display formatting — matches Contact Us / Request a Call. */
export function formatPhoneNumber(value: string): string {
  const cleaned = value.replace(/\D/g, "").slice(0, 10);
  if (!cleaned) return "";
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
  if (!match) return value;
  if (!match[2]) return `(${match[1]}`;
  return `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ""}`;
}
