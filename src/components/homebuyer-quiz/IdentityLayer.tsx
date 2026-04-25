import { UserRound } from "lucide-react";
import type { IdentityLayer as IdentityLayerModel } from "../../lib/financialReality/engine";

type Props = {
  identity: IdentityLayerModel;
};

/**
 * Emotional bridge — pattern recognition, mirror, reframe. Not advice.
 */
export function IdentityLayer({ identity }: Props) {
  const { identityHeadline, behaviorMirror, rootCause, consequenceReframe, identityReframe, shareableLine } = identity;

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-navy/8 bg-gradient-to-b from-[#fafbfc] to-white shadow-[0_16px_48px_rgba(10,25,47,0.06)]"
      aria-labelledby="identity-layer-heading"
    >
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-gold/[0.06] blur-2xl" aria-hidden />
      <div className="relative px-7 py-8 sm:px-10 sm:py-10">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy/90 text-gold ring-2 ring-gold/20">
            <UserRound className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </span>
          <div>
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-navy/45">Recognition</p>
            <p className="font-sans text-[11px] text-slate-500">Psychological clarity — not a pitch</p>
          </div>
        </div>

        <h2 id="identity-layer-heading" className="mt-8 font-heading text-[1.35rem] font-bold leading-[1.25] tracking-[-0.02em] text-navy sm:text-[1.5rem]">
          {identityHeadline}
        </h2>

        <div className="mt-8 space-y-8 border-t border-slate-200/90 pt-8">
          <div>
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">What you’ve been doing</p>
            <p className="mt-2 text-[15px] font-medium leading-relaxed text-navy">{behaviorMirror}</p>
          </div>

          <div>
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Why it feels stuck</p>
            <p className="mt-2 text-[15px] leading-relaxed text-navy/95">{rootCause}</p>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white px-5 py-4 shadow-sm">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-900/70">What waiting actually does</p>
            <p className="mt-2 text-[15px] leading-relaxed text-navy">{consequenceReframe}</p>
          </div>

          <div className="rounded-xl border-l-4 border-gold/60 bg-gold/[0.06] px-5 py-4">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-navy/55">Who you actually are</p>
            <p className="mt-2 text-[16px] font-semibold leading-snug text-navy">{identityReframe}</p>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-navy/10 bg-navy/[0.03] px-5 py-5 text-center">
          <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-navy/40">Shareable</p>
          <p className="mt-2 font-heading text-[1.05rem] font-semibold leading-snug text-navy sm:text-[1.1rem]">
            &ldquo;{shareableLine}&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
