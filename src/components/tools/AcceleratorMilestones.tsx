import {
  buildSchedule,
  fmt,
  monthlyExtra,
  type PaymentFreq,
  type ScheduleResult,
} from "../../hooks/useAcceleratorMath";
import { useLanguage } from "../../i18n/LanguageContext";

type Props = {
  monthsSaved: number;
  yearsSaved: number;
  moSaved: number;
  intSaved: number;
  effectiveReturn: number;
  basePayoff: number;
  accelPayoff: number;
  base: ScheduleResult;
  accel: ScheduleResult;
  principal: number;
  rate: number;
  termMonths: number;
  extraAmt: number;
  freq: PaymentFreq;
};

export function AcceleratorMilestones({
  monthsSaved,
  yearsSaved,
  moSaved,
  intSaved,
  effectiveReturn,
  basePayoff,
  accelPayoff,
  base,
  accel,
  principal,
  rate,
  termMonths,
  extraAmt,
  freq,
}: Props) {
  const { t } = useLanguage();
  const items: { title: string; sub: string }[] = [];

  if (monthsSaved >= 12) {
    const yearWord = yearsSaved === 1 ? t("tool.accelerator.milestones.year") : t("tool.accelerator.milestones.years");
    const timeTitle =
      moSaved > 0
        ? `${yearsSaved} ${yearWord} ${t("tool.accelerator.milestones.and")} ${moSaved} ${t("tool.accelerator.milestones.monthsOff")}`
        : `${yearsSaved} ${yearWord} ${t("tool.accelerator.milestones.off")}`;
    items.push({
      title: timeTitle,
      sub: t("tool.accelerator.milestones.ownSub").replace("{accel}", String(accelPayoff)).replace("{base}", String(basePayoff)),
    });
  }

  if (intSaved >= 5000) {
    items.push({
      title: `${fmt(intSaved)} ${t("tool.accelerator.milestones.intKeep")}`,
      sub: t("tool.accelerator.milestones.intSub"),
    });
  }

  if (effectiveReturn > 0) {
    const returnLabel = t("tool.accelerator.milestones.returnLabel");
    items.push({
      title: t("tool.accelerator.milestones.returnTitle")
        .replace("{pct}", effectiveReturn.toFixed(1))
        .replace("{returnLabel}", returnLabel),
      sub: t("tool.accelerator.milestones.returnSub"),
    });
  }

  if (freq === "monthly" && extraAmt >= 100) {
    const halfMo = monthlyExtra(Math.round(extraAmt / 2), "monthly");
    const halfSched = buildSchedule(principal, rate, termMonths, halfMo, 0);
    const halfSaved = base.months - halfSched.months;
    if (halfSaved > 0) {
      const halfYrs = Math.floor(halfSaved / 12);
      items.push({
        title: t("tool.accelerator.milestones.halfTitle")
          .replace("{amount}", fmt(Math.round(extraAmt / 2)))
          .replace("{perMo}", t("tool.accelerator.milestones.slashPerMo"))
          .replace("{n}", String(halfYrs))
          .replace("{years}", t("tool.accelerator.milestones.years")),
        sub: t("tool.accelerator.milestones.halfSub"),
      });
    }
  }

  if (accel.months < base.months && freq !== "onetime") {
    items.push({
      title: t("tool.accelerator.milestones.equityTitle"),
      sub: t("tool.accelerator.milestones.equitySub"),
    });
  }

  return (
    <div className="rounded-xl border border-[var(--color-border-tertiary)] bg-white p-5 sm:p-6">
      <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">{t("tool.accelerator.milestones.title")}</h3>
      <ul className="mt-4 space-y-4">
        {items.map((it) => (
          <li key={it.title} className="flex gap-3">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#C6A15B]" aria-hidden />
            <div>
              <p className="font-semibold text-[#0B2A4A]">{it.title}</p>
              <p className="mt-1 text-[14px] leading-relaxed text-[var(--color-text-tertiary)]">{it.sub}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
