import type { PowerMapInputs, PowerMapResults } from "../../../hooks/usePowerMapMath";
import { ACCESSIBILITY_BUFFER, fmtK } from "../../../hooks/usePowerMapMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type MWithStatus = PowerMapResults["marketsWithStatus"][number];

type TFn = (key: string) => string;

function marketsAccessibleAt(price: number, marketsWithStatus: MWithStatus[], t: TFn): string {
  const names = marketsWithStatus
    .filter((m) => price >= m.price * ACCESSIBILITY_BUFFER)
    .slice(-3)
    .map((m) => m.name)
    .reverse();
  return names.join(", ") || t("tool.pm.road.buildingFirst");
}

function fmtMoney(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
}

function actionsForPeriod(period: "q90" | "m6" | "m12", inputs: PowerMapInputs, t: TFn): string {
  const { creditImp, debtPayoff, savingsBoost, incomeGrowth, scoreBase, savingsRate } = inputs;
  const pct = period === "q90" ? 0.25 : period === "m6" ? 0.5 : 1.0;
  const actions: string[] = [];

  if (creditImp > 0) {
    const targetScore = Math.min(760, scoreBase + Math.round(creditImp * pct));
    actions.push(t("tool.pm.road.actCredit").replace("{score}", String(targetScore)));
  }
  if (debtPayoff > 0) {
    actions.push(t("tool.pm.road.actDebt").replace("${amt}", fmtMoney(Math.round(debtPayoff * pct))));
  }
  if (savingsBoost > 0) {
    actions.push(
      t("tool.pm.road.actSave").replace("${amt}", `$${(savingsRate + savingsBoost).toLocaleString("en-US")}`),
    );
  }
  if (incomeGrowth > 0) {
    const incGain = Math.round(incomeGrowth * pct);
    actions.push(t("tool.pm.road.actIncome").replace("${amt}", `$${incGain.toLocaleString("en-US")}`));
  }
  return actions.slice(0, 2).join(" · ") || t("tool.pm.road.reviewAdvisor");
}

type Props = {
  inputs: PowerMapInputs;
  results: PowerMapResults;
};

export function PMRoadmap({ inputs, results }: Props) {
  const { t } = useLanguage();
  const {
    currentPrice,
    q90Price,
    m6Price,
    m12Price,
    q90Savings,
    m6Savings,
    m12Savings,
    baseRate,
    scoreBase,
    savings,
    impScore,
    impRate,
    marketsWithStatus,
  } = results;

  const todayMarkets = marketsAccessibleAt(currentPrice, marketsWithStatus, t);
  const q90Markets = marketsAccessibleAt(q90Price, marketsWithStatus, t);
  const m6Markets = marketsAccessibleAt(m6Price, marketsWithStatus, t);
  const m12Markets = marketsAccessibleAt(m12Price, marketsWithStatus, t);

  const qualLine = t("tool.pm.road.qualLine")
    .replace("{rate}", baseRate.toFixed(3))
    .replace("{score}", String(scoreBase))
    .replace("{savings}", fmtK(savings));

  const finalLine = t("tool.pm.road.finalLine")
    .replace("{score}", String(impScore))
    .replace("{rate}", impRate.toFixed(3))
    .replace("{savings}", fmtK(m12Savings));

  return (
    <div>
      <h3 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">{t("tool.pm.road.title")}</h3>
      <div className="mt-5 space-y-4">
        {/* Today */}
        <div
          className="flex gap-4 rounded-xl border p-4"
          style={{ background: "rgba(11,42,74,0.04)", borderColor: "rgba(11,42,74,0.15)" }}
        >
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm"
            style={{ background: "#0B2A4A", color: "#C6A15B" }}
            aria-hidden
          >
            📍
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide"
              style={{ color: "#0B2A4A" }}>
              {t("tool.pm.road.todayLabel")}
            </p>
            <p className="mt-1 font-[Georgia,serif] text-[20px]">{fmtK(currentPrice)}</p>
            <p className="mt-2 text-[11px] leading-[1.5] text-slate-500">
              {t("tool.pm.road.markets")} {todayMarkets}
            </p>
            <p className="mt-1 text-[11px] italic text-slate-500">{qualLine}</p>
          </div>
        </div>

        {/* 90-day */}
        <div
          className="flex gap-4 rounded-xl border p-4"
          style={{ background: "rgba(198,161,91,0.05)", borderColor: "rgba(198,161,91,0.2)" }}
        >
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
            style={{ background: "rgba(198,161,91,0.2)", color: "#854F0B" }}
          >
            90
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "#854F0B" }}>
              {t("tool.pm.road.m90")}
            </p>
            <p className="mt-1 font-[Georgia,serif] text-[20px]">{fmtK(q90Price)}</p>
            <p className="mt-2 text-[11px] leading-[1.5] text-slate-500">
              {t("tool.pm.road.marketsOpening")} {q90Markets}
            </p>
            <p className="mt-1 text-[11px] italic text-slate-500">
              {actionsForPeriod("q90", inputs, t)} · {t("tool.pm.road.savingsSep")} ~{fmtK(q90Savings)}
            </p>
          </div>
        </div>

        {/* 6-month */}
        <div
          className="flex gap-4 rounded-xl border p-4"
          style={{ background: "rgba(59,109,17,0.05)", borderColor: "rgba(59,109,17,0.15)" }}
        >
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
            style={{ background: "rgba(59,109,17,0.15)", color: "#27500A" }}
          >
            6M
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "#3B6D11" }}>
              {t("tool.pm.road.m6")}
            </p>
            <p className="mt-1 font-[Georgia,serif] text-[20px]">{fmtK(m6Price)}</p>
            <p className="mt-2 text-[11px] leading-[1.5] text-slate-500">
              {t("tool.pm.road.marketsOpening")} {m6Markets}
            </p>
            <p className="mt-1 text-[11px] italic text-slate-500">
              {actionsForPeriod("m6", inputs, t)} · {t("tool.pm.road.savingsSep")} ~{fmtK(m6Savings)}
            </p>
          </div>
        </div>

        {/* 12-month */}
        <div className="flex gap-4 rounded-xl border-2 border-[#3B6D11] p-4" style={{ background: "rgba(59,109,17,0.08)" }}>
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{ background: "#3B6D11" }}
          >
            1Y
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "#27500A" }}>
              {t("tool.pm.road.m12")}
            </p>
            <p className="mt-1 font-[Georgia,serif] text-[20px]">{fmtK(m12Price)}</p>
            <p className="mt-2 text-[11px] leading-[1.5] text-slate-500">
              {t("tool.pm.road.marketsUnlocked")} {m12Markets}
            </p>
            <p className="mt-1 text-[11px] italic text-slate-500">{finalLine}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
