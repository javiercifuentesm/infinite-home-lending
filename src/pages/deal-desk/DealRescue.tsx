import Nexio from "../../components/Nexio";
import { usePageMetadata } from "../../hooks/usePageMetadata";
import { PAGE_METADATA } from "../../lib/pageMetadata";
import DealRescueCalculator from "../../components/deal-desk/deal-rescue/DealRescueCalculator";

export default function DealRescue() {
  usePageMetadata(PAGE_METADATA.dealRescue);

  return (
    <div className="pt-[calc(var(--site-header-height)+0.25rem)]">
      <DealRescueCalculator />
      <Nexio />
    </div>
  );
}
