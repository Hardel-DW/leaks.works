import type { DocData, Locale, PatchnoteData } from "@/content/content";
import { type Entry, locate } from "@/lib/content/schema";

export type Release = Entry<PatchnoteData> & { version: string };

const docFiles = import.meta.glob<Entry<DocData>>("/src/content/docs/*/*.md", { eager: true, import: "default" });
const patchnoteFiles = import.meta.glob<Entry<PatchnoteData>>("/src/content/patchnotes/*/*.md", { eager: true, import: "default" });

const localized = <T>(make: (locale: Locale) => T): Record<Locale, T> => ({ en: make("en"), fr: make("fr") });

function bySlug<Data>(files: Record<string, Entry<Data>>, locale: Locale): Record<string, Entry<Data>> {
    const entries = Object.entries(files).map(([path, entry]) => ({ ...locate(path), entry }));
    return Object.fromEntries(entries.filter((entry) => entry.locale === locale).map((entry) => [entry.slug, entry.entry]));
}

const newestFirst = (a: Release, b: Release) => b.version.localeCompare(a.version, undefined, { numeric: true });

const docs = localized((locale) => bySlug(docFiles, locale));
const patchnotes = localized((locale) =>
    Object.entries(bySlug(patchnoteFiles, locale))
        .map(([version, entry]) => ({ version, ...entry }))
        .toSorted(newestFirst)
);

export const docsFor = (locale: Locale) => docs[locale];
export const patchnotesFor = (locale: Locale) => patchnotes[locale];
