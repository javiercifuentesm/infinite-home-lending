import HelocCalculator from "../../components/tools/heloc/HelocCalculator";
import { usePageMetadata } from "../../hooks/usePageMetadata";
import { PAGE_METADATA } from "../../lib/pageMetadata";

export default function HelocPlanner() {
  usePageMetadata(PAGE_METADATA.helocPlanner);

  return (
    <div
      className="
        min-h-screen border-b border-slate-200/80 bg-[#F7F7F5] font-sans
        pb-12
        pt-[calc(var(--site-header-height)+0.375rem)]
      "
    >
      <HelocCalculator />
    </div>
  );
}
