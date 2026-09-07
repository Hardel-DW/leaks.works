export type DemoId = "regions" | "clocks" | "pool";

export type Block =
    | { h2: string }
    | { h3: string }
    | { p: string }
    | { ul: string[] }
    | { ol: string[] }
    | { note: string; tone?: "info" | "warn" }
    | { code: string; title?: string }
    | { table: { head: string[]; rows: string[][] } }
    | { demo: DemoId };

export type DocPage = { title: string; lead: string; blocks: Block[] };

export const slugify = (value: string) =>
    value
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
