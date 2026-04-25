import type { FHAResult } from "../../../hooks/useFHAMath";
import { fmtK } from "../../../hooks/useFHAMath";

type Props = {
  results: FHAResult;
  dpInput: number;
};

export function FHAVerdictBanner({ results, dpInput }: Props) {
  const {
    convWins,
    close,
    diff,
    stay,
    cs,
    crossoverYear,
    dpPercentFha,
    pmiRate,
    pmiMoInit,
  } = results;

  const pmiFree = pmiRate === 0 || pmiMoInit === 0;
  const lowDp = dpPercentFha < 10;

  if (close) {
    return (
      <div
        className="rounded-xl border border-[var(--color-border-tertiary)] p-5 sm:p-6"
        style={{ background: "var(--color-background-warning, #FEF9E8)", borderLeftWidth: 4, borderLeftColor: "#854F0B" }}
      >
        <p className="font-[Georgia,serif] text-[15px] font-medium text-[#633806]">The costs are close — the right answer depends on your plans.</p>
        <p className="mt-2 text-[13px] leading-relaxed text-[#854F0B]">
          Over your {stay}-year timeline, Conventional costs {convWins ? `${fmtK(diff)} less` : "about the same"} as FHA. When the gap is
          this small, your credit score trajectory, flexibility needs, and how long you&apos;ll stay are the deciding factors. Neither loan is
          clearly wrong here.
        </p>
      </div>
    );
  }

  if (convWins) {
    return (
      <div
        className="rounded-xl border border-[var(--color-border-tertiary)] p-5 sm:p-6"
        style={{ background: "var(--color-background-info, #E8F4FC)", borderLeftWidth: 4, borderLeftColor: "#185FA5" }}
      >
        <p className="font-[Georgia,serif] text-[15px] font-medium text-[#0C447C]">
          Conventional saves you {fmtK(diff)} over {stay} years in your situation.
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-[#185FA5]">
          With a {cs}+ credit score and {dpInput}% down, Conventional&apos;s {pmiFree ? "PMI-free " : "PMI "}
          structure costs less than FHA&apos;s lifetime MIP
          {lowDp ? " (which never cancels on your loan)" : ""}.{" "}
          {crossoverYear
            ? `Conventional takes the cost lead at year ${crossoverYear}.`
            : "Conventional is cheaper from year one."}
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border border-[var(--color-border-tertiary)] p-5 sm:p-6"
      style={{ background: "var(--color-background-success, #EAF3DE)", borderLeftWidth: 4, borderLeftColor: "#3B6D11" }}
    >
      <p className="font-[Georgia,serif] text-[15px] font-medium text-[#27500A]">
        FHA saves you {fmtK(diff)} over {stay} years in your situation.
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-[#3B6D11]">
        FHA&apos;s lower rate{cs < 680 ? " and more flexible qualification requirements" : ""} outweigh the MIP cost over your {stay}-year
        timeline.{" "}
        {crossoverYear
          ? `Conventional becomes cheaper after year ${crossoverYear} — if you plan to stay longer, revisiting then could make sense.`
          : "FHA is the stronger financial fit for your timeline."}
      </p>
    </div>
  );
}
