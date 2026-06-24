import { ArrowLeft } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { LoanProgramDetailContent } from "../components/loan-program/LoanProgramDetailContent";
import { PageContainer } from "../components/PageContainer";
import { getLoanProductById } from "../data/loanProducts";
import { useLanguage } from "../i18n/LanguageContext";
import { usePageMetadata } from "../hooks/usePageMetadata";

export default function LoanProgramDetailPage() {
  const { programId } = useParams<{ programId: string }>();
  const { t, lang } = useLanguage();
  const product = programId ? getLoanProductById(programId, lang) : undefined;

  usePageMetadata({
    title: product ? `${product.title} | Infinite Home Lending` : t("solutions.meta.title"),
    description: product?.shortDescription ?? t("solutions.meta.description"),
    canonical: product
      ? `https://www.infinitehomelending.com/solutions/programs/${product.id}`
      : "https://www.infinitehomelending.com/solutions",
  });

  if (!programId || !product) {
    return <Navigate to="/solutions" replace />;
  }

  return (
    <PageContainer className="!pt-0">
      <div className="border-b border-slate-100 bg-surface/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link
            to="/solutions"
            onClick={() => sessionStorage.setItem("ihl-recent-program", product.id)}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-navy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 rounded-sm"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            {t("solutions.detail.backToSolutions")}
          </Link>
        </div>
      </div>
      <LoanProgramDetailContent product={product} variant="page" />
    </PageContainer>
  );
}
