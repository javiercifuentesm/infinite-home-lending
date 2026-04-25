import type { FHAResult } from "../../../hooks/useFHAMath";
import { fmt, fmtK } from "../../../hooks/useFHAMath";

type Props = { results: FHAResult };

export function FHAMetrics({ results }: Props) {
  const {
    convPmt,
    fhaPmt,
    pmiMoInit,
    mipMoInit,
    convWins,
    diff,
    stay,
    crossoverYear,
    pmiRate,
    pmiRemoveYr,
  } = results;

  const convMo = convPmt + pmiMoInit;
  const fhaMo = fhaPmt + mipMoInit;
  const moDiff = Math.abs(convMo - fhaMo);
  const convCheaperMo = convMo < fhaMo;
  const cheaperLabel = convCheaperMo ? "Conventional" : "FHA";

  const card = (title: string, value: string, sub: string) => (
    <div className="rounded-xl border border-[var(--color-border-tertiary)] bg-[var(--color-background-secondary)] p-4 sm:p-5">
      <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">{title}</p>
      <p className="mt-2 font-[Georgia,serif] text-xl font-semibold text-[#0B2A4A]">{value}</p>
      <p className="mt-1 text-[11px] text-[var(--color-text-tertiary)]">{sub}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {card("Monthly difference", fmt(moDiff), `${cheaperLabel} is cheaper/mo`)}
      {card(`Cost difference (${stay} yr)`, fmtK(diff), `${convWins ? "Conventional" : "FHA"} saves this over ${stay} yrs`)}
      {card(
        "Crossover year",
        crossoverYear !== null && crossoverYear <= 30 ? `Year ${crossoverYear}` : "30+",
        "when Conventional becomes cheaper",
      )}
      {card(
        "PMI removal",
        pmiRate === 0 ? "N/A" : pmiRemoveYr ? `${pmiRemoveYr} yrs` : "~7–8 yrs",
        pmiRate === 0 ? "20%+ down, no PMI" : "Conv PMI cancels automatically",
      )}
    </div>
  );
}
