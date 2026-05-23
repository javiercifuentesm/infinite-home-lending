import type { PowerMapResults } from "../../../hooks/usePowerMapMath";
import { fmtK } from "../../../hooks/usePowerMapMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = { results: PowerMapResults };

export function PMPowerHero({ results }: Props) {
  const { t } = useLanguage();
  const {
    currentPrice,
    improvedPrice,
    powerGain,
    baseRate,
    impRate,
    scoreBase,
    impScore,
  } = results;

  const gainZero = powerGain === 0;
  const todaySub = t("tool.pm.hero.todaySub").replace("{rate}", baseRate.toFixed(3)).replace("{score}", String(scoreBase));
  const improvedSub = t("tool.pm.hero.improvedSub").replace("{rate}", impRate.toFixed(3)).replace("{score}", String(impScore));

  return (
    <div className="grid gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-3" style={{ background: "#0B2A4A" }}>
      <div className="px-5 py-6 sm:px-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.5)" }}>
          {t("tool.pm.hero.today")}
        </p>
        <p className="mt-3 font-[Georgia,serif] text-[28px] font-medium leading-none" style={{ color: "#C6A15B" }}>
          {fmtK(currentPrice)}
        </p>
        <p className="mt-2 text-[11px]" style={{ color: "rgba(255,255,255,0.55)" }}>
          {todaySub}
        </p>
      </div>
      <div className="px-5 py-6 sm:px-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.5)" }}>
          {t("tool.pm.hero.improved")}
        </p>
        <p className="mt-3 font-[Georgia,serif] text-[28px] font-medium leading-none" style={{ color: "#9FE1CB" }}>
          {fmtK(improvedPrice)}
        </p>
        <p className="mt-2 text-[11px]" style={{ color: "rgba(159,225,203,0.7)" }}>
          {improvedSub}
        </p>
      </div>
      <div className="px-5 py-6 sm:px-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.5)" }}>
          {t("tool.pm.hero.gained")}
        </p>
        <p className="mt-3 font-[Georgia,serif] text-[28px] font-medium leading-none text-white">
          {gainZero ? "—" : `${powerGain > 0 ? "+" : ""}${fmtK(powerGain)}`}
        </p>
        <p className="mt-2 text-[11px]" style={{ color: "rgba(255,255,255,0.55)" }}>
          {gainZero ? t("tool.pm.hero.gainedZeroHint") : t("tool.pm.hero.gainedSub")}
        </p>
      </div>
    </div>
  );
}
