import type { LucideIcon } from "lucide-react";
import {
  Building2,
  CircleDollarSign,
  FileX,
  Gift,
  Home,
  Landmark,
  Layers,
  Percent,
  ShieldCheck,
  SlidersHorizontal,
  Wrench,
} from "lucide-react";

/**
 * Solutions page hero — slide registry.
 * Add new financing programs here; pair each id with i18n keys under
 * `solutions.hero.slides.{id}.*` (features, bestFor pills, copy).
 */
export type SolutionSlideId =
  | "conventional"
  | "dscr"
  | "fha100down"
  | "dpaAdvantage"
  | "fhaRepairEscrow"
  | "fha203k"
  | "vaRenovation"
  | "bank-statement"
  | "asset-utilization"
  | "reverse"
  | "jumbo"
  | "fha"
  | "va"
  | "heloc"
  | "renovation"
  | "new-construction";

export type SolutionFeatureIconId =
  | "percent"
  | "sliders"
  | "landmark"
  | "file-off"
  | "layers"
  | "building"
  | "dollar"
  | "home"
  | "wrench"
  | "gift"
  | "shield-check";

export const SOLUTION_FEATURE_ICONS: Record<SolutionFeatureIconId, LucideIcon> = {
  percent: Percent,
  sliders: SlidersHorizontal,
  landmark: Landmark,
  "file-off": FileX,
  layers: Layers,
  building: Building2,
  dollar: CircleDollarSign,
  home: Home,
  wrench: Wrench,
  gift: Gift,
  "shield-check": ShieldCheck,
};

export type SolutionSlideConfig = {
  id: SolutionSlideId;
  imageSrc: string;
  badgeEmoji: string;
  /** i18n key for bottom program badge label */
  badgeLabelKey: string;
  /** Feature cards — each uses `feature.{n}.title` and `feature.{n}.desc` i18n keys */
  features: readonly { icon: SolutionFeatureIconId }[];
  /** Best-for pills — each uses `bestFor.{n}` i18n key */
  bestForCount: number;
  ctaTo: string;
};

/** Active hero slides — extend this array as programs launch. */
export const SOLUTION_SLIDES: readonly SolutionSlideConfig[] = [
  {
    id: "conventional",
    imageSrc: "/images/solutions/conventional-hero.png",
    badgeEmoji: "🏠",
    badgeLabelKey: "solutions.hero.slides.conventional.badgeLabel",
    features: [{ icon: "percent" }, { icon: "sliders" }, { icon: "landmark" }],
    bestForCount: 4,
    ctaTo: "/contact",
  },
  {
    id: "dscr",
    imageSrc: "/images/solutions/dscr-investor-hero.png",
    badgeEmoji: "🏢",
    badgeLabelKey: "solutions.hero.slides.dscr.badgeLabel",
    features: [{ icon: "file-off" }, { icon: "layers" }, { icon: "building" }],
    bestForCount: 4,
    ctaTo: "/contact",
  },
  {
    id: "fha100down",
    imageSrc: "/images/solutions/fha-100-down-hero.png",
    badgeEmoji: "🏡",
    badgeLabelKey: "solutions.hero.slides.fha100down.badgeLabel",
    features: [{ icon: "dollar" }, { icon: "home" }, { icon: "wrench" }],
    bestForCount: 4,
    ctaTo: "/contact",
  },
  {
    id: "dpaAdvantage",
    imageSrc: "/images/solutions/dpa-advantage-hero.png",
    badgeEmoji: "💰",
    badgeLabelKey: "solutions.hero.slides.dpaAdvantage.badgeLabel",
    features: [{ icon: "gift" }, { icon: "shield-check" }, { icon: "layers" }],
    bestForCount: 4,
    ctaTo: "/contact",
  },
  {
    id: "fhaRepairEscrow",
    imageSrc: "/images/solutions/fha-repair-escrow-hero.png",
    badgeEmoji: "🔧",
    badgeLabelKey: "solutions.hero.slides.fhaRepairEscrow.badgeLabel",
    features: [{ icon: "wrench" }, { icon: "home" }, { icon: "shield-check" }],
    bestForCount: 4,
    ctaTo: "/contact",
  },
  {
    id: "fha203k",
    imageSrc: "/images/solutions/fha-203k-hero.png",
    badgeEmoji: "🏗",
    badgeLabelKey: "solutions.hero.slides.fha203k.badgeLabel",
    features: [{ icon: "layers" }, { icon: "home" }, { icon: "landmark" }],
    bestForCount: 4,
    ctaTo: "/contact",
  },
  {
    id: "vaRenovation",
    imageSrc: "/images/solutions/va-renovation-hero.png",
    badgeEmoji: "🎖",
    badgeLabelKey: "solutions.hero.slides.vaRenovation.badgeLabel",
    features: [{ icon: "percent" }, { icon: "layers" }, { icon: "home" }],
    bestForCount: 4,
    ctaTo: "/contact",
  },
  {
    id: "heloc",
    imageSrc: "/images/solutions/heloc-hero.png",
    badgeEmoji: "🏠",
    badgeLabelKey: "solutions.hero.slides.heloc.badgeLabel",
    features: [{ icon: "dollar" }, { icon: "shield-check" }, { icon: "sliders" }],
    bestForCount: 4,
    ctaTo: "/contact",
  },
  {
    id: "reverse",
    imageSrc: "/images/solutions/reverse-mortgage-hero.png",
    badgeEmoji: "🏡",
    badgeLabelKey: "solutions.hero.slides.reverse.badgeLabel",
    features: [{ icon: "sliders" }, { icon: "shield-check" }, { icon: "landmark" }],
    bestForCount: 4,
    ctaTo: "/contact",
  },
  {
    id: "jumbo",
    imageSrc: "/images/solutions/jumbo-hero.png",
    badgeEmoji: "🏛",
    badgeLabelKey: "solutions.hero.slides.jumbo.badgeLabel",
    features: [{ icon: "layers" }, { icon: "sliders" }, { icon: "shield-check" }],
    bestForCount: 4,
    ctaTo: "/contact",
  },
] as const;

export function getSolutionSlideFeatureKeys(
  slideId: SolutionSlideId,
  index: number,
): { titleKey: string; descKey: string } {
  const base = `solutions.hero.slides.${slideId}.feature.${index}`;
  return { titleKey: `${base}.title`, descKey: `${base}.desc` };
}

export function getSolutionSlideBestForKeys(
  slideId: SolutionSlideId,
  count: number,
): readonly string[] {
  return Array.from({ length: count }, (_, i) => `solutions.hero.slides.${slideId}.bestFor.${i}`);
}

export function getSolutionSlideKey(slideId: SolutionSlideId, field: string): string {
  return `solutions.hero.slides.${slideId}.${field}`;
}
