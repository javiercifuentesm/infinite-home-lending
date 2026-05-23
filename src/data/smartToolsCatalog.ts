import type { LucideIcon } from "lucide-react";
import {
  Briefcase, Clock, Compass, GitCompareArrows, Home, Landmark,
  Lock, Map, RefreshCw, Scale, Scale3d, TrendingUp, Wallet, Zap,
} from "lucide-react";

export type SmartToolCatalogEntry = {
  nameKey: string;
  descKey: string;
  navBlurbKey: string;
  path: string;
  icon: LucideIcon;
  hiddenFromHub?: boolean;
};

export const SMART_TOOLS_CATALOG: readonly SmartToolCatalogEntry[] = [
  { nameKey: "tool.trueCostOfWaiting.name", descKey: "tool.trueCostOfWaiting.desc", navBlurbKey: "tool.trueCostOfWaiting.nav", path: "/tools/true-cost-of-waiting", icon: Clock },
  { nameKey: "tool.buyVsRent.name", descKey: "tool.buyVsRent.desc", navBlurbKey: "tool.buyVsRent.nav", path: "/tools/buy-vs-rent", icon: GitCompareArrows },
  { nameKey: "tool.wealthTracker.name", descKey: "tool.wealthTracker.desc", navBlurbKey: "tool.wealthTracker.nav", path: "/tools/wealth-tracker", icon: Wallet },
  { nameKey: "tool.principalAccelerator.name", descKey: "tool.principalAccelerator.desc", navBlurbKey: "tool.principalAccelerator.nav", path: "/tools/principal-accelerator", icon: Zap },
  { nameKey: "tool.refinanceRealMath.name", descKey: "tool.refinanceRealMath.desc", navBlurbKey: "tool.refinanceRealMath.nav", path: "/refinance-real-math", icon: RefreshCw },
  { nameKey: "tool.helocPlanner.name", descKey: "tool.helocPlanner.desc", navBlurbKey: "tool.helocPlanner.nav", path: "/tools/heloc-planner", icon: Landmark },
  { nameKey: "tool.reverseMortgage.name", descKey: "tool.reverseMortgage.desc", navBlurbKey: "tool.reverseMortgage.nav", path: "/tools/reverse-mortgage-planner", icon: Home },
  { nameKey: "tool.creditScoreROI.name", descKey: "tool.creditScoreROI.desc", navBlurbKey: "tool.creditScoreROI.nav", path: "/tools/credit-score-roi", icon: TrendingUp },
  { nameKey: "tool.rateLockEngine.name", descKey: "tool.rateLockEngine.desc", navBlurbKey: "tool.rateLockEngine.nav", path: "/tools/rate-lock-engine", icon: Lock },
  { nameKey: "tool.homebuyingPowerMap.name", descKey: "tool.homebuyingPowerMap.desc", navBlurbKey: "tool.homebuyingPowerMap.nav", path: "/tools/homebuying-power-map", icon: Map },
  { nameKey: "tool.conventionalVsFHA.name", descKey: "tool.conventionalVsFHA.desc", navBlurbKey: "tool.conventionalVsFHA.nav", path: "/tools/conventional-vs-fha", icon: Scale3d },
  { nameKey: "tool.selfEmployedQualifier.name", descKey: "tool.selfEmployedQualifier.desc", navBlurbKey: "tool.selfEmployedQualifier.nav", path: "/tools/self-employed-qualifier", icon: Briefcase },
  { nameKey: "tool.structureSimulator.name", descKey: "tool.structureSimulator.desc", navBlurbKey: "tool.structureSimulator.nav", path: "/loan-structure-simulator", icon: Compass, hiddenFromHub: true },
  { nameKey: "tool.buyVsWait.name", descKey: "tool.buyVsWait.desc", navBlurbKey: "tool.buyVsWait.nav", path: "/buy-vs-wait", icon: Scale, hiddenFromHub: true },
];

export function getSmartToolsForHub(): readonly SmartToolCatalogEntry[] {
  return SMART_TOOLS_CATALOG.filter((t) => !t.hiddenFromHub);
}

export function getAllSmartToolPaths(): string[] {
  return SMART_TOOLS_CATALOG.map((t) => t.path);
}
