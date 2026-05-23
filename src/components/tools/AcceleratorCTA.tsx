import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";

export function AcceleratorCTA() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-[var(--color-border-tertiary)] bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-8">
      <div>
        <p className="text-[14px] font-medium text-[#0B2A4A]">{t("tool.accelerator.cta.title")}</p>
        <p className="mt-1 text-[12px] text-[var(--color-text-tertiary)]">{t("tool.accelerator.cta.sub")}</p>
      </div>
      <Link
        to="/contact"
        className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#C6A15B] px-6 py-3 text-center text-[13px] font-medium text-white transition-colors hover:bg-[#b48e48]"
      >
        {t("tool.accelerator.cta.btn")}
      </Link>
    </div>
  );
}
