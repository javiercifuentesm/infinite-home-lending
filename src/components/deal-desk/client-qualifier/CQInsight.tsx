import type { ClientQualifierResults } from "../../../hooks/useClientQualifierMath";

type Props = { results: ClientQualifierResults };

export function CQInsight({ results }: Props) {
  return (
    <div
      className="rounded-r-lg border border-[rgba(11,42,74,0.08)] border-l-[3px] border-l-[#C6A15B] py-[0.85rem] pl-4 pr-4"
      style={{ background: "rgba(11,42,74,0.03)" }}
    >
      <p className="font-sans text-[10px] font-semibold uppercase tracking-wide text-[#C6A15B]">📋 Agent note</p>
      <p className="mt-1 font-[Georgia,serif] text-[13px] italic leading-[1.6] text-[#0B2A4A]">{results.insight}</p>
    </div>
  );
}
