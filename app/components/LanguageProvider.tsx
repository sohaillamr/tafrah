"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Language = "ar" | "en";

type LanguageContextValue = {
  language: Language;
  setLanguage: (value: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children,
  initialLanguage = "ar",
}: {
  children: React.ReactNode;
  initialLanguage?: Language;
}) {
  const [language, setLanguage] = useState<Language>(initialLanguage);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Apply changes instantly to DOM (eliminating CLS, matching server HTML output)
    document.documentElement.lang = language === "ar" ? "ar" : "en";
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    
    // Store preference purely in cookies for Next.js to read instantly
    document.cookie = `tafrah_lang=${language}; path=/; max-age=31536000`;
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
