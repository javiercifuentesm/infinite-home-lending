import Nexio from "../../components/Nexio";
import { usePageMetadata } from "../../hooks/usePageMetadata";
import { PAGE_METADATA } from "../../lib/pageMetadata";
import CQCalculator from "../../components/deal-desk/client-qualifier/CQCalculator";

export default function ClientQualifier() {
  usePageMetadata(PAGE_METADATA.clientQualifier);

  return (
    <div className="pt-[calc(var(--site-header-height)+0.25rem)]">
      <CQCalculator />
      <Nexio />
    </div>
  );
}
