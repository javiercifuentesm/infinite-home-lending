import type { ReverseResult } from "../../../hooks/useReverseMath";
import { fmt } from "../../../hooks/useReverseMath";

type Props = {
  results: ReverseResult;
};

export function ReverseHeirSnapshot({ results }: Props) {
  const y = results.yr10;

  return (
    <div
      className="rounded-xl border border-[rgba(11,42,74,0.12)] p-5 sm:p-6"
      style={{ background: "rgba(11,42,74,0.04)" }}
    >
      <h3 className="text-[13px] font-medium text-[#0B2A4A]">Inheritance picture at year 10</h3>
      <div className="mt-4 space-y-0 border-t border-[var(--color-border-tertiary)]">
        <SnapRow label="Home value at year 10" value={fmt(y.homeValue)} />
        <SnapRow label="Loan balance at year 10" value={fmt(y.loanBalance)} />
        <SnapRow label="Remaining equity (heirs keep)" value={fmt(Math.max(0, y.equity))} highlight />
        <SnapRow
          label="Non-recourse protection"
          value="Yes — heirs never owe more than home value"
          highlight
        />
        <SnapRow label="Heirs' option" value="Sell home, repay loan, keep difference" last />
      </div>
    </div>
  );
}

function SnapRow({
  label,
  value,
  highlight,
  last,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className={`flex min-h-[44px] flex-wrap items-center justify-between gap-3 py-3 text-[14px] ${
        last ? "" : "border-b-[0.5px] border-[var(--color-border-tertiary)]"
      }`}
    >
      <span className="text-[var(--color-text-tertiary)]">{label}</span>
      <span className={`max-w-[18rem] text-right font-semibold ${highlight ? "text-[#27500A]" : "text-[#0B2A4A]"}`}>
        {value}
      </span>
    </div>
  );
}
