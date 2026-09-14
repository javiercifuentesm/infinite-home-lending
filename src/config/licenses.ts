export interface LicenseRecord {
  state: string;
  stateName: string;
  licenseType: string;
  licenseNumber: string | null;
  status: "active" | "pending";
  originalLicenseDate?: string;
}

export const COMPANY_NMLS_ID = "2831765";

export const licenses: LicenseRecord[] = [
  {
    state: "DC",
    stateName: "District of Columbia",
    licenseType: "Mortgage Broker License",
    licenseNumber: "MLB2831765",
    status: "active",
    originalLicenseDate: "2026-05-21",
  },
  {
    state: "MD",
    stateName: "Maryland",
    licenseType: "Mortgage Lender License",
    licenseNumber: "2831765",
    status: "active",
    originalLicenseDate: "2026-06-30",
  },
  {
    state: "VA",
    stateName: "Virginia",
    licenseType: "Virginia Broker License",
    licenseNumber: "MC-8214",
    status: "active",
    originalLicenseDate: "2026-09-03",
  },
];

const LICENSE_TYPE_ES: Partial<Record<string, string>> = {
  "Mortgage Broker License": "Licencia de Corredor Hipotecario",
  "Mortgage Lender License": "Licencia Hipotecaria",
  "Virginia Broker License": "Licencia de Corredor de Virginia",
};

/** Helper: returns display names of active-licensed states only, e.g. ["DC", "Maryland"] */
export function getActiveLicensedStateNames(): string[] {
  return licenses
    .filter((l) => l.status === "active")
    .map((l) => (l.state === "DC" ? "DC" : l.stateName));
}

function getLicensingStateDisplay(record: LicenseRecord): string {
  return record.state === "DC" ? "Washington, D.C." : record.stateName;
}

export function joinList(items: string[], locale: "en" | "es"): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) {
    return locale === "es" ? `${items[0]} y ${items[1]}` : `${items[0]}, ${items[1]}`;
  }
  const head = items.slice(0, -1).join(", ");
  const last = items[items.length - 1];
  return locale === "es" ? `${head} y ${last}` : `${head}, and ${last}`;
}

/** Compact company licensing footprint for footers, derived from active license records. */
export function getLicensedInFooterText(locale: "en" | "es"): string {
  const activeStateAbbreviations = licenses
    .filter((license) => license.status === "active")
    .map((license) => license.state);

  const states = joinList(activeStateAbbreviations, locale);
  return locale === "es" ? `Licenciado en ${states}.` : `Licensed in ${states}.`;
}

export function formatStateLicenseLine(record: LicenseRecord, locale: "en" | "es"): string {
  const stateDisplay = getLicensingStateDisplay(record);

  if (record.status === "pending") {
    return locale === "es"
      ? `Licencia de ${record.stateName} pendiente de aprobación`
      : `${record.stateName} License Pending Approval`;
  }

  const numberSuffix = record.licenseNumber ? ` · ${record.licenseNumber}` : "";

  if (locale === "es") {
    const typeEs = LICENSE_TYPE_ES[record.licenseType] ?? record.licenseType;
    // Official types that already include the jurisdiction (e.g. "Virginia Broker License").
    if (record.licenseType.toLowerCase().startsWith(record.stateName.toLowerCase())) {
      return `${typeEs} (activa)${numberSuffix}`;
    }
    return `${typeEs} de ${stateDisplay} (activa)${numberSuffix}`;
  }

  if (record.licenseType.toLowerCase().startsWith(record.stateName.toLowerCase())) {
    return `${record.licenseType} (active)${numberSuffix}`;
  }

  return `${stateDisplay} ${record.licenseType} (active)${numberSuffix}`;
}
