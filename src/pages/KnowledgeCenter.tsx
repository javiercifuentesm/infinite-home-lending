import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Calculator,
  ChevronDown,
  Home,
  Layers,
  MessageCircle,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";
import { PageContainer } from "../components/PageContainer";
import {
  PAGE_CONTENT_RAIL_CLASS,
  PAGE_SECTION_HERO_PAD_CLASS,
} from "../constants/layout";
import {
  getFeaturedMisunderstandings,
  getKnowledgeRoutes,
  KNOWLEDGE_ROUTE_ORDER,
  type KnowledgeRouteId,
  searchKnowledgeCenter,
} from "../data/knowledgeCenterRoutes";
import { useLanguage } from "../i18n/LanguageContext";
import { usePageMetadata } from "../hooks/usePageMetadata";

const ENTRY_IMAGE_BY_ROUTE: Record<KnowledgeRouteId, { src: string; objectClass: string }> = {
  "start-here": { src: "/knowledge/knowledge-start-here.png", objectClass: "object-[center_38%]" },
  buying: { src: "/knowledge/knowledge-buying-home.png", objectClass: "object-[center_35%]" },
  numbers: { src: "/knowledge/knowledge-numbers.png", objectClass: "object-[center_40%]" },
  "loan-options": { src: "/knowledge/knowledge-loan-options.png", objectClass: "object-[center_35%]" },
  "refinance-equity": { src: "/knowledge/knowledge-refinance-equity.png", objectClass: "object-[center_35%]" },
  "quick-answers": { src: "/knowledge/knowledge-quick-answers.png", objectClass: "object-[center_40%]" },
};

const ROUTE_ICONS: Record<
  KnowledgeRouteId,
  typeof Home
> = {
  "start-here": Sparkles,
  buying: Home,
  numbers: Calculator,
  "loan-options": Layers,
  "refinance-equity": RefreshCw,
  "quick-answers": MessageCircle,
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const cardHover =
  "transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_28px_64px_-20px_rgba(10,25,47,0.15)] hover:border-gold/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2";

/** Curated FAQ count before “View more” (spec: 4–6). */
const FAQ_INITIAL = 6;

/** Split expandable copy on blank lines for readable short paragraphs */
function learnMoreParagraphs(text: string): string[] {
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Full-bleed background band inside the guided topic rail (visual rhythm). */
function KnowledgeTopicBand({
  bgClass,
  children,
  className = "",
}: {
  bgClass: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen ${bgClass} ${className}`}
    >
      <div className={`${PAGE_CONTENT_RAIL_CLASS} mx-auto`}>{children}</div>
    </div>
  );
}

export default function KnowledgeCenter() {
  const { t, lang } = useLanguage();
  const ROUTES = getKnowledgeRoutes(lang);
  const MISUNDERSTANDINGS = getFeaturedMisunderstandings(lang);
  const suggestionChips: { label: string; routeId: KnowledgeRouteId }[] = [
    { label: t("knowledge.chips.firstTime"), routeId: "buying" },
    { label: t("knowledge.chips.credit"), routeId: "numbers" },
    { label: t("knowledge.chips.downPayment"), routeId: "buying" },
    { label: t("knowledge.chips.refinancing"), routeId: "refinance-equity" },
  ];

  const [selectedRoute, setSelectedRoute] = useState<KnowledgeRouteId | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [faqShowAll, setFaqShowAll] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFaqShowAll(false);
  }, [selectedRoute]);

  usePageMetadata({
    title: t("knowledge.meta.title"),
    description: t("knowledge.meta.description"),
    canonical: "https://www.infinitehomelending.com/knowledge-center",
  });

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const searchResults = useMemo(
    () => searchKnowledgeCenter(searchQuery, 10, lang),
    [searchQuery, lang]
  );

  const route = selectedRoute ? ROUTES[selectedRoute] : null;

  /** Reset to main entry (hero + six paths). */
  function resetToMainMenu() {
    setSelectedRoute(null);
    setSearchOpen(false);
    setSearchQuery("");
    requestAnimationFrame(() => {
      document.getElementById("guided-entry")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /**
   * @param scrollToModule - false when switching path via sticky bar (keep scroll position).
   */
  function selectRoute(id: KnowledgeRouteId, scrollToModule = true) {
    setSelectedRoute(id);
    setSearchOpen(false);
    setSearchQuery("");
    if (scrollToModule) {
      requestAnimationFrame(() => {
        document.getElementById("guided-content")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  function applyChip(routeId: KnowledgeRouteId) {
    selectRoute(routeId, true);
  }

  /** Sticky path switch — same page, no scroll jump */
  function switchPathOnly(id: KnowledgeRouteId) {
    selectRoute(id, false);
  }

  return (
    <PageContainer className="min-h-screen bg-[#fafbfc] pb-0">
      {/* —— Hero —— */}
      <section
        id="guided-entry"
        className={`relative border-b border-slate-200/60 overflow-hidden ${PAGE_SECTION_HERO_PAD_CLASS} bg-gradient-to-b from-white via-white to-surface/50 scroll-mt-36`}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-40 top-0 h-[28rem] w-[28rem] rounded-full bg-gold/[0.06] blur-3xl" />
          <div className="absolute -left-32 bottom-0 h-[22rem] w-[22rem] rounded-full bg-navy/[0.04] blur-3xl" />
        </div>

        <div className={`relative ${PAGE_CONTENT_RAIL_CLASS}`}>
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="text-center max-w-3xl mx-auto mb-10 lg:mb-12"
          >
            <motion.p
              variants={fadeUp}
              className="type-eyebrow text-gold tracking-[0.22em] mb-5"
            >
              {t("knowledge.eyebrow")}
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="font-heading text-navy text-[2.35rem] sm:text-5xl lg:text-[3.25rem] leading-[1.06] tracking-[-0.035em] font-semibold mb-5"
            >
              {t("knowledge.title")}
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="font-sans text-lg sm:text-xl text-slate-600 font-light leading-relaxed"
            >
              {t("knowledge.subtitle")}
            </motion.p>
          </motion.div>

          {/* Search */}
          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            className="max-w-2xl mx-auto mb-8 relative z-20"
            ref={searchWrapRef}
          >
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none"
                aria-hidden
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                placeholder={t("knowledge.search.placeholder")}
                className="w-full rounded-2xl border border-slate-200/90 bg-white pl-12 pr-4 py-4 text-[15px] text-navy shadow-[0_8px_40px_rgba(10,25,47,0.06)] placeholder:text-slate-400 focus:border-gold/40 focus:ring-2 focus:ring-gold/20 focus:outline-none transition-shadow"
                autoComplete="off"
                aria-label={t("knowledge.search.placeholder")}
              />
            </div>
            {searchOpen && searchQuery.trim().length >= 2 && (
              <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-slate-200/90 bg-white shadow-[0_24px_64px_-12px_rgba(10,25,47,0.18)] max-h-[min(70vh,22rem)] overflow-y-auto z-30">
                {searchResults.length === 0 ? (
                  <p className="px-4 py-4 text-sm text-slate-500">{t("knowledge.search.noResults")}</p>
                ) : (
                  <ul className="py-2">
                    {searchResults.map((hit) => (
                      <li key={hit.id}>
                        <button
                          type="button"
                          onClick={() => selectRoute(hit.routeId, true)}
                          className="w-full text-left px-4 py-3 hover:bg-surface/80 transition-colors"
                        >
                          <span className="block font-sans text-[13px] font-semibold uppercase tracking-[0.1em] text-gold/90 mb-0.5">
                            {hit.kind === "route"
                              ? t("knowledge.search.kind.route")
                              : hit.kind === "article"
                                ? t("knowledge.search.kind.article")
                                : t("knowledge.search.kind.faq")}
                          </span>
                          <span className="block text-[15px] text-navy font-medium leading-snug">{hit.title}</span>
                          {hit.subtitle ? (
                            <span className="block text-[13px] text-slate-500 mt-1 line-clamp-2">{hit.subtitle}</span>
                          ) : null}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </motion.div>

          {/* Chips */}
          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12 lg:mb-14"
          >
            {suggestionChips.map((chip, chipIdx) => (
              <button
                key={`${chip.routeId}-${chipIdx}`}
                type="button"
                onClick={() => applyChip(chip.routeId)}
                className="rounded-full border border-slate-200/90 bg-white px-4 py-2 text-[13px] font-medium text-navy/80 shadow-sm hover:border-gold/40 hover:bg-white hover:shadow-md transition-all duration-200"
              >
                {chip.label}
              </button>
            ))}
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="initial"
            animate="animate"
            className="mx-auto mb-10 max-w-2xl text-center text-[13px] leading-relaxed text-slate-600"
          >
            <span className="font-semibold text-navy">{t("knowledge.tools.intro")}</span>{" "}
            <Link to="/tools/true-cost-of-waiting" className="font-medium text-gold underline decoration-gold/40 hover:text-navy">
              {t("knowledge.tools.waitingLink")}
            </Link>{" "}
            {t("knowledge.tools.waitingDesc")}{" "}
            <Link to="/tools/buy-vs-rent" className="font-medium text-gold underline decoration-gold/40 hover:text-navy">
              {t("knowledge.tools.buyRentLink")}
            </Link>{" "}
            {t("knowledge.tools.buyRentDesc")}{" "}
            <Link to="/tools/conventional-vs-fha" className="font-medium text-gold underline decoration-gold/40 hover:text-navy">
              {t("knowledge.tools.fhaLink")}
            </Link>{" "}
            {t("knowledge.tools.fhaDesc")}
          </motion.p>

          <motion.p
            variants={fadeUp}
            initial="initial"
            animate="animate"
            className="mx-auto mb-10 max-w-2xl text-center text-[13px] leading-relaxed text-slate-600"
          >
            <span className="font-semibold text-navy">{t("knowledge.tools.loanTypes")}</span>{" "}
            <Link to="/tools/conventional-vs-fha" className="font-medium text-gold underline decoration-gold/40 hover:text-navy">
              {t("knowledge.tools.fhaCalcLink")}
            </Link>{" "}
            {t("knowledge.tools.fhaCalcDesc")}
          </motion.p>

          <motion.p
            variants={fadeUp}
            initial="initial"
            animate="animate"
            className="mx-auto mb-10 max-w-2xl text-center text-[13px] leading-relaxed text-slate-600"
          >
            <span className="font-semibold text-navy">{t("knowledge.tools.refiEquity")}</span>{" "}
            <Link to="/tools/principal-accelerator" className="font-medium text-gold underline decoration-gold/40 hover:text-navy">
              {t("knowledge.tools.acceleratorLink")}
            </Link>{" "}
            {t("knowledge.tools.acceleratorDesc")}{" "}
            <Link to="/tools/heloc-planner" className="font-medium text-gold underline decoration-gold/40 hover:text-navy">
              {t("knowledge.tools.helocLink")}
            </Link>{" "}
            {t("knowledge.tools.helocDesc")}
          </motion.p>

          <motion.p
            variants={fadeUp}
            initial="initial"
            animate="animate"
            className="mx-auto mb-10 max-w-2xl text-center text-[13px] leading-relaxed text-slate-600"
          >
            <span className="font-semibold text-navy">{t("knowledge.tools.reverse")}</span>{" "}
            <Link to="/tools/reverse-mortgage-planner" className="font-medium text-gold underline decoration-gold/40 hover:text-navy">
              {t("knowledge.tools.reverseLink")}
            </Link>{" "}
            {t("knowledge.tools.reverseDesc")}
          </motion.p>

          {/* 6 entry cards */}
          <motion.ul
            variants={stagger}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6 list-none p-0 m-0 max-w-6xl mx-auto"
          >
            {KNOWLEDGE_ROUTE_ORDER.map((rid, idx) => {
              const r = ROUTES[rid];
              const img = ENTRY_IMAGE_BY_ROUTE[rid];
              const Icon = ROUTE_ICONS[rid];
              return (
                <motion.li key={rid} variants={fadeUp} className="min-w-0">
                  <button
                    type="button"
                    onClick={() => selectRoute(rid)}
                    className={`group w-full flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white text-left shadow-[0_12px_48px_rgba(10,25,47,0.07)] ${cardHover}`}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img
                        src={img.src}
                        alt=""
                        className={`h-full w-full object-cover ${img.objectClass}`}
                        loading={idx < 3 ? "eager" : "lazy"}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-navy shadow-md backdrop-blur-sm">
                        <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-6 lg:p-7">
                      <span className="font-heading text-xl font-semibold text-navy mb-2 leading-snug">
                        {r.label}
                      </span>
                      <span className="font-sans text-[14px] sm:text-[15px] text-slate-600 leading-[1.55]">
                        {r.cardDescription}
                      </span>
                      <span className="mt-5 inline-flex items-center gap-2 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
                        {t("knowledge.card.explore")}
                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </button>
                </motion.li>
              );
            })}
          </motion.ul>
        </div>
      </section>

      {/* —— Guided content engine —— */}
      {route && selectedRoute ? (
        <div
          id="guided-content"
          className="scroll-mt-28 sm:scroll-mt-32 overflow-x-hidden border-b border-slate-200/60 bg-[#F7F9FC]"
        >
          {/* Breadcrumb + change topic */}
          <div className="border-b border-slate-100/90 bg-white">
            <div className={`${PAGE_CONTENT_RAIL_CLASS} py-4 lg:py-5`}>
              <nav className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between gap-y-3" aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] sm:text-sm font-sans">
                  <li>
                    <button
                      type="button"
                      onClick={resetToMainMenu}
                      className="text-slate-500 hover:text-navy transition-colors duration-200 underline-offset-2 hover:underline"
                    >
                      {t("knowledge.breadcrumb.home")}
                    </button>
                  </li>
                  <li className="text-slate-300" aria-hidden>
                    /
                  </li>
                  <li className="font-medium text-navy" aria-current="page">
                    {route.label}
                  </li>
                </ol>
                <button
                  type="button"
                  onClick={resetToMainMenu}
                  className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-3.5 py-2 text-[13px] font-semibold text-navy shadow-sm hover:border-gold/35 hover:bg-surface/40 transition-all duration-200"
                >
                  {t("knowledge.breadcrumb.change")}
                </button>
              </nav>
            </div>
          </div>

          {/* Sticky path selector — elevated control layer above page body */}
          <div
            className="sticky z-40 top-[6.5rem] sm:top-28 lg:top-[7.25rem] border-b border-slate-200/50 bg-gradient-to-b from-slate-50 to-slate-100/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.85),0_8px_24px_-6px_rgba(10,25,47,0.1),0_2px_8px_-4px_rgba(10,25,47,0.06)] backdrop-blur-md"
          >
            <div className={`${PAGE_CONTENT_RAIL_CLASS} py-2.5 lg:py-3`}>
              <p className="sr-only">Switch topic</p>
              <div className="flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
                {KNOWLEDGE_ROUTE_ORDER.map((rid) => {
                  const r = ROUTES[rid];
                  const active = selectedRoute === rid;
                  return (
                    <button
                      key={rid}
                      type="button"
                      onClick={() => switchPathOnly(rid)}
                      aria-current={active ? "true" : undefined}
                      className={`shrink-0 rounded-xl px-3.5 py-2 text-left text-[12px] sm:text-[13px] font-semibold transition-all duration-200 whitespace-nowrap ${
                        active
                          ? "bg-navy text-white shadow-md ring-1 ring-navy/10"
                          : "bg-surface/60 text-navy/80 hover:bg-surface hover:text-navy border border-transparent hover:border-slate-200/90"
                      }`}
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedRoute}
              role="region"
              aria-label={route.label}
              className="overflow-x-hidden"
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className={`${PAGE_CONTENT_RAIL_CLASS} border-t border-slate-200/35 pt-11 pb-6 sm:pt-12 sm:pb-7 lg:pt-14 lg:pb-8`}
              >
                {/* 1 — Context header */}
                <header className="max-w-3xl mb-6 lg:mb-8">
                  <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-navy tracking-[-0.03em] leading-[1.1] mb-4">
                    {route.label}
                  </h2>
                  <div className="space-y-2.5">
                    {route.contextLines.map((line, i) => (
                      <p
                        key={i}
                        className="font-sans text-[16px] sm:text-[17px] text-slate-700 leading-[1.65] font-normal"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </header>

                {/* 2 — What matters most (emphasized, not cards) */}
                <section aria-labelledby="matters-label" className="max-w-3xl">
                  <h3
                    id="matters-label"
                    className="font-heading text-xl sm:text-2xl font-semibold text-navy mb-5 tracking-[-0.02em]"
                  >
                    {t("knowledge.section.whatMatters")}
                  </h3>
                  <div className="rounded-2xl border-l-[5px] border-gold bg-gradient-to-r from-gold/[0.08] to-transparent pl-6 pr-5 py-7 sm:pl-8 sm:pr-8 sm:py-8">
                    <ul className="space-y-5 list-none m-0 p-0">
                      {route.whatMattersMost.map((line, i) => (
                        <li
                          key={i}
                          className="font-sans text-[17px] sm:text-[1.125rem] font-semibold text-navy leading-[1.55] tracking-[-0.015em]"
                        >
                          <span className="text-gold mr-2" aria-hidden>
                            ·
                          </span>
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              </div>

              <KnowledgeTopicBand
                bgClass="bg-white"
                className="border-t border-slate-200/35 py-10 md:py-12"
              >
                {/* 3 — Clarity cards (upgraded) */}
                <section aria-labelledby="clarity-cards-label" className="max-w-6xl">
                  <h3
                    id="clarity-cards-label"
                    className="font-heading text-xl font-semibold text-navy mb-5 tracking-[-0.02em]"
                  >
                    {route.claritySectionTitle ?? t("knowledge.section.clarityCards")}
                  </h3>
                  <div
                    className={`grid grid-cols-1 gap-5 sm:gap-6 max-w-6xl ${
                      route.clarityCards.length >= 4
                        ? "md:grid-cols-2"
                        : "md:grid-cols-2 lg:grid-cols-3"
                    }`}
                  >
                    {route.clarityCards.map((c) => (
                      <div
                        key={c.id}
                        className="kc-tile-clarity flex flex-col p-6 sm:p-7 lg:p-8"
                      >
                        <h4 className="font-heading text-lg font-semibold text-navy mb-3 leading-snug">{c.title}</h4>
                        <p className="font-sans text-[14px] text-slate-600 leading-[1.6] mb-4">{c.summary}</p>
                        <details className="group kc-details-expand mt-auto border-t border-slate-200/70 pt-4 open:border-slate-200/85 open:[&_summary]:text-gold">
                          <summary className="flex min-h-[48px] cursor-pointer list-none items-center font-sans text-[13px] font-semibold uppercase tracking-[0.12em] text-gold [&::-webkit-details-marker]:hidden transition-colors duration-[240ms] ease-out">
                            {c.expandLabel ?? t("knowledge.card.learnMore")}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 transition-transform duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-open:rotate-180" />
                          </summary>
                          <div className="kc-details-body -mx-1 mt-3 rounded-b-[10px] border-t border-slate-200/80 bg-transparent px-4 pb-4 pt-4 font-sans text-[14px] text-slate-600 leading-[1.65] transition-colors duration-[240ms] ease-out group-open:bg-slate-50/85 sm:px-5 space-y-3">
                            {learnMoreParagraphs(c.learnMore).map((para, pi) => (
                              <p key={pi}>{para}</p>
                            ))}
                          </div>
                        </details>
                      </div>
                    ))}
                  </div>
                </section>
              </KnowledgeTopicBand>

              {route.afterClarityBridge ? (
                <KnowledgeTopicBand
                  bgClass="bg-[#FAFBFC]"
                  className="border-t border-slate-200/35 py-8 md:py-9"
                >
                  <div className="max-w-3xl mx-auto text-center sm:text-left">
                    <p className="font-heading text-lg sm:text-xl font-semibold text-navy mb-2 tracking-[-0.02em]">
                      {route.afterClarityBridge.headline}
                    </p>
                    <p className="font-sans text-[15px] sm:text-[16px] text-slate-600 leading-[1.6]">
                      {route.afterClarityBridge.body}
                    </p>
                  </div>
                </KnowledgeTopicBand>
              ) : null}

              <KnowledgeTopicBand bgClass="bg-[#F7F9FC]" className="py-10 md:py-12">
                {/* 4 — How it works (step flow) */}
                <section aria-labelledby="how-label" className="max-w-3xl">
                  <h3 id="how-label" className="font-heading text-xl font-semibold text-navy mb-6 tracking-[-0.02em] sm:mb-7">
                    {route.howItWorksSectionTitle ?? t("knowledge.section.howItWorks")}
                  </h3>
                  {route.howItWorksIntro ? (
                    <div className="mb-7 max-w-2xl space-y-3">
                      {learnMoreParagraphs(route.howItWorksIntro).map((para, i) => (
                        <p
                          key={i}
                          className="font-sans text-[15px] sm:text-[16px] leading-[1.65] text-slate-700"
                        >
                          {para}
                        </p>
                      ))}
                    </div>
                  ) : null}
                  <div className="relative pl-2 sm:pl-4">
                    <div
                      className="absolute left-[18px] sm:left-[22px] top-3 bottom-3 w-px bg-gradient-to-b from-gold/50 via-gold/25 to-transparent"
                      aria-hidden
                    />
                    <ol className="space-y-5 sm:space-y-6 list-none m-0 p-0">
                      {route.howItWorksSteps.map((s, idx) => (
                        <li key={s.id} className="relative">
                          {s.beforeTransition ? (
                            <p className="mb-4 max-w-2xl font-sans text-[13px] font-medium leading-relaxed text-slate-500">
                              {s.beforeTransition}
                            </p>
                          ) : null}
                          <div className="relative pl-12 sm:pl-14">
                            <span
                              className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-gold/40 bg-white font-sans text-[13px] font-bold text-navy shadow-sm"
                              aria-hidden
                            >
                              {idx + 1}
                            </span>
                            <div className="kc-tile-step p-5 sm:p-6">
                              <h4 className="font-heading text-lg font-semibold text-navy mb-2 leading-snug">{s.title}</h4>
                              <p className="font-sans text-[14px] text-slate-600 leading-[1.6] mb-3">{s.summary}</p>
                              {s.learnMore?.trim() ? (
                                <details className="group kc-details-expand">
                                  <summary className="flex min-h-[48px] cursor-pointer list-none items-center gap-2 font-sans text-[13px] font-semibold text-navy/80 [&::-webkit-details-marker]:hidden transition-colors duration-[240ms] ease-out">
                                    <span className="border-b border-gold/40 pb-px">{t("knowledge.step.expand")}</span>
                                    <ChevronDown className="h-4 w-4 shrink-0 text-gold transition-transform duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-open:rotate-180" />
                                  </summary>
                                  <div className="kc-details-body mt-3 space-y-3 border-t border-slate-200/80 px-3 pb-3 pt-4 font-sans text-[14px] text-slate-600 leading-[1.65] transition-colors duration-[240ms] ease-out group-open:bg-slate-50/90 sm:px-4">
                                    {learnMoreParagraphs(s.learnMore).map((para, pi) => (
                                      <p key={pi}>{para}</p>
                                    ))}
                                  </div>
                                </details>
                              ) : null}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </section>
              </KnowledgeTopicBand>

              {route.faqAll.length > 0 ? (
                <KnowledgeTopicBand bgClass="bg-white" className="py-10 md:py-12">
                  {/* 5 — FAQ curated */}
                  <section aria-labelledby="faq-label" className="max-w-3xl">
                    <h3 id="faq-label" className="font-heading text-xl font-semibold text-navy mb-5 tracking-[-0.02em]">
                      {t("knowledge.section.faq")}
                    </h3>
                    {(() => {
                      const faqCap = route.faqInitialCount ?? FAQ_INITIAL;
                      const faqVisible = faqShowAll ? route.faqAll : route.faqAll.slice(0, faqCap);
                      return (
                        <>
                          <div className="kc-faq-wrap divide-y divide-slate-100/90 overflow-hidden">
                            {faqVisible.map((item, i) => (
                              <details
                                key={`${item.q}-${i}`}
                                className="group kc-details-expand kc-faq-item transition-colors duration-[240ms] ease-out"
                              >
                                <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 font-sans text-[15px] font-medium text-navy [&::-webkit-details-marker]:hidden transition-colors duration-[240ms] ease-out">
                                  <span className="pr-2">{item.q}</span>
                                  <ChevronDown
                                    className="h-5 w-5 shrink-0 text-gold transition-transform duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-open:rotate-180"
                                    aria-hidden
                                  />
                                </summary>
                                <div className="kc-details-body space-y-3 border-t border-transparent px-5 pb-5 pt-1 group-open:border-slate-200/70">
                                  {learnMoreParagraphs(item.a).map((para, pi) => (
                                    <p key={pi} className="font-sans text-[14px] text-slate-600 leading-[1.65]">
                                      {para}
                                    </p>
                                  ))}
                                </div>
                              </details>
                            ))}
                          </div>
                          {route.faqAll.length > faqCap ? (
                            <button
                              type="button"
                              onClick={() => setFaqShowAll((v) => !v)}
                              className="mt-5 font-sans text-[14px] font-semibold text-navy border-b border-gold/50 pb-0.5 transition-colors duration-[240ms] ease-out hover:text-gold"
                            >
                              {faqShowAll ? t("knowledge.faq.showLess") : t("knowledge.faq.showMore")}
                            </button>
                          ) : null}
                        </>
                      );
                    })()}
                  </section>
                </KnowledgeTopicBand>
              ) : null}

              <KnowledgeTopicBand bgClass="bg-[#EEF1F6]" className="py-12 md:py-14">
                {/* 6 — Real talk */}
                <section
                  aria-labelledby="real-talk-label"
                  className="max-w-3xl rounded-[14px] border border-slate-200/75 bg-gradient-to-br from-white via-white to-slate-50/50 px-6 py-8 shadow-[inset_0_1px_0_rgb(255_255_255/0.9),0_12px_40px_-10px_rgb(10_25_47/0.08)] ring-1 ring-slate-900/[0.05] sm:px-10 sm:py-9"
                >
                  <h3
                    id="real-talk-label"
                    className="font-heading text-xl sm:text-2xl font-semibold text-navy mb-6 tracking-[-0.02em]"
                  >
                    {route.realTalk.headline}
                  </h3>
                  <ul className="space-y-4 list-none m-0 p-0 max-w-prose">
                    {route.realTalk.points.map((pt, i) => (
                      <li
                        key={i}
                        className="font-sans text-[15px] leading-[1.65] text-slate-700 pl-4 border-l-2 border-gold/50"
                      >
                        {pt}
                      </li>
                    ))}
                  </ul>
                </section>
              </KnowledgeTopicBand>

              <KnowledgeTopicBand bgClass="bg-[#FAFBFC]" className="border-t border-slate-200/30 py-10 md:py-12">
                {/* 7 — Contextual CTA */}
                <section aria-labelledby="topic-cta-label" className="max-w-xl">
                  <h3 id="topic-cta-label" className="sr-only">
                    Next step
                  </h3>
                  <div className="rounded-[14px] border border-slate-200/85 bg-gradient-to-br from-white to-slate-50/40 px-6 py-8 text-center shadow-[inset_0_1px_0_rgb(255_255_255/0.85),0_12px_44px_-12px_rgb(10_25_47/0.09)] ring-1 ring-navy/[0.04] sm:px-8 sm:py-9 sm:text-left">
                    {route.contextualCta.ctaReassurance ? (
                      <p className="mb-4 font-sans text-[13px] font-medium leading-relaxed text-slate-500 sm:text-sm">
                        {route.contextualCta.ctaReassurance}
                      </p>
                    ) : null}
                    {route.contextualCta.subline ? (
                      <>
                        <p className="font-sans text-[17px] sm:text-[18px] font-semibold text-navy leading-snug tracking-[-0.02em] mb-3">
                          {route.contextualCta.line}
                        </p>
                        <p className="font-sans text-[15px] sm:text-[16px] text-slate-600 leading-[1.65] mb-7">
                          {route.contextualCta.subline}
                        </p>
                      </>
                    ) : (
                      <p className="font-sans text-[15px] sm:text-[16px] text-slate-600 leading-[1.65] mb-6">
                        {route.contextualCta.line}
                      </p>
                    )}
                    <Link
                      to={`/contact?topic=advisory&knowledgePath=${encodeURIComponent(selectedRoute)}`}
                      className="inline-flex w-full min-h-[48px] items-center justify-center gap-2 rounded-[13px] bg-navy px-8 py-3.5 font-sans text-[15px] font-semibold text-white shadow-[0_10px_32px_-4px_rgba(10,25,47,0.35)] transition-[transform,background-color,box-shadow] duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-navy/92 hover:shadow-[0_14px_40px_-6px_rgba(10,25,47,0.38)] active:translate-y-0 sm:w-auto"
                    >
                      {route.contextualCta.buttonLabel}
                      <ArrowRight size={17} className="opacity-90" />
                    </Link>
                  </div>
                </section>
              </KnowledgeTopicBand>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : null}

      {/* —— Featured: misunderstandings —— */}
      <section className="border-b border-slate-200/60 bg-surface/40 py-16 lg:py-24">
        <div className={PAGE_CONTENT_RAIL_CLASS}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-2xl mx-auto mb-12 lg:mb-14"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-navy tracking-[-0.03em] leading-[1.1] mb-3">
              {t("knowledge.misunderstandings.title")}
            </h2>
            <p className="font-sans text-slate-600 text-[15px] leading-relaxed">
              {t("knowledge.misunderstandings.subtitle")}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 max-w-6xl mx-auto">
            {MISUNDERSTANDINGS.map((f) => (
              <article
                key={f.id}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 lg:p-7 shadow-[0_8px_36px_rgba(10,25,47,0.06)]"
              >
                <h3 className="font-heading text-lg font-semibold text-navy mb-3 leading-snug">{f.title}</h3>
                <p className="font-sans text-[14px] text-slate-600 leading-relaxed">{f.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* —— CTA —— */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-surface/30">
        <div className={`${PAGE_CONTENT_RAIL_CLASS} text-center max-w-2xl mx-auto`}>
          <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-navy tracking-[-0.02em] mb-4">
            {t("knowledge.cta.title")}
          </h2>
          <p className="font-sans text-slate-600 mb-8 text-[15px] leading-relaxed">
            {t("knowledge.cta.body")}
          </p>
          <Link
            to="/contact?topic=advisory"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-navy px-10 py-4 font-sans text-[15px] font-semibold text-white shadow-[0_16px_48px_rgba(10,25,47,0.25)] hover:bg-navy/90 transition-colors duration-200"
          >
            {t("knowledge.cta.button")}
            <ArrowRight size={18} className="opacity-90" />
          </Link>
        </div>
      </section>

      {/* —— Brand strip —— */}
      <section className="border-t border-slate-200/70 bg-gradient-to-b from-navy to-[#071018] text-white">
        <div className={PAGE_CONTENT_RAIL_CLASS}>
          <div className="max-w-3xl mx-auto py-14 lg:py-16 text-center">
            <p className="font-heading text-xl sm:text-2xl font-semibold text-white mb-6 leading-[1.25] tracking-[-0.02em]">
              {t("knowledge.brand.line")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="btn-gold group !px-8 !py-3.5 !rounded-2xl inline-flex items-center gap-2 shadow-[0_12px_40px_rgba(197,160,89,0.25)]"
              >
                {t("knowledge.brand.cta")}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/loan-structure-simulator"
                className="text-sm font-semibold text-white/85 border-b border-white/30 pb-0.5 hover:text-white transition-colors"
              >
                {t("knowledge.brand.simulator")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
