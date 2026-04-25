import type { SEQRunResult } from "../../../hooks/useSEQMath";
import { fmt, fmtK } from "./seqFormat";

type Props = {
  results: SEQRunResult;
  planReduction: number;
};

export function SEQPlanningBox({ results, planReduction }: Props) {
  const { tx, txMaxPrice, planning, planHomeDiff } = results;
  const gain = planHomeDiff;
  const absGain = Math.abs(gain);

  return (
    <div className="mb-10 rounded-xl px-5 py-8 text-white" style={{ backgroundColor: "#0B2A4A" }}>
      <h3 className="font-serif text-[14px] font-semibold text-[#C6A15B]">
        Mortgage planning: what claiming ${fmtK(planReduction)} fewer deductions buys you
      </h3>
      <p className="mt-3 max-w-3xl text-[12px] leading-relaxed text-white/65">
        You are not required to claim every deduction the IRS allows. This models what happens if you reduce write-offs by
        ${fmtK(planReduction)} on your next tax return — trading higher taxes for higher qualifying income.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-white/[0.07] p-4">
          <p className="text-[11px] font-semibold text-white">Current qualifying</p>
          <p className="mt-2 font-serif text-xl text-white">${fmt(tx.qualifyingMonthly)}/mo</p>
          <p className="mt-2 text-[11px] text-white/70">Max home: ${fmtK(txMaxPrice)}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-[#9FE1CB]/20 p-4">
          <p className="text-[11px] font-semibold text-[#9FE1CB]">After reducing write-offs</p>
          <p className="mt-2 font-serif text-xl text-[#9FE1CB]">${fmt(planning.planMonthly)}/mo</p>
          <p className="mt-2 text-[11px] text-white/80">Max home: ${fmtK(planning.planMaxPrice)}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-[#C6A15B]/25 p-4">
          <p className="text-[11px] font-semibold text-[#C6A15B]">Home buying power gained</p>
          <p className="mt-2 font-serif text-xl text-[#C6A15B]">
            {gain > 0 ? "+" : gain < 0 ? "−" : ""}
            {gain === 0 ? "$0" : `$${fmtK(absGain)}`}
          </p>
          <p className="mt-2 text-[11px] text-white/80">Tax cost: ${fmt(planning.planTaxCost)}</p>
        </div>
      </div>

      <p className="mt-6 text-[11px] italic leading-relaxed text-white/50">
        ⚠ This is educational modeling only — not tax advice. Never misrepresent income or deductions on a tax return.
        Consult a CPA before adjusting your tax strategy. The tradeoff: pay ${fmt(planning.planTaxCost)} more in taxes to
        unlock ${fmtK(absGain)} more home.
      </p>
    </div>
  );
}
