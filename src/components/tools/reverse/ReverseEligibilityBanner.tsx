import type { ReverseInputs, ReverseResult } from "../../../hooks/useReverseMath";
import { fmt } from "../../../hooks/useReverseMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = {
  inputs: ReverseInputs;
  results: ReverseResult;
};

export function ReverseEligibilityBanner({ inputs, results }: Props) {
  const { t } = useLanguage();
  const { eligible, grossPL, netPL, closingCosts, mipUpfront, effectiveAge } = results;
  const { age, homeVal, mortBal, intRate, coAge } = inputs;
  const rolled = closingCosts + mipUpfront;

  if (eligible) {
    const mbExtra = mortBal > 0 ? t("tool.reverse.elig.mbExtra").replace("{mb}", fmt(mortBal)) : "";
    const coExtra = coAge != null ? t("tool.reverse.elig.coExtra").replace("{co}", String(coAge)) : "";
    const body = t("tool.reverse.elig.eligibleBody")
      .replace("{age}", String(age))
      .replace("{hv}", fmt(homeVal))
      .replace("{rate}", intRate.toFixed(2))
      .replace("{net}", fmt(netPL))
      .replace("{mbExtra}", mbExtra)
      .replace("{coExtra}", coExtra)
      .replace("{rolled}", fmt(rolled));

    return (
      <div
        className="rounded-xl border-l-4 p-5 sm:p-6"
        style={{
          background: "var(--color-background-success)",
          borderColor: "#3B6D11",
        }}
      >
        <p className="font-[Georgia,serif] text-[15px] font-medium leading-snug" style={{ color: "#27500A" }}>
          {t("tool.reverse.elig.eligibleTitle").replace("{pl}", fmt(grossPL))}
        </p>
        <p className="mt-2 text-[13px] leading-[1.55]" style={{ color: "#3B6D11" }}>
          {body}
        </p>
      </div>
    );
  }

  let body: string;
  if (age < 62) {
    body = t("tool.reverse.elig.age62");
  } else if (coAge != null && coAge > 0 && coAge < 62) {
    body = t("tool.reverse.elig.coUnder62");
  } else if (mortBal >= grossPL * 0.6) {
    body = t("tool.reverse.elig.mbHigh");
  } else {
    body = t("tool.reverse.elig.generic");
  }

  return (
    <div
      className="rounded-xl border-l-4 p-5 sm:p-6"
      style={{
        background: "var(--color-background-danger)",
        borderColor: "#A32D2D",
      }}
    >
      <p className="font-[Georgia,serif] text-[15px] font-medium leading-snug" style={{ color: "#791F1F" }}>
        {t("tool.reverse.elig.concernTitle")}
      </p>
      <p className="mt-2 text-[13px] leading-[1.55]" style={{ color: "#A32D2D" }}>
        {body}
      </p>
      <p className="mt-2 text-[12px] text-[#791F1F]/90">{t("tool.reverse.elig.effectiveAge").replace("{age}", String(effectiveAge))}</p>
    </div>
  );
}
