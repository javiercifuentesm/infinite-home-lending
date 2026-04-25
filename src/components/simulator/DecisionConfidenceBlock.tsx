import { motion } from "motion/react";
import type { DecisionConfidence } from "../../lib/simulatorInterpretation";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { EASE_PREMIUM } from "../../lib/motionConfig";

const toneStyles: Record<
  DecisionConfidence["tone"],
  { pill: string; micro: string; bar: string }
> = {
  strong: {
    pill: "border-gold/40 bg-gold/[0.08] text-navy ring-1 ring-inset ring-gold/15",
    micro: "text-slate-600",
    bar: "bg-gradient-to-r from-gold/70 via-gold/45 to-gold/25",
  },
  moderate: {
    pill: "border-gold/28 bg-gold/[0.04] text-navy/95 ring-1 ring-inset ring-gold/10",
    micro: "text-slate-500",
    bar: "bg-gradient-to-r from-gold/45 via-gold/30 to-gold/15",
  },
  close: {
    pill: "border-slate-200/90 bg-slate-50/80 text-navy/75",
    micro: "text-slate-500",
    bar: "bg-gradient-to-r from-slate-300/60 via-slate-200/50 to-slate-200/30",
  },
  mixed: {
    pill: "border-slate-200/85 bg-slate-50/60 text-navy/85",
    micro: "text-slate-500",
    bar: "bg-gradient-to-r from-slate-300/50 via-slate-200/40 to-transparent",
  },
};

export function DecisionConfidenceBlock({
  confidence,
  transitionKey,
  className = "",
}: {
  confidence: DecisionConfidence;
  /** Typically `selectedHorizon` — drives subtle refresh on horizon change. */
  transitionKey: string | number;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const s = toneStyles[confidence.tone];

  return (
    <motion.div
      key={`${transitionKey}-${confidence.label}`}
      initial={reduced ? false : { opacity: 0.88, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.38, ease: EASE_PREMIUM }}
      className={`${className}`}
      data-slot="decision-confidence"
    >
      <div
        className={`inline-flex flex-col gap-2 rounded-[3px] border px-3 py-2.5 sm:px-3.5 sm:py-3 ${s.pill}`}
      >
        <div className="flex items-center gap-2">
          <span className={`h-0.5 w-7 shrink-0 rounded-full ${s.bar}`} aria-hidden />
          <span className="text-[11px] sm:text-[12px] font-semibold tracking-[0.02em] leading-tight">
            {confidence.label}
          </span>
        </div>
        <p className={`text-[11px] sm:text-[12px] leading-[1.5] ${s.micro}`}>
          {confidence.microcopy}
        </p>
      </div>
    </motion.div>
  );
}
