import type { ReactNode } from "react";
import type { SEQRunResult } from "../../../hooks/useSEQMath";
import type { SEQInputs } from "../../../hooks/useSEQMath";
import type { SEQPath } from "./SEQPathTabs";
import { fmt, fmtK } from "./seqFormat";

type Props = {
  path: SEQPath;
  results: SEQRunResult;
  inputs: SEQInputs;
};

function Row({ label, value, valueClass }: { label: string; value: ReactNode; valueClass?: string }) {
  return (
    <div className="flex flex-wrap justify-between gap-2 border-b border-slate-100 py-2.5 text-[12px] last:border-b-0">
      <span className="text-slate-600">{label}</span>
      <span className={`text-right font-medium ${valueClass ?? "text-slate-900"}`}>{value}</span>
    </div>
  );
}

export function SEQPathColumns({ path, results, inputs }: Props) {
  const {
    tx,
    bs,
    txMaxPrice,
    txCanAfford,
    bsMaxPrice,
    bsCanAfford,
    BASE_RATE,
    BS_RATE,
    targetPrice,
  } = results;

  const showTax = path === "taxreturn" || path === "compare";
  const showBs = path === "bankstatement" || path === "compare";
  const compare = path === "compare";

  const gapTx = Math.max(0, targetPrice - txMaxPrice);
  const gapBs = Math.max(0, targetPrice - bsMaxPrice);

  const taxBorder = compare
    ? txMaxPrice >= bsMaxPrice
      ? "border-2 border-[#C6A15B]"
      : "border border-slate-200/80"
    : "border border-slate-200/80";

  const bsBorder = compare
    ? bsMaxPrice >= txMaxPrice
      ? "border-2 border-[#C6A15B]"
      : "border border-slate-200/80"
    : "border border-slate-200/80";

  const taxCardClass = `rounded-lg bg-white p-5 shadow-sm ${taxBorder}`;
  const bsCardClass = `rounded-lg bg-white p-5 shadow-sm ${bsBorder}`;

  const gridClass =
    showTax && showBs ? "grid grid-cols-1 gap-6 lg:grid-cols-2" : "grid grid-cols-1 gap-6";

  return (
    <div className={`mb-8 ${gridClass}`}>
      {showTax ? (
        <article className={taxCardClass}>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <h3 className="font-serif text-lg font-semibold text-[#0B2A4A]">Tax Return (Sch. C)</h3>
            <span className="rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#0B2A4A]" style={{ background: "#E6F1FB" }}>
              Conventional rate
            </span>
          </div>
          <p className="font-serif text-[26px] font-semibold text-[#0B2A4A]">
            ${fmt(tx.qualifyingMonthly)}
            <span className="text-lg font-normal text-slate-600">/mo</span>
          </p>
          <p className="text-[12px] text-slate-500">
            Qualifying income · {BASE_RATE.toFixed(3)}% rate
          </p>

          {tx.declining ? (
            <div
              className="mt-4 rounded border border-amber-200/80 p-3 text-[11px] leading-relaxed"
              style={{ background: "var(--color-background-warning, #fef3c7)", color: "#633806" }}
            >
              ⚠ Declining income detected: Year 2 (${fmt(inputs.netY2)}) &lt; Year 1 (${fmt(inputs.netY1)}). Lenders use
              the lower, most recent year only. This reduces qualifying income vs. a 2-year average.
            </div>
          ) : null}

          <div className="mt-4">
            <Row label="Year 1 net profit" value={`$${fmt(inputs.netY1)}`} />
            <Row label="Year 2 net profit" value={`$${fmt(inputs.netY2)}`} />
            <Row
              label="Income rule applied"
              value={
                <span className={tx.declining ? "text-amber-800" : ""}>
                  {tx.incomeMethod}
                  {tx.declining ? <span className="ml-1 block text-[10px] text-amber-700">Lender uses lower year</span> : null}
                </span>
              }
            />
            <Row label="Total add-backs" value={`+$${fmt(tx.totalAddback)}`} valueClass="text-green-700" />
            <Row label="Annual qualifying income" value={`$${fmt(tx.qualifyingAnnual)}`} valueClass="text-[#0B2A4A]" />
            <Row label="Monthly qualifying income" value={`$${fmt(tx.qualifyingMonthly)}`} />
            <Row
              label="Max home price"
              value={`$${fmtK(txMaxPrice)}`}
              valueClass={txCanAfford ? "text-green-800" : "text-red-700"}
            />
            <Row
              label={`Target $${fmt(targetPrice)} achievable?`}
              value={
                txCanAfford ? (
                  <span className="text-green-700">✓ Yes</span>
                ) : (
                  <span className="text-red-700">✗ Gap: ${fmtK(gapTx)}</span>
                )
              }
            />
          </div>
        </article>
      ) : null}

      {showBs ? (
        <article className={bsCardClass}>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <h3 className="font-serif text-lg font-semibold text-[#3B6D11]">Bank Statement</h3>
            <span className="rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#3B6D11]" style={{ background: "#EAF3DE" }}>
              Non-QM · +0.75% rate
            </span>
          </div>
          <p className="font-serif text-[26px] font-semibold text-[#3B6D11]">
            ${fmt(bs.qualifyingMonthly)}
            <span className="text-lg font-normal text-slate-600">/mo</span>
          </p>
          <p className="text-[12px] text-slate-500">
            Qualifying income · {BS_RATE.toFixed(3)}% rate
          </p>

          <div className="mt-4">
            <Row label="Avg monthly deposits" value={`$${fmt(inputs.avgDeposits)}`} />
            <Row label="Expense factor applied" value={`−${bs.expFactorPct}%`} valueClass="text-red-700" />
            <Row label="Income ratio used" value={`${bs.incomeRatioPct}% of deposits`} />
            <Row label="Qualifying monthly income" value={`$${fmt(bs.qualifyingMonthly)}`} valueClass="text-green-800" />
            <Row label="Annual qualifying income" value={`$${fmt(bs.qualifyingAnnual)}`} />
            <Row label="Rate premium vs. conventional" value="+0.75%" valueClass="text-red-700" />
            <Row
              label="Max home price"
              value={`$${fmtK(bsMaxPrice)}`}
              valueClass={bsCanAfford ? "text-green-800" : "text-red-700"}
            />
            <Row
              label={`Target $${fmt(targetPrice)} achievable?`}
              value={
                bsCanAfford ? (
                  <span className="text-green-700">✓ Yes</span>
                ) : (
                  <span className="text-red-700">✗ Gap: ${fmtK(gapBs)}</span>
                )
              }
            />
          </div>
        </article>
      ) : null}
    </div>
  );
}
