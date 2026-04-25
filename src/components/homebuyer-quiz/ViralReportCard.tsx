import { Award } from "lucide-react";
import type { ViralReportCard as ViralReportCardModel } from "../../lib/financialReality/engine";

type Props = {
  card: ViralReportCardModel;
};

/**
 * Screenshot-first shareable summary — day mode, high contrast.
 */
export function ViralReportCard({ card }: Props) {
  const pct = card.buyingReadinessScore;

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="relative overflow-hidden rounded-2xl border border-black/[0.05] bg-white px-6 py-8 shadow-[0_20px_56px_rgba(11,31,58,0.08)] transition-transform duration-300 hover:-translate-y-1 sm:px-8 sm:py-10">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#D4AF37]/[0.08]" aria-hidden />
        <div className="absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-[#0B1F3A]/[0.04]" aria-hidden />

        <div className="relative text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37]/15 text-[#B8941E] ring-2 ring-[#D4AF37]/25">
            <Award className="h-6 w-6" strokeWidth={1.5} aria-hidden />
          </div>
          <p className="mt-4 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[rgba(11,31,58,0.5)]">{card.cardTitle}</p>
          <p className="mt-5 font-heading text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[rgba(11,31,58,0.65)]">You are:</p>
          <p className="mt-2 font-heading text-[1.35rem] font-bold leading-tight tracking-[-0.03em] text-[#0B1F3A] sm:text-[1.5rem]">
            {card.identityLabel}
          </p>
        </div>

        <p className="relative mt-7 border-t border-black/[0.06] pt-7 text-center font-heading text-[1.05rem] font-semibold leading-snug text-[#0B1F3A] sm:text-[1.1rem]">
          {card.oneLineTruth}
        </p>

        <div className="relative mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-black/[0.06] bg-[#F7F9FC] px-3 py-3 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[rgba(11,31,58,0.5)]">Buying power</p>
            <p className="mt-1.5 font-heading text-[0.95rem] font-bold tabular-nums text-[#0B1F3A]">{card.estimatedBuyingPower}</p>
          </div>
          <div className="rounded-xl border border-black/[0.06] bg-[#F7F9FC] px-3 py-3 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[rgba(11,31,58,0.5)]">Monthly PITI</p>
            <p className="mt-1.5 font-heading text-[0.8rem] font-bold leading-tight tabular-nums text-[#0B1F3A] sm:text-[0.85rem]">
              {card.estimatedMonthlyPayment}
            </p>
          </div>
          <div className="rounded-xl border border-black/[0.06] bg-[#F7F9FC] px-3 py-3 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[rgba(11,31,58,0.5)]">Confidence</p>
            <p className="mt-1.5 font-heading text-[0.95rem] font-bold text-[#0B1F3A]">{card.confidenceLevelLabel}</p>
          </div>
        </div>

        <div className="relative mt-8 rounded-xl border border-[#D4AF37]/25 bg-[rgba(212,175,55,0.06)] px-4 py-4 text-left">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#B8941E]">Belief check</p>
          <p className="mt-2 text-[13px] text-[rgba(11,31,58,0.72)]">
            {card.beliefCheckLabel}: <span className="font-medium text-[#0B1F3A]">&ldquo;{card.beliefYouMayThink}&rdquo;</span>
          </p>
          <p className="mt-3 text-[13px] font-semibold text-[#0B1F3A]">{card.beliefButLine}</p>
        </div>

        <div className="relative mt-6 rounded-xl border border-amber-200/90 bg-gradient-to-b from-amber-50/95 to-amber-50/50 px-4 py-4">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.12em] text-amber-950/80">{card.lossStripLabel}</p>
          <ul className="mt-3 space-y-2 text-[12px] leading-snug text-amber-950 sm:text-[13px]">
            <li className="flex justify-between gap-2 border-b border-amber-200/60 pb-2">
              <span className="text-amber-950/85">Rent (12 mo band)</span>
              <span className="shrink-0 font-semibold tabular-nums text-[#D64545]">{card.consequenceRentRange}</span>
            </li>
            <li className="flex justify-between gap-2 border-b border-amber-200/60 pb-2">
              <span className="text-amber-950/85">Payment drift</span>
              <span className="shrink-0 font-semibold tabular-nums text-[#D64545]">{card.consequencePaymentRange}/mo</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-amber-950/85">Buying power shift</span>
              <span className="shrink-0 font-semibold tabular-nums text-[#D64545]">{card.consequenceBuyingPowerRange}</span>
            </li>
          </ul>
        </div>

        <div className="relative mt-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[rgba(11,31,58,0.5)]">What would improve your position</p>
          <ul className="mt-3 space-y-1.5 text-[13px] font-medium leading-snug text-[#0B1F3A]">
            {card.prescriptionShort.map((line) => (
              <li key={line}>• {line}</li>
            ))}
          </ul>
        </div>

        <div className="relative mt-8 flex flex-col items-center gap-3 rounded-xl border border-black/[0.06] bg-[#F7F9FC] px-4 py-5">
          <div className="flex w-full max-w-[220px] items-center justify-between gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[rgba(11,31,58,0.5)]">Readiness</span>
            <span className="font-heading text-2xl font-bold tabular-nums text-[#0B1F3A]">{pct}</span>
            <span className="text-[11px] font-medium text-[rgba(11,31,58,0.4)]">/100</span>
          </div>
          <div className="h-2.5 w-full max-w-[240px] overflow-hidden rounded-full bg-slate-200/90">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#e5c85c]"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[13px] text-[#0B1F3A]">
            <span className="font-semibold">Position:</span> {card.positionStatus}
          </p>
          <p className="text-[12px] text-[rgba(11,31,58,0.55)]">
            Confidence level: <span className="font-medium text-[#0B1F3A]">{card.confidenceLevelLabel}</span>
          </p>
        </div>

        <p className="relative mt-8 text-center text-[11px] leading-relaxed text-[rgba(11,31,58,0.45)]">
          Illustrative only — not a loan approval.
        </p>
      </div>
    </div>
  );
}
