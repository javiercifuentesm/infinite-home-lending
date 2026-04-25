import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

export type LoanCategoryId = "purchase" | "refinance" | "equity";

/** Layered modal content — same shape for every loan product */
export type LoanModalDetail = {
  headline: string;
  /** 1–2 sentences; not the full overview */
  intro: string;
  /** Decision-guiding bullets (modal only) */
  whenMakesSenseBullets: string[];
  atAGlance: {
    bestFor: string;
    /** Omit row when undefined */
    minCredit?: string;
    /** Omit row when undefined */
    downPayment?: string;
    keyAdvantage: string;
  };
  /** Overview section — short paragraphs, no wall of text */
  overviewParagraphs: string[];
  whoTypically: string[];
  keyRequirements: string[];
  whyClientsChoose: string[];
  whatToKeepInMind: string[];
};

export type LoanProductData = {
  id: string;
  /** Used for section grouping on the Loan Solutions page */
  category: LoanCategoryId;
  /** Small labels shown on the collapsed card (e.g. “Most Popular”) */
  tags?: string[];
  title: string;
  shortDescription: string;
  /** Outcome-driven hook for grid cards */
  cardHook: string;
  /** Grid highlight; use **phrase** for editorial emphasis where needed */
  highlightLine: string;
  highlights: string[];
  expanded: {
    fullDescription: string;
    whoFor: string[];
    benefits: string[];
    howItWorks: string[];
    reassurance: string;
    primaryCta: { label: string; to: string };
  };
  /** Structured copy for the Loan Solutions modal */
  modalDetail: LoanModalDetail;
  /** Subtle emphasis on grid (1–2 flagship cards) */
  featuredCard?: boolean;
};

const SECONDARY_CTA = { label: "Speak with an advisor", to: "/contact" as const };

type LoanProductCardProps = {
  product: LoanProductData;
  isExpanded: boolean;
  onToggle: () => void;
};

const COLLAPSED_HIGHLIGHTS = 3;

export function LoanProductCard({ product, isExpanded, onToggle }: LoanProductCardProps) {
  const { title, cardHook, highlights, expanded, tags } = product;
  const collapsedHighlights = highlights.slice(0, COLLAPSED_HIGHLIGHTS);

  return (
    <div className="rounded-[4px] border border-slate-200/90 bg-white shadow-[0_12px_40px_rgba(10,25,47,0.07)] overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left p-6 md:p-8 flex flex-col gap-4 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-none"
        aria-expanded={isExpanded}
        aria-controls={`loan-product-panel-${product.id}`}
        id={`loan-product-trigger-${product.id}`}
      >
        {tags && tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span
                key={`${tag}-${i}`}
                className="inline-flex items-center rounded-sm border border-slate-200/90 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-navy text-xl md:text-2xl font-semibold tracking-tight pr-2 leading-snug">{title}</h2>
          <ChevronDown
            className={`shrink-0 w-5 h-5 text-slate-400 transition-transform duration-300 mt-1 ${isExpanded ? "rotate-180" : ""}`}
            aria-hidden
          />
        </div>
        <p className="text-slate-600 leading-relaxed text-base font-light">{cardHook}</p>
        <ul className="text-sm text-slate-500 font-medium leading-relaxed list-disc pl-5 space-y-2">
          {collapsedHighlights.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
        <span className="text-gold text-[11px] font-bold uppercase tracking-[0.14em] pt-1">
          {isExpanded ? "Hide details" : "Explore this option"}
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] border-t border-slate-100 ${
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden min-h-0">
          <div
            id={`loan-product-panel-${product.id}`}
            role="region"
            aria-labelledby={`loan-product-trigger-${product.id}`}
            className={`px-6 md:px-8 pb-8 pt-6 md:pt-8 space-y-8 ${!isExpanded ? "pointer-events-none select-none" : ""}`}
            aria-hidden={!isExpanded}
          >
            <p className="text-slate-600 leading-relaxed text-lg font-light">{expanded.fullDescription}</p>

            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Who it&apos;s for</h3>
              <ul className="text-sm text-slate-500 font-medium leading-relaxed list-disc pl-5 space-y-2">
                {expanded.whoFor.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Benefits</h3>
              <ul className="text-sm text-slate-500 font-medium leading-relaxed list-disc pl-5 space-y-2">
                {expanded.benefits.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">How it works</h3>
              <ol className="text-sm text-slate-500 font-medium leading-relaxed list-decimal pl-5 space-y-2">
                {expanded.howItWorks.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <Link to={expanded.primaryCta.to} className="btn-gold inline-flex justify-center text-center min-h-[44px] items-center">
                {expanded.primaryCta.label}
              </Link>
              <Link to={SECONDARY_CTA.to} className="btn-secondary inline-flex justify-center text-center min-h-[44px] items-center">
                {SECONDARY_CTA.label}
              </Link>
            </div>

            <p className="text-sm text-slate-400 font-light leading-relaxed">{expanded.reassurance}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
