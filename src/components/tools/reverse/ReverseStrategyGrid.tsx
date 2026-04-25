import type { ReverseInputs, ReverseResult } from "../../../hooks/useReverseMath";
import { fmt, fmtK } from "../../../hooks/useReverseMath";

export type StratId = "lump" | "tenure" | "term" | "loc";

type Props = {
  inputs: ReverseInputs;
  results: ReverseResult;
  activeStrat: StratId;
  onSelectStrat: (id: StratId) => void;
};

const STRATS: {
  id: StratId;
  badge: string;
  badgeClass: string;
  name: string;
  desc: string;
  best: string;
}[] = [
  {
    id: "lump",
    badge: "Lump sum",
    badgeClass: "bg-[#FAEEDA] text-[#633806]",
    name: "One-time lump sum",
    desc: "Receive all proceeds at closing. Fixed rate. Best for paying off debt, funding large purchases, or emergency reserves.",
    best: "Best if: you have immediate large financial needs",
  },
  {
    id: "tenure",
    badge: "Monthly income",
    badgeClass: "bg-[#EAF3DE] text-[#27500A]",
    name: "Lifetime monthly payments",
    desc: "Guaranteed monthly payment for as long as you live in the home. Payment continues even if balance exceeds home value.",
    best: "Best if: you need steady income to cover monthly expenses",
  },
  {
    id: "term",
    badge: "Term payments",
    badgeClass: "bg-[#E6F1FB] text-[#0C447C]",
    name: "Fixed-term payments (10 yr)",
    desc: "Higher monthly payments for a fixed period (e.g., 10 years to bridge until a pension or Social Security increase kicks in).",
    best: "Best if: you need income for a specific window of time",
  },
  {
    id: "loc",
    badge: "Most flexible",
    badgeClass: "bg-[rgba(198,161,91,0.15)] text-[#854F0B]",
    name: "Line of credit",
    desc: "Access funds when needed. Unused credit grows at rate + 0.5% — it gets LARGER over time. Protects against future market downturns.",
    best: "Best if: you want a financial safety net that grows",
  },
];

export function ReverseStrategyGrid({ inputs, results, activeStrat, onSelectStrat }: Props) {
  const { netPL, tenurePayment, termPayment } = results;
  const rateLabel = (inputs.intRate + 0.5).toFixed(1);

  const amountFor = (id: StratId): string => {
    switch (id) {
      case "lump":
        return fmt(netPL);
      case "tenure":
        return fmt(tenurePayment) + "/mo";
      case "term":
        return fmt(termPayment) + "/mo";
      case "loc":
        return fmtK(netPL) + " growing at " + rateLabel + "%";
      default:
        return "";
    }
  };

  return (
    <div>
      <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">Compare payout strategies</h3>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {STRATS.map((s) => {
          const active = activeStrat === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelectStrat(s.id)}
              className={`rounded-xl p-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B] focus-visible:ring-offset-2 ${
                active ? "border-2 border-[#C6A15B] bg-white" : "border-[0.5px] border-[var(--color-border-tertiary)] bg-white"
              }`}
            >
              <span className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold ${s.badgeClass}`}>{s.badge}</span>
              <p className="mt-3 font-[Georgia,serif] text-[16px] font-semibold text-[#0B2A4A]">{s.name}</p>
              <p className="mt-2 text-[15px] font-semibold tabular-nums text-[#0B2A4A]">{amountFor(s.id)}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-text-tertiary)]">{s.desc}</p>
              <p className="mt-3 text-[13px] font-medium text-[#0B2A4A]">{s.best}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
