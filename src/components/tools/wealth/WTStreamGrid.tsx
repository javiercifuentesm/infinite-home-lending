import type { WealthResults } from "../../../hooks/useWealthMath";
import { fmt, fmtK } from "../../../hooks/useWealthMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = { results: WealthResults };

export function WTStreamGrid({ results }: Props) {
  const { t } = useLanguage();
  const {
    totalAppreciation,
    finalPrincipal,
    totalPMIPaid,
    totalRentInflationExtra,
    totalTaxBenefit,
    totalOppCost,
    pmiRate,
    pmiMo,
    pmiRemoveYear,
    hp,
    dpDollars,
    appr,
    rent,
    rentInc,
    rentAtYear30,
    taxRate,
    invReturn,
    totalUpfront,
    milestoneData,
    year1PrincipalApprox,
  } = results;

  const m30 = milestoneData[30]!;
  const dpPctDisplay = Math.round((dpDollars / hp) * 100);

  const principalDesc = `Forced savings: ${fmt(year1PrincipalApprox)}/mo in year 1, growing each year → ${fmtK(finalPrincipal)} paid down over 30 yrs. Every payment reduces what you owe.`;

  const pmiDesc =
    pmiRate > 0
      ? `PMI of ${fmt(pmiMo)}/mo eliminates at year ~${pmiRemoveYear ?? "N/A"} when LTV hits 80%. Total paid before elimination: ${fmtK(totalPMIPaid)}.`
      : `With ${dpPctDisplay}% down, no PMI required. This is a direct monthly savings vs. lower-down-payment scenarios.`;

  return (
    <div>
      <h3 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">{t("wt.streams.title")}</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div
          className="rounded-lg border p-4"
          style={{ background: "rgba(11,42,74,0.04)", borderColor: "rgba(11,42,74,0.12)" }}
        >
          <p className="text-[18px]">🏗</p>
          <p className="mt-1 text-[12px] font-medium text-[#0B2A4A]">{t("wt.streams.s1.title")}</p>
          <p className="mt-2 font-[Georgia,serif] text-[20px] font-medium" style={{ color: "#0B2A4A" }}>
            +{fmtK(finalPrincipal)}
          </p>
          <p className="mt-2 text-[11px] leading-[1.5] text-slate-600">{principalDesc}</p>
        </div>

        <div
          className="rounded-lg border p-4"
          style={{ background: "rgba(59,109,17,0.04)", borderColor: "rgba(59,109,17,0.12)" }}
        >
          <p className="text-[18px]">📈</p>
          <p className="mt-1 text-[12px] font-medium text-[#0B2A4A]">{t("wt.streams.s2.title")}</p>
          <p className="mt-2 font-[Georgia,serif] text-[20px] font-medium" style={{ color: "#27500A" }}>
            +{fmtK(totalAppreciation)}
          </p>
          <p className="mt-2 text-[11px] leading-[1.5] text-slate-600">
            At {appr.toFixed(1)}%/yr, your {fmt(hp)} home grows to {fmtK(m30.homeVal)} — a gain of {fmtK(totalAppreciation)} on a{" "}
            {fmt(dpDollars)} down payment investment.
          </p>
        </div>

        <div
          className="rounded-lg border p-4"
          style={{ background: "rgba(198,161,91,0.07)", borderColor: "rgba(198,161,91,0.2)" }}
        >
          <p className="text-[18px]">✂️</p>
          <p className="mt-1 text-[12px] font-medium text-[#0B2A4A]">{t("wt.streams.s3.title")}</p>
          <p className="mt-2 font-[Georgia,serif] text-[20px] font-medium" style={{ color: "#854F0B" }}>
            {pmiRate > 0 ? fmtK(totalPMIPaid) : t("wt.streams.s3.noPmi")}
          </p>
          <p className="mt-2 text-[11px] leading-[1.5] text-slate-600">{pmiDesc}</p>
        </div>

        <div
          className="rounded-lg border p-4"
          style={{ background: "rgba(133,79,11,0.04)", borderColor: "rgba(133,79,11,0.1)" }}
        >
          <p className="text-[18px]">🛡</p>
          <p className="mt-1 text-[12px] font-medium text-[#0B2A4A]">{t("wt.streams.s4.title")}</p>
          <p className="mt-2 font-[Georgia,serif] text-[20px] font-medium" style={{ color: "#633806" }}>
            {fmtK(totalRentInflationExtra)}
          </p>
          <p className="mt-2 text-[11px] leading-[1.5] text-slate-600">
            Your mortgage payment stays fixed while rent rises {rentInc.toFixed(1)}%/yr. Today&apos;s {fmt(rent)}/mo rent becomes ~{fmtK(rentAtYear30)}/mo by year 30. Your payment never changes.
          </p>
        </div>

        <div
          className="rounded-lg border p-4"
          style={{ background: "rgba(24,95,165,0.04)", borderColor: "rgba(24,95,165,0.12)" }}
        >
          <p className="text-[18px]">💰</p>
          <p className="mt-1 text-[12px] font-medium text-[#0B2A4A]">{t("wt.streams.s5.title")}</p>
          <p className="mt-2 font-[Georgia,serif] text-[20px] font-medium" style={{ color: "#0C447C" }}>
            {fmtK(totalTaxBenefit)}
          </p>
          <p className="mt-2 text-[11px] leading-[1.5] text-slate-600">
            Mortgage interest deduction at {taxRate}% marginal rate saves ~{fmt(Math.round(totalTaxBenefit / 30 / 12))}/mo on average in early years.
            Benefit decreases as interest portion shrinks. {t("wt.streams.s5.hint")}
          </p>
        </div>

        <div
          className="rounded-lg border p-4"
          style={{ background: "rgba(163,45,45,0.04)", borderColor: "rgba(163,45,45,0.12)" }}
        >
          <p className="text-[18px]">⚖️</p>
          <p className="mt-1 text-[12px] font-medium text-[#0B2A4A]">{t("wt.streams.s6.title")}</p>
          <p className="mt-2 font-[Georgia,serif] text-[20px] font-medium" style={{ color: "#A32D2D" }}>
            −{fmtK(totalOppCost)}
          </p>
          <p className="mt-2 text-[11px] leading-[1.5] text-slate-600">
            Your {fmt(totalUpfront)} down payment + closing costs could have earned {fmtK(totalOppCost)} invested at{" "}
            {invReturn.toFixed(1)}%/yr over 30 years. This is the real cost of locking capital in a home. It&apos;s included because most
            tools don&apos;t show it.
          </p>
        </div>
      </div>
    </div>
  );
}
