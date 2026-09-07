import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { parseFrontmatter, tokenize } from "@voxelio/markdown";
import { normalizePath, type Plugin } from "vite";
import { collections, LOCALES } from "../../content/content";
import { type Collection, Frontmatter, locate } from "./schema";

const registry: Record<string, Collection<unknown>> = collections;

const slugsIn = (dir: string): string =>
    readdirSync(dir)
        .map((file) => locate(`${dir}/${file}`).slug)
        .toSorted()
        .join(", ");

function checkCollection(root: string, name: string, collection: Collection<unknown>) {
    const expected = collection.slugs?.toSorted().join(", ") ?? slugsIn(`${root}/${name}/${LOCALES[0]}`);
    for (const locale of LOCALES) {
        const found = slugsIn(`${root}/${name}/${locale}`);
        if (found !== expected) throw new Error(`${name}/${locale}: expected [${expected}], found [${found}]`);
    }
}

function compile(id: string, markdown: string): string {
    const { collection, locale, slug } = locate(id);
    const file = `${collection}/${locale}/${slug}.md`;
    const { data, body } = parseFrontmatter(markdown);
    const entry = { data: registry[collection].schema(new Frontmatter(file, data)), blocks: tokenize(body) };
    return `export default ${JSON.stringify(entry)};`;
}

export function content(): Plugin {
    let root = "";
    return {
        name: "leafs:content",
        configResolved(config) {
            root = normalizePath(resolve(config.root, "src/content"));
        },
        buildStart() {
            for (const [name, collection] of Object.entries(registry)) checkCollection(root, name, collection);
        },
        transform(code, id) {
            if (!id.startsWith(`${root}/`) || !id.endsWith(".md")) return null;
            return { code: compile(id, code), map: null };
        }
    };
}
