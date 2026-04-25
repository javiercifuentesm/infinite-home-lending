import type { SellerNetResults } from "../../../hooks/useSellerNetMath";
import { fmtK } from "../../../hooks/useSellerNetMath";

type Props = { results: SellerNetResults };

export function SNSScenarioHero({ results }: Props) {
  const { ask, below3, below5, diff3, diff5 } = results;

  return (
    <div id="sns-scenario-hero" className="space-y-3">
      <p className="font-sans text-[11px] font-semibold uppercase tracking-wide text-slate-500">Net proceeds at three price scenarios</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div
          className={`flex flex-col overflow-hidden rounded-xl border-2 border-[rgba(11,42,74,0.2)] bg-white shadow-sm ${
            ask.isUnderwater ? "ring-2 ring-[#A32D2D]/30" : ""
          }`}
        >
          <div className="bg-[#0B2A4A] px-4 py-3 text-center">
            <p className="font-sans text-[12px] font-semibold uppercase tracking-wide text-[#C6A15B]">Full asking price</p>
          </div>
          <div className="flex flex-1 flex-col px-4 py-5 text-center">
            <p className="font-sans text-[13px] text-slate-500">{fmtK(ask.price)}</p>
            <p className="mt-2 font-[Georgia,serif] text-[26px] font-medium text-[#0B2A4A]">{fmtK(ask.net)}</p>
            <p className="mt-2 font-sans text-[12px] text-slate-500">Your baseline</p>
            {ask.isUnderwater ? (
              <p className="mt-3 font-sans text-[12px] font-semibold text-[#A32D2D]">⚠ Seller is underwater</p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm">
          <div className="bg-[rgba(11,42,74,0.06)] px-4 py-3 text-center">
            <p className="font-sans text-[12px] font-semibold uppercase tracking-wide text-[#0B2A4A]">3% below ask</p>
          </div>
          <div className="flex flex-1 flex-col px-4 py-5 text-center">
            <p className="font-sans text-[13px] text-slate-500">{fmtK(below3.price)}</p>
            <p className="mt-2 font-[Georgia,serif] text-[26px] font-medium text-[#27500A]">{fmtK(below3.net)}</p>
            <p className="mt-2 font-sans text-[12px] text-[#A32D2D]">−{fmtK(diff3)} vs. ask</p>
          </div>
        </div>

        <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm">
          <div className="bg-slate-100/90 px-4 py-3 text-center">
            <p className="font-sans text-[12px] font-semibold uppercase tracking-wide text-slate-600">5% below ask</p>
          </div>
          <div className="flex flex-1 flex-col px-4 py-5 text-center">
            <p className="font-sans text-[13px] text-slate-500">{fmtK(below5.price)}</p>
            <p className="mt-2 font-[Georgia,serif] text-[26px] font-medium text-slate-600">{fmtK(below5.net)}</p>
            <p className="mt-2 font-sans text-[12px] text-[#A32D2D]">−{fmtK(diff5)} vs. ask</p>
          </div>
        </div>
      </div>
    </div>
  );
}
