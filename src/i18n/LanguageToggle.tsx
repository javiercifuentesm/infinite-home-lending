import { ChevronDown } from "lucide-react";
import { useLanguage } from "./LanguageContext";

type LanguageToggleProps = {
  variant?: "default" | "header";
};

export function LanguageToggle({ variant = "default" }: LanguageToggleProps) {
  const { lang, setLang, t } = useLanguage();

  if (variant === "header") {
    return (
      <div className="nav-lang-pill" aria-label="Language">
        <button
          type="button"
          onClick={() => setLang("en")}
          className={`nav-lang-pill__btn ${lang === "en" ? "nav-lang-pill__btn--active" : ""}`}
          aria-pressed={lang === "en"}
        >
          {t("lang.toggle.en")}
        </button>
        <button
          type="button"
          onClick={() => setLang("es")}
          className={`nav-lang-pill__btn ${lang === "es" ? "nav-lang-pill__btn--active" : ""}`}
          aria-pressed={lang === "es"}
        >
          {t("lang.toggle.es")}
        </button>
        <ChevronDown className="nav-lang-pill__chevron h-3 w-3" strokeWidth={2.25} aria-hidden />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "2px",
        background: "rgba(11,42,74,0.06)",
        borderRadius: "9999px",
        padding: "3px",
        fontFamily: "sans-serif",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.08em",
      }}
    >
      <button
        type="button"
        onClick={() => setLang("en")}
        style={{
          padding: "4px 10px",
          borderRadius: "9999px",
          border: "none",
          cursor: "pointer",
          background: lang === "en" ? "#0B2A4A" : "transparent",
          color: lang === "en" ? "#F7F7F5" : "#0B2A4A",
          transition: "all 0.2s",
          fontWeight: 700,
          fontSize: "11px",
          letterSpacing: "0.08em",
        }}
      >
        {t("lang.toggle.en")}
      </button>
      <button
        type="button"
        onClick={() => setLang("es")}
        style={{
          padding: "4px 10px",
          borderRadius: "9999px",
          border: "none",
          cursor: "pointer",
          background: lang === "es" ? "#0B2A4A" : "transparent",
          color: lang === "es" ? "#F7F7F5" : "#0B2A4A",
          transition: "all 0.2s",
          fontWeight: 700,
          fontSize: "11px",
          letterSpacing: "0.08em",
        }}
      >
        {t("lang.toggle.es")}
      </button>
    </div>
  );
}
