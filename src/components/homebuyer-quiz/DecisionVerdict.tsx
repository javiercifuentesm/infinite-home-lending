import type { DecisionEngine } from "../../lib/financialReality/engine";
import { SharpStrip } from "./SharpStrip";

type Props = {
  decision: DecisionEngine;
};

const confidenceStyles: Record<DecisionEngine["confidenceLevel"], string> = {
  High: "border-emerald-200/90 bg-emerald-50 text-emerald-950",
  Moderate: "border-amber-200/90 bg-amber-50 text-amber-950",
  Low: "border-black/[0.08] bg-[#F7F9FC] text-[#0B1F3A]",
};

/**
 * Conviction layer — day mode, high contrast.
 */
export function DecisionVerdict({ decision }: Props) {
  const {
    sharp,
    positionLabel,
    realityLead,
    strongVerdict,
    confidenceLevel,
    whatThisMeansLead,
    whatThisMeansBody,
    urgencyLead,
    urgencyConsequence,
    finalLine,
    recommendedAction,
    ifNothing,
    ifAction,
  } = decision;

  return (
    <section
      className="overflow-hidden rounded-2xl border border-black/[0.05] bg-white shadow-[0_16px_48px_rgba(11,31,58,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_56px_rgba(11,31,58,0.1)]"
      aria-labelledby="decision-verdict-heading"
    >
      <div className="border-b border-black/[0.05] bg-[#F7F9FC] px-6 py-9 sm:px-10 sm:py-10">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0B1F3A]/45">Final verdict</p>
        <p id="decision-verdict-heading" className="mt-4 font-heading text-[13px] font-bold uppercase tracking-[0.08em] text-[#D4AF37]">
          {realityLead}
        </p>
        <p className="mt-4 text-[18px] font-bold leading-snug tracking-[-0.02em] text-[#0B1F3A] md:text-[1.125rem]">{strongVerdict}</p>
        <p className="mt-4 inline-flex rounded-full border border-black/[0.08] bg-white px-3 py-1.5 font-heading text-[11px] font-semibold text-[#0B1F3A]/80">
          Your position: {positionLabel}
        </p>
      </div>

      <div className="space-y-5 px-6 py-8 sm:px-8 sm:py-9">
        <SharpStrip sharp={sharp} title="Sharp lines" />
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0B1F3A]/45">Confidence level:</span>
          <span
            className={`inline-flex rounded-full border px-3 py-1 font-heading text-[12px] font-bold ${confidenceStyles[confidenceLevel]}`}
          >
            {confidenceLevel}
          </span>
        </div>

        <div className="rounded-xl border border-black/[0.05] bg-white px-5 py-4 shadow-sm">
          <p className="font-heading text-[13px] font-bold text-[#0B1F3A]">{whatThisMeansLead}</p>
          <p className="mt-3 text-[15px] font-medium leading-relaxed text-[#0B1F3A]/75 md:text-[16px]">{whatThisMeansBody}</p>
        </div>

        <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-5 py-4">
          <p className="font-heading text-[13px] font-bold text-amber-950">{urgencyLead}</p>
          <p className="mt-2 text-[15px] font-semibold leading-snug text-amber-950/95 md:text-[16px]">{urgencyConsequence}</p>
        </div>

        <div className="rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/[0.08] px-5 py-4">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0B1F3A]/55">Recommended next step:</p>
          <p className="mt-2 font-heading text-[1.05rem] font-bold leading-snug text-[#0B1F3A]">{recommendedAction}</p>
        </div>

        <div className="rounded-xl border border-black/[0.05] border-l-4 border-l-[#D4AF37] bg-white px-5 py-5 shadow-[0_8px_28px_rgba(11,31,58,0.06)] transition-all duration-300 hover:-translate-y-0.5 sm:px-6">
          <p className="text-[16px] font-bold leading-snug text-[#0B1F3A] md:text-[1.05rem]">{finalLine}</p>
        </div>

        <div className="grid gap-4 border-t border-black/[0.06] pt-6 sm:grid-cols-2">
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0B1F3A]/45">If you do nothing:</p>
            <p className="mt-2 text-[14px] leading-relaxed text-[#0B1F3A]/80 md:text-[15px]">{ifNothing}</p>
          </div>
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-emerald-800/80">If you take action:</p>
            <p className="mt-2 text-[14px] leading-relaxed text-[#0B1F3A]/80 md:text-[15px]">{ifAction}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
