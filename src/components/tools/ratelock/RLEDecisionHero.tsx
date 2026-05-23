import type { RLEResults } from "../../../hooks/useRLEMath";
import { fmt, fmtK } from "../../../hooks/useRLEMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = { results: RLEResults };

export function RLEDecisionHero({ results }: Props) {
  const { t } = useLanguage();
  const { lockedPmt, risePmt, rate, lockedTotalInt, term, monthlyRisk, lifetimeRisk, riseScenario } = results;

  const lockFoot = t("tool.rle.decisionHero.lockFoot")
    .replace("{rate}", rate.toFixed(3))
    .replace("{totalInt}", fmtK(lockedTotalInt))
    .replace("{term}", String(term));
  const riseSub = t("tool.rle.decisionHero.riseSub").replace("{rise}", String(riseScenario));
  const riseFoot = t("tool.rle.decisionHero.riseFoot")
    .replace("{moRisk}", fmt(monthlyRisk))
    .replace("{lifetime}", fmtK(lifetimeRisk))
    .replace("{term}", String(term));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div
        className="rounded-xl px-6 py-7 text-white shadow-md"
        style={{ background: "#0B2A4A" }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.5)" }}>
          {t("tool.rle.decisionHero.lockEyebrow")}
        </p>
        <p className="mt-3 font-[Georgia,serif] text-[32px] font-medium leading-none" style={{ color: "#C6A15B" }}>
          {fmt(lockedPmt)}
        </p>
        <p className="mt-2 text-[12px]" style={{ color: "rgba(255,255,255,0.6)" }}>
          {t("tool.rle.decisionHero.lockSub")}
        </p>
        <p className="mt-3 text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
          {lockFoot}
        </p>
      </div>

      <div
        className="rounded-xl border-[0.5px] px-6 py-7 shadow-sm"
        style={{
          background: "rgba(163,45,45,0.08)",
          borderColor: "rgba(163,45,45,0.2)",
        }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: "#A32D2D" }}>
          {t("tool.rle.decisionHero.riseEyebrow")}
        </p>
        <p className="mt-3 font-[Georgia,serif] text-[32px] font-medium leading-none" style={{ color: "#A32D2D" }}>
          {fmt(risePmt)}
        </p>
        <p className="mt-2 text-[12px] font-medium" style={{ color: "#A32D2D" }}>
          {riseSub}
        </p>
        <p className="mt-3 text-[11px] leading-relaxed" style={{ color: "rgba(163,45,45,0.6)" }}>
          {riseFoot}
        </p>
      </div>
    </div>
  );
}
