import { motion } from "motion/react";
import { AlertTriangle, Zap } from "lucide-react";
import type { FinancialRealityOutcome } from "../../lib/financialReality/engine";
import { formatBuyingPowerRange, formatCurrency } from "../../lib/financialReality/engine";
import { IdentityLayer } from "./IdentityLayer";

const TI_TAX_SHARE = 0.58;

type Props = {
  outcome: FinancialRealityOutcome;
};

/**
 * Long-form breakdown (beliefs, numbers, outlook) — used inside collapsible “details” regions.
 */
export function FinancialRealityDeepDive({ outcome }: Props) {
  const {
    numbers: n,
    narrative,
    beliefBreak,
    identity,
    consequence,
    consequenceBullets,
    opportunityShift,
  } = outcome;
  const { primaryConstraintLabel, primaryConstraintDetail, rootCause, prescription, outlook, secondaryNote } = narrative;

  const taxLow = Math.round(n.taxInsMonthlyLow * TI_TAX_SHARE);
  const taxHigh = Math.round(n.taxInsMonthlyHigh * TI_TAX_SHARE);
  const insLow = Math.round(n.taxInsMonthlyLow * (1 - TI_TAX_SHARE));
  const insHigh = Math.round(n.taxInsMonthlyHigh * (1 - TI_TAX_SHARE));

  return (
    <div className="space-y-8 border-t border-black/[0.06] px-4 pb-8 pt-6 sm:px-6">
      <IdentityLayer identity={identity} />

      <section className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white via-[#f8f9fc] to-[#f1f3f9] p-7 shadow-[0_12px_40px_rgba(10,25,47,0.07)] sm:p-9">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold ring-1 ring-gold/25">
            <Zap className="h-4 w-4" strokeWidth={1.85} aria-hidden />
          </span>
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-navy/70">Belief break</p>
        </div>

        <div className="mt-6 rounded-xl border border-gold/20 bg-white/80 px-5 py-4 shadow-sm sm:px-6 sm:py-5">
          <p className="text-[13px] font-medium text-slate-600">You likely believe:</p>
          <p className="mt-2 font-heading text-[1.05rem] font-semibold leading-snug text-navy sm:text-[1.15rem]">
            &ldquo;{beliefBreak.assumedBelief}&rdquo;
          </p>
        </div>

        <p className="mt-5 text-[14px] font-semibold text-navy">{beliefBreak.breakLead}</p>
        <p className="mt-3 text-[15px] leading-relaxed text-navy/95">{beliefBreak.challenge}</p>

        <div className="mt-8 border-t border-slate-200/80 pt-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-slate-500">In your case</p>
          <ul className="mt-3 space-y-2.5 text-[14px] leading-snug text-navy">
            <li>{beliefBreak.inYourCase.paymentLine}</li>
            <li>{beliefBreak.inYourCase.incomeLine}</li>
            <li className="font-medium">{beliefBreak.inYourCase.constraintLine}</li>
          </ul>
        </div>

        <p className="mt-6 text-[15px] font-semibold leading-snug text-navy">{beliefBreak.reframe}</p>

        <div className="mt-6 rounded-lg border border-slate-200/90 bg-slate-50/90 px-4 py-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-600">If you continue thinking this way:</p>
          <ul className="mt-3 space-y-2 text-[14px] leading-snug text-navy/95">
            {beliefBreak.thinkingConsequence.map((line, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-gold">•</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 rounded-xl border border-gold/20 bg-gold/[0.08] px-5 py-4">
          <p className="text-[13px] font-semibold text-navy">{beliefBreak.newBelief.headline}</p>
          <p className="mt-2 text-[15px] leading-relaxed text-navy">{beliefBreak.newBelief.body}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <h3 className="font-heading text-[1.05rem] font-semibold text-navy sm:text-lg">Primary Constraint</h3>
        <p className="mt-5 text-[15px] leading-relaxed text-navy/95">Right now, the biggest factor holding you back is:</p>
        <p className="mt-3 rounded-lg border-l-4 border-gold/55 bg-slate-50/90 pl-5 pr-4 py-4 text-[16px] font-semibold leading-snug text-navy">
          {primaryConstraintLabel}
          <span className="mt-2 block text-[14px] font-normal text-navy/90">{primaryConstraintDetail}</span>
        </p>
        {secondaryNote && <p className="mt-4 text-[13px] leading-relaxed text-slate-600">{secondaryNote}</p>}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <h3 className="font-heading text-[1.05rem] font-semibold text-navy sm:text-lg">What&apos;s causing this</h3>
        <p className="mt-5 text-[15px] leading-relaxed text-navy">{rootCause}</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <h3 className="font-heading text-[1.05rem] font-semibold text-navy sm:text-lg">Your financial snapshot</h3>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-100 bg-[#fafbfc] p-5">
            <p className="text-[13px] font-medium text-slate-500">Buying power</p>
            <p className="mt-2 font-heading text-[1.15rem] font-bold text-navy sm:text-xl">
              {formatBuyingPowerRange(n.buyingPowerLow, n.buyingPowerHigh)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-[#fafbfc] p-5">
            <p className="text-[13px] font-medium text-slate-500">Monthly payment</p>
            <p className="mt-2 font-heading text-[1.15rem] font-bold text-navy sm:text-xl">
              {formatCurrency(n.paymentLow)}–{formatCurrency(n.paymentHigh)}
            </p>
          </div>
        </div>

        <h4 className="mt-10 font-heading text-[0.95rem] font-semibold text-navy">Payment breakdown</h4>
        <ul className="mt-4 space-y-3 text-[14px] text-navy">
          <li className="flex flex-wrap justify-between gap-2 border-b border-slate-100 pb-3">
            <span className="text-slate-600">Mortgage</span>
            <span className="font-heading font-bold tabular-nums">
              {formatCurrency(n.piMonthlyLow)}–{formatCurrency(n.piMonthlyHigh)}/mo
            </span>
          </li>
          <li className="flex flex-wrap justify-between gap-2 border-b border-slate-100 pb-3">
            <span className="text-slate-600">Taxes</span>
            <span className="font-heading font-bold tabular-nums">
              {formatCurrency(taxLow)}–{formatCurrency(taxHigh)}/mo
            </span>
          </li>
          <li className="flex flex-wrap justify-between gap-2">
            <span className="text-slate-600">Insurance</span>
            <span className="font-heading font-bold tabular-nums">
              {formatCurrency(insLow)}–{formatCurrency(insHigh)}/mo
            </span>
          </li>
        </ul>

        <p className="mt-6 rounded-xl border border-gold/30 bg-gold/[0.08] px-4 py-3.5 text-[14px] leading-relaxed text-navy">
          Most buyers underestimate total monthly cost by hundreds — this is where decisions go wrong.
        </p>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-amber-200/90 bg-gradient-to-b from-amber-50/95 to-amber-50/70 p-8 shadow-[0_12px_40px_rgba(180,83,9,0.08)] sm:p-10"
      >
        <div className="flex flex-wrap items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800 ring-1 ring-amber-200/80">
            <AlertTriangle className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-900/75">
              If you don&apos;t act, here&apos;s what happens
            </p>
            <h3 className="mt-2 font-heading text-[1.1rem] font-semibold leading-snug text-amber-950 sm:text-[1.25rem]">
              Where this path leads
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-amber-950/80">If nothing changes:</p>
          </div>
        </div>

        <ul className="mt-6 space-y-3.5 text-[15px] leading-relaxed text-amber-950">
          {consequenceBullets.map((line, i) => (
            <li key={i} className="flex gap-2">
              <span className="shrink-0 text-amber-600">•</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <p className="mt-6 border-t border-amber-200/80 pt-5 text-[13px] italic leading-relaxed text-amber-950/85">
          {consequence.confidence_impact}
        </p>
      </motion.section>

      <section className="rounded-2xl border border-emerald-200/60 bg-emerald-50/40 p-8 shadow-sm sm:p-10">
        <h3 className="font-heading text-[1.05rem] font-semibold text-navy sm:text-lg">{opportunityShift.headline}</h3>
        <p className="mt-4 text-[15px] leading-relaxed text-navy">{opportunityShift.body}</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <h3 className="font-heading text-[1.05rem] font-semibold text-navy sm:text-lg">What would improve your situation most</h3>
        <p className="mt-4 text-[14px] text-slate-600">To move forward effectively:</p>
        <ol className="mt-5 list-decimal space-y-3 pl-5 text-[15px] leading-relaxed text-navy marker:font-semibold marker:text-gold">
          {prescription.map((line, i) => (
            <li key={i} className="pl-1">
              {line}
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <h3 className="font-heading text-[1.05rem] font-semibold text-navy sm:text-lg">Outlook</h3>
        <p className="mt-5 text-[15px] leading-relaxed text-navy">{outlook}</p>
      </section>
    </div>
  );
}
