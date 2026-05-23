import type { RLEResults } from "../../../hooks/useRLEMath";
import { fmt, fmtK } from "../../../hooks/useRLEMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = { results: RLEResults };

export function RLEScenarioGrid({ results }: Props) {
  const { t } = useLanguage();
  const {
    rateRise,
    rateDrop,
    rate,
    risePmt,
    dropPmt,
    lockedPmt,
    monthlyRisk,
    monthlyUpside,
    lifetimeRisk,
    lifetimeUpside,
    riseScenario,
    dropScenario,
    term,
    daysToClose,
  } = results;

  const annualExtra = monthlyRisk * 12;
  const annualSave = monthlyUpside * 12;

  const riseBadge = t("tool.rle.grid.riseBadge").replace("{rise}", String(riseScenario));
  const riseLead = t("tool.rle.grid.riseLead").replace("{rate}", rateRise.toFixed(3));
  const flatLead = t("tool.rle.grid.flatLead").replace("{rate}", rate.toFixed(3));
  const dropBadge = t("tool.rle.grid.dropBadge").replace("{drop}", String(dropScenario));
  const dropLead = t("tool.rle.grid.dropLead").replace("{rate}", rateDrop.toFixed(3));

  const dtExtraMo = t("tool.rle.grid.dtExtraMo").replace("{amt}", fmt(monthlyRisk));
  const dtExtraYrs = t("tool.rle.grid.dtExtraYrs").replace("{term}", String(term));
  const dtAnnualExtraVal = t("tool.rle.grid.dtAnnualExtraVal").replace("{amt}", fmt(annualExtra));
  const dtDaysVal = t("tool.rle.grid.dtDaysVal").replace("{days}", String(daysToClose));
  const dtSaveMo = t("tool.rle.grid.dtSaveMo").replace("{amt}", fmt(monthlyUpside));
  const dtSaveYrs = t("tool.rle.grid.dtSaveYrs").replace("{term}", String(term));
  const dtAnnualSaveVal = t("tool.rle.grid.dtAnnualSaveVal").replace("{amt}", fmt(annualSave));

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div
        className="rounded-xl border p-5"
        style={{ background: "rgba(163,45,45,0.04)", borderColor: "rgba(163,45,45,0.15)" }}
      >
        <span
          className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          style={{ background: "rgba(163,45,45,0.12)", color: "#A32D2D" }}
        >
          {riseBadge}
        </span>
        <p className="mt-3 text-[12px] font-medium text-slate-700">{riseLead}</p>
        <dl className="mt-4 space-y-2 border-t border-red-200/30 pt-3 text-[13px]">
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">{t("tool.rle.grid.dtNewPmt")}</dt>
            <dd className="font-semibold tabular-nums text-[#A32D2D]">{fmt(risePmt)}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">{t("tool.rle.grid.dtExtraVs")}</dt>
            <dd className="font-semibold tabular-nums text-[#A32D2D]">{dtExtraMo}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">{dtExtraYrs}</dt>
            <dd className="font-semibold tabular-nums text-[#A32D2D]">+{fmtK(lifetimeRisk)}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">{t("tool.rle.grid.dtAnnualExtra")}</dt>
            <dd className="font-semibold tabular-nums text-[#A32D2D]">{dtAnnualExtraVal}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
        <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
          {t("tool.rle.grid.flatBadge")}
        </span>
        <p className="mt-3 text-[12px] font-medium text-slate-700">{flatLead}</p>
        <dl className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-[13px]">
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">{t("tool.rle.grid.dtMonthly")}</dt>
            <dd className="font-semibold tabular-nums text-[#0B2A4A]">{fmt(lockedPmt)}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">{t("tool.rle.grid.dtVsLock")}</dt>
            <dd className="font-medium text-slate-700">{t("tool.rle.grid.identical")}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">{t("tool.rle.grid.dtDaysUncertain")}</dt>
            <dd className="font-medium text-slate-700">{dtDaysVal}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">{t("tool.rle.grid.dtOutcome")}</dt>
            <dd className="font-medium text-slate-600">{t("tool.rle.grid.outcomeFlat")}</dd>
          </div>
        </dl>
      </div>

      <div
        className="rounded-xl border p-5"
        style={{ background: "rgba(59,109,17,0.04)", borderColor: "rgba(59,109,17,0.15)" }}
      >
        <span
          className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          style={{ background: "rgba(59,109,17,0.12)", color: "#27500A" }}
        >
          {dropBadge}
        </span>
        <p className="mt-3 text-[12px] font-medium text-slate-700">{dropLead}</p>
        <dl className="mt-4 space-y-2 border-t border-emerald-200/40 pt-3 text-[13px]">
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">{t("tool.rle.grid.dtNewPmt")}</dt>
            <dd className="font-semibold tabular-nums text-[#3B6D11]">{fmt(dropPmt)}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">{t("tool.rle.grid.dtSaveVs")}</dt>
            <dd className="font-semibold tabular-nums text-[#3B6D11]">{dtSaveMo}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">{dtSaveYrs}</dt>
            <dd className="font-semibold tabular-nums text-[#3B6D11]">−{fmtK(lifetimeUpside)}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">{t("tool.rle.grid.dtAnnualSave")}</dt>
            <dd className="font-semibold tabular-nums text-[#3B6D11]">{dtAnnualSaveVal}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
