import { Link } from "react-router-dom";
import type { SEQRunResult } from "../../../hooks/useSEQMath";
import type { SEQPath } from "./SEQPathTabs";
import { fmt, fmtK } from "./seqFormat";

type Props = {
  path: SEQPath;
  results: SEQRunResult;
};

export function SEQCTA({ path, results }: Props) {
  const { txCanAfford, bsCanAfford, targetPrice, txMaxPrice, bsMaxPrice } = results;

  const qualifies = txCanAfford || bsCanAfford;
  const primaryMaxPrice =
    path === "bankstatement" ? bsMaxPrice : path === "taxreturn" ? txMaxPrice : Math.max(txMaxPrice, bsMaxPrice);
  const gap = Math.max(0, targetPrice - primaryMaxPrice);

  const heading = qualifies
    ? "You qualify — let's lock in the right loan for your self-employed situation."
    : `Your target is $${fmt(targetPrice)} — let's close that $${fmtK(gap)} gap together.`;

  return (
    <section className="mb-8 rounded-lg border border-slate-200/90 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-lg font-semibold text-[#0B2A4A]">{heading}</h3>
          <p className="mt-2 text-[11px] text-slate-500">
            We specialize in self-employed borrowers — and we&apos;ll run both paths to find your strongest option.
          </p>
        </div>
        <div className="shrink-0">
          <Link
            to="/contact"
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg px-8 py-3 text-[13px] font-semibold text-[#0B2A4A] transition-colors hover:bg-[#b48e48]"
            style={{ backgroundColor: "#C6A15B" }}
          >
            Talk to an advisor ↗
          </Link>
        </div>
      </div>
      <p className="mt-6 text-[10px] leading-relaxed text-slate-500">
        This tool provides educational estimates using standard lender methodology for self-employed income qualification.
        Actual qualifying income is determined by a licensed underwriter reviewing complete tax returns and documentation.
        Bank statement loan rates are typically 0.5–2% higher than conventional rates. Results do not constitute a loan
        offer or financial/tax advice. Consult a tax professional regarding deduction strategy. Contact Infinite Home
        Lending for a personalized analysis.
      </p>
    </section>
  );
}
