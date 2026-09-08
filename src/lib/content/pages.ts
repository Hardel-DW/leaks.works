import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { parseFrontmatter } from "@voxelio/markdown";
import type { Plugin } from "vite";
import { collections, type DocData, FIRST_SLUG, SLUGS } from "../../content/content";
import { HEAD_LOCALE, HEADS, type Head } from "../../content/heads";
import { Frontmatter } from "./schema";

type Page = { path: string; head: Head };

const MARKER = "<!--pages-->";
const IMAGE = { file: "og.png", width: 1200, height: 630 };

const attr = (value: string) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function readDoc(root: string, slug: string): DocData {
    const file = `docs/${HEAD_LOCALE}/${slug}.md`;
    const { data } = parseFrontmatter(readFileSync(join(root, "src/content", file), "utf8"));
    return collections.docs.schema(new Frontmatter(file, data));
}

function pagesOf(root: string): Page[] {
    const docs = Object.fromEntries(SLUGS.map((slug) => [slug, HEADS.doc(readDoc(root, slug))]));
    return [
        { path: "/", head: HEADS.home },
        { path: "/docs", head: docs[FIRST_SLUG] },
        ...SLUGS.map((slug) => ({ path: `/docs/${slug}`, head: docs[slug] })),
        { path: "/patchnote", head: HEADS.patchnote }
    ];
}

function meta(site: string, { path, head }: Page): string {
    const url = `${site}${path}`;
    return [
        `<title>${attr(head.title)}</title>`,
        `<meta name="description" content="${attr(head.description)}" />`,
        `<link rel="canonical" href="${url}" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:url" content="${url}" />`,
        `<meta property="og:title" content="${attr(head.title)}" />`,
        `<meta property="og:description" content="${attr(head.description)}" />`,
        `<meta property="og:image" content="${site}/${IMAGE.file}" />`,
        `<meta property="og:image:width" content="${IMAGE.width}" />`,
        `<meta property="og:image:height" content="${IMAGE.height}" />`,
        `<meta name="twitter:card" content="summary_large_image" />`
    ].join("\n    ");
}

// After the build, one HTML per page with its own head, so crawlers read the page they were given.
export function pages({ site }: { site: string }): Plugin {
    let root = "";
    let outDir = "";
    return {
        name: "leafs:pages",
        apply: "build",
        configResolved(config) {
            root = config.root;
            outDir = join(config.root, config.build.outDir);
        },
        closeBundle() {
            const template = readFileSync(join(outDir, "index.html"), "utf8");
            for (const page of pagesOf(root)) {
                const file = join(outDir, page.path, "index.html");
                mkdirSync(dirname(file), { recursive: true });
                writeFileSync(file, template.replace(MARKER, meta(site, page)));
            }
        }
    };
}
