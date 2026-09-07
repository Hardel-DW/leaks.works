import RegionGrid from "@/components/demo/RegionGrid";
import ThreadTimeline from "@/components/demo/ThreadTimeline";
import WorkerPool from "@/components/demo/WorkerPool";
import Inline from "@/components/docs/Inline";
import { type Block, type DemoId, slugify } from "@/content/docs/types";
import { cn } from "@/lib/utils";

function Demo({ id }: { id: DemoId }) {
    if (id === "regions") return <RegionGrid className="my-8" />;
    if (id === "clocks") return <ThreadTimeline className="my-8" />;
    return <WorkerPool className="my-8" />;
}

function Code({ code, title }: { code: string; title?: string }) {
    return (
        <div className="island overflow-hidden">
            {title && <div className="border-b border-line px-4 py-2 font-mono text-xs text-cream-500">{title}</div>}
            <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-cream-200">{code}</pre>
        </div>
    );
}

function Note({ text, tone }: { text: string; tone?: "info" | "warn" }) {
    return (
        <div className={cn("island border-l-2 px-5 py-4 text-[15px] leading-relaxed", tone === "warn" ? "border-l-honey-400" : "border-l-leaf-500")}>
            <Inline text={text} />
        </div>
    );
}

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
    return (
        <div className="island overflow-x-auto">
            <table>
                <thead>
                    <tr>
                        {head.map((cell) => (
                            <th key={cell}>{cell}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row[0]}>
                            {row.map((cell, column) => (
                                <td key={head[column]}>
                                    <Inline text={cell} />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function BlockView({ block }: { block: Block }) {
    if ("h2" in block) return <h2 id={slugify(block.h2)}>{block.h2}</h2>;
    if ("h3" in block) return <h3 id={slugify(block.h3)}>{block.h3}</h3>;
    if ("p" in block) {
        return (
            <p>
                <Inline text={block.p} />
            </p>
        );
    }
    if ("ul" in block) {
        return (
            <ul>
                {block.ul.map((item) => (
                    <li key={item}>
                        <Inline text={item} />
                    </li>
                ))}
            </ul>
        );
    }
    if ("ol" in block) {
        return (
            <ol>
                {block.ol.map((item) => (
                    <li key={item}>
                        <Inline text={item} />
                    </li>
                ))}
            </ol>
        );
    }
    if ("note" in block) return <Note text={block.note} tone={block.tone} />;
    if ("code" in block) return <Code code={block.code} title={block.title} />;
    if ("table" in block) return <Table head={block.table.head} rows={block.table.rows} />;
    return <Demo id={block.demo} />;
}

export default function Prose({ blocks }: { blocks: Block[] }) {
    return (
        <div className="prose">
            {blocks.map((block) => (
                <BlockView key={JSON.stringify(block)} block={block} />
            ))}
        </div>
    );
}
