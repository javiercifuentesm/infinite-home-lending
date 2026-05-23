import type { SEQRunResult } from "../../../hooks/useSEQMath";
import { useLanguage } from "../../../i18n/LanguageContext";
import { fmt, fmtK } from "./seqFormat";

type Props = {
  results: SEQRunResult;
  planReduction: number;
};

export function SEQPlanningBox({ results, planReduction }: Props) {
  const { t } = useLanguage();
  const { tx, txMaxPrice, planning, planHomeDiff } = results;
  const gain = planHomeDiff;
  const absGain = Math.abs(gain);

  const reductionK = fmtK(planReduction);
  const title = t("tool.seq.planbox.title").replace("${reduction}", reductionK);
  const body = t("tool.seq.planbox.body").replace("${reduction}", reductionK);
  const footer = t("tool.seq.planbox.footer")
    .replace("${tax}", fmt(planning.planTaxCost))
    .replace("${home}", fmtK(absGain));

  return (
    <div className="mb-10 rounded-xl px-5 py-8 text-white" style={{ backgroundColor: "#0B2A4A" }}>
      <h3 className="font-serif text-[14px] font-semibold text-[#C6A15B]">{title}</h3>
      <p className="mt-3 max-w-3xl text-[12px] leading-relaxed text-white/65">{body}</p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-white/[0.07] p-4">
          <p className="text-[11px] font-semibold text-white">{t("tool.seq.planbox.current")}</p>
          <p className="mt-2 font-serif text-xl text-white">
            ${fmt(tx.qualifyingMonthly)}
            {t("tool.seq.cols.perMo")}
          </p>
          <p className="mt-2 text-[11px] text-white/70">
            {t("tool.seq.planbox.maxHome").replace("${price}", fmtK(txMaxPrice))}
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-[#9FE1CB]/20 p-4">
          <p className="text-[11px] font-semibold text-[#9FE1CB]">{t("tool.seq.planbox.after")}</p>
          <p className="mt-2 font-serif text-xl text-[#9FE1CB]">
            ${fmt(planning.planMonthly)}
            {t("tool.seq.cols.perMo")}
          </p>
          <p className="mt-2 text-[11px] text-white/80">
            {t("tool.seq.planbox.maxHome").replace("${price}", fmtK(planning.planMaxPrice))}
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-[#C6A15B]/25 p-4">
          <p className="text-[11px] font-semibold text-[#C6A15B]">{t("tool.seq.planbox.gained")}</p>
          <p className="mt-2 font-serif text-xl text-[#C6A15B]">
            {gain > 0 ? "+" : gain < 0 ? "−" : ""}
            {gain === 0 ? "$0" : `$${fmtK(absGain)}`}
          </p>
          <p className="mt-2 text-[11px] text-white/80">
            {t("tool.seq.planbox.taxCost").replace("${cost}", fmt(planning.planTaxCost))}
          </p>
        </div>
      </div>

      <p className="mt-6 text-[11px] italic leading-relaxed text-white/50">{footer}</p>
    </div>
  );
}
