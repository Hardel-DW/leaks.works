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

export const isSlug = (value: string): value is DocSlug => (SLUGS as string[]).includes(value);
