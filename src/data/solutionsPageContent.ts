import type { LoanProductData } from "../components/LoanProductCard";
import { getLoanProductsForLang } from "./loanProducts";

/** Aggregate unique fit signals from all loan products — existing copy only. */
export function getSolutionsFitItems(lang?: string, max = 12): string[] {
  const products = getLoanProductsForLang(lang);
  const seen = new Set<string>();
  const out: string[] = [];

  for (const product of products) {
    const lines = [
      ...product.modalDetail.whenMakesSenseBullets,
      ...product.modalDetail.whoTypically,
      ...product.expanded.whoFor,
    ];
    for (const line of lines) {
      const key = line.trim().toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(line);
      if (out.length >= max) return out;
    }
  }

  return out;
}

/** Guided path groupings for compare section — product titles only. */
export const SOLUTIONS_COMPARE_PATHS = [
  {
    id: "buy" as const,
    titleKey: "solutions.guided.buy.title",
    descKey: "solutions.guided.buy.desc",
    productIds: ["conventional", "fha", "va", "usda", "non-qm"],
  },
  {
    id: "equity" as const,
    titleKey: "solutions.guided.equity.title",
    descKey: "solutions.guided.equity.desc",
    productIds: ["refinance", "cash-out-refinance", "heloc", "reverse"],
  },
  {
    id: "explore" as const,
    titleKey: "solutions.guided.explore.title",
    descKey: "solutions.guided.explore.desc",
    productIds: [
      "conventional",
      "fha",
      "va",
      "usda",
      "refinance",
      "cash-out-refinance",
      "heloc",
      "reverse",
      "non-qm",
    ],
  },
];

export type SolutionsExploreTool = {
  to: string;
  linkLabelKey: string;
  bodyKey: string;
};

/** Tool / compare cards — existing solutions modal + page i18n keys. */
export const SOLUTIONS_EXPLORE_TOOLS: SolutionsExploreTool[] = [
  {
    to: "/tools/conventional-vs-fha",
    linkLabelKey: "solutions.modal.fhaLink",
    bodyKey: "solutions.modal.fhaPost",
  },
  {
    to: "/tools/heloc-planner",
    linkLabelKey: "solutions.modal.helocLink",
    bodyKey: "solutions.modal.helocPost",
  },
  {
    to: "/tools/reverse-mortgage-planner",
    linkLabelKey: "solutions.modal.reverseLink",
    bodyKey: "solutions.modal.reversePost",
  },
  {
    to: "/tools/self-employed-qualifier",
    linkLabelKey: "solutions.modal.selfEmployedLink",
    bodyKey: "solutions.modal.selfEmployedPost",
  },
];

export function getSolutionsProducts(lang?: string): LoanProductData[] {
  return getLoanProductsForLang(lang);
}
