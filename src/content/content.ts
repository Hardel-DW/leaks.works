import { defineCollection } from "../lib/content/schema";

export const LOCALES = ["en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

export const NAV = [
    { group: "start", slugs: ["introduction", "vanilla"] },
    { group: "model", slugs: ["regions", "threads", "read-write", "mail-borrow", "players-entities", "saving"] },
    { group: "use", slugs: ["install-config", "leafs-command", "commands-datapacks", "mod-compatibility", "trade-offs", "faq"] },
    { group: "project", slugs: ["methodology", "code-map"] }
] as const;

export type DocGroup = (typeof NAV)[number]["group"];
export type DocSlug = (typeof NAV)[number]["slugs"][number];

export const SLUGS: DocSlug[] = NAV.flatMap((group) => [...group.slugs]);
export const FIRST_SLUG: DocSlug = SLUGS[0];

export const isSlug = (value: string): value is DocSlug => SLUGS.some((slug) => slug === value);

export const collections = {
    docs: defineCollection((front) => ({ title: front.string("title"), lead: front.string("lead") }), SLUGS),
    patchnotes: defineCollection((front) => ({ date: front.string("date"), minecraft: front.string("minecraft") }))
};

export type DocData = ReturnType<typeof collections.docs.schema>;
export type PatchnoteData = ReturnType<typeof collections.patchnotes.schema>;
