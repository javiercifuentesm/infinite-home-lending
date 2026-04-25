import type { PresentTenseEngine } from "../../lib/financialReality/engine";
import { SharpStrip } from "./SharpStrip";

type Props = {
  data: PresentTenseEngine;
};

/**
 * Present-tense bill — personal loss framing (day mode).
 */
export function PresentTensePanel({ data }: Props) {
  const {
    sharp,
    numberWeapon,
    personalLossPrimary,
    moneyGoneLine,
    presentRealityHeadline,
    thisMonthLabel,
    lineRent,
    lineEquity,
    linePrice,
    totalImpactLine,
    lossAccumulation,
    irreversibleLossLine,
    lossContrast,
    presentConsequence,
    realityCollision,
  } = data;

  const card = "border border-black/[0.05] bg-white shadow-[0_12px_40px_rgba(11,31,58,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(11,31,58,0.09)]";

  return (
    <section
      className={`overflow-hidden rounded-2xl ${card}`}
      aria-labelledby="present-tense-heading"
    >
      <div className="border-b border-black/[0.05] bg-[#F7F9FC] px-6 py-8 sm:px-8 sm:py-10">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">Present tense</p>
        <p className="mt-4 font-heading text-[1.2rem] font-bold leading-snug text-[#0B1F3A] sm:text-[1.35rem]">{personalLossPrimary}</p>
        <p className="mt-3 text-[16px] font-semibold text-[#B83838] md:text-[17px]">{moneyGoneLine}</p>
        <p className="mt-3 font-mono text-[13px] font-bold tracking-tight text-[#B83838] sm:text-[14px]">{numberWeapon}</p>
        <div className="mt-6">
          <SharpStrip sharp={sharp} title="Sharp lines" />
        </div>
        <h2
          id="present-tense-heading"
          className="mt-6 font-heading text-[1.2rem] font-bold leading-snug text-[#0B1F3A] sm:text-[1.35rem] md:text-[1.45rem]"
        >
          {presentRealityHeadline}
        </h2>
      </div>

      <div className="border-b border-black/[0.05] bg-white px-6 py-6 sm:px-8">
        <p className="font-heading text-[12px] font-bold uppercase tracking-[0.12em] text-[#0B1F3A]/55">{thisMonthLabel}</p>
        <ul className="mt-4 space-y-2.5 font-mono text-[13px] leading-relaxed text-[#0B1F3A] sm:text-[14px]">
          <li className="border-b border-black/[0.05] pb-2">{lineRent}</li>
          <li className="border-b border-black/[0.05] pb-2">{lineEquity}</li>
          <li>{linePrice}</li>
        </ul>
        <p className="mt-5 border-t-2 border-[#0B1F3A]/15 pt-4 text-center font-heading text-[1.05rem] font-bold leading-snug text-[#B83838] sm:text-[1.1rem]">
          {totalImpactLine}
        </p>
      </div>

      <div className="border-b border-black/[0.05] bg-[#F7F9FC] px-6 py-6 sm:px-8">
        <p className="text-[15px] font-medium leading-relaxed text-[#0B1F3A]/75 md:text-[16px]">{lossAccumulation}</p>
        <p className="mt-3 text-[15px] font-semibold leading-relaxed text-[#0B1F3A] md:text-[16px]">{irreversibleLossLine}</p>
      </div>

      <div className="border-b border-black/[0.05] bg-white px-6 py-6 sm:px-8">
        <p className="text-[15px] font-medium leading-relaxed text-[#0B1F3A]/80 md:text-[16px]">{lossContrast}</p>
      </div>

      <div className="space-y-4 bg-white px-6 py-8 sm:px-8 sm:py-10">
        <p className="text-[16px] font-semibold leading-relaxed text-[#0B1F3A] md:text-[17px]">{presentConsequence}</p>
        <p className="border-l-4 border-[#D4AF37] bg-[#D4AF37]/[0.07] py-3 pl-4 pr-3 font-heading text-[1.05rem] font-bold leading-snug text-[#0B1F3A] md:text-[1.1rem]">
          {realityCollision}
        </p>
      </div>
    </section>
  );
}
