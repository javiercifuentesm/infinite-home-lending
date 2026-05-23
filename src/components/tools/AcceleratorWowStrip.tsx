import { fmtK } from "../../hooks/useAcceleratorMath";
import { useLanguage } from "../../i18n/LanguageContext";

type Props = {
  yearsSaved: number;
  moSaved: number;
  intSaved: number;
  accelPayoff: number;
  paidYrs: number;
};

export function AcceleratorWowStrip({ yearsSaved, moSaved, intSaved, accelPayoff, paidYrs }: Props) {
  const { t } = useLanguage();
  const valueMain = moSaved > 0 ? `${yearsSaved}.${moSaved}` : `${yearsSaved}`;
  const subLine =
    moSaved > 0
      ? `${yearsSaved} ${t("tool.accelerator.wow.yrs")} ${moSaved} ${t("tool.accelerator.wow.moSooner")}`
      : t("tool.accelerator.wow.yearsOff");

  return (
    <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-3">
      <div className="rounded-xl bg-[#0B2A4A] px-4 py-5 text-center min-[480px]:text-left dark:ring-1 dark:ring-white/10">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[rgba(255,255,255,0.6)] dark:text-white/60">
          {t("tool.accelerator.wow.yearsSaved")}
        </p>
        <p className="mt-1 font-[Georgia,serif] text-2xl font-bold text-white">{valueMain}</p>
        <p className="mt-1 text-[11px] text-[rgba(255,255,255,0.5)] dark:text-white/50">{subLine}</p>
      </div>
      <div
        className="rounded-xl border px-4 py-5 text-center min-[480px]:text-left"
        style={{ background: "rgba(198,161,91,0.12)", borderColor: "rgba(198,161,91,0.3)" }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#854F0B]">{t("tool.accelerator.wow.intSaved")}</p>
        <p className="mt-1 font-[Georgia,serif] text-2xl font-bold text-[#0B2A4A]">{fmtK(intSaved)}</p>
        <p className="mt-1 text-[11px] text-[#C6A15B]">{t("tool.accelerator.wow.intAvoided")}</p>
      </div>
      <div className="rounded-xl px-4 py-5 text-center min-[480px]:text-left" style={{ background: "var(--color-background-success)" }}>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#3B6D11]">{t("tool.accelerator.wow.newPayoff")}</p>
        <p className="mt-1 font-[Georgia,serif] text-2xl font-bold text-[#27500A]">
          {accelPayoff} {t("tool.accelerator.wow.yrs")}
        </p>
        <p className="mt-1 text-[11px] text-[#3B6D11]">
          {t("tool.accelerator.wow.fromToday")}
          {paidYrs > 0 ? ` (${paidYrs} ${t("tool.accelerator.wow.alreadyPaid")})` : ""}
        </p>
      </div>
    </div>
  );
}
