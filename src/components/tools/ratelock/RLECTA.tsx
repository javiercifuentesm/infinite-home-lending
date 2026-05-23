import { Link } from "react-router-dom";
import type { RLEResults } from "../../../hooks/useRLEMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = { results: RLEResults };

export function RLECTA({ results }: Props) {
  const { t } = useLanguage();
  const { daysToClose } = results;
  const heading =
    daysToClose <= 15
      ? t("tool.rle.cta.headingUrgent").replace("{days}", String(daysToClose))
      : t("tool.rle.cta.headingNormal");

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-slate-200/90 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0 flex-1">
        <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">{heading}</h3>
        <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{t("tool.rle.cta.sub")}</p>
      </div>
      <Link
        to="/contact?topic=rate-lock-engine"
        className="inline-flex shrink-0 items-center justify-center rounded-md bg-[#C6A15B] px-6 py-3 text-[14px] font-semibold text-[#0B2A4A] transition-colors hover:bg-[#b48e48]"
      >
        {t("tool.rle.cta.btn")}
      </Link>
    </div>
  );
}
