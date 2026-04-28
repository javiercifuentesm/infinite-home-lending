import { useEffect } from "react";
import Nexio from "../../components/Nexio";
import NARScriptLibrary from "../../components/deal-desk/nar-scripts/NARScriptLibrary";

const CANONICAL = "https://www.infinitehomelending.com/deal-desk/nar-scripts";

export default function NARScripts() {
  useEffect(() => {
    document.title = "NAR Settlement Script Library | The Deal Desk | Infinite Home Lending";
    const setMeta = (attr: "name" | "property", key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    setMeta(
      "name",
      "description",
      "Word-for-word scripts for NAR settlement conversations — buyer agreements, commission objections, seller concessions, and open houses.",
    );
    setMeta("property", "og:title", "NAR Settlement Script Library | The Deal Desk");
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = CANONICAL;
    return () => {
      document.title = "Infinite Home Lending";
    };
  }, []);

  return (
    <div className="pt-[calc(var(--site-header-height)+0.25rem)]">
      <NARScriptLibrary />
      <Nexio />
    </div>
  );
}
