import { useMemo } from "react";
import type { WaitingCalcResult, WaitingInputs } from "../../hooks/useWaitingMath";
import { fmtK } from "../../hooks/useWaitingMath";
import { useLanguage } from "../../i18n/LanguageContext";

type Props = {
  waitMonths: number;
  inputs: WaitingInputs;
  data: WaitingCalcResult;
};

function fillTemplate(template: string, vars: Record<string, string>): string {
  let s = template;
  for (const [k, v] of Object.entries(vars)) {
    s = s.replaceAll(`{${k}}`, v);
  }
  return s;
}

export function WaitingInsight({ waitMonths, inputs, data }: Props) {
  const { t } = useLanguage();
  const m = Math.max(1, Math.floor(waitMonths));
  const appr = inputs.appr;

  const text = useMemo(() => {
    if (m <= 3) {
      return fillTemplate(t("tool.waiting.insight.short"), {
        m: String(m),
        total: fmtK(data.totalCost),
        appr: String(appr),
      });
    }
    if (m <= 12) {
      return fillTemplate(t("tool.waiting.insight.mid"), {
        m: String(m),
        total: fmtK(data.totalCost),
      });
    }
    const waitYrs = (m / 12).toFixed(1).replace(/\.0$/, "");
    return fillTemplate(t("tool.waiting.insight.long"), { years: waitYrs });
  }, [m, appr, data.totalCost, t]);

  return (
    <blockquote
      className="border-l-[3px] border-[#C6A15B] py-[0.9rem] pl-4 pr-4 font-[Georgia,serif] text-[15px] italic leading-relaxed text-[var(--tcw-text-primary,#0B2A4A)]"
      style={{ background: "var(--color-background-secondary)" }}
    >
      {text}
    </blockquote>
  );
}
