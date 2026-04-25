import type { ReverseResult } from "../../../hooks/useReverseMath";
import { fmt } from "../../../hooks/useReverseMath";

type Props = {
  results: ReverseResult;
};

export function ReverseMetrics({ results }: Props) {
  const { grossPL, netPL, tenurePayment, incomeGap } = results;

  let m4Value: string;
  let m4Sub: string;
  if (incomeGap <= 0) {
    m4Value = "No gap";
    m4Sub = "income exceeds expenses";
  } else if (tenurePayment >= incomeGap) {
    m4Value = "Fully";
    m4Sub = `${fmt(incomeGap)}/mo gap`;
  } else {
    m4Value = "Partially";
    m4Sub = `${fmt(incomeGap)}/mo gap`;
  }

  const cards = [
    { label: "Gross principal limit", value: fmt(grossPL), sub: "before costs & payoff" },
    { label: "Net available proceeds", value: fmt(netPL), sub: "after mortgage & closing costs" },
    { label: "Max monthly (tenure)", value: fmt(tenurePayment), sub: "for life, in your home" },
    { label: "Income gap covered", value: m4Value, sub: m4Sub },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-[var(--border-radius-md)] px-4 py-4"
          style={{ background: "var(--color-background-secondary)" }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">{c.label}</p>
          <p className="mt-2 font-[Georgia,serif] text-xl font-semibold text-[#0B2A4A]">{c.value}</p>
          <p className="mt-1 text-[13px] leading-snug text-[var(--color-text-tertiary)]">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}
