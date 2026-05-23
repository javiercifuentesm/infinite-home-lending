import type { RLEResults } from "../../../hooks/useRLEMath";
import { fmt, fmtK } from "../../../hooks/useRLEMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = { results: RLEResults };

export function RLEVerdictBanner({ results }: Props) {
  const { t } = useLanguage();
  const {
    closeCall,
    lockSignal,
    floatSignal,
    lifetimeRisk,
    rate,
    lockedPmt,
    monthlyRisk,
    monthlyUpside,
    term,
    dropScenario,
    riseScenario,
    daysToClose,
    rateEnv,
  } = results;

  if (closeCall) {
    const body = t("tool.rle.banner.closeBody").replace("{risk}", fmt(monthlyRisk)).replace("{save}", fmt(monthlyUpside));
    return (
      <div
        className="rounded-r-lg border-l-4 px-5 py-4"
        style={{
          background: "rgba(198,161,91,0.1)",
          borderLeftColor: "rgba(198,161,91,0.2)",
          borderTop: "1px solid rgba(198,161,91,0.15)",
          borderRight: "1px solid rgba(198,161,91,0.15)",
          borderBottom: "1px solid rgba(198,161,91,0.15)",
        }}
      >
        <p className="font-[Georgia,serif] text-[15px] font-medium" style={{ color: "#633806" }}>
          {t("tool.rle.banner.closeTitle")}
        </p>
        <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "#633806" }}>
          {body}
        </p>
      </div>
    );
  }

  if (lockSignal) {
    const envLine = rateEnv === "rising" ? t("tool.rle.banner.lockEnvRising") : t("tool.rle.banner.lockEnvOther");
    const title = t("tool.rle.banner.lockTitle").replace("{lifetime}", fmtK(lifetimeRisk));
    const body = t("tool.rle.banner.lockBody")
      .replace("{rate}", rate.toFixed(3))
      .replace("{pmt}", fmt(lockedPmt))
      .replace("{drop}", String(dropScenario))
      .replace("{days}", String(daysToClose))
      .replace("{rise}", String(riseScenario))
      .replace("{more}", fmt(monthlyRisk))
      .replace("{term}", String(term))
      .replace("{envLine}", envLine);
    return (
      <div className="rounded-r-lg border-l-4 border-[#C6A15B] px-5 py-4" style={{ background: "#0B2A4A" }}>
        <p className="font-[Georgia,serif] text-[15px] font-medium" style={{ color: "#C6A15B" }}>
          {title}
        </p>
        <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
          {body}
        </p>
      </div>
    );
  }

  if (floatSignal) {
    const envWord = rateEnv === "falling" ? t("tool.rle.banner.floatEnvFalling") : t("tool.rle.banner.floatEnvStable");
    const title = t("tool.rle.banner.floatTitle").replace("{save}", fmt(monthlyUpside));
    const body = t("tool.rle.banner.floatBody")
      .replace("{days}", String(daysToClose))
      .replace("{env}", envWord)
      .replace("{risk}", fmt(monthlyRisk));
    return (
      <div
        className="rounded-r-lg border-l-4 px-5 py-4"
        style={{
          background: "rgba(163,45,45,0.07)",
          borderLeftColor: "rgba(163,45,45,0.15)",
          border: "1px solid rgba(163,45,45,0.15)",
        }}
      >
        <p className="font-[Georgia,serif] text-[15px] font-medium" style={{ color: "#A32D2D" }}>
          {title}
        </p>
        <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "#854F0B" }}>
          {body}
        </p>
      </div>
    );
  }

  const title = t("tool.rle.banner.defaultTitle").replace("{lifetime}", fmtK(lifetimeRisk));
  const body = t("tool.rle.banner.defaultBody").replace("{term}", String(term));

  return (
    <div className="rounded-r-lg border-l-4 border-[#C6A15B] px-5 py-4" style={{ background: "#0B2A4A" }}>
      <p className="font-[Georgia,serif] text-[15px] font-medium" style={{ color: "#C6A15B" }}>
        {title}
      </p>
      <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
        {body}
      </p>
    </div>
  );
}
