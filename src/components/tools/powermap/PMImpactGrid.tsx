import type { PowerMapInputs, PowerMapResults } from "../../../hooks/usePowerMapMath";
import { fmtK } from "../../../hooks/usePowerMapMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = {
  inputs: PowerMapInputs;
  results: PowerMapResults;
};

export function PMImpactGrid({ inputs, results }: Props) {
  const { t } = useLanguage();
  const {
    creditImpactPrice,
    debtImpactPrice,
    incomeImpactPrice,
    m12Savings,
    baseRate,
    impRate,
  } = results;
  const { creditImp, debtPayoff, incomeGrowth } = inputs;
  const pts = t("tool.pm.sliders.points");

  const creditLabel = `${t("tool.pm.impact.credit")} (+${creditImp} ${pts})`;
  const debtLabel = `${t("tool.pm.impact.debt")} ($${debtPayoff}${t("tool.pm.sliders.moReduced")})`;
  const incomeLabel = `${t("tool.pm.impact.income")} ($${incomeGrowth.toLocaleString("en-US")}${t("tool.pm.sliders.yr")})`;

  const cards = [
    {
      id: "credit",
      border: "#185FA5",
      label: creditLabel,
      value: creditImp > 0 ? `+${fmtK(creditImpactPrice)}` : "$0",
      sub:
        creditImp > 0
          ? `${t("tool.pm.impact.rate")} ${baseRate.toFixed(3)}% → ${impRate.toFixed(3)}%`
          : t("tool.pm.impact.adjustSlider"),
    },
    {
      id: "debt",
      border: "#3B6D11",
      label: debtLabel,
      value: debtPayoff > 0 ? `+${fmtK(debtImpactPrice)}` : "$0",
      sub: debtPayoff > 0 ? t("tool.pm.impact.debtSub") : t("tool.pm.impact.adjustSlider"),
    },
    {
      id: "savings",
      border: "#C6A15B",
      label: t("tool.pm.impact.savings"),
      value: fmtK(m12Savings),
      sub: t("tool.pm.impact.savingsSub"),
    },
    {
      id: "income",
      border: "#854F0B",
      label: incomeLabel,
      value: incomeGrowth > 0 ? `+${fmtK(incomeImpactPrice)}` : "$0",
      sub: incomeGrowth > 0 ? t("tool.pm.impact.incomeSub") : t("tool.pm.impact.adjustSlider"),
    },
  ];

  return (
    <div>
      <h3 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">{t("tool.pm.impact.title")}</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {cards.map((c) => (
          <div
            key={c.id}
            className="rounded-lg border border-slate-200/80 bg-slate-50/90 p-4 pl-5"
            style={{ borderLeftWidth: "3px", borderLeftColor: c.border }}
          >
            <p className="text-[11px] text-slate-500">{c.label}</p>
            <p className="mt-2 text-[18px] font-medium text-[#0B2A4A]">{c.value}</p>
            <p className="mt-1 text-[10px] text-slate-500">{c.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
