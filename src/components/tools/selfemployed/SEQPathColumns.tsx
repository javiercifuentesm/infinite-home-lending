import type { ReactNode } from "react";
import type { SEQRunResult } from "../../../hooks/useSEQMath";
import type { SEQInputs } from "../../../hooks/useSEQMath";
import { useLanguage } from "../../../i18n/LanguageContext";
import type { SEQPath } from "./SEQPathTabs";
import { fmt, fmtK } from "./seqFormat";

type Props = {
  path: SEQPath;
  results: SEQRunResult;
  inputs: SEQInputs;
};

function Row({ label, value, valueClass }: { label: string; value: ReactNode; valueClass?: string }) {
  return (
    <div className="flex flex-wrap justify-between gap-2 border-b border-slate-100 py-2.5 text-[12px] last:border-b-0">
      <span className="text-slate-600">{label}</span>
      <span className={`text-right font-medium ${valueClass ?? "text-slate-900"}`}>{value}</span>
    </div>
  );
}

export function SEQPathColumns({ path, results, inputs }: Props) {
  const { t } = useLanguage();
  const {
    tx,
    bs,
    txMaxPrice,
    txCanAfford,
    bsMaxPrice,
    bsCanAfford,
    BASE_RATE,
    BS_RATE,
    targetPrice,
  } = results;

  const showTax = path === "taxreturn" || path === "compare";
  const showBs = path === "bankstatement" || path === "compare";
  const compare = path === "compare";

  const gapTx = Math.max(0, targetPrice - txMaxPrice);
  const gapBs = Math.max(0, targetPrice - bsMaxPrice);

  const taxBorder = compare
    ? txMaxPrice >= bsMaxPrice
      ? "border-2 border-[#C6A15B]"
      : "border border-slate-200/80"
    : "border border-slate-200/80";

  const bsBorder = compare
    ? bsMaxPrice >= txMaxPrice
      ? "border-2 border-[#C6A15B]"
      : "border border-slate-200/80"
    : "border border-slate-200/80";

  const taxCardClass = `rounded-lg bg-white p-5 shadow-sm ${taxBorder}`;
  const bsCardClass = `rounded-lg bg-white p-5 shadow-sm ${bsBorder}`;

  const gridClass =
    showTax && showBs ? "grid grid-cols-1 gap-6 lg:grid-cols-2" : "grid grid-cols-1 gap-6";

  const taxQualLine = `${t("tool.seq.cols.qualIncome")} · ${BASE_RATE.toFixed(3)}% ${t("tool.seq.cols.rate")}`;
  const bsQualLine = `${t("tool.seq.cols.qualIncome")} · ${BS_RATE.toFixed(3)}% ${t("tool.seq.cols.rate")}`;

  const decliningBody = t("tool.seq.cols.decliningWarn")
    .replace("${y2}", fmt(inputs.netY2))
    .replace("${y1}", fmt(inputs.netY1));

  const incomeMethodLabel =
    tx.incomeMethod === "Year 2 only (declining)"
      ? t("tool.seq.cols.incomeMethodDeclining")
      : t("tool.seq.cols.incomeMethodAvg");

  const targetLabelTax = `${t("tool.seq.cols.targetPre")} $${fmt(targetPrice)} ${t("tool.seq.cols.targetPost")}`;
  const targetLabelBs = `${t("tool.seq.cols.targetPre")} $${fmt(targetPrice)} ${t("tool.seq.cols.targetPost")}`;

  const incomeRatioVal = t("tool.seq.cols.incomeRatioFmt").replace("{pct}", String(bs.incomeRatioPct));

  return (
    <div className={`mb-8 ${gridClass}`}>
      {showTax ? (
        <article className={taxCardClass}>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <h3 className="font-serif text-lg font-semibold text-[#0B2A4A]">{t("tool.seq.cols.taxTitle")}</h3>
            <span className="rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#0B2A4A]" style={{ background: "#E6F1FB" }}>
              {t("tool.seq.cols.convRate")}
            </span>
          </div>
          <p className="font-serif text-[26px] font-semibold text-[#0B2A4A]">
            ${fmt(tx.qualifyingMonthly)}
            <span className="text-lg font-normal text-slate-600">{t("tool.seq.cols.perMo")}</span>
          </p>
          <p className="text-[12px] text-slate-500">{taxQualLine}</p>

          {tx.declining ? (
            <div
              className="mt-4 rounded border border-amber-200/80 p-3 text-[11px] leading-relaxed"
              style={{ background: "var(--color-background-warning, #fef3c7)", color: "#633806" }}
            >
              {decliningBody}
            </div>
          ) : null}

          <div className="mt-4">
            <Row label={t("tool.seq.cols.netY1")} value={`$${fmt(inputs.netY1)}`} />
            <Row label={t("tool.seq.cols.netY2")} value={`$${fmt(inputs.netY2)}`} />
            <Row
              label={t("tool.seq.cols.incomeRule")}
              value={
                <span className={tx.declining ? "text-amber-800" : ""}>
                  {incomeMethodLabel}
                  {tx.declining ? <span className="ml-1 block text-[10px] text-amber-700">{t("tool.seq.cols.lenderLower")}</span> : null}
                </span>
              }
            />
            <Row label={t("tool.seq.cols.addbacks")} value={`+$${fmt(tx.totalAddback)}`} valueClass="text-green-700" />
            <Row label={t("tool.seq.cols.annualIncome")} value={`$${fmt(tx.qualifyingAnnual)}`} valueClass="text-[#0B2A4A]" />
            <Row label={t("tool.seq.cols.monthlyIncome")} value={`$${fmt(tx.qualifyingMonthly)}`} />
            <Row
              label={t("tool.seq.cols.maxPrice")}
              value={`$${fmtK(txMaxPrice)}`}
              valueClass={txCanAfford ? "text-green-800" : "text-red-700"}
            />
            <Row
              label={targetLabelTax}
              value={
                txCanAfford ? (
                  <span className="text-green-700">{t("tool.seq.cols.yes")}</span>
                ) : (
                  <span className="text-red-700">
                    ✗ {t("tool.seq.cols.gap")} ${fmtK(gapTx)}
                  </span>
                )
              }
            />
          </div>
        </article>
      ) : null}

      {showBs ? (
        <article className={bsCardClass}>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <h3 className="font-serif text-lg font-semibold text-[#3B6D11]">{t("tool.seq.cols.bsTitle")}</h3>
            <span className="rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#3B6D11]" style={{ background: "#EAF3DE" }}>
              {t("tool.seq.cols.nonQM")}
            </span>
          </div>
          <p className="font-serif text-[26px] font-semibold text-[#3B6D11]">
            ${fmt(bs.qualifyingMonthly)}
            <span className="text-lg font-normal text-slate-600">{t("tool.seq.cols.perMo")}</span>
          </p>
          <p className="text-[12px] text-slate-500">{bsQualLine}</p>

          <div className="mt-4">
            <Row label={t("tool.seq.cols.avgDeposits")} value={`$${fmt(inputs.avgDeposits)}`} />
            <Row label={t("tool.seq.cols.expFactor")} value={`−${bs.expFactorPct}%`} valueClass="text-red-700" />
            <Row label={t("tool.seq.cols.incomeRatio")} value={incomeRatioVal} />
            <Row label={t("tool.seq.cols.qualMonthly")} value={`$${fmt(bs.qualifyingMonthly)}`} valueClass="text-green-800" />
            <Row label={t("tool.seq.cols.annualIncome")} value={`$${fmt(bs.qualifyingAnnual)}`} />
            <Row label={t("tool.seq.cols.ratePremium")} value="+0.75%" valueClass="text-red-700" />
            <Row
              label={t("tool.seq.cols.maxPrice")}
              value={`$${fmtK(bsMaxPrice)}`}
              valueClass={bsCanAfford ? "text-green-800" : "text-red-700"}
            />
            <Row
              label={targetLabelBs}
              value={
                bsCanAfford ? (
                  <span className="text-green-700">{t("tool.seq.cols.yes")}</span>
                ) : (
                  <span className="text-red-700">
                    ✗ {t("tool.seq.cols.gap")} ${fmtK(gapBs)}
                  </span>
                )
              }
            />
          </div>
        </article>
      ) : null}
    </div>
  );
}
