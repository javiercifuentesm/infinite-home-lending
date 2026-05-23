import type { RLEResults } from "../../../hooks/useRLEMath";
import { fmt, fmtK } from "../../../hooks/useRLEMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = { results: RLEResults };

export function RLEMetrics({ results }: Props) {
  const { t } = useLanguage();
  const { lockedPmt, rate, monthlyRisk, monthlyUpside, riseScenario, dropScenario, lifetimeRisk } = results;

  const lockedSub = `${t("tool.rle.metrics.lockedSubPre")} ${rate.toFixed(3)}% ${t("tool.rle.metrics.lockedSubPost")}`;
  const riskSub = `${t("tool.rle.metrics.riskSubPre")} +${riseScenario}%`;
  const gainSub = `${t("tool.rle.metrics.gainSubPre")} −${dropScenario}%`;
  const lifetimeSub = t("tool.rle.metrics.lifetimeSub").replace("{rise}", String(riseScenario));

  const cards = [
    {
      id: "locked",
      title: t("tool.rle.metrics.locked"),
      value: fmt(lockedPmt),
      valueClass: "text-[#0B2A4A]",
      sub: lockedSub,
    },
    {
      id: "risk",
      title: t("tool.rle.metrics.riskTitle"),
      value: `+${fmt(monthlyRisk)}`,
      valueClass: "text-[#A32D2D]",
      sub: riskSub,
    },
    {
      id: "gain",
      title: t("tool.rle.metrics.gainTitle"),
      value: `−${fmt(monthlyUpside)}`,
      valueClass: "text-[#27500A]",
      sub: gainSub,
    },
    {
      id: "lifetime",
      title: t("tool.rle.metrics.lifetime"),
      value: fmtK(lifetimeRisk),
      valueClass: "text-[#A32D2D]",
      sub: lifetimeSub,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.id} className="rounded-lg border border-slate-200/90 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{c.title}</p>
          <p className={`mt-2 font-[Georgia,serif] text-xl font-semibold tabular-nums ${c.valueClass}`}>{c.value}</p>
          <p className="mt-1 text-[11px] text-slate-500">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}
