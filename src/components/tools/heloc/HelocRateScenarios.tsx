import type { HelocResult } from "../../../hooks/useHelocMath";
import { fmt } from "../../../hooks/useHelocMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = {
  results: HelocResult;
};

export function HelocRateScenarios({ results }: Props) {
  const { t } = useLanguage();
  const { scenarios, rate, ioPmt, piPmtVal, rateRiskAmount } = results;
  const tpl = t("tool.heloc.scenarios.drawRepay");
  const lineDown = tpl.replace("{draw}", fmt(scenarios.down.io)).replace("{repay}", fmt(scenarios.down.pi));
  const lineCurrent = tpl.replace("{draw}", fmt(ioPmt)).replace("{repay}", fmt(piPmtVal));
  const lineUp = tpl.replace("{draw}", fmt(scenarios.up.io)).replace("{repay}", fmt(scenarios.up.pi));

  return (
    <div>
      <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">{t("tool.heloc.scenarios.title")}</h3>
      <div className="mt-4 grid grid-cols-1 gap-4 min-[500px]:grid-cols-3">
        <div className="rounded-xl p-5" style={{ background: "var(--color-background-success)" }}>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#3B6D11]">{t("tool.heloc.scenarios.down15")}</p>
          <p className="mt-2 font-[Georgia,serif] text-2xl font-semibold text-[#27500A]">{scenarios.down.rate.toFixed(2)}%</p>
          <p className="mt-2 text-[13px] leading-snug text-[#27500A]">{lineDown}</p>
        </div>
        <div className="rounded-xl border-[0.5px] border-[var(--color-border-tertiary)] bg-white p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-text-tertiary)]">
            {t("tool.heloc.scenarios.current")}
          </p>
          <p className="mt-2 font-[Georgia,serif] text-2xl font-semibold text-[#0B2A4A]">{rate.toFixed(2)}%</p>
          <p className="mt-2 text-[13px] leading-snug text-[var(--color-text-tertiary)]">{lineCurrent}</p>
        </div>
        <div className="rounded-xl p-5" style={{ background: "var(--color-background-warning)" }}>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#854F0B]">{t("tool.heloc.scenarios.up2")}</p>
          <p className="mt-2 font-[Georgia,serif] text-2xl font-semibold text-[#633806]">{scenarios.up.rate.toFixed(2)}%</p>
          <p className="mt-2 text-[13px] leading-snug text-[#633806]">{lineUp}</p>
          {rateRiskAmount > 0 ? (
            <p className="mt-3 text-[11px] font-medium text-[#A32D2D]">
              {t("tool.heloc.scenarios.vsToday").replace("{amt}", fmt(rateRiskAmount))}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
