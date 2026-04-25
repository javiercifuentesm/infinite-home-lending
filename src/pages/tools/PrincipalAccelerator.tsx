import { useEffect } from "react";
import AcceleratorCalculator from "../../components/tools/AcceleratorCalculator";

const CANONICAL = "https://www.infinitehomelending.com/tools/principal-accelerator";

export default function PrincipalAccelerator() {
  useEffect(() => {
    document.title = "Extra Mortgage Payment Calculator | The Principal Accelerator | Infinite Home Lending";

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
      "See exactly how much time and interest you save by making extra payments toward your mortgage principal. Move a slider and watch years disappear from your loan in real time.",
    );
    setMeta("property", "og:title", "The Principal Accelerator — Infinite Home Lending");
    setMeta(
      "property",
      "og:description",
      "The extra mortgage payment calculator that shows you the full picture — years saved, interest eliminated, and your new payoff date. Updated in real time as you move the slider.",
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
      <AcceleratorCalculator />
    </div>
  );
}
