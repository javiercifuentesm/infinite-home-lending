import type { LoanProductData } from "./LoanProductCard";
import { LoanProgramDetailContent } from "./loan-program/LoanProgramDetailContent";

type LoanProductModalContentProps = {
  product: LoanProductData;
  titleId?: string;
};

/** Premium program detail layout — header + advisory sections below. */
export function LoanProductModalContent({ product, titleId }: LoanProductModalContentProps) {
  return <LoanProgramDetailContent product={product} titleId={titleId} variant="modal" />;
}
