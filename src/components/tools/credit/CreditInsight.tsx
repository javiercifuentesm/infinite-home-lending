import type { CreditCalcResult } from "../../../hooks/useCreditMath";
import { fmt, fmtK } from "../../../hooks/useCreditMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = {
  results: CreditCalcResult;
  curScore: number;
  isTopTier: boolean;
};

export function CreditInsight({ results, curScore, isTopTier }: Props) {
  const { t } = useLanguage();
  const { lifetimeSavings, ptsDiff, effectiveTgt, dollarPerPoint } = results;

  let body: string;
  if (isTopTier) {
    body = t("tool.credit.insight.topTier");
  } else if (lifetimeSavings > 50_000) {
    body = t("tool.credit.insight.highSave")
      .replace("{lifetimeSavings}", fmtK(lifetimeSavings))
      .replace("{curScore}", String(curScore))
      .replace("{effectiveTgt}", String(effectiveTgt))
      .replace("{dpp}", fmtK(dollarPerPoint));
  } else if (ptsDiff <= 30) {
    body = t("tool.credit.insight.smallGap")
      .replace("{ptsDiff}", String(ptsDiff))
      .replace("{lifetimeSavings}", fmtK(lifetimeSavings));
  } else {
    body = t("tool.credit.insight.default").replace("{dpp}", `$${fmt(dollarPerPoint)}`);
  }

  return (
    <aside
      className="border-l-[3px] border-[#C6A15B] bg-[var(--color-background-secondary,#f8fafc)] px-4 py-[0.9rem] text-[14px] leading-relaxed text-[#0B2A4A]"
      style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}
    >
      {body}
    </aside>
  );
}
