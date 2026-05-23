import type { FHAResult } from "../../../hooks/useFHAMath";
import { fmtK } from "../../../hooks/useFHAMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = {
  results: FHAResult;
  dpInput: number;
};

export function FHAVerdictBanner({ results, dpInput }: Props) {
  const { t } = useLanguage();
  const {
    convWins,
    close,
    diff,
    stay,
    cs,
    crossoverYear,
    dpPercentFha,
    pmiRate,
    pmiMoInit,
  } = results;

  const pmiFree = pmiRate === 0 || pmiMoInit === 0;
  const lowDp = dpPercentFha < 10;

  if (close) {
    const body = convWins
      ? t("tool.fha.verdict.closeBodyLess").replace("{stay}", String(stay)).replace("{diff}", fmtK(diff))
      : t("tool.fha.verdict.closeBodySame").replace("{stay}", String(stay));
    return (
      <div
        className="rounded-xl border border-[var(--color-border-tertiary)] p-5 sm:p-6"
        style={{ background: "var(--color-background-warning, #FEF9E8)", borderLeftWidth: 4, borderLeftColor: "#854F0B" }}
      >
        <p className="font-[Georgia,serif] text-[15px] font-medium text-[#633806]">{t("tool.fha.verdict.closeTitle")}</p>
        <p className="mt-2 text-[13px] leading-relaxed text-[#854F0B]">{body}</p>
      </div>
    );
  }

  if (convWins) {
    const pmiFragment = pmiFree ? t("tool.fha.verdict.pmiFreeFrag") : t("tool.fha.verdict.pmiFrag");
    const lowDpNote = lowDp ? t("tool.fha.verdict.lowDpFrag") : "";
    const crossoverSentence = crossoverYear
      ? t("tool.fha.verdict.crossoverAt").replace("{yr}", String(crossoverYear))
      : t("tool.fha.verdict.cheaperYearOne");
    const body = t("tool.fha.verdict.convSavesBody")
      .replace("{cs}", String(cs))
      .replace("{dp}", String(dpInput))
      .replace("{pmiFragment}", pmiFragment)
      .replace("{lowDpNote}", lowDpNote)
      .replace("{crossoverSentence}", crossoverSentence);

    return (
      <div
        className="rounded-xl border border-[var(--color-border-tertiary)] p-5 sm:p-6"
        style={{ background: "var(--color-background-info, #E8F4FC)", borderLeftWidth: 4, borderLeftColor: "#185FA5" }}
      >
        <p className="font-[Georgia,serif] text-[15px] font-medium text-[#0C447C]">
          {t("tool.fha.verdict.convSavesTitle").replace("{diff}", fmtK(diff)).replace("{stay}", String(stay))}
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-[#185FA5]">{body}</p>
      </div>
    );
  }

  const flexPhrase = cs < 680 ? t("tool.fha.verdict.fhaFlexPhrase") : "";
  const base = t("tool.fha.verdict.fhaSavesBodyBase").replace("{flexPhrase}", flexPhrase).replace("{stay}", String(stay));
  const tail = crossoverYear
    ? t("tool.fha.verdict.fhaCrossoverAfter").replace("{yr}", String(crossoverYear))
    : t("tool.fha.verdict.fhaStrongFit");

  return (
    <div
      className="rounded-xl border border-[var(--color-border-tertiary)] p-5 sm:p-6"
      style={{ background: "var(--color-background-success, #EAF3DE)", borderLeftWidth: 4, borderLeftColor: "#3B6D11" }}
    >
      <p className="font-[Georgia,serif] text-[15px] font-medium text-[#27500A]">
        {t("tool.fha.verdict.fhaSavesTitle").replace("{diff}", fmtK(diff)).replace("{stay}", String(stay))}
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-[#3B6D11]">
        {base}
        {tail}
      </p>
    </div>
  );
}
