import {
  Banknote,
  Briefcase,
  ChevronRight,
  Home,
  Landmark,
  LineChart,
  MapPin,
  Medal,
  RefreshCw,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { LoanProductData } from "./LoanProductCard";
import { PROGRAM_DISPLAY_CATEGORY } from "../config/solutionsFlagshipConfig";
import { useLanguage } from "../i18n/LanguageContext";

/** Max bullets under highlight line */
const CARD_BULLET_CAP = 3;

const DISPLAY_CATEGORY_I18N = {
  purchase: "solutions.displayCategory.purchase",
  equity: "solutions.displayCategory.equity",
  specialty: "solutions.displayCategory.specialty",
} as const;

/** Insight callout: warm fill, soft radius, gold accent; `**phrase**` for emphasis */
function HighlightLine({ text, productId }: { text: string; productId: string }) {
  const hasMarkers = text.includes("**");
  const shell =
    "rounded-[3px] border border-slate-200/35 border-l-[3px] border-l-gold bg-[#FFFAF4] pl-2.5 pr-2 py-1.5 text-sm leading-[1.45] text-navy/[0.94] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]";

  if (!hasMarkers) {
    return <p className={`${shell} font-medium`}>{text}</p>;
  }

  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  const emphasisClass =
    productId === "fha" || productId === "va"
      ? "font-bold text-navy"
      : "font-semibold text-navy";

  return (
    <p className={`${shell} font-normal`}>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <span key={i} className={emphasisClass}>
              {part.slice(2, -2)}
            </span>
          );
        }
        return (
          <span key={i} className="text-navy/[0.88] font-medium">
            {part}
          </span>
        );
      })}
    </p>
  );
}

const LOAN_ICONS: Record<string, LucideIcon> = {
  conventional: Landmark,
  fha: Shield,
  va: Medal,
  usda: MapPin,
  refinance: RefreshCw,
  "cash-out-refinance": Banknote,
  heloc: LineChart,
  reverse: Home,
  "non-qm": Briefcase,
};

type LoanProductGridCardProps = {
  product: LoanProductData;
  guidedDimmed?: boolean;
  recentlyViewed?: boolean;
  scenarioHighlighted?: boolean;
  scenarioDimmed?: boolean;
};

export function LoanProductGridCard({
  product,
  guidedDimmed = false,
  recentlyViewed = false,
  scenarioHighlighted = false,
  scenarioDimmed = false,
}: LoanProductGridCardProps) {
  const { t } = useLanguage();
  const productTag = product.tags?.[0];
  const bullets = product.highlights.slice(0, CARD_BULLET_CAP);
  const Icon = LOAN_ICONS[product.id] ?? Landmark;
  const displayCategory = PROGRAM_DISPLAY_CATEGORY[product.id];
  const displayCategoryLabel = displayCategory ? t(DISPLAY_CATEGORY_I18N[displayCategory]) : null;
  const featured = Boolean(product.featuredCard);

  const dimmed = guidedDimmed || scenarioDimmed;

  const shell = (() => {
    if (scenarioHighlighted) {
      return "border-gold/50 shadow-[0_18px_52px_rgba(10,25,47,0.12)] bg-surface/30 ring-2 ring-gold/25";
    }
    if (dimmed) {
      return "opacity-[0.5] border-slate-200/75 shadow-[0_8px_28px_rgba(10,25,47,0.04)] bg-white hover:opacity-[0.68]";
    }
    if (featured) {
      return "border-slate-300/80 shadow-[0_14px_44px_rgba(10,25,47,0.09)] bg-surface/[0.18]";
    }
    return "border-slate-200/90 shadow-[0_12px_40px_rgba(10,25,47,0.06)] bg-white";
  })();

  const recentRing = recentlyViewed && !scenarioHighlighted ? "ring-2 ring-gold/35 ring-offset-2 ring-offset-white" : "";

  return (
    <Link
      to={`/solutions/programs/${product.id}`}
      data-program-id={product.id}
      className={`loan-grid-card group h-full min-h-0 w-full text-left rounded-[4px] border p-6 md:p-8 flex flex-col gap-4 transition-[box-shadow,border-color,background-color,transform,opacity] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none active:scale-[0.995] motion-reduce:active:scale-100 ${recentRing} ${shell} hover:-translate-y-1 hover:shadow-[0_20px_56px_rgba(10,25,47,0.11)] hover:border-gold/40 motion-reduce:hover:translate-y-0`}
    >
      <div className="loan-grid-card-accent" aria-hidden />

      <div className="flex flex-col gap-3.5 shrink-0">
        {displayCategoryLabel ? (
          <span className="loan-grid-category-badge">{displayCategoryLabel}</span>
        ) : null}

        <div className="h-[22px] shrink-0 flex items-start">
          {productTag ? (
            <span className="inline-flex w-fit items-center rounded-sm border border-slate-200/80 bg-surface px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600">
              {productTag}
            </span>
          ) : (
            <span
              className="invisible inline-flex w-fit items-center rounded-sm border border-transparent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]"
              aria-hidden
            >
              —
            </span>
          )}
        </div>

        <div className="flex gap-3 items-start min-h-[2.75rem]">
          <span className="mt-0.5 shrink-0 text-gold" aria-hidden>
            <Icon className="w-5 h-5 md:w-[1.35rem] md:h-[1.35rem]" strokeWidth={1.5} />
          </span>
          <h3 className="text-navy text-lg md:text-xl font-semibold leading-snug line-clamp-2 flex-1 min-w-0 tracking-[-0.02em]">
            {product.title}
          </h3>
        </div>

        <p className="text-slate-600 text-sm md:text-[15px] font-medium leading-snug line-clamp-3 min-h-[2.5rem]">
          {product.cardHook}
        </p>
      </div>

      <div className="shrink-0">
        <HighlightLine text={product.highlightLine} productId={product.id} />
      </div>

      <div className="flex flex-1 flex-col justify-end gap-3 min-h-0 w-full">
        <ul className="text-[13px] text-slate-500 font-medium leading-snug list-disc pl-4 space-y-1.5">
          {bullets.map((line, i) => (
            <li key={i} className="line-clamp-2">
              {line}
            </li>
          ))}
        </ul>

        <span className="loan-grid-cta flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-gold pt-1">
          {t("solutions.learnMore")}
          <ChevronRight
            className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
            strokeWidth={2}
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}
