import Nexio from "../../components/Nexio";
import { usePageMetadata } from "../../hooks/usePageMetadata";
import { PAGE_METADATA } from "../../lib/pageMetadata";
import LBCalculator from "../../components/deal-desk/listing-boost/LBCalculator";

export default function ListingBoost() {
  usePageMetadata(PAGE_METADATA.listingBoost);

  return (
    <div className="pt-[calc(var(--site-header-height)+0.25rem)]">
      <LBCalculator />
      <Nexio />
    </div>
  );
}
