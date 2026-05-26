import type { WealthResults } from "../../../hooks/useWealthMath";
import { fmtK } from "../../../hooks/useWealthMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = { results: WealthResults };

export function WTWealthHero({ results }: Props) {
  const { t } = useLanguage();
  const { advantage, buyingWins, ownerFinal, renterFinal, milestoneData, invReturn } = results;
  const m30 = milestoneData[30];

  const advPrefix = advantage >= 0 ? "+" : "";
  const advLabel = buyingWins
    ? t("wt.hero.owningWins").replace("{advantage}", fmtK(advantage))
    : t("wt.hero.rentingWins")
        .replace("{advantage}", fmtK(Math.abs(advantage)))
        .replace("{rate}", invReturn.toFixed(1));

  return (
    <div className="rounded-xl px-6 py-8 text-center" style={{ background: "#0B2A4A" }}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: "rgba(255,255,255,0.5)" }}>
        {t("wt.hero.eyebrow")}
      </p>
      <p className="mt-4 font-[Georgia,serif] text-[44px] font-medium leading-none" style={{ color: "#C6A15B" }}>
        {advPrefix}
        {fmtK(advantage)}
      </p>
      <p className="mx-auto mt-3 max-w-2xl text-[13px] leading-snug" style={{ color: "rgba(255,255,255,0.6)" }}>
        {advLabel}
      </p>

      <div className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
        <div className="rounded-lg px-4 py-4 text-left" style={{ background: "rgba(255,255,255,0.07)" }}>
          <p className="text-[10px] uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.45)" }}>
            {t("wt.hero.ownerLabel")}
          </p>
          <p className="mt-2 font-[Georgia,serif] text-[20px]" style={{ color: "#9FE1CB" }}>
            {fmtK(ownerFinal)}
          </p>
          <p className="mt-1 text-[10px]" style={{ color: "rgba(159,225,203,0.6)" }}>
            Home value: {m30 ? fmtK(m30.homeVal) : "—"}
          </p>
        </div>
        <div className="rounded-lg px-4 py-4 text-left" style={{ background: "rgba(255,255,255,0.07)" }}>
          <p className="text-[10px] uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.45)" }}>
            {t("wt.hero.renterLabel")}
          </p>
          <p className="mt-2 font-[Georgia,serif] text-[20px]" style={{ color: "rgba(255,255,255,0.6)" }}>
            {fmtK(renterFinal)}
          </p>
          <p className="mt-1 text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
            {t("wt.hero.renterSub")}
          </p>
        </div>
      </div>
    </div>
  );
}
