import { en } from "@/content/docs/en";
import { fr } from "@/content/docs/fr";
import type { DocSlug } from "@/content/docs/nav";
import type { DocPage } from "@/content/docs/types";
import type { Locale } from "@/lib/store/locale";

const docs: Record<Locale, Record<DocSlug, DocPage>> = { fr, en };

export const docsFor = (locale: Locale) => docs[locale];
