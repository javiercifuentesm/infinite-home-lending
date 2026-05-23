import { useLanguage } from "../../../i18n/LanguageContext";

export type UseCaseKey = "reno" | "debt" | "edu" | "emergency" | "invest" | "other";

type Props = {
  activeUse: UseCaseKey;
  onChange: (k: UseCaseKey) => void;
};

export function HelocUseCaseSelector({ activeUse, onChange }: Props) {
  const { t } = useLanguage();
  const OPTIONS: { key: UseCaseKey; label: string }[] = [
    { key: "reno", label: t("tool.heloc.useCase.reno") },
    { key: "debt", label: t("tool.heloc.useCase.debt") },
    { key: "edu", label: t("tool.heloc.useCase.edu") },
    { key: "emergency", label: t("tool.heloc.useCase.emergency") },
    { key: "invest", label: t("tool.heloc.useCase.invest") },
    { key: "other", label: t("tool.heloc.useCase.other") },
  ];

  return (
    <div className="rounded-xl border border-[var(--color-border-tertiary)] bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#854F0B]" style={{ background: "#FAEEDA" }} aria-hidden>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4l3 2" strokeLinecap="round" />
          </svg>
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-text-tertiary)]">{t("tool.heloc.useCase.eyebrow")}</p>
          <h2 className="font-[Georgia,serif] text-lg font-semibold text-[#0B2A4A]">{t("tool.heloc.useCase.heading")}</h2>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((o) => {
          const active = activeUse === o.key;
          return (
            <button
              key={o.key}
              type="button"
              onClick={() => onChange(o.key)}
              className={`min-h-[44px] rounded-full border px-4 py-2.5 text-[13px] font-semibold transition-colors md:min-h-0 ${
                active
                  ? "border-[#0B2A4A] bg-[#0B2A4A] text-white"
                  : "border-[var(--color-border-tertiary)] bg-[var(--color-background-secondary)] text-[var(--color-text-tertiary)] hover:border-[#0B2A4A]/30"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
