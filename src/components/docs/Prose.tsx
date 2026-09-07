import { type BlockToken, type Components, type Directives, render } from "@voxelio/markdown";
import type { ReactNode } from "react";
import RegionGrid from "@/components/demo/RegionGrid";
import ThreadClocks from "@/components/demo/ThreadClocks";
import WorkerPool from "@/components/demo/WorkerPool";
import { Link } from "@/lib/router";
import { cn, slugify } from "@/lib/utils";

function Anchor({ href, children }: { href: string; children: ReactNode }) {
    if (href.startsWith("/")) return <Link to={href}>{children}</Link>;
    return (
        <a href={href} target="_blank" rel="noreferrer">
            {children}
        </a>
    );
}

function Code({ title, code }: { title?: string; code: string }) {
    return (
        <div className="island overflow-hidden">
            {title && <div className="border-b border-line px-4 py-2 font-mono text-xs text-cream-500">{title}</div>}
            <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-cream-200">{code}</pre>
        </div>
    );
}

function Note({ tone, children }: { tone?: string; children?: ReactNode }) {
    return <div className={cn("island border-l-2 px-5 py-4 text-[15px] leading-relaxed", tone === "warn" ? "border-l-honey-400" : "border-l-leaf-500")}>{children}</div>;
}

const components: Components = {
    h2: ({ text, children }) => <h2 id={slugify(text)}>{children}</h2>,
    h3: ({ text, children }) => <h3 id={slugify(text)}>{children}</h3>,
    a: Anchor,
    pre: ({ meta, code }) => <Code title={meta.title} code={code} />,
    table: ({ children }) => (
        <div className="island overflow-x-auto">
            <table>{children}</table>
        </div>
    )
};

const directives: Directives = {
    note: ({ props, children }) => <Note tone={props.tone}>{children}</Note>,
    regions: () => <RegionGrid className="my-8" />,
    clocks: () => <ThreadClocks className="my-8" />,
    pool: () => <WorkerPool className="my-8" />
};

export default function Prose({ blocks }: { blocks: BlockToken[] }) {
    return <div className="prose">{render(blocks, { components, directives })}</div>;
}
