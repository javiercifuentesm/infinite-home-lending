import { Lock } from "lucide-react";
import type { IrreversibilityEngine } from "../../lib/financialReality/engine";
import { SharpStrip } from "./SharpStrip";

type Props = {
  data: IrreversibilityEngine;
};

function FinalInsightHeadline({ text }: { text: string }) {
  const key = "costing you money";
  const lower = text.toLowerCase();
  const idx = lower.indexOf(key);
  if (idx === -1) {
    return <>{text}</>;
  }
  return (
    <>
      {text.slice(0, idx)}
      <span className="font-semibold text-[#D4AF37]">{text.slice(idx, idx + key.length)}</span>
      {text.slice(idx + key.length)}
    </>
  );
}

/**
 * Irreversibility — day mode, final insight as conversion highlight.
 */
export function IrreversibilityPanel({ data }: Props) {
  const {
    sharp,
    irreversibleHeadline,
    lockInScenario,
    lockInSecondary,
    opportunityLossSnapshot,
    pointOfNoReturn,
    identityTrigger,
    finalPressureLine,
    finalInsightSubline,
  } = data;

  const card =
    "rounded-2xl border border-black/[0.05] bg-white p-6 shadow-[0_12px_40px_rgba(11,31,58,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(11,31,58,0.09)] md:p-8";

  return (
    <section
      className="overflow-hidden rounded-2xl border border-black/[0.05] bg-white shadow-[0_16px_48px_rgba(11,31,58,0.07)]"
      aria-labelledby="irreversibility-heading"
    >
      <div className="border-b border-black/[0.05] bg-[#F7F9FC] px-6 py-10 sm:px-10 sm:py-12">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/15 text-[#B8941C] ring-1 ring-[#D4AF37]/30">
            <Lock className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </span>
          <div>
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">Irreversibility</p>
            <p className="font-sans text-[13px] text-[#0B1F3A]/65">Reality → consequence → pattern → close</p>
          </div>
        </div>
        <h2
          id="irreversibility-heading"
          className="mt-8 font-heading text-[1.65rem] font-bold leading-snug text-[#0B1F3A] sm:text-[1.85rem] md:text-[2rem]"
        >
          {irreversibleHeadline}
        </h2>
        <div className="mt-8 rounded-xl border border-black/[0.05] bg-white p-5 md:p-6">
          <SharpStrip sharp={sharp} title="Sharp lines" />
        </div>
      </div>

      <div className="space-y-8 px-6 py-10 sm:px-10 sm:py-12">
        <div className={card}>
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">Reality</p>
          <p className="mt-3 text-[17px] font-medium leading-relaxed text-[#0B1F3A] md:text-[18px]">{lockInScenario}</p>
          <p className="mt-4 text-[15px] leading-relaxed text-[#0B1F3A]/65 md:text-[16px]">{lockInSecondary}</p>
        </div>

        <div className="rounded-2xl border border-[#D64545]/15 bg-[rgba(214,69,69,0.05)] px-6 py-6 md:px-8 md:py-7">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[#B83838]">Consequence</p>
          <ul className="mt-4 space-y-3 text-[15px] font-medium leading-snug text-[#0B1F3A] md:text-[16px]">
            <li className="border-b border-[#D64545]/10 pb-3">
              <span className="font-semibold text-[#B83838]">{opportunityLossSnapshot.line1}</span>
            </li>
            <li className="border-b border-[#D64545]/10 pb-3">
              <span className="font-semibold text-[#B83838]">{opportunityLossSnapshot.line2}</span>
            </li>
            <li>
              <span className="font-semibold text-[#B83838]">{opportunityLossSnapshot.line3}</span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border-l-4 border-[#D4AF37] bg-[#F7F9FC] px-6 py-5 md:px-8">
          <p className="font-heading text-[17px] font-semibold leading-snug text-[#0B1F3A] md:text-[1.15rem]">{pointOfNoReturn}</p>
        </div>

        <div className={card}>
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0B1F3A]/45">Pattern</p>
          <p className="mt-3 text-[16px] leading-relaxed text-[#0B1F3A]/80 md:text-[17px]">{identityTrigger}</p>
        </div>

        {/* FINAL INSIGHT — white card, gold gradient wash, soft glow pulse */}
        <div
          className="animate-final-insight-glow rounded-2xl border border-[#D4AF37]/25 border-l-4 border-l-[#D4AF37] px-8 py-10 text-center md:px-10 md:py-12"
          style={{
            background: "linear-gradient(180deg, rgba(212,175,55,0.08) 0%, rgba(255,255,255,0) 55%), #FFFFFF",
          }}
        >
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">Final insight</p>
          <p className="mt-6 text-[20px] font-semibold leading-snug text-[#0B1F3A] md:text-[22px] md:leading-snug">
            <FinalInsightHeadline text={finalPressureLine} />
          </p>
          <p className="mx-auto mt-4 max-w-md text-[15px] font-medium leading-relaxed text-[#0B1F3A]/65 md:text-[16px]">
            {finalInsightSubline}
          </p>
        </div>

        <p className="text-center text-[12px] leading-relaxed text-[#0B1F3A]/45">
          Illustrative path — not a prediction, quote, or commitment.
        </p>
      </div>
    </section>
  );
}
