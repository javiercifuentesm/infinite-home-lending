import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Clock,
  Compass,
  GitCompareArrows,
  Home,
  Landmark,
  Lock,
  Map,
  RefreshCw,
  Scale,
  Scale3d,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";

/** Client-intent groups for advisor Smart Tools directory. */
export type SmartToolIntentId = "buying" | "comparing" | "payments" | "equity";

export type SmartToolCatalogEntry = {
  id: string;
  nameKey: string;
  descKey: string;
  navBlurbKey: string;
  path: string;
  icon: LucideIcon;
  hiddenFromHub?: boolean;
  /** Intent group used by advisor Smart Tools pages. */
  intentId?: SmartToolIntentId;
  /**
   * Featured rank on advisor Smart Tools (1 = strongest).
   * Only tools with a rank appear in the featured band.
   */
  advisorFeaturedRank?: 1 | 2 | 3;
};

export const SMART_TOOL_INTENT_ORDER: readonly SmartToolIntentId[] = [
  "buying",
  "comparing",
  "payments",
  "equity",
] as const;

export const SMART_TOOL_INTENT_TITLE_KEYS: Record<SmartToolIntentId, string> = {
  buying: "advisor.smartTools.intent.buying",
  comparing: "advisor.smartTools.intent.comparing",
  payments: "advisor.smartTools.intent.payments",
  equity: "advisor.smartTools.intent.equity",
};

/**
 * Shared IHL Smart Tools catalog — single source of truth for
 * /smart-tools and advisor /:slug/tools directories.
 */
export const SMART_TOOLS_CATALOG: readonly SmartToolCatalogEntry[] = [
  {
    id: "true-cost-of-waiting",
    nameKey: "tool.trueCostOfWaiting.name",
    descKey: "tool.trueCostOfWaiting.desc",
    navBlurbKey: "tool.trueCostOfWaiting.nav",
    path: "/tools/true-cost-of-waiting",
    icon: Clock,
    intentId: "buying",
  },
  {
    id: "buy-vs-rent",
    nameKey: "tool.buyVsRent.name",
    descKey: "tool.buyVsRent.desc",
    navBlurbKey: "tool.buyVsRent.nav",
    path: "/tools/buy-vs-rent",
    icon: GitCompareArrows,
    intentId: "buying",
    advisorFeaturedRank: 2,
  },
  {
    id: "wealth-tracker",
    nameKey: "tool.wealthTracker.name",
    descKey: "tool.wealthTracker.desc",
    navBlurbKey: "tool.wealthTracker.nav",
    path: "/tools/wealth-tracker",
    icon: Wallet,
    intentId: "payments",
  },
  {
    id: "principal-accelerator",
    nameKey: "tool.principalAccelerator.name",
    descKey: "tool.principalAccelerator.desc",
    navBlurbKey: "tool.principalAccelerator.nav",
    path: "/tools/principal-accelerator",
    icon: Zap,
    intentId: "payments",
  },
  {
    id: "refinance-real-math",
    nameKey: "tool.refinanceRealMath.name",
    descKey: "tool.refinanceRealMath.desc",
    navBlurbKey: "tool.refinanceRealMath.nav",
    path: "/refinance-real-math",
    icon: RefreshCw,
    intentId: "payments",
  },
  {
    id: "heloc-planner",
    nameKey: "tool.helocPlanner.name",
    descKey: "tool.helocPlanner.desc",
    navBlurbKey: "tool.helocPlanner.nav",
    path: "/tools/heloc-planner",
    icon: Landmark,
    intentId: "equity",
  },
  {
    id: "reverse-mortgage",
    nameKey: "tool.reverseMortgage.name",
    descKey: "tool.reverseMortgage.desc",
    navBlurbKey: "tool.reverseMortgage.nav",
    path: "/tools/reverse-mortgage-planner",
    icon: Home,
    intentId: "equity",
  },
  {
    id: "credit-score-roi",
    nameKey: "tool.creditScoreROI.name",
    descKey: "tool.creditScoreROI.desc",
    navBlurbKey: "tool.creditScoreROI.nav",
    path: "/tools/credit-score-roi",
    icon: TrendingUp,
    intentId: "buying",
  },
  {
    id: "rate-lock-engine",
    nameKey: "tool.rateLockEngine.name",
    descKey: "tool.rateLockEngine.desc",
    navBlurbKey: "tool.rateLockEngine.nav",
    path: "/tools/rate-lock-engine",
    icon: Lock,
    intentId: "comparing",
  },
  {
    id: "homebuying-power-map",
    nameKey: "tool.homebuyingPowerMap.name",
    descKey: "tool.homebuyingPowerMap.desc",
    navBlurbKey: "tool.homebuyingPowerMap.nav",
    path: "/tools/homebuying-power-map",
    icon: Map,
    intentId: "buying",
    advisorFeaturedRank: 1,
  },
  {
    id: "conventional-vs-fha",
    nameKey: "tool.conventionalVsFHA.name",
    descKey: "tool.conventionalVsFHA.desc",
    navBlurbKey: "tool.conventionalVsFHA.nav",
    path: "/tools/conventional-vs-fha",
    icon: Scale3d,
    intentId: "comparing",
    advisorFeaturedRank: 3,
  },
  {
    id: "self-employed-qualifier",
    nameKey: "tool.selfEmployedQualifier.name",
    descKey: "tool.selfEmployedQualifier.desc",
    navBlurbKey: "tool.selfEmployedQualifier.nav",
    path: "/tools/self-employed-qualifier",
    icon: Briefcase,
    intentId: "comparing",
  },
  {
    id: "structure-simulator",
    nameKey: "tool.structureSimulator.name",
    descKey: "tool.structureSimulator.desc",
    navBlurbKey: "tool.structureSimulator.nav",
    path: "/loan-structure-simulator",
    icon: Compass,
    hiddenFromHub: true,
  },
  {
    id: "buy-vs-wait",
    nameKey: "tool.buyVsWait.name",
    descKey: "tool.buyVsWait.desc",
    navBlurbKey: "tool.buyVsWait.nav",
    path: "/buy-vs-wait",
    icon: Scale,
    hiddenFromHub: true,
  },
];

export function getSmartToolsForHub(): readonly SmartToolCatalogEntry[] {
  return SMART_TOOLS_CATALOG.filter((t) => !t.hiddenFromHub);
}

export function getSmartToolById(id: string): SmartToolCatalogEntry | undefined {
  return SMART_TOOLS_CATALOG.find((t) => t.id === id);
}

export function getAllSmartToolPaths(): string[] {
  return SMART_TOOLS_CATALOG.map((t) => t.path);
}

export function getAdvisorFeaturedSmartTools(): readonly SmartToolCatalogEntry[] {
  return getSmartToolsForHub()
    .filter((t) => t.advisorFeaturedRank != null)
    .slice()
    .sort((a, b) => (a.advisorFeaturedRank ?? 99) - (b.advisorFeaturedRank ?? 99));
}

export type AdvisorSmartToolIntentGroup = {
  intentId: SmartToolIntentId;
  titleKey: string;
  tools: readonly SmartToolCatalogEntry[];
};

/** Intent-grouped hub tools for advisor Smart Tools pages (excludes featured-only duplication when requested). */
export function getAdvisorSmartToolIntentGroups(
  options: { excludeFeatured?: boolean } = {},
): readonly AdvisorSmartToolIntentGroup[] {
  const featuredIds = new Set(
    options.excludeFeatured
      ? getAdvisorFeaturedSmartTools().map((t) => t.id)
      : [],
  );

  return SMART_TOOL_INTENT_ORDER.map((intentId) => {
    const tools = getSmartToolsForHub().filter(
      (t) => t.intentId === intentId && !featuredIds.has(t.id),
    );
    return {
      intentId,
      titleKey: SMART_TOOL_INTENT_TITLE_KEYS[intentId],
      tools,
    };
  }).filter((group) => group.tools.length > 0);
}
