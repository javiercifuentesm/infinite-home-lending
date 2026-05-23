import Nexio from "../../components/Nexio";
import { usePageMetadata } from "../../hooks/usePageMetadata";
import { PAGE_METADATA } from "../../lib/pageMetadata";
import OOCalculator from "../../components/deal-desk/offer-optimizer/OOCalculator";

export default function OfferOptimizer() {
  usePageMetadata(PAGE_METADATA.offerOptimizer);

  return (
    <div className="pt-[calc(var(--site-header-height)+0.25rem)]">
      <OOCalculator />
      <Nexio />
    </div>
  );
}
