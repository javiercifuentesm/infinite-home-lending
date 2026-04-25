/**
 * Mock consultation slots — filtered by Morning / Afternoon / Evening / Flexible,
 * labeled in the borrower’s local timezone. Internal window 9:00 a.m.–6:30 p.m.; legal 8:00 a.m.–9:00 p.m.
 */
import type { MockSlot } from "../agent/mortgageAgentMockSlots";
import { shortTzLabel } from "./agentV2Timezone";

export type PreferredBand = "Morning" | "Afternoon" | "Evening" | "Flexible";

type SlotPoint = { h: number; m: number };

function toMin(p: SlotPoint): number {
  return p.h * 60 + p.m;
}

/** 8:00 inclusive … before 21:00 (9 p.m.) */
function isLegal(p: SlotPoint): boolean {
  const t = toMin(p);
  return t >= 8 * 60 && t < 21 * 60;
}

/** 9:00 … 18:30 inclusive */
function isInternal(p: SlotPoint): boolean {
  const t = toMin(p);
  return t >= 9 * 60 && t <= 18 * 60 + 30;
}

function inBand(p: SlotPoint, band: PreferredBand): boolean {
  if (!isLegal(p) || !isInternal(p)) return false;
  const t = toMin(p);
  if (band === "Flexible") return true;
  if (band === "Morning") return t >= 9 * 60 && t < 12 * 60;
  if (band === "Afternoon") return t >= 12 * 60 && t < 17 * 60;
  if (band === "Evening") return t >= 17 * 60 && t <= 18 * 60 + 30;
  return false;
}

/** Wall-clock label in borrower-local sense (mock; times are not calendar-joined to a live API). */
function labelFor(dayOffset: 0 | 1, p: SlotPoint, timeZone: string): string {
  const day = dayOffset === 0 ? "Today" : "Tomorrow";
  const h12 = p.h % 12 || 12;
  const ampm = p.h < 12 ? "AM" : "PM";
  const mm = String(p.m).padStart(2, "0");
  const tzAbbr = shortTzLabel(timeZone);
  return `${day}, ${h12}:${mm} ${ampm} ${tzAbbr}`;
}

const POINTS: SlotPoint[] = [];
for (let h = 9; h <= 18; h++) {
  const mins = h === 18 ? [0, 30] : [0];
  for (const m of mins) {
    const p = { h, m };
    if (isLegal(p) && isInternal(p)) POINTS.push(p);
  }
}

export type SlotGenerationResult = {
  slots: MockSlot[];
  timezone: string;
  timezoneLabel: string;
  scheduleNote?: string;
};

export function generateSlotsForPreference(
  preferredContactTime: string | undefined,
  timeZone: string,
): SlotGenerationResult {
  const band = (preferredContactTime as PreferredBand) || "Flexible";
  const tzLabel = shortTzLabel(timeZone);

  const primary: MockSlot[] = [];
  let id = 0;
  for (const day of [0, 1] as const) {
    for (const p of POINTS) {
      if (!inBand(p, band)) continue;
      id += 1;
      primary.push({ id: `s_${id}_${day}`, label: labelFor(day, p, timeZone) });
    }
  }

  if (primary.length > 0) {
    return { slots: primary.slice(0, 8), timezone: timeZone, timezoneLabel: tzLabel };
  }

  const fallback: MockSlot[] = [];
  let fid = 0;
  for (const day of [0, 1] as const) {
    for (const p of POINTS) {
      if (!inBand(p, "Flexible")) continue;
      fid += 1;
      fallback.push({ id: `f_${fid}_${day}`, label: labelFor(day, p, timeZone) });
    }
  }

  return {
    slots: fallback.slice(0, 8),
    timezone: timeZone,
    timezoneLabel: tzLabel,
    scheduleNote:
      "Nothing open in that exact window with the times we’re showing right now — here are the closest available options in your local time.",
  };
}
