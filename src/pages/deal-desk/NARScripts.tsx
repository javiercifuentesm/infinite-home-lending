import Nexio from "../../components/Nexio";
import { usePageMetadata } from "../../hooks/usePageMetadata";
import { PAGE_METADATA } from "../../lib/pageMetadata";
import NARScriptLibrary from "../../components/deal-desk/nar-scripts/NARScriptLibrary";

export default function NARScripts() {
  usePageMetadata(PAGE_METADATA.narScripts);

  return (
    <div className="pt-[calc(var(--site-header-height)+0.25rem)]">
      <NARScriptLibrary />
      <Nexio />
    </div>
  );
}
