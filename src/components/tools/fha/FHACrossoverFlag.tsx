import { useLanguage } from "../../../i18n/LanguageContext";

type Props = {
  crossoverYear: number | null;
};

export function FHACrossoverFlag({ crossoverYear }: Props) {
  const { t } = useLanguage();
  if (crossoverYear === null || crossoverYear > 30) return null;

  return (
    <div
      className="mb-3 flex items-start gap-2 rounded-[var(--border-radius-md,8px)] border border-[rgba(198,161,91,0.4)] px-3 py-2.5 sm:px-4"
      style={{ background: "rgba(198,161,91,0.12)" }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-[#854F0B]" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
        <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
      <p className="text-[12px] leading-snug text-[#854F0B]">
        {t("tool.fha.crossoverFlagPre")}{" "}
        <b>
          {t("tool.fha.crossoverFlagYear")} {crossoverYear}
        </b>{" "}
        {t("tool.fha.crossoverFlagPost")}
      </p>
    </div>
  );
}
