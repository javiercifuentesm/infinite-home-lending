import type { FHAResult } from "../../../hooks/useFHAMath";
import { fmt, fmtK } from "../../../hooks/useFHAMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = {
  results: FHAResult;
  dpInput: number;
};

export function FHALoanColumns({ results, dpInput }: Props) {
  const { t } = useLanguage();
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

  const perMo = t("tool.fha.miChart.perMo");
  const convTotal = convPmt + pmiMoInit;
  const fhaTotal = fhaPmt + mipMoInit;
  const convWinner = convWins && !close;
  const fhaWinner = !convWins && !close;

  const convBorder = convWinner ? "border-2 border-[#C6A15B]" : "border-[0.5px] border-[var(--color-border-tertiary)]";
  const fhaBorder = fhaWinner ? "border-2 border-[#C6A15B]" : "border-[0.5px] border-[var(--color-border-tertiary)]";

  const win = (w: boolean) => (w ? "text-[#27500A]" : "text-[#A32D2D]");

  const convLabel = t("tool.fha.metrics.conventional");
  const fhaLabel = t("tool.fha.metrics.fha");
  const totalCostLabel = t("tool.fha.loan.totalCostYr").replace("{stay}", String(stay));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className={`rounded-xl bg-white p-5 shadow-sm sm:p-6 ${convBorder}`}>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-[Georgia,serif] text-xl font-semibold text-[#0B2A4A]">{convLabel}</h3>
          <span className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#0C447C]" style={{ background: "#E6F1FB" }}>
            {t("tool.fha.loan.notGov")}
          </span>
        </div>
        <p className="mt-3 font-[Georgia,serif] text-[26px] font-semibold text-[#0B2A4A]">
          {fmt(convTotal)}
          {perMo}
        </p>
        <p className="mt-1 text-[12px] text-[var(--color-text-tertiary)]">
          {pmiMoInit === 0
            ? t("tool.fha.loan.piNoPmi").replace("{pi}", fmt(convPmt))
            : t("tool.fha.loan.piPlusPmi").replace("{pi}", fmt(convPmt)).replace("{pmi}", fmt(pmiMoInit))}
        </p>
        <ul className="mt-5 space-y-3 border-t border-[var(--color-border-tertiary)] pt-4 text-[13px]">
          <li className="flex justify-between gap-2">
            <span className="text-[var(--color-text-tertiary)]">{t("tool.fha.loan.loanAmount")}</span>
            <span className="font-medium">{fmt(convLoan)}</span>
          </li>
          <li className="flex justify-between gap-2">
            <span className="text-[var(--color-text-tertiary)]">{t("tool.fha.loan.downPayment")}</span>
            <span className="font-medium">
              {fmt(dpAmt)} ({dpInput}%)
            </span>
          </li>
          <li className="flex justify-between gap-2">
            <span className="text-[var(--color-text-tertiary)]">{t("tool.fha.loan.interestRate")}</span>
            <span className="font-medium">{convRate}%</span>
          </li>
          <li className="flex justify-between gap-2">
            <span className="text-[var(--color-text-tertiary)]">{t("tool.fha.loan.upfrontMi")}</span>
            <span className="font-semibold text-[#27500A]">$0</span>
          </li>
          <li className="flex justify-between gap-2">
            <span className="text-[var(--color-text-tertiary)]">{t("tool.fha.loan.monthlyPmi")}</span>
            <span className="font-semibold text-[#27500A]"> {pmiRate === 0 ? t("tool.fha.loan.none20Down") : fmt(pmiMoInit)}</span>
          </li>
          <li className="flex justify-between gap-2">
            <span className="text-[var(--color-text-tertiary)]">{t("tool.fha.loan.pmiRemoval")}</span>
            <span className="font-semibold text-[#27500A]">
              {pmiRate === 0 ? (
                t("tool.fha.loan.pmiCancelNa")
              ) : pmiRemoveYr ? (
                <span className="text-[#854F0B]">{t("tool.fha.loan.tildeYrs").replace("{n}", String(pmiRemoveYr))}</span>
              ) : (
                <span className="text-[#854F0B]">{t("tool.fha.loan.whenLtv80")}</span>
              )}
            </span>
          </li>
          <li className="flex justify-between gap-2">
            <span className="text-[var(--color-text-tertiary)]">{totalCostLabel}</span>
            <span className={`font-semibold ${win(convWinner)}`}>{fmtK(convAtStay)}</span>
          </li>
        </ul>
      </div>

      <div className={`rounded-xl bg-white p-5 shadow-sm sm:p-6 ${fhaBorder}`}>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-[Georgia,serif] text-xl font-semibold text-[#3B6D11]">{fhaLabel}</h3>
          <span className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#27500A]" style={{ background: "#EAF3DE" }}>
            {t("tool.fha.loan.govBacked")}
          </span>
        </div>
        <p className="mt-3 font-[Georgia,serif] text-[26px] font-semibold text-[#3B6D11]">
          {fmt(fhaTotal)}
          {perMo}
        </p>
        <p className="mt-1 text-[12px] text-[var(--color-text-tertiary)]">
          {t("tool.fha.loan.piPlusMip").replace("{pi}", fmt(fhaPmt)).replace("{mip}", fmt(mipMoInit))}
        </p>
        <ul className="mt-5 space-y-3 border-t border-[var(--color-border-tertiary)] pt-4 text-[13px]">
          <li className="flex justify-between gap-2">
            <span className="text-[var(--color-text-tertiary)]">{t("tool.fha.loan.loanAmount")}</span>
            <span className="text-right font-medium">
              {fmt(fhaLoan)}
              <span className="mt-0.5 block text-[10px] font-normal text-[var(--color-text-tertiary)]">{t("tool.fha.loan.includesUfmip")}</span>
            </span>
          </li>
          <li className="flex justify-between gap-2">
            <span className="text-[var(--color-text-tertiary)]">{t("tool.fha.loan.downPayment")}</span>
            <span className="font-medium">
              {fmt(results.dpAmtFha)} ({results.fhaUsesMinDown ? "3.5" : dpInput}%)
            </span>
          </li>
          <li className="flex justify-between gap-2">
            <span className="text-[var(--color-text-tertiary)]">{t("tool.fha.loan.interestRate")}</span>
            <span className="font-medium">{fhaRate}%</span>
          </li>
          <li className="flex justify-between gap-2">
            <span className="text-[var(--color-text-tertiary)]">{t("tool.fha.loan.upfrontMip175")}</span>
            <span className="font-semibold text-[#A32D2D]">
              {fmt(fhaUFMIP)} {t("tool.fha.loan.rolledInShort")}
            </span>
          </li>
          <li className="flex justify-between gap-2">
            <span className="text-[var(--color-text-tertiary)]">{t("tool.fha.loan.monthlyMip")}</span>
            <span className="font-semibold text-[#A32D2D]">{fmt(mipMoInit)}</span>
          </li>
          <li className="flex justify-between gap-2">
            <span className="text-[var(--color-text-tertiary)]">{t("tool.fha.loan.mipRemoval")}</span>
            <span className="font-semibold">
              {dpPercentFha >= 10 ? (
                <span className="text-[#854F0B]">{t("tool.fha.loan.after11Yrs")}</span>
              ) : (
                <span className="text-[#A32D2D]">{t("tool.fha.loan.neverRefiRemove")}</span>
              )}
            </span>
          </li>
          <li className="flex justify-between gap-2">
            <span className="text-[var(--color-text-tertiary)]">{totalCostLabel}</span>
            <span className={`font-semibold ${win(fhaWinner)}`}>{fmtK(fhaAtStay)}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
