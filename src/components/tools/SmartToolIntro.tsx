import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

type Props = {
  title: string;
  children: ReactNode;
  /** Optional — defaults to "SMART TOOLS" */
  eyebrow?: string;
  className?: string;
};

/**
 * Shared hero for Smart Tools: title + intro copy with a consistent, elevated editorial layout.
 */
export function SmartToolIntro({ title, children, eyebrow = "SMART TOOLS", className = "" }: Props) {
  return (
    <header
      className={`relative mb-10 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_0_rgba(11,42,74,0.04),0_18px_48px_-28px_rgba(11,42,74,0.12)] ${className}`}
    >
      {/* Soft mesh + corner glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_100%_-10%,rgba(198,161,91,0.14),transparent_55%),radial-gradient(ellipse_70%_50%_at_0%_100%,rgba(11,42,74,0.06),transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 -top-24 h-48 w-48 rounded-full bg-[#C6A15B]/[0.07] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-[#0B2A4A]/[0.04] blur-3xl"
        aria-hidden
      />

      <div className="relative flex gap-0 sm:gap-0">
        {/* Gold + navy accent rail (reads like a refined “brace” without a literal glyph) */}
        <div
          className="w-[5px] shrink-0 rounded-l-2xl bg-gradient-to-b from-[#C6A15B] via-[#0B2A4A] to-[#C6A15B]/70 sm:w-1.5"
          aria-hidden
        />

        <div className="min-w-0 flex-1 px-5 py-8 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.32em] text-[#0B2A4A]/55">
              {eyebrow}
            </p>
            <Sparkles
              className="h-5 w-5 shrink-0 text-[#C6A15B]/90 sm:h-[1.35rem] sm:w-[1.35rem]"
              strokeWidth={1.5}
              aria-hidden
            />
          </div>

          <h1 className="mt-5 font-[Georgia,serif] text-[1.45rem] font-medium leading-[1.12] tracking-[-0.02em] text-[#0B2A4A] sm:text-[1.65rem] lg:text-[1.8rem]">
            {title}
          </h1>

          <div
            className="mt-6 max-w-3xl space-y-4 text-[14px] leading-[1.68] text-slate-600 [&>p]:m-0 [&>p>a]:font-semibold [&>p>a]:text-[#0B2A4A] [&>p>a]:underline [&>p>a]:decoration-[#C6A15B]/45 [&>p>a]:underline-offset-[3px] [&>p>a]:transition-colors hover:[&>p>a]:text-[#B48E48] [&>p:not(:first-of-type)]:text-[13px] [&>p:not(:first-of-type)]:leading-relaxed [&>p:not(:first-of-type)]:text-[rgba(11,42,74,0.82)]"
          >
            {children}
          </div>
        </div>
      </div>
    </header>
  );
}
