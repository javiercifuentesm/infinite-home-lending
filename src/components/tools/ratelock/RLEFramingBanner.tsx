import { useLanguage } from "../../../i18n/LanguageContext";

export function RLEFramingBanner() {
  const { t } = useLanguage();

  return (
    <div
      className="flex gap-3 rounded-lg border-[0.5px] px-4 py-[0.65rem]"
      style={{
        background: "rgba(198,161,91,0.1)",
        borderColor: "rgba(198,161,91,0.3)",
      }}
      role="status"
    >
      <svg
        className="mt-0.5 h-4 w-4 shrink-0 text-amber-800"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
      </svg>
      <p className="text-[12px] leading-[1.5]" style={{ color: "#633806" }}>
        <strong>{t("tool.rle.framing.strong")}</strong> {t("tool.rle.framing.body")}
      </p>
    </div>
  );
}
