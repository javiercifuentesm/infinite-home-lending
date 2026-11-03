import type { LoanProductData } from "../components/LoanProductCard";

const FIT_CAP = 4;
const BENEFITS_CAP = 4;
const KEEP_IN_MIND_CAP = 3;

/**
 * Whether a canonical loan product has enough educational fields for the
 * advisor Loan Solutions native modal. Fail soft — missing optional fields
 * do not block if core overview + at least one list section exist.
 */
export function hasAdvisorLoanProgramModalData(
  product: LoanProductData | null | undefined,
): boolean {
  if (!product?.id || !product.title || !product.modalDetail) return false;
  const d = product.modalDetail;
  if (!d.headline?.trim() || !d.intro?.trim()) return false;

  const fitCount = d.whenMakesSenseBullets?.length ?? 0;
  const benefitsCount =
    (product.expanded?.benefits?.length ?? 0) > 0
      ? product.expanded.benefits.length
      : (d.whyClientsChoose?.length ?? 0);

  return fitCount > 0 || benefitsCount > 0;
}

export type AdvisorLoanProgramModalView = {
  programId: string;
  title: string;
  headline: string;
  overview: string;
  fitItems: string[];
  benefitItems: string[];
  keepInMindItems: string[];
  detailPath: string;
};

/** Condensed modal view model from canonical LoanProductData (no new copy). */
export function getAdvisorLoanProgramModalView(
  product: LoanProductData,
): AdvisorLoanProgramModalView | null {
  if (!hasAdvisorLoanProgramModalData(product)) return null;

  const d = product.modalDetail;
  const benefits =
    product.expanded.benefits.length > 0 ? product.expanded.benefits : d.whyClientsChoose;

  return {
    programId: product.id,
    title: product.title,
    headline: d.headline,
    overview: d.intro,
    fitItems: d.whenMakesSenseBullets.slice(0, FIT_CAP),
    benefitItems: benefits.slice(0, BENEFITS_CAP),
    keepInMindItems: d.whatToKeepInMind.slice(0, KEEP_IN_MIND_CAP),
    detailPath: `/solutions/programs/${product.id}`,
  };
}
