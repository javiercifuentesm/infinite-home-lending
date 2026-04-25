import type { HelocResult } from "../../../hooks/useHelocMath";
import { fmt } from "../../../hooks/useHelocMath";

type Props = {
  results: HelocResult;
};

export function HelocRateScenarios({ results }: Props) {
  const { scenarios, rate, ioPmt, piPmtVal, rateRiskAmount } = results;

  return (
    <div>
      <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">Rate scenarios</h3>
      <div className="mt-4 grid grid-cols-1 gap-4 min-[500px]:grid-cols-3">
        <div className="rounded-xl p-5" style={{ background: "var(--color-background-success)" }}>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#3B6D11]">If rates drop 1.5%</p>
          <p className="mt-2 font-[Georgia,serif] text-2xl font-semibold text-[#27500A]">{scenarios.down.rate.toFixed(2)}%</p>
          <p className="mt-2 text-[13px] leading-snug text-[#27500A]">
            Draw: {fmt(scenarios.down.io)}/mo · Repay: {fmt(scenarios.down.pi)}/mo
          </p>
        </div>
        <div className="rounded-xl border-[0.5px] border-[var(--color-border-tertiary)] bg-white p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">Current rate (base)</p>
          <p className="mt-2 font-[Georgia,serif] text-2xl font-semibold text-[#0B2A4A]">{rate.toFixed(2)}%</p>
          <p className="mt-2 text-[13px] leading-snug text-[var(--color-text-tertiary)]">
            Draw: {fmt(ioPmt)}/mo · Repay: {fmt(piPmtVal)}/mo
          </p>
        </div>
        <div className="rounded-xl p-5" style={{ background: "var(--color-background-warning)" }}>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#854F0B]">If rates rise 2%</p>
          <p className="mt-2 font-[Georgia,serif] text-2xl font-semibold text-[#633806]">{scenarios.up.rate.toFixed(2)}%</p>
          <p className="mt-2 text-[13px] leading-snug text-[#633806]">
            Draw: {fmt(scenarios.up.io)}/mo · Repay: {fmt(scenarios.up.pi)}/mo
          </p>
          {rateRiskAmount > 0 ? (
            <p className="mt-3 text-[11px] font-medium text-[#A32D2D]">+{fmt(rateRiskAmount)}/mo vs. today</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
