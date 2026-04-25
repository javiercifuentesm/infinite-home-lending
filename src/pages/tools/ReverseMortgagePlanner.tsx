import { useEffect } from "react";
import ReverseCalculator from "../../components/tools/reverse/ReverseCalculator";

const CANONICAL = "https://www.infinitehomelending.com/tools/reverse-mortgage-planner";

export default function ReverseMortgagePlanner() {
  useEffect(() => {
    document.title = "Reverse Mortgage Calculator & Retirement Planner | Infinite Home Lending";

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
      "The most complete reverse mortgage tool available. Compare all four payout strategies, see your monthly income gap analysis, project your heirs' inheritance over 20 years, and get honest answers to the questions most people are afraid to ask. Built for MD, DC, and VA homeowners 62+.",
    );
    setMeta("property", "og:title", "Reverse Mortgage Retirement Planner — Infinite Home Lending");
    setMeta(
      "property",
      "og:description",
      "Not just a loan amount. The full retirement picture — income gap, payout strategies, heir inheritance, and myth-busting in one honest tool.",
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
      <ReverseCalculator />
    </div>
  );
}
