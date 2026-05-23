import type { ReactNode } from "react";
import type { FHAResult } from "../../../hooks/useFHAMath";
import { fmt, fmtK } from "../../../hooks/useFHAMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = { results: FHAResult };

export function FHAMIExplainer({ results }: Props) {
  const { t } = useLanguage();
  const {
    pmiRate,
    pmiMoInit,
    pmiRemoveYr,
    fhaUFMIP,
    mipMoInit,
    convMiTotal,
    fhaMiTotal,
    dpPercentFha,
  } = results;

  const row = (label: string, value: ReactNode, last?: boolean) => (
    <div
      className={`flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${last ? "" : "border-b border-[var(--color-border-tertiary)]"}`}
    >
      <span className="text-[12px] text-[var(--color-text-tertiary)]">{label}</span>
      <span className="text-[12px] font-medium">{value}</span>
    </div>
  );

  return (
    <div className="rounded-xl border border-[var(--color-border-tertiary)] bg-white p-5 sm:p-6">
      <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">{t("tool.fha.explainer.title")}</h3>
      <div className="mt-4">
        {row(
          t("tool.fha.explainer.convPmiMo"),
          pmiRate === 0 ? <span className="text-[#27500A]">{t("tool.fha.explainer.noPmi")}</span> : fmt(pmiMoInit),
        )}
        {row(
          t("tool.fha.explainer.pmiCancel"),
          pmiRate === 0 ? (
            <span className="text-[#27500A]">{t("tool.fha.explainer.pmiCancelNa")}</span>
          ) : pmiRemoveYr ? (
            `${t("tool.fha.explainer.pmiAutoAt")}${pmiRemoveYr}`
          ) : (
            t("tool.fha.explainer.pmiLtv")
          ),
        )}
        {row(
          t("tool.fha.explainer.fhaUfmip"),
          <span className="text-[#A32D2D]">
            {fmt(fhaUFMIP)} {t("tool.fha.explainer.rolledIn")}
          </span>,
        )}
        {row(t("tool.fha.explainer.fhaMipMo"), <span className="text-[#A32D2D]">{fmt(mipMoInit)}</span>)}
        {row(
          t("tool.fha.explainer.fhaMipCancel"),
          dpPercentFha >= 10 ? (
            <span className="text-[#854F0B]">{t("tool.fha.explainer.fhaMip11")}</span>
          ) : (
            <span className="text-[#A32D2D]">{t("tool.fha.explainer.fhaMipNever")}</span>
          ),
        )}
        {row(t("tool.fha.explainer.totalPmi"), fmtK(convMiTotal))}
        {row(t("tool.fha.explainer.totalMip"), <span className="text-[#854F0B]">{fmtK(fhaMiTotal)}</span>, true)}
      </div>
    </div>
  );
}
