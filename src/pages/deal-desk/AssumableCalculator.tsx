import Nexio from "../../components/Nexio";
import { usePageMetadata } from "../../hooks/usePageMetadata";
import { PAGE_METADATA } from "../../lib/pageMetadata";
import ACCalculator from "../../components/deal-desk/assumable-calculator/ACCalculator";

export default function AssumableCalculator() {
  usePageMetadata(PAGE_METADATA.assumableCalculator);

  return (
    <div className="pt-[calc(var(--site-header-height)+0.25rem)]">
      <ACCalculator />
      <Nexio />
    </div>
  );
}
