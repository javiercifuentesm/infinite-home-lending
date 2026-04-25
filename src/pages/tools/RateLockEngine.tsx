import { useEffect } from "react";
import RLECalculator from "../../components/tools/ratelock/RLECalculator";

const CANONICAL = "https://www.infinitehomelending.com/tools/rate-lock-engine";

export default function RateLockEngine() {
  useEffect(() => {
    document.title = "Should I Lock My Mortgage Rate? Rate Lock Decision Engine | Infinite Home Lending";

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
      "The only tool that quantifies mortgage rate lock risk in personal dollar terms. See your exact downside vs. upside from floating, model extension fees, and analyze whether a float-down option is worth buying. Not a rate prediction — a decision support engine for MD, DC, and VA homebuyers.",
    );
    setMeta("property", "og:title", "The Rate Lock Decision Engine — Infinite Home Lending");
    setMeta(
      "property",
      "og:description",
      "Floating your rate is a bet. Find out exactly what you're betting — in your dollars — before you decide.",
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
      <RLECalculator />
    </div>
  );
}
