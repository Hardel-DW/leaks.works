import { en } from "@/lib/i18n/en";
import { fr } from "@/lib/i18n/fr";
import { type Locale, useLocale } from "@/lib/store/locale";

export type Text = typeof fr;

const texts: Record<Locale, Text> = { fr, en };

export const useText = (): Text => texts[useLocale()];
