import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";

export type DealDeskToolCardProps = {
  name: string;
  description: string;
  to: string;
  /** When true, show coming soon state — no launch link */
  comingSoon?: boolean;
  /**
   * Welcome variant — highlights the Agent Playbook as the guided entry to The Deal Desk.
   */
  variant?: "default" | "welcome";
};

export function DealDeskToolCard({ name, description, to, comingSoon, variant = "default" }: DealDeskToolCardProps) {
  const isWelcome = variant === "welcome" && !comingSoon;

  if (isWelcome) {
    return (
      <article className="relative flex h-full flex-col overflow-hidden rounded-xl border-2 border-[#C6A15B]/45 bg-gradient-to-br from-white via-white to-amber-50/40 p-6 shadow-sm ring-1 ring-[#C6A15B]/20 transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#C6A15B]/20 md:col-span-2">
        <div
          className="pointer-events-none absolute -right-16 -top-12 h-40 w-40 rounded-full bg-[#C6A15B]/15 blur-3xl"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C6A15B]/50 to-transparent" aria-hidden />

        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C6A15B]/35 bg-[#0B2A4A]/[0.04] px-2.5 py-1 font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-[#6b5216] shadow-sm">
              <BookOpen className="h-3 w-3 shrink-0 text-[#9a7a2a]" aria-hidden />
              Start here
            </span>
            <span className="font-sans text-[11px] italic leading-none text-slate-500">Your guided tour of the suite</span>
          </div>
          <h3 className="mt-4 font-[Georgia,serif] text-[1.15rem] font-medium leading-snug text-[#0B2A4A]">{name}</h3>
          <p className="mt-3 flex-1 font-sans text-[13px] leading-relaxed text-slate-600">{description}</p>
        </div>

        <div className="relative mt-6 border-t border-[#C6A15B]/25 pt-4">
          <Link
            to={to}
            className="group/btn inline-flex items-center gap-2 rounded-md bg-[#0B2A4A] px-4 py-2.5 font-sans text-[13px] font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#0d3460]"
          >
            Open the playbook
            <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover/btn:translate-x-0.5" aria-hidden />
          </Link>
          <p className="mt-2.5 font-sans text-[11px] leading-snug text-slate-500">
            Scripts, timelines, and when to use each tool — step in when you&apos;re ready.
          </p>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`flex h-full flex-col rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm transition-shadow ${
        comingSoon ? "opacity-[0.92]" : "hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-[Georgia,serif] text-[1.05rem] font-medium leading-snug text-[#0B2A4A]">{name}</h3>
        {comingSoon ? (
          <span className="shrink-0 rounded-full bg-[#C6A15B]/15 px-2.5 py-0.5 font-sans text-[9px] font-bold uppercase tracking-wider text-[#8b6914]">
            Coming Soon
          </span>
        ) : null}
      </div>
      <p className="mt-3 flex-1 font-sans text-[13px] leading-relaxed text-slate-600">{description}</p>
      <div className="mt-6 border-t border-slate-100 pt-4">
        {comingSoon ? (
          <p className="font-sans text-[11px] font-medium uppercase tracking-wide text-slate-400">In development</p>
        ) : (
          <Link
            to={to}
            className="inline-flex items-center font-sans text-[13px] font-semibold text-[#0B2A4A] underline decoration-[#C6A15B]/50 underline-offset-2 transition-colors hover:text-[#C6A15B]"
          >
            Launch tool →
          </Link>
        )}
      </div>
    </article>
  );
}
