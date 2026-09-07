import type { BlockToken } from "@voxelio/markdown";

export class Frontmatter {
    constructor(
        private readonly file: string,
        private readonly data: Record<string, string>
    ) {}

    string(key: string): string {
        const value = this.data[key];
        if (value === undefined) throw new Error(`${this.file}: missing "${key}" in frontmatter`);
        return value;
    }
}

export type Entry<Data> = { data: Data; blocks: BlockToken[] };
export type Collection<Data> = { schema: (front: Frontmatter) => Data; slugs?: readonly string[] };
export type Location = { collection: string; locale: string; slug: string };

export const defineCollection = <Data>(schema: (front: Frontmatter) => Data, slugs?: readonly string[]): Collection<Data> => ({ schema, slugs });

export function locate(path: string): Location {
    const [collection, locale, file] = path.split("/").slice(-3);
    return { collection, locale, slug: file.slice(0, -".md".length) };
}
