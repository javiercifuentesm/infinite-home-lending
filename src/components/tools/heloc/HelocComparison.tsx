import type { HelocResult } from "../../../hooks/useHelocMath";
import { fmt, fmtK } from "../../../hooks/useHelocMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = { results: HelocResult };

export function HelocComparison({ results }: Props) {
  const { t } = useLanguage();
  const {
    ioPmt,
    piPmtVal,
    totalInt,
    hePmt,
    heTotalInt,
    heRate,
    cashPmt,
    cashTotalInt,
    cashRate,
    helocWins,
    heWins,
  } = results;

  /** Cash-out is never highlighted; if it has lowest interest, show border on the better of HELOC vs HE. */
  const noHelocHeWinner = !helocWins && !heWins;
  const highlightHeloc =
    helocWins || (noHelocHeWinner && totalInt <= heTotalInt);
  const highlightHe = heWins || (noHelocHeWinner && heTotalInt < totalInt);

  const helocBorder = highlightHeloc ? "border-2 border-[#27500A]" : "border-[0.5px] border-[var(--color-border-tertiary)]";
  const heBorder = highlightHe ? "border-2 border-[#27500A]" : "border-[0.5px] border-[var(--color-border-tertiary)]";
  const cashBorder = "border-[0.5px] border-[var(--color-border-tertiary)]";

  const winC = (w: boolean) => (w ? "text-[#27500A]" : "text-[#A32D2D]");
  const helocIntGreen = helocWins || highlightHeloc;
  const heIntGreen = heWins || highlightHe;

  return (
    <div>
      <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">{t("tool.heloc.compare.title")}</h3>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className={`rounded-xl bg-white p-5 shadow-sm ${helocBorder}`}>
          <h4 className={`font-[Georgia,serif] text-[16px] font-semibold ${highlightHeloc ? "text-[#27500A]" : "text-[var(--color-text-tertiary)]"}`}>
            {t("tool.heloc.compare.helocTitle")}
          </h4>
          <ul className="mt-4 space-y-2.5 text-[13px]">
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">{t("tool.heloc.compare.drawPmt")}</span>
              <span className="font-semibold text-[#27500A]">{fmt(ioPmt)}{t("tool.heloc.payChart.perMo")}</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">{t("tool.heloc.compare.repayPmt")}</span>
              <span className="font-semibold text-[#0B2A4A]">{fmt(piPmtVal)}{t("tool.heloc.payChart.perMo")}</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">{t("tool.heloc.compare.rateType")}</span>
              <span className="font-medium">{t("tool.heloc.compare.variable")}</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">{t("tool.heloc.compare.keepsFirst")}</span>
              <span className="font-semibold text-[#27500A]">{t("tool.heloc.compare.yes")}</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">{t("tool.heloc.compare.totalInt")}</span>
              <span className={`font-semibold ${winC(helocIntGreen)}`}>{fmtK(totalInt)}</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">{t("tool.heloc.compare.flex")}</span>
              <span className="font-semibold text-[#27500A]">{t("tool.heloc.compare.flexDraw")}</span>
            </li>
          </ul>
        </div>

        <div className={`rounded-xl bg-white p-5 shadow-sm ${heBorder}`}>
          <h4 className={`font-[Georgia,serif] text-[16px] font-semibold ${highlightHe ? "text-[#27500A]" : "text-[var(--color-text-tertiary)]"}`}>
            {t("tool.heloc.compare.heTitle")}
          </h4>
          <ul className="mt-4 space-y-2.5 text-[13px]">
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">{t("tool.heloc.compare.monthlyPmt")}</span>
              <span className="font-semibold text-[#0B2A4A]">{fmt(hePmt)}{t("tool.heloc.payChart.perMo")}</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">{t("tool.heloc.compare.rateType")}</span>
              <span className="font-medium">{t("tool.heloc.compare.fixed")}</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">{t("tool.heloc.compare.estRate")}</span>
              <span className="font-medium">{heRate.toFixed(2)}%</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">{t("tool.heloc.compare.keepsFirst")}</span>
              <span className="font-semibold text-[#27500A]">{t("tool.heloc.compare.yes")}</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">{t("tool.heloc.compare.totalIntHe")}</span>
              <span className={`font-semibold ${winC(heIntGreen)}`}>{fmtK(heTotalInt)}</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">{t("tool.heloc.compare.flex")}</span>
              <span className="font-semibold text-[#A32D2D]">{t("tool.heloc.compare.flexLump")}</span>
            </li>
          </ul>
        </div>

        <div className={`rounded-xl bg-white p-5 shadow-sm ${cashBorder}`}>
          <h4 className="font-[Georgia,serif] text-[16px] font-semibold text-[var(--color-text-tertiary)]">{t("tool.heloc.compare.cashTitle")}</h4>
          <ul className="mt-4 space-y-2.5 text-[13px]">
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">{t("tool.heloc.compare.monthlyPmt")}</span>
              <span className="font-semibold text-[#A32D2D]">{fmt(cashPmt)}{t("tool.heloc.payChart.perMo")}</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">{t("tool.heloc.compare.rateType")}</span>
              <span className="font-medium">{t("tool.heloc.compare.fixedNew")}</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">{t("tool.heloc.compare.estRate")}</span>
              <span className="font-medium">{cashRate.toFixed(2)}%</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">{t("tool.heloc.compare.keepsFirst")}</span>
              <span className="font-semibold text-[#A32D2D]">{t("tool.heloc.compare.noReplace")}</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">{t("tool.heloc.compare.totalIntCash")}</span>
              <span className="font-semibold text-[#A32D2D]">{fmtK(cashTotalInt)}</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-[var(--color-text-tertiary)]">{t("tool.heloc.compare.flex")}</span>
              <span className="font-semibold text-[#A32D2D]">{t("tool.heloc.compare.flexLump")}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
