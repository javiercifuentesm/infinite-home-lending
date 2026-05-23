import type { ReactNode } from "react";
import type { WaitingCalcResult, WaitingInputs } from "../../hooks/useWaitingMath";
import { fmt, fmtK } from "../../hooks/useWaitingMath";
import { useLanguage } from "../../i18n/LanguageContext";

type Props = {
  inputs: WaitingInputs;
  data: WaitingCalcResult;
};

export function WaitingReframe({ inputs, data }: Props) {
  const { t } = useLanguage();
  const dpPct = inputs.dp / 100;
  const downNow = inputs.hp * dpPct;
  const downThen = data.futurePrice * dpPct;

  const rows: { label: string; now: ReactNode; then: ReactNode }[] = [
    {
      label: t("tool.waiting.reframe.homePrice"),
      now: <span className="text-emerald-700">{fmt(inputs.hp)}</span>,
      then: <span className="text-[#A32D2D]">{fmt(data.futurePrice)}</span>,
    },
    {
      label: t("tool.waiting.reframe.downPayment"),
      now: <span className="text-emerald-700">{fmt(downNow)}</span>,
      then: <span className="text-[#A32D2D]">{fmt(downThen)}</span>,
    },
    {
      label: t("tool.waiting.reframe.monthlyPayment"),
      now: <span className="text-emerald-700">{fmt(data.pmtNow)}</span>,
      then: <span className="text-[#A32D2D]">{fmt(data.pmtThen)}</span>,
    },
    {
      label: t("tool.waiting.reframe.monthlyDiff"),
      now: <span className="text-[var(--tcw-text-muted,#64748b)]">—</span>,
      then: (
        <span className="text-[#A32D2D]">
          {fmt(data.monthlyPmtIncrease)}
          {t("tool.waiting.reframe.moMore")}
        </span>
      ),
    },
    {
      label: t("tool.waiting.reframe.lifetimeImpact"),
      now: <span className="text-[var(--tcw-text-muted,#64748b)]">—</span>,
      then: (
        <span className="text-[#A32D2D]">
          {fmtK(data.lifetimePmtImpact)} {t("tool.waiting.reframe.moreTotal")}
        </span>
      ),
    },
    {
      label: t("tool.waiting.reframe.equity"),
      now: (
        <span className="text-emerald-700">
          {fmt(data.appreciationMissed)} {t("tool.waiting.reframe.earned")}
        </span>
      ),
      then: <span className="text-[#A32D2D]">{t("tool.waiting.reframe.renting")}</span>,
    },
  ];

  return (
    <div
      className="rounded-xl border border-[var(--tcw-border,#e2e8f0)] p-5 sm:p-6"
      style={{ background: "rgba(11,42,74,0.04)" }}
    >
      <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">{t("tool.waiting.reframe.title")}</h3>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse text-left text-[14px]">
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.label}
                className={i < rows.length - 1 ? "border-b border-[var(--color-border-tertiary)]" : ""}
                style={i < rows.length - 1 ? { borderBottomWidth: "0.5px" } : undefined}
              >
                <th className="py-3 pr-3 font-normal text-[var(--tcw-text-primary,#0B2A4A)]">{row.label}</th>
                <td className="py-3 px-2 text-right font-medium">{row.now}</td>
                <td className="py-3 px-2 text-center text-[11px] text-[var(--tcw-text-muted,#64748b)]">
                  {t("tool.waiting.reframe.vs")}
                </td>
                <td className="py-3 pl-2 text-right font-medium">{row.then}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
