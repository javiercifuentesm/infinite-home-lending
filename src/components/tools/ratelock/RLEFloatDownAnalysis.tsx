import type { ReactNode } from "react";
import type { RLEResults } from "../../../hooks/useRLEMath";
import { fmt, fmtK } from "../../../hooks/useRLEMath";

type Props = { results: RLEResults };

export function RLEFloatDownAnalysis({ results }: Props) {
  const {
    floatCost,
    floatDownCost,
    floatThresh,
    dropScenario,
    floatActivates,
    monthlyUpside,
    lifetimeUpside,
    floatNetSave,
    floatBreakeven,
    floatWorth,
    rate,
  } = results;

  const threshRate = Math.max(0, rate - floatThresh);

  if (floatCost === 0) {
    return (
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">
          Float-down option analysis — is it worth buying?
        </h3>
        <p className="mt-3 text-[13px] leading-relaxed text-slate-600">
          Your lender does not offer a float-down option. You can lock and accept the current rate, or float without protection.
        </p>
        <p className="mt-3 text-[13px] font-medium text-slate-700">No float-down available from this lender.</p>
        <p className="mt-4 text-[12px] leading-relaxed text-slate-500">
          Ask your lender if a float-down can be added. If rates drop before closing, your only option without a float-down is to
          let the lock expire and relock — which carries significant risk.
        </p>
      </div>
    );
  }

  const netClass = floatNetSave >= 0 ? "text-[#3B6D11]" : "text-[#A32D2D]";

  const verdictBox = (() => {
    if (floatWorth) {
      return (
        <p className="text-[12px] leading-relaxed text-slate-600">
          The float-down is worth considering: if rates drop {dropScenario}%, you net {fmtK(floatNetSave)} after the{" "}
          {fmt(floatDownCost)} cost, breaking even in {floatBreakeven} months. The {fmt(floatDownCost)} buys you rate protection
          going both directions.
        </p>
      );
    }
    if (!floatActivates) {
      return (
        <p className="text-[12px] leading-relaxed text-slate-600">
          Your drop scenario (−{dropScenario}%) does not meet the {floatThresh}% threshold required to activate the float-down.
          You&apos;d pay {fmt(floatDownCost)} for protection that wouldn&apos;t trigger under this scenario. The float-down only
          makes sense if you expect a larger rate drop.
        </p>
      );
    }
    return (
      <p className="text-[12px] leading-relaxed text-slate-600">
        The float-down math is marginal here. The {fmt(floatDownCost)} cost takes {floatBreakeven} months to recover. Unless
        you&apos;re highly confident in a large rate drop, a standard lock is cleaner.
      </p>
    );
  })();

  const rows: { label: string; value: ReactNode; valueClass?: string; borderTop?: boolean }[] = [
    { label: "Float-down cost", value: `${fmt(floatDownCost)} upfront`, valueClass: "text-[#A32D2D]" },
    {
      label: "Minimum rate drop required",
      value: `${floatThresh}% (to ${threshRate.toFixed(3)}%)`,
    },
    {
      label: `Does your drop scenario (−${dropScenario}%) activate it?`,
      value: floatActivates ? "✓ Yes — float-down activates" : "✗ No — drop too small to trigger",
      valueClass: floatActivates ? "text-[#3B6D11] font-medium" : "text-[#A32D2D] font-medium",
    },
    {
      label: "Monthly savings if activated",
      value: floatActivates ? `${fmt(monthlyUpside)}/mo` : "N/A",
      valueClass: floatActivates ? "text-[#3B6D11]" : undefined,
    },
    {
      label: "Lifetime savings if activated",
      value: floatActivates ? fmtK(lifetimeUpside) : "N/A",
      valueClass: floatActivates ? "text-[#3B6D11]" : undefined,
    },
    {
      label: "Net lifetime benefit (after cost)",
      value: floatActivates ? fmtK(floatNetSave) : "N/A — threshold not met",
      valueClass: floatActivates ? netClass : undefined,
    },
    {
      label: "Break-even on float-down cost",
      value: `${floatBreakeven} months of savings`,
      borderTop: true,
    },
  ];

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">
        Float-down option analysis — is it worth buying?
      </h3>
      <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
        A float-down lets you lock today AND capture a lower rate if rates drop {floatThresh}%+ before closing. You pay{" "}
        {fmt(floatDownCost)} upfront for that protection.
      </p>

      <dl className="mt-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className={`flex flex-col justify-between gap-1 border-b border-slate-200/80 py-3 last:border-b-0 sm:flex-row sm:items-center ${row.borderTop ? "border-t border-slate-200/90 pt-4" : ""}`}
          >
            <dt className="text-[12px] text-slate-600">{row.label}</dt>
            <dd className={`text-right text-[13px] tabular-nums ${row.valueClass ?? "text-slate-700"}`}>{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4">
        <p className="text-[12px] font-medium text-slate-700">Float-down verdict</p>
        <div
          className="mt-2 rounded-md border border-slate-200/80 p-3"
          style={{ background: "rgba(248,250,252,0.9)" }}
        >
          {verdictBox}
        </div>
      </div>
    </div>
  );
}
