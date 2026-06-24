import type { LoanProductData } from "../LoanProductCard";
import { LoanProgramDetailHeader } from "./LoanProgramDetailHeader";
import { LoanProgramDetailSections } from "./LoanProgramDetailSections";
import "./loanProgramDetail.css";

type LoanProgramDetailContentProps = {
  product: LoanProductData;
  titleId?: string;
  /** Full-page layout includes wider header band; modal uses compact header only */
  variant?: "page" | "modal";
};

export function LoanProgramDetailContent({
  product,
  titleId,
  variant = "page",
}: LoanProgramDetailContentProps) {
  if (variant === "modal") {
    return (
      <div className="loan-program-detail">
        <div className="pb-6">
          <LoanProgramDetailHeader product={product} titleId={titleId} />
        </div>
        <LoanProgramDetailSections product={product} />
      </div>
    );
  }

  return (
    <>
      <section className="border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10 md:py-14 lg:pt-24 lg:pb-16">
          <LoanProgramDetailHeader product={product} titleId={titleId} />
        </div>
      </section>
      <div className="loan-program-detail">
        <LoanProgramDetailSections product={product} />
      </div>
    </>
  );
}
