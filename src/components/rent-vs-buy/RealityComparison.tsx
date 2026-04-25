import type { DecisionEngineV2 } from "../../lib/rentVsBuy/decisionEngineV2";
import { formatUsd } from "../../lib/rentVsBuy/decisionEngineV2";

type View = "buyNow" | "wait";

type Props = {
  decision: DecisionEngineV2;
  view: View;
};

function fmtSigned(n: number) {
  const sign = n >= 0 ? "+" : "−";
  return sign + formatUsd(n);
}

export function RealityComparison({ decision, view }: Props) {
  const { buyNow, waitRent, difference } = decision.comparison;
  const buyEm = view === "buyNow";
  const waitEm = view === "wait";

  return (
    <section className="overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-sm">
      <div className="border-b border-black/[0.06] bg-[#F7F9FC] px-4 py-3 sm:px-5">
        <h2 className="font-display text-lg font-semibold text-[#0B1F3A]">Side-by-side</h2>
        <p className="mt-0.5 text-[13px] text-[#0B1F3A]/60">Same timeline — two different outcomes.</p>
      </div>
      <table className="w-full border-collapse text-left text-[13px] sm:text-[14px]">
        <thead>
          <tr className="border-b border-black/[0.06]">
            <th className="w-[36%] px-3 py-2.5 sm:px-4" />
            <th
              className={`px-3 py-2.5 text-center font-bold uppercase tracking-wide sm:px-4 ${
                buyEm ? "bg-[#D4AF37]/12 text-[#0B1F3A]" : "bg-[#F7F9FC] text-[#0B1F3A]/55"
              }`}
            >
              Buy now
            </th>
            <th
              className={`px-3 py-2.5 text-center font-bold uppercase tracking-wide sm:px-4 ${
                waitEm ? "bg-[#D4AF37]/12 text-[#0B1F3A]" : "bg-[#F7F9FC] text-[#0B1F3A]/55"
              }`}
            >
              Wait (rent)
            </th>
          </tr>
        </thead>
        <tbody>
          <DataRow
            label="Monthly housing cost"
            buy={formatUsd(buyNow.monthlyHousingCost)}
            wait={formatUsd(waitRent.monthlyHousingCost)}
            buyEm={buyEm}
            waitEm={waitEm}
          />
          <DataRow
            label="Equity gained"
            buy={formatUsd(buyNow.equityGained)}
            wait={formatUsd(waitRent.equityGained)}
            buyEm={buyEm}
            waitEm={waitEm}
          />
          <DataRow
            label="Net position"
            buy={fmtSigned(buyNow.netPosition)}
            wait={fmtSigned(waitRent.netPosition)}
            buyEm={buyEm}
            waitEm={waitEm}
            strong
          />
        </tbody>
      </table>
      <div className="bg-[#0B1F3A] px-4 py-4 text-center sm:px-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">Difference (buy vs rent)</p>
        <p className="numeric mt-1 text-2xl font-bold text-[#D4AF37] sm:text-[1.65rem]">{fmtSigned(difference)}</p>
        <p className="mt-1 text-[12px] text-white/65">
          Roughly {decision.comparison.pctDifference}% vs the renter path — illustrative only.
        </p>
      </div>
    </section>
  );
}

function DataRow({
  label,
  buy,
  wait,
  buyEm,
  waitEm,
  strong,
}: {
  label: string;
  buy: string;
  wait: string;
  buyEm: boolean;
  waitEm: boolean;
  strong?: boolean;
}) {
  return (
    <tr className="border-b border-black/[0.06]">
      <th className="px-3 py-3 align-middle text-[11px] font-bold uppercase tracking-wide text-[#0B1F3A]/45 sm:px-4">
        {label}
      </th>
      <td
        className={`numeric px-3 py-3 text-center align-middle text-[#0B1F3A] sm:px-4 ${buyEm ? "bg-[#D4AF37]/8" : ""} ${
          strong ? "text-[15px] font-bold sm:text-base" : ""
        }`}
      >
        {buy}
      </td>
      <td
        className={`numeric px-3 py-3 text-center align-middle text-[#0B1F3A] sm:px-4 ${waitEm ? "bg-[#D4AF37]/8" : ""} ${
          strong ? "text-[15px] font-bold sm:text-base" : ""
        }`}
      >
        {wait}
      </td>
    </tr>
  );
}
