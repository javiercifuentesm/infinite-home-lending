import { useLanguage } from "../../../i18n/LanguageContext";

export function ReverseMythBuster() {
  const { t } = useLanguage();
  const MYTHS: { myth: string; fact: string }[] = [
    { myth: t("tool.reverse.myths.1.myth"), fact: t("tool.reverse.myths.1.fact") },
    { myth: t("tool.reverse.myths.2.myth"), fact: t("tool.reverse.myths.2.fact") },
    { myth: t("tool.reverse.myths.3.myth"), fact: t("tool.reverse.myths.3.fact") },
    { myth: t("tool.reverse.myths.4.myth"), fact: t("tool.reverse.myths.4.fact") },
    { myth: t("tool.reverse.myths.5.myth"), fact: t("tool.reverse.myths.5.fact") },
  ];

  return (
    <div>
      <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">{t("tool.reverse.myths.title")}</h3>
      <ul className="mt-5 space-y-5">
        {MYTHS.map((m, i) => (
          <li key={i} className="flex gap-3">
            <span
              className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full"
              style={{ background: "var(--color-background-danger)" }}
              aria-hidden
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#A32D2D" strokeWidth="3">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </span>
            <div>
              <p className="text-[11px] font-medium text-[#A32D2D]">{m.myth}</p>
              <p className="mt-1 text-[12px] leading-[1.4] text-[var(--color-text-primary)]">{m.fact}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
