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

/**
 * Single source of truth for Smart Tools hub + nav.
 * Order = display order on /smart-tools and in the nav menu.
 * `hiddenFromHub`: tool stays routable; omitted from hub + dropdown until re-enabled.
 */
export type SmartToolCatalogEntry = {
  name: string;
  path: string;
  description: string;
  icon: LucideIcon;
  /** Short line for navbar dropdown (can differ from card copy). */
  navBlurb: string;
  hiddenFromHub?: boolean;
};

export const SMART_TOOLS_CATALOG: readonly SmartToolCatalogEntry[] = [
  {
    name: "True Cost of Waiting",
    path: "/tools/true-cost-of-waiting",
    description:
      "Rent, appreciation, higher down payment, and equity not built — totaled.",
    navBlurb: "Itemize rent, appreciation, and equity missed while you wait.",
    icon: Clock,
  },
  {
    name: "Buy vs. Rent: The Full Picture",
    path: "/tools/buy-vs-rent",
    description:
      "The crossover year, 30-year wealth curves, and when renting still wins.",
    navBlurb: "Crossover year, wealth curves, and honest rent vs buy analysis.",
    icon: GitCompareArrows,
  },
  {
    name: "Mortgage Wealth Tracker",
    path: "/tools/wealth-tracker",
    description:
      "Six parallel wealth streams, milestone net worth, and the honest opportunity cost of your down payment — owning vs. renting over 30 years.",
    navBlurb: "30-year net worth: six wealth streams + full opportunity-cost picture.",
    icon: Wallet,
  },
  {
    name: "The Principal Accelerator",
    path: "/tools/principal-accelerator",
    description:
      "Slide extra principal payments and watch years and interest saved update live.",
    navBlurb: "Extra payments, years saved, and interest avoided — in real time.",
    icon: Zap,
  },
  {
    name: "Refinance Real Math",
    path: "/refinance-real-math",
    description:
      "Payment, break-even, and interest — side by side before you commit.",
    navBlurb: "Payment, break-even, and interest side by side.",
    icon: RefreshCw,
  },
  {
    name: "HELOC Smart Planner",
    path: "/tools/heloc-planner",
    description:
      "Draw vs repayment payments, three rate scenarios, payment cliff warning, and honest use-case guidance.",
    navBlurb: "Credit limit, payment cliff, rate scenarios, and HELOC vs alternatives.",
    icon: Landmark,
  },
  {
    name: "Reverse Mortgage Retirement Planner",
    path: "/tools/reverse-mortgage-planner",
    description:
      "Four payout strategies, income gap, 20-year equity, and myths debunked — for 62+ homeowners.",
    navBlurb: "Income gap, payout options, heir equity — one honest picture.",
    icon: Home,
  },
  {
    name: "Credit Score ROI Calculator",
    path: "/tools/credit-score-roi",
    description:
      "What each score point is worth in lifetime interest — plus a mortgage-impact-ranked action plan.",
    navBlurb: "Dollar-per-point value, lifetime savings, and a ranked credit action plan.",
    icon: TrendingUp,
  },
  {
    name: "The Rate Lock Decision Engine",
    path: "/tools/rate-lock-engine",
    description:
      "Quantify your downside vs. upside from floating, model extension fees, and analyze float-down options — in your dollars.",
    navBlurb: "Rate lock risk in dollars: asymmetric downside, extensions, and float-down math.",
    icon: Lock,
  },
  {
    name: "The Homebuying Power Map",
    path: "/tools/homebuying-power-map",
    description:
      "Buying power today and at 90 days, 6 months, and 12 months — mapped to real MD-DC-VA median prices and neighborhoods.",
    navBlurb: "Trajectory vs. real neighborhoods: credit, debt, savings, and income levers.",
    icon: Map,
  },
  {
    name: "Conventional vs. FHA: The Full Cost Comparison",
    path: "/tools/conventional-vs-fha",
    description:
      "MI crossover year, FHA-to-Conventional refi at year 5, credit score tiers, and your personalized verdict.",
    navBlurb: "MI crossover, refi strategy, credit tiers — full cost picture.",
    icon: Scale3d,
  },
  {
    name: "The Self-Employed Mortgage Qualifier",
    path: "/tools/self-employed-qualifier",
    description:
      "Schedule C add-backs, bank statement cash flow, and the write-off vs. buying-power tradeoff — modeled side by side.",
    navBlurb: "Tax return, bank statement, and planning paths for 1099 & business owners.",
    icon: Briefcase,
  },
  {
    name: "Structure Simulator",
    path: "/loan-structure-simulator",
    description: "Compare loan structures with clarity.",
    navBlurb: "Compare loan structures with clarity.",
    icon: Compass,
    hiddenFromHub: true,
  },
  {
    name: "Buy vs. Wait Analyzer",
    path: "/buy-vs-wait",
    description: "See what waiting could cost — or save, given your numbers.",
    navBlurb: "See what waiting could cost — or save.",
    icon: Scale,
    hiddenFromHub: true,
  },
];

/** Hub page + nav: visible tools only, catalog order preserved. */
export function getSmartToolsForHub(): readonly SmartToolCatalogEntry[] {
  return SMART_TOOLS_CATALOG.filter((t) => !t.hiddenFromHub);
}

/** All tool paths (including hidden) — for active-route detection in the nav. */
export function getAllSmartToolPaths(): string[] {
  return SMART_TOOLS_CATALOG.map((t) => t.path);
}
