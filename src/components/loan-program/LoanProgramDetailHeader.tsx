import type { LoanProductData } from "../LoanProductCard";

type LoanProgramDetailHeaderProps = {
  product: LoanProductData;
  titleId?: string;
};

/**
 * Program intro header — same copy as the modal hero block; layout only.
 */
export function LoanProgramDetailHeader({ product, titleId }: LoanProgramDetailHeaderProps) {
  const d = product.modalDetail;

  return (
    <header className="space-y-3 max-w-3xl">
      <h1
        id={titleId}
        className="text-navy text-2xl md:text-[2rem] lg:text-[2.25rem] font-semibold tracking-tight leading-snug font-heading"
      >
        {product.title}
      </h1>
      <p className="text-base md:text-lg font-medium text-navy/90 leading-snug">{d.headline}</p>
      <p className="text-slate-600 leading-relaxed text-[15px] md:text-base font-light max-w-2xl">{d.intro}</p>
    </header>
  );
}
