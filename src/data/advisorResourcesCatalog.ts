import type { LucideIcon } from "lucide-react";
import {
  Calculator,
  Home,
  Layers,
  MessageCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import {
  getKnowledgeRoutes,
  KNOWLEDGE_ROUTE_ORDER,
  type KnowledgeRouteId,
} from "./knowledgeCenterRoutes";
import { hasResourceModalSummary } from "./resourceModalSummaries";

/** Learning-path groups for advisor Resources directory. */
export type AdvisorResourcePathId =
  | "orientation"
  | "buying"
  | "numbers"
  | "loan-options"
  | "refinance"
  | "quick-answers";

export type AdvisorResourceCatalogEntry = {
  routeId: KnowledgeRouteId;
  pathId: AdvisorResourcePathId;
  /** Deep link into Knowledge Center guided path */
  path: string;
  icon: LucideIcon;
  pathTitleKey: string;
  advisorFeaturedRank?: 1 | 2 | 3;
  /** Order in the optional “new to mortgages” start sequence */
  startHereOrder?: 1 | 2 | 3;
};

/**
 * Advisor Resources catalog — references Knowledge Center routes (single source of truth).
 * Modal treatment is driven by shared summaries in resourceModalSummaries.ts.
 */
export const ADVISOR_RESOURCES_CATALOG: readonly AdvisorResourceCatalogEntry[] = [
  {
    routeId: "start-here",
    pathId: "orientation",
    path: "/knowledge-center?path=start-here",
    icon: Sparkles,
    pathTitleKey: "advisor.resources.path.orientation",
    advisorFeaturedRank: 1,
    startHereOrder: 1,
  },
  {
    routeId: "buying",
    pathId: "buying",
    path: "/knowledge-center?path=buying",
    icon: Home,
    pathTitleKey: "advisor.resources.path.buying",
    advisorFeaturedRank: 2,
    startHereOrder: 2,
  },
  {
    routeId: "numbers",
    pathId: "numbers",
    path: "/knowledge-center?path=numbers",
    icon: Calculator,
    pathTitleKey: "advisor.resources.path.numbers",
    startHereOrder: 3,
  },
  {
    routeId: "loan-options",
    pathId: "loan-options",
    path: "/knowledge-center?path=loan-options",
    icon: Layers,
    pathTitleKey: "advisor.resources.path.loanOptions",
    advisorFeaturedRank: 3,
  },
  {
    routeId: "refinance-equity",
    pathId: "refinance",
    path: "/knowledge-center?path=refinance-equity",
    icon: RefreshCw,
    pathTitleKey: "advisor.resources.path.refinance",
  },
  {
    routeId: "quick-answers",
    pathId: "quick-answers",
    path: "/knowledge-center?path=quick-answers",
    icon: MessageCircle,
    pathTitleKey: "advisor.resources.path.quickAnswers",
  },
];

export type AdvisorResourceResolved = AdvisorResourceCatalogEntry & {
  title: string;
  description: string;
  /** True when a shared educational modal summary exists for this route. */
  openInAdvisorModal: boolean;
};

export function resolveAdvisorResource(
  entry: AdvisorResourceCatalogEntry,
  lang: string,
): AdvisorResourceResolved {
  const route = getKnowledgeRoutes(lang)[entry.routeId];
  return {
    ...entry,
    title: route.label,
    description: route.cardDescription,
    openInAdvisorModal: hasResourceModalSummary(entry.routeId),
  };
}

export function getAdvisorFeaturedResources(lang: string): readonly AdvisorResourceResolved[] {
  return ADVISOR_RESOURCES_CATALOG.filter((e) => e.advisorFeaturedRank != null)
    .slice()
    .sort((a, b) => (a.advisorFeaturedRank ?? 99) - (b.advisorFeaturedRank ?? 99))
    .map((e) => resolveAdvisorResource(e, lang));
}

export function getAdvisorStartHereResources(lang: string): readonly AdvisorResourceResolved[] {
  return ADVISOR_RESOURCES_CATALOG.filter((e) => e.startHereOrder != null)
    .slice()
    .sort((a, b) => (a.startHereOrder ?? 99) - (b.startHereOrder ?? 99))
    .map((e) => resolveAdvisorResource(e, lang));
}

export type AdvisorResourcePathGroup = {
  pathId: AdvisorResourcePathId;
  titleKey: string;
  resources: readonly AdvisorResourceResolved[];
};

/** Directory groups — excludes featured resources to avoid duplication. */
export function getAdvisorResourceDirectoryGroups(
  lang: string,
): readonly AdvisorResourcePathGroup[] {
  const featuredIds = new Set(
    ADVISOR_RESOURCES_CATALOG.filter((e) => e.advisorFeaturedRank != null).map((e) => e.routeId),
  );

  const remaining = ADVISOR_RESOURCES_CATALOG.filter((e) => !featuredIds.has(e.routeId));

  return remaining.map((entry) => ({
    pathId: entry.pathId,
    titleKey: entry.pathTitleKey,
    resources: [resolveAdvisorResource(entry, lang)],
  }));
}

/** Sanity: catalog covers every Knowledge Center route. */
export function assertAdvisorResourcesCoverAllRoutes(): boolean {
  const ids = new Set(ADVISOR_RESOURCES_CATALOG.map((e) => e.routeId));
  return KNOWLEDGE_ROUTE_ORDER.every((id) => ids.has(id));
}
