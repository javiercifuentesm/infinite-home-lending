import type { SEQRunResult } from "../../../hooks/useSEQMath";
import { useLanguage } from "../../../i18n/LanguageContext";
import type { SEQPath } from "./SEQPathTabs";
import { fmt, fmtK } from "./seqFormat";

type Props = {
  path: SEQPath;
  results: SEQRunResult;
};

export function SEQMetrics({ path, results }: Props) {
  const { t } = useLanguage();
  const useBs = path === "bankstatement";
  const {
    tx,
    bs,
    txMaxLoan,
    txMaxPrice,
    txCanAfford,
    bsMaxLoan,
    bsMaxPrice,
    bsCanAfford,
    BASE_RATE,
    BS_RATE,
    DTI_MAX,
    targetPrice,
    debts,
  } = results;

  const primaryIncome = useBs ? bs.qualifyingMonthly : tx.qualifyingMonthly;
  const primaryMaxLoan = useBs ? bsMaxLoan : txMaxLoan;
  const primaryMaxPrice = useBs ? bsMaxPrice : txMaxPrice;
  const canAfford = useBs ? bsCanAfford : txCanAfford;
  const rate = useBs ? BS_RATE : BASE_RATE;

  const totalDtiPmt = Math.round(primaryIncome * DTI_MAX);
  const available = Math.max(0, totalDtiPmt - debts);
  const gap = Math.max(0, targetPrice - primaryMaxPrice);

  const priceColor = canAfford ? "text-[#27500A]" : "text-[#A32D2D]";

  const maxLoanSub = t("tool.seq.metrics.maxLoanSub").replace("{rate}", rate.toFixed(2));
  const priceSub = canAfford
    ? t("tool.seq.metrics.coversTarget")
    : t("tool.seq.metrics.belowGap").replace("${gap}", fmtK(gap));
  const debtSub = t("tool.seq.metrics.debtSub").replace("${avail}", fmt(available));

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-lg border border-slate-200/90 bg-white p-5 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{t("tool.seq.metrics.qualIncome")}</p>
        <p className="mt-2 font-serif text-2xl font-semibold text-[#0B2A4A]">
          ${fmt(primaryIncome)}
          {t("tool.seq.cols.perMo")}
        </p>
        <p className="mt-1 text-[11px] text-slate-500">{t("tool.seq.metrics.perMonth")}</p>
      </div>
      <div className="rounded-lg border border-slate-200/90 bg-white p-5 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{t("tool.seq.metrics.maxLoan")}</p>
        <p className="mt-2 font-serif text-2xl font-semibold text-[#0B2A4A]">${fmtK(primaryMaxLoan)}</p>
        <p className="mt-1 text-[11px] text-slate-500">{maxLoanSub}</p>
      </div>
      <div className="rounded-lg border border-slate-200/90 bg-white p-5 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{t("tool.seq.metrics.maxPrice")}</p>
        <p className={`mt-2 font-serif text-2xl font-semibold ${priceColor}`}>${fmtK(primaryMaxPrice)}</p>
        <p className="mt-1 text-[11px] text-slate-500">{priceSub}</p>
      </div>
      <div className="rounded-lg border border-slate-200/90 bg-white p-5 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{t("tool.seq.metrics.maxDebtPmt")}</p>
        <p className="mt-2 font-serif text-2xl font-semibold text-[#0B2A4A]">${fmt(totalDtiPmt)}</p>
        <p className="mt-1 text-[11px] text-slate-500">{debtSub}</p>
      </div>
    </div>
  );
}
