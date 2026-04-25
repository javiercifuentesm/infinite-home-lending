import type { MicDropEngine } from "../../lib/financialReality/engine";

type Props = {
  micDrop: MicDropEngine;
};

const CARD =
  "relative isolate overflow-hidden rounded-2xl border border-black/[0.05] bg-white px-6 py-12 shadow-[0_24px_64px_rgba(11,31,58,0.08)] transition-transform duration-300 hover:-translate-y-1 sm:px-10 sm:py-14";

/**
 * Single undeniable line — last beat before CTA. Day mode, premium.
 */
export function MicDropPanel({ micDrop }: Props) {
  const { micDropLine, supportingSnap } = micDrop;

  return (
    <section className={CARD} aria-labelledby="mic-drop-heading">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          background:
            "linear-gradient(180deg, rgba(212,175,55,0.1) 0%, rgba(255,255,255,0) 42%, rgba(247,249,252,0.9) 100%)",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-[#D4AF37]" aria-hidden />
      <div className="pointer-events-none absolute -right-16 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[#D4AF37]/[0.07] blur-3xl" aria-hidden />

      <div className="relative text-center">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-[#B8941E]">Mic drop</p>
        <p
          id="mic-drop-heading"
          className="mx-auto mt-6 max-w-[22ch] font-heading text-[1.45rem] font-bold leading-[1.2] tracking-[-0.03em] text-[#0B1F3A] sm:max-w-[28ch] sm:text-[1.65rem] sm:leading-[1.18]"
        >
          {micDropLine}
        </p>
        {supportingSnap ? (
          <p className="mx-auto mt-6 max-w-md font-sans text-[14px] font-medium leading-relaxed text-[rgba(11,31,58,0.65)] sm:text-[15px]">
            {supportingSnap}
          </p>
        ) : null}
      </div>
    </section>
  );
}
