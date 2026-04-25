import type { SimulatorLeadPayload } from "../../lib/simulatorLeadPayload";

function fmtCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

/**
 * Compact “review snapshot” from the live simulator payload — no new API fields.
 */
export function ConversionPanelScenarioSummary({ payload }: { payload: SimulatorLeadPayload }) {
  const { mode, scenarioA, scenarioB, resultA, resultB, horizon, horizonWindow } = payload;
  const winner = horizonWindow.interestWinner;

  const primaryIsA = winner !== "B";
  const s = primaryIsA ? scenarioA : scenarioB;
  const r = primaryIsA ? resultA : resultB;

  const pricePaymentTie =
    mode === "payment" &&
    winner === "tie" &&
    Math.abs(scenarioA.price - scenarioB.price) > 1;

  const priceAffordTie =
    mode === "affordability" &&
    winner === "tie" &&
    Math.abs((resultA.impliedPrice ?? 0) - (resultB.impliedPrice ?? 0)) > 1;

  const purchasePrice =
    mode === "payment"
      ? pricePaymentTie
        ? null
        : s.price
      : priceAffordTie
        ? null
        : r.impliedPrice ?? s.price;

  const structureLabel =
    winner === "tie"
      ? `Scenarios A & B · ${horizon.label}`
      : `${primaryIsA ? "Scenario A" : "Scenario B"} · ${s.rate.toFixed(3)}% · ${s.termYears} yr`;

  return (
    <div className="rounded-[3px] border border-slate-200/70 bg-slate-50/50 px-4 py-3.5 mb-5 ring-1 ring-slate-100/80">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-navy/38 mb-3">
        Review snapshot
      </p>
      <dl className="space-y-2 text-[13px] text-navy/90">
        <div className="flex justify-between gap-3 items-baseline">
          <dt className="text-slate-500 font-normal shrink-0">
            {mode === "payment" ? "Purchase price" : "Implied max price"}
          </dt>
          <dd className="font-medium tabular-nums text-right">
            {purchasePrice != null ? (
              fmtCurrency(purchasePrice)
            ) : mode === "payment" ? (
              <>
                <span className="block sm:inline">A {fmtCurrency(scenarioA.price)}</span>
                <span className="text-slate-400 mx-1 hidden sm:inline">·</span>
                <span className="block sm:inline">B {fmtCurrency(scenarioB.price)}</span>
              </>
            ) : (
              <>
                A {fmtCurrency(resultA.impliedPrice ?? 0)} · B {fmtCurrency(resultB.impliedPrice ?? 0)}
              </>
            )}
          </dd>
        </div>
        <div className="flex justify-between gap-3 items-baseline">
          <dt className="text-slate-500 font-normal">Down payment</dt>
          <dd className="font-medium tabular-nums">
            {winner === "tie" && Math.abs(scenarioA.downPercent - scenarioB.downPercent) >= 0.1 ? (
              <>
                A {scenarioA.downPercent.toFixed(1)}% · B {scenarioB.downPercent.toFixed(1)}%
              </>
            ) : (
              `${s.downPercent.toFixed(1)}%`
            )}
          </dd>
        </div>
        <div className="flex justify-between gap-3 items-start">
          <dt className="text-slate-500 font-normal shrink-0 pt-0.5">Structure</dt>
          <dd className="font-medium text-right text-[12px] sm:text-[13px] leading-snug">{structureLabel}</dd>
        </div>
        <div className="flex justify-between gap-3 items-baseline pt-0.5 border-t border-slate-200/60 mt-2 pt-2.5">
          <dt className="text-slate-500 font-normal">Est. monthly (total)</dt>
          <dd className="font-semibold tabular-nums text-navy">
            {winner === "tie" ? (
              <>
                A {fmtCurrency(resultA.total)} · B {fmtCurrency(resultB.total)}
              </>
            ) : (
              fmtCurrency(r.total)
            )}
          </dd>
        </div>
      </dl>
      <p className="mt-3 text-[12px] text-slate-500 leading-relaxed border-t border-slate-200/50 pt-3">
        We&apos;ll review this exact structure and validate how it performs in a real approval.
      </p>
    </div>
  );
}
