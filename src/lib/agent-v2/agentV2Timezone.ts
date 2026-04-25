/** Rough US ZIP → IANA timezone for scheduling labels (mock; replace with geocode API later). */

const ZIP_PREFIX_TO_TZ: [number, number, string][] = [
  [350, 369, "America/Chicago"],
  [370, 385, "America/Chicago"],
  [386, 399, "America/New_York"],
  [400, 429, "America/New_York"],
  [430, 439, "America/New_York"],
  [440, 449, "America/New_York"],
  [450, 469, "America/New_York"],
  [470, 479, "America/Indiana/Indianapolis"],
  [480, 499, "America/New_York"],
  [500, 529, "America/Chicago"],
  [530, 532, "America/Chicago"],
  [534, 535, "America/Chicago"],
  [537, 551, "America/Chicago"],
  [553, 567, "America/Chicago"],
  [570, 577, "America/Chicago"],
  [580, 588, "America/Chicago"],
  [590, 599, "America/Denver"],
  [600, 629, "America/Chicago"],
  [630, 658, "America/Chicago"],
  [660, 679, "America/Chicago"],
  [680, 693, "America/Chicago"],
  [700, 714, "America/Chicago"],
  [716, 722, "America/Chicago"],
  [723, 731, "America/Chicago"],
  [734, 741, "America/Chicago"],
  [743, 758, "America/Chicago"],
  [760, 799, "America/Chicago"],
  [800, 816, "America/Denver"],
  [820, 831, "America/Denver"],
  [832, 838, "America/Boise"],
  [840, 847, "America/Denver"],
  [850, 865, "America/Phoenix"],
  [870, 877, "America/Denver"],
  [878, 884, "America/Denver"],
  [885, 899, "America/Chicago"],
  [900, 961, "America/Los_Angeles"],
  [967, 968, "Pacific/Honolulu"],
  [970, 979, "America/Los_Angeles"],
  [980, 994, "America/Los_Angeles"],
];

const STATE_TO_TZ: Record<string, string> = {
  CA: "America/Los_Angeles",
  WA: "America/Los_Angeles",
  OR: "America/Los_Angeles",
  NV: "America/Los_Angeles",
  AZ: "America/Phoenix",
  TX: "America/Chicago",
  FL: "America/New_York",
  NY: "America/New_York",
  IL: "America/Chicago",
  PA: "America/New_York",
  OH: "America/New_York",
  GA: "America/New_York",
  NC: "America/New_York",
  MI: "America/Detroit",
  CO: "America/Denver",
  UT: "America/Denver",
  NM: "America/Denver",
  TN: "America/Chicago",
  MO: "America/Chicago",
  MN: "America/Chicago",
  WI: "America/Chicago",
  MA: "America/New_York",
  NJ: "America/New_York",
  VA: "America/New_York",
};

export function zipPrefixToApproxTz(zip5: string): string | null {
  const n = parseInt(zip5.slice(0, 3), 10);
  if (Number.isNaN(n)) return null;
  for (const [lo, hi, tz] of ZIP_PREFIX_TO_TZ) {
    if (n >= lo && n <= hi) return tz;
  }
  return null;
}

export function resolveSchedulingTimezone(
  answers: { subjectZip?: string; subjectState?: string },
  clientFallback: string,
): string {
  const zip = answers.subjectZip?.replace(/\D/g, "").slice(0, 5);
  if (zip && zip.length === 5) {
    const z = zipPrefixToApproxTz(zip);
    if (z) return z;
  }
  const st = (answers.subjectState || "").trim().toUpperCase();
  if (st.length === 2 && STATE_TO_TZ[st]) return STATE_TO_TZ[st];
  return clientFallback || "America/New_York";
}

export function shortTzLabel(tz: string, refDate = new Date()): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "short",
    }).formatToParts(refDate);
    return parts.find((p) => p.type === "timeZoneName")?.value ?? tz;
  } catch {
    return tz;
  }
}
