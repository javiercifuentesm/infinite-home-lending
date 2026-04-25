import type { ReactNode } from "react";
import type { ListingBoostResults } from "../../../hooks/useListingBoostMath";
import { fmtK, fmtMoney } from "../../../hooks/useListingBoostMath";

type Props = { results: ListingBoostResults };

function Row({ label, value, valueClass }: { label: string; value: ReactNode; valueClass?: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-white/10 py-2 text-[12px] last:border-b-0 sm:flex-row sm:justify-between">
      <span className="text-white/70">{label}</span>
      <span className={`font-medium ${valueClass ?? "text-white"}`}>{value}</span>
    </div>
  );
}

function RowLight({ label, value, valueClass }: { label: string; value: ReactNode; valueClass?: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-slate-200/80 py-2 text-[12px] last:border-b-0 sm:flex-row sm:justify-between">
      <span className="text-slate-600">{label}</span>
      <span className={`font-medium ${valueClass ?? "text-[#0B2A4A]"}`}>{value}</span>
    </div>
  );
}

export function LBScenarioGrid({ results }: Props) {
  const {
    listPrice,
    rate,
    priceA,
    totalA,
    incA,
    poolA,
    netA,
    budget,
    pmtSavingA,
    totalB_yr1,
    totalB_yr2,
    rate21yr1,
    rate21yr2,
    incB,
    netB,
    cost21,
    remainB,
    totalC_yr1,
    rate10yr1,
    incC,
    netC,
    cost10,
    remainC,
    totalCurrent,
    bestNet,
  } = results;

  const netsSorted = [netA, netB, netC].sort((a, b) => b - a);
  const netBRank =
    netB === netsSorted[0] ? "best" : netB === netsSorted[1] ? "second" : "low";
  const netBProceedsClass =
    netBRank === "best" ? "text-[#9FE1CB]" : netBRank === "second" ? "text-[#C6A15B]" : "text-white/90";

  return (
    <div id="lb-scenario-grid">
      <h3 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">
        Three concession scenarios — same budget, different impact
      </h3>
      <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-4">
        {/* Card A */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm">
          <div className="bg-[rgba(24,95,165,0.07)] px-4 py-3">
            <p className="font-sans text-[12px] font-semibold uppercase text-[#185FA5]">Scenario A — Price Reduction</p>
            <span className="mt-2 inline-block rounded bg-[#0B2A4A] px-2 py-0.5 font-sans text-[10px] font-semibold text-white">Same rate</span>
          </div>
          <div className="flex-1 p-4">
            <p className="font-[Georgia,serif] text-[26px] font-medium text-[#0B2A4A]">{fmtMoney(totalA)}</p>
            <p className="mt-1 font-sans text-[12px] text-slate-500">every month — rate unchanged at {rate.toFixed(3)}%</p>
            <div className="mt-4 space-y-0">
              <RowLight label="New sale price" value={fmtK(priceA)} />
              <RowLight label="Year 1 monthly payment" value={fmtMoney(totalA)} />
              <RowLight label="Year 2+ payment" value={`${fmtMoney(totalA)} (unchanged)`} />
              <RowLight label="Income needed to qualify" value={`${fmtK(incA)}/yr`} />
              <RowLight label="Monthly saving vs. today" value={`−${fmtMoney(results.pmtSavingA)}/mo`} valueClass="text-[#27500A]" />
              <RowLight label="Seller concession cost" value={`${fmtK(budget)} (price drop)`} />
              <RowLight
                label="Seller net proceeds"
                value={fmtK(netA)}
                valueClass={netA === bestNet ? "text-[#27500A]" : "text-[#0B2A4A]"}
              />
            </div>
          </div>
        </div>

        {/* Card B */}
        <div className="flex flex-col overflow-hidden rounded-xl border-2 border-[#C6A15B] shadow-md ring-1 ring-[#C6A15B]/30">
          <div className="bg-[#0B2A4A] px-4 py-3">
            <p className="font-sans text-[12px] font-semibold uppercase text-[#C6A15B]">Scenario B — 2-1 Buydown</p>
            <span className="mt-2 inline-block rounded bg-[#C6A15B] px-2 py-0.5 font-sans text-[10px] font-bold text-[#0B2A4A]">
              ⭐ Recommended
            </span>
          </div>
          <div className="flex-1 bg-[#0B2A4A] p-4">
            <p className="font-[Georgia,serif] text-[26px] font-medium text-[#C6A15B]">{fmtMoney(totalB_yr1)}</p>
            <p className="mt-1 font-sans text-[12px] text-white/60">Year 1 at {rate21yr1.toFixed(3)}%</p>
            <div className="mt-4 space-y-0">
              <Row label="Sale price" value={`${fmtK(listPrice)} (full ask)`} />
              <Row label="Year 1 rate / payment" value={`${rate21yr1.toFixed(3)}% / ${fmtMoney(totalB_yr1)}`} valueClass="text-[#C6A15B]" />
              <Row label="Year 2 rate / payment" value={`${rate21yr2.toFixed(3)}% / ${fmtMoney(totalB_yr2)}`} />
              <Row
                label="Year 3+ rate / payment"
                value={`${rate.toFixed(3)}% / ${fmtMoney(totalCurrent)}`}
              />
              <Row label="Income needed (Year 1)" value={`${fmtK(incB)}/yr`} valueClass="text-[#9FE1CB]" />
              <Row label="Yr 1 saving vs. today" value={`−${fmtMoney(results.pmtSavingB_yr1)}/mo`} valueClass="text-[#9FE1CB]" />
              <Row
                label="Buydown cost to seller"
                value={
                  <span>
                    {fmtK(cost21)}
                    {remainB > 1000 ? (
                      <span className="mt-1 block text-[11px] font-normal text-white/60">
                        + {fmtK(remainB)} remaining for closing costs
                      </span>
                    ) : null}
                  </span>
                }
              />
              <Row label="Seller net proceeds" value={fmtK(netB)} valueClass={netBProceedsClass} />
            </div>
          </div>
        </div>

        {/* Card C */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm">
          <div className="bg-[rgba(11,42,74,0.75)] px-4 py-3">
            <p className="font-sans text-[12px] font-semibold uppercase text-[#9FE1CB]">Scenario C — 1-0 Buydown</p>
            <span className="mt-2 inline-block rounded border border-[rgba(159,225,203,0.3)] bg-[rgba(159,225,203,0.2)] px-2 py-0.5 font-sans text-[10px] font-semibold text-[#9FE1CB]">
              Lower cost
            </span>
          </div>
          <div className="flex-1 p-4">
            <p className="font-[Georgia,serif] text-[26px] font-medium text-[#0B2A4A]">{fmtMoney(totalC_yr1)}</p>
            <p className="mt-1 font-sans text-[12px] text-slate-500">Year 1 at {rate10yr1.toFixed(3)}%</p>
            <div className="mt-4 space-y-0">
              <RowLight label="Sale price" value={`${fmtK(listPrice)} (full ask)`} />
              <RowLight label="Year 1 rate / payment" value={`${rate10yr1.toFixed(3)}% / ${fmtMoney(totalC_yr1)}`} />
              <RowLight label="Year 2+ rate / payment" value={`${rate.toFixed(3)}% / ${fmtMoney(totalCurrent)} (market)`} />
              <RowLight label="Income needed (Year 1)" value={`${fmtK(incC)}/yr`} />
              <RowLight
                label="Buydown cost to seller"
                value={
                  <span>
                    {fmtK(cost10)}
                    {remainC > 1000 ? (
                      <span className="mt-1 block text-[11px] text-slate-500">+ {fmtK(remainC)} remaining for closing costs</span>
                    ) : null}
                  </span>
                }
              />
              <RowLight
                label="Seller net proceeds"
                value={fmtK(netC)}
                valueClass={netC === bestNet ? "text-[#27500A]" : "text-[#0B2A4A]"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
