import { useEffect } from "react";
import { SEQCalculator } from "../../components/tools/selfemployed/SEQCalculator";

const CANONICAL = "https://www.infinitehomelending.com/tools/self-employed-qualifier";

export default function SelfEmployedQualifier() {
  useEffect(() => {
    document.title =
      "Self-Employed Mortgage Calculator 2026 | Schedule C + Bank Statement Qualifier | Infinite Home Lending";

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
      "The only mortgage tool that models all three self-employed income paths: Schedule C tax return with full add-back engine, bank statement cash flow, and a mortgage planning scenario showing what reducing write-offs does to your buying power. Built for MD, DC, and VA freelancers, contractors, and business owners.",
    );
    setMeta("property", "og:title", "Self-Employed Mortgage Qualifier — Infinite Home Lending");
    setMeta(
      "property",
      "og:description",
      "Not your W-2. Your real income. Schedule C add-backs, bank statement path, and the write-off planning scenario no other tool shows.",
    );
    setMeta("property", "og:url", CANONICAL);

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
    <div
      className="
        min-h-screen border-b border-slate-200/80 bg-[#F7F7F5] font-sans
        pb-12
        pt-[calc(var(--site-header-height)+0.375rem)]
      "
    >
      <SEQCalculator />
    </div>
  );
}
