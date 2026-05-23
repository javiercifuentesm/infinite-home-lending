import { ChevronDown } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import type { LoanProductData } from "./LoanProductCard";

type CollapsibleSectionProps = {
  sectionId: string;
  title: string;
  children: ReactNode;
};

function CollapsibleSection({ sectionId, title, children }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(false);
  const panelId = `${sectionId}-panel`;

  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        type="button"
        id={sectionId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left transition-colors hover:bg-surface/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-inset rounded-sm -mx-1 px-1"
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-navy">{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden min-h-0">
          <div
            id={panelId}
            role="region"
            aria-labelledby={sectionId}
            className={`pb-5 pt-0 ${!open ? "pointer-events-none" : ""}`}
            aria-hidden={!open}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

type LoanProductModalContentProps = {
  product: LoanProductData;
  titleId?: string;
};

/**
 * Layered modal body — header + at-a-glance + collapsible sections + CTA.
 * Identical structure for every loan type.
 */
export function LoanProductModalContent({ product, titleId }: LoanProductModalContentProps) {
  const { t } = useLanguage();
  const SECONDARY_CTA = { label: t("solutions.modal.secondaryCta"), to: "/contact" as const };

  const baseId = useId();
  const d = product.modalDetail;
  const { expanded } = product;

  const glanceRows: { label: string; value: string }[] = [
    { label: t("solutions.modal.bestFor"), value: d.atAGlance.bestFor },
  ];
  if (d.atAGlance.minCredit) {
    glanceRows.push({ label: t("solutions.modal.minCredit"), value: d.atAGlance.minCredit });
  }
  if (d.atAGlance.downPayment) {
    glanceRows.push({ label: t("solutions.modal.downPayment"), value: d.atAGlance.downPayment });
  }
  glanceRows.push({ label: t("solutions.modal.keyAdvantage"), value: d.atAGlance.keyAdvantage });

  return (
    <div className="space-y-8 pb-2">
      <header className="space-y-3">
        <h2 id={titleId} className="text-navy text-xl md:text-2xl font-semibold tracking-tight leading-snug">
          {product.title}
        </h2>
        <p className="text-base md:text-lg font-medium text-navy/90 leading-snug">{d.headline}</p>
        <p className="text-slate-600 leading-relaxed text-[15px] md:text-base font-light">{d.intro}</p>
      </header>

      <div className="rounded-[4px] border border-slate-200/90 bg-white p-5 md:p-6 shadow-[0_4px_24px_rgba(10,25,47,0.04)]">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">
          {t("solutions.modal.whenMakesSense")}
        </p>
        <ul className="text-sm text-slate-600 leading-relaxed font-light list-disc pl-5 space-y-2">
          {d.whenMakesSenseBullets.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-[4px] border border-slate-200/90 bg-surface/60 p-5 md:p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">{t("solutions.modal.atAGlance")}</p>
        <dl className="space-y-3.5">
          {glanceRows.map((row) => (
            <div key={row.label} className="grid grid-cols-1 sm:grid-cols-[minmax(0,7.5rem)_1fr] gap-1 sm:gap-4 sm:items-baseline">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500 shrink-0">{row.label}</dt>
              <dd className="text-sm text-slate-700 font-medium leading-snug">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="rounded-[4px] border border-slate-200/90">
        <CollapsibleSection sectionId={`${baseId}-overview`} title={t("solutions.modal.overview")}>
          <div className="space-y-4 text-sm text-slate-600 font-light leading-relaxed">
            {d.overviewParagraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection sectionId={`${baseId}-who`} title={t("solutions.modal.whoFor")}>
          <ul className="text-sm text-slate-600 font-medium leading-relaxed list-disc pl-5 space-y-2">
            {d.whoTypically.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </CollapsibleSection>

        <CollapsibleSection sectionId={`${baseId}-req`} title={t("solutions.modal.requirements")}>
          <ul className="text-sm text-slate-600 font-medium leading-relaxed list-disc pl-5 space-y-2">
            {d.keyRequirements.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </CollapsibleSection>

        <CollapsibleSection sectionId={`${baseId}-why`} title={t("solutions.modal.whyChoose")}>
          <ul className="text-sm text-slate-600 font-medium leading-relaxed list-disc pl-5 space-y-2">
            {d.whyClientsChoose.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </CollapsibleSection>

        <CollapsibleSection sectionId={`${baseId}-mind`} title={t("solutions.modal.keepInMind")}>
          <ul className="text-sm text-slate-600 font-medium leading-relaxed list-disc pl-5 space-y-2">
            {d.whatToKeepInMind.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </CollapsibleSection>
      </div>

      {product.id === "reverse" ? (
        <p className="text-sm text-slate-600 leading-relaxed font-light">
          <Link
            to="/tools/reverse-mortgage-planner"
            className="font-semibold text-navy underline decoration-gold/40 hover:text-gold"
          >
            {t("solutions.modal.reverseLink")}
          </Link>{" "}
          {t("solutions.modal.reversePost")}
        </p>
      ) : null}
      {product.id === "heloc" ? (
        <p className="text-sm text-slate-600 leading-relaxed font-light">
          <Link
            to="/tools/heloc-planner"
            className="font-semibold text-navy underline decoration-gold/40 hover:text-gold"
          >
            {t("solutions.modal.helocLink")}
          </Link>{" "}
          {t("solutions.modal.helocPost")}
        </p>
      ) : null}
      {product.id === "conventional" || product.id === "fha" ? (
        <>
          <p className="text-sm text-slate-600 leading-relaxed font-light">
            <Link
              to="/tools/conventional-vs-fha"
              className="font-semibold text-navy underline decoration-gold/40 hover:text-gold"
            >
              {t("solutions.modal.fhaLink")}
            </Link>{" "}
            {t("solutions.modal.fhaPost")}
          </p>
          <p className="text-sm text-slate-600 leading-relaxed font-light">
            {t("solutions.modal.selfEmployedPre")}{" "}
            <Link
              to="/tools/self-employed-qualifier"
              className="font-semibold text-navy underline decoration-gold/40 hover:text-gold"
            >
              {t("solutions.modal.selfEmployedLink")}
            </Link>{" "}
            {t("solutions.modal.selfEmployedPost")}
          </p>
        </>
      ) : null}

      <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-1">
        <Link
          to={expanded.primaryCta.to}
          className="btn-gold inline-flex justify-center text-center min-h-[44px] items-center"
        >
          {expanded.primaryCta.label}
        </Link>
        <Link
          to={SECONDARY_CTA.to}
          className="btn-secondary inline-flex justify-center text-center min-h-[44px] items-center"
        >
          {SECONDARY_CTA.label}
        </Link>
      </div>

      <p className="text-sm text-slate-400 font-light leading-relaxed border-t border-slate-100 pt-6">
        {expanded.reassurance}
      </p>
    </div>
  );
}
