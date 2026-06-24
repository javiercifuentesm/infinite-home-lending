import type { LucideIcon } from "lucide-react";
import {
  ClipboardCheck,
  FileText,
  GitCompareArrows,
  Home,
  KeyRound,
  LineChart,
  ScrollText,
  Search,
} from "lucide-react";

/** Split a benefit line into title + optional body without rewriting copy. */
export function splitBenefitLine(line: string): { title: string; description?: string } {
  const emDash = line.match(/^(.{5,72}?)\s*[—–]\s*(.+)$/);
  if (emDash) return { title: emDash[1].trim(), description: emDash[2].trim() };

  const hyphen = line.match(/^(.{5,72}?)\s+-\s+(.+)$/);
  if (hyphen) return { title: hyphen[1].trim(), description: hyphen[2].trim() };

  const colon = line.match(/^(.{5,56}?):\s*(.+)$/);
  if (colon) return { title: colon[1].trim(), description: colon[2].trim() };

  const sentence = line.match(/^([^.!?]+[.!?])\s+(.{12,})$/);
  if (sentence) return { title: sentence[1].trim(), description: sentence[2].trim() };

  return { title: line };
}

/** Merge fit bullets and dedupe by normalized text. */
export function mergeFitItems(bullets: string[], whoTypically: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const line of [...bullets, ...whoTypically]) {
    const key = line.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(line);
  }
  return out;
}

export type HowItWorksStepKind =
  | "eligibility"
  | "preApproval"
  | "property"
  | "underwriting"
  | "closing"
  | "equity"
  | "compare"
  | "apply"
  | "generic";

const HOW_IT_WORKS_KIND_META: Record<
  HowItWorksStepKind,
  { Icon: LucideIcon; supportKey: string }
> = {
  eligibility: {
    Icon: ScrollText,
    supportKey: "solutions.detail.processSupport.eligibility",
  },
  preApproval: {
    Icon: ClipboardCheck,
    supportKey: "solutions.detail.processSupport.preApproval",
  },
  property: {
    Icon: Home,
    supportKey: "solutions.detail.processSupport.property",
  },
  underwriting: {
    Icon: Search,
    supportKey: "solutions.detail.processSupport.underwriting",
  },
  closing: {
    Icon: KeyRound,
    supportKey: "solutions.detail.processSupport.closing",
  },
  equity: {
    Icon: LineChart,
    supportKey: "solutions.detail.processSupport.equity",
  },
  compare: {
    Icon: GitCompareArrows,
    supportKey: "solutions.detail.processSupport.compare",
  },
  apply: {
    Icon: FileText,
    supportKey: "solutions.detail.processSupport.apply",
  },
  generic: {
    Icon: ClipboardCheck,
    supportKey: "solutions.detail.processSupport.generic",
  },
};

/** Infer step presentation from existing loan copy — no content rewrites. */
export function getHowItWorksStepKind(step: string): HowItWorksStepKind {
  const s = step.toLowerCase();

  if (
    /certificate|eligibility|\bcoe\b|entitlement|income.*limit|qualify|confirm the property address|household income/.test(
      s,
    )
  ) {
    return "eligibility";
  }
  if (/pre-approved|pre-approval|pre-qualified|shop with a clear budget/.test(s)) {
    return "preApproval";
  }
  if (/\bclose|\bclosing|fund your|old loan is paid|repaid when/.test(s)) {
    return "closing";
  }
  if (/home|property|choose a home|address|eligible.*area|requirements/.test(s)) {
    return "property";
  }
  if (/appraisal|underwriting|lender review|evaluated|reviews credit|terms and disclosures/.test(s)) {
    return "underwriting";
  }
  if (/equity|draw funds|credit line|line of credit|distributed as/.test(s)) {
    return "equity";
  }
  if (/compare|rates|lock when|break-even|refinance/.test(s)) {
    return "compare";
  }
  if (/apply|application|documentation|submit|share your goals/.test(s)) {
    return "apply";
  }

  return "generic";
}

export function getHowItWorksStepMeta(step: string) {
  const kind = getHowItWorksStepKind(step);
  return { kind, ...HOW_IT_WORKS_KIND_META[kind] };
}
