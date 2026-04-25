import type { PowerMapInputs, PowerMapResults } from "../../../hooks/usePowerMapMath";
import { ACCESSIBILITY_BUFFER, fmtK } from "../../../hooks/usePowerMapMath";

type MWithStatus = PowerMapResults["marketsWithStatus"][number];

export function marketsAccessibleAt(price: number, marketsWithStatus: MWithStatus[]): string {
  const names = marketsWithStatus
    .filter((m) => price >= m.price * ACCESSIBILITY_BUFFER)
    .slice(-3)
    .map((m) => m.name)
    .reverse();
  return names.join(", ") || "Building toward first market access";
}

export function actionsForPeriod(
  period: "q90" | "m6" | "m12",
  inputs: PowerMapInputs,
): string {
  const { creditImp, debtPayoff, savingsBoost, incomeGrowth, scoreBase, savingsRate } = inputs;
  const pct = period === "q90" ? 0.25 : period === "m6" ? 0.5 : 1.0;
  const actions: string[] = [];

  if (creditImp > 0) {
    const targetScore = Math.min(760, scoreBase + Math.round(creditImp * pct));
    actions.push(`Credit target: ${targetScore}+`);
  }
  if (debtPayoff > 0) {
    actions.push(`Eliminate $${Math.round(debtPayoff * pct).toLocaleString("en-US")}/mo in debt`);
  }
  if (savingsBoost > 0) {
    actions.push(`Save $${(savingsRate + savingsBoost).toLocaleString("en-US")}/mo`);
  }
  if (incomeGrowth > 0) {
    const incGain = Math.round(incomeGrowth * pct);
    actions.push(`Income milestone: +$${incGain.toLocaleString("en-US")}/yr`);
  }
  return actions.slice(0, 2).join(" · ") || "Review eligibility with advisor";
}

type Props = {
  inputs: PowerMapInputs;
  results: PowerMapResults;
};

export function PMRoadmap({ inputs, results }: Props) {
  const {
    currentPrice,
    q90Price,
    m6Price,
    m12Price,
    q90Savings,
    m6Savings,
    m12Savings,
    baseRate,
    scoreBase,
    savings,
    impScore,
    impRate,
    marketsWithStatus,
  } = results;

  const todayMarkets = marketsAccessibleAt(currentPrice, marketsWithStatus);
  const q90Markets = marketsAccessibleAt(q90Price, marketsWithStatus);
  const m6Markets = marketsAccessibleAt(m6Price, marketsWithStatus);
  const m12Markets = marketsAccessibleAt(m12Price, marketsWithStatus);

  return (
    <div>
      <h3 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">Your personalized 12-month roadmap</h3>
      <div className="mt-5 space-y-4">
        {/* Today */}
        <div
          className="flex gap-4 rounded-xl border p-4"
          style={{ background: "rgba(11,42,74,0.04)", borderColor: "rgba(11,42,74,0.15)" }}
        >
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm"
            style={{ background: "#0B2A4A", color: "#C6A15B" }}
            aria-hidden
          >
            📍
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide"
              style={{ color: "#0B2A4A" }}>
              Today — your starting point
            </p>
            <p className="mt-1 font-[Georgia,serif] text-[20px]">{fmtK(currentPrice)}</p>
            <p className="mt-2 text-[11px] leading-[1.5] text-slate-500">Markets: {todayMarkets}</p>
            <p className="mt-1 text-[11px] italic text-slate-500">
              Qualification rate: {baseRate.toFixed(3)}% · Credit score: {scoreBase} · Savings: {fmtK(savings)}
            </p>
          </div>
        </div>

        {/* 90-day */}
        <div
          className="flex gap-4 rounded-xl border p-4"
          style={{ background: "rgba(198,161,91,0.05)", borderColor: "rgba(198,161,91,0.2)" }}
        >
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
            style={{ background: "rgba(198,161,91,0.2)", color: "#854F0B" }}
          >
            90
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "#854F0B" }}>
              90-day milestone
            </p>
            <p className="mt-1 font-[Georgia,serif] text-[20px]">{fmtK(q90Price)}</p>
            <p className="mt-2 text-[11px] leading-[1.5] text-slate-500">Markets opening: {q90Markets}</p>
            <p className="mt-1 text-[11px] italic text-slate-500">
              {actionsForPeriod("q90", inputs)} · Savings: ~{fmtK(q90Savings)}
            </p>
          </div>
        </div>

        {/* 6-month */}
        <div
          className="flex gap-4 rounded-xl border p-4"
          style={{ background: "rgba(59,109,17,0.05)", borderColor: "rgba(59,109,17,0.15)" }}
        >
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
            style={{ background: "rgba(59,109,17,0.15)", color: "#27500A" }}
          >
            6M
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "#3B6D11" }}>
              6-month milestone
            </p>
            <p className="mt-1 font-[Georgia,serif] text-[20px]">{fmtK(m6Price)}</p>
            <p className="mt-2 text-[11px] leading-[1.5] text-slate-500">Markets opening: {m6Markets}</p>
            <p className="mt-1 text-[11px] italic text-slate-500">
              {actionsForPeriod("m6", inputs)} · Savings: ~{fmtK(m6Savings)}
            </p>
          </div>
        </div>

        {/* 12-month */}
        <div className="flex gap-4 rounded-xl border-2 border-[#3B6D11] p-4" style={{ background: "rgba(59,109,17,0.08)" }}>
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{ background: "#3B6D11" }}
          >
            1Y
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "#27500A" }}>
              12-month goal — fully improved
            </p>
            <p className="mt-1 font-[Georgia,serif] text-[20px]">{fmtK(m12Price)}</p>
            <p className="mt-2 text-[11px] leading-[1.5] text-slate-500">Markets unlocked: {m12Markets}</p>
            <p className="mt-1 text-[11px] italic text-slate-500">
              Credit: {impScore} · Rate: {impRate.toFixed(3)}% · Savings: ~{fmtK(m12Savings)} · Ready to buy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
