import type { PowerMapInputs, PowerMapResults } from "../../../hooks/usePowerMapMath";
import { fmtK } from "../../../hooks/usePowerMapMath";

type Props = {
  inputs: PowerMapInputs;
  results: PowerMapResults;
};

export function PMImpactGrid({ inputs, results }: Props) {
  const {
    creditImpactPrice,
    debtImpactPrice,
    incomeImpactPrice,
    m12Savings,
    baseRate,
    impRate,
  } = results;
  const { creditImp, debtPayoff, incomeGrowth } = inputs;

  const cards = [
    {
      border: "#185FA5",
      label: `Credit improvement (+${creditImp} pts)`,
      value: creditImp > 0 ? `+${fmtK(creditImpactPrice)}` : "$0",
      sub:
        creditImp > 0 ? `Rate: ${baseRate.toFixed(3)}% → ${impRate.toFixed(3)}%` : "Adjust slider above",
    },
    {
      border: "#3B6D11",
      label: `Debt payoff ($${debtPayoff}/mo)`,
      value: debtPayoff > 0 ? `+${fmtK(debtImpactPrice)}` : "$0",
      sub: debtPayoff > 0 ? "DTI improves, more room for mortgage" : "Adjust slider above",
    },
    {
      border: "#C6A15B",
      label: "12-mo savings projection",
      value: fmtK(m12Savings),
      sub: "Total saved toward down payment in 12 months",
    },
    {
      border: "#854F0B",
      label: `Income growth ($${incomeGrowth.toLocaleString("en-US")}/yr)`,
      value: incomeGrowth > 0 ? `+${fmtK(incomeImpactPrice)}` : "$0",
      sub: incomeGrowth > 0 ? "More qualifying income, more home" : "Adjust slider above",
    },
  ];

  return (
    <div>
      <h3 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">How each improvement moves the needle</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-lg border border-slate-200/80 bg-slate-50/90 p-4 pl-5"
            style={{ borderLeftWidth: "3px", borderLeftColor: c.border }}
          >
            <p className="text-[11px] text-slate-500">{c.label}</p>
            <p className="mt-2 text-[18px] font-medium text-[#0B2A4A]">{c.value}</p>
            <p className="mt-1 text-[10px] text-slate-500">{c.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
