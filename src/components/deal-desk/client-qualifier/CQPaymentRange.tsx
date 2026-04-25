import type { ClientQualifierResults } from "../../../hooks/useClientQualifierMath";
import { fmtK, fmtMoney } from "../../../hooks/useClientQualifierMath";

type Props = { results: ClientQualifierResults };

export function CQPaymentRange({ results }: Props) {
  const { target, totalPmtLow, totalPmtHigh, pmtLow, pmtHigh, taxMo, pmiMo } = results;

  return (
    <div id="cq-payment-range" className="rounded-xl bg-[#0B2A4A] p-5 sm:p-6">
      <p className="font-sans text-[11px] font-semibold uppercase tracking-wide text-[rgba(255,255,255,0.5)]">
        Estimated monthly payment at {fmtK(target)} target price
      </p>
      <div className="mt-4 flex flex-wrap items-baseline justify-center gap-2 rounded-lg bg-[rgba(255,255,255,0.06)] px-4 py-5 sm:justify-start">
        <span className="font-[Georgia,serif] text-[26px] font-medium text-[#C6A15B]">{fmtMoney(totalPmtLow)}</span>
        <span className="font-sans text-[18px] text-white/40">—</span>
        <span className="font-[Georgia,serif] text-[26px] font-medium text-[#C6A15B]">{fmtMoney(totalPmtHigh)}</span>
        <span className="font-sans text-[14px] text-white/55">/mo</span>
      </div>
      <p className="mt-2 font-sans text-[11px] text-white/55">Range based on 5–20% down payment scenarios</p>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-[rgba(255,255,255,0.07)] px-3 py-3 text-center">
          <p className="font-sans text-[10px] font-semibold uppercase text-white/50">P&amp;I</p>
          <p className="mt-1 font-sans text-[13px] font-medium text-white">
            {fmtMoney(pmtLow)}–{fmtMoney(pmtHigh)}
          </p>
        </div>
        <div className="rounded-lg bg-[rgba(255,255,255,0.07)] px-3 py-3 text-center">
          <p className="font-sans text-[10px] font-semibold uppercase text-white/50">Tax est.</p>
          <p className="mt-1 font-sans text-[13px] font-medium text-white">{fmtMoney(taxMo)}/mo</p>
        </div>
        <div className="rounded-lg bg-[rgba(255,255,255,0.07)] px-3 py-3 text-center">
          <p className="font-sans text-[10px] font-semibold uppercase text-white/50">{pmiMo > 0 ? "PMI est." : "No PMI"}</p>
          <p className="mt-1 font-sans text-[13px] font-medium text-white">{pmiMo > 0 ? `${fmtMoney(pmiMo)}/mo` : "20%+ down"}</p>
        </div>
      </div>
    </div>
  );
}
