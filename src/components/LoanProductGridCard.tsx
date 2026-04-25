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
import type { LoanCategoryId, LoanProductData } from "./LoanProductCard";

/** Max bullets under highlight line */
const CARD_BULLET_CAP = 3;

const CATEGORY_POSITION: Record<LoanCategoryId, string> = {
  purchase: "Purchase",
  refinance: "Refinance",
  equity: "Home equity",
};

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
  isActive: boolean;
  onSelect: () => void;
  /** Softer treatment when guided path doesn’t prioritize this product */
  guidedDimmed?: boolean;
  /** Brief emphasis after modal closes */
  recentlyViewed?: boolean;
};

/**
 * Grid tile — flex column, h-full; CTA pinned to bottom via flex-1 + justify-end.
 */
export function LoanProductGridCard({
  product,
  isActive,
  onSelect,
  guidedDimmed = false,
  recentlyViewed = false,
}: LoanProductGridCardProps) {
  const productTag = product.tags?.[0];
  const bullets = product.highlights.slice(0, CARD_BULLET_CAP);
  const Icon = LOAN_ICONS[product.id] ?? Landmark;
  const categoryLabel = CATEGORY_POSITION[product.category];
  const featured = Boolean(product.featuredCard);

  const inactiveShell = (() => {
    if (guidedDimmed) {
      return "opacity-[0.56] border-slate-200/75 shadow-[0_8px_28px_rgba(10,25,47,0.04)] bg-white hover:opacity-[0.72] hover:border-slate-200/90";
    }
    if (featured) {
      return "border-slate-300/80 shadow-[0_12px_40px_rgba(10,25,47,0.09)] bg-surface/[0.22]";
    }
    return "border-slate-200/90 shadow-[0_10px_36px_rgba(10,25,47,0.06)] bg-white";
  })();

  const recentRing = recentlyViewed && !isActive ? "ring-2 ring-gold/35 ring-offset-2 ring-offset-white" : "";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group h-full min-h-0 w-full text-left rounded-[4px] border p-6 md:p-7 flex flex-col gap-4 transition-[box-shadow,border-color,background-color,transform,opacity] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none active:scale-[0.995] motion-reduce:active:scale-100 ${recentRing} ${
        isActive
          ? "border-gold shadow-[0_14px_48px_rgba(10,25,47,0.13)] bg-surface/40 ring-1 ring-gold/15 hover:-translate-y-0.5 hover:shadow-[0_18px_56px_rgba(10,25,47,0.14)] motion-reduce:hover:translate-y-0 z-[1]"
          : `${inactiveShell} hover:-translate-y-1 hover:shadow-[0_18px_52px_rgba(10,25,47,0.11)] hover:border-gold/40 motion-reduce:hover:translate-y-0`
      }`}
    >
      {/* Header: category → tag → title → description (hook) */}
      <div className="flex flex-col gap-3.5 shrink-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{categoryLabel}</p>

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

        <div className="flex gap-2.5 items-start min-h-[2.75rem]">
          <span className="mt-0.5 shrink-0 text-gold" aria-hidden>
            <Icon className="w-[18px] h-[18px] md:w-5 md:h-5" strokeWidth={1.5} />
          </span>
          <h3 className="text-navy text-base md:text-lg font-semibold leading-snug line-clamp-2 flex-1 min-w-0">
            {product.title}
          </h3>
        </div>

        <p className="text-slate-600 text-sm font-medium leading-snug line-clamp-3 min-h-[2.5rem]">
          {product.cardHook}
        </p>
      </div>

      {/* Highlight — same vertical rhythm as gap-4 from header block */}
      <div className="shrink-0">
        <HighlightLine text={product.highlightLine} productId={product.id} />
      </div>

      {/* Supporting points + CTA — fills remaining height; CTA aligns across row */}
      <div className="flex flex-1 flex-col justify-end gap-2.5 min-h-0 w-full">
        <ul className="text-[13px] text-slate-500 font-medium leading-snug list-disc pl-4 space-y-1.5">
          {bullets.map((line, i) => (
            <li key={i} className="line-clamp-2">
              {line}
            </li>
          ))}
        </ul>

        <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold pt-0.5">
          Explore this option
          <ChevronRight
            className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
            strokeWidth={2}
            aria-hidden
          />
        </span>
      </div>
    </button>
  );
}
