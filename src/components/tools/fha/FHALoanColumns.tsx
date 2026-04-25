import type { FHAResult } from "../../../hooks/useFHAMath";
import { fmt, fmtK } from "../../../hooks/useFHAMath";

type Props = {
  results: FHAResult;
  dpInput: number;
};

export function FHALoanColumns({ results, dpInput }: Props) {
  const {
    convPmt,
    fhaPmt,
    pmiMoInit,
    mipMoInit,
    convLoan,
    fhaLoan,
    dpAmt,
    fhaUFMIP,
    convRate,
    fhaRate,
    pmiRate,
    pmiRemoveYr,
    convAtStay,
    fhaAtStay,
    convWins,
    close,
    stay,
    dpPercent,
    dpPercentFha,
  } = results;

  const convTotal = convPmt + pmiMoInit;
  const fhaTotal = fhaPmt + mipMoInit;
  const convWinner = convWins && !close;
  const fhaWinner = !convWins && !close;

  const convBorder = convWinner ? "border-2 border-[#C6A15B]" : "border-[0.5px] border-[var(--color-border-tertiary)]";
  const fhaBorder = fhaWinner ? "border-2 border-[#C6A15B]" : "border-[0.5px] border-[var(--color-border-tertiary)]";

  const win = (w: boolean) => (w ? "text-[#27500A]" : "text-[#A32D2D]");

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className={`rounded-xl bg-white p-5 shadow-sm sm:p-6 ${convBorder}`}>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-[Georgia,serif] text-xl font-semibold text-[#0B2A4A]">Conventional</h3>
          <span className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#0C447C]" style={{ background: "#E6F1FB" }}>
            Not gov-backed
          </span>
        </div>
        <p className="mt-3 font-[Georgia,serif] text-[26px] font-semibold text-[#0B2A4A]">
          {fmt(convTotal)}/mo
        </p>
        <p className="mt-1 text-[12px] text-[var(--color-text-tertiary)]">
          {pmiMoInit === 0
            ? `P&I ${fmt(convPmt)} — no PMI required`
            : `P&I ${fmt(convPmt)} + PMI ${fmt(pmiMoInit)}`}
        </p>
        <ul className="mt-5 space-y-3 border-t border-[var(--color-border-tertiary)] pt-4 text-[13px]">
          <li className="flex justify-between gap-2">
            <span className="text-[var(--color-text-tertiary)]">Loan amount</span>
            <span className="font-medium">{fmt(convLoan)}</span>
          </li>
          <li className="flex justify-between gap-2">
            <span className="text-[var(--color-text-tertiary)]">Down payment</span>
            <span className="font-medium">
              {fmt(dpAmt)} ({dpInput}%)
            </span>
          </li>
          <li className="flex justify-between gap-2">
            <span className="text-[var(--color-text-tertiary)]">Interest rate</span>
            <span className="font-medium">{convRate}%</span>
          </li>
          <li className="flex justify-between gap-2">
            <span className="text-[var(--color-text-tertiary)]">Upfront MI cost</span>
            <span className="font-semibold text-[#27500A]">$0</span>
          </li>
          <li className="flex justify-between gap-2">
            <span className="text-[var(--color-text-tertiary)]">Monthly PMI</span>
            <span className="font-semibold text-[#27500A]"> {pmiRate === 0 ? "None (20%+ down)" : fmt(pmiMoInit)}</span>
          </li>
          <li className="flex justify-between gap-2">
            <span className="text-[var(--color-text-tertiary)]">PMI removal</span>
            <span className="font-semibold text-[#27500A]">
              {pmiRate === 0 ? (
                "N/A — no PMI"
              ) : pmiRemoveYr ? (
                <span className="text-[#854F0B]">~{pmiRemoveYr} yrs</span>
              ) : (
                <span className="text-[#854F0B]">When LTV reaches 80%</span>
              )}
            </span>
          </li>
          <li className="flex justify-between gap-2">
            <span className="text-[var(--color-text-tertiary)]">Total cost ({stay} yr)</span>
            <span className={`font-semibold ${win(convWinner)}`}>{fmtK(convAtStay)}</span>
          </li>
        </ul>
      </div>

      <div className={`rounded-xl bg-white p-5 shadow-sm sm:p-6 ${fhaBorder}`}>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-[Georgia,serif] text-xl font-semibold text-[#3B6D11]">FHA</h3>
          <span className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#27500A]" style={{ background: "#EAF3DE" }}>
            Gov-backed
          </span>
        </div>
        <p className="mt-3 font-[Georgia,serif] text-[26px] font-semibold text-[#3B6D11]">{fmt(fhaTotal)}/mo</p>
        <p className="mt-1 text-[12px] text-[var(--color-text-tertiary)]">
          P&I {fmt(fhaPmt)} + MIP {fmt(mipMoInit)}
        </p>
        <ul className="mt-5 space-y-3 border-t border-[var(--color-border-tertiary)] pt-4 text-[13px]">
          <li className="flex justify-between gap-2">
            <span className="text-[var(--color-text-tertiary)]">Loan amount</span>
            <span className="text-right font-medium">
              {fmt(fhaLoan)}
              <span className="mt-0.5 block text-[10px] font-normal text-[var(--color-text-tertiary)]">includes UFMIP rolled in</span>
            </span>
          </li>
          <li className="flex justify-between gap-2">
            <span className="text-[var(--color-text-tertiary)]">Down payment</span>
            <span className="font-medium">
              {fmt(results.dpAmtFha)} ({results.fhaUsesMinDown ? "3.5" : dpInput}%)
            </span>
          </li>
          <li className="flex justify-between gap-2">
            <span className="text-[var(--color-text-tertiary)]">Interest rate</span>
            <span className="font-medium">{fhaRate}%</span>
          </li>
          <li className="flex justify-between gap-2">
            <span className="text-[var(--color-text-tertiary)]">Upfront MIP (1.75%)</span>
            <span className="font-semibold text-[#A32D2D]">{fmt(fhaUFMIP)} rolled in</span>
          </li>
          <li className="flex justify-between gap-2">
            <span className="text-[var(--color-text-tertiary)]">Monthly MIP</span>
            <span className="font-semibold text-[#A32D2D]">{fmt(mipMoInit)}</span>
          </li>
          <li className="flex justify-between gap-2">
            <span className="text-[var(--color-text-tertiary)]">MIP removal</span>
            <span className="font-semibold">
              {dpPercentFha >= 10 ? (
                <span className="text-[#854F0B]">After 11 years</span>
              ) : (
                <span className="text-[#A32D2D]">Never (refi to remove)</span>
              )}
            </span>
          </li>
          <li className="flex justify-between gap-2">
            <span className="text-[var(--color-text-tertiary)]">Total cost ({stay} yr)</span>
            <span className={`font-semibold ${win(fhaWinner)}`}>{fmtK(fhaAtStay)}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
