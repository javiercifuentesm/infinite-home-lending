import Nexio from "../../components/Nexio";
import { usePageMetadata } from "../../hooks/usePageMetadata";
import { PAGE_METADATA } from "../../lib/pageMetadata";
import SNSCalculator from "../../components/deal-desk/seller-net-sheet/SNSCalculator";

export default function SellerNetSheet() {
  usePageMetadata(PAGE_METADATA.sellerNetSheet);

  return (
    <div className="pt-[calc(var(--site-header-height)+0.25rem)]">
      <SNSCalculator />
      <Nexio />
    </div>
  );
}
