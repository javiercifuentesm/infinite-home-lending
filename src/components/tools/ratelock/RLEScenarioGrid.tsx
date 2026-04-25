import type { RLEResults } from "../../../hooks/useRLEMath";
import { fmt, fmtK } from "../../../hooks/useRLEMath";

type Props = { results: RLEResults };

export function RLEScenarioGrid({ results }: Props) {
  const {
    rateRise,
    rateDrop,
    rate,
    risePmt,
    dropPmt,
    lockedPmt,
    monthlyRisk,
    monthlyUpside,
    lifetimeRisk,
    lifetimeUpside,
    riseScenario,
    dropScenario,
    term,
    daysToClose,
  } = results;

  const annualExtra = monthlyRisk * 12;
  const annualSave = monthlyUpside * 12;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div
        className="rounded-xl border p-5"
        style={{ background: "rgba(163,45,45,0.04)", borderColor: "rgba(163,45,45,0.15)" }}
      >
        <span
          className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          style={{ background: "rgba(163,45,45,0.12)", color: "#A32D2D" }}
        >
          📈 Rates rise +{riseScenario}%
        </span>
        <p className="mt-3 text-[12px] font-medium text-slate-700">
          If you float and rates rise to {rateRise.toFixed(3)}%
        </p>
        <dl className="mt-4 space-y-2 border-t border-red-200/30 pt-3 text-[13px]">
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">New monthly payment</dt>
            <dd className="font-semibold tabular-nums text-[#A32D2D]">{fmt(risePmt)}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">Extra cost vs. locking</dt>
            <dd className="font-semibold tabular-nums text-[#A32D2D]">+{fmt(monthlyRisk)}/mo</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">Extra cost over {term} yrs</dt>
            <dd className="font-semibold tabular-nums text-[#A32D2D]">+{fmtK(lifetimeRisk)}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">Annual extra cost</dt>
            <dd className="font-semibold tabular-nums text-[#A32D2D]">+{fmt(annualExtra)}/yr</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
        <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
          ➡️ Rates hold flat
        </span>
        <p className="mt-3 text-[12px] font-medium text-slate-700">If you float and rates stay at {rate.toFixed(3)}%</p>
        <dl className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-[13px]">
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">Monthly payment</dt>
            <dd className="font-semibold tabular-nums text-[#0B2A4A]">{fmt(lockedPmt)}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">vs. locking today</dt>
            <dd className="font-medium text-slate-700">Identical</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">Days of uncertainty</dt>
            <dd className="font-medium text-slate-700">{daysToClose} days</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">Outcome</dt>
            <dd className="font-medium text-slate-600">Same — time wasted floating</dd>
          </div>
        </dl>
      </div>

      <div
        className="rounded-xl border p-5"
        style={{ background: "rgba(59,109,17,0.04)", borderColor: "rgba(59,109,17,0.15)" }}
      >
        <span
          className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          style={{ background: "rgba(59,109,17,0.12)", color: "#27500A" }}
        >
          📉 Rates drop −{dropScenario}%
        </span>
        <p className="mt-3 text-[12px] font-medium text-slate-700">
          If you float and rates fall to {rateDrop.toFixed(3)}%
        </p>
        <dl className="mt-4 space-y-2 border-t border-emerald-200/40 pt-3 text-[13px]">
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">New monthly payment</dt>
            <dd className="font-semibold tabular-nums text-[#3B6D11]">{fmt(dropPmt)}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">Savings vs. locking</dt>
            <dd className="font-semibold tabular-nums text-[#3B6D11]">−{fmt(monthlyUpside)}/mo</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">Savings over {term} yrs</dt>
            <dd className="font-semibold tabular-nums text-[#3B6D11]">−{fmtK(lifetimeUpside)}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">Annual savings</dt>
            <dd className="font-semibold tabular-nums text-[#3B6D11]">−{fmt(annualSave)}/yr</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
