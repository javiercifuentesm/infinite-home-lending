import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Briefcase,
  Building2,
  Compass,
  GitCompareArrows,
  Globe,
  GraduationCap,
  Home,
  Landmark,
  Lightbulb,
  Map,
  Network,
  ShieldCheck,
} from "lucide-react";

export type SolutionsPathwayId = "buy" | "equity" | "altQual";

export type SolutionsScenarioId =
  | "firstTime"
  | "moveUp"
  | "accessEquity"
  | "investor"
  | "selfEmployed"
  | "veteran";

export const SOLUTIONS_PATHWAYS: {
  id: SolutionsPathwayId;
  titleKey: string;
  bodyKey: string;
  programsKey: string;
  ctaKey: string;
  programIds: string[];
  emoji: string;
}[] = [
  {
    id: "buy",
    titleKey: "solutions.flagship.pathway.buy.title",
    bodyKey: "solutions.flagship.pathway.buy.body",
    programsKey: "solutions.flagship.pathway.buy.programs",
    ctaKey: "solutions.flagship.pathway.buy.cta",
    programIds: ["conventional", "fha", "va", "usda"],
    emoji: "🏠",
  },
  {
    id: "equity",
    titleKey: "solutions.flagship.pathway.equity.title",
    bodyKey: "solutions.flagship.pathway.equity.body",
    programsKey: "solutions.flagship.pathway.equity.programs",
    ctaKey: "solutions.flagship.pathway.equity.cta",
    programIds: ["heloc", "cash-out-refinance", "reverse"],
    emoji: "💰",
  },
  {
    id: "altQual",
    titleKey: "solutions.flagship.pathway.altQual.title",
    bodyKey: "solutions.flagship.pathway.altQual.body",
    programsKey: "solutions.flagship.pathway.altQual.programs",
    ctaKey: "solutions.flagship.pathway.altQual.cta",
    programIds: ["non-qm"],
    emoji: "📈",
  },
];

export const SOLUTIONS_SCENARIOS: {
  id: SolutionsScenarioId;
  titleKey: string;
  programsKey: string;
  toolCtaKey: string;
  toolPath: string;
  programIds: string[];
  emoji: string;
}[] = [
  {
    id: "firstTime",
    titleKey: "solutions.flagship.scenario.firstTime.title",
    programsKey: "solutions.flagship.scenario.firstTime.programs",
    toolCtaKey: "solutions.flagship.scenario.firstTime.toolCta",
    toolPath: "/tools/homebuying-power-map",
    programIds: ["fha", "conventional"],
    emoji: "🏠",
  },
  {
    id: "moveUp",
    titleKey: "solutions.flagship.scenario.moveUp.title",
    programsKey: "solutions.flagship.scenario.moveUp.programs",
    toolCtaKey: "solutions.flagship.scenario.moveUp.toolCta",
    toolPath: "/tools/conventional-vs-fha",
    programIds: ["conventional", "refinance"],
    emoji: "🏡",
  },
  {
    id: "accessEquity",
    titleKey: "solutions.flagship.scenario.accessEquity.title",
    programsKey: "solutions.flagship.scenario.accessEquity.programs",
    toolCtaKey: "solutions.flagship.scenario.accessEquity.toolCta",
    toolPath: "/tools/heloc-planner",
    programIds: ["heloc", "cash-out-refinance", "reverse"],
    emoji: "💰",
  },
  {
    id: "investor",
    titleKey: "solutions.flagship.scenario.investor.title",
    programsKey: "solutions.flagship.scenario.investor.programs",
    toolCtaKey: "solutions.flagship.scenario.investor.toolCta",
    toolPath: "/contact?topic=investment",
    programIds: ["non-qm", "conventional"],
    emoji: "📈",
  },
  {
    id: "selfEmployed",
    titleKey: "solutions.flagship.scenario.selfEmployed.title",
    programsKey: "solutions.flagship.scenario.selfEmployed.programs",
    toolCtaKey: "solutions.flagship.scenario.selfEmployed.toolCta",
    toolPath: "/tools/self-employed-qualifier",
    programIds: ["non-qm"],
    emoji: "🧾",
  },
  {
    id: "veteran",
    titleKey: "solutions.flagship.scenario.veteran.title",
    programsKey: "solutions.flagship.scenario.veteran.programs",
    toolCtaKey: "solutions.flagship.scenario.veteran.toolCta",
    toolPath: "/solutions/programs/va",
    programIds: ["va"],
    emoji: "🎖",
  },
];

export const SOLUTIONS_ADVISORY_FRAMEWORK: {
  titleKey: string;
  bodyKey: string;
  Icon: LucideIcon;
}[] = [
  {
    titleKey: "solutions.flagship.framework.goals.title",
    bodyKey: "solutions.flagship.framework.goals.body",
    Icon: Compass,
  },
  {
    titleKey: "solutions.flagship.framework.options.title",
    bodyKey: "solutions.flagship.framework.options.body",
    Icon: Lightbulb,
  },
  {
    titleKey: "solutions.flagship.framework.strategy.title",
    bodyKey: "solutions.flagship.framework.strategy.body",
    Icon: BookOpen,
  },
  {
    titleKey: "solutions.flagship.framework.confidence.title",
    bodyKey: "solutions.flagship.framework.confidence.body",
    Icon: ShieldCheck,
  },
];

export const SOLUTIONS_SMART_TOOLS_SHOWCASE: {
  id: string;
  titleKey: string;
  bodyKey: string;
  ctaKey: string;
  path: string;
  Icon: LucideIcon;
}[] = [
  {
    id: "affordability",
    titleKey: "solutions.flagship.tools.affordability.title",
    bodyKey: "solutions.flagship.tools.affordability.body",
    ctaKey: "solutions.flagship.tools.affordability.cta",
    path: "/tools/homebuying-power-map",
    Icon: Map,
  },
  {
    id: "selfEmployed",
    titleKey: "solutions.flagship.tools.selfEmployed.title",
    bodyKey: "solutions.flagship.tools.selfEmployed.body",
    ctaKey: "solutions.flagship.tools.selfEmployed.cta",
    path: "/tools/self-employed-qualifier",
    Icon: Briefcase,
  },
  {
    id: "heloc",
    titleKey: "solutions.flagship.tools.heloc.title",
    bodyKey: "solutions.flagship.tools.heloc.body",
    ctaKey: "solutions.flagship.tools.heloc.cta",
    path: "/tools/heloc-planner",
    Icon: Landmark,
  },
  {
    id: "compare",
    titleKey: "solutions.flagship.tools.compare.title",
    bodyKey: "solutions.flagship.tools.compare.body",
    ctaKey: "solutions.flagship.tools.compare.cta",
    path: "/tools/conventional-vs-fha",
    Icon: GitCompareArrows,
  },
];

export const SOLUTIONS_STRATEGY_STEPS: {
  titleKey: string;
  Icon: LucideIcon;
}[] = [
  { titleKey: "solutions.flagship.strategy.goals", Icon: Compass },
  { titleKey: "solutions.flagship.strategy.options", Icon: Lightbulb },
  { titleKey: "solutions.flagship.strategy.strategy", Icon: BookOpen },
  { titleKey: "solutions.flagship.strategy.decision", Icon: Landmark },
];

export const SOLUTIONS_TRUST_PILLARS: {
  titleKey: string;
  bodyKey: string;
  Icon: LucideIcon;
}[] = [
  {
    titleKey: "solutions.flagship.trust.brokerage.title",
    bodyKey: "solutions.flagship.trust.brokerage.body",
    Icon: Building2,
  },
  {
    titleKey: "solutions.flagship.trust.experience.title",
    bodyKey: "solutions.flagship.trust.experience.body",
    Icon: GraduationCap,
  },
  {
    titleKey: "solutions.flagship.trust.wholesale.title",
    bodyKey: "solutions.flagship.trust.wholesale.body",
    Icon: Network,
  },
  {
    titleKey: "solutions.flagship.trust.bilingual.title",
    bodyKey: "solutions.flagship.trust.bilingual.body",
    Icon: Globe,
  },
  {
    titleKey: "solutions.flagship.trust.education.title",
    bodyKey: "solutions.flagship.trust.education.body",
    Icon: Home,
  },
];

/** Visual grouping badge on program cards — layout only */
export const PROGRAM_DISPLAY_CATEGORY: Record<string, "purchase" | "equity" | "specialty"> = {
  conventional: "purchase",
  fha: "purchase",
  va: "purchase",
  usda: "purchase",
  refinance: "equity",
  "cash-out-refinance": "equity",
  heloc: "equity",
  reverse: "equity",
  "non-qm": "specialty",
};
