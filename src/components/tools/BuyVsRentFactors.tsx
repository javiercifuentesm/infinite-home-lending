import type { BuyVsRentInputs, YearlySnapshot } from "../../hooks/useBuyVsRentMath";
import { fmt } from "../../hooks/useBuyVsRentMath";
import { useLanguage } from "../../i18n/LanguageContext";

type Props = {
  inputs: BuyVsRentInputs;
  snapshot: YearlySnapshot;
  crossoverYr: number | null;
};

export function BuyVsRentFactors({ inputs, snapshot, crossoverYr }: Props) {
  const { t } = useLanguage();
  type Factor = { dot: string; title: string; detail: string };
  const factors: Factor[] = [];

  if (crossoverYr != null && crossoverYr <= 7) {
    factors.push({
      dot: "#3B6D11",
      title: t("tool.bvr.factors.strongCrossTitle"),
      detail: t("tool.bvr.factors.strongCrossDetail").replace("{yr}", String(crossoverYr)),
    });
  } else if (crossoverYr == null || crossoverYr > 15) {
    factors.push({
      dot: "#A32D2D",
      title: t("tool.bvr.factors.longCrossTitle"),
      detail: t("tool.bvr.factors.longCrossDetail").replace(
        "{yr}",
        crossoverYr != null ? String(crossoverYr) : t("tool.bvr.factors.longCrossYrPlus"),
      ),
    });
  }

  if (snapshot.monthlyBuyCost > snapshot.monthlyRent * 1.4) {
    factors.push({
      dot: "#A32D2D",
      title: `${t("tool.bvr.factors.costGapPre")} ${fmt(snapshot.monthlyBuyCost - snapshot.monthlyRent)}${t("tool.bvr.factors.costGapPost")}`,
      detail: t("tool.bvr.factors.costGapDetail"),
    });
  } else if (snapshot.monthlyBuyCost < snapshot.monthlyRent * 1.1) {
    factors.push({
      dot: "#3B6D11",
      title: t("tool.bvr.factors.costCloseTitle"),
      detail: t("tool.bvr.factors.costCloseDetail"),
    });
  }

  if (inputs.appr >= 4) {
    factors.push({
      dot: "#3B6D11",
      title: `${inputs.appr}${t("tool.bvr.factors.apprTitle")}`,
      detail: t("tool.bvr.factors.apprDetail"),
    });
  }

  if (inputs.inv >= 8) {
    factors.push({
      dot: "#C6A15B",
      title: `${inputs.inv}${t("tool.bvr.factors.invTitle")}`,
      detail: t("tool.bvr.factors.invDetail"),
    });
  }

  if (inputs.ri >= 4) {
    factors.push({
      dot: "#3B6D11",
      title: `${inputs.ri}${t("tool.bvr.factors.riTitle")}`,
      detail: t("tool.bvr.factors.riDetail"),
    });
  }

  if (inputs.dp >= 20) {
    factors.push({
      dot: "#3B6D11",
      title: t("tool.bvr.factors.pmiTitle"),
      detail: t("tool.bvr.factors.pmiDetail"),
    });
  }

  if (factors.length === 0) {
    factors.push({
      dot: "#C6A15B",
      title: t("tool.bvr.factors.nuanceTitle"),
      detail: t("tool.bvr.factors.nuanceDetail"),
    });
  }

  return (
    <div className="rounded-xl border border-[var(--color-border-tertiary)] bg-white p-5 sm:p-6">
      <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">{t("tool.bvr.factors.title")}</h3>
      <ul className="mt-4 space-y-4">
        {factors.map((f) => (
          <li key={f.title} className="flex gap-3">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: f.dot }} aria-hidden />
            <div>
              <p className="font-semibold text-[#0B2A4A]">{f.title}</p>
              <p className="mt-1 text-[14px] leading-relaxed text-[var(--color-text-tertiary)]">{f.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
