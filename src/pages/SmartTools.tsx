import { Link } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
} from "lucide-react";
import { PAGE_CONTENT_RAIL_CLASS } from "../constants/layout";
import {
  getSmartToolsForHub,
  type SmartToolCatalogEntry,
} from "../data/smartToolsCatalog";
import { useLanguage } from "../i18n/LanguageContext";
import { usePageMetadata } from "../hooks/usePageMetadata";

const GRID_CARD_CLASS =
  "group flex flex-col rounded-[10px] border-t-2 border-[#C9A84C] bg-[#1B2A4A] p-4 transition-colors duration-300 hover:bg-[#243560]";

/** Matches one column in the 3-column grid (accounts for gap-6 / 1.5rem). */
const GRID_CARD_WIDTH_CLASS =
  "w-full md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]";

function GoldPillCta({
  to,
  label,
  className = "",
  arrowSize = 12,
}: {
  to: string;
  label: string;
  className?: string;
  arrowSize?: number;
}) {
  return (
    <Link
      to={to}
      className={`inline-flex w-fit items-center gap-1.5 rounded-[20px] bg-[#C9A84C] font-medium text-[#1B2A4A] transition-opacity hover:opacity-90 ${className}`.trim()}
    >
      {label}
      <ArrowRight size={arrowSize} strokeWidth={2.5} aria-hidden="true" />
    </Link>
  );
}

function ToolGridCard({
  tool,
  t,
  className = "",
}: {
  tool: SmartToolCatalogEntry;
  t: (key: string) => string;
  className?: string;
}) {
  const Icon = tool.icon;

  return (
    <article className={`${GRID_CARD_CLASS} ${className}`.trim()}>
      <Icon
        className="mb-3 h-[18px] w-[18px] shrink-0 text-[#C9A84C]"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <h2 className="text-[12px] font-medium text-white">{t(tool.nameKey)}</h2>
      <p className="mt-1.5 flex-1 text-[10px] leading-[1.6] text-[rgba(255,255,255,0.55)]">
        {t(tool.descKey)}
      </p>
      <GoldPillCta
        to={tool.path}
        label={t("smartTools.launchTool")}
        className="mt-4 px-3 py-1 text-[9px]"
        arrowSize={10}
      />
    </article>
  );
}

export default function SmartTools() {
  const { t, lang } = useLanguage();
  const serviceAreaLabel =
    lang === "es"
      ? "Diseñado para Washington, D.C. y Maryland"
      : "Built for Washington, DC & Maryland";
  usePageMetadata({
    title: t("smartTools.meta.title"),
    description: t("smartTools.meta.description"),
    canonical: "https://www.infinitehomelending.com/smart-tools",
  });

  const tools = getSmartToolsForHub();
  const [featuredTool, ...gridTools] = tools;
  const mainGridTools = gridTools.slice(0, -2);
  const lastRowTools = gridTools.slice(-2);
  const FeaturedIcon = featuredTool.icon;

  return (
    <div className="min-h-screen bg-white pb-24 font-sans">
      <div className={`${PAGE_CONTENT_RAIL_CLASS} pt-24 sm:pt-28 lg:pt-32`}>
        {/* Header */}
        <header>
          <div className="border-b border-slate-200/80 pb-8 sm:pb-10">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A84C]">
              {t("smartTools.eyebrow")}
            </p>
            <h1 className="text-[2rem] font-semibold tracking-tight text-[#1B2A4A] sm:text-[2.35rem] lg:text-[2.65rem]">
              {t("smartTools.title")}
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-slate-600 sm:text-base">
              {t("smartTools.subtitle")}
            </p>
            <p className="mt-4 flex items-center gap-2 text-[13px] text-slate-500">
              <MapPin className="h-4 w-4 shrink-0 text-[#C9A84C]" strokeWidth={1.75} aria-hidden="true" />
              <span>{serviceAreaLabel}</span>
            </p>
          </div>
        </header>

        {/* Featured Tool */}
        <section className="pt-10 sm:pt-12">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            {t("smartTools.featuredTool")}
          </p>
          <article className="flex flex-col gap-6 rounded-[12px] border-t-2 border-[#C9A84C] bg-[#1B2A4A] p-6 transition-colors duration-300 hover:bg-[#243560] sm:flex-row sm:items-center sm:gap-8">
            <div className="flex shrink-0 items-center justify-center sm:w-[88px]">
              <FeaturedIcon
                className="h-14 w-14 text-[#C9A84C] sm:h-16 sm:w-16"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="mb-3 inline-flex w-fit rounded-full border border-[#C9A84C]/35 bg-[#C9A84C]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#C9A84C]">
                {t("smartTools.mostUsed")}
              </span>
              <h2 className="text-[15px] font-medium text-white">{t(featuredTool.nameKey)}</h2>
              <p className="mt-2 max-w-2xl text-[11px] leading-[1.6] text-white/60">
                {t(featuredTool.descKey)}
              </p>
              <GoldPillCta
                to={featuredTool.path}
                label={t("smartTools.launchTool")}
                className="mt-5 px-[14px] py-[6px] text-[11px]"
              />
            </div>
          </article>
        </section>

        {/* All Tools Grid */}
        <section className="pt-12 sm:pt-14">
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            {t("smartTools.allTools")}
          </p>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {mainGridTools.map((tool) => (
              <ToolGridCard key={tool.path} tool={tool} t={t} />
            ))}

            <div className="col-span-1 flex flex-wrap items-stretch justify-center gap-5 md:col-span-2 md:gap-6 lg:col-span-3">
              {lastRowTools.map((tool) => (
                <ToolGridCard
                  key={tool.path}
                  tool={tool}
                  t={t}
                  className={GRID_CARD_WIDTH_CLASS}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
