import type { ReactNode } from "react";
import type { FHAResult } from "../../../hooks/useFHAMath";
import { fmt } from "../../../hooks/useFHAMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = { results: FHAResult };

export function FHARefiStrategy({ results }: Props) {
  const { t } = useLanguage();
  const { homeVal5, fhaBal5, equity5, refiLTV5, newConvPmt5, newPmiMo5, refiSavings } = results;
  const perMo = t("tool.fha.refi.perMo");

  const row = (label: string, value: ReactNode, last?: boolean) => (
    <div
      className={`flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${last ? "" : "border-b border-[var(--color-border-tertiary)]"}`}
    >
      <span className="text-[12px] text-[var(--color-text-tertiary)]">{label}</span>
      <span className="text-[12px] font-medium">{value}</span>
    </div>
  );

  return (
    <div className="rounded-xl border border-[var(--color-border-tertiary)] p-5 sm:p-6" style={{ background: "rgba(11,42,74,0.04)" }}>
      <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">{t("tool.fha.refi.title")}</h3>
      <p className="mt-2 text-[12px] leading-[1.5] text-[var(--color-text-tertiary)]">{t("tool.fha.refi.body")}</p>
      <div className="mt-4">
        {row(t("tool.fha.refi.homeVal"), fmt(homeVal5))}
        {row(t("tool.fha.refi.fhaBal"), fmt(fhaBal5))}
        {row(t("tool.fha.refi.equity"), <span className="text-[#27500A]">{fmt(equity5)}</span>)}
        {row(t("tool.fha.refi.ltv"), `${refiLTV5}%`)}
        {row(t("tool.fha.refi.newPmt"), `${fmt(newConvPmt5 + newPmiMo5)}${perMo}`)}
        {row(
          t("tool.fha.refi.savings"),
          refiSavings > 0 ? (
            <span className="text-[#27500A]">
              +{fmt(refiSavings)}
              {perMo} {t("tool.fha.refi.savingsPos")}
            </span>
          ) : (
            <span className="text-[#A32D2D]">
              {fmt(Math.abs(refiSavings))}
              {perMo} {t("tool.fha.refi.savingsNeg")}
            </span>
          ),
          true,
        )}
      </div>
    </div>
  );
}
