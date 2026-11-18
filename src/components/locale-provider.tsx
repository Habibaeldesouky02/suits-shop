"use client";

import { createContext, useContext } from "react";
import type { Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/dictionaries";

const LocaleContext = createContext<Locale>("en");

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

/** Current locale and its translations, for client components. */
export function useI18n(): { locale: Locale; t: Dictionary } {
  const locale = useContext(LocaleContext);
  return { locale, t: getDictionary(locale) };
}
