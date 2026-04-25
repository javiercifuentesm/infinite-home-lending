import { useEffect } from "react";
import PMCalculator from "../../components/tools/powermap/PMCalculator";

const CANONICAL = "https://www.infinitehomelending.com/tools/homebuying-power-map";

export default function HomebuyingPowerMap() {
  useEffect(() => {
    document.title =
      "Homebuying Power Map | How Much House Can I Afford If I Improve My Credit? | Infinite Home Lending";

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
      "The only tool that shows your homebuying power trajectory — not just today, but in 90 days, 6 months, and 12 months — mapped against real MD-DC-VA neighborhoods. See which markets you unlock as you improve your credit, pay off debt, and save. Built for DC, Maryland, and Virginia homebuyers.",
    );
    setMeta("property", "og:title", "The Homebuying Power Map — Infinite Home Lending");
    setMeta(
      "property",
      "og:description",
      "See exactly which MD-DC-VA neighborhoods become accessible as your financial picture improves. Your 12-month roadmap to homeownership.",
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
      <PMCalculator />
    </div>
  );
}
