import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Locale } from "@/content/content";

const browserLocale = (): Locale => (navigator.language.toLowerCase().startsWith("fr") ? "fr" : "en");

type LocaleState = { locale: Locale; setLocale: (locale: Locale) => void };

export const useLocaleStore = create<LocaleState>()(persist((set) => ({ locale: browserLocale(), setLocale: (locale) => set({ locale }) }), { name: "leafs:locale" }));

const applyLang = (locale: Locale) => {
    document.documentElement.lang = locale;
};

applyLang(useLocaleStore.getState().locale);
useLocaleStore.subscribe((state) => applyLang(state.locale));

export const useLocale = () => useLocaleStore((state) => state.locale);
