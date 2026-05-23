import type { ReverseInputs, ReverseResult } from "../../../hooks/useReverseMath";
import { fmt } from "../../../hooks/useReverseMath";
import type { ReactNode } from "react";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = {
  inputs: ReverseInputs;
  results: ReverseResult;
};

export function ReverseIncomeGap({ inputs, results }: Props) {
  const { t } = useLanguage();
  const { retIncome, retExpenses } = inputs;
  const { incomeGap, tenurePayment } = results;
  const gap = incomeGap;
  const absGap = Math.abs(gap);
  const surplus = t("tool.reverse.gap.surplus");

  return (
    <div className="rounded-xl border border-[var(--color-border-tertiary)] bg-white p-5 sm:p-6">
      <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">{t("tool.reverse.gap.title")}</h3>
      <div className="mt-4 border-t border-[var(--color-border-tertiary)]">
        <Row label={t("tool.reverse.gap.retIncome")} value={fmt(retIncome)} />
        <Row label={t("tool.reverse.gap.retExpenses")} value={fmt(retExpenses)} />
        <Row
          label={t("tool.reverse.gap.moGap")}
          value={
            gap > 0 ? (
              <span className="font-semibold text-[#A32D2D]">−{fmt(absGap)}</span>
            ) : (
              <span className="font-semibold text-[#27500A]">
                +{fmt(absGap)} {surplus}
              </span>
            )
          }
        />

        {gap > 0 && tenurePayment > 0 ? (
          <>
            <Row
              label={t("tool.reverse.gap.tenureCovers")}
              value={
                <span className="font-semibold text-[#27500A]">
                  {fmt(Math.min(tenurePayment, gap))}
                  {t("tool.reverse.gap.ofYourGap")}
                </span>
              }
            />
            <Row
              label={t("tool.reverse.gap.remainingGap")}
              value={
                tenurePayment >= gap ? (
                  <span className="font-semibold text-[#27500A]">
                    {t("tool.reverse.gap.fullyCovered")} {fmt(tenurePayment - gap)} {surplus}
                  </span>
                ) : (
                  <span className="font-semibold text-[#A32D2D]">−{fmt(gap - tenurePayment)}</span>
                )
              }
            />
          </>
        ) : null}

        {gap <= 0 ? (
          <Row
            label={t("tool.reverse.gap.coversExpenses")}
            value={<span className="font-semibold text-[#27500A]">{t("tool.reverse.gap.safetyNet")}</span>}
          />
        ) : null}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex min-h-[44px] flex-wrap items-center justify-between gap-4 border-b-[0.5px] border-[var(--color-border-tertiary)] py-3 last:border-b-0">
      <span className="text-[14px] text-[var(--color-text-tertiary)]">{label}</span>
      <div className="text-right text-[14px] tabular-nums text-[#0B2A4A]">{value}</div>
    </div>
  );
}
