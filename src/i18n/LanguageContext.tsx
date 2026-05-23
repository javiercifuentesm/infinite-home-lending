import { createContext, useContext, useState, type ReactNode } from "react";
import { en } from "./en";
import { es } from "./es";

type Language = "en" | "es";

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    const stored = localStorage.getItem("ihl_lang");
    return stored === "es" || stored === "en" ? stored : "en";
  });

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem("ihl_lang", l);
  };

  const t = (key: string): string => {
    const dict = lang === "es" ? es : en;
    return (dict as Record<string, string>)[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
