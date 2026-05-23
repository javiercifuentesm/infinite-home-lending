import type { YearlySnapshot } from "../../hooks/useBuyVsRentMath";
import { fmtK } from "../../hooks/useBuyVsRentMath";
import { useLanguage } from "../../i18n/LanguageContext";

type Props = {
  snapshot: YearlySnapshot;
  crossoverYr: number | null;
};

export function BuyVsRentWowStrip({ snapshot, crossoverYr }: Props) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl bg-[#0B2A4A] px-4 py-5 text-center sm:text-left dark:ring-1 dark:ring-white/10">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[rgba(255,255,255,0.6)] dark:text-white/60">
          {t("tool.bvr.wow.buyWealth")}
        </p>
        <p className="mt-1 font-[Georgia,serif] text-2xl font-medium text-white">{fmtK(snapshot.buyNetWealth)}</p>
        <p className="mt-1 text-[11px] text-[rgba(255,255,255,0.5)] dark:text-white/50">{t("tool.bvr.wow.buyWealthSub")}</p>
      </div>
      <div
        className="rounded-xl border px-4 py-5 text-center sm:text-left"
        style={{ background: "rgba(198,161,91,0.12)", borderColor: "rgba(198,161,91,0.3)" }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#854F0B]">{t("tool.bvr.wow.rentPortfolio")}</p>
        <p className="mt-1 font-[Georgia,serif] text-2xl font-medium text-[#0B2A4A]">{fmtK(snapshot.rentPortfolio)}</p>
        <p className="mt-1 text-[11px] text-[#C6A15B]">{t("tool.bvr.wow.rentPortfolioSub")}</p>
      </div>
      <div className="rounded-xl px-4 py-5 text-center sm:text-left" style={{ background: "var(--color-background-success)" }}>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#3B6D11]">{t("tool.bvr.wow.equity")}</p>
        <p className="mt-1 font-[Georgia,serif] text-2xl font-medium text-[#27500A]">{fmtK(snapshot.equity)}</p>
        <p className="mt-1 text-[11px] text-[#3B6D11]">{t("tool.bvr.wow.equitySub")}</p>
      </div>
      <div className="rounded-xl px-4 py-5 text-center sm:text-left" style={{ background: "var(--color-background-info)" }}>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#0C447C]">{t("tool.bvr.wow.crossover")}</p>
        <p className="mt-1 font-[Georgia,serif] text-2xl font-medium text-[#042C53]">
          {crossoverYr ? `${t("tool.bvr.wow.year")} ${crossoverYr}` : t("tool.bvr.wow.crossoverNone")}
        </p>
        <p className="mt-1 text-[11px] text-[#185FA5]">{t("tool.bvr.wow.crossoverSub")}</p>
      </div>
    </div>
  );
}
