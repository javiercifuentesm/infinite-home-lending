import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PAGE_CONTENT_RAIL_CLASS } from "../constants/layout";
import { getSmartToolsForHub } from "../data/smartToolsCatalog";

export default function SmartTools() {
  const tools = getSmartToolsForHub();

  return (
    <div className="min-h-screen bg-surface pb-24 font-sans">
      <div className="border-b border-slate-200/30 bg-gradient-to-b from-white/[0.92] via-surface to-surface pt-24 sm:pt-28 lg:pt-32">
        <div className={`${PAGE_CONTENT_RAIL_CLASS} pt-12 md:pt-16 lg:pt-20 pb-10 sm:pb-12`}>
          <header className="text-center md:text-left">
            <p className="type-eyebrow mb-4 text-gold">Infinite Home Lending</p>
            <h1 className="type-section-title-lg mb-5 text-[2rem] sm:text-[2.35rem] lg:text-[2.65rem] text-navy">
              Smart Tools
            </h1>
            <p className="type-body-lg max-w-2xl text-slate-600">
              Interactive tools designed to bring clarity to real mortgage decisions.
            </p>
          </header>
        </div>
      </div>

      <div className={`${PAGE_CONTENT_RAIL_CLASS} pt-10 sm:pt-12`}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <article
                key={tool.path}
                className="group relative flex flex-col rounded-[4px] border border-slate-200/90 bg-white p-8 shadow-[0_12px_40px_rgba(10,25,47,0.05)] transition-shadow duration-300 hover:shadow-[0_16px_48px_rgba(10,25,47,0.08)]"
              >
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-[4px] border border-gold/20 bg-surface text-gold transition-transform duration-300 group-hover:scale-[1.02]">
                  <Icon size={22} strokeWidth={1.75} />
                </div>
                <h2 className="font-heading text-xl font-semibold text-navy sm:text-[1.35rem]">{tool.name}</h2>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-slate-600">{tool.description}</p>
                <Link
                  to={tool.path}
                  className="mt-8 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-navy transition-colors hover:text-gold"
                >
                  Launch tool
                  <ArrowRight size={16} strokeWidth={2} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
