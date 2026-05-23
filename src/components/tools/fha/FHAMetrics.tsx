import type { FHAResult } from "../../../hooks/useFHAMath";
import { fmt, fmtK } from "../../../hooks/useFHAMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = { results: FHAResult };

export function FHAMetrics({ results }: Props) {
  const { t } = useLanguage();
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
  const cheaperLabel = convCheaperMo ? t("tool.fha.metrics.conventional") : t("tool.fha.metrics.fha");
  const winnerLabel = convWins ? t("tool.fha.metrics.conventional") : t("tool.fha.metrics.fha");
  const costDiffTitle = `${t("tool.fha.metrics.costDiffPre")} (${stay} ${t("tool.fha.metrics.costDiffPost")})`;

  const card = (title: string, value: string, sub: string) => (
    <div className="rounded-xl border border-[var(--color-border-tertiary)] bg-[var(--color-background-secondary)] p-4 sm:p-5">
      <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-tertiary)]">{title}</p>
      <p className="mt-2 font-[Georgia,serif] text-xl font-semibold text-[#0B2A4A]">{value}</p>
      <p className="mt-1 text-[11px] text-[var(--color-text-tertiary)]">{sub}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {card(t("tool.fha.metrics.moDiff"), fmt(moDiff), `${cheaperLabel} ${t("tool.fha.metrics.isCheaperMo")}`)}
      {card(costDiffTitle, fmtK(diff), `${winnerLabel} ${t("tool.fha.metrics.savesPre")} ${stay} ${t("tool.fha.metrics.savesPost")}`)}
      {card(
        t("tool.fha.metrics.crossoverTitle"),
        crossoverYear !== null && crossoverYear <= 30
          ? `${t("tool.fha.metrics.year")} ${crossoverYear}`
          : t("tool.fha.metrics.crossover30plus"),
        t("tool.fha.metrics.crossoverSub"),
      )}
      {card(
        t("tool.fha.metrics.pmiRemoval"),
        pmiRate === 0
          ? t("tool.fha.metrics.na")
          : pmiRemoveYr
            ? `${pmiRemoveYr} ${t("tool.fha.metrics.yrs")}`
            : t("tool.fha.metrics.pmi78"),
        pmiRate === 0 ? t("tool.fha.metrics.pmiNone") : t("tool.fha.metrics.pmiAuto"),
      )}
    </div>
  );
}
