import { RATE_TABLE, tierFloorForScore } from "../../../hooks/useCreditMath";
import { useLanguage } from "../../../i18n/LanguageContext";

const TIER_ORDER = [760, 740, 720, 700, 680, 660, 640, 620, 580] as const;

const TIER_COLOR: Record<number, string> = {
  760: "#27500A",
  740: "#3B6D11",
  720: "#639922",
  700: "#C6A15B",
  680: "#BA7517",
  660: "#854F0B",
  640: "#A32D2D",
  620: "#791F1F",
  580: "#501313",
};

const maxRate = RATE_TABLE[580];
const minRate = RATE_TABLE[760];

type Props = { curScore: number; effectiveTgt: number };

function barPct(tierRate: number): string {
  const pct = ((maxRate - tierRate) / (maxRate - minRate)) * 100;
  return `${Math.min(100, Math.max(4, pct))}%`;
}

export function CreditTierTrack({ curScore, effectiveTgt }: Props) {
  const { t } = useLanguage();
  const curFloor = tierFloorForScore(curScore);
  const tgtFloor = tierFloorForScore(effectiveTgt);

  return (
    <div className="rounded-lg border border-[var(--color-border-tertiary,#e2e8f0)] bg-white px-4 py-5 sm:px-6">
      <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">{t("tool.credit.tier.title")}</h3>
      <div className="mt-5 space-y-3">
        {TIER_ORDER.map((tier) => {
          const tierRate = RATE_TABLE[tier];
          const width = barPct(tierRate);
          let indicator = "";
          const isYou = curFloor === tier;
          const isTgt = tgtFloor === tier;
          if (isYou && isTgt) indicator = t("tool.credit.tier.both");
          else if (isYou) indicator = t("tool.credit.tier.you");
          else if (isTgt) indicator = t("tool.credit.tier.tgt");

          return (
            <div key={tier} className="flex items-center gap-3">
              <span className="w-[52px] shrink-0 text-[11px] font-medium text-slate-600">
                {t(`tool.credit.tier.range.${tier}` as never)}
              </span>
              <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full transition-[width] duration-500 ease-out"
                  style={{
                    width,
                    backgroundColor: TIER_COLOR[tier],
                  }}
                />
              </div>
              <span className="w-[56px] shrink-0 text-right text-[11px] font-medium text-[#0B2A4A]">
                {tierRate.toFixed(3)}%
              </span>
              <span className="w-10 shrink-0 text-right text-[10px] font-medium text-[#C6A15B]">{indicator}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
