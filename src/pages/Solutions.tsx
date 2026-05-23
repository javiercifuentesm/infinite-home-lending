import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LoanProductDetailModal } from "../components/LoanProductDetailModal";
import { LoanProductGridCard } from "../components/LoanProductGridCard";
import { getLoanProductById, LOAN_GRID_ROWS } from "../data/loanProducts";
import { PageContainer } from "../components/PageContainer";
import { useLanguage } from "../i18n/LanguageContext";

type GuidedPath = "buy" | "equity" | "explore";

const GUIDED_BUY = new Set(["conventional", "fha", "va", "usda", "non-qm"]);
const GUIDED_EQUITY = new Set(["refinance", "cash-out-refinance", "heloc", "reverse"]);

function matchesGuided(loanId: string, path: GuidedPath | null): boolean {
  if (path === null || path === "explore") return true;
  if (path === "buy") return GUIDED_BUY.has(loanId);
  return GUIDED_EQUITY.has(loanId);
}

const Solutions = () => {
  const { t, lang } = useLanguage();
  const [modalProductId, setModalProductId] = useState<string | null>(null);
  const [guidedPath, setGuidedPath] = useState<GuidedPath | null>(null);
  const [recentlyClosedId, setRecentlyClosedId] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const modalProduct = useMemo(
    () => (modalProductId ? getLoanProductById(modalProductId, lang) : null),
    [modalProductId, lang],
  );

  useEffect(() => {
    if (!recentlyClosedId) return;
    const t = window.setTimeout(() => setRecentlyClosedId(null), 2800);
    return () => window.clearTimeout(t);
  }, [recentlyClosedId]);

  const openLoan = (id: string) => {
    setModalProductId(id);
  };

  const handleCloseModal = () => {
    const closed = modalProductId;
    setModalProductId(null);
    if (closed) setRecentlyClosedId(closed);
  };

  const chooseGuided = (path: GuidedPath) => {
    setGuidedPath(path);
    window.requestAnimationFrame(() => {
      gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const guidedDimmingActive = guidedPath === "buy" || guidedPath === "equity";

  return (
    <PageContainer>
      <section className="py-[140px] bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 md:mb-12"
          >
            <span className="inline-block px-4 py-1.5 bg-surface text-gold text-[11px] font-bold uppercase tracking-[0.25em] rounded-sm mb-10">
              {t("solutions.eyebrow")}
            </span>
            <h1 className="mb-6 text-navy text-[2rem] sm:text-4xl lg:text-[2.625rem] leading-[1.12] tracking-[-0.025em] font-semibold font-heading">
              {t("solutions.title")}
            </h1>
            <p className="text-[17px] text-slate-500 max-w-2xl leading-relaxed font-light mb-10">
              {t("solutions.subtitle")}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl">
              <button
                type="button"
                onClick={() => chooseGuided("buy")}
                className={`text-left rounded-[4px] border p-5 md:p-6 transition-[border-color,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 ${
                  guidedPath === "buy"
                    ? "border-gold/45 bg-surface/35"
                    : "border-slate-200/90 bg-white hover:border-gold/30 hover:bg-surface/20"
                }`}
              >
                <span className="block text-navy font-semibold text-[15px] leading-snug mb-2">
                  {t("solutions.guided.buy.title")}
                </span>
                <span className="block text-sm text-slate-500 font-light leading-snug">
                  {t("solutions.guided.buy.desc")}
                </span>
              </button>
              <button
                type="button"
                onClick={() => chooseGuided("equity")}
                className={`text-left rounded-[4px] border p-5 md:p-6 transition-[border-color,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 ${
                  guidedPath === "equity"
                    ? "border-gold/45 bg-surface/35"
                    : "border-slate-200/90 bg-white hover:border-gold/30 hover:bg-surface/20"
                }`}
              >
                <span className="block text-navy font-semibold text-[15px] leading-snug mb-2">
                  {t("solutions.guided.equity.title")}
                </span>
                <span className="block text-sm text-slate-500 font-light leading-snug">
                  {t("solutions.guided.equity.desc")}
                </span>
              </button>
              <button
                type="button"
                onClick={() => chooseGuided("explore")}
                className={`text-left rounded-[4px] border p-5 md:p-6 transition-[border-color,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 ${
                  guidedPath === "explore"
                    ? "border-gold/45 bg-surface/35"
                    : "border-slate-200/90 bg-white hover:border-gold/30 hover:bg-surface/20"
                }`}
              >
                <span className="block text-navy font-semibold text-[15px] leading-snug mb-2">
                  {t("solutions.guided.explore.title")}
                </span>
                <span className="block text-sm text-slate-500 font-light leading-snug">
                  {t("solutions.guided.explore.desc")}
                </span>
              </button>
            </div>
          </motion.div>

          <div ref={gridRef} className="max-w-6xl mx-auto space-y-7 md:space-y-8 scroll-mt-28">
            {LOAN_GRID_ROWS.map((row) => (
              <div
                key={row.join("-")}
                className="grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-8 items-stretch"
              >
                {row.map((id) => {
                  const product = getLoanProductById(id, lang);
                  if (!product) return null;
                  const guidedMatch = matchesGuided(id, guidedPath);
                  const dim = guidedDimmingActive && !guidedMatch;
                  return (
                    <div key={id} className="flex h-full min-h-0 w-full">
                      <LoanProductGridCard
                        product={product}
                        isActive={modalProductId === id}
                        guidedDimmed={dim}
                        recentlyViewed={recentlyClosedId === id}
                        onSelect={() => openLoan(id)}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="mt-14 md:mt-16 max-w-2xl mx-auto text-center px-2">
            <p className="text-sm text-slate-600 font-light leading-relaxed">
              <span>{t("solutions.selfEmployed.pre")} </span>
              <Link
                to="/tools/self-employed-qualifier"
                className="font-semibold text-navy underline decoration-gold/45 underline-offset-2 hover:text-gold"
              >
                {t("solutions.selfEmployed.link")}
              </Link>
              <span className="text-slate-500"> {t("solutions.selfEmployed.post")}</span>
            </p>
            <p className="mt-4 text-sm text-slate-500 font-light leading-relaxed">
              {t("solutions.disclaimer")}
            </p>
          </div>

          <div className="mt-14 md:mt-16 bg-navy text-white p-12 md:p-20 rounded-[4px] text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">{t("solutions.cta.title")}</h3>
            <p className="text-slate-400 mb-10 max-w-xl mx-auto text-lg font-light">
              {t("solutions.cta.body")}
            </p>
            <Link
              to="/contact"
              className="btn-gold"
            >
              {t("solutions.cta.button")}
            </Link>
          </div>
        </div>
      </section>

      <LoanProductDetailModal product={modalProduct} onClose={handleCloseModal} />
    </PageContainer>
  );
};

export default Solutions;
