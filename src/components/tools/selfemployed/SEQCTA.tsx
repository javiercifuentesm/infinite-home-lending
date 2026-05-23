import { Link } from "react-router-dom";
import type { SEQRunResult } from "../../../hooks/useSEQMath";
import { useLanguage } from "../../../i18n/LanguageContext";
import type { SEQPath } from "./SEQPathTabs";
import { fmt, fmtK } from "./seqFormat";

type Props = {
  path: SEQPath;
  results: SEQRunResult;
};

export function SEQCTA({ path, results }: Props) {
  const { t } = useLanguage();
  const { txCanAfford, bsCanAfford, targetPrice, txMaxPrice, bsMaxPrice } = results;

  const qualifies = txCanAfford || bsCanAfford;
  const primaryMaxPrice =
    path === "bankstatement" ? bsMaxPrice : path === "taxreturn" ? txMaxPrice : Math.max(txMaxPrice, bsMaxPrice);
  const gap = Math.max(0, targetPrice - primaryMaxPrice);

  const heading = qualifies
    ? t("tool.seq.cta.qualify")
    : t("tool.seq.cta.gap").replace("${target}", fmt(targetPrice)).replace("${gap}", fmtK(gap));

  return (
    <section className="mb-8 rounded-lg border border-slate-200/90 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-lg font-semibold text-[#0B2A4A]">{heading}</h3>
          <p className="mt-2 text-[11px] text-slate-500">{t("tool.seq.cta.sub")}</p>
        </div>
        <div className="shrink-0">
          <Link
            to="/contact"
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg px-8 py-3 text-[13px] font-semibold text-[#0B2A4A] transition-colors hover:bg-[#b48e48]"
            style={{ backgroundColor: "#C6A15B" }}
          >
            {t("tool.seq.cta.btn")}
          </Link>
        </div>
      </div>
      <p className="mt-6 text-[10px] leading-relaxed text-slate-500">{t("tool.seq.cta.disclaimer")}</p>
    </section>
  );
}
