import {
  ArrowRight,
  Banknote,
  Check,
  ChevronDown,
  CircleDollarSign,
  Hammer,
  Home,
  LineChart,
  Shield,
  Sparkles,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import type { LoanProductData } from "../LoanProductCard";
import { SarahOrb } from "../sarah/SarahOrb";
import { mergeFitItems, getHowItWorksStepMeta, splitBenefitLine } from "./loanProgramUtils";

const FIT_ICONS: LucideIcon[] = [Home, Shield, Sparkles, TrendingUp, CircleDollarSign, Hammer, Banknote];

const BENEFIT_ICONS: LucideIcon[] = [
  CircleDollarSign,
  Home,
  Zap,
  Hammer,
  TrendingUp,
  LineChart,
  Shield,
  Sparkles,
];

type FaqItem = {
  id: string;
  title: string;
  content: ReactNode;
};

function FaqAccordionItem({ item, defaultOpen }: { item: FaqItem; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(Boolean(defaultOpen));
  const panelId = `${item.id}-panel`;

  return (
    <div className="lpd-faq-item">
      <button
        type="button"
        id={item.id}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="lpd-faq-trigger"
      >
        <span className="lpd-faq-title">{item.title}</span>
        <ChevronDown
          className={`lpd-faq-chevron h-5 w-5 ${open ? "lpd-faq-chevron--open" : ""}`}
          aria-hidden
        />
      </button>
      <div className={`lpd-faq-panel ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="lpd-faq-panel-inner">
          <div
            id={panelId}
            role="region"
            aria-labelledby={item.id}
            className="lpd-faq-body"
            aria-hidden={!open}
          >
            {item.content}
          </div>
        </div>
      </div>
    </div>
  );
}

function openSarahWidget() {
  window.dispatchEvent(new CustomEvent("ihl:open-sarah"));
}

type LoanProgramDetailSectionsProps = {
  product: LoanProductData;
};

export function LoanProgramDetailSections({ product }: LoanProgramDetailSectionsProps) {
  const { t } = useLanguage();
  const baseId = useId();
  const d = product.modalDetail;
  const { expanded } = product;

  const fitItems = mergeFitItems(d.whenMakesSenseBullets, d.whoTypically);
  const benefits = expanded.benefits.length > 0 ? expanded.benefits : d.whyClientsChoose;

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

  const faqItems: FaqItem[] = [
    {
      id: `${baseId}-overview`,
      title: t("solutions.modal.overview"),
      content: (
        <div>
          {d.overviewParagraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      ),
    },
    {
      id: `${baseId}-who`,
      title: t("solutions.modal.whoFor"),
      content: (
        <ul>
          {d.whoTypically.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      ),
    },
    {
      id: `${baseId}-req`,
      title: t("solutions.modal.requirements"),
      content: (
        <ul>
          {d.keyRequirements.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      ),
    },
    {
      id: `${baseId}-why`,
      title: t("solutions.modal.whyChoose"),
      content: (
        <ul>
          {d.whyClientsChoose.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      ),
    },
    {
      id: `${baseId}-mind`,
      title: t("solutions.modal.keepInMind"),
      content: (
        <ul>
          {d.whatToKeepInMind.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <>
      {/* Section 1 — Program Fit Check */}
      {fitItems.length > 0 ? (
        <section className="lpd-section lpd-section--compact-top border-b border-slate-100 bg-surface/30">
          <div className="max-w-7xl mx-auto px-6">
            <header className="max-w-2xl mx-auto text-center mb-10 lg:mb-12">
              <h2 className="type-editorial-section-title text-[1.75rem] sm:text-3xl lg:text-[2.25rem] text-navy leading-[1.08]">
                {t("solutions.detail.fitTitle")}
              </h2>
            </header>
            <ul className="lpd-fit-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5 max-w-6xl mx-auto">
              {fitItems.map((line, index) => {
                const Icon = FIT_ICONS[index % FIT_ICONS.length] ?? Check;
                return (
                  <li key={line}>
                    <div className="lpd-fit-badge">
                      <span className="lpd-fit-icon" aria-hidden>
                        <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                      </span>
                      <span className="lpd-fit-text">{line}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Section 2 — Key Benefits */}
      {benefits.length > 0 ? (
        <section className="lpd-section border-b border-slate-100 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <header className="max-w-2xl mx-auto text-center mb-10 lg:mb-12">
              <h2 className="type-editorial-section-title text-[1.75rem] sm:text-3xl lg:text-[2.25rem] text-navy leading-[1.08]">
                {t("solutions.detail.benefitsTitle")}
              </h2>
            </header>
            <ul className="lpd-benefit-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 max-w-6xl mx-auto">
              {benefits.map((line, index) => {
                const { title, description } = splitBenefitLine(line);
                const Icon = BENEFIT_ICONS[index % BENEFIT_ICONS.length] ?? Sparkles;
                return (
                  <li key={`${index}-${line.slice(0, 24)}`}>
                    <article className="lpd-benefit-card">
                      <div className="lpd-benefit-icon-wrap" aria-hidden>
                        <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} />
                      </div>
                      <h3 className="lpd-benefit-title">{title}</h3>
                      {description ? <p className="lpd-benefit-desc">{description}</p> : null}
                    </article>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Section 3 — How It Works */}
      {expanded.howItWorks.length > 0 ? (
        <section className="lpd-section lpd-section--process border-b border-slate-100 bg-navy relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(197,160,89,0.07),transparent_52%)]"
            aria-hidden
          />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <header className="max-w-[43.75rem] mx-auto text-center mb-12 lg:mb-20">
              <h2 className="type-editorial-section-title text-[1.75rem] sm:text-3xl lg:text-[2.35rem] text-white leading-[1.08]">
                {t("solutions.detail.howItWorksTitle")}
              </h2>
              <p className="mt-5 type-body text-white/65 text-[1.0625rem] leading-[1.72] font-light">
                {t("solutions.detail.howItWorksSubtitle")}
              </p>
            </header>
            <ol className="lpd-process-flow" aria-label={t("solutions.detail.howItWorksTitle")}>
              {expanded.howItWorks.map((step, index) => {
                const { Icon, supportKey } = getHowItWorksStepMeta(step);
                return (
                  <li key={step} className="lpd-process-group">
                    <article className="lpd-process-step">
                      <span className="lpd-process-icon-wrap" aria-hidden>
                        <Icon className="h-7 w-7 md:h-[1.875rem] md:w-[1.875rem]" strokeWidth={1.45} />
                      </span>
                      <span className="lpd-process-num">{String(index + 1).padStart(2, "0")}</span>
                      <h3 className="lpd-process-title">{step}</h3>
                      <div className="lpd-process-divider" aria-hidden />
                      <p className="lpd-process-desc">{t(supportKey)}</p>
                    </article>
                    {index < expanded.howItWorks.length - 1 ? (
                      <div className="lpd-process-connector" aria-hidden>
                        <span className="lpd-process-connector-line" />
                        <span className="lpd-process-connector-node" />
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      ) : null}

      {/* Section 4 — Program Highlights */}
      <section className="lpd-section border-b border-slate-100 bg-navy relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_72%,rgba(197,160,89,0.06),transparent_55%)]"
          aria-hidden
        />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <header className="max-w-2xl mx-auto text-center mb-10 lg:mb-12">
            <h2 className="type-editorial-section-title text-[1.75rem] sm:text-3xl lg:text-[2.25rem] text-white leading-[1.08]">
              {t("solutions.detail.highlightsTitle")}
            </h2>
          </header>
          <dl className="lpd-stat-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 max-w-5xl mx-auto">
            {glanceRows.map((row) => (
              <div key={row.label} className="lpd-stat-card">
                <dt className="lpd-stat-label">{row.label}</dt>
                <dd className="lpd-stat-value m-0">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Tool cross-links — preserved from modal */}
      {product.id === "reverse" ||
      product.id === "heloc" ||
      product.id === "conventional" ||
      product.id === "fha" ? (
        <section className="lpd-section border-b border-slate-100 bg-white !py-10 lg:!py-12">
          <div className="max-w-3xl mx-auto px-6 space-y-4 text-sm text-slate-600 leading-relaxed font-light">
            {product.id === "reverse" ? (
              <p>
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
              <p>
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
                <p>
                  <Link
                    to="/tools/conventional-vs-fha"
                    className="font-semibold text-navy underline decoration-gold/40 hover:text-gold"
                  >
                    {t("solutions.modal.fhaLink")}
                  </Link>{" "}
                  {t("solutions.modal.fhaPost")}
                </p>
                <p>
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
          </div>
        </section>
      ) : null}

      {/* Section 5 — FAQ / Program Details */}
      <section className="lpd-section border-b border-slate-100 bg-surface/25">
        <div className="max-w-3xl mx-auto px-6">
          <header className="text-center mb-10 lg:mb-12">
            <h2 className="type-editorial-section-title text-[1.75rem] sm:text-3xl lg:text-[2.25rem] text-navy leading-[1.08]">
              {t("solutions.detail.faqTitle")}
            </h2>
          </header>
          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <FaqAccordionItem key={item.id} item={item} defaultOpen={index === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 6 — Sarah Recommendation */}
      <section className="lpd-section border-b border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,20rem)] gap-10 lg:gap-14 items-center">
            <div>
              <p className="font-heading text-xl sm:text-2xl text-navy font-semibold tracking-[-0.02em] leading-snug mb-4">
                {expanded.reassurance}
              </p>
              <button
                type="button"
                onClick={openSarahWidget}
                className="btn-gold inline-flex items-center justify-center gap-2 min-h-[44px] mt-2"
              >
                {t("sarah.askSarah")}
                <ArrowRight size={16} strokeWidth={2} aria-hidden />
              </button>
            </div>
            <aside className="lpd-sarah-card text-center">
              <div className="lpd-sarah-orb-wrap">
                <SarahOrb size="md" static showOnlineDot />
              </div>
              <p className="font-heading text-base text-navy font-semibold tracking-[-0.01em] mb-1">
                Sarah
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold mb-3">
                IHL Mortgage Concierge
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">{t("sarah.disclaimer")}</p>
            </aside>
          </div>
        </div>
      </section>

      {/* Section 7 — Premium CTA */}
      <section className="lpd-section lpd-section--cta relative overflow-hidden bg-navy">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(197,160,89,0.07),transparent_52%)]"
          aria-hidden
        />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="type-section-title-lg text-white mb-6 text-[2rem] sm:text-4xl lg:text-[2.75rem] leading-[1.15] tracking-[-0.03em]">
              {d.headline}
            </h2>
            <p className="font-sans text-lg sm:text-xl text-slate-400 mb-10 sm:mb-12 max-w-[40rem] mx-auto leading-[1.65]">
              {expanded.reassurance}
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center">
              <Link
                to={expanded.primaryCta.to}
                className="btn-gold inline-flex items-center justify-center gap-2.5 shadow-[0_10px_40px_rgba(197,160,89,0.28)] hover:shadow-[0_18px_52px_rgba(197,160,89,0.45)] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 transition-all duration-300 min-h-[44px]"
              >
                {expanded.primaryCta.label}
                <ArrowRight size={18} strokeWidth={2} aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
